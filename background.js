import { initial, restore, apply, next } from './core.mjs';
const KEY = 'webBuddyState';
// Serializes all read/modify/write actions, including simultaneous clicks in different tabs.
let queue = Promise.resolve();
function run(action = { type: 'GET' }) {
  const task = queue.then(async () => {
    const now = Date.now();
    const stored = (await chrome.storage.local.get(KEY))[KEY];
    const s = apply(restore(stored, now), action, now);
    if (JSON.stringify(stored) !== JSON.stringify(s)) await chrome.storage.local.set({ [KEY]: s });
    await schedule(s, now);
    await chrome.action.setBadgeText({ text: s.pausedAt !== null ? 'Ⅱ' : s.active ? '•' : '' });
    await chrome.action.setBadgeBackgroundColor({ color: '#CF455C' });
    return { ok: true, state: { ...s, now, next: next(s, now) } };
  });
  queue = task.catch(() => {});
  return task;
}
async function schedule(s, now) {
  if (!(await chrome.alarms.get('webBuddy.pulse'))) await chrome.alarms.create('webBuddy.pulse', { periodInMinutes: 1 });
  // Eye breaks also complete when the popup/content script asks for state after the countdown.
  if (s.active?.breakEnds) await chrome.alarms.create('webBuddy.break', { when: Math.max(now + 500, s.active.breakEnds) });
  else await chrome.alarms.clear('webBuddy.break');
}
async function ensureCompanion(tabId) {
  try {
    const pong = await chrome.tabs.sendMessage(tabId, { type: 'WEB_BUDDY_PING' }, { frameId: 0 });
    if (pong?.ok && pong.version === '1.2.1') return;
  } catch {}
  // Recover missing scripts on already-open tabs and stale unpacked versions.
  try { await chrome.tabs.sendMessage(tabId, { type: 'WEB_BUDDY_DISPOSE' }, { frameId: 0 }); } catch {}
  await chrome.scripting.executeScript({ target: { tabId, frameIds: [0] }, func: () => { document.getElementById('web-buddy-extension-root')?.remove(); } });
  await chrome.scripting.executeScript({ target: { tabId, frameIds: [0] }, files: ['content.js'] });
  const pong = await chrome.tabs.sendMessage(tabId, { type: 'WEB_BUDDY_PING' }, { frameId: 0 });
  if (!pong?.ok || pong.version !== '1.2.1') throw new Error('Refresh the webpage, then try Water again.');
}
let launchQueue = Promise.resolve();
function launch(message) {
  const task = launchQueue.then(async () => {
    if (!['water', 'eyes', 'stretch'].includes(message.kind)) throw new Error('Choose Water, Eyes or Stretch.');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let url;
    try { url = new URL(tab?.url); } catch {}
    if (!Number.isInteger(tab?.id) || !url || !['http:', 'https:'].includes(url.protocol) || url.hostname === 'chromewebstore.google.com' || (url.hostname === 'chrome.google.com' && url.pathname.startsWith('/webstore'))) {
      throw new Error('Open a regular website, then click Water here. Chrome blocks Spidey on New Tab, chrome:// pages and the Chrome Web Store.');
    }
    const current = await run();
    if (current.state.settings.disabledSites.includes(url.hostname)) throw new Error('Spidey is hidden on this website. Enable “Show on this website”, then try again.');
    try { await ensureCompanion(tab.id); }
    catch (error) { throw new Error('Could not place Spidey on this page. Refresh it and check Chrome’s site access for Web Buddy. ' + error.message); }
    let response = await run();
    if (response.state.active?.demo) response = await run({ type: 'SNOOZE', id: response.state.active.id });
    if (!response.state.active) response = await run({ type: 'DEMO', kind: message.kind });
    const delivered = await chrome.tabs.sendMessage(tab.id, { type: 'WEB_BUDDY_SHOW', state: response.state }, { frameId: 0 });
    if (!delivered?.ok || !delivered.displayed) throw new Error('Spidey could not become visible. Bring the webpage to the front and try again.');
    return { ...response, displayed: true, closePopup: true };
  });
  launchQueue = task.catch(() => {});
  return task;
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id) return false;
  if (message?.type === 'LAUNCH') {
    if (sender.tab) { respond({ ok: false, error: 'Launch from the toolbar popup.' }); return false; }
    launch(message).then(respond, error => respond({ ok: false, error: error.message }));
    return true;
  }
  const allowed = ['GET', 'PAUSE', 'DEMO', 'START_BREAK', 'SNOOZE', 'DONE', 'SETTINGS', 'SITE'];
  if (!message || !allowed.includes(message.type)) { respond({ ok: false, error: 'Unknown request' }); return false; }
  // Per-site actions from a webpage can only refer to that webpage's own hostname.
  if (sender.tab && message.type === 'SITE') {
    try { message = { ...message, hostname: new URL(sender.url).hostname }; }
    catch { respond({ ok: false, error: 'Unsupported page' }); return false; }
  }
  run(message).then(respond, () => respond({ ok: false, error: 'Could not save your change. Try again.' }));
  return true;
});
chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name.startsWith('webBuddy.')) void run().catch(console.error); });
chrome.runtime.onInstalled.addListener(() => { void run().catch(console.error); });
chrome.runtime.onStartup.addListener(() => { void run().catch(console.error); });
// Rechecks persistent state whenever Chrome starts a new service-worker instance.
void run().catch(console.error);
