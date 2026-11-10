// Builds js/pincodes.js from India Post's All India Pincode Directory (data.gov.in, Government Open Data Licence – India).
// The directory ships as data/pincodes.json.gz in the india-pincode npm package (npm pack india-pincode).
// Usage: node tools/build-pincodes.js <pincodes.json.gz> "<District|ST,...>" js/pincodes.js
// The second argument lists the districts (as spelled in the output, e.g. "Pune|MH") whose post-office names
// become searchable localities: use the districts of every city in CITY in js/officials.js.
const zlib = require('zlib'), fs = require('fs');
const rows = JSON.parse(zlib.gunzipSync(fs.readFileSync(process.argv[2])));
const ST = { 'ANDAMAN AND NICOBAR ISLANDS': 'AN', 'ANDHRA PRADESH': 'AP', 'ARUNACHAL PRADESH': 'AR', 'ASSAM': 'AS', 'BIHAR': 'BR', 'CHANDIGARH': 'CH', 'CHHATTISGARH': 'CG', 'DELHI': 'DL', 'GOA': 'GA', 'GUJARAT': 'GJ', 'HARYANA': 'HR', 'HIMACHAL PRADESH': 'HP', 'JAMMU AND KASHMIR': 'JK', 'JHARKHAND': 'JH', 'KARNATAKA': 'KA', 'KERALA': 'KL', 'LADAKH': 'LA', 'LAKSHADWEEP': 'LD', 'MADHYA PRADESH': 'MP', 'MAHARASHTRA': 'MH', 'MANIPUR': 'MN', 'MEGHALAYA': 'ML', 'MIZORAM': 'MZ', 'NAGALAND': 'NL', 'ODISHA': 'OD', 'PUDUCHERRY': 'PY', 'PUNJAB': 'PB', 'RAJASTHAN': 'RJ', 'SIKKIM': 'SK', 'TAMIL NADU': 'TN', 'TELANGANA': 'TG', 'THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU': 'DH', 'TRIPURA': 'TR', 'UTTAR PRADESH': 'UP', 'UTTARAKHAND': 'UK', 'WEST BENGAL': 'WB' };
const CIRCLE = { 'Andhra Pradesh Circle': 'AP', 'Assam Circle': 'AS', 'Bihar Circle': 'BR', 'Chattisgarh Circle': 'CG', 'Chhattisgarh Circle': 'CG', 'Delhi Circle': 'DL', 'Gujarat Circle': 'GJ', 'Haryana Circle': 'HR', 'Himachal Pradesh Circle': 'HP', 'Jammu & Kashmir Circle': 'JK', 'Jharkhand Circle': 'JH', 'Karnataka Circle': 'KA', 'Kerala Circle': 'KL', 'Madhya Pradesh Circle': 'MP', 'Maharashtra Circle': 'MH', 'North Eastern Circle': null, 'Odisha Circle': 'OD', 'Punjab Circle': 'PB', 'Rajasthan Circle': 'RJ', 'Tamilnadu Circle': 'TN', 'Tamil Nadu Circle': 'TN', 'Telangana Circle': 'TG', 'Uttar Pradesh Circle': 'UP', 'Uttarakhand Circle': 'UK', 'West Bengal Circle': 'WB' };
const title = s => s.toLowerCase().replace(/(^|[\s(.-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
// Districts that have a curated municipal body: post-office names there become searchable localities.
const LOC_D = new Set((process.argv[3] || '').split(','));
const pin = {}, circ = {}, loc = new Map();
for (const r of rows) {
  if (!/^\d{6}$/.test(r.p)) continue;
  circ[r.p] = circ[r.p] || r.c;
  if (r.s === 'NA' || r.i === 'NA' || !ST[r.s]) continue;
  const k = title(r.i.trim()) + '|' + ST[r.s];
  (pin[r.p] = pin[r.p] || {})[k] = (pin[r.p][k] || 0) + 1;
  if (r.t !== 'BO' && LOC_D.has(k)) {
    const n = r.o.replace(/\s*\b(S\.?O|H\.?O|B\.?O|G\.?P\.?O|MDG|SO|HO|BO)\b\.?\s*$/i, '').replace(/\s+/g, ' ').trim();
    if (n.length > 2) loc.set(n.toLowerCase() + '|' + r.p, n + '|' + r.p);
  }
}
// Pins with only NA rows: fall back to the state from the postal circle (district unknown).
for (const p in circ) if (!pin[p]) { const s = CIRCLE[circ[p]]; if (s) pin[p] = { ['|' + s]: 1 }; }
const D = [], DI = {};
const di = k => DI[k] ?? (DI[k] = D.push(k) - 1);
const pins = Object.keys(pin).sort();
let out = [], prevPin = 0, prevD = -1; const extra = [];
for (const p of pins) {
  const ds = Object.entries(pin[p]).sort((a, b) => b[1] - a[1]).map(e => di(e[0]));
  const delta = (+p - prevPin).toString(36); prevPin = +p;
  out.push(ds[0] === prevD ? delta : delta + ':' + ds[0].toString(36)); prevD = ds[0];
  if (ds.length > 1) extra.push(p + ':' + ds.slice(1).map(x => x.toString(36)).join(','));
}
const L = [...loc.values()].sort().map(s => { const [n, p] = s.split('|'); return n + '|' + p; });
const js = `// Pin code → district and state, built from India Post's All India Pincode Directory (data.gov.in, Government Open Data Licence – India).
// ${pins.length} pin codes, ${D.length} districts. Regenerate with tools/build-pincodes.js; do not edit by hand.
PV.pinData = {
  d: ${JSON.stringify(D)},
  p: '${out.join('.')}',
  x: '${extra.join(';')}',
  loc: ${JSON.stringify(L.join(';'))}
};
`;
fs.writeFileSync(process.argv[4], js);
console.log('pins', pins.length, 'districts', D.length, 'extra', extra.length, 'loc', L.length, 'bytes', js.length);
