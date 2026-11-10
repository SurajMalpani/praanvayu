// "Find your local officials": municipal helplines, ward/zone offices, state grievance portals and pollution
// control boards, searchable by pin code, city, district, state or locality, anywhere in India.
// Data policy: official offices and published helpline/office numbers only. No personal mobiles, no names of
// individual officers. Every row carries a source and a verified flag (true = copied from the body's own site;
// false = news report or third-party compilation, confirm before relying). Pin → district data lives in
// js/pincodes.js and is loaded on first use.
(function () {
  const { chipGroup } = PV.ui;

  /* ================= national channels (work everywhere) ================= */
  const NATIONAL = [
    { name: 'Swachhata-MoHUA app', what: 'Photograph a garbage dump, uncleared bin, open burning or missed sweeping. The complaint goes to your town\'s municipal body, in every city and town in India.', link: ['sbmurban.org/swachhtha-app', 'https://sbmurban.org/swachhtha-app'] },
    { name: 'SAMEER app (CPCB)', what: 'Complain about garbage or biomass burning, road dust, construction dust and industrial smoke. Search "SAMEER" on Android or iOS.' },
    { name: 'Safai Mitra Suraksha helpline 14420', what: 'Toll-free, for blocked sewers and septic-tank cleaning. Listed by many city corporations.', src: 'https://complainthub.org/lmc-lucknow/' },
    { name: 'CPGRAMS (Government of India)', what: 'If your city and state do not respond, file a grievance at pgportal.gov.in. It is also the official route in Nagaland, Lakshadweep and Dadra & Nagar Haveli and Daman & Diu.', link: ['pgportal.gov.in', 'https://pgportal.gov.in/'] }
  ];

  /* ================= states and union territories ================= */
  // pcb: [name, office phones, address, website] of the State Pollution Control Board / Committee
  //      (factories, kilns, generators, large-scale burning). Addresses and office numbers come from CPCB's
  //      directory of SPCBs/PCCs (copy hosted at DIR; cpcb.nic.in blocks automated reading).
  // gr:  [name, url, phones, source, note] of the state's official public grievance portal. Every one listed
  //      accepts complaints about municipal corporations, councils and gram panchayats. Source: GR_IDX unless given.
  // more: extra state-wide channels, as text or [text, source, whatsapp].
  const DIR = 'https://www.sggs.ac.in/uploads/pdf_files/1481_7194.pdf';
  const CH = 'https://citizen.complainthub.org/t/';
  const GR_IDX = CH + 'where-can-you-file-complaints-against-government-offices-departments-and-public-services/104';
  const STATES = {
    AN: { n: 'Andaman and Nicobar Islands', pcb: ['Andaman & Nicobar Pollution Control Committee', ['03192-230661'], 'Science & Technology Bhawan, Dollygunge, Port Blair 744102'], gr: ['Lt Governor\'s Helpdesk', 'https://db.and.nic.in/lghelpdesk/'] },
    AP: { n: 'Andhra Pradesh', pcb: ['Andhra Pradesh Pollution Control Board', ['0866-2463200'], 'Paryavaran Bhavan, APIIC Colony, Gurunanak Colony, Vijayawada 520007'], gr: ['PGRS (CM\'s grievance system)', 'https://pgrs.ap.gov.in/', ['1902'], CH + 'how-can-you-file-complaints-about-government-offices-to-andhra-pradesh-chief-ministers-public-grievance-redressal-system-ap-cmpgrs/1793'] },
    AR: { n: 'Arunachal Pradesh', pcb: ['Arunachal Pradesh State Pollution Control Board', ['0360-2212595'], 'Paryavaran Bhawan, Papu Hill, Yupia Road, Naharlagun 791110'], gr: ['CM e-Jansunwai', 'https://cmejansunwai.arunachal.gov.in/'] },
    AS: { n: 'Assam', pcb: ['Pollution Control Board, Assam', ['0361-2652774', '0361-2550258'], 'Bamunimaidan, Guwahati 781021', 'https://pcb.assam.gov.in/'], gr: ['Write to CM (Assam)', 'https://cm.assam.gov.in/write-to-cm'] },
    BR: { n: 'Bihar', pcb: ['Bihar State Pollution Control Board', ['0612-2261250', '0612-2262265'], 'Parivesh Bhawan, Plot NS-B/2, Patliputra Industrial Area, Patna 800023', 'https://bspcb.bihar.gov.in/'], gr: ['Lok Shikayat', 'https://lokshikayat.bihar.gov.in/', ['1800-345-6284'], CH + 'how-can-i-file-complaints-about-government-offices-to-bihar-lok-shikayat-public-grievance-system/2012'] },
    CH: { n: 'Chandigarh', pcb: ['Chandigarh Pollution Control Committee', ['0172-2740008'], 'Paryavaran Bhawan, Sector 19-B, Madhya Marg, Chandigarh 160019'], gr: ['eServices grievance registration', 'https://eservices.chd.gov.in/RegisterGrievance.aspx'] },
    CG: { n: 'Chhattisgarh', pcb: ['Chhattisgarh Environment Conservation Board', ['0771-2512270', '0771-2510793'], 'Paryavas Bhavan, North Block, Sector 19, Atal Nagar, Raipur 492002', 'https://enviscecb.org/'], gr: ['Jan Shikayat', 'https://janshikayat.cg.nic.in/', ['1100'], CH + 'how-can-i-file-complaints-about-government-offices-to-public-grievance-redressal-department-jan-shikayat-chhattisgarh/1585', '1100 is listed for municipal corporation issues.'] },
    DH: { n: 'Dadra and Nagar Haveli and Daman and Diu', pcb: ['Pollution Control Committee, DNH & DD', ['0260-2230698'], '1st floor, Udyog Bhavan, Bhenslore, Dunetha, Nani Daman 396210'], gr: ['CPGRAMS', 'https://pgportal.gov.in/'] },
    DL: { n: 'Delhi', pcb: ['Delhi Pollution Control Committee (DPCC)', ['011-23392108'], '4th & 5th floor, ISBT Building, Kashmere Gate, Delhi 110006'], gr: ['Public Grievance Monitoring System', 'https://pgms.delhi.gov.in/'], more: ['During GRAP periods, CAQM and the Green Delhi app also take dust and burning complaints.'] },
    GA: { n: 'Goa', pcb: ['Goa State Pollution Control Board', ['0832-2407700'], 'Near Pilerne Industrial Estate, opp. Saligao Seminary, Saligao, Bardez 403511', 'https://goaspcb.gov.in/'], gr: ['Directorate of Public Grievances', 'https://dpg.goa.gov.in/', ['93193-34335'], CH + 'how-can-you-file-complaints-about-government-offices-to-directorate-of-public-grievances-dpg-goa/3228', 'Helpline weekdays 9:30 am to 5:45 pm. WhatsApp 89566-42400.'] },
    GJ: { n: 'Gujarat', pcb: ['Gujarat Pollution Control Board', ['079-23232152', '079-23222425'], 'Paryavaran Bhavan, Sector 10-A, Gandhinagar 382010', 'https://gpcb.gujarat.gov.in/'], gr: ['SWAGAT (CMO grievance cell)', 'https://swagat.gujarat.gov.in/', ['079-23250073'], CH + 'how-can-you-file-complaints-about-government-offices-to-gujarat-cmo-public-grievance-cell-samadhan/1980'] },
    HR: { n: 'Haryana', pcb: ['Haryana State Pollution Control Board', ['0172-2581005', '0172-2581006'], 'C-11, Sector 6, Panchkula 134109'], gr: ['CM Window', 'https://cmharyanacell.nic.in/', [], CH + 'how-can-you-file-complaints-about-government-offices-to-haryana-cm-grievance-cell-cm-window/1465'] },
    HP: { n: 'Himachal Pradesh', pcb: ['Himachal Pradesh State Pollution Control Board', ['0177-2621867', '0177-2673274'], 'Him Parivesh, Phase III, New Shimla 171009', 'https://hppcb.hp.gov.in/'], gr: ['CM Sewa Sankalp', 'https://cmsankalp.hp.gov.in/'] },
    JK: { n: 'Jammu and Kashmir', pcb: ['J&K Pollution Control Committee', ['0191-2476927', '0191-2472881'], 'Parivesh Bhawan, Gladni, Narwal, Jammu 180004 (November to April); Sheikh-ul-Alam Campus, Rajbagh, Srinagar (May to October)'], gr: ['JK Samadhan', 'https://samadhan.jk.gov.in/publicGrievance'] },
    JH: { n: 'Jharkhand', pcb: ['Jharkhand State Pollution Control Board', ['0651-2400852', '0651-2400851'], 'T.A. Building, HEC, P.O. Dhurwa, Ranchi 834004'], gr: ['CMO Jharkhand grievances', 'https://cm.jharkhand.gov.in/node/958/'] },
    KA: { n: 'Karnataka', pcb: ['Karnataka State Pollution Control Board', ['080-25589112', '080-25591413'], 'Parisara Bhavan, 4th & 5th floor, #49 Church Street, Bengaluru 560001'], gr: ['Janaspandana (IPGRS)', 'https://ipgrs.karnataka.gov.in/', ['1902'], CH + 'how-can-you-file-complaints-about-government-offices-and-public-service-to-janaspandana-ipgrs-karnataka/1492'] },
    KL: { n: 'Kerala', pcb: ['Kerala State Pollution Control Board', ['0471-2318150', '0471-2318151'], 'Plamoodu Junction, Pattom Palace P.O., Thiruvananthapuram 695004'], gr: ['CM\'s Public Grievance Redressal Cell', 'https://complaints.cmo.kerala.gov.in/', ['1076'], CH + 'how-can-i-lodge-complaints-about-government-offices-to-chief-ministers-public-grievance-redressal-cell-cmpgrc-kerala/1607'], more: [['Waste-dumping WhatsApp (Local Self Government Department, statewide): send a photo and location. Fines are levied and informants rewarded.', 'https://keralakaumudi.com/en/news/kerala/general/whatsapp-number-system-for-reporting-waste-dumping-rs-129750-given-as-rewards-so-far-1613165', '919446700800']] },
    LA: { n: 'Ladakh', pcb: ['Ladakh Pollution Control Committee', [], 'Leh'], gr: ['Ladakh grievance redressal', 'https://grievance.ladakh.gov.in/'] },
    LD: { n: 'Lakshadweep', pcb: ['Lakshadweep Pollution Control Committee', ['04896-262256'], 'Department of Science & Technology, Kavaratti 682555'], gr: ['CPGRAMS', 'https://pgportal.gov.in/'] },
    MP: { n: 'Madhya Pradesh', pcb: ['Madhya Pradesh Pollution Control Board', ['0755-2466735', '0755-2463143'], 'Paryavaran Parisar, E-5 Arera Colony, Bhopal 462016'], gr: ['CM Helpline', 'https://cmhelpline.mp.gov.in/', ['181'], CH + 'how-can-you-file-complaints-about-government-offices-to-cm-helpline-of-madhya-pradesh-mp/1727', 'Toll-free; covers municipal corporations, nagar palikas and gram panchayats.'] },
    MH: { n: 'Maharashtra', pcb: ['Maharashtra Pollution Control Board (head office)', ['022-24010706', '022-24042418'], 'Kalpataru Point, 2nd–4th floor, opp. Cine Planet, near Sion Circle, Sion (E), Mumbai 400022', 'https://mpcb.gov.in/'], gr: ['Aaple Sarkar grievance portal', 'https://grievances.maharashtra.gov.in/', ['1800-120-8040'], CH + 'how-can-i-file-complaints-about-government-offices-to-maharashtra-cmo-public-grievance-system-aaple-sarkar/2026'], more: ['MPCB regional and sub-regional offices are listed at mpcb.gov.in.'] },
    MN: { n: 'Manipur', pcb: ['Manipur Pollution Control Board', [], 'Lamphelpat, near Imphal West DC Office, Imphal'], gr: ['CM Da Haisi', 'https://cmdahaisi.mn.gov.in/'] },
    ML: { n: 'Meghalaya', pcb: ['Meghalaya State Pollution Control Board', ['0364-2522802', '0364-2521217'], 'Arden, Lumpyngngad, Shillong 793014'], gr: ['MePGRAMS', 'https://megpgrams.gov.in/index.htm'] },
    MZ: { n: 'Mizoram', pcb: ['Mizoram Pollution Control Board', ['0389-2336591', '0389-2336590'], 'New Secretariat Complex, Khatla, Aizawl 796001'], gr: ['Mipui Aw', 'https://mipuiaw.mizoram.gov.in/'] },
    NL: { n: 'Nagaland', pcb: ['Nagaland Pollution Control Board', ['03862-245726'], 'Signal Point, Dimapur 797112'], gr: ['CPGRAMS', 'https://pgportal.gov.in/'] },
    OD: { n: 'Odisha', pcb: ['State Pollution Control Board, Odisha', ['0674-2562368', '0674-2534300'], 'A-118, Nilakantha Nagar, Unit VIII, Bhubaneswar 751012', 'https://ospcboard.org/'], gr: ['Jana Sunani', 'https://janasunani.odisha.gov.in/', [], CH + 'how-can-you-file-complaints-about-government-offices-to-department-of-public-grievance-of-odisha/1525', 'WhatsApp help for the portal: 63709-51930.'] },
    PY: { n: 'Puducherry', pcb: ['Puducherry Pollution Control Committee', ['0413-2201256', '0413-2203494'], 'Housing Board Complex, Anna Nagar, Puducherry'], gr: ['LG Redressal', 'https://lgredressal.py.gov.in/pgrs/grievanceregister.aspx'] },
    PB: { n: 'Punjab', pcb: ['Punjab Pollution Control Board', ['0175-2215793'], 'Vatavaran Bhawan, Nabha Road, Patiala 147001', 'https://ppcb.punjab.gov.in/'], gr: ['Connect Punjab', 'https://connect.punjab.gov.in/', ['1100'], CH + 'how-can-i-file-complaints-about-government-offices-to-department-of-public-grievance-of-punjab-cm-helpline/1713'] },
    RJ: { n: 'Rajasthan', pcb: ['Rajasthan State Pollution Control Board', ['0141-2711263', '0141-2716803'], '4, Jhalana Institutional Area, Jhalana Doongri, Jaipur 302004'], gr: ['Rajasthan Sampark', 'https://sampark.rajasthan.gov.in/', ['181'], CH + 'how-can-i-file-complaints-about-government-offices-to-redressal-of-public-grievances-department-through-rajasthan-sampark/1904', 'Toll-free; covers municipal corporations, nagar palikas and gram panchayats.'] },
    SK: { n: 'Sikkim', pcb: ['Sikkim State Pollution Control Board', ['03592-281913'], 'Forest, Environment & Wildlife Management Department, Deorali, Gangtok 737102'], gr: ['Sikkim grievance portal', 'https://grievancerdd.sikkim.gov.in/'] },
    TN: { n: 'Tamil Nadu', pcb: ['Tamil Nadu Pollution Control Board', ['044-22353134', '044-22353076'], '76, Mount Salai, Guindy, Chennai 600032', 'https://tnpcb.gov.in/'], gr: ['CM Helpline', 'https://cmhelpline.tnega.org/', ['1100'], CH + 'how-can-you-file-complaints-about-government-offices-to-tamil-nadu-public-grievance-cm-helpline-management-system-iipgcms/1955'] },
    TG: { n: 'Telangana', pcb: ['Telangana Pollution Control Board', ['040-23887518', '040-23452620'], 'Paryavaran Bhawan, A-3 Industrial Estate, Sanathnagar, Hyderabad 500018'], gr: ['Prajavani / CPGRAMS Telangana', 'https://cpgrams.ts.nic.in/citizen/grievance.php'] },
    TR: { n: 'Tripura', pcb: ['Tripura State Pollution Control Board', ['0381-2322462', '0381-2322455'], 'Vigyan Bhawan, Pandit Nehru Complex, Gorkhabasti, Agartala 799006'], gr: ['Tripura grievance portal', 'https://grievance.tripura.gov.in/'] },
    UP: { n: 'Uttar Pradesh', pcb: ['Uttar Pradesh Pollution Control Board', ['0522-2720699', '0522-2720895'], 'TC-12V, Vibhuti Khand, Gomti Nagar, Lucknow 226010'], gr: ['IGRS Jansunwai', 'https://jansunwai.up.nic.in/', [], CH + 'how-can-you-file-complaints-about-government-offices-to-dept-of-public-grievance-through-jansunwai-samadhan-of-uttar-pradesh/1774'], more: [['e-NagarSewa UP takes complaints for every nagar nigam, nagar palika parishad and nagar panchayat: e-nagarsewaup.gov.in (helpdesk 0522-2838128).', CH + 'how-to-file-complaints-about-nagar-nigam-or-nagarpalika-parishad-panchayat-through-e-nagarsewa-up/680']] },
    UK: { n: 'Uttarakhand', pcb: ['Uttarakhand Pollution Control Board', ['0135-2712001', '0135-2607092'], 'Gaura Devi Paryavaran Bhawan, 46-B IT Park, Sahastradhara Road, Dehradun 248001'], gr: ['CM Helpline', 'https://cmhelpline.uk.gov.in/', ['1905'], CH + 'how-to-file-civic-complaints-of-municipal-corporation-and-nagar-parishad-panchayat-through-e-nagarsewa-uk/1645'], more: [['e-NagarSewa covers every nagar nigam, nagar palika and nagar panchayat: enagarsewa.uk.gov.in.', CH + 'how-to-file-civic-complaints-of-municipal-corporation-and-nagar-parishad-panchayat-through-e-nagarsewa-uk/1645']] },
    WB: { n: 'West Bengal', pcb: ['West Bengal Pollution Control Board', ['033-23358213', '033-23355975'], 'Paribesh Bhavan, 10-A Block LA, Sector III, Salt Lake, Kolkata 700106', 'https://wbpcb.gov.in/'], gr: ['CM\'s grievance cell (PGMS)', 'https://cmo.wb.gov.in/', ['91370-91370'], CH + 'how-to-file-complaints-about-government-offices-to-west-bengal-cmo-public-grievance-system-pgms/1916'] }
  };

  /* ================= cities: municipal bodies and the post-office districts they sit in ================= */
  // d: district names exactly as India Post spells them (see js/pincodes.js). aka: other names people search for.
  const DELHI = ['Central', 'East', 'New Delhi', 'North', 'North East', 'North West', 'Shahdara', 'South', 'South East', 'South West', 'West'];
  const CITY = {
    // Maharashtra: all 29 municipal corporations (only some have offices listed yet)
    'Mumbai': { st: 'MH', d: ['Mumbai', 'Mumbai Suburban'], aka: ['bombay', 'bmc', 'mcgm', 'brihanmumbai'] },
    'Thane': { st: 'MH', d: ['Thane'], aka: ['tmc'] }, 'Navi Mumbai': { st: 'MH', d: ['Thane'], aka: ['nmmc', 'vashi', 'nerul'] },
    'Kalyan-Dombivli': { st: 'MH', d: ['Thane'], aka: ['kalyan', 'dombivli', 'kdmc'] }, 'Mira-Bhayandar': { st: 'MH', d: ['Thane'], aka: ['mira road', 'bhayandar'] },
    'Vasai-Virar': { st: 'MH', d: ['Palghar'], aka: ['vasai', 'virar'] }, 'Bhiwandi-Nizampur': { st: 'MH', d: ['Thane'], aka: ['bhiwandi'] },
    'Ulhasnagar': { st: 'MH', d: ['Thane'] }, 'Panvel': { st: 'MH', d: ['Raigad'] },
    'Pune': { st: 'MH', d: ['Pune'], aka: ['poona', 'pmc'] }, 'Pimpri-Chinchwad': { st: 'MH', d: ['Pune'], aka: ['pimpri', 'chinchwad', 'pcmc'] },
    'Nashik': { st: 'MH', d: ['Nashik'], aka: ['nasik'] }, 'Malegaon': { st: 'MH', d: ['Nashik'] }, 'Dhule': { st: 'MH', d: ['Dhule'] }, 'Jalgaon': { st: 'MH', d: ['Jalgaon'] },
    'Ahilyanagar': { st: 'MH', d: ['Ahmednagar'], aka: ['ahmednagar'] }, 'Solapur': { st: 'MH', d: ['Solapur'] }, 'Kolhapur': { st: 'MH', d: ['Kolhapur'] },
    'Sangli-Miraj-Kupwad': { st: 'MH', d: ['Sangli'], aka: ['sangli', 'miraj'] }, 'Ichalkaranji': { st: 'MH', d: ['Kolhapur'] },
    'Nagpur': { st: 'MH', d: ['Nagpur'], aka: ['nmc'] }, 'Amravati': { st: 'MH', d: ['Amravati'] }, 'Akola': { st: 'MH', d: ['Akola'] },
    'Nanded-Waghala': { st: 'MH', d: ['Nanded'], aka: ['nanded'] }, 'Latur': { st: 'MH', d: ['Latur'] }, 'Parbhani': { st: 'MH', d: ['Parbhani'] },
    'Chhatrapati Sambhajinagar': { st: 'MH', d: ['Aurangabad'], aka: ['aurangabad', 'csmc', 'sambhajinagar'] }, 'Jalna': { st: 'MH', d: ['Jalna'] }, 'Chandrapur': { st: 'MH', d: ['Chandrapur'] },
    // Rest of India
    'Delhi': { st: 'DL', d: DELHI, aka: ['new delhi', 'mcd', 'dilli'] },
    'Bengaluru': { st: 'KA', d: ['Bengaluru Urban'], aka: ['bangalore', 'bbmp', 'gba', 'greater bengaluru'] },
    'Hyderabad': { st: 'TG', d: ['Hyderabad', 'Medchal Malkajgiri', 'Ranga Reddy'], aka: ['ghmc', 'secunderabad', 'malkajgiri', 'cyberabad'] },
    'Chennai': { st: 'TN', d: ['Chennai'], aka: ['madras', 'gcc'] },
    'Kolkata': { st: 'WB', d: ['Kolkata'], aka: ['calcutta', 'kmc'] },
    'Ahmedabad': { st: 'GJ', d: ['Ahmadabad'], aka: ['amdavad', 'amc'] },
    'Surat': { st: 'GJ', d: ['Surat'], aka: ['smc'] },
    'Vadodara': { st: 'GJ', d: ['Vadodara'], aka: ['baroda', 'vmc'] },
    'Jaipur': { st: 'RJ', d: ['Jaipur'], aka: ['jmc', 'pink city'] },
    'Lucknow': { st: 'UP', d: ['Lucknow'], aka: ['lmc'] },
    'Kanpur': { st: 'UP', d: ['Kanpur Nagar'], aka: ['cawnpore'] },
    'Ghaziabad': { st: 'UP', d: ['Ghaziabad'] },
    'Noida': { st: 'UP', d: ['Gautam Buddha Nagar'], aka: ['greater noida', 'gautam buddh nagar'] },
    'Gurugram': { st: 'HR', d: ['Gurugram'], aka: ['gurgaon', 'mcg'] },
    'Chandigarh': { st: 'CH', d: ['Chandigarh'], aka: ['mcc'] },
    'Bhopal': { st: 'MP', d: ['Bhopal'] },
    'Indore': { st: 'MP', d: ['Indore'], aka: ['imc'] },
    'Visakhapatnam': { st: 'AP', d: ['Visakhapatanam', 'Anakapalli'], aka: ['vizag', 'gvmc', 'vishakhapatnam'] },
    'Kochi': { st: 'KL', d: ['Ernakulam'], aka: ['cochin', 'ernakulam'] },
    'Thiruvananthapuram': { st: 'KL', d: ['Thiruvananthapuram'], aka: ['trivandrum'] },
    'Guwahati': { st: 'AS', d: ['Kamrup Metro'], aka: ['gauhati', 'gmc'] },
    'Bhubaneswar': { st: 'OD', d: ['Khordha'], aka: ['bhubaneshwar'] },
    'Raipur': { st: 'CG', d: ['Raipur'] },
    'Patna': { st: 'BR', d: ['Patna'] },
    'Dehradun': { st: 'UK', d: ['Dehradun'], aka: ['dehra dun'] }
  };
  // Renamed districts that people search by their new names.
  const DIST_AKA = { 'ahilyanagar': 'Ahmednagar|MH', 'dharashiv': 'Osmanabad|MH', 'narmadapuram': 'Hoshangabad|MP', 'ahmedabad': 'Ahmadabad|GJ', 'gurgaon': 'Gurugram|HR', 'allahabad': 'Prayagraj|UP', 'bangalore': 'Bengaluru Urban|KA', 'mysore': 'Mysuru|KA', 'kamrup metropolitan': 'Kamrup Metro|AS' };

  /* ================= offices ================= */
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
  const add = (city, src, verified, rows) => rows.forEach(o => OFFICES.push(Object.assign({ city, pincodes: [], source: src, verified, phones: [] }, o)));

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

  // ---- Pune and Nagpur: city-wide helplines
  add('Pune', CH + 'how-can-you-file-civic-complaints-of-pune-municipal-corporation-pmc/1659', false, [
    { name: 'PMC citizen helpline', kind: 'Helpline', phones: ['1800-103-0222'], whatsapp: '919689900002', area: 'Whole PMC area', note: 'Toll-free, 7 am to 11 pm. Also the PMC Care portal and Pune Connect app.' }
  ]);
  add('Nagpur', 'https://thehitavada.com/Encyc/2025/2/8/Devendra-Fadnavis-launchesNMC-s-helpline-155304.html', false, [
    { name: 'NMC grievance helpline', kind: 'Helpline', phones: ['155304'], area: 'Whole NMC area', note: 'Toll-free, launched February 2025. 8 am to 8 pm on weekdays, 10 am to 8 pm on weekends. Also the My Nagpur app.' }
  ]);

  // ---- Navi Mumbai (NMMC)
  add('Navi Mumbai', CH + 'how-can-you-file-civic-complaints-of-navi-mumbai-municipal-corporation-nmmc/1433', false, [
    { name: 'NMMC control room', kind: 'Control room', phones: ['022-27567070', '022-27567071', '1800-222-309'], area: 'Whole NMMC area', note: 'Grievance form: nmmc.gov.in/navimumbai/grievance.' },
    { name: 'NMMC solid waste helpline', kind: 'Helpline', phones: ['97698-94944'], area: 'Garbage collection and dumping' }
  ]);

  // ---- Delhi (MCD): central control room and 12 zones (ANI/Lokmat, July 2023)
  const MCD_SRC = 'https://www.lokmattimes.com/national/mcd-issues-helpline-numbers-for-all-its-12-zones';
  add('Delhi', MCD_SRC, false, [
    { name: 'MCD central control room', kind: 'Control room', phones: ['155305'], area: 'All MCD areas', note: 'Also the MCD 311 app. Lutyens\' New Delhi is under NDMC and the cantonment under the Delhi Cantonment Board, not MCD.' },
    ...[['West', ['011-25422700', '011-25191014']], ['Central', ['011-29810705', '011-29812700']], ['South', ['011-26522700', '011-26517191']],
      ['Najafgarh', ['011-28013283', '011-28018818']], ['City Sadar Paharganj', ['011-23913773', '011-23913775']], ['Civil Lines', ['011-23942700', '011-23923992']],
      ['Narela', ['011-27283261', '011-27283783']], ['Rohini', ['011-27042700', '011-27050132']], ['Karol Bagh', ['011-25812700', '011-25754341']],
      ['Keshavpuram', ['011-27183146', '011-27183147']], ['Shahdara South', ['011-66667391', '011-66667392']], ['Shahdara North', ['011-22822700', '011-22831947']]
    ].map(([z, phones]) => ({ name: `${z} Zone helpline (MCD)`, kind: 'Zone office', phones, area: `${z} Zone` }))
  ]);

  // ---- Bengaluru (Greater Bengaluru Authority and its five corporations)
  add('Bengaluru', 'https://trackyourgarbage.com/2026/05/07/how-to-report-garbage-in-bengaluru/', false, [
    { name: 'Civic helpline 1533 and waste WhatsApp', kind: 'Helpline', phones: ['1533'], whatsapp: '919448197197', area: 'All five GBA corporations', note: 'Send garbage-dumping photos with location on WhatsApp. Since September 2025 the city is run by the Greater Bengaluru Authority through five corporations (Central, North, South, East, West).' }
  ]);

  // ---- Hyderabad
  add('Hyderabad', 'https://www.siasat.com/ghmc-launches-helpline-to-report-sanitation-issues-in-hyderabad-3426639/', false, [
    { name: 'GHMC call centre and sanitation WhatsApp', kind: 'Helpline', phones: ['040-21111111'], whatsapp: '918125966586', area: 'GHMC area', note: 'WhatsApp a photo and location of the garbage or debris. Also the MyGHMC app. In 2026 parts of Greater Hyderabad came under new corporations such as Malkajgiri: check which body covers your colony.' }
  ]);
  add('Hyderabad', 'https://telanganatoday.com/malkajgiri-municipal-corporation-launches-whatsapp-number-for-complaints', false, [
    { name: 'Malkajgiri Municipal Corporation garbage WhatsApp', kind: 'Helpline', whatsapp: '919063421300', area: 'Malkajgiri Municipal Corporation area', note: 'Garbage, green waste, overflowing bins and garbage vulnerable points (March 2026).' }
  ]);
  add('Hyderabad', 'https://complainthub.org/ghmc-hyderabad/', false, [['L.B. Nagar', '040-24142636'], ['Kukatpally', '040-23707766'], ['Charminar', '040-24500254'], ['Serilingampally', '040-23010062'], ['Khairatabad', '040-23322978'], ['Secunderabad', '040-27807321']]
    .map(([z, p], i) => ({ name: `${z} zonal office (GHMC)`, kind: 'Zone office', phones: [p], area: `${z} zone`, note: i === 0 ? 'Zone numbers date from 2022, before the 2026 reorganisation.' : undefined })));

  // ---- Chennai
  add('Chennai', CH + 'how-can-you-file-civic-complaints-of-greater-chennai-corporation-gcc/1653', false, [
    { name: 'GCC helpline 1913 and control room', kind: 'Helpline', phones: ['1913', '044-25384520', '044-25384530'], whatsapp: '919499933644', area: 'Greater Chennai Corporation area', note: 'Toll-free. GCC asks residents to report illegal waste dumping on 1913.' }
  ]);

  // ---- Kolkata
  add('Kolkata', 'https://complainthub.org/kmc-kolkata/', false, [
    { name: 'KMC toll-free complaint line', kind: 'Helpline', phones: ['1800-345-3375', '033-22269909'], whatsapp: '918335999111', area: 'All KMC boroughs', note: 'WhatsApp chatbot. Borough offices: kmcgov.in → Borough Offices. Compiled December 2022.' },
    { name: 'KMC control room', kind: 'Control room', phones: ['033-22861212', '033-22861313', '033-22861414'], area: 'All KMC boroughs' }
  ]);

  // ---- Gujarat
  add('Ahmedabad', 'https://amccrs.com/AMCPortal/View/ComplainRegistrationMobile.aspx', true, [
    { name: 'AMC complaint helpline (CCRS)', kind: 'Helpline', phones: ['155303'], whatsapp: '917567855303', area: 'Whole AMC area', note: '24×7. Or SMS "AMCCRS NEW" to 56767 for a call-back, or email ccrs@ahmedabadcity.gov.in.' }
  ]);
  add('Surat', CH + 'how-can-i-file-civic-complaints-of-surat-municipal-corporation-smc/1671', false, [
    { name: 'SMC toll-free helpline', kind: 'Helpline', phones: ['1800-123-8000', '0261-2423756'], whatsapp: '917623838000', area: 'Whole SMC area', note: 'Construction and demolition waste pickup: 1800-212-2829.' },
    ...[['West', '0261-2781439'], ['Central', '0261-2420547'], ['North', '0261-2480568'], ['East (A and B)', '0261-2551363'], ['South West', '0261-2667926']].map(([z, p]) => ({ name: `${z} Zone office (SMC)`, kind: 'Zone office', phones: [p], area: `${z} Zone` }))
  ]);
  add('Vadodara', CH + 'where-can-i-file-civic-complaints-of-vadodara-municipal-corporation-vmc/1551', false, [
    { name: 'VMC toll-free helpline and control room', kind: 'Helpline', phones: ['1800-233-0265', '0265-2423101', '0265-2426101'], whatsapp: '919913166666', area: 'Whole VMC area' }
  ]);

  // ---- Rajasthan
  add('Jaipur', CH + 'how-can-you-file-civic-complaints-of-greater-jaipur-municipal-corporation-jmc/1682', false, [
    { name: 'Jaipur municipal helpline and control room', kind: 'Control room', phones: ['0141-2747400', '0141-2742900', '0141-2740033'], area: 'Jaipur municipal area', note: 'Online complaints: samadhan.jaipurmc.org. Unresolved? Rajasthan Sampark 181.' }
  ]);

  // ---- Uttar Pradesh
  add('Lucknow', 'https://complainthub.org/lmc-lucknow/', false, [
    { name: 'LMC toll-free 1533 and helpline', kind: 'Helpline', phones: ['1533', '0522-2289782', '0522-2289764'], whatsapp: '919219902911', area: 'Whole LMC area', note: 'Compiled January 2023.' }
  ]);
  add('Kanpur', 'https://complainthub.org/kmc-kanpur/', false, [
    { name: 'Kanpur Nagar Nigam garbage complaint line', kind: 'Helpline', phones: ['1800-180-5159'], area: 'Garbage collection', note: 'Online: nagarnigamdoortodoor.com/complain.' },
    { name: 'Kanpur Nagar Nigam helpline and control room', kind: 'Control room', phones: ['1533', '1800-180-5124', '0512-2555681'], area: 'Whole Nagar Nigam area', note: 'Control room is 24×7. Compiled August 2023.' }
  ]);
  add('Ghaziabad', CH + 'where-can-i-file-civic-complaints-of-ghaziabad-nagar-nigam-nng/1739', false, [
    { name: 'Ghaziabad Nagar Nigam helpline and control room', kind: 'Control room', phones: ['1533', '1800-180-3012', '0120-2791418', '0120-2790369'], area: 'Whole Nagar Nigam area', note: 'Also the Ghaziabad 311 app.' }
  ]);
  add('Noida', CH + 'where-can-you-file-complaints-about-civic-services-of-noida-authority/1365', false, [
    { name: 'Noida Authority garbage and solid waste line', kind: 'Helpline', phones: ['1800-180-7995', '0120-2970004'], area: 'Noida Authority area', note: 'Noida is run by the Noida Authority, not a municipal corporation.' },
    { name: 'Noida Authority citizen helpline', kind: 'Helpline', phones: ['0120-2425025', '0120-2425026'], whatsapp: '919205559204', area: 'Noida Authority area' }
  ]);

  // ---- Haryana and Chandigarh
  add('Gurugram', CH + 'how-can-i-file-civic-complaints-of-municipal-corporation-gurugram-mcg/1748', false, [
    { name: 'MCG garbage collection (toll-free)', kind: 'Helpline', phones: ['1800-102-5952'], area: 'Garbage collection' },
    { name: 'MCG citizen helpline', kind: 'Helpline', phones: ['1800-180-1817', '0124-4753555'], area: 'Whole MCG area' }
  ]);
  add('Chandigarh', CH + 'where-can-i-file-civic-complaints-of-chandigarh-municipal-corporation-mcc/1374', false, [
    { name: 'Municipal Corporation Chandigarh helpline', kind: 'Helpline', phones: ['0172-2787200'], area: 'Whole MCC area', note: 'Online: egov.chandigarhsmartcity.in.' }
  ]);

  // ---- Madhya Pradesh
  add('Bhopal', 'https://complainthub.org/bmc-bhopal/', false, [
    { name: 'BMC Bhopal helpline', kind: 'Helpline', phones: ['155304', '1800-233-0014', '0755-2602070'], whatsapp: '919424401548', area: 'Whole BMC area', note: 'Unresolved? MP CM Helpline 181. Compiled September 2023.' }
  ]);
  add('Indore', CH + 'where-can-you-file-civic-complaints-of-indore-municipal-corporation-imc/1744', false, [
    { name: 'IMC toll-free helpline', kind: 'Helpline', phones: ['1800-233-5522', '0731-4071717'], area: 'Whole IMC area', note: 'Also the Indore 311 app.' },
    ...[[1, 'Dr Hedgewar', '0731-2410120'], [2, 'Lal Bahadur Shastri', '0731-2410512'], [4, 'Maharana Pratap', '0731-2416852'], [5, 'Chandragupta Maurya', '0731-2551931'], [6, 'Subhash Chandra Bose', '0731-2532161'], [7, 'Atal Bihari Vajpayee', '0731-2551310'], [8, 'Chandrashekhar Azad', '0731-2573355'], [9, 'Dr Bhimrao Ambedkar', '0731-2540128'], [10, 'Dr Shyama Prasad Mukherjee', '0731-2497422'], [12, 'Maa Harsiddhi', '0731-2341568'], [13, 'Pt Deendayal Upadhyay', '0731-2360201'], [14, 'Rajendra Dharkar', '0731-2483868'], [15, 'Laxman Singh Gaur', '0731-2381132'], [16, 'Kushabhau Thakre', '0731-2411833'], [17, 'Mahatma Gandhi', '0731-4900027'], [18, 'Chhatrapati Shivaji', '0731-2404540'], [19, 'Sardar Vallabhbhai Patel', '0731-2595940']]
      .map(([n, z, p]) => ({ name: `Zone ${n}: ${z} zone office (IMC)`, kind: 'Zone office', phones: [p], area: `${z} zone` }))
  ]);

  // ---- South
  add('Visakhapatnam', CH + 'how-can-i-file-civic-complaints-of-greater-visakhapatnam-municipal-corporation-gvmc/1791', false, [
    { name: 'GVMC helpline', kind: 'Helpline', phones: ['1800-4250-0009', '0891-2762876'], whatsapp: '919666909192', area: 'Whole GVMC area' },
    ...[['I', 'Bheemili', '08933-229535'], ['II', 'Madhurawada', '0891-2719716'], ['III', 'Asilmetta', '0891-2746314'], ['IV', 'Suryabagh', '0891-2707299'], ['V', 'Gnanapuram', '0891-2711480'], ['VI', 'Gajuwaka', '0891-2750878'], ['VII', 'Anakapalli', '08924-222345'], ['VIII', 'Vepagunta', '0891-2735353']]
      .map(([n, z, p]) => ({ name: `Zone ${n}: ${z} zonal office (GVMC)`, kind: 'Zone office', phones: [p], area: `${z} zone` }))
  ]);
  add('Kochi', CH + 'how-can-i-file-civic-complaints-of-kochi-municipal-corporation-kmc/1550', false, [
    { name: 'Kochi Corporation helpline', kind: 'Helpline', phones: ['0484-2369007'], area: 'Whole corporation area', note: 'Online: Public Grievance Cell on citizen.lsgkerala.gov.in. Waste dumping anywhere in Kerala: WhatsApp 94467-00800.' },
    ...[['Vyttila', '0484-2303502'], ['Edappally', '0484-2344839'], ['Fort Kochi', '0484-2215965'], ['Mattancherry', '0484-2226202'], ['Palluruthy', '0484-2232905'], ['Pachalam', '0484-2435050']]
      .map(([z, p]) => ({ name: `${z} zonal office (Kochi Corporation)`, kind: 'Zone office', phones: [p], area: `${z} zone` }))
  ]);
  add('Thiruvananthapuram', 'https://smarttvm.tmc.lsgkerala.gov.in/default/index/contactus', true, [
    { name: 'Thiruvananthapuram Corporation office', kind: 'Headquarters', phones: ['0471-2377700'], area: 'Whole corporation area', note: 'Monday to Saturday, 10 am to 5 pm. Complaint form on smarttvm.tmc.lsgkerala.gov.in. Waste dumping: WhatsApp 94467-00800 (statewide).' }
  ]);

  // ---- East and North-East
  add('Guwahati', 'https://sentinelassam.com/news/guwahati-municipal-corporation-gmc-helpline-for-public-grievances', false, [
    { name: 'GMC public grievance helpline', kind: 'Helpline', phones: ['88110-07000'], area: 'Whole GMC area', note: 'Call or WhatsApp. Number published in 2019: confirm on gmc.assam.gov.in.' }
  ]);
  add('Bhubaneswar', 'https://orissapost.com/24x7-helpline-for-citizens-grievances', false, [
    { name: 'Bhubaneswar One helpline (BMC, BDA, Smart City)', kind: 'Helpline', phones: ['1800-345-0061', '0674-2548295'], area: 'Whole BMC area', note: '24×7 unified helpline launched in 2018: confirm on bmc.gov.in.' }
  ]);
  add('Raipur', 'https://raipur.gov.in/public-utility/raipur-municipal-corporation/', true, [
    { name: 'Raipur Municipal Corporation head office', kind: 'Headquarters', phones: ['0771-2535780'], area: 'Whole corporation area', address: 'Nagar Nigam head office, near Mahila Police Thana, Gandhi Udyan, Raipur', note: 'Municipal complaints can also go to Chhattisgarh\'s 1100 helpline.' }
  ]);
  add('Patna', 'https://obeta.ttef.in/bihar/pmc-promises-fast-relief-via-city-of-patna-app/cid/1678211', false, [
    { name: 'Patna Municipal Corporation: City of Patna app', kind: 'App', area: 'Whole corporation area', note: 'Post a photo of the garbage point in the City of Patna app (pmc.bihar.gov.in). Unresolved? Bihar Lok Shikayat 1800-345-6284.' }
  ]);
  add('Dehradun', CH + 'how-can-i-file-civic-complaints-of-dehradun-municipal-corporation/237', false, [
    { name: 'Nagar Nigam Dehradun helpline', kind: 'Helpline', phones: ['1800-180-2525', '0135-2714074'], area: 'Whole corporation area', note: 'Unresolved? Uttarakhand CM Helpline 1905.' }
  ]);

  /* ================= pin code index (js/pincodes.js, loaded on first use) ================= */
  let PIN = null, waiting = null;
  function loadPins(cb) {
    if (PIN) return cb();
    if (!waiting) {
      waiting = [];
      const s = document.createElement('script');
      s.src = 'js/pincodes.js';
      s.onload = () => { try { decode(); } catch (e) { PIN = { failed: true }; } waiting.forEach(f => f()); };
      s.onerror = () => { PIN = { failed: true }; waiting.forEach(f => f()); };
      document.head.appendChild(s);
    }
    waiting.push(cb);
  }
  function decode() {
    const pd = PV.pinData, parts = pd.p.split('.'), n = parts.length;
    const pins = new Int32Array(n), dis = new Int16Array(n);
    let pin = 0, d = 0;
    parts.forEach((t, i) => { const [a, b] = t.split(':'); pin += parseInt(a, 36); if (b !== undefined) d = parseInt(b, 36); pins[i] = pin; dis[i] = d; });
    const extra = {};
    pd.x.split(';').forEach(t => { if (!t) return; const [p, ds] = t.split(':'); extra[p] = ds.split(',').map(x => parseInt(x, 36)); });
    const dist = pd.d.map(s => { const [name, st] = s.split('|'); return { name, st, key: s }; });
    const loc = pd.loc.split(';').map(s => { const [name, p] = s.split('|'); return { name, low: name.toLowerCase(), pin: p }; });
    PIN = { pins, dis, extra, dist, loc };
  }
  function lookupPin(p) {
    const { pins, dis, extra, dist } = PIN, x = +p;
    let lo = 0, hi = pins.length - 1;
    while (lo <= hi) {
      const m = (lo + hi) >> 1;
      if (pins[m] === x) return [dis[m], ...(extra[p] || [])].map(i => dist[i]).filter(d => STATES[d.st]);
      if (pins[m] < x) lo = m + 1; else hi = m - 1;
    }
    return null;
  }

  /* ================= rendering ================= */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tel = n => `<a href="tel:${n.replace(/[^\d+]/g, '')}">${n}</a>`;
  const waNum = n => n.replace(/^91(\d{5})(\d{5})$/, '$1-$2');
  const wa = n => `<a href="https://wa.me/${n}" target="_blank" rel="noopener noreferrer">💬 WhatsApp ${waNum(n)}</a>`;
  const ext = (label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  const bare = u => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const tagFor = v => `<span class="tag" style="margin:0 6px 0 0">${v ? 'Official source' : 'Confirm before relying'}</span>`;
  const listedCities = () => [...new Set(OFFICES.map(o => o.city))];

  const card = o => `
    <div class="off">
      <p class="mini-h">${o.kind} · ${o.city}</p>
      <h4>${o.name}</h4>
      ${o.area ? `<p class="note" style="margin:0 0 6px">Covers: ${o.area}</p>` : ''}
      ${o.address ? `<p style="margin:0 0 6px">📍 ${o.address}</p>` : ''}
      ${o.phones.length || o.whatsapp
        ? `<p style="margin:0 0 6px">${[o.phones.length ? '📞 ' + o.phones.map(tel).join(' · ') : '', o.whatsapp ? wa(o.whatsapp) : ''].filter(Boolean).join(' · ')}</p>`
        : (o.kind === 'App' ? '' : '<p style="margin:0 0 6px"><span class="note">Phone not added yet: check the official site.</span></p>')}
      ${o.note ? `<p class="note" style="margin:0 0 6px">${o.note}</p>` : ''}
      <p class="note" style="margin:0">${tagFor(o.verified)}<a href="${o.source}" target="_blank" rel="noopener noreferrer">Source ↗</a></p>
    </div>`;

  function stateCard(st) {
    const S = STATES[st];
    if (!S) return '';
    const [pn, pph, paddr, pweb] = S.pcb, [gn, gurl, gph, gsrc, gnote] = S.gr;
    const more = (S.more || []).map(m => typeof m === 'string' ? `<li>${m}</li>` : `<li>${m[0]}${m[2] ? ' ' + wa(m[2]) : ''} ${ext('Source', m[1])}</li>`).join('');
    return `
    <div class="off">
      <p class="mini-h">State-wide · ${S.n}</p>
      <h4>Anywhere in ${S.n}</h4>
      <ul class="ticks">
        <li><b>${gn}:</b> the state grievance portal, which takes complaints about any municipality or gram panchayat. ${ext(bare(gurl), gurl)}${gph && gph.length ? ' · 📞 ' + gph.map(tel).join(' · ') : ''}${gnote ? ` <span class="note">${gnote}</span>` : ''}</li>
        <li><b>${pn}:</b> factories, brick kilns, generators and large-scale burning.${pph.length ? ' 📞 ' + pph.map(tel).join(' · ') : ''}${paddr ? ` <span class="note">📍 ${paddr}</span>` : ''}${pweb ? ' ' + ext(bare(pweb), pweb) : ''}</li>
        ${more}
      </ul>
      <p class="note" style="margin:0">${tagFor(false)}${ext('Board directory', DIR)} · ${ext('Portal source', gsrc || GR_IDX)}</p>
    </div>`;
  }

  const nationalCard = () => `
    <div class="off">
      <p class="mini-h">All India</p>
      <h4>Report from anywhere in India</h4>
      <ul class="ticks">${NATIONAL.map(n => `<li><b>${n.link ? ext(n.name, n.link[1]) : n.name}:</b> ${n.what}${n.src ? ' ' + ext('Source', n.src) : ''}</li>`).join('')}</ul>
    </div>`;

  // Municipal bodies whose district list overlaps the given districts.
  function citiesForDistricts(ds) {
    const keys = new Set(ds.map(d => d.name + '|' + d.st));
    return Object.keys(CITY).filter(c => CITY[c].d.some(d => keys.has(d + '|' + CITY[c].st)));
  }
  // Listed offices for these cities, then a note for the ones not added yet.
  function cityBlock(cities) {
    const listed = new Set(listedCities());
    const have = cities.filter(c => listed.has(c)), missing = cities.filter(c => !listed.has(c));
    let html = have.map(c => OFFICES.filter(o => o.city === c).map(card).join('')).join('');
    if (missing.length) html += `<div class="off"><h4>${missing.join(', ')}: not added yet</h4><p>No offices are listed for ${missing.length > 1 ? 'these municipal corporations' : 'this municipal corporation'} yet. Use the corporation's own website, or the state-wide and national options below.</p></div>`;
    return html;
  }

  function finder() {
    const el = document.getElementById('officialsFinder');
    if (!el) return;
    const listed = listedCities();
    const stateList = Object.entries(STATES).sort((a, b) => a[1].n.localeCompare(b[1].n));
    el.innerHTML = `
      <input class="input" id="offQ" type="search" list="offList" autocomplete="off" placeholder="Pin code, city, district or locality, e.g. 411038, Lucknow or Koramangala" aria-label="Search by pin code, city, district, state or locality">
      <datalist id="offList">${[...Object.keys(CITY), ...stateList.map(([, s]) => s.n)].sort().map(n => `<option value="${n}">`).join('')}</datalist>
      <div class="off-browse">
        <label class="note" for="offState">Or browse by state</label>
        <select class="input" id="offState"><option value="">Choose a state or union territory…</option>${stateList.map(([k, s]) => `<option value="${k}">${s.n}</option>`).join('')}</select>
      </div>
      <p class="mini-h" style="margin:14px 0 6px">Cities with offices listed</p>
      <div class="chips small" id="offCities"></div>
      <div id="offOut" aria-live="polite"></div>
      <p class="note" style="margin-top:12px">Pin codes are postal zones and do not line up with ward boundaries, so a pin code can fall in more than one ward, or outside city limits. Always confirm your ward with the helpline. Only official office and helpline numbers are listed, never personal numbers. Pin code data: India Post's All India Pincode Directory (data.gov.in). Coverage is growing city by city.</p>`;
    const out = el.querySelector('#offOut'), q = el.querySelector('#offQ'), sel = el.querySelector('#offState');

    const head = html => `<p class="note" style="margin:12px 0 0">${html}</p>`;
    const chipRow = items => `<div class="chips small" style="margin-top:8px">${items.map(([t, v, l]) => `<button class="chip" type="button" data-${t}="${esc(v)}">${esc(l)}</button>`).join('')}</div>`;

    const showCity = c => {
      const st = CITY[c].st;
      out.innerHTML = head(`<b>${c}</b>, ${STATES[st].n}`) + cityBlock([c]) + stateCard(st) + nationalCard();
    };
    const showState = st => {
      const cs = Object.keys(CITY).filter(c => CITY[c].st === st && listed.includes(c));
      out.innerHTML = head(`<b>${STATES[st].n}</b>${cs.length ? ': cities with offices listed' : ': no city offices listed yet, but the state-wide options below work for every town and village.'}`)
        + (cs.length ? chipRow(cs.map(c => ['city', c, c])) : '') + stateCard(st) + nationalCard();
    };
    const showDistricts = (ds, lead) => {
      const sts = [...new Set(ds.map(d => d.st))];
      const cs = citiesForDistricts(ds);
      const where = [...new Set(ds.map(d => d.name ? `${d.name} district, ${STATES[d.st].n}` : STATES[d.st].n))].join(' or ');
      const tail = cs.length
        ? ' Municipal bodies there are below; pick the one whose area matches your locality. Outside city limits, your municipal council, nagar panchayat or gram panchayat handles garbage: use the state-wide options.'
        : ' No city offices are listed for this district yet. Your municipal council, nagar panchayat or gram panchayat handles garbage pickup and burning: use the state-wide and national options below.';
      out.innerHTML = head(`${lead}<b>${where}</b>.${tail}`) + cityBlock(cs) + sts.map(stateCard).join('') + nationalCard();
    };

    const draw = () => {
      const raw = q.value.trim(), s = raw.toLowerCase().replace(/\s+/g, ' ');
      if (!s) { out.innerHTML = head(`${listed.length} cities have offices listed, and every state and union territory has its grievance portal and pollution control board. Search, pick a city or choose a state.`) + nationalCard(); return; }
      if (/^\d{1,5}$/.test(s)) { out.innerHTML = head('Keep typing: Indian pin codes have 6 digits.'); return; }
      if (/^\d{6}$/.test(s)) {
        if (!PIN) { out.innerHTML = head('Loading pin codes…'); return loadPins(draw); }
        if (PIN.failed) { out.innerHTML = head('Pin code data could not be loaded. Try your city name instead.') + nationalCard(); return; }
        const ds = lookupPin(s);
        if (!ds || !ds.length) { out.innerHTML = head(`${s} is not in India Post's pin code directory. Check the number, or search by city.`) + nationalCard(); return; }
        const direct = OFFICES.filter(o => o.pincodes.includes(s));
        if (direct.length) { out.innerHTML = direct.map(card).join('') + [...new Set(ds.map(d => d.st))].map(stateCard).join('') + nationalCard(); return; }
        return showDistricts(ds, `Pin code ${s} is in `);
      }
      // Exact city or state.
      const city = Object.keys(CITY).find(c => c.toLowerCase() === s || (CITY[c].aka || []).includes(s));
      if (city) return showCity(city);
      const st = Object.keys(STATES).find(k => STATES[k].n.toLowerCase() === s);
      if (st) return showState(st);
      // Districts and localities need the pin index.
      if (s.length >= 3 && !PIN) loadPins(draw);
      const P = PIN && !PIN.failed ? PIN : null;
      if (P) {
        const exact = P.dist.filter(d => d.name && d.name.toLowerCase() === s);
        const renamed = DIST_AKA[s] ? P.dist.filter(d => d.key === DIST_AKA[s]) : [];
        if (exact.length || renamed.length) return showDistricts(exact.length ? exact : renamed, '');
      }
      // Partial matches: offices by name or area, plus suggestions.
      const hits = OFFICES.filter(o => (o.city + ' ' + o.name + ' ' + (o.area || '') + ' ' + (o.address || '')).toLowerCase().includes(s));
      const sugg = [
        ...Object.keys(CITY).filter(c => c.toLowerCase().includes(s) || (CITY[c].aka || []).some(a => a.startsWith(s))).map(c => ['city', c, c]),
        ...Object.keys(STATES).filter(k => STATES[k].n.toLowerCase().includes(s)).map(k => ['state', k, STATES[k].n]),
        ...(P && s.length >= 3 ? P.dist.filter(d => d.name && d.name.toLowerCase().startsWith(s)).slice(0, 8).map(d => ['dist', d.key, `${d.name} district, ${STATES[d.st] ? STATES[d.st].n : d.st}`]) : []),
        ...(P && s.length >= 3 ? P.loc.filter(l => l.low.startsWith(s)).slice(0, 10).map(l => ['pin', l.pin, `${l.name} · ${l.pin}`]) : [])
      ];
      if (!hits.length && sugg.length === 1) return pick(sugg[0][0], sugg[0][1]);
      // Only localities matched: show the first one's result under the suggestions.
      if (!hits.length && sugg.length && sugg[0][0] === 'pin') {
        const ds = lookupPin(sugg[0][1]);
        if (ds && ds.length) {
          showDistricts(ds, `${esc(sugg[0][2].split(' · ')[0])} (pin ${sugg[0][1]}) is in `);
          out.insertAdjacentHTML('afterbegin', head('Matching localities:') + chipRow(sugg));
          return;
        }
      }
      let html = (sugg.length ? head('Did you mean:') + chipRow(sugg) : '') + hits.slice(0, 30).map(card).join('');
      if (!html) html = `<div class="off"><h4>No match for “${esc(raw)}”</h4><p>${!PIN ? 'Still loading districts and localities… ' : ''}Try your pin code, city or district, or choose your state.</p></div>` + nationalCard();
      out.innerHTML = html;
    };

    const pick = (t, v) => {
      if (t === 'city') { q.value = v; showCity(v); }
      else if (t === 'state') { q.value = STATES[v].n; showState(v); }
      else if (t === 'pin') { q.value = v; draw(); }
      else if (t === 'dist') { const d = PIN.dist.filter(x => x.key === v); q.value = d[0].name; showDistricts(d, ''); }
    };
    out.addEventListener('click', e => {
      const b = e.target.closest('button[data-city],button[data-state],button[data-dist],button[data-pin]');
      if (!b) return;
      const t = ['city', 'state', 'dist', 'pin'].find(k => b.dataset[k] !== undefined);
      pick(t, b.dataset[t]);
    });
    sel.addEventListener('change', () => { if (sel.value) pick('state', sel.value); });
    chipGroup(el.querySelector('#offCities'), listed.slice().sort().map(c => [c, c]), null, c => pick('city', c), 'g');
    q.addEventListener('input', () => { sel.value = ''; draw(); });
    draw();
  }

  PV.officials = { CITY, OFFICES, STATES, NATIONAL };
  const prev = PV.render.act;
  PV.render.act = function () { prev(); finder(); };
})();
