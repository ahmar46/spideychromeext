import test from 'node:test';
import assert from 'node:assert/strict';
import { initial, restore, apply, advance, next } from '../extension/core.mjs';
const T = new Date(2026, 10, 24, 10).getTime();
const MIN = 60000;
test('first scheduled reminder is eyes, never fires early', () => {
  const s = initial(T);
  advance(s, T + 20 * MIN - 1); assert.equal(s.active, null);
  advance(s, T + 20 * MIN); assert.equal(s.active.kind, 'eyes');
});
test('restoring persistent state after worker sleep preserves the active reminder', () => {
  const s = initial(T); advance(s, T + 20 * MIN);
  const restored = restore(JSON.parse(JSON.stringify(s)), T + 22 * MIN);
  assert.deepEqual(restored.active, s.active); assert.equal(restored.due.water, T + 45 * MIN);
});
test('snooze persists five-minute delay and stale clicks cannot complete it', () => {
  const s = initial(T); advance(s, T + 20 * MIN); const id = s.active.id;
  apply(s, { type: 'SNOOZE', id }, T + 20 * MIN);
  assert.equal(s.due.eyes, T + 25 * MIN); assert.equal(s.stats.eyes, 0);
  apply(s, { type: 'DONE', id }, T + 21 * MIN); assert.equal(s.stats.eyes, 0);
});
test('water counts exactly once even when two tabs complete the same id', () => {
  const s = initial(T); s.due.water = T; advance(s, T);
  const action = { type: 'DONE', id: s.active.id };
  apply(s, action, T); apply(s, action, T);
  assert.equal(s.stats.water, 1); assert.equal(s.due.water, T + 45 * MIN);
});
test('eye break requires starting, ignores early Done, and auto-completes after 20s', () => {
  const s = initial(T); advance(s, T + 20 * MIN); const id = s.active.id;
  apply(s, { type: 'DONE', id }, T + 20 * MIN); assert.equal(s.stats.eyes, 0);
  apply(s, { type: 'START_BREAK', id }, T + 20 * MIN);
  advance(s, T + 20 * MIN + 19999); assert.equal(s.stats.eyes, 0);
  advance(s, T + 20 * MIN + 20000); assert.equal(s.stats.eyes, 1); assert.equal(s.active, null);
});
test('demo breaks never alter real schedules or daily counts', () => {
  const s = initial(T); const due = structuredClone(s.due);
  apply(s, { type: 'DEMO', kind: 'water' }, T + MIN);
  apply(s, { type: 'DONE', id: s.active.id }, T + MIN);
  assert.equal(s.stats.water, 0); assert.deepEqual(s.due, due);
  apply(s, { type: 'DEMO', kind: 'eyes' }, T + 2 * MIN);
  apply(s, { type: 'START_BREAK', id: s.active.id }, T + 2 * MIN);
  advance(s, T + 2 * MIN + 20000); assert.equal(s.stats.eyes, 0); assert.deepEqual(s.due, due);
});
test('pause freezes deadlines across restart and resume preserves remaining time', () => {
  let s = initial(T); apply(s, { type: 'PAUSE' }, T + 5 * MIN);
  assert.equal(next(s, T + 30 * MIN).remaining, 15 * MIN);
  s = restore(s, T + 40 * MIN); apply(s, { type: 'PAUSE' }, T + 40 * MIN);
  assert.equal(next(s, T + 40 * MIN).remaining, 15 * MIN);
});
test('appearance changes do not reset timers; interval changes do', () => {
  const s = initial(T); apply(s, { type: 'SETTINGS', patch: { position: 'bottom-left', mode: 'reminders' } }, T + MIN);
  assert.equal(s.due.eyes, T + 20 * MIN);
  apply(s, { type: 'SETTINGS', patch: { intervals: { eyes: 10 } } }, T + 2 * MIN);
  assert.equal(s.due.eyes, T + 12 * MIN);
});
test('disabled reminders never fire; re-enabling starts a fresh interval', () => {
  const s = initial(T);
  apply(s, { type: 'SETTINGS', patch: { enabled: { water: false, eyes: false, stretch: false } } }, T);
  advance(s, T + 100 * MIN); assert.equal(s.active, null); assert.equal(next(s, T), null);
  apply(s, { type: 'SETTINGS', patch: { enabled: { eyes: true } } }, T + 100 * MIN);
  assert.equal(s.due.eyes, T + 120 * MIN);
});
test('configuration rejects invalid values and unrelated state keys', () => {
  const s = initial(T);
  apply(s, { type: 'SETTINGS', patch: { intervals: { water: 0, eyes: 999, stretch: '3' }, position: 'anywhere', disabledSites: ['google.com'], reducedMotion: 'true' } }, T);
  assert.deepEqual(s.settings.intervals, { water: 45, eyes: 20, stretch: 60 });
  assert.equal(s.settings.position, 'top-right'); assert.deepEqual(s.settings.disabledSites, []);
  assert.equal(s.settings.reducedMotion, false);
});
test('site mute deduplicates, removes, and rejects path/script input', () => {
  const s = initial(T);
  for (let i = 0; i < 2; i++) apply(s, { type: 'SITE', hostname: 'example.com', disabled: true }, T);
  apply(s, { type: 'SITE', hostname: '<script>', disabled: true }, T);
  assert.deepEqual(s.settings.disabledSites, ['example.com']);
  apply(s, { type: 'SITE', hostname: 'example.com', disabled: false }, T);
  assert.deepEqual(s.settings.disabledSites, []);
});
test('daily totals reset at local midnight without resetting timer deadlines', () => {
  const s = initial(T); s.stats.water = 5; const due = s.due.water;
  apply(s, { type: 'PAUSE' }, T);
  advance(s, new Date(2026, 10, 25, 0, 1).getTime());
  assert.equal(s.stats.water, 0); assert.equal(s.due.water, due);
});
test('overdue reminders after sleep do not stack and have a one-minute gap', () => {
  const s = initial(T); advance(s, T + 100 * MIN);
  const id = s.active.id; apply(s, { type: 'START_BREAK', id }, T + 100 * MIN);
  advance(s, T + 100 * MIN + 20000); assert.equal(s.active, null);
  advance(s, T + 101 * MIN + 19999); assert.equal(s.active, null);
  advance(s, T + 101 * MIN + 20000); assert.equal(s.active.kind, 'water');
});
test('invalid or partial persisted values are normalized safely', () => {
  const s = restore({ version: 1, settings: { intervals: { eyes: -20 }, disabledSites: 'bad' }, stats: {} }, T);
  assert.equal(s.settings.intervals.eyes, 20); assert.deepEqual(s.settings.disabledSites, []);
  assert.equal(s.active, null); assert.equal(s.pausedAt, null);
});
