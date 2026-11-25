import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { initial, apply, next } from '../extension/core.mjs';
const NOW = new Date(2026, 10, 25, 10).getTime();
async function ui(settings = {}) {
  const nodes = [], animations = [], messages = [], timers = new Map();
  let onStorage, onMessage, now = NOW, timerId = 0, state = initial(NOW);
  Object.assign(state.settings, settings);
  class Node {
    constructor(tag) { this.tag = tag; this.isConnected = true; this.attrs = {}; this.children = []; this.events = {}; this.style = { setProperty() {} }; this.hidden = false; nodes.push(this); }
    setAttribute(k, v) { this.attrs[k] = v; if (k === 'hidden') this.hidden = true; if (k === 'class') this.className = v; }
    append(...items) { this.children.push(...items); }
    attachShadow() { return new Node('shadow'); }
    addEventListener(k, f) { this.events[k] = f; }
    removeEventListener() {}
    remove() {}
    focus() {}
    animate(frames, options) {
      let finish, reject;
      const finished = new Promise((yes, no) => { finish = yes; reject = no; });
      const animation = { frames, options, finished, finish, cancel() { reject(new Error('cancelled')); } };
      animations.push(animation); return animation;
    }
  }
  const document = { visibilityState: 'visible', events: {}, documentElement: new Node('html'), getElementById: () => null, createElement: tag => new Node(tag), createElementNS: (_, tag) => new Node(tag), addEventListener(k, f) { this.events[k] = f; }, removeEventListener() {} };
  const chrome = { runtime: { id: 'test', onMessage: { addListener: f => { onMessage = f; }, removeListener() {} }, async sendMessage(action) { messages.push(action); apply(state, action, now); return { ok: true, state: structuredClone({ ...state, now, next: next(state, now) }) }; } }, storage: { onChanged: { addListener: f => { onStorage = f; }, removeListener() {} } } };
  const motion = { matches: false, addEventListener() {}, removeEventListener() {} };
  const window = { innerHeight: 900, matchMedia: () => motion }; window.top = window;
  class Sheet { replaceSync() {} }
  class Clock extends Date { static now() { return now; } }
  vm.runInNewContext(fs.readFileSync(new URL('../extension/content.js', import.meta.url), 'utf8'), { chrome, window, document, Date: Clock, location: { hostname: 'example.com' }, CSSStyleSheet: Sheet, setInterval: () => 1, clearInterval() {}, setTimeout: (fn, delay) => { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id; }, clearTimeout: id => timers.delete(id), console });
  const flush = () => new Promise(resolve => setImmediate(resolve));
  await flush();
  return {
    nodes, animations, messages, state, motion, document,
    find: cls => nodes.find(n => n.attrs.class === cls),
    message(value) { let reply; onMessage(value, { id: 'test' }, response => { reply = response; }); return reply; },
    phase: () => nodes.find(n => n.attrs['data-phase'])?.attrs['data-phase'],
    async update() { onStorage({ webBuddyState: {} }, 'local'); await flush(); },
    async click(n) { n.events.click(); await flush(); },
    async finishMotion() { animations.at(-1).finish(); await flush(); },
    async advance(ms) {
      const end = now + ms;
      for (;;) {
        const due = [...timers.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        now = due[1].at; timers.delete(due[0]); due[1].fn(); await flush();
      }
      now = end;
    }
  };
}
test('uses an inline articulated SVG with no picture element', async () => {
  const h = await ui();
  assert.equal(h.nodes.some(n => n.tag === 'img'), false);
  assert.ok(h.nodes.some(n => n.tag === 'svg'));
  assert.ok(h.nodes.some(n => n.attrs.class === 'spidey-head'));
  assert.ok(h.nodes.some(n => n.attrs.class === 'spidey-wave'));
});
test('drops once and reveals the comic cloud only after landing', async () => {
  const h = await ui(); h.state.active = { id: 1, kind: 'water', demo: true }; await h.update();
  assert.equal(h.phase(), 'entering'); assert.equal(h.find('card').hidden, true);
  assert.equal(h.nodes.find(n => n.tag === 'h2').textContent, 'DRINK YOUR WATER!');
  await h.update(); assert.equal(h.animations.length, 1);
  assert.equal(h.animations[0].options.duration, 1200);
  assert.match(h.animations[0].frames[0].transform, /translateY\(-1250px\)/);
  await h.advance(1250); assert.equal(h.phase(), 'hanging'); assert.equal(h.find('card').hidden, false);
});
test('unanswered reminder snoozes without a win, then climbs out and disappears', async () => {
  const h = await ui(); h.state.active = { id: 1, kind: 'water', demo: false }; await h.update();
  await h.advance(14000);
  assert.equal(h.messages.filter(a => a.type === 'SNOOZE').length, 1);
  assert.equal(h.state.stats.water, 0); assert.equal(h.state.active, null);
  assert.equal(h.phase(), 'leaving'); assert.equal(h.find('card').hidden, true);
  assert.match(h.animations.at(-1).frames.at(-1).transform, /translateY\(-1250px\)/);
  await h.finishMotion(); assert.equal(h.phase(), 'hidden');
  assert.equal(h.nodes.find(n => n.className?.startsWith('dock')).hidden, true);
});
test('completion from another tab still plays the climb-out animation', async () => {
  const h = await ui(); h.state.active = { id: 1, kind: 'water', demo: true }; await h.update(); await h.advance(1250);
  h.state.active = null; await h.update(); assert.equal(h.phase(), 'leaving');
  await h.finishMotion(); assert.equal(h.phase(), 'hidden');
});
test('reduced motion shows and dismisses immediately without travel animations', async () => {
  const h = await ui({ reducedMotion: true }); h.state.active = { id: 1, kind: 'water', demo: true }; await h.update();
  assert.equal(h.animations.length, 0); assert.equal(h.phase(), 'hanging'); assert.equal(h.find('card').hidden, false);
  await h.click(h.find('primary')); assert.equal(h.phase(), 'hidden'); assert.equal(h.animations.length, 0);
});
test('starting an eye break prevents the usual 14-second auto-retreat', async () => {
  const h = await ui(); h.state.active = { id: 1, kind: 'eyes', demo: true }; await h.update(); await h.advance(1250);
  await h.click(h.find('primary')); await h.advance(15000);
  assert.equal(h.messages.some(a => a.type === 'SNOOZE'), false); assert.equal(h.state.active.kind, 'eyes');
  await h.advance(5000); await h.update(); assert.equal(h.state.active, null); assert.equal(h.phase(), 'leaving');
});
test('background tabs cancel their presentation timers and do not auto-snooze', async () => {
  const h = await ui(); h.state.active = { id: 1, kind: 'water', demo: true }; await h.update();
  h.document.visibilityState = 'hidden'; h.document.events.visibilitychange(); await h.advance(16000);
  assert.equal(h.phase(), 'hidden'); assert.equal(h.messages.some(a => a.type === 'SNOOZE'), false);
  h.document.visibilityState = 'visible'; await h.update(); assert.equal(h.phase(), 'entering');
});
test('idle Hide stays hidden through refresh, then next reminder drops in', async () => {
  const h = await ui({ mode: 'always' }); await h.click(h.nodes.find(n => n.textContent === 'Hide')); await h.finishMotion(); await h.update();
  assert.equal(h.phase(), 'hidden');
  h.state.active = { id: 1, kind: 'water', demo: true }; await h.update(); assert.equal(h.phase(), 'entering');
});
test('direct toolbar messages acknowledge the live character and replay a pending reminder', async () => {
  const h = await ui();
  assert.equal(h.message({ type: 'WEB_BUDDY_PING' }).version, '1.2.1');
  h.state.active = { id: 1, kind: 'water', demo: true }; await h.update(); await h.advance(1250);
  const reply = h.message({ type: 'WEB_BUDDY_SHOW', state: h.state });
  assert.equal(reply.displayed, true); assert.equal(h.phase(), 'entering');
});
