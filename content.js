/* Bundled vector character and isolated interface; no remote assets or code. */
(() => {
  'use strict';
  if (window.top !== window || document.getElementById('web-buddy-extension-root')) return;
  const STYLE = ":host{all:initial!important}*{box-sizing:border-box}button{font:inherit;cursor:pointer}button:disabled{cursor:default;opacity:.6}button:focus-visible{outline:3px solid #1686d8;outline-offset:4px}[hidden]{display:none!important}.dock{position:fixed;right:24px;top:0;width:156px;height:294px;pointer-events:none;color:#16151c;color-scheme:light;text-align:left;direction:ltr;font:13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.fall{position:relative;width:100%;height:100%;transform-origin:50% 0}.thread{position:absolute;top:-100vh;left:78px;width:1.5px;height:calc(100vh + 124px);background:#eee8dc;box-shadow:1px 0 #26212e88;pointer-events:none}.swing{position:absolute;left:0;top:56px;width:156px;height:210px;transform-origin:50% 0;animation:spidey-sway 5.6s ease-in-out infinite}.hero-button{display:block;width:100%;height:100%;padding:0;border:0;background:transparent;pointer-events:auto;filter:drop-shadow(1px 3px 2px #15132026)}.hero-button svg{display:block;width:100%;height:100%;overflow:visible}.spidey-wave{transform-box:view-box;transform-origin:209px 301px;animation:spidey-wave 4.6s ease-in-out infinite}.spidey-head{transform-box:view-box;transform-origin:160px 333px;animation:spidey-look 5s ease-in-out infinite}.spidey-torso{transform-box:view-box;transform-origin:160px 250px;animation:spidey-breathe 3.5s ease-in-out infinite}.spidey-eyes{transform-box:fill-box;transform-origin:center;animation:spidey-blink 7s ease-in-out infinite}.leaving .spidey-grip{transform-box:view-box;transform-origin:127px 290px;animation:spidey-pull .28s ease-in-out infinite alternate}.leaving .spidey-wave{animation:spidey-reach .3s ease-in-out infinite alternate}.leaving .swing{animation:none}.tools{position:absolute;right:13px;top:274px;display:flex;gap:5px;pointer-events:auto;opacity:0;transition:opacity .15s}.dock:hover .tools,.dock:focus-within .tools{opacity:1}.tools button{font-size:9px;border:1px solid #15151c;border-radius:16px;background:#fffdf6;color:#1e1b24;padding:4px 9px;white-space:nowrap;box-shadow:1px 2px 0 #15151c33}.card{position:absolute;right:172px;top:151px;width:278px;max-width:calc(100vw - 30px);min-height:202px;padding:30px 28px 28px;pointer-events:auto;border:0;background:transparent;isolation:isolate;color:#19151e;animation:cloud-pop .28s cubic-bezier(.2,.8,.2,1.3) both}.cloud-shape{position:absolute;inset:0;width:100%;height:100%;z-index:-1;overflow:visible;pointer-events:none;filter:drop-shadow(3px 4px 0 #19152120)}.card-top{display:flex;align-items:center;justify-content:space-between;gap:5px}.kicker{font:700 6px ui-monospace,Consolas,monospace;letter-spacing:.5px;color:#c93349;text-transform:uppercase}.close{background:transparent;border:0;color:#5d4a56;padding:0 1px;font-size:18px;line-height:1}.card h2{font-family:'Arial Black','Trebuchet MS',sans-serif;font-size:26px;font-style:italic;font-weight:950;line-height:1.02;letter-spacing:-.9px;margin:9px 0;color:#1c1721;text-transform:uppercase}.card p{font-size:10px;font-weight:550;line-height:1.4;color:#695b67;margin:0 0 12px}.actions{display:flex;gap:6px}.actions button{border:1.5px solid #211925;border-radius:6px;padding:7px 8px;font-size:9px;font-weight:750;line-height:1.2;white-space:normal;box-shadow:1px 2px 0 #21192522}.primary{background:#e63d50;color:#fff;flex:1}.secondary{background:#f7e9bb;color:#36232c}.actions button:hover:not(:disabled){filter:brightness(1.08)}.counter{font-size:30px;font-weight:750;color:#287eb2;margin:0 0 9px;font-variant-numeric:tabular-nums}.error{font-size:10px;color:#be233e;margin-top:8px}.dock.left{right:auto;left:24px}.dock.left .card{right:auto;left:172px}.dock.left .cloud-shape{transform:scaleX(-1)}.dock.bottom{top:auto;bottom:24px}.dock.bottom .card{top:auto;bottom:36px}.dock.small{width:120px;height:232px}.dock.small .swing{width:120px;height:161px;top:45px}.dock.small .thread{left:60px;height:calc(100vh + 97px)}.dock.small .tools{top:212px;right:-1px}.dock.small .card{right:136px;top:100px}.dock.small.left .card{right:auto;left:136px}.dock.small.bottom .card{top:auto;bottom:25px}.dock.large{width:200px;height:356px}.dock.large .swing{width:200px;height:269px;top:60px}.dock.large .thread{left:100px;height:calc(100vh + 146px)}.dock.large .tools{top:336px;right:29px}.dock.large .card{right:216px;top:195px}.dock.large.left .card{right:auto;left:216px}.dock.large.bottom .card{top:auto;bottom:45px}.dock.reduced *,.dock.paused *{animation:none!important;transition:none!important}@keyframes spidey-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}@keyframes spidey-wave{0%,30%,100%{transform:rotate(0)}45%,65%{transform:rotate(-9deg)}55%,75%{transform:rotate(4deg)}}@keyframes spidey-look{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(3deg)}}@keyframes spidey-breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.012)}}@keyframes spidey-blink{0%,42%,46%,100%{transform:scaleY(1)}44%{transform:scaleY(.15)}}@keyframes spidey-pull{from{transform:rotate(-2deg)}to{transform:rotate(5deg)}}@keyframes spidey-reach{from{transform:rotate(-4deg)}to{transform:rotate(-18deg)}}@keyframes cloud-pop{from{opacity:0;transform:scale(.65) rotate(-5deg)}to{opacity:1;transform:scale(1) rotate(0)}}@media(max-width:560px){.dock .card,.dock.small .card,.dock.large .card{position:fixed;left:15px;right:auto;top:auto;bottom:22px;max-width:calc(100vw - 30px)}.dock.left .card,.dock.small.left .card,.dock.large.left .card{left:15px;right:auto}.dock.bottom .card,.dock.small.bottom .card,.dock.large.bottom .card{top:22px;bottom:auto}.tools{opacity:1}.card{padding:30px 28px}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\n";
  const ART = {"tag": "svg", "attrs": {"viewBox": "0 0 320 430", "role": "img", "aria-label": "Spidey hanging upside down from a web"}, "children": [{"tag": "defs", "attrs": {}, "children": [{"tag": "linearGradient", "attrs": {"id": "s-red", "x2": "1", "y2": "1"}, "children": [{"tag": "stop", "attrs": {"stop-color": "#ff5b54"}, "children": []}, {"tag": "stop", "attrs": {"offset": ".52", "stop-color": "#ec3344"}, "children": []}, {"tag": "stop", "attrs": {"offset": "1", "stop-color": "#b51e39"}, "children": []}]}, {"tag": "linearGradient", "attrs": {"id": "s-blue", "x2": "1", "y2": "1"}, "children": [{"tag": "stop", "attrs": {"stop-color": "#308bd2"}, "children": []}, {"tag": "stop", "attrs": {"offset": ".55", "stop-color": "#1869b0"}, "children": []}, {"tag": "stop", "attrs": {"offset": "1", "stop-color": "#134276"}, "children": []}]}, {"tag": "pattern", "attrs": {"id": "s-web", "width": "36", "height": "36", "patternUnits": "userSpaceOnUse"}, "children": [{"tag": "path", "attrs": {"d": "M0 0 36 36M36 0 0 36M0 18Q18 30 36 18M18 0Q30 18 18 36", "fill": "none", "stroke": "#6e1e32", "stroke-width": "1.2", "opacity": ".7"}, "children": []}]}, {"tag": "clipPath", "attrs": {"id": "s-chest"}, "children": [{"tag": "path", "attrs": {"d": "M112 198Q160 183 208 198L216 276Q231 302 204 319Q160 337 116 319Q89 302 104 276Z"}, "children": []}]}, {"tag": "clipPath", "attrs": {"id": "s-mask"}, "children": [{"tag": "path", "attrs": {"d": "M135 333Q160 321 185 333Q204 350 199 380Q196 410 160 418Q124 410 121 380Q116 350 135 333Z"}, "children": []}]}]}, {"tag": "g", "attrs": {"fill": "none", "stroke": "#231e30", "stroke-width": "3.2", "stroke-linejoin": "round", "stroke-linecap": "round"}, "children": [{"tag": "g", "attrs": {"class": "spidey-legs"}, "children": [{"tag": "path", "attrs": {"d": "M139 201C109 193 37 193 18 168C1 146 34 120 68 97L119 51L146 72L91 132L74 148L137 156Z", "fill": "url(#s-blue)"}, "children": []}, {"tag": "path", "attrs": {"d": "M181 201C211 193 283 193 302 168C319 146 286 120 252 97L201 51L174 72L229 132L246 148L183 156Z", "fill": "url(#s-blue)"}, "children": []}, {"tag": "path", "attrs": {"d": "M63 104L111 62L132 17Q141 2 152 16L156 74L131 99L91 134Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "path", "attrs": {"d": "M257 104L209 62L188 17Q179 2 168 16L164 74L189 99L229 134Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "path", "attrs": {"d": "M63 104L111 62L132 17Q141 2 152 16L156 74L131 99L91 134Z", "fill": "url(#s-web)", "stroke": "none"}, "children": []}, {"tag": "path", "attrs": {"d": "M257 104L209 62L188 17Q179 2 168 16L164 74L189 99L229 134Z", "fill": "url(#s-web)", "stroke": "none"}, "children": []}, {"tag": "path", "attrs": {"d": "M30 155Q41 164 76 164M290 155Q279 164 244 164", "stroke": "#70b7e5", "opacity": ".5"}, "children": []}, {"tag": "path", "attrs": {"d": "M123 59 143 70M177 70 197 59", "stroke": "#8b2137", "stroke-width": "2"}, "children": []}]}, {"tag": "g", "attrs": {"class": "spidey-torso"}, "children": [{"tag": "path", "attrs": {"d": "M112 198Q160 183 208 198L216 276Q231 302 204 319Q160 337 116 319Q89 302 104 276Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "g", "attrs": {"clip-path": "url(#s-chest)"}, "children": [{"tag": "path", "attrs": {"d": "M107 207Q136 216 125 260Q115 297 121 321L100 310L98 207ZM213 207Q184 216 195 260Q205 297 199 321L220 310L222 207Z", "fill": "url(#s-blue)", "stroke-width": "2"}, "children": []}, {"tag": "path", "attrs": {"d": "M160 187V330M138 191Q150 254 137 325M182 191Q170 254 183 325M122 207Q160 223 198 207M127 229Q160 243 193 229M127 252Q160 266 193 252M123 277Q160 291 197 277M120 301Q160 316 200 301", "stroke": "#8e2039", "stroke-width": "1.5"}, "children": []}]}, {"tag": "g", "attrs": {"stroke": "#271b2c", "stroke-width": "3"}, "children": [{"tag": "path", "attrs": {"d": "m154 272-11-9m11 15-14-2m15 8-16 8m18-3-9 13m18-30 11-9m-11 15 14-2m-15 8 16 8m-18-3 9 13"}, "children": []}, {"tag": "ellipse", "attrs": {"cx": "160", "cy": "282", "rx": "4", "ry": "10", "fill": "#271b2c"}, "children": []}, {"tag": "circle", "attrs": {"cx": "160", "cy": "270", "r": "3", "fill": "#271b2c"}, "children": []}]}, {"tag": "path", "attrs": {"d": "M136 318L139 338L181 338L184 318", "fill": "url(#s-red)"}, "children": []}]}, {"tag": "g", "attrs": {"class": "spidey-grip"}, "children": [{"tag": "path", "attrs": {"d": "M113 300Q86 281 98 244L123 174L143 180L128 250L136 292Q132 308 113 300Z", "fill": "url(#s-blue)"}, "children": []}, {"tag": "path", "attrs": {"d": "M103 260L114 198L128 151L148 158L137 213L126 266Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "path", "attrs": {"d": "M103 260L114 198L128 151L148 158L137 213L126 266Z", "fill": "url(#s-web)", "stroke": "none"}, "children": []}, {"tag": "path", "attrs": {"d": "M128 155L129 136L145 126Q156 119 162 126L173 133Q179 143 170 149L154 157L147 168Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "path", "attrs": {"d": "m143 134 15 5 14-4m-28 10 12 4 14-5m-26 10 12 3", "stroke": "#8d233a", "stroke-width": "1.7"}, "children": []}]}, {"tag": "g", "attrs": {"class": "spidey-wave"}, "children": [{"tag": "path", "attrs": {"d": "M209 301Q218 277 247 265Q258 260 268 274L282 303L262 313L247 294L232 318Q214 325 209 301Z", "fill": "url(#s-blue)"}, "children": []}, {"tag": "path", "attrs": {"d": "M267 292L283 299L275 332L261 340L252 330Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "path", "attrs": {"d": "M267 292L283 299L275 332L261 340L252 330Z", "fill": "url(#s-web)", "stroke": "none"}, "children": []}, {"tag": "path", "attrs": {"d": "M257 331Q249 332 245 343L232 345Q225 351 233 354L247 353L246 370Q248 378 252 371L256 356L260 378Q264 385 266 377L264 354L272 373Q278 378 278 370L271 351L282 360Q289 363 287 356L274 341L275 332", "fill": "url(#s-red)"}, "children": []}, {"tag": "path", "attrs": {"d": "m252 342 17 1m-15-8 15 2m-12 14 12-1", "stroke": "#8b2236", "stroke-width": "1.5"}, "children": []}]}, {"tag": "g", "attrs": {"class": "spidey-head"}, "children": [{"tag": "path", "attrs": {"d": "M135 333Q160 321 185 333Q204 350 199 380Q196 410 160 418Q124 410 121 380Q116 350 135 333Z", "fill": "url(#s-red)"}, "children": []}, {"tag": "g", "attrs": {"clip-path": "url(#s-mask)", "stroke": "#842139", "stroke-width": "1.5"}, "children": [{"tag": "path", "attrs": {"d": "M160 325V420m0-48-40-28m40 28 40-28m-40 28-40 17m40-17 40 17m-40-17-25 42m25-42 25 42M120 345Q160 367 201 345M118 365Q160 391 202 365M120 389Q160 414 200 389"}, "children": []}]}, {"tag": "g", "attrs": {"class": "spidey-eyes", "stroke-width": "4", "fill": "#fffaf3"}, "children": [{"tag": "path", "attrs": {"d": "M132 350Q147 348 153 367Q140 383 129 382Q125 365 132 350Z"}, "children": []}, {"tag": "path", "attrs": {"d": "M188 350Q173 348 167 367Q180 383 191 382Q195 365 188 350Z"}, "children": []}]}, {"tag": "path", "attrs": {"d": "M133 342Q144 331 153 332", "stroke": "#ff9b85", "stroke-width": "2.5"}, "children": []}]}]}]};
  const COPY = {
    water: { title: 'DRINK YOUR WATER!', copy: 'A few sips, then back to saving the day.', button: 'I drank water ✓' },
    eyes: { title: 'REST YOUR EYES!', copy: 'Look into the distance for 20 seconds.', button: 'Start 20-second break' },
    stretch: { title: 'TIME TO STRETCH!', copy: 'Stand up. Roll your shoulders. Even heroes need a break.', button: 'Stretched ✓' }
  };
  function el(tag, props = {}, children = []) {
    const n = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) { if (key === 'text') n.textContent = value; else n.setAttribute(key, value); }
    n.append(...children); return n;
  }
  function vector(tree) {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tree.tag);
    for (const [key, value] of Object.entries(tree.attrs)) n.setAttribute(key, value);
    for (const child of tree.children) n.append(vector(child));
    return n;
  }
  const host = el('div', { id: 'web-buddy-extension-root' });
  for (const [key, value] of Object.entries({ all: 'initial', position: 'fixed', top: '0', left: '0', width: '0', height: '0', margin: '0', padding: '0', border: '0', 'z-index': '2147483646', 'pointer-events': 'none', display: 'block', overflow: 'visible', transform: 'none', opacity: '1', visibility: 'visible' })) host.style.setProperty(key, value, 'important');
  const root = host.attachShadow({ mode: 'closed' });
  const sheet = new CSSStyleSheet(); sheet.replaceSync(STYLE); root.adoptedStyleSheets = [sheet];
  const close = el('button', { class: 'close', type: 'button', 'aria-label': 'Snooze and send Spidey back up', text: '×' });
  const kicker = el('span', { class: 'kicker', text: 'YOUR FRIENDLY NEIGHBORHOOD' });
  const title = el('h2', { text: 'HEY, FRIEND!' });
  const copy = el('p');
  const counter = el('div', { class: 'counter', hidden: '' });
  const done = el('button', { class: 'primary', type: 'button', text: 'Pause reminders' });
  const snooze = el('button', { class: 'secondary', type: 'button', text: 'Hide buddy' });
  const error = el('div', { class: 'error', role: 'status', hidden: '' });
  const cloud = vector({ tag: 'svg', attrs: { class: 'cloud-shape', viewBox: '0 0 320 230', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, children: [
    { tag: 'path', attrs: { d: 'M47 33C29 13 4 36 20 60C-1 73 2 99 23 106C1 127 14 153 39 152C36 176 63 192 85 177C102 201 131 191 143 180C160 203 189 192 202 181C223 198 249 179 248 165C278 177 301 153 286 133C310 128 315 101 294 87C312 65 288 41 268 49C270 22 237 12 221 33C209 6 176 9 164 30C143 7 114 13 105 34C87 12 59 16 47 33Z', fill: '#fffdf4', stroke: '#1e1924', 'stroke-width': '3' }, children: [] },
    { tag: 'path', attrs: { d: 'M259 156Q280 176 307 181Q279 183 253 173', fill: '#fffdf4', stroke: '#1e1924', 'stroke-width': '3', 'stroke-linejoin': 'round' }, children: [] }
  ] });
  const card = el('section', { class: 'card', 'aria-label': 'Spidey comic reminder', 'aria-live': 'polite', hidden: '' }, [cloud, el('div', { class: 'card-top' }, [kicker, close]), title, copy, counter, el('div', { class: 'actions' }, [done, snooze]), error]);
  const hero = el('button', { class: 'hero-button', type: 'button', 'aria-label': 'Open Spidey reminder controls', title: 'Your friendly neighborhood reminder' }, [vector(ART)]);
  const hide = el('button', { type: 'button', text: 'Hide', title: 'Send Spidey back up' });
  const mute = el('button', { type: 'button', text: 'Mute site', title: 'Disable Spidey on this website' });
  const swing = el('div', { class: 'swing' }, [hero]);
  const fall = el('div', { class: 'fall' }, [el('div', { class: 'thread' }), swing, el('div', { class: 'tools' }, [hide, mute])]);
  const dock = el('div', { class: 'dock', hidden: '' }, [fall, card]);
  root.append(dock); document.documentElement.append(host);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let state, phase = 'hidden', shownId = null, controls = false, hiddenIdle = false;
  let asking = false, disposed = false, tickTimer, revealTimer, retreatTimer, motionAnimation;
  function noMotion() { return state?.settings.reducedMotion || reducedMotion.matches; }
  function classes() {
    if (!state) return;
    dock.className = ['dock', phase, state.settings.position.includes('left') ? 'left' : '', state.settings.position.includes('bottom') ? 'bottom' : '', state.settings.size, noMotion() ? 'reduced' : '', state.pausedAt !== null ? 'paused' : ''].join(' ');
    dock.setAttribute('data-phase', phase);
  }
  function cancelTimers() { clearTimeout(revealTimer); clearTimeout(retreatTimer); }
  function cancelAnimation() { if (motionAnimation) { motionAnimation.cancel(); motionAnimation = null; } }
  function finishExit() {
    if (phase !== 'leaving') return;
    cancelAnimation(); phase = 'hidden'; shownId = null; controls = false; hiddenIdle = true;
    dock.hidden = true; card.hidden = true; classes();
  }
  function leave() {
    if (phase === 'leaving' || phase === 'hidden') return;
    cancelTimers(); cancelAnimation(); phase = 'leaving'; card.hidden = true; classes();
    if (noMotion() || typeof fall.animate !== 'function' || document.visibilityState === 'hidden') { finishExit(); return; }
    const distance = Math.max(480, window.innerHeight + 350);
    motionAnimation = fall.animate([
      { transform: 'translateY(0) rotate(0)', offset: 0 },
      { transform: 'translateY(9px) rotate(-3deg)', offset: .14 },
      { transform: `translateY(-${distance}px) rotate(2deg)`, offset: 1 }
    ], { duration: 950, easing: 'cubic-bezier(.65,0,.78,.4)', fill: 'forwards' });
    const animation = motionAnimation;
    animation.finished.then(() => { if (!disposed && motionAnimation === animation) finishExit(); }).catch(() => {});
  }
  function scheduleRetreat(delay = 14000) {
    clearTimeout(retreatTimer);
    const id = shownId;
    retreatTimer = setTimeout(() => {
      if (disposed || id !== shownId || state?.active?.id !== id || document.visibilityState === 'hidden') return;
      // Unanswered nudges are postponed; they never become completed breaks.
      void request({ type: 'SNOOZE', id });
    }, delay);
  }
  function arrive() {
    cancelTimers(); cancelAnimation(); shownId = state.active.id; hiddenIdle = false; controls = false;
    phase = 'entering'; card.hidden = true; dock.hidden = false; classes();
    const reveal = () => {
      if (disposed || !state?.active || state.active.id !== shownId || phase !== 'entering') return;
      phase = 'hanging'; card.hidden = false; classes();
    };
    if (noMotion() || typeof fall.animate !== 'function') reveal();
    else {
      const distance = Math.max(480, window.innerHeight + 350);
      motionAnimation = fall.animate([
        { transform: `translateY(-${distance}px) rotate(-8deg)`, offset: 0 },
        { transform: 'translateY(18px) rotate(3deg)', offset: .72 },
        { transform: 'translateY(-8px) rotate(-2deg)', offset: .88 },
        { transform: 'translateY(0) rotate(0)', offset: 1 }
      ], { duration: 1200, easing: 'cubic-bezier(.22,.65,.3,1)' });
      motionAnimation.finished.catch(() => {});
      revealTimer = setTimeout(reveal, 1250);
    }
    scheduleRetreat();
  }
  function teardown() {
    disposed = true; clearInterval(tickTimer); cancelTimers(); cancelAnimation();
    reducedMotion.removeEventListener('change', onMotion); chrome.storage.onChanged.removeListener(onStorage);
    document.removeEventListener('visibilitychange', refresh); host.remove();
    chrome.runtime.onMessage.removeListener(onRuntimeMessage);
  }
  async function request(action = { type: 'GET' }) {
    if (disposed) return;
    try {
      const response = await chrome.runtime.sendMessage(action);
      if (!response?.ok) throw Error(response?.error || 'Could not save that change. Try again.');
      error.hidden = true; render(response.state);
    } catch (e) {
      if (!chrome.runtime?.id || /context invalidated/i.test(e.message)) { teardown(); return; }
      error.textContent = e.message; error.hidden = false;
    }
  }
  function render(s) {
    state = s;
    if (s.settings.disabledSites.includes(location.hostname) || document.visibilityState === 'hidden') {
      cancelTimers(); cancelAnimation(); phase = 'hidden'; shownId = null; dock.hidden = true; card.hidden = true; classes(); return;
    }
    if (s.active) {
      const c = COPY[s.active.kind];
      kicker.textContent = s.active.demo ? 'TEST REMINDER' : 'YOUR FRIENDLY NEIGHBORHOOD';
      title.textContent = c.title; copy.textContent = c.copy;
      done.textContent = s.active.breakEnds ? 'Taking a breather…' : c.button;
      done.disabled = !!s.active.breakEnds;
      snooze.textContent = s.active.demo ? 'Dismiss' : '5 min';
      if (s.active.id !== shownId || phase === 'hidden') arrive();
      if (s.active.breakEnds) scheduleRetreat(Math.max(1500, s.active.breakEnds - Date.now() + 1500));
    } else if (shownId !== null && phase !== 'hidden') {
      leave();
    } else {
      const idle = s.settings.mode === 'always' && !hiddenIdle;
      dock.hidden = !idle;
      phase = idle ? 'idle' : 'hidden';
      card.hidden = !idle || !controls;
      kicker.textContent = 'YOUR FRIENDLY NEIGHBORHOOD'; title.textContent = 'HEY, FRIEND!';
      copy.textContent = s.pausedAt !== null ? 'Reminders are paused. You set the pace.' : 'Open the toolbar popup to set your rhythm.';
      done.textContent = s.pausedAt !== null ? 'Resume reminders' : 'Pause reminders'; done.disabled = false;
      snooze.textContent = 'Hide';
    }
    if (s.active && phase !== 'leaving') dock.hidden = false;
    if (noMotion() && phase === 'leaving') finishExit();
    else if (noMotion() && phase === 'entering') { cancelAnimation(); clearTimeout(revealTimer); phase = 'hanging'; card.hidden = false; }
    counter.hidden = !s.active?.breakEnds; classes(); paintTime();
  }
  function paintTime() {
    if (!state?.active?.breakEnds || disposed || document.visibilityState === 'hidden') return;
    const seconds = Math.max(0, Math.ceil((state.active.breakEnds - Date.now()) / 1000));
    counter.textContent = seconds + 's';
    if (!seconds && !asking) { asking = true; request().finally(() => { asking = false; }); }
  }
  function dismiss() { if (state?.active) void request({ type: 'SNOOZE', id: state.active.id }); else { controls = false; hiddenIdle = true; leave(); } }
  close.addEventListener('click', dismiss);
  hero.addEventListener('click', () => { controls = !controls; if (!state?.active && state) render(state); });
  done.addEventListener('click', () => { if (state?.active) void request({ type: state.active.kind === 'eyes' ? 'START_BREAK' : 'DONE', id: state.active.id }); else void request({ type: 'PAUSE' }); });
  snooze.addEventListener('click', dismiss); hide.addEventListener('click', dismiss);
  mute.addEventListener('click', () => request({ type: 'SITE', hostname: location.hostname, disabled: true }));
  root.addEventListener('keydown', e => { if (e.key === 'Escape' && !card.hidden) dismiss(); });
  function refresh() { if (document.visibilityState !== 'hidden') void request(); else if (state) render(state); }
  function onMotion() { if (state) render(state); }
  function onStorage(changes, area) { if (area === 'local' && changes.webBuddyState) refresh(); }
  function onRuntimeMessage(message, sender, respond) {
    if (sender.id !== chrome.runtime.id || disposed) return false;
    if (message?.type === 'WEB_BUDDY_DISPOSE') { respond({ ok: true }); teardown(); return false; }
    if (message?.type === 'WEB_BUDDY_PING') { respond({ ok: host.isConnected, version: '1.2.1' }); return false; }
    if (message?.type === 'WEB_BUDDY_SHOW' && message.state?.active) {
      cancelTimers(); cancelAnimation(); shownId = null; phase = 'hidden'; hiddenIdle = false;
      render(message.state);
      respond({ ok: true, displayed: !dock.hidden && host.isConnected });
    }
    return false;
  }
  chrome.runtime.onMessage.addListener(onRuntimeMessage);
  chrome.storage.onChanged.addListener(onStorage); document.addEventListener('visibilitychange', refresh);
  reducedMotion.addEventListener('change', onMotion); tickTimer = setInterval(paintTime, 500); refresh();
})();
