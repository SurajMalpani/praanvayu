// Action tabs: protect yourself, take action, volunteer.
(function () {
  const { h, chipGroup, store, bandFor, cite } = PV.ui;
  const CONTACT = 'contact@praanvayu.org';

  /* ======================= PROTECT ======================= */
  // Advice by AQI band (0 = Good … 5 = Severe) and group.
  const ADVICE = {
    out: {
      all: ['Enjoy the outdoors.', 'Normal activity.', 'Fine for most people. Ease off if you notice coughing or breathlessness.', 'Cut back long or heavy exertion outdoors; move workouts indoors.', 'Avoid prolonged exertion outdoors. Postpone runs, matches and outdoor PT.', 'Avoid outdoor activity. Even light exertion can affect healthy people.'],
      sens: ['Enjoy the outdoors.', 'Normal activity; watch for symptoms if you are very sensitive.', 'Reduce long or heavy exertion outdoors and take more breaks.', 'Avoid heavy exertion outdoors; keep outings short.', 'Stay indoors as much as possible.', 'Stay indoors and follow your doctor\u2019s action plan.'],
      work: ['Normal work.', 'Normal work.', 'Take regular breaks; drink water.', 'Shift heavy tasks to cleaner hours; take breaks indoors where possible.', 'Limit hours of heavy outdoor work; rotate tasks; breaks indoors.', 'Postpone non-essential outdoor work. Employers should pause heavy work.']
    },
    home: ['Open windows to air out your home.', 'Ventilate freely.', 'Ventilate during the cleanest hours, usually afternoon.', 'Keep windows closed. Run a HEPA purifier in the room you use most.', 'Keep windows closed; run a HEPA purifier, especially in bedrooms. Avoid frying, incense and candles.', 'Seal gaps, run HEPA purifiers continuously, and avoid any indoor burning.'],
    mask: {
      all: ['Not needed.', 'Not needed.', 'Optional; consider an N95 near heavy traffic.', 'Wear a fitted N95/FFP2 near traffic and for longer outings.', 'Wear a fitted N95/FFP2 whenever outdoors.', 'Wear a fitted N95/FFP2 whenever outdoors.'],
      sens: ['Not needed.', 'Not needed for most.', 'Wear a fitted N95/FFP2 near traffic.', 'Wear a fitted N95/FFP2 outdoors.', 'Wear a fitted N95/FFP2 whenever outdoors.', 'Wear a fitted N95/FFP2 whenever outdoors.'],
      work: ['Not needed.', 'Not needed.', 'N95/FFP2 recommended near traffic and dust.', 'N95/FFP2 throughout the shift, replaced when soiled.', 'N95/FFP2 throughout the shift, replaced daily.', 'N95/FFP2 throughout the shift, replaced daily.']
    },
    watch: {
      all: 'Coughing, sore throat, burning eyes or unusual tiredness are signs to cut exposure.',
      sens: 'Keep reliever inhalers and medicines with you. Get medical help for chest pain, breathlessness, wheeze that doesn\u2019t ease, or palpitations.',
      work: 'Employers should provide masks, clean drinking water and rest areas, and adjust shifts on bad-air days.'
    }
  };

  function planner() {
    const el = document.getElementById('planner');
    el.innerHTML = `
      <div class="sim-grid two">
        <div class="sim-box">
          <label class="ctl">Today\u2019s AQI <span class="val" id="plVal"></span>
            <input type="range" id="plAqi" min="0" max="500" step="5" value="250" aria-label="AQI">
          </label>
          <div class="aqi-mini" id="plMini"></div>
          <p class="mini-h" style="margin-top:14px">I am…</p>
          <div class="chips small" id="plGroup"></div>
        </div>
        <div id="plOut" aria-live="polite"></div>
      </div>`;
    el.querySelector('#plMini').innerHTML = PV.aqi.map(b => `<i style="flex-basis:${(b.hi - b.lo + 1) / 501 * 100}%;background:${b.c}"></i>`).join('');
    let group = 'all';
    const r = el.querySelector('#plAqi');
    chipGroup(el.querySelector('#plGroup'), [['all', 'Healthy adult'], ['sens', 'Child, older, pregnant, or with heart/lung disease'], ['work', 'Outdoor worker']], 'all', g => { group = g; draw(); }, 'g');
    const draw = () => {
      const a = +r.value, i = bandFor(a), b = PV.aqi[i];
      el.querySelector('#plVal').textContent = `${a} · ${b.full || b.k}`;
      el.querySelector('#plVal').style.color = b.c === '#F2C230' ? '#9a7a00' : b.c;
      el.querySelector('#plOut').innerHTML = `
        <div class="advice" style="border-top-color:${b.c}">
          <div><span class="ai">🏃</span><p class="mini-h">Outdoors</p><p>${ADVICE.out[group][i]}</p></div>
          <div><span class="ai">🏠</span><p class="mini-h">At home</p><p>${ADVICE.home[i]}</p></div>
          <div><span class="ai">😷</span><p class="mini-h">Mask</p><p>${ADVICE.mask[group][i]}</p></div>
          <div><span class="ai">🩺</span><p class="mini-h">Watch for</p><p>${ADVICE.watch[group]}</p></div>
        </div>
        <p class="note" style="margin-top:10px">General guidance based on CPCB health statements${cite(' [6]')}. It is not medical advice; follow your doctor\u2019s plan if you have a condition.</p>`;
    };
    r.addEventListener('input', draw);
    draw();
  }

  function purifier() {
    const el = document.getElementById('purifierCalc');
    el.innerHTML = `
      <div class="sim-grid two">
        <div class="sim-box">
          <label class="ctl">Room length <span class="val" id="puL"></span><input type="range" id="puLen" min="6" max="30" value="12" aria-label="Room length in feet"></label>
          <label class="ctl">Room width <span class="val" id="puW"></span><input type="range" id="puWid" min="6" max="30" value="12" aria-label="Room width in feet"></label>
          <label class="ctl">Ceiling height <span class="val" id="puH"></span><input type="range" id="puHt" min="8" max="14" value="10" aria-label="Ceiling height in feet"></label>
        </div>
        <div class="verdict pass" id="puOut" aria-live="polite"></div>
      </div>`;
    const L = el.querySelector('#puLen'), W = el.querySelector('#puWid'), H = el.querySelector('#puHt');
    const draw = () => {
      const area = L.value * W.value, vol = area * H.value;
      const cfm = Math.ceil(vol * 5 / 60);
      const m3h = Math.ceil(cfm * 1.699);
      el.querySelector('#puL').textContent = L.value + ' ft';
      el.querySelector('#puW').textContent = W.value + ' ft';
      el.querySelector('#puH').textContent = H.value + ' ft';
      el.querySelector('#puOut').innerHTML = `
        <div class="big">CADR ≥ ${cfm} cfm</div>
        <p style="margin:2px 0 10px">(about ${m3h} m³/h) for a ${area} sq ft room (${(area * 0.0929).toFixed(1)} m²)</p>
        <ul class="checks">
          <li class="ok">Look for a <b>true HEPA</b> (H13 or better) filter</li>
          <li class="ok">Check the <b>smoke CADR</b>, not just "room size" marketing</li>
          <li class="no">Avoid ionisers and "ozone purifiers": they create ozone</li>
          <li class="na">Keep doors and windows shut while it runs; replace filters on schedule</li>
        </ul>
        <p class="note" style="margin:8px 0 0">Targets about 5 clean-air changes an hour, in line with the EPA/AHAM "two-thirds" sizing rule${cite(' [14]')}.</p>`;
    };
    [L, W, H].forEach(x => x.addEventListener('input', draw));
    draw();
  }

  function myths() {
    const el = document.getElementById('myths');
    el.innerHTML = '';
    PV.myths.forEach(([m, f]) => {
      const card = h('div', { class: 'myth', role: 'button', tabindex: 0, 'aria-expanded': 'false' }, `<span class="mtag">Myth</span><p class="mq">${m}</p><p class="mf"><span class="mtag g">Fact</span> ${cite(f)}</p><span class="mhint">Tap to reveal the fact</span>`);
      const toggle = e => { if (!e.target.closest('.ref')) card.setAttribute('aria-expanded', String(card.getAttribute('aria-expanded') !== 'true')); };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
      el.appendChild(card);
    });
  }

  PV.render.protect = function () { planner(); purifier(); myths(); };

  /* ======================= TAKE ACTION ======================= */
  const HABITS = [
    { q: 'How do you usually get around?', o: [['Walk or cycle', 2], ['Bus, metro or train', 2], ['Electric vehicle or car-pool', 1], ['Petrol/diesel car, mostly alone', 0]], tip: 'Swap two car trips a week for metro, bus, car-pool or cycling.' },
    { q: 'Is your vehicle\u2019s PUC valid and the vehicle serviced on time?', o: [['Yes / no vehicle', 2], ['Sometimes', 1], ['No', 0]], tip: 'Get your vehicle serviced and keep a valid PUC. A poorly tuned engine can emit several times more.' },
    { q: 'Do you switch off the engine at long red lights?', o: [['Always / no vehicle', 2], ['Sometimes', 1], ['Never', 0]], tip: 'Switch off at signals longer than 30 seconds; idling burns fuel for nothing.' },
    { q: 'What fuel does your household cook with?', o: [['LPG, PNG or electric', 2], ['Mostly LPG, sometimes wood or kerosene', 1], ['Wood, dung, coal or kerosene', 0]], tip: 'Clean cooking fuel protects your family first. Check eligibility for Ujjwala LPG connections.' },
    { q: 'What happens to your household waste and dry leaves?', o: [['Segregated, wet waste composted', 2], ['Segregated and handed over', 1], ['Mixed, or sometimes burned', 0]], tip: 'Segregate wet and dry waste and compost leaves. Never burn garbage; it is illegal and toxic.' },
    { q: 'How do you celebrate festivals and weddings?', o: [['No firecrackers', 2], ['Only green crackers, briefly', 1], ['Regular firecrackers', 0]], tip: 'Try a cracker-free celebration with lights, music and community events.' },
    { q: 'How do you use electricity at home?', o: [['Efficient appliances + solar or green power', 2], ['Efficient appliances, lights off when not needed', 1], ['Haven\u2019t thought about it', 0]], tip: 'Use 5-star appliances and LEDs, and look at rooftop solar. Less coal power means less SO₂ and PM.' }
  ];

  function habits() {
    const el = document.getElementById('habitsList');
    const out = document.getElementById('habitScore');
    const picks = new Array(HABITS.length).fill(null);
    el.innerHTML = '';
    HABITS.forEach((hq, qi) => {
      const row = h('div', { class: 'hrow' }, `<p class="hq">${qi + 1}. ${hq.q}</p>`);
      const chips = h('div', { class: 'chips small' });
      chipGroup(chips, hq.o.map(([l], oi) => [String(oi), l]), null, oi => { picks[qi] = +oi; score(); }, 'g');
      row.appendChild(chips);
      el.appendChild(row);
    });
    const max = HABITS.reduce((a, q) => a + Math.max(...q.o.map(o => o[1])), 0);
    function score() {
      const done = picks.filter(p => p !== null).length;
      const pts = picks.reduce((a, p, i) => a + (p === null ? 0 : HABITS[i].o[p][1]), 0);
      const tips = picks.map((p, i) => p !== null && HABITS[i].o[p][1] < 2 ? HABITS[i].tip : null).filter(Boolean);
      const pct = Math.round(pts / max * 100);
      const label = pct >= 80 ? 'Clean-air champion 🌳' : pct >= 50 ? 'Good start 🌱' : 'Lots of easy wins ahead 💨';
      out.innerHTML = done === 0 ? '<p class="note">Answer the questions to see your clean-air score and personal tips.</p>' : `
        <div class="big">${pts} / ${max} · ${label}</div>
        <div class="meter"><i style="width:${pct}%"></i></div>
        <p class="note">${done} of ${HABITS.length} answered</p>
        ${tips.length ? `<p class="mini-h">Your next steps</p><ul class="ticks">${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : done === HABITS.length ? '<p>You\u2019re already doing the big things. Now bring your neighbours along: see the volunteer section below.</p>' : ''}`;
    }
    score();
  }

  const PLEDGES = [
    'I will check the AQI before outdoor exercise and plan around bad-air hours.',
    'I will never burn garbage, plastic or leaves, and will report open burning.',
    'I will walk, cycle, car-pool or use public transport at least twice a week.',
    'I will keep my vehicle\u2019s PUC valid and switch off at red lights.',
    'I will celebrate festivals without firecrackers.',
    'I will segregate my waste and compost where I can.',
    'I will help one family switch to clean cooking fuel or ventilate their kitchen.',
    'I will share what I\u2019ve learned with five people.'
  ];

  function pledge() {
    const el = document.getElementById('pledge');
    const st = document.getElementById('pledgeStatus');
    const saved = store.get('pv-pledges', []);
    el.innerHTML = PLEDGES.map((p, i) => `<label class="pl"><input type="checkbox" value="${i}" ${saved.includes(i) ? 'checked' : ''}><span>${p}</span></label>`).join('');
    const update = () => {
      const on = [...el.querySelectorAll('input:checked')].map(x => +x.value);
      store.set('pv-pledges', on);
      st.innerHTML = `<b>${on.length} of ${PLEDGES.length}</b> pledges taken${on.length === PLEDGES.length ? ' · Thank you! 🌿' : ''}`;
    };
    el.addEventListener('change', update);
    update();
    document.getElementById('pledgeShare').addEventListener('click', async () => {
      const on = [...el.querySelectorAll('input:checked')].map(x => PLEDGES[+x.value]);
      const text = `I took the Praanvayu clean-air pledge:\n${on.length ? on.map(p => '• ' + p).join('\n') : '• I will learn how to breathe cleaner air.'}\nJoin me at Praanvayu.`;
      try {
        if (navigator.share) await navigator.share({ title: 'Praanvayu clean-air pledge', text });
        else { await navigator.clipboard.writeText(text); st.innerHTML += ' · Copied to clipboard'; }
      } catch (e) { /* share cancelled */ }
    });
  }

  const ROLES = [
    ['ambassador', '📣', 'Clean Air Ambassador', 'Run short awareness sessions in your colony, RWA, office or place of worship.'],
    ['schools', '🎒', 'School & college clubs', 'Help students start Clean Air Clubs, read the AQI and run poster and pledge drives.'],
    ['science', '📡', 'Citizen science', 'Host or maintain a low-cost sensor, log readings and help map local hotspots.'],
    ['green', '🌳', 'Green cover drives', 'Plant and care for native trees (neem, peepal, arjun) and protect urban green belts.'],
    ['burnfree', '🔥', 'Burn-free campaigns', 'Work with farmers, waste workers and RWAs on alternatives to burning.'],
    ['health', '🩺', 'Health camps', 'Support doctors and nurses at lung-health screenings and mask-fitting sessions.'],
    ['data', '💻', 'Data & tech', 'Build dashboards, maps and tools like this site.'],
    ['story', '🎨', 'Design & storytelling', 'Make posters and reels, and translate content into regional languages.'],
    ['policy', '📜', 'Policy & research', 'Track NCAP city plans, file RTIs and prepare briefs for local officials.']
  ];

  function volunteer() {
    const grid = document.getElementById('roleGrid');
    const chosen = new Set();
    grid.innerHTML = '';
    ROLES.forEach(([id, ic, n, d]) => {
      const b = h('button', { type: 'button', class: 'role', 'aria-pressed': 'false' }, `<span class="ri">${ic}</span><b>${n}</b><small>${d}</small><span class="rcheck">✓ Selected</span>`);
      b.addEventListener('click', () => {
        if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
        b.setAttribute('aria-pressed', String(chosen.has(id)));
        document.getElementById('roleCount').textContent = chosen.size ? `${chosen.size} role${chosen.size > 1 ? 's' : ''} selected` : 'No roles selected yet';
      });
      grid.appendChild(b);
    });

    const form = document.getElementById('volForm');
    const done = document.getElementById('volDone');
    const submitBtn = form.querySelector('[type=submit]');
    const esc = s => s.replace(/[<>&"]/g, '');
    const endpoint = (PV.config && PV.config.volunteerEndpoint || '').trim();

    function finish(v, sent) {
      const body = [
        `Name: ${v.name}`, `Email: ${v.email}`, `Phone: ${v.phone || '-'}`, `City: ${v.city}`,
        `Roles: ${v.roles || 'Open to anything'}`, `Availability: ${v.availability || '-'}`,
        `Languages: ${v.languages || '-'}`, '', v.message
      ].join('\n');
      const mail = `mailto:${CONTACT}?subject=${encodeURIComponent('Volunteer sign-up: ' + v.name + ' (' + v.city + ')')}&body=${encodeURIComponent(body)}`;
      form.hidden = true;
      done.hidden = false;
      done.innerHTML = `
        <div class="verdict pass">
          <div class="big">Thank you, ${esc(v.name.split(' ')[0])}! 🌿</div>
          ${sent
            ? `<p>We\u2019ve received your sign-up. A Praanvayu coordinator for <b>${esc(v.city)}</b> will get in touch at <b>${esc(v.email)}</b>.</p>`
            : `<p>Your details are ready. Send them to the Praanvayu team so a coordinator in <b>${esc(v.city)}</b> can reach you.</p>`}
          <div class="hero-cta">
            ${sent ? '' : `<a class="btn primary" href="${mail}">✉️ Send my sign-up by email</a>`}
            <button class="btn ghost" type="button" id="volAgain">Sign up someone else</button>
          </div>
          ${sent ? '' : `<p class="note" style="margin:12px 0 0">Can\u2019t send email from this device? Write to <b>${CONTACT}</b> with the same details.</p>`}
        </div>`;
      done.querySelector('#volAgain').addEventListener('click', () => { form.reset(); form.hidden = false; done.hidden = true; });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const v = {
        name: fd.get('name').trim(), email: fd.get('email').trim(), phone: fd.get('phone').trim(), city: fd.get('city').trim(),
        roles: ROLES.filter(r => chosen.has(r[0])).map(r => r[2]).join(', '),
        availability: fd.getAll('time').join(', '), languages: fd.get('lang').trim(), message: fd.get('msg').trim()
      };
      // Bots fill the hidden "website" field; humans never see it.
      if (fd.get('website')) { finish(v, true); return; }
      if (!endpoint) { finish(v, false); return; }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      try {
        // Apps Script web apps don't return CORS headers, so the response is opaque; a network failure still throws.
        await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(v) });
        finish(v, true);
      } catch (err) {
        finish(v, false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign me up →';
      }
    });
  }

  PV.render.act = function () { habits(); pledge(); volunteer(); };
})();
