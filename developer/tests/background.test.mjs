import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as core from '../extension/core.mjs';
async function host(seed, now = new Date(2026, 10, 24, 10).getTime(), options = {}) {
  const storage = seed ? { webBuddyState: structuredClone(seed) } : {};
  let receiver;
  const listeners = {};
  const alarms = new Map();
  const injections = [], tabMessages = [];
  let ready = options.ready || false;
  const chrome = {
    tabs: {
      query: async () => [{ id: 7, url: options.url || 'https://example.com/article' }],
      sendMessage: async (tabId, message, target) => {
        tabMessages.push({ tabId, message, target });
        if (!ready) throw new Error('Receiving end does not exist');
        if (message.type === 'WEB_BUDDY_PING') return { ok: true, version: '1.2.1' };
        if (message.type === 'WEB_BUDDY_SHOW') return { ok: true, displayed: options.displayed ?? true };
      }
    },
    scripting: { executeScript: async request => {
      if (options.failInjection) throw new Error('Cannot access contents of this URL');
      injections.push(request);
      if (request.files) ready = true;
      return [];
    } },
    storage: { local: { get: async () => structuredClone(storage), set: async value => Object.assign(storage, structuredClone(value)) } },
    alarms: { get: async k => alarms.get(k), create: async (k, v) => alarms.set(k, v), clear: async k => alarms.delete(k), onAlarm: { addListener: f => { listeners.alarm = f; } } },
    action: { setBadgeText: async () => {}, setBadgeBackgroundColor: async () => {} },
    runtime: { id: 'test-extension', onMessage: { addListener: f => { receiver = f; } }, onStartup: { addListener: f => { listeners.startup = f; } }, onInstalled: { addListener: f => { listeners.install = f; } } }
  };
  const script = fs.readFileSync(new URL('../extension/background.js', import.meta.url), 'utf8').replace(/^import[^\n]+\n/, 'const { initial, restore, apply, next } = core;\n');
  class Clock extends Date { static now() { return now; } }
  vm.runInNewContext(script, { core, chrome, URL, Date: Clock, console });
  const send = (msg, sender = { id: 'test-extension' }) => new Promise(resolve => receiver(msg, sender, resolve));
  await send({ type: 'GET' });
  return { storage, alarms, send, injections, tabMessages, time: value => { now = value; }, listeners };
}
test('service worker persists settings and recreates its alarm after restart', async () => {
  const h = await host();
  await h.send({ type: 'SETTINGS', patch: { position: 'bottom-left', intervals: { water: 30 } } });
  const restarted = await host(h.storage.webBuddyState);
  const r = await restarted.send({ type: 'GET' });
  assert.equal(r.state.settings.position, 'bottom-left'); assert.equal(r.state.settings.intervals.water, 30);
  assert.equal(restarted.alarms.get('webBuddy.pulse').periodInMinutes, 1);
});
test('concurrent completions from different tabs persist one win', async () => {
  const t = new Date(2026, 10, 24, 10).getTime();
  const s = core.initial(t); s.due.water = t;
  const h = await host(s, t);
  const id = h.storage.webBuddyState.active.id;
  await Promise.all([h.send({ type: 'DONE', id }), h.send({ type: 'DONE', id })]);
  assert.equal(h.storage.webBuddyState.stats.water, 1);
});
test('content scripts can mute only their own sender hostname', async () => {
  const h = await host();
  await h.send({ type: 'SITE', hostname: 'unrelated.com', disabled: true }, { id: 'test-extension', tab: { id: 1 }, url: 'https://example.com/private/path' });
  assert.deepEqual(h.storage.webBuddyState.settings.disabledSites, ['example.com']);
});
test('timed eye break completes after worker termination and restoration', async () => {
  const t = new Date(2026, 10, 24, 10).getTime();
  const s = core.initial(t); s.due.eyes = t;
  const h = await host(s, t); const id = h.storage.webBuddyState.active.id;
  await h.send({ type: 'START_BREAK', id });
  assert.ok(h.alarms.has('webBuddy.break'));
  const restored = await host(h.storage.webBuddyState, t + 21000);
  assert.equal(restored.storage.webBuddyState.stats.eyes, 1);
  assert.equal(restored.storage.webBuddyState.active, null);
});
test('toolbar launch injects the character into an already-open tab before showing it', async () => {
  const h = await host();
  const response = await h.send({ type: 'LAUNCH', kind: 'water' });
  assert.equal(response.ok, true); assert.equal(response.displayed, true); assert.equal(response.closePopup, true);
  assert.equal(h.injections.length, 2);
  assert.equal(typeof h.injections[0].func, 'function');
  assert.equal(h.injections[1].files[0], 'content.js');
  assert.equal(h.injections[1].target.tabId, 7);
  assert.equal(h.tabMessages.at(-1).message.type, 'WEB_BUDDY_SHOW');
  assert.equal(h.tabMessages.at(-1).message.state.active.kind, 'water');
});
test('a healthy existing character is shown without duplicate injection', async () => {
  const h = await host(undefined, undefined, { ready: true });
  await h.send({ type: 'LAUNCH', kind: 'stretch' });
  assert.equal(h.injections.length, 0);
  assert.equal(h.tabMessages.at(-1).message.state.active.kind, 'stretch');
});
test('blocked Chrome pages report a reason instead of claiming a successful launch', async () => {
  const h = await host(undefined, undefined, { url: 'chrome://extensions' });
  const response = await h.send({ type: 'LAUNCH', kind: 'water' });
  assert.equal(response.ok, false); assert.match(response.error, /regular website/);
  assert.equal(h.injections.length, 0);
});
test('site-access and rendering failures keep the popup open with an error', async () => {
  const h = await host(undefined, undefined, { failInjection: true });
  const response = await h.send({ type: 'LAUNCH', kind: 'water' });
  assert.equal(response.ok, false); assert.match(response.error, /site access/);
  const invisible = await host(undefined, undefined, { ready: true, displayed: false });
  assert.equal((await invisible.send({ type: 'LAUNCH', kind: 'water' })).ok, false);
});
test('manual replay keeps real pending reminders and their counts intact', async () => {
  const t = Date.now(), s = core.initial(t); s.due.water = t;
  const h = await host(s, t, { ready: true }); const id = h.storage.webBuddyState.active.id;
  const response = await h.send({ type: 'LAUNCH', kind: 'eyes' });
  assert.equal(response.state.active.id, id); assert.equal(response.state.active.kind, 'water');
  assert.equal(response.state.stats.water, 0);
});
test('website content scripts cannot invoke the toolbar injection path', async () => {
  const h = await host();
  const response = await h.send({ type: 'LAUNCH', kind: 'water' }, { id: 'test-extension', tab: { id: 7 }, url: 'https://example.com' });
  assert.equal(response.ok, false); assert.equal(h.injections.length, 0);
});
