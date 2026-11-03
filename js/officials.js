// "Find your local officials": ward offices and control rooms, searchable by pin code, area or city.
// Data policy: official offices and published office numbers only. No personal mobiles, no names of
// individual officers. Every row carries a source and a verified flag; add rows only from official pages.
(function () {
  const { h, chipGroup } = PV.ui;

  // The 29 municipal corporations of Maharashtra. `listed` = offices below exist for it.
  const CITIES = [
    'Mumbai', 'Thane', 'Navi Mumbai', 'Kalyan-Dombivli', 'Mira-Bhayandar', 'Vasai-Virar', 'Bhiwandi-Nizampur',
    'Ulhasnagar', 'Panvel', 'Pune', 'Pimpri-Chinchwad', 'Nashik', 'Malegaon', 'Dhule', 'Jalgaon', 'Ahilyanagar',
    'Solapur', 'Kolhapur', 'Sangli-Miraj-Kupwad', 'Ichalkaranji', 'Nagpur', 'Amravati', 'Akola',
    'Nanded-Waghala', 'Latur', 'Parbhani', 'Chhatrapati Sambhajinagar', 'Jalna', 'Chandrapur'
  ];

  // verified: true = copied from the official site; false = from a news report or third-party page, confirm before relying.
  const OFFICES = [
    { city: 'Pune', name: 'PMC control room (garbage, burning, sanitation complaints)', kind: 'Control room', phones: ['020-25501259', '020-25506800'], area: 'Whole PMC area', pincodes: [], source: 'https://www.freepressjournal.in/pune/pune-administration-issues-disaster-helpline-numbers-amid-heavy-rainfall-urges-citizens-to-stay-alert', verified: false, note: 'PMC has 15 ward offices, reorganised after the 2026 elections. Ask the control room which ward office covers your street, or check pmc.gov.in.' },
    { city: 'Pimpri-Chinchwad', name: 'PCMC helpline', kind: 'Helpline', phones: ['020-67331111'], area: 'Whole PCMC area', pincodes: [], source: 'https://www.freepressjournal.in/pune/pune-administration-issues-disaster-helpline-numbers-amid-heavy-rainfall-urges-citizens-to-stay-alert', verified: false },
    { city: 'Pimpri-Chinchwad', name: 'G Regional Office (Purandar)', kind: 'Ward office', phones: [], area: 'Wards 22, 23, 24', address: 'New Administrative Building, behind Dilip Vengsarkar Cricket Academy, Thergaon, Pune 411033', pincodes: [], source: 'https://www.punekarnews.in/?p=235142', verified: false },
    { city: 'Pimpri-Chinchwad', name: 'H Regional Office (Pratapgad)', kind: 'Ward office', phones: [], area: 'Wards 30, 31, 32', address: "Women's ITI Building, Kasarwadi, Pune", pincodes: [], source: 'https://www.punekarnews.in/?p=235142', verified: false },
    { city: 'Pimpri-Chinchwad', name: 'J Regional Office (Raigad)', kind: 'Ward office', phones: [], area: 'Wards 16, 25, 26', address: 'Survey No. 27, Municipal Vehicle Depot Building, Tathawade, Pune 411033', pincodes: [], source: 'https://www.punekarnews.in/?p=235142', verified: false },
    { city: 'Pimpri-Chinchwad', name: 'L Regional Office (Lohgad)', kind: 'Ward office', phones: [], area: 'Wards 2, 6, 7, 8', address: 'MHADA, Plot E-2, Sant Tukaram Nagar, opposite Police Station, Pimpri, Pune 411018', pincodes: [], source: 'https://www.punekarnews.in/?p=235142', verified: false, note: 'PCMC grew from 8 to 10 regional offices in May 2026. Phone numbers for the new offices are not yet added.' },
    { city: 'Pune', name: 'MPCB Sub-Regional Office, Pune-I (industrial and burning complaints, PMC area)', kind: 'State pollution board', phones: ['020-25811694'], area: 'Pune Municipal Corporation area and nearby talukas', address: 'Jog Centre, 3rd floor, Mumbai-Pune Road, Wakdewadi, Pune 411003', pincodes: [], source: 'https://mpcb.gov.in/en/node/4021', verified: true },
    { city: 'Pimpri-Chinchwad', name: 'MPCB Sub-Regional Office, Pimpri-Chinchwad', kind: 'State pollution board', phones: ['020-25810222'], area: 'PCMC area including MIDC Pimpri, Bhosari, Akurdi', address: 'Jog Centre, 3rd floor, Mumbai-Pune Road, Wakdewadi, Pune 411003', pincodes: [], source: 'https://mpcb.gov.in/en/node/4021', verified: true }
  ];

  const STATE_FALLBACK = [
    ['SAMEER app (CPCB)', 'Complain about burning, dust and industrial smoke anywhere in India.'],
    ['Swachhata app (MoHUA)', 'Report garbage dumps and burning to your municipal corporation.'],
    ['MPCB (Maharashtra Pollution Control Board)', 'Factories, kilns and generators: mpcb.gov.in lists regional and sub-regional offices.']
  ];

  const tel = n => `<a href="tel:${n.replace(/[^\d+]/g, '')}">${n}</a>`;
  const card = o => `
    <div class="off">
      <p class="mini-h">${o.kind} · ${o.city}</p>
      <h4>${o.name}</h4>
      ${o.area ? `<p class="note" style="margin:0 0 6px">Covers: ${o.area}</p>` : ''}
      ${o.address ? `<p style="margin:0 0 6px">📍 ${o.address}</p>` : ''}
      <p style="margin:0 0 6px">${o.phones.length ? '📞 ' + o.phones.map(tel).join(' · ') : '<span class="note">Phone not added yet: check the official site.</span>'}</p>
      ${o.note ? `<p class="note" style="margin:0 0 6px">${o.note}</p>` : ''}
      <p class="note" style="margin:0"><span class="tag" style="margin:0 6px 0 0">${o.verified ? 'Official source' : 'Confirm before relying'}</span><a href="${o.source}" target="_blank" rel="noopener noreferrer">Source ↗</a></p>
    </div>`;

  function finder() {
    const el = document.getElementById('officialsFinder');
    if (!el) return;
    el.innerHTML = `
      <input class="input" id="offQ" type="search" placeholder="Pin code, area or city, e.g. 411018 or Pune" aria-label="Search by pin code, area or city">
      <div class="chips small" id="offCities"></div>
      <div id="offOut" aria-live="polite"></div>
      <p class="note" style="margin-top:12px">Pin codes are postal zones and do not line up with ward boundaries, so a pin code can fall in more than one ward. Always confirm your ward with the control room. Only official office numbers are listed, never personal numbers. Coverage is growing city by city.</p>`;
    const out = el.querySelector('#offOut'), q = el.querySelector('#offQ');
    const listed = new Set(OFFICES.map(o => o.city));
    const fallback = () => `<div class="off"><h4>Report from anywhere in Maharashtra</h4><ul class="ticks">${STATE_FALLBACK.map(([n, d]) => `<li><b>${n}:</b> ${d}</li>`).join('')}</ul></div>`;
    const draw = () => {
      const s = q.value.trim().toLowerCase();
      if (!s) { out.innerHTML = `<p class="note">${listed.size} of ${CITIES.length} municipal corporations have offices listed so far. Search or pick a city.</p>` + fallback(); return; }
      let hits;
      if (/^\d{6}$/.test(s)) hits = OFFICES.filter(o => o.pincodes.includes(s));
      else hits = OFFICES.filter(o => (o.city + ' ' + o.name + ' ' + (o.area || '') + ' ' + (o.address || '')).toLowerCase().includes(s));
      if (hits.length) { out.innerHTML = hits.map(card).join('') + fallback(); return; }
      const city = CITIES.find(c => c.toLowerCase() === s);
      out.innerHTML = `<div class="off"><h4>${city ? city + ': not added yet' : 'No match yet'}</h4><p>${city ? 'We have no verified ward-office numbers for this city yet.' : 'That pin code or area is not mapped to a ward yet. Try your city name.'} Use your municipal corporation's website or the options below.</p></div>` + fallback();
    };
    chipGroup(el.querySelector('#offCities'), CITIES.map(c => [c, c + (listed.has(c) ? '' : ' ·')]), null, c => { q.value = c; draw(); }, 'g');
    q.addEventListener('input', draw);
    draw();
  }

  PV.officials = { CITIES, OFFICES };
  const prev = PV.render.act;
  PV.render.act = function () { prev(); finder(); };
})();
