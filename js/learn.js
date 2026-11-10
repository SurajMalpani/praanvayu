// Educational tabs: overview, what's in the air, sources, health.
(function () {
  const { h, svg, countUp, chipGroup, shuffle, bandFor, pm25ToAqi, cite } = PV.ui;
  const range = ([lo, hi], unit) => hi === null ? `${lo}+ ${unit}` : `${lo}–${hi} ${unit}`;

  /* ======================= OVERVIEW ======================= */
  function keyStats() {
    const el = document.getElementById('keyStats');
    el.innerHTML = '';
    PV.stats.forEach(([n, l, f]) => {
      const s = h('div', { class: 'stat' }, `<div class="num">0</div><div class="lbl">${cite(l)}</div>`);
      el.appendChild(s);
      countUp(s.querySelector('.num'), n, 1100, f);
    });
  }

  function aqiScale() {
    const bar = document.getElementById('aqiScale');
    const info = document.getElementById('aqiInfo');
    bar.innerHTML = '';
    const btns = PV.aqi.map((b, i) => {
      const btn = h('button', { type: 'button', class: 'aqi-band', style: `flex-basis:${(b.hi - b.lo + 1) / 501 * 100}%;background:${b.c};color:${b.t}`, 'aria-pressed': 'false' },
        `<span class="aqi-k">${b.k}</span><span class="aqi-r">${b.lo}–${b.hi}</span>`);
      btn.addEventListener('click', () => pick(i));
      bar.appendChild(btn);
      return btn;
    });
    function pick(i) {
      const b = PV.aqi[i];
      btns.forEach((x, j) => x.setAttribute('aria-pressed', String(i === j)));
      info.style.borderLeftColor = b.c;
      info.innerHTML = `
        <p class="eyebrow" style="color:${b.c === '#F2C230' ? '#9a7a00' : b.c}">AQI ${b.lo}–${b.hi}</p>
        <h4>${b.full || b.k}</h4>
        <p><b>Health impact (CPCB):</b> ${b.impact}</p>
        <p><b>What to do:</b> ${b.tip}</p>
        <p class="note">24-hour PM2.5 in this band: ${range(b.pm25, 'µg/m³')} · PM10: ${range(b.pm10, 'µg/m³')}. The WHO 24-hour PM2.5 guideline is 15 µg/m³.</p>
        <button class="btn small primary" data-goto="protect">Get a personal action plan →</button>`;
    }
    pick(3);
  }

  const QUIZ_SIZE = 8;
  function quiz() {
    const el = document.getElementById('quiz');
    el.innerHTML = '';
    document.getElementById('quizPool').textContent = PV.quiz.length;
    const picks = shuffle(PV.quiz).slice(0, QUIZ_SIZE);
    let answered = 0, right = 0;
    const score = h('div', { class: 'quiz-score' }, `Score: 0 / ${picks.length}`);
    picks.forEach((q, qi) => {
      const card = h('div', { class: 'q' }, `<p class="qtag">${q.t}</p><p class="qq">${qi + 1}. ${q.q}</p>`);
      const opts = h('div', { class: 'opts' });
      // Fact-or-myth questions keep their Fact / Myth order; other options are shuffled.
      const choices = q.o.map((text, i) => ({ text, ok: i === q.a }));
      (q.o.length === 2 ? choices : shuffle(choices)).forEach(o => {
        const b = h('button', { type: 'button' }, o.text);
        if (o.ok) b.dataset.ok = '1';
        b.addEventListener('click', () => {
          opts.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.dataset.ok) x.classList.add('right'); });
          if (!o.ok) b.classList.add('wrong'); else right++;
          answered++;
          card.appendChild(h('p', { class: 'ex' }, cite(q.x)));
          score.textContent = `Score: ${right} / ${picks.length}` + (answered === picks.length ? (right >= 6 ? ' · Shabash! Now help others learn it too.' : ' · Read the Learn tab and try a new set.') : '');
        });
        opts.appendChild(b);
      });
      card.appendChild(opts);
      el.appendChild(card);
    });
    el.appendChild(score);
  }

  PV.render.overview = function () {
    keyStats(); aqiScale(); quiz();
    document.getElementById('quizNew').addEventListener('click', quiz);
  };

  /* ======================= WHAT'S IN THE AIR ======================= */
  function pollutants() {
    const grid = document.getElementById('polGrid');
    const detail = document.getElementById('polDetail');
    grid.innerHTML = '';
    const btns = PV.pollutants.map(p => {
      const b = h('button', { type: 'button', class: 'ptile', 'aria-pressed': 'false' }, `<span class="pi">${p.icon}</span><b>${p.n}</b><small>${p.full}</small>`);
      b.addEventListener('click', () => pick(p));
      grid.appendChild(b);
      return [p.id, b];
    });
    function pick(p) {
      btns.forEach(([id, b]) => b.setAttribute('aria-pressed', String(id === p.id)));
      detail.innerHTML = `
        <h4>${p.n} <small class="note">${p.full}</small></h4>
        <p>${p.what}</p>
        <div class="two-col tight">
          <div><p class="mini-h">Where it comes from</p><p>${p.src}</p></div>
          <div><p class="mini-h">What it does to you</p><p>${p.harm}</p></div>
        </div>
        <table class="compare small">
          <thead><tr><th></th><th class="t">WHO guideline (2021)</th><th class="l">India NAAQS (2009)</th></tr></thead>
          <tbody>
            <tr><th>Long-term</th><td>${p.who[0]}</td><td>${p.ind[0]}</td></tr>
            <tr><th>Short-term</th><td>${p.who[1]}</td><td>${p.ind[1]}</td></tr>
          </tbody>
        </table>`;
    }
    pick(PV.pollutants[0]);
  }

  function sizeCompare() {
    const wrap = document.getElementById('sizeCompare');
    wrap.innerHTML = '';
    const k = 2.3;
    const root = svg('svg', { viewBox: '0 0 640 250', role: 'img', 'aria-label': 'Relative sizes of beach sand, a human hair, PM10 and PM2.5' }, wrap);
    const items = [
      { d: 90, x: 120, n: 'Fine beach sand', s: '~90 µm', fill: '#EBD9B4' },
      { d: 70, x: 330, n: 'Human hair', s: '50–70 µm wide', fill: '#9A5B2E' },
      { d: 10, x: 470, n: 'PM10', s: '≤ 10 µm', fill: '#2AA6A4' },
      { d: 2.5, x: 570, n: 'PM2.5', s: '≤ 2.5 µm', fill: '#17302F' }
    ];
    items.forEach(it => {
      const r = Math.max(it.d * k / 2, 2.5);
      svg('circle', { cx: it.x, cy: 115, r, fill: it.fill, opacity: it.n === 'Human hair' ? .85 : 1 }, root);
      const t = svg('text', { x: it.x, y: 225, 'text-anchor': 'middle', class: 'sz-n' }, root);
      t.textContent = it.n;
      const s = svg('text', { x: it.x, y: 243, 'text-anchor': 'middle', class: 'sz-s' }, root);
      s.textContent = it.s;
    });
  }

  function converter() {
    const el = document.getElementById('pmConv');
    el.innerHTML = `
      <div class="sim-grid two">
        <div class="sim-box">
          <label class="ctl">24-hour average PM2.5 <span class="val" id="pmVal"></span>
            <input type="range" id="pmRange" min="0" max="400" step="1" value="110" aria-label="PM2.5 concentration">
          </label>
          <div class="chips small" id="pmPresets"></div>
          <p class="note" style="margin-top:12px">Find today\u2019s PM2.5 for your city on the CPCB or SAFAR sites in the Resources tab.</p>
        </div>
        <div class="verdict" id="pmOut" aria-live="polite"></div>
      </div>`;
    const r = el.querySelector('#pmRange');
    chipGroup(el.querySelector('#pmPresets'), [['10', 'Hill town, monsoon (~10)'], ['45', 'Typical good day (~45)'], ['110', 'Winter city (~110)'], ['300', 'Smog episode (~300)']], '110', v => { r.value = v; draw(); });
    const draw = () => {
      const c = +r.value;
      const a = pm25ToAqi(c), b = PV.aqi[bandFor(a)];
      el.querySelector('#pmVal').textContent = c + ' µg/m³';
      const out = el.querySelector('#pmOut');
      out.style.borderColor = b.c;
      out.style.background = `linear-gradient(180deg, ${b.c}22, #fff 70%)`;
      out.innerHTML = `
        <div class="big" style="color:${b.c === '#F2C230' ? '#9a7a00' : b.c}">AQI ${a >= 500 ? '500+' : a} · ${b.full || b.k}</div>
        <ul class="checks">
          <li class="${c <= 15 ? 'ok' : 'no'}"><b>${(c / 15).toFixed(1)}×</b> the WHO 24-hour guideline (15 µg/m³)</li>
          <li class="${c <= 60 ? 'ok' : 'no'}"><b>${(c / 60).toFixed(1)}×</b> India\u2019s 24-hour standard (60 µg/m³)</li>
          <li class="na">Breathing this for a day carries a risk comparable to smoking about <b>${(c / 22).toFixed(1)} cigarettes</b>${cite(' [12]')}</li>
        </ul>
        <p class="note" style="margin:10px 0 0">${b.tip}</p>`;
    };
    r.addEventListener('input', draw);
    draw();
  }

  function standards() {
    const rows = [
      ['PM2.5 · annual', 5, 40], ['PM2.5 · 24-hour', 15, 60], ['PM10 · annual', 15, 60],
      ['PM10 · 24-hour', 45, 100], ['NO₂ · annual', 10, 40], ['NO₂ · 24-hour', 25, 80]
    ];
    document.getElementById('stdBars').innerHTML = rows.map(([l, w, i]) => `
      <div class="std-row">
        <span class="std-l">${l}</span>
        <div class="std-bars">
          <div class="std-bar who" style="width:${w / i * 100}%"><span>WHO ${w}</span></div>
          <div class="std-bar ind" style="width:100%"><span>India ${i}</span></div>
        </div>
        <b class="std-x">${(i / w).toFixed(i % w ? 1 : 0)}×</b>
      </div>`).join('');
  }

  PV.render.air = function () { pollutants(); sizeCompare(); converter(); standards(); };

  /* ======================= SOURCES ======================= */
  function sourceExplorer() {
    const grid = document.getElementById('srcGrid');
    const info = document.getElementById('srcInfo');
    grid.innerHTML = '';
    const btns = PV.sources.map(s => {
      const b = h('button', { type: 'button', class: 'src ' + s.tone, 'aria-pressed': 'false' }, `<span class="si">${s.icon}</span><b>${s.n}</b><small>${s.tag}</small>`);
      b.addEventListener('click', () => pick(s));
      grid.appendChild(b);
      return [s.id, b];
    });
    function pick(s) {
      btns.forEach(([id, b]) => b.setAttribute('aria-pressed', String(id === s.id)));
      info.innerHTML = `<p class="eyebrow">${s.tag}</p><h4>${s.icon} ${s.n}</h4><p>${s.p}</p><ul class="facts">${s.f.map(([k, v]) => `<li><b>${k}:</b> ${cite(v)}</li>`).join('')}</ul>`;
    }
    pick(PV.sources[2]);
    return id => { const s = PV.sources.find(x => x.id === id); if (s) pick(s); };
  }

  function sourceMix(showSource) {
    const wrap = document.getElementById('mixChart');
    const C = 150, R1 = 130, R0 = 80, GAP = 0.012;
    const pt = (a, r) => `${(C + r * Math.cos(a)).toFixed(2)},${(C + r * Math.sin(a)).toFixed(2)}`;
    const arc = (a0, a1) => {
      const big = a1 - a0 > Math.PI ? 1 : 0;
      return `M${pt(a0, R1)} A${R1},${R1} 0 ${big} 1 ${pt(a1, R1)} L${pt(a1, R0)} A${R0},${R0} 0 ${big} 0 ${pt(a0, R0)} Z`;
    };
    const draw = key => {
      const m = PV.mix[key];
      const sum = m.slices.reduce((a, s) => a + s.v, 0);
      const max = Math.max(...m.slices.map(s => s.v));
      wrap.innerHTML = `
        <p class="mix-lead">${m.lead}</p>
        <div class="mix-wrap">
          <div class="mix-donut"></div>
          <div>
            <div class="mix-legend"></div>
            <aside class="info mix-info" aria-live="polite"></aside>
          </div>
        </div>
        <p class="note" style="margin-top:12px">${cite(m.foot)}</p>`;
      const donut = wrap.querySelector('.mix-donut');
      const legend = wrap.querySelector('.mix-legend');
      const info = wrap.querySelector('.mix-info');
      const root = svg('svg', { viewBox: '0 0 300 300', role: 'img', 'aria-label': `${m.title}: ` + m.slices.map(s => `${s.n} ${Math.round(s.v)}%`).join(', ') }, donut);
      let a = -Math.PI / 2;
      const segs = m.slices.map((s, i) => {
        const a1 = a + s.v / sum * 2 * Math.PI;
        const p = svg('path', { d: arc(a + GAP, a1 - GAP), fill: PV.mixColors[s.k], class: 'mix-seg' }, root);
        p.addEventListener('click', () => select(i));
        p.addEventListener('mouseenter', () => select(i));
        a = a1;
        return p;
      });
      const pct = svg('text', { x: C, y: C + 8, 'text-anchor': 'middle', class: 'mix-pct' }, root);
      const lab = svg('text', { x: C, y: C + 32, 'text-anchor': 'middle', class: 'mix-lab' }, root);
      const rows = m.slices.map((s, i) => {
        const c = PV.mixColors[s.k];
        const b = h('button', { type: 'button', class: 'mix-row', 'aria-pressed': 'false' },
          `<i style="background:${c}"></i><span class="mix-n">${s.n}</span><span class="mix-bar"><b style="width:${s.v / max * 100}%;background:${c}"></b></span><span class="mix-v">${Math.round(s.v)}%</span>`);
        b.addEventListener('click', () => select(i));
        legend.appendChild(b);
        return b;
      });
      function select(i) {
        const s = m.slices[i];
        segs.forEach((p, j) => p.classList.toggle('on', i === j));
        rows.forEach((r, j) => r.setAttribute('aria-pressed', String(i === j)));
        donut.classList.add('has-sel');
        pct.textContent = Math.round(s.v) + '%';
        lab.textContent = s.s;
        info.style.borderLeftColor = PV.mixColors[s.k];
        info.innerHTML = `<h4>${s.n} · ${Math.round(s.v)}%</h4><p>${cite(s.d)}</p>` +
          (s.src ? '<button class="btn small ghost" type="button" data-src>More about this source ↓</button>' : '');
        const more = info.querySelector('[data-src]');
        if (more) more.addEventListener('click', () => showSource(s.src));
      }
      select(m.slices.findIndex(s => s.k !== 'outside'));
    };
    chipGroup(document.getElementById('mixModes'), Object.keys(PV.mix).map(k => [k, PV.mix[k].title]), 'india', draw);
    draw('india');
  }

  function shifts() {
    document.getElementById('mixShifts').innerHTML = PV.shifts.map(([l, was, wasY, now, nowY, r]) => `
      <div class="shift">
        <p class="shift-l">${cite(l + ' ' + r)}</p>
        <div class="shift-n">
          <span class="was"><b>${was}</b><small>${wasY}</small></span>
          <span class="arr" aria-hidden="true">→</span>
          <span class="now"><b>${now}</b><small>${nowY}</small></span>
        </div>
      </div>`).join('');
  }

  function calendar() {
    const el = document.getElementById('polCal');
    const det = document.getElementById('polCalDetail');
    const colors = ['#8CC152', '#F2C230', '#F08A24', '#E0452B', '#8E1B2B'];
    const words = ['Cleanest', 'Low', 'Moderate', 'High', 'Worst'];
    el.innerHTML = '';
    const cells = PV.calendar.map((m, i) => {
      const b = h('button', { type: 'button', class: 'cal-m', 'aria-pressed': 'false', 'aria-label': `${m.m}: ${words[m.v - 1]}` },
        `<span class="cal-bar" style="height:${m.v * 16}%;background:${colors[m.v - 1]}"></span><span class="cal-l">${m.m}</span>`);
      b.addEventListener('click', () => pick(i));
      el.appendChild(b);
      return b;
    });
    function pick(i) {
      const m = PV.calendar[i];
      cells.forEach((c, j) => c.setAttribute('aria-pressed', String(i === j)));
      det.style.borderLeftColor = colors[m.v - 1];
      det.innerHTML = `<h4>${m.m} <span class="tag" style="background:${colors[m.v - 1]};color:${m.v === 2 || m.v === 1 ? '#17302F' : '#fff'}">${words[m.v - 1]}</span></h4><p>${m.d}</p>`;
    }
    pick(10);
  }

  function inversion() {
    const wrap = document.getElementById('invDiagram');
    const note = document.getElementById('invNote');
    const seed = Array.from({ length: 70 }, (_, i) => [(i * 73.13) % 1, (i * 41.7 + .37) % 1]);
    const draw = mode => {
      const winter = mode === 'winter';
      const top = winter ? 175 : 40;
      wrap.innerHTML = '';
      const root = svg('svg', { viewBox: '0 0 640 300', role: 'img', 'aria-label': winter ? 'Winter night: a warm layer traps pollution near the ground' : 'Summer afternoon: pollution mixes high into the air' }, wrap);
      const defs = svg('defs', null, root);
      const g = svg('linearGradient', { id: 'sky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      svg('stop', { offset: '0', 'stop-color': winter ? '#3A4A63' : '#BFE6F2' }, g);
      svg('stop', { offset: '1', 'stop-color': winter ? '#8C97A8' : '#EAF7FA' }, g);
      svg('rect', { x: 0, y: 0, width: 460, height: 262, fill: 'url(#sky)', rx: 12 }, root);
      if (winter) {
        svg('rect', { x: 0, y: top - 26, width: 460, height: 26, fill: '#F08A24', opacity: .35 }, root);
        const t = svg('text', { x: 14, y: top - 9, class: 'inv-lab' }, root);
        t.textContent = 'Warm air layer: the "lid"';
      }
      const pg = svg('g', { class: 'particles' }, root);
      seed.forEach(([a, b], i) => {
        const cy = top + 6 + b * (250 - top - 6);
        svg('circle', { cx: 16 + a * 428, cy, r: 3.2, fill: '#4B4F58', opacity: winter ? .75 : .45, style: `animation-delay:${-(i % 9) * .6}s` }, pg);
      });
      // ground, buildings, chimney, car, house
      svg('rect', { x: 0, y: 250, width: 460, height: 12, fill: '#6BAA3A' }, root);
      [[30, 190, 40], [80, 170, 34], [190, 200, 46], [250, 180, 30], [370, 205, 36]].forEach(([x, y, w]) => svg('rect', { x, y, width: w, height: 250 - y, fill: winter ? '#2C3646' : '#7D8B99', rx: 3 }, root));
      svg('rect', { x: 132, y: 150, width: 14, height: 100, fill: winter ? '#4A3A33' : '#9A5B2E' }, root);
      svg('rect', { x: 300, y: 236, width: 44, height: 14, rx: 5, fill: '#2AA6A4' }, root);
      svg('path', { d: 'M410,250 L410,226 L428,212 L446,226 L446,250 Z', fill: winter ? '#5B4A3A' : '#C08A5A' }, root);

      // temperature profile
      svg('line', { x1: 500, y1: 255, x2: 500, y2: 30, class: 'inv-axis' }, root);
      svg('line', { x1: 500, y1: 255, x2: 625, y2: 255, class: 'inv-axis' }, root);
      const ya = svg('text', { x: 494, y: 26, class: 'inv-ax', 'text-anchor': 'end' }, root); ya.textContent = 'Height ↑';
      const xa = svg('text', { x: 625, y: 274, class: 'inv-ax', 'text-anchor': 'end' }, root); xa.textContent = 'Warmer →';
      const d = winter ? `M525,252 L590,${top - 14} L540,40` : 'M610,252 L520,40';
      svg('path', { d, class: 'inv-line' }, root);
      const cap = svg('text', { x: 562, y: 292, class: 'inv-ax', 'text-anchor': 'middle' }, root);
      cap.textContent = 'Air temperature';
      note.innerHTML = winter
        ? '<b>Winter night:</b> the ground cools fast and chills the air touching it. A layer of warmer air sits above, so smoke can\u2019t rise past it. The same emissions get squeezed into a much shallower layer, so concentrations at breathing height shoot up.'
        : '<b>Summer afternoon:</b> the sun heats the ground, warm air rises and carries pollution high up, and winds disperse it. Air normally gets colder with height, so nothing stops it rising.';
    };
    chipGroup(document.getElementById('invModes'), [['summer', '☀️ Summer afternoon'], ['winter', '🌙 Winter night']], 'winter', draw);
    draw('winter');
  }

  PV.render.sources = function () {
    const showSource = sourceExplorer();
    sourceMix(id => { showSource(id); document.getElementById('srcGrid').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    shifts(); calendar(); inversion();
  };

  /* ======================= HEALTH ======================= */
  function healthStats() {
    const stats = [
      [20, 'lakh deaths in India linked to air pollution in 2023 [19]', v => Math.round(v) + '+'],
      [1.36, '% of India\u2019s GDP lost to deaths and illness from air pollution in 2019 [4]', v => v.toFixed(2)],
      [79, 'lakh deaths worldwide linked to air pollution in 2023, about 1 in 8 deaths [19]', v => Math.round(v)],
      [30, '× thinner than a human hair: small enough for PM2.5 to reach the blood [15]', v => Math.round(v)]
    ];
    const el = document.getElementById('healthStats');
    el.innerHTML = '';
    stats.forEach(([n, l, f]) => {
      const s = h('div', { class: 'stat' }, `<div class="num">0</div><div class="lbl">${cite(l)}</div>`);
      el.appendChild(s);
      countUp(s.querySelector('.num'), n, 1000, f);
    });
  }

  function bodyMap() {
    const wrap = document.getElementById('bodyMap');
    const info = document.getElementById('bodyInfo');
    wrap.innerHTML = '';
    const root = svg('svg', { viewBox: '0 0 240 420', role: 'img', 'aria-label': 'Body map of air pollution health effects' }, wrap);
    const skin = '#DDF3F1', edge = '#9BD3CF';
    svg('circle', { cx: 140, cy: 44, r: 25, fill: skin, stroke: edge, 'stroke-width': 2 }, root);
    svg('path', { d: 'M112,84 Q140,74 168,84 L184,96 L198,200 L184,204 L170,124 L170,240 L164,404 L144,404 L141,268 L139,268 L136,404 L116,404 L110,240 L110,124 L96,204 L82,200 L96,96 Z', fill: skin, stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, root);
    svg('circle', { cx: 44, cy: 300, r: 13, fill: '#E5F2D9', stroke: '#B5D99A', 'stroke-width': 2 }, root);
    svg('path', { d: 'M30,318 Q44,312 58,318 L66,326 L72,366 L65,368 L58,336 L58,372 L55,412 L46,412 L44,386 L42,412 L33,412 L30,372 L30,336 L23,368 L16,366 L22,326 Z', fill: '#E5F2D9', stroke: '#B5D99A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, root);
    svg('path', { d: 'M126,112 q-14,4 -14,30 q0,22 14,22 q6,0 6,-10 l0,-36 q0,-6 -6,-6 Z M154,112 q14,4 14,30 q0,22 -14,22 q-6,0 -6,-10 l0,-36 q0,-6 6,-6 Z', fill: '#9BD3CF', opacity: .55 }, root);

    const spots = {};
    PV.body.forEach((b, i) => {
      const g = svg('g', { class: 'spot', tabindex: 0, role: 'button', 'aria-label': b.n }, root);
      svg('circle', { cx: b.x, cy: b.y, r: 12, class: 'spot-ring' }, g);
      svg('circle', { cx: b.x, cy: b.y, r: 8, class: 'spot-dot' }, g);
      const t = svg('text', { x: b.x, y: b.y + 3.5, 'text-anchor': 'middle', class: 'spot-n' }, g);
      t.textContent = i + 1;
      const pick = () => select(b.id);
      g.addEventListener('click', pick);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      spots[b.id] = g;
    });
    const list = document.getElementById('bodyList');
    list.innerHTML = '';
    PV.body.forEach((b, i) => {
      const c = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', 'data-id': b.id }, `${i + 1}. ${b.n}`);
      c.addEventListener('click', () => select(b.id));
      list.appendChild(c);
    });
    function select(id) {
      const b = PV.body.find(x => x.id === id);
      Object.entries(spots).forEach(([k, g]) => g.classList.toggle('active', k === id));
      list.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.id === id)));
      info.innerHTML = `<p class="eyebrow">Health effect</p><h4>${b.n}</h4><p>${cite(b.p)}</p><ul class="facts">${b.f.map(x => `<li>${x}</li>`).join('')}</ul>`;
    }
    select('heart');
  }

  function riskGroups() {
    document.getElementById('riskGrid').innerHTML = PV.risk.map(([n, d]) => `<div class="tool"><h4>${n}</h4><p>${d}</p></div>`).join('');
  }

  PV.render.health = function () { healthStats(); bodyMap(); riskGroups(); };
})();
