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

  // ---- Mumbai (BMC): 24 ward control rooms. Numbers come from a third-party compilation of BMC's published list; confirm at mcgm.gov.in.
  const BMC_SRC = 'https://complainthub.org/bmc-mumbai-help/';
  OFFICES.push({ city: 'Mumbai', name: 'BMC citizen helpline', kind: 'Helpline', phones: ['1916'], area: 'All of Mumbai', pincodes: [], source: BMC_SRC, verified: false, note: 'Toll-free. Unresolved complaints can be escalated to the ward Assistant Commissioner.' });
  [
    ['A', 'Colaba, Fort, Churchgate', ['022-22624000', '022-22661353'], '134-E, Shahid Bhagat Singh Marg, Fort, Mumbai 400001'],
    ['B', 'Dongri, Sandhurst Road, Mohammed Ali Road', ['022-23794000', '022-23736622'], '121, Ramchandra Bhatt Marg, Babula Tank Cross Lane, opp. J J Hospital, Mumbai 400009'],
    ['C', 'Marine Lines, Kalbadevi, Bhuleshwar', ['022-22014000', '022-22014022'], '76, Shrikant Palekar Marg, Chandanwadi, Mumbai 400002'],
    ['D', 'Grant Road, Girgaon, Malabar Hill, Tardeo', ['022-23864000', '022-23861426'], 'Jobanputra Compound, Nana Chowk, Grant Road (W), Mumbai 400007'],
    ['E', 'Byculla, Mazgaon, Agripada', ['022-23014000', '022-23081471'], '10, Shaikh Hafizuddin Marg, Byculla (W), Mumbai 400008'],
    ['F/South', 'Parel, Lalbaug, Sewri', ['022-24103000', '022-24134560'], 'Dr Ambedkar Marg and Jagannath Bhatankar Marg junction, Parel, Mumbai 400012'],
    ['F/North', 'Matunga, Sion, Wadala', ['022-24084000', '022-24024353'], 'Plot 96, Bhau Daji Road, Kings Circle, Matunga (E), Mumbai 400019'],
    ['G/North', 'Dadar, Mahim, Dharavi', ['022-24397888', '022-24397800'], 'Harishchandra Yelve Marg, behind Plaza Cinema, Dadar (W), Mumbai 400028'],
    ['G/South', 'Worli, Lower Parel, Prabhadevi', ['022-24224000', '022-24305031'], 'Dhanmill Naka, N M Joshi Marg, Mumbai 400013'],
    ['H/East', 'Santacruz (E), Vakola, Kalina', ['022-26114000', '022-26138900'], 'Plot 137, TPS IV, Road 2, Prabhat Colony, Santacruz (E), Mumbai 400055'],
    ['H/West', 'Bandra (W), Khar (W), Santacruz (W)', ['022-26444000', '022-26422311'], 'Saint Martins Road, behind Bandra Police Station, Bandra (W), Mumbai 400050'],
    ['K/East', 'Andheri (E), Jogeshwari (E), Vile Parle (E)', ['022-26847000', '022-26816730'], 'Azad Road, Gundavali, Andheri (E), Mumbai 400069'],
    ['K/West', 'Andheri (W), Juhu, Versova, Vile Parle (W)', ['022-26239131'], 'Paliram Road, opp. Andheri Railway Station, Andheri (W), Mumbai 400058'],
    ['P/North', 'Malad, Malvani, Marve', ['022-28826000', '022-28823266'], 'Liberty Garden, Mamlatdar Wadi Marg, Malad (W), Mumbai 400064'],
    ['P/South', 'Goregaon, Aarey', ['022-28727000', '022-28737000'], 'CTS 746, Pahadi, S V Road, Goregaon (W), Mumbai 400104'],
    ['R/Central', 'Borivali, Gorai', ['022-28931188', '022-28946000'], 'Chandavarkar Road, near Borivali Station, Borivali (W), Mumbai'],
    ['R/North', 'Dahisar', ['022-28936000', '022-28920247'], 'Municipal Office Building, Rustomji Colony, Rangnath Keskar Marg, Dahisar (W), Mumbai 400068'],
    ['R/South', 'Kandivali, Charkop', ['022-28054788', '022-28056000'], 'Mahatma Gandhi Cross Road 2, near Sardar V Patel Swimming Pool, Kandivali (W), Mumbai 400067'],
    ['L', 'Kurla, Sakinaka', ['022-26505109', '022-26505103'], 'Laxmanrao Yadav Market Building, S V Barve Marg, Kurla (W), Mumbai 400070'],
    ['M/East', 'Govandi, Deonar, Mankhurd', ['022-25558789', '022-25502270'], 'Madhukar Tukaram Marg, Deonar Colony, Govandi, Mumbai 400043'],
    ['M/West', 'Chembur, Tilak Nagar', ['022-25284000', '022-25225000'], 'Prakash Thorat Marg, near Natraj Cinema, Chembur (W), Mumbai 400071'],
    ['N', 'Ghatkopar, Vidyavihar', ['022-25013000', '022-25010161'], 'Jawahar Road, Ghatkopar (E), Mumbai 400077'],
    ['S', 'Bhandup, Vikhroli, Powai, Kanjurmarg', ['022-25954000', '022-25947570'], 'L B S Marg, Mangatram Petrol Pump, Bhandup (W), Mumbai 400078'],
    ['T', 'Mulund', ['022-25694000', '022-25645291'], 'Lala Devidayal Marg, Panch Rasta, Mulund (W), Mumbai 400080']
  ].forEach(([w, area, phones, address]) => OFFICES.push({ city: 'Mumbai', name: `${w} Ward control room (BMC)`, kind: 'Ward office', phones, area, address, pincodes: [], source: BMC_SRC, verified: false }));

  // ---- Nagpur (NMC): 10 zones. The zone pages on nmcnagpur.gov.in also list individual officers' mobiles; those are deliberately left out.
  const NMC = 'https://www.nmcnagpur.gov.in/';
  [
    [1, 'Laxmi Nagar', null, 'laxmi-nagar', false], [2, 'Dharampeth', 'Near Gokulpeth Market, Dharampeth, Nagpur', 'dharampeth', false],
    [3, 'Hanuman Nagar', 'Tukdoji Putla Square, Jawahar Nagar, Manewada Road, Nagpur', 'hanuman-nagar', true], [4, 'Dhantoli', 'Near Dhantoli Railway Bridge, Ghat Road, Nagpur', 'dhantoli', true],
    [5, 'Nehru Nagar', null, 'nehru-nagar', false], [6, 'Gandhibagh', null, 'gandhibagh', false],
    [7, 'Satranjipura', null, 'satranjipura', true], [8, 'Lakadganj', null, 'lakadganj', true],
    [9, 'Ashi Nagar', null, 'ashi-nagar', false], [10, 'Mangalwari', 'Koradi Road, near NMC School, Mangalwari, Nagpur', 'mangalwari', false]
  ].forEach(([n, name, address, slug, ok]) => OFFICES.push({ city: 'Nagpur', name: `Zone ${String(n).padStart(2, '0')}: ${name} zone office (NMC)`, kind: 'Ward office', phones: ['0712-2567035'], area: `${name} zone`, address: address || undefined, pincodes: [], source: ok ? NMC + slug : NMC, verified: ok, note: n === 1 ? 'NMC has 10 zones; a proposal to add more zones was debated in August 2026. 0712-2567035 is the number NMC lists on its zone pages.' : undefined }));

  // ---- Chhatrapati Sambhajinagar (CSMC): headquarters only for now.
  OFFICES.push({ city: 'Chhatrapati Sambhajinagar', name: 'CSMC headquarters (cleanliness, garbage and burning complaints)', kind: 'Headquarters', phones: ['0240-2333536', '0240-2333537'], area: 'Whole CSMC area', address: 'Main Building, Town Hall, behind Head Post Office, Chhatrapati Sambhajinagar 431001', pincodes: [], source: 'https://chhsambhajinagarmc.org/f9a40a4780f5e1306c46f1c8daecee3b', verified: true, note: 'CSMC runs numbered zones (up to Zone 10). Its site has a zone-office list (विभागीय कार्यालयांची यादी); zone numbers are not added here yet.' });

  // Pin codes only identify the city, not the ward. Pune and Pimpri-Chinchwad share the 411xxx range.
  const CITY_PINS = [
    [400001, 400104, ['Mumbai']], [411001, 411062, ['Pune', 'Pimpri-Chinchwad']], [431001, 431010, ['Chhatrapati Sambhajinagar']], [440001, 440037, ['Nagpur']]
  ];
  const citiesForPin = pin => { const n = +pin, r = CITY_PINS.find(([a, b]) => n >= a && n <= b); return r ? r[2] : []; };

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
      if (/^\d{6}$/.test(s)) {
        hits = OFFICES.filter(o => o.pincodes.includes(s));
        if (!hits.length) {
          const cs = citiesForPin(s);
          if (cs.length) { out.innerHTML = `<p class="note">Pin code ${s} is in ${cs.join(' or ')}. Pin codes do not match ward boundaries, so here are all offices there. Pick the one whose area matches your locality.</p>` + OFFICES.filter(o => cs.includes(o.city)).map(card).join('') + fallback(); return; }
        }
      }
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
