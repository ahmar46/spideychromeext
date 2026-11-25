import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { initial, next } from '../extension/core.mjs';
async function popup(failure = false) {
  const nodes = new Map(), messages = []; let closed = false;
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, { events: {}, dataset: {}, hidden: false, addEventListener(k, f) { this.events[k] = f; }, setCustomValidity() {}, reportValidity() {} });
    return nodes.get(id);
  }
  const demos = ['water', 'eyes', 'stretch'].map(k => { const n = node('demo-' + k); n.dataset.demo = k; return n; });
  const s = { ...initial(Date.now()), now: Date.now() }; s.next = next(s, s.now);
  // A pending reminder must not disable the toolbar's replay controls.
  s.active = { id: 1, kind: 'water', demo: true };
  const chrome = { runtime: { async sendMessage(message) {
    messages.push(message);
    if (message.type === 'LAUNCH') return failure ? { ok: false, error: 'Open a regular website.' } : { ok: true, displayed: true, closePopup: true, state: s };
    return { ok: true, state: s };
  } }, tabs: { query: async () => [{ id: 7, url: 'https://example.com' }] }, storage: { onChanged: { addListener() {} } } };
  const document = { getElementById: node, querySelectorAll: () => demos, activeElement: null, body: { classList: { toggle() {} } } };
  const window = { close() { closed = true; }, addEventListener() {} };
  vm.runInNewContext(fs.readFileSync(new URL('../extension/popup.js', import.meta.url), 'utf8'), { chrome, document, window, URL, Date, setInterval: () => 1, clearInterval() {}, console });
  await new Promise(resolve => setImmediate(resolve));
  return { demos, nodes, messages, closed: () => closed };
}
test('Water launches onto the page and closes the dashboard only after acknowledgment', async () => {
  const p = await popup();
  assert.equal(p.demos[0].disabled, false);
  await p.demos[0].events.click();
  assert.equal(p.messages.at(-1).type, 'LAUNCH'); assert.equal(p.messages.at(-1).kind, 'water');
  assert.equal(p.closed(), true);
});
test('a failed page launch leaves the dashboard open and shows its reason', async () => {
  const p = await popup(true); await p.demos[0].events.click();
  assert.equal(p.closed(), false);
  assert.equal(p.nodes.get('error').hidden, false);
  assert.equal(p.nodes.get('error').textContent, 'Open a regular website.');
  assert.equal(p.demos[0].disabled, false);
});
