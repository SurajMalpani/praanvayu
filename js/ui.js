// Shared helpers: DOM building, SVG, count-up numbers, chip groups and local storage.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  PV.render = PV.render || {};

  function h(tag, attrs, html) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  }

  function svg(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function countUp(el, to, ms, fmt) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / ms);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function chipGroup(el, items, current, onPick, cls) {
    el.innerHTML = '';
    items.forEach(([id, label]) => {
      const b = h('button', { class: 'chip' + (cls ? ' ' + cls : ''), type: 'button', 'aria-pressed': String(id === current) }, label);
      b.addEventListener('click', () => {
        el.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        onPick(id);
      });
      el.appendChild(b);
    });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // localStorage throws on some file:// and private-mode setups.
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  function bandFor(aqi) {
    const i = PV.aqi.findIndex(b => aqi <= b.hi);
    return i === -1 ? PV.aqi.length - 1 : i;
  }

  // Indian AQI sub-index for 24-hour PM2.5, by linear interpolation between CPCB breakpoints.
  // Severe is open-ended (250+); 380 µg/m³ is used as its upper breakpoint, as in common Indian AQI calculators.
  function pm25ToAqi(c) {
    for (const b of PV.aqi) {
      const [lo, hi] = b.pm25;
      if (hi === null || c <= hi) {
        if (hi === null) return Math.min(500, Math.round(b.lo + (c - lo) * (b.hi - b.lo) / (380 - lo)));
        return Math.round(b.lo + (Math.max(c, lo) - lo) * (b.hi - b.lo) / (hi - lo));
      }
    }
    return 500;
  }

  // Turns "[4]" markers into links to the numbered list in Resources → References.
  const cite = s => s.replace(/\s?\[(\d+)\]/g, ' <a class="ref" href="#references" data-ref="$1">[$1]</a>');

  PV.ui = { h, svg, countUp, chipGroup, shuffle, store, bandFor, pm25ToAqi, cite };
})();
