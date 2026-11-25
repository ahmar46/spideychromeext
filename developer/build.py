"""Build Chrome runtime and the supplied-reference comic reminder edition."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from xml.etree import ElementTree as ET
import html
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent
EXT = ROOT / 'extension'
OUT = ROOT.parent / 'chrome-deliverables'
OUT.mkdir(exist_ok=True)
STORE = ROOT / 'store'

def tree(node):
    return {'tag': node.tag.rsplit('}', 1)[-1], 'attrs': node.attrib, 'children': [tree(child) for child in node]}

art = tree(ET.fromstring((EXT/'hero.svg').read_text()))
art_data = 'data:image/svg+xml;base64,' + __import__('base64').b64encode((EXT/'hero.svg').read_bytes()).decode()
content = (ROOT / 'content.template.js').read_text().replace('__BUDDY_CSS__', json.dumps((ROOT / 'content.css').read_text())).replace('__BUDDY_ART__', json.dumps(art))
(EXT / 'content.js').write_text(content)
shutil.copyfile(ROOT / 'LICENSE', EXT / 'LICENSE')

def face(im, box):
    """Neutral comic speech mark for toolbar icons and promotional material."""
    d = ImageDraw.Draw(im)
    x, y, w, h = box
    def rect(values, radius, fill, outline=None, width=1):
        d.rounded_rectangle(tuple(round(v) for v in values), radius=round(radius), fill=fill, outline=outline, width=round(width))
    d.polygon([(x+w*.58,y+h*.65),(x+w*.9,y+h*1.14),(x+w*.79,y+h*.65)],fill='#fffdf4')
    rect((x,y,x+w,y+h*.84),w*.25,'#fffdf4','#15121b',w*.02)
    rect((x+w*.44,y+h*.16,x+w*.56,y+h*.48),w*.05,'#e63d50')
    d.ellipse((x+w*.44,y+h*.57,x+w*.56,y+h*.71),fill='#e63d50')

for size in (16, 32, 48, 128):
    S = 4
    im = Image.new('RGBA',(size*S,size*S),(0,0,0,0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0,0,size*S-1,size*S-1),radius=size*S*.24,fill='#242331')
    face(im,(size*S*.19,size*S*.26,size*S*.62,size*S*.48))
    im.resize((size,size),Image.Resampling.LANCZOS).save(EXT / f'icons/icon{size}.png')
shutil.copyfile(EXT / 'icons/icon128.png', STORE / 'icon128.png')

font_dir = Path('/usr/share/fonts/truetype/dejavu')
def font(size, bold=False):
    return ImageFont.truetype(str(font_dir / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')),size)

S=3
promo=Image.new('RGB',(440*S,280*S),'#17191f')
d=ImageDraw.Draw(promo)
d.rounded_rectangle((270*S,-35*S,480*S,300*S),radius=80*S,fill='#2d293d')
for x,y in [(294,44),(404,205),(371,31)]:
    d.text((x*S,y*S),'✦',font=font(16*S),fill='#f3b99b')
face(promo,(298*S,99*S,100*S,80*S))
d.text((27*S,28*S),'web buddy',font=font(22*S,True),fill='#ff958e')
d.text((27*S,88*S),'A little hero.',font=font(26*S,True),fill='#f3edf5')
d.text((27*S,123*S),'A healthier you.',font=font(25*S,True),fill='#f3edf5')
d.text((28*S,180*S),'Water. Eyes. Stretch.',font=font(12*S),fill='#b8adca')
d.text((28*S,231*S),'SMALL BREAKS. BIG IDEAS.',font=font(8*S),fill='#b1dbc5')
promo.resize((440,280),Image.Resampling.LANCZOS).save(STORE / 'promo440x280.png')

# Self-contained interactive preview. It runs the real UI against an explicitly
# simulated in-memory adapter, not Chrome permissions, alarms or durable storage.
core=(EXT/'core.mjs').read_text().replace('export ', '')
adapter='''
let previewState = initial(Date.now());
const previewListeners = new Set();
const previewChrome = {
 runtime: { id: 'offline-preview', onMessage:{addListener(){},removeListener(){}}, async sendMessage(action) {
  const before = JSON.stringify(previewState);
  if (action.type === 'LAUNCH') {
    if (previewState.active?.demo) apply(previewState, {type:'SNOOZE',id:previewState.active.id}, Date.now());
    if (!previewState.active) apply(previewState, {type:'DEMO',kind:action.kind}, Date.now());
  } else apply(previewState, action, Date.now());
  const after = JSON.stringify(previewState);
  if (before !== after) queueMicrotask(() => { for (const f of previewListeners) f({webBuddyState:{newValue:previewState}},'local'); });
  return {ok:true,displayed:true,closePopup:false,state:structuredClone({...previewState,now:Date.now(),next:next(previewState,Date.now())})};
 } },
 storage: {onChanged:{addListener:f=>previewListeners.add(f),removeListener:f=>previewListeners.delete(f)}},
 tabs: {query:async()=>[{url:'https://example.com',id:1}]}
};
window.__webBuddyPreview = previewChrome;
const chrome = previewChrome;
setInterval(()=>previewChrome.runtime.sendMessage({type:'GET'}),1000);
'''
popup=(EXT/'popup.html').read_text().replace('<link rel="stylesheet" href="popup.css">','<style>'+(EXT/'popup.css').read_text()+'</style>')
popup=popup.replace('src="hero.svg"','src="'+art_data+'"')
popup=popup.replace('<script src="popup.js"></script>','<script>const chrome=window.parent.__webBuddyPreview;'+(EXT/'popup.js').read_text()+'</script>')
popup=popup.replace('href="privacy.html"','href="#"').replace('Getting your buddy ready…','Interactive preview')
preview='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Web Buddy — Interactive Chrome concept</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f0e9;color:#27242f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.bar{height:42px;background:#e5e0db;border-bottom:1px solid #d5cfd0;display:flex;gap:8px;align-items:center;padding:0 18px}.bar i{height:9px;width:9px;background:#e3958d;border-radius:50%}.bar i:nth-child(2){background:#d9b277}.bar i:nth-child(3){background:#9db5a0}.address{margin-left:20px;color:#877d82;background:#f4f0e9;font-size:11px;border-radius:6px;padding:7px 20px;max-width:430px;flex:1}.layout{display:grid;grid-template-columns:minmax(420px,1fr) 380px;min-height:calc(100vh - 42px)}.page{padding:55px 7vw}.wordmark{font-weight:750;font-size:19px;letter-spacing:-.7px}.tag{font:9px monospace;letter-spacing:2px;color:#927481;margin-top:95px}.page h1{font-size:clamp(42px,5vw,72px);line-height:1.05;letter-spacing:-3px;font-weight:600;margin:20px 0 27px;max-width:650px}.page h1 em{font-style:normal;color:#a4778e}.page p{font-size:15px;line-height:1.8;color:#817580;max-width:420px}.sample{margin-top:40px;border:1px solid #d8cdd1;background:#eee6e8;border-radius:13px;padding:25px;color:#7b6375;font:12px/1.9 monospace;max-width:480px}.preview-note{margin-top:40px;font:10px/1.8 monospace;color:#9c8790;max-width:450px}.panel{background:#17191f;border-left:1px solid #33333d;display:flex;flex-direction:column}.panel-label{font:9px monospace;letter-spacing:1px;padding:14px 20px;color:#a59db4;border-bottom:1px solid #33333d}.panel iframe{border:0;width:100%;height:calc(100vh - 84px);min-height:760px;background:#17191f}.page .feature{display:flex;gap:20px;margin-top:35px;font:10px monospace;color:#9b818e}@media(max-width:850px){.layout{grid-template-columns:1fr}.page{padding:36px 25px}.tag{margin-top:40px}.panel{width:100%;align-items:center}.panel-label{width:100%}.panel iframe{width:360px;height:900px;min-height:0}.page h1{font-size:45px;letter-spacing:-2px}.sample{display:none}}
</style></head><body><div class="bar"><i></i><i></i><i></i><span class="address">example.com / your-next-big-idea</span></div><div class="layout"><main class="page"><span class="wordmark">a little room.</span><div class="tag">MEET YOUR NEW BROWSING SIDEKICK</div><h1>Big ideas.<br>Small breaks.<br><em>A buddy for both.</em></h1><p>Your next great thing needs a cared-for human. Web Buddy keeps an eye on the little things while you get on with the big ones.</p><div class="sample">const betterDay = {<br>&nbsp; water: 'a few sips',<br>&nbsp; eyes: 'a little skyline time',<br>&nbsp; stretch: 'room to breathe'<br>};</div><div class="feature"><span>LOCAL BY DESIGN</span><span>GENTLE BY DEFAULT</span></div><p class="preview-note">INTERACTIVE PREVIEW · Try Water, Eyes, or Stretch in the dark panel. State is simulated in memory; refresh resets it. Chrome permissions, storage and background scheduling need the installed extension.</p></main><aside class="panel"><div class="panel-label">WEB BUDDY / TOOLBAR POPUP PREVIEW</div><iframe title="Interactive Web Buddy popup" srcdoc="__POPUP__"></iframe></aside></div><script>__CORE__\n__ADAPTER__\n__CONTENT__</script></body></html>'''
preview=preview.replace('__POPUP__',html.escape(popup,quote=True)).replace('__CORE__',core).replace('__ADAPTER__',adapter).replace('__CONTENT__',content.replace('window.top !== window || ', '').replace('location.hostname', "'example.com'"))
(ROOT/'preview.html').write_text(preview)

store_zip=OUT/'Web_Buddy_Spidey_Store_1.2.1.zip'
with zipfile.ZipFile(store_zip,'w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(EXT.rglob('*')):
        if p.is_file(): z.write(p,p.relative_to(EXT).as_posix())
release_zip=OUT/'Web_Buddy_Spidey_1.2.1.zip'
with zipfile.ZipFile(release_zip,'w',zipfile.ZIP_DEFLATED) as z:
    # The extracted release is directly loadable: manifest.json is at its root.
    for p in sorted(EXT.rglob('*')):
        if p.is_file(): z.write(p,p.relative_to(EXT).as_posix())
    for p in sorted(ROOT.rglob('*')):
        if p.is_file() and '__pycache__' not in p.parts:
            if p.name in ['README.md','PUBLISH.md','START_HERE.txt','preview.html','VALIDATION.md'] and p.parent == ROOT: z.write(p,p.name)
            z.write(p,'developer/'+p.relative_to(ROOT).as_posix())
    z.write(store_zip,store_zip.name)
print(json.dumps({'release':str(release_zip),'upload_zip':str(store_zip),'preview':str(ROOT/'preview.html')}))
