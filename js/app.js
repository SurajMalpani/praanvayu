// Tabs, routing and the resources tab.
(function () {
  /* ---------- resources & references ---------- */
  PV.render.resources = function () {
    document.getElementById('resourceGroups').innerHTML = PV.resources.map(g => `
      <div class="rgroup"><h3>${g.group}</h3>${g.items.map(([n, u, d]) => `
        <a class="rlink" href="${u}" target="_blank" rel="noopener noreferrer"><b>${n} ↗</b><small>${d}</small><span class="url">${u.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span></a>`).join('')}</div>`).join('');
    document.getElementById('refList').innerHTML = PV.references.map((r, i) => `<li id="ref-${i + 1}"><span class="rn">[${i + 1}]</span><span>${r}</span></li>`).join('');
    const gl = document.getElementById('glossary');
    const draw = q => {
      gl.innerHTML = PV.glossary.filter(([t, d]) => !q || (t + ' ' + d).toLowerCase().includes(q)).map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('') || '<dd class="note">No matching terms.</dd>';
    };
    document.getElementById('glossSearch').addEventListener('input', e => draw(e.target.value.trim().toLowerCase()));
    draw('');
  };

  /* ---------- tabs ---------- */
  const tabs = [...document.querySelectorAll('.tabs [role=tab]')];
  const subs = [...document.querySelectorAll('.subtabs [data-sub]')];
  const SUB_IDS = subs.map(b => b.dataset.sub);
  const rendered = new Set();
  let currentSub = SUB_IDS[0];
  // Anchors inside a tab (e.g. #volunteer) open their tab, then scroll.
  const ANCHOR_TAB = { volunteer: 'act', 'pledge-card': 'act', habits: 'act', solutions: 'act', community: 'act', report: 'act', officials: 'act', purifier: 'protect', masks: 'protect', references: 'resources' };

  function setHash(h) {
    try { history.replaceState(null, '', '#' + h); } catch (e) { /* some browsers block this on file:// */ }
  }

  function jump(anchor) {
    const target = document.getElementById(anchor);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function route(hash) {
    let id = hash, anchor = null;
    if (ANCHOR_TAB[id]) { anchor = id; id = ANCHOR_TAB[id]; }
    show(id, false);
    if (anchor) jump(anchor);
  }

  // Learn topics are sub-panels; each renders on first view, like the top-level tabs.
  function showSub(id) {
    currentSub = id;
    subs.forEach(b => {
      const on = b.dataset.sub === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.sub-panel').forEach(p => { p.hidden = p.id !== 'learn-' + id; });
    if (!rendered.has('sub-' + id) && PV.render[id]) { rendered.add('sub-' + id); PV.render[id](); }
  }

  function show(id, push) {
    if (SUB_IDS.includes(id)) { currentSub = id; id = 'learn'; }
    if (!document.getElementById('tab-' + id)) id = 'overview';
    if (id === 'learn') showSub(currentSub);
    tabs.forEach(t => {
      const on = t.dataset.tab === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = p.id !== 'tab-' + id; });
    if (!rendered.has(id) && PV.render[id]) { rendered.add(id); PV.render[id](); }
    if (push) setHash(id === 'learn' ? currentSub : id);
    const active = tabs.find(t => t.dataset.tab === id);
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(t.dataset.tab, true); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      n.focus(); show(n.dataset.tab, true);
    });
  });
  subs.forEach((b, i) => {
    b.addEventListener('click', () => { showSub(b.dataset.sub); setHash(b.dataset.sub); });
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = subs[(i + (e.key === 'ArrowRight' ? 1 : -1) + subs.length) % subs.length];
      n.focus(); showSub(n.dataset.sub); setHash(n.dataset.sub);
    });
  });
  document.addEventListener('click', e => {
    const next = e.target.closest('[data-sub-go]');
    if (next) {
      showSub(next.dataset.subGo); setHash(next.dataset.subGo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const ref = e.target.closest('.ref');
    if (ref) {
      e.preventDefault();
      show('resources', true);
      jump('ref-' + ref.dataset.ref);
      const li = document.getElementById('ref-' + ref.dataset.ref);
      if (li) { li.classList.add('flash'); setTimeout(() => li.classList.remove('flash'), 2400); }
      return;
    }
    const j = e.target.closest('[data-jump]');
    if (j) { e.preventDefault(); jump(j.dataset.jump); return; }
    const g = e.target.closest('[data-goto]');
    if (!g) return;
    e.preventDefault();
    show(g.dataset.goto, true);
    if (g.dataset.anchor) jump(g.dataset.anchor);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('hashchange', () => route(location.hash.slice(1)));
  route(location.hash.slice(1) || 'overview');
})();

// Overview hero: rotate through headline facts every 10 seconds.
(function () {
  const deck = document.getElementById('heroDeck');
  const dots = document.getElementById('heroDots');
  if (!deck || !dots) return;
  const slides = [...deck.querySelectorAll('.hero-slide')];
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, timer = null;
  const btns = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Show fact ${i + 1} of ${slides.length}`);
    b.addEventListener('click', () => { show(i); start(); });
    dots.appendChild(b);
    return b;
  });
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-on', k === cur); s.setAttribute('aria-hidden', String(k !== cur)); });
    btns.forEach((b, k) => b.setAttribute('aria-current', String(k === cur)));
  }
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (still) return;
    timer = setInterval(() => { if (!document.hidden && deck.offsetParent) show(cur + 1); }, 10000);
  }
  // Pause while someone is reading or tabbing through the deck.
  deck.addEventListener('mouseenter', stop);
  deck.addEventListener('mouseleave', start);
  deck.addEventListener('focusin', stop);
  deck.addEventListener('focusout', start);
  show(0);
  start();
})();
