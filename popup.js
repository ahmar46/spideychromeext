'use strict';
const $ = id => document.getElementById(id);
const KINDS = ['water', 'eyes', 'stretch'];
const COPY = {
  water: { title: 'DRINK YOUR WATER!', copy: 'A few sips, then back to saving the day.', button: 'I drank water ✓', next: 'A moment for water' },
  eyes: { title: 'REST YOUR EYES!', copy: 'Look into the distance for 20 seconds. Spidey has your back.', button: 'Start 20-second break', next: 'Rest your eyes' },
  stretch: { title: 'TIME TO STRETCH!', copy: 'Stand up. Roll your shoulders. Even heroes need a break.', button: 'Stretched ✓', next: 'Time to loosen up' }
};
let state, hostname = null, timer, refreshPending = false, launching = false;
async function request(action = { type: 'GET' }) {
  try {
    const response = await chrome.runtime.sendMessage(action);
    if (!response?.ok) throw new Error(response?.error || 'Could not reach Web Buddy. Reopen the popup and try again.');
    $('error').hidden = true;
    render(response.state);
    return true;
  } catch (error) { $('error').textContent = error.message; $('error').hidden = false; return false; }
}
function render(s) {
  state = s;
  document.body.classList.toggle('paused', s.pausedAt !== null);
  $('pause').textContent = s.pausedAt !== null ? 'Resume' : 'Pause';
  $('status-text').textContent = s.pausedAt !== null ? 'Taking a little pause. You set the pace.' : s.active ? 'Your buddy has a little nudge for you.' : 'Your buddy is looking out for you.';
  for (const k of KINDS) {
    $(k + '-count').textContent = s.stats[k];
    // A clock update must never overwrite a number the user is currently typing.
    if (document.activeElement !== $(k + '-minutes')) $(k + '-minutes').value = s.settings.intervals[k];
    $(k + '-enabled').checked = s.settings.enabled[k];
  }
  for (const key of ['position', 'size', 'mode']) $(key).value = s.settings[key];
  $('reducedMotion').checked = s.settings.reducedMotion;
  $('restore-sites').hidden = s.settings.disabledSites.length === 0;
  $('site-enabled').disabled = !hostname;
  $('site-enabled').checked = !!hostname && !s.settings.disabledSites.includes(hostname);
  $('active-card').hidden = !s.active;
  $('next-card').hidden = !!s.active;
  if (s.next) { $('next-title').textContent = COPY[s.next.kind].next; $('next-time').textContent = Math.ceil(s.next.remaining / 60000); }
  else { $('next-title').textContent = 'No reminders enabled'; $('next-time').textContent = '—'; }
  if (s.active) {
    const c = COPY[s.active.kind];
    $('active-kicker').textContent = s.active.demo ? 'TEST REMINDER · NO COUNTS ADDED' : 'A FRIENDLY NUDGE';
    $('active-title').textContent = c.title; $('active-copy').textContent = c.copy;
    $('done').textContent = s.active.breakEnds ? 'Taking a breather…' : c.button;
    $('done').disabled = !!s.active.breakEnds;
    $('snooze').textContent = s.active.demo ? 'Dismiss test' : 'In 5 min';
  }
  $('countdown').hidden = !s.active?.breakEnds;
  document.querySelectorAll('[data-demo]').forEach(b => { b.disabled = launching; });
  paintTime();
}
function paintTime() {
  if (state?.active?.breakEnds) {
    const remaining = Math.max(0, Math.ceil((state.active.breakEnds - Date.now()) / 1000));
    $('countdown').textContent = remaining + 's';
    if (!remaining && !refreshPending) { refreshPending = true; request().finally(() => { refreshPending = false; }); }
  }
  if (state?.next && state.pausedAt === null) $('next-time').textContent = Math.ceil(Math.max(0, state.next.remaining - (Date.now() - state.now)) / 60000);
}
$('pause').addEventListener('click', () => request({ type: 'PAUSE' }));
for (const k of KINDS) {
  $(k + '-minutes').addEventListener('change', async e => {
    const value = Number(e.target.value);
    if (!Number.isInteger(value) || value < 1 || value > 240) { e.target.setCustomValidity('Choose a whole number from 1 to 240.'); e.target.reportValidity(); return; }
    e.target.setCustomValidity('');
    await request({ type: 'SETTINGS', patch: { intervals: { [k]: value } } });
  });
  $(k + '-minutes').addEventListener('input', e => e.target.setCustomValidity(''));
  $(k + '-enabled').addEventListener('change', e => request({ type: 'SETTINGS', patch: { enabled: { [k]: e.target.checked } } }));
}
for (const key of ['position', 'size', 'mode']) $(key).addEventListener('change', e => request({ type: 'SETTINGS', patch: { [key]: e.target.value } }));
$('reducedMotion').addEventListener('change', e => request({ type: 'SETTINGS', patch: { reducedMotion: e.target.checked } }));
$('site-enabled').addEventListener('change', e => { if (hostname) request({ type: 'SITE', hostname, disabled: !e.target.checked }); });
$('restore-sites').addEventListener('click', async () => {
  const sites = [...(state?.settings.disabledSites || [])];
  for (const site of sites) await request({ type: 'SITE', hostname: site, disabled: false });
});
$('done').addEventListener('click', () => { if (state?.active) request({ type: state.active.kind === 'eyes' ? 'START_BREAK' : 'DONE', id: state.active.id }); });
$('snooze').addEventListener('click', () => { if (state?.active) request({ type: 'SNOOZE', id: state.active.id }); });
document.querySelectorAll('[data-demo]').forEach(b => b.addEventListener('click', async () => {
  if (launching) return;
  launching = true;
  document.querySelectorAll('[data-demo]').forEach(button => { button.disabled = true; });
  try {
    const response = await chrome.runtime.sendMessage({ type: 'LAUNCH', kind: b.dataset.demo });
    if (!response?.ok || !response.displayed) throw new Error(response?.error || 'Could not show Spidey on this webpage.');
    $('error').hidden = true; render(response.state);
    if (response.closePopup) window.close();
  } catch (error) { $('error').textContent = error.message; $('error').hidden = false; }
  finally { launching = false; document.querySelectorAll('[data-demo]').forEach(button => { button.disabled = false; }); }
}));
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.webBuddyState) void request(); });
(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab?.url || '');
    if (['http:', 'https:'].includes(url.protocol) && url.hostname !== 'chromewebstore.google.com' && !(url.hostname === 'chrome.google.com' && url.pathname.startsWith('/webstore'))) {
      hostname = url.hostname; $('site-name').textContent = hostname;
    }
  } catch {}
  await request();
  timer = setInterval(paintTime, 500);
})();
window.addEventListener('pagehide', () => clearInterval(timer));
