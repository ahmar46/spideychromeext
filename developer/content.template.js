/* Bundled vector character and isolated interface; no remote assets or code. */
(() => {
  'use strict';
  if (window.top !== window || document.getElementById('web-buddy-extension-root')) return;
  const STYLE = __BUDDY_CSS__;
  const ART = __BUDDY_ART__;
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
