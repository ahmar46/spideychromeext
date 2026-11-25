export const KINDS = ['water', 'eyes', 'stretch'];
export const DEFAULTS = {
  intervals: { water: 45, eyes: 20, stretch: 60 },
  enabled: { water: true, eyes: true, stretch: true },
  position: 'top-right', size: 'medium', mode: 'reminders', reducedMotion: false,
  disabledSites: []
};
export function dateKey(now) {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
export function initial(now) {
  return { version: 1, settings: structuredClone(DEFAULTS), due: Object.fromEntries(KINDS.map(k => [k, now + DEFAULTS.intervals[k] * 60000])), active: null, pausedAt: null, stats: { date: dateKey(now), water: 0, eyes: 0, stretch: 0 }, sequence: 0, lastResolved: 0 };
}
export function restore(raw, now) {
  if (!raw || raw.version !== 1) return initial(now);
  const s = initial(now);
  for (const k of KINDS) {
    if (Number.isInteger(raw.settings?.intervals?.[k]) && raw.settings.intervals[k] >= 1 && raw.settings.intervals[k] <= 240) s.settings.intervals[k] = raw.settings.intervals[k];
    if (typeof raw.settings?.enabled?.[k] === 'boolean') s.settings.enabled[k] = raw.settings.enabled[k];
    s.due[k] = Number.isFinite(raw.due?.[k]) ? raw.due[k] : now + s.settings.intervals[k] * 60000;
  }
  for (const [key, values] of Object.entries({ position: ['top-right', 'top-left', 'bottom-right', 'bottom-left'], size: ['small', 'medium', 'large'], mode: ['always', 'reminders'] })) {
    if (values.includes(raw.settings?.[key])) s.settings[key] = raw.settings[key];
  }
  s.settings.reducedMotion = raw.settings?.reducedMotion === true;
  s.settings.disabledSites = Array.isArray(raw.settings?.disabledSites) ? [...new Set(raw.settings.disabledSites.filter(x => typeof x === 'string' && /^[a-z0-9.:[\]-]+$/i.test(x) && x.length < 254))].slice(0, 500) : [];
  s.pausedAt = Number.isFinite(raw.pausedAt) ? raw.pausedAt : null;
  s.sequence = Number.isSafeInteger(raw.sequence) && raw.sequence >= 0 ? raw.sequence : 0;
  s.lastResolved = Number.isFinite(raw.lastResolved) ? raw.lastResolved : 0;
  if (raw.active && KINDS.includes(raw.active.kind) && Number.isSafeInteger(raw.active.id)) {
    s.active = { id: raw.active.id, kind: raw.active.kind, demo: raw.active.demo === true };
    if (raw.active.kind === 'eyes' && Number.isFinite(raw.active.breakEnds)) s.active.breakEnds = raw.active.breakEnds;
    s.sequence = Math.max(s.sequence, s.active.id);
  }
  if (raw.stats?.date === dateKey(now)) for (const k of KINDS) s.stats[k] = Number.isSafeInteger(raw.stats[k]) && raw.stats[k] >= 0 ? raw.stats[k] : 0;
  return s;
}
function resolve(s, now, snooze = false) {
  if (!s.active) return;
  const { kind, demo } = s.active;
  // Test reminders never affect actual deadlines or daily counts.
  if (!demo) {
    s.due[kind] = (s.pausedAt ?? now) + (snooze ? 300000 : s.settings.intervals[kind] * 60000);
    if (!snooze) s.stats[kind]++;
    s.lastResolved = now;
  }
  s.active = null;
}
export function advance(s, now) {
  if (s.stats.date !== dateKey(now)) s.stats = { date: dateKey(now), water: 0, eyes: 0, stretch: 0 };
  if (s.active?.breakEnds && now >= s.active.breakEnds) resolve(s, now);
  if (!s.active && s.pausedAt === null && now >= s.lastResolved + 60000) {
    const kind = KINDS.filter(k => s.settings.enabled[k] && s.due[k] <= now).sort((a, b) => s.due[a] - s.due[b])[0];
    if (kind) s.active = { id: ++s.sequence, kind, demo: false };
  }
  return s;
}
export function apply(s, action, now) {
  if (!action || typeof action.type !== 'string') return s;
  // Resolve elapsed eye breaks first, but do not enqueue a due reminder ahead of an explicit demo.
  if (s.stats.date !== dateKey(now)) s.stats = { date: dateKey(now), water: 0, eyes: 0, stretch: 0 };
  if (s.active?.breakEnds && now >= s.active.breakEnds) resolve(s, now);
  if (action.type === 'PAUSE') {
    if (s.pausedAt === null) s.pausedAt = now;
    else { for (const k of KINDS) s.due[k] += Math.max(0, now - s.pausedAt); s.pausedAt = null; }
  }
  if (action.type === 'DEMO' && KINDS.includes(action.kind) && !s.active) s.active = { id: ++s.sequence, kind: action.kind, demo: true };
  if (action.type === 'START_BREAK' && s.active?.id === action.id && s.active.kind === 'eyes' && !s.active.breakEnds) s.active.breakEnds = now + 20000;
  if (action.type === 'SNOOZE' && s.active?.id === action.id) resolve(s, now, true);
  if (action.type === 'DONE' && s.active?.id === action.id && s.active.kind !== 'eyes') resolve(s, now);
  if (action.type === 'SETTINGS' && action.patch && typeof action.patch === 'object') {
    const p = action.patch, base = s.pausedAt ?? now;
    for (const k of KINDS) {
      const value = p.intervals?.[k];
      if (Number.isInteger(value) && value >= 1 && value <= 240 && value !== s.settings.intervals[k]) {
        s.settings.intervals[k] = value; s.due[k] = base + value * 60000;
      }
      if (typeof p.enabled?.[k] === 'boolean' && p.enabled[k] !== s.settings.enabled[k]) {
        s.settings.enabled[k] = p.enabled[k]; s.due[k] = base + s.settings.intervals[k] * 60000;
        if (!p.enabled[k] && s.active?.kind === k) s.active = null;
      }
    }
    for (const [key, values] of Object.entries({ position: ['top-right', 'top-left', 'bottom-right', 'bottom-left'], size: ['small', 'medium', 'large'], mode: ['always', 'reminders'] })) if (values.includes(p[key])) s.settings[key] = p[key];
    if (typeof p.reducedMotion === 'boolean') s.settings.reducedMotion = p.reducedMotion;
  }
  if (action.type === 'SITE' && typeof action.hostname === 'string' && /^[a-z0-9.:[\]-]+$/i.test(action.hostname) && action.hostname.length < 254) {
    const hosts = new Set(s.settings.disabledSites);
    if (action.disabled === true && hosts.size < 500) hosts.add(action.hostname); else if (action.disabled === false) hosts.delete(action.hostname);
    s.settings.disabledSites = [...hosts];
  }
  return advance(s, now);
}
export function next(s, now) {
  const kind = KINDS.filter(k => s.settings.enabled[k]).sort((a, b) => s.due[a] - s.due[b])[0];
  return kind ? { kind, remaining: Math.max(0, s.due[kind] - (s.pausedAt ?? now)) } : null;
}
