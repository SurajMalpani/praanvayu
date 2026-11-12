// Content for every tab. Figures are cited in PV.references; [n] markers in text refer to that list.
window.PV = window.PV || {};

// CPCB National AQI categories with 24-hour PM2.5 / PM10 breakpoints (µg/m³) [6].
PV.aqi = [
  { k: 'Good', lo: 0, hi: 50, pm25: [0, 30], pm10: [0, 50], c: '#2E9E4F', t: '#fff', impact: 'Minimal impact.', tip: 'A great day to be outside and to air out your home.' },
  { k: 'Satisfactory', lo: 51, hi: 100, pm25: [31, 60], pm10: [51, 100], c: '#8CC152', t: '#17302F', impact: 'Minor breathing discomfort to sensitive people.', tip: 'Normal activity for almost everyone. People with asthma should keep medicines handy.' },
  { k: 'Moderate', full: 'Moderately polluted', lo: 101, hi: 200, pm25: [61, 90], pm10: [101, 250], c: '#F2C230', t: '#17302F', impact: 'Breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults.', tip: 'Sensitive groups should cut back on long or heavy exertion outdoors.' },
  { k: 'Poor', lo: 201, hi: 300, pm25: [91, 120], pm10: [251, 350], c: '#F08A24', t: '#fff', impact: 'Breathing discomfort to most people on prolonged exposure.', tip: 'Move workouts indoors, keep windows shut and wear an N95 near traffic.' },
  { k: 'Very Poor', lo: 301, hi: 400, pm25: [121, 250], pm10: [351, 430], c: '#E0452B', t: '#fff', impact: 'Respiratory illness on prolonged exposure. Effects are more pronounced in people with lung and heart disease.', tip: 'Avoid outdoor exertion. Run a HEPA purifier and wear a fitted N95 outdoors.' },
  { k: 'Severe', lo: 401, hi: 500, pm25: [251, null], pm10: [431, null], c: '#8E1B2B', t: '#fff', impact: 'Affects healthy people and seriously impacts those with existing disease. Effects may be felt even during light physical activity.', tip: 'Stay indoors as much as possible. Schools and outdoor work may be paused under GRAP.' }
];

// Pollutants in India's AQI, with WHO 2021 guidelines [1] and India's NAAQS 2009 [7].
PV.pollutants = [
  { id: 'pm25', n: 'PM2.5', full: 'Fine particulate matter', icon: '•', what: 'Particles 2.5 micrometres across or smaller, about 30 times thinner than a human hair. Some are emitted directly (smoke, soot); many form in the air from gases like SO₂, NOx and ammonia.', src: 'Burning of any kind: vehicles, coal, wood and dung, crop residue, garbage, firecrackers.', harm: 'Reaches deep into the lungs and can pass into the bloodstream. The pollutant most strongly linked to heart attacks, strokes, lung cancer and early death.', who: ['5 µg/m³ (annual)', '15 µg/m³ (24-hour)'], ind: ['40 µg/m³ (annual)', '60 µg/m³ (24-hour)'] },
  { id: 'pm10', n: 'PM10', full: 'Coarse particulate matter', icon: '●', what: 'Inhalable particles up to 10 micrometres, including PM2.5 plus larger dust, pollen and mould.', src: 'Road and construction dust, demolition, unpaved roads, desert dust storms, and all the PM2.5 sources.', harm: 'Irritates the nose, throat and airways; worsens asthma and bronchitis.', who: ['15 µg/m³ (annual)', '45 µg/m³ (24-hour)'], ind: ['60 µg/m³ (annual)', '100 µg/m³ (24-hour)'] },
  { id: 'no2', n: 'NO₂', full: 'Nitrogen dioxide', icon: '⛽', what: 'A reddish-brown gas from high-temperature combustion. It helps form ozone and secondary PM2.5.', src: 'Vehicle exhaust (especially diesel), power plants, industry, gas stoves indoors.', harm: 'Inflames the airways; linked to new cases of asthma in children.', who: ['10 µg/m³ (annual)', '25 µg/m³ (24-hour)'], ind: ['40 µg/m³ (annual)', '80 µg/m³ (24-hour)'] },
  { id: 'so2', n: 'SO₂', full: 'Sulphur dioxide', icon: '🏭', what: 'A sharp-smelling gas from burning sulphur-containing fuels. In the air it turns into sulphate particles.', src: 'Coal-fired power plants, refineries, smelters, heavy industry, ships.', harm: 'Triggers wheezing and chest tightness, especially in people with asthma.', who: ['—', '40 µg/m³ (24-hour)'], ind: ['50 µg/m³ (annual)', '80 µg/m³ (24-hour)'] },
  { id: 'o3', n: 'O₃', full: 'Ground-level ozone', icon: '☀️', what: 'Not emitted directly: it forms when NOx and volatile organic compounds react in sunlight, so it peaks on hot, sunny afternoons.', src: 'Indirectly from vehicles, industry, solvents and fuel vapours.', harm: 'Irritates lungs, reduces lung function, and damages crops.', who: ['60 µg/m³ (peak season)', '100 µg/m³ (8-hour)'], ind: ['100 µg/m³ (8-hour)', '180 µg/m³ (1-hour)'] },
  { id: 'co', n: 'CO', full: 'Carbon monoxide', icon: '🔥', what: 'A colourless, odourless gas from incomplete combustion.', src: 'Traffic, chulhas and angithis, generators, poorly ventilated heaters.', harm: 'Reduces the blood\u2019s ability to carry oxygen; dangerous in closed rooms.', who: ['—', '4 mg/m³ (24-hour)'], ind: ['2 mg/m³ (8-hour)', '4 mg/m³ (1-hour)'] },
  { id: 'nh3', n: 'NH₃', full: 'Ammonia', icon: '🌾', what: 'A gas that reacts with SO₂ and NOx to form fine ammonium sulphate and nitrate particles, a big part of winter PM2.5 in North India.', src: 'Fertiliser use, livestock manure, sewage and waste.', harm: 'Irritant at high levels; its main harm is feeding secondary PM2.5.', who: ['—', '—'], ind: ['100 µg/m³ (annual)', '400 µg/m³ (24-hour)'] },
  { id: 'pb', n: 'Pb', full: 'Lead', icon: '⚙️', what: 'A toxic metal. Leaded petrol was phased out in India in 2000, but lead still comes from smelting and battery recycling.', src: 'Informal lead-acid battery recycling, smelters, some paints.', harm: 'No safe level. Harms children\u2019s brain development, IQ and behaviour.', who: ['0.5 µg/m³ (annual)', '—'], ind: ['0.5 µg/m³ (annual)', '1.0 µg/m³ (24-hour)'] }
];

// Major sources. National shares for 2022 come from Zhou et al. [18]; Delhi shares from CSE's analysis of IITM's DSS [24].
PV.sources = [
  { id: 'vehicles', n: 'Vehicles & transport', icon: '🚗', tone: 't', tag: 'All year · near roads',
    p: 'Exhaust from petrol and diesel engines, plus brake and tyre wear and dust kicked up from roads. Old, poorly maintained and diesel vehicles emit far more per kilometre.',
    f: [['Main pollutants', 'PM2.5, NO₂, CO, VOCs (which form ozone)'], ['How much', 'About 8% of the PM2.5 Indians breathed in 2022, counting road dust [18]. In big cities it is far larger: vehicles made up about half of the PM2.5 from Delhi\u2019s own sources in the winters of 2023 to 2025 [24]'], ['Peaks', 'Rush hours, and close to busy roads and junctions'], ['What\u2019s being done', 'BS-VI fuel and engine norms nationwide since April 2020; CNG buses and autos in many cities; EV subsidies; PUC checks'], ['What you can do', 'Walk, cycle, use public transport or car-pool; keep your PUC valid; switch off at red lights; choose electric where you can']] },
  { id: 'industry', n: 'Industry & power plants', icon: '🏭', tone: 'b', tag: 'All year · regional',
    p: 'Burning coal, pet coke, biomass and waste in factories, boilers and small industries, and coal in power stations. Their SO₂ and NOx travel hundreds of kilometres and turn into fine particles.',
    f: [['Main pollutants', 'SO₂, NOx, PM, mercury'], ['How much', 'Industry is now the largest source inside India: about 18% of the PM2.5 Indians breathed in 2022, with coal power plants adding another 13% [18]. Industrial energy use rose by about three-quarters between 2010 and 2022, from 7.8 to 13.6 exajoules [18]'], ['Coal power', 'Power plants produced about 61% of India\u2019s SO₂ between 2015 and 2022, and only about 3% of coal plants had SO₂ scrubbers (FGD) in 2022 [18]. In July 2025 the government limited the FGD requirement mainly to plants near Delhi-NCR and million-plus cities, exempting about three in four coal units [25]'], ['What\u2019s being done', 'Emission norms for thermal plants (FGD now required mainly near big cities [25]), cleaner fuels in Delhi-NCR industry, continuous online emission monitoring'], ['What you can do', 'Save electricity, choose efficient appliances and rooftop solar, report factories or generators emitting black smoke']] },
  { id: 'household', n: 'Household fuels', icon: '🪵', tone: 'l', tag: 'All year · homes · worst in winter',
    p: 'Cooking and heating with wood, dung cakes, crop waste, coal or kerosene. Smoke fills the kitchen, mostly hurting women and young children, then drifts outdoors.',
    f: [['Main pollutants', 'PM2.5, CO, black carbon'], ['How it has changed', 'Clean cooking has spread fast. Households cooking mainly with LPG, PNG or electricity rose from 44% in 2015–16 to 59% in 2019–21 (90% in cities, 43% in villages) [20]. A 2022–23 national sample survey put it at 63% (93% in cities, 50% in villages) [26], and the share of Indians exposed to solid-fuel smoke fell from 63% in 2013 to 42% in 2023 [19]. The death rate from household air pollution fell 64% between 1990 and 2019, while the rate from outdoor PM2.5 more than doubled [4]'], ['How much', 'Studies of 2015 to 2019 ranked household fuels as India\u2019s top source of PM2.5 and of PM2.5 deaths [5]. With cleaner kitchens, a 2022 analysis puts them second at about 15%, behind industry [18]. They are still the largest source where about 50 crore people live, mostly in the Indo-Gangetic Plain, and matter most in winter [18]'], ['What\u2019s being done', 'Pradhan Mantri Ujjwala Yojana had given about 10.6 crore LPG connections by July 2026, and its households averaged about 4.7 refills a year in 2025–26 [21]. The challenge is affordable refills, so families cook every meal on LPG instead of going back to wood'], ['What you can do', 'Use LPG, PNG or induction; ventilate kitchens; help neighbours access Ujjwala; never burn waste or plastic for warmth']] },
  { id: 'stubble', n: 'Crop residue burning', icon: '🌾', tone: 'b', tag: 'Oct–Nov · Punjab, Haryana, UP',
    p: 'After the paddy harvest, farmers have only a few weeks to clear fields for wheat. Setting the leftover straw (parali) on fire is the cheapest option, and the smoke drifts across the Indo-Gangetic Plain.',
    f: [['Main pollutants', 'PM2.5, CO, black carbon'], ['Trend', 'Punjab recorded 5,114 farm fires in the 2025 season, 93% fewer than in 2021, and Haryana 662 [22]. Some burning has moved to late afternoon, after satellites pass overhead, so the counts may understate it. In 2026, with the season still under way, Punjab\u2019s pollution board had logged 4,657 fires by 9 November [27]'], ['How much', 'Farm fires averaged about 3.5% of Delhi\u2019s PM2.5 over the 2025 burning season, down from 10.6% in 2024 and 13% in 2021, though on the worst days of 2024 they reached 35% [23]. Nationally, open burning of crops, waste and forests made up about 8% of PM2.5 in 2022, rising to 10% in October [18]'], ['What\u2019s being done', 'Subsidised Happy Seeder and Super Seeder machines, the Pusa bio-decomposer, and buying straw for pellets, power plants, brick kilns, biogas and ethanol'], ['What you can do', 'Support farmer groups, crop diversification and straw-collection businesses; don\u2019t blame farmers alone, since cities contribute most of their own pollution most of the year']] },
  { id: 'dust', n: 'Construction & road dust', icon: '🏗️', tone: 't', tag: 'All year · worst when dry',
    p: 'Uncovered building sites, demolition debris, unpaved shoulders and dust swept back into the air by traffic. Mostly coarse PM10, but a meaningful share of PM2.5 too.',
    f: [['Main pollutants', 'PM10, some PM2.5'], ['How much', 'Construction and road dust made up about 11% of the PM2.5 from Delhi\u2019s own sources in winter 2024 [24], and a much bigger share of PM10'], ['Peaks', 'Dry, windy months and near large construction projects'], ['What\u2019s being done', 'Dust-control rules requiring covers, wind screens, water sprinkling and covered transport of material; mechanised road sweeping; construction bans under GRAP'], ['What you can do', 'Ask your builder or RWA to follow dust norms; report violations; support paved and green road edges']] },
  { id: 'waste', n: 'Open waste burning', icon: '🗑️', tone: 'l', tag: 'All year · neighbourhoods',
    p: 'Garbage, plastic and dry leaves burned on streets, in vacant plots and at landfills. Burning plastic releases especially toxic chemicals.',
    f: [['Main pollutants', 'PM2.5, black carbon, dioxins and furans'], ['How much', 'About 5% of the PM2.5 from Delhi\u2019s own sources in winter 2024 [24]. Small fires are hard to see from space, so national estimates likely miss some of it'], ['The law', 'The Solid Waste Management Rules, 2026, which replaced the 2016 rules on 1 April 2026, forbid burning waste in streets, public spaces, drains and water bodies [17]'], ['What\u2019s being done', 'Door-to-door collection, waste segregation, landfill fire control, fines for burning'], ['What you can do', 'Segregate wet and dry waste, compost leaves instead of burning them, and report fires through the Swachhata or SAMEER apps']] },
  { id: 'kilns', n: 'Brick kilns', icon: '🧱', tone: 'b', tag: 'Dry season · peri-urban',
    p: 'India is one of the world\u2019s largest brick makers. Traditional kilns burn coal, wood and waste inefficiently, close to cities.',
    f: [['Main pollutants', 'PM2.5, black carbon, SO₂, CO'], ['Peaks', 'November to June, when kilns operate'], ['What\u2019s being done', 'Moving kilns to cleaner zig-zag technology, and promoting fly-ash and other alternative bricks'], ['What you can do', 'Ask for fly-ash, AAC or other alternative bricks when you build']] },
  { id: 'farming', n: 'Fertiliser & livestock', icon: '🐄', tone: 'l', tag: 'All year · rural, feeds city smog',
    p: 'Urea, manure and livestock release ammonia. It isn\u2019t smoke, but in the air it combines with SO₂ and NOx from vehicles, factories and power plants to form fine particles.',
    f: [['Main pollutants', 'NH₃ (ammonia), which becomes ammonium nitrate and sulphate'], ['How much', 'About 8% of the PM2.5 Indians breathed in 2022. Farming produces about 80% of India\u2019s ammonia, and it is the largest contributor to nitrate particles, a big part of winter smog in the Indo-Gangetic Plain [18]'], ['What\u2019s being done', 'Neem-coated urea, nano-urea and soil health cards to cut overuse of fertiliser'], ['What you can do', 'Support balanced fertiliser use and composting. Cutting SO₂ and NOx also cuts the particles ammonia helps form']] },
  { id: 'crackers', n: 'Firecrackers', icon: '🎆', tone: 't', tag: 'Festivals · hours to days',
    p: 'A few hours of fireworks can push PM2.5 to many times the safe limit, and leave metals and smoke hanging in still winter air.',
    f: [['Main pollutants', 'PM2.5, metals (barium, strontium, copper), SO₂'], ['Peaks', 'Diwali, New Year, weddings and cricket wins'], ['What\u2019s being done', 'The Supreme Court allows only lower-emission "green crackers" [16]; many cities ban crackers during bad-air periods'], ['What you can do', 'Celebrate with diyas, lights, music and community events instead']] },
  { id: 'natural', n: 'Weather, geography & borders', icon: '🌫️', tone: 'l', tag: 'Winter worst · regional',
    p: 'Pollution doesn\u2019t only depend on how much we emit. In winter, cold, still air traps smoke close to the ground. The Indo-Gangetic Plain is a basin hemmed in by the Himalayas, so polluted air piles up. In summer, desert dust storms add PM10. And air doesn\u2019t stop at borders.',
    f: [['Why winter is worse', 'Temperature inversions, low wind and a shallow mixing layer hold pollution near the ground'], ['From outside India', 'About 27% of the PM2.5 Indians breathed in 2022 came from beyond India\u2019s borders, more than any single source inside India, and over 40% in Punjab, Haryana, Rajasthan and Gujarat [18]'], ['Natural sources', 'Desert dust from the Thar and West Asia (about 4% nationally, much more in the northwest [18]), forest fires, sea salt'], ['Cleanest months', 'Monsoon rain washes particles out of the air'], ['Key point', 'Weather explains the timing of bad days; human emissions explain how bad they get']] }
];

// "Who adds what" infographic. India: share of 2022 population-weighted annual PM2.5 (47.4 µg/m³) [18].
// Delhi: share of PM2.5 from sources inside Delhi, 12 Oct–3 Nov 2024 [24]. `src` links a slice to a card in PV.sources.
PV.mixColors = { industry: '#7A4A2A', household: '#E08A2E', power: '#4B4F58', vehicles: '#1F6F6D', farming: '#6BAA3A', burning: '#E0452B', dust: '#D8B66A', outside: '#A8DCD1', construction: '#B98A63', other: '#B8C4C2' };
PV.mix = {
  india: {
    title: 'All India · whole year', short: 'India',
    lead: 'Where the PM2.5 that Indians breathe came from in 2022, averaged over the year and weighted by where people live.',
    foot: 'Shares add to 101% because of rounding and because natural plant emissions slightly lower the total (about −1%). Annual average; the mix shifts by season and region [18].',
    slices: [
      { k: 'outside', n: 'From outside India', s: 'Outside India', v: 27.0, src: 'natural', d: 'Pollution from neighbouring countries and long-range dust and haze. More than any single source inside India, and over 40% in Punjab, Haryana, Rajasthan and Gujarat [18].' },
      { k: 'industry', n: 'Industry', s: 'Industry', v: 18.1, src: 'industry', d: 'Coal, biomass and waste burned in factories, boilers and small industries. The largest source inside India in 2022, with hotspots in Delhi and Mumbai [18].' },
      { k: 'household', n: 'Household cooking & heating', s: 'Households', v: 15.4, src: 'household', d: 'Wood, dung and coal burned at home. Down from the top spot in older studies, as LPG has spread, but still the largest source across much of the Indo-Gangetic Plain in winter [18].' },
      { k: 'power', n: 'Coal power plants', s: 'Power plants', v: 12.9, src: 'industry', d: 'Mostly SO₂ and NOx that turn into particles downwind. Biggest impact in central India, especially Chhattisgarh and Jharkhand [18].' },
      { k: 'vehicles', n: 'Vehicles & road dust', s: 'Vehicles', v: 8.0, src: 'vehicles', d: 'Exhaust plus road dust. A modest share nationally, but the largest local source in big cities like Delhi [18][24].' },
      { k: 'farming', n: 'Fertiliser & livestock', s: 'Farming', v: 7.8, src: 'farming', d: 'Ammonia from urea and manure, which turns into ammonium nitrate and sulphate particles [18].' },
      { k: 'burning', n: 'Open burning: crops, waste, forests', s: 'Open fires', v: 7.6, src: 'stubble', d: 'Fires big enough for satellites to see. Rises to about 10% nationally in October, and dominates parts of the Indo-Gangetic Plain then [18].' },
      { k: 'dust', n: 'Desert dust', s: 'Desert dust', v: 4.0, src: 'natural', d: 'Wind-blown dust from the Thar. Heavy in the northwest, where fewer people live [18].' }
    ]
  },
  delhi: {
    title: 'Delhi · winter, own sources', short: 'Delhi',
    lead: 'Where the PM2.5 from sources inside Delhi came from in early winter 2024 (12 October to 3 November). Most of Delhi\u2019s PM2.5 on these days blew in from outside the city and is not shown here.',
    foot: 'Shares of Delhi\u2019s local sources only; they add to 100% before rounding. Daily estimates from IITM\u2019s Decision Support System, analysed by CSE [24].',
    slices: [
      { k: 'vehicles', n: 'Vehicles', s: 'Vehicles', v: 51.5, src: 'vehicles', d: 'More than half of Delhi\u2019s own PM2.5, and consistently 51–53% in mid-November across 2023 to 2025 [24].' },
      { k: 'household', n: 'Household fuels', s: 'Households', v: 13.2, src: 'household', d: 'Cooking and heating fires, including in informal settlements and for warmth on winter nights [24].' },
      { k: 'industry', n: 'Industry in Delhi & periphery', s: 'Industry', v: 11.0, src: 'industry', d: 'Factories and industrial areas in and around the city [24].' },
      { k: 'construction', n: 'Construction', s: 'Construction', v: 6.9, src: 'dust', d: 'Dust from building sites and demolition [24].' },
      { k: 'power', n: 'Energy (power & generators)', s: 'Energy', v: 5.4, src: 'industry', d: 'Power plants and other energy use inside the city [24].' },
      { k: 'burning', n: 'Waste burning', s: 'Waste fires', v: 4.7, src: 'waste', d: 'Garbage, leaves and landfill fires [24].' },
      { k: 'dust', n: 'Road dust', s: 'Road dust', v: 3.7, src: 'dust', d: 'Dust lifted by traffic from roads and kerbs [24].' },
      { k: 'other', n: 'Other', s: 'Other', v: 3.5, src: null, d: 'Smaller local sources grouped together [24].' }
    ]
  }
};

// Then-and-now tiles under the infographic.
PV.shifts = [
  ['Household fuels\u2019 share of India\u2019s PM2.5', '21–52%', 'studies of 2015–19', '15%', '2022', '[18]'],
  ['Indians exposed to smoke from solid cooking fuels', '63%', '2013', '42%', '2023', '[19]'],
  ['Households cooking with clean fuel', '44%', '2015–16', '59%', '2019–21', '[20]'],
  ['Farm fires in Punjab, Sept–Nov', '71,304', '2021', '5,114', '2025', '[22]']
];

// Typical monthly pattern in North India's Indo-Gangetic Plain (1 = cleaner, 5 = worst). Illustrative.
PV.calendar = [
  { m: 'Jan', v: 5, d: 'Cold, still air and frequent inversions; heating fires and fog trap smoke.' },
  { m: 'Feb', v: 4, d: 'Still winter-like nights, but winds start to pick up.' },
  { m: 'Mar', v: 3, d: 'Warmer days mix pollution higher; spring dust starts.' },
  { m: 'Apr', v: 3, d: 'Heat drives ozone up; dust and some wheat-stubble fires.' },
  { m: 'May', v: 3, d: 'Dust storms raise PM10; ozone peaks on hot afternoons.' },
  { m: 'Jun', v: 2, d: 'Dust early, then monsoon arrival brings relief.' },
  { m: 'Jul', v: 1, d: 'Monsoon rain washes particles out. The cleanest air of the year.' },
  { m: 'Aug', v: 1, d: 'Still monsoon; low pollution, though local sources never stop.' },
  { m: 'Sep', v: 2, d: 'Monsoon withdraws; levels begin to climb.' },
  { m: 'Oct', v: 4, d: 'Winds drop, nights cool, and paddy-stubble burning begins.' },
  { m: 'Nov', v: 5, d: 'Peak stubble fires, Diwali crackers and inversions combine. Often the worst weeks.' },
  { m: 'Dec', v: 5, d: 'Cold and calm; heating and waste fires; smog episodes.' }
];

// Effects on the body. Positions are on the 240 × 420 figure drawn in learn.js.
PV.body = [
  { id: 'brain', n: 'Brain', x: 140, y: 36, p: 'Fine particles and the inflammation they cause are linked to a higher risk of stroke. Growing evidence also links long-term exposure to dementia, and to slower cognitive development in children.', f: ['Stroke', 'Cognitive decline and dementia (emerging evidence)', 'Headaches, poor sleep'] },
  { id: 'ent', n: 'Eyes, nose & throat', x: 158, y: 62, p: 'The first parts of the body to feel bad air. Irritation is a warning sign that pollution is also reaching deeper.', f: ['Burning, watery eyes', 'Runny nose, sinus trouble', 'Sore throat and cough'] },
  { id: 'lungs', n: 'Lungs', x: 122, y: 138, p: 'PM2.5 lodges deep in the air sacs. Outdoor air pollution and particulate matter are classified as causes of lung cancer (Group 1 carcinogens) [10].', f: ['Asthma attacks and new asthma', 'COPD (chronic lung disease)', 'Lung cancer', 'Pneumonia and other infections'] },
  { id: 'heart', n: 'Heart & blood vessels', x: 152, y: 150, p: 'Much of air pollution\u2019s death toll comes from heart disease and stroke rather than lung disease. Particles trigger inflammation, stiffen blood vessels and raise blood pressure.', f: ['Heart attacks', 'Irregular heartbeat', 'High blood pressure'] },
  { id: 'blood', n: 'Blood & metabolism', x: 176, y: 186, p: 'The smallest particles cross from the lungs into the blood, carrying inflammation throughout the body.', f: ['Systemic inflammation', 'Higher risk of type 2 diabetes', 'Kidney effects (emerging evidence)'] },
  { id: 'pregnancy', n: 'Pregnancy & babies', x: 140, y: 222, p: 'Exposure during pregnancy affects the developing baby, and newborns\u2019 lungs are especially vulnerable.', f: ['Low birth weight', 'Preterm birth', 'Higher infant mortality'] },
  { id: 'children', n: 'Children\u2019s growth', x: 44, y: 318, p: 'Children breathe faster, take in more air for their body weight and spend more time outdoors, while their lungs are still growing.', f: ['Reduced lung growth that can last a lifetime', 'More respiratory infections', 'Missed school days'] }
];

PV.risk = [
  ['Children', 'Faster breathing, developing lungs and more time outdoors.'],
  ['Older adults', 'Weaker defences and more heart and lung disease.'],
  ['Pregnant women', 'Risks to the baby\u2019s growth and birth.'],
  ['People with asthma, COPD or heart disease', 'Bad-air days can trigger attacks and hospital visits.'],
  ['Outdoor workers', 'Traffic police, vendors, delivery and construction workers breathe street air for hours.'],
  ['Families cooking with solid fuels', 'Kitchen smoke can be many times worse than the street outside.']
];

PV.myths = [
  ['A few houseplants will clean the air in my home.', 'You would need somewhere between 10 and 1,000 plants per square metre to match what normal ventilation or a purifier does [11]. Plants are lovely; they are not air cleaners.'],
  ['If I\u2019m indoors, I\u2019m safe.', 'Outdoor PM2.5 seeps in through gaps, and homes add their own: frying, incense, mosquito coils and chulhas. Keep windows closed on bad days and use a HEPA purifier.'],
  ['Early-morning walks are the healthiest.', 'In North Indian winters, PM2.5 often peaks overnight and in the early morning, when an inversion traps it near the ground. Check the AQI first; late afternoon is often better.'],
  ['A cloth or surgical mask protects me from smog.', 'Fine particles get through the fabric and around loose edges. A well-fitted N95 or FFP2 filters at least 95% of fine particles.'],
  ['Air pollution is a Delhi problem.', 'Most Indian cities exceed the WHO guideline, and 130 are covered by the National Clean Air Programme, mostly because they miss India\u2019s own standards [8]. Only 14 of them met India\u2019s PM10 standard in 2025–26 [28].'],
  ['Stubble burning is the main cause of Delhi\u2019s smog.', 'Farm fires cause short, sharp spikes, but they averaged about 3.5% of Delhi\u2019s PM2.5 over the 2025 burning season and 10.6% in 2024 [23]. Vehicles, industry and pollution from the wider region drive it the rest of the time [24].'],
  ['Now that most homes have LPG, chulha smoke doesn\u2019t matter any more.', 'It has fallen a lot, but 42% of Indians were still exposed to solid-fuel smoke in 2023 [19], and households remain the largest PM2.5 source across much of North India in winter [18].'],
  ['If the sky looks clear, the air is clean.', 'PM2.5 and gases can be high on days that look fine. Visibility is a poor guide; the AQI is a good one.'],
  ['Burning dhoop or incense purifies the air.', 'Incense and agarbatti give off PM2.5 and volatile organic compounds. Use them sparingly, with windows open.']
];

// Quiz bank: the overview shows 8 random questions per load. `a` is the index of the correct option.
// Fact-or-myth items use the options ['Fact', 'Myth'] (a: 0 = fact, 1 = myth); their order is never shuffled.
PV.quiz = [
  { t: 'Basics', q: 'How wide is a PM2.5 particle?', o: ['2.5 millimetres', '2.5 micrometres or less', '25 micrometres', '0.25 metres'], a: 1, x: 'PM2.5 means particles 2.5 micrometres (µm) or smaller, about 30 times thinner than a human hair.' },
  { t: 'Basics', q: 'What share of the world\u2019s people breathe air that exceeds WHO guidelines?', o: ['About 25%', 'About 50%', 'About 75%', 'About 99%'], a: 3, x: 'WHO data show 99% of the world\u2019s population lives where air quality guideline levels are not met [2].' },
  { t: 'Basics', q: 'What does AQI stand for?', o: ['Air Quality Index', 'Atmospheric Quality Indicator', 'Air Quantity Index', 'Ambient Quality Instrument'], a: 0, x: 'India\u2019s National Air Quality Index was launched in 2014 and turns pollutant readings into one number from 0 to 500 [6].' },
  { t: 'Basics', q: 'In India\u2019s AQI, which category covers 201–300?', o: ['Moderate', 'Poor', 'Very Poor', 'Severe'], a: 1, x: 'Good 0–50, Satisfactory 51–100, Moderate 101–200, Poor 201–300, Very Poor 301–400, Severe 401–500.' },
  { t: 'Basics', q: 'How many pollutants can feed into India\u2019s AQI?', o: ['3', '5', '8', '12'], a: 2, x: 'PM2.5, PM10, NO₂, SO₂, CO, O₃, NH₃ and lead. The AQI is set by the worst sub-index.' },
  { t: 'Basics', q: 'Ground-level ozone is…', o: ['Emitted directly by cars', 'Formed when sunlight acts on NOx and VOCs', 'The same as the ozone layer', 'Harmless at ground level'], a: 1, x: 'Ozone forms in the air on hot, sunny days. High up it shields us from UV; at ground level it irritates the lungs.' },
  { t: 'Standards', q: 'What is the WHO\u2019s 2021 annual guideline for PM2.5?', o: ['5 µg/m³', '10 µg/m³', '25 µg/m³', '40 µg/m³'], a: 0, x: 'The WHO halved its guideline from 10 to 5 µg/m³ in 2021 [1].' },
  { t: 'Standards', q: 'What is India\u2019s annual standard (NAAQS) for PM2.5?', o: ['5 µg/m³', '15 µg/m³', '40 µg/m³', '100 µg/m³'], a: 2, x: 'India\u2019s 2009 standard is 40 µg/m³ annually and 60 µg/m³ over 24 hours [7], eight times the WHO annual guideline.' },
  { t: 'Standards', q: 'What does NCAP stand for?', o: ['National Carbon Action Plan', 'National Clean Air Programme', 'New Clean Air Policy', 'National Commission on Air Pollution'], a: 1, x: 'Launched in 2019, NCAP funds city action plans in 130 cities to cut particulate pollution [8][28].' },
  { t: 'Standards', q: 'In Delhi-NCR, what is GRAP?', o: ['A tree-planting scheme', 'An emergency plan with curbs that tighten as AQI worsens', 'A pollution tax', 'A satellite'], a: 1, x: 'The Graded Response Action Plan, run by CAQM, triggers stages of restrictions from "Poor" to "Severe+" [9].' },
  { t: 'Sources', q: 'With LPG now in most homes, which source inside India added the most to the PM2.5 Indians breathed in 2022?', o: ['Household cooking', 'Industry', 'Firecrackers', 'Construction dust'], a: 1, x: 'A 2026 study put industry at about 18% and households at 15%. Studies of 2015 to 2019 had households on top [18].' },
  { t: 'Sources', q: 'About how much of India\u2019s PM2.5 blows in from outside the country?', o: ['Almost none', 'About a quarter', 'About half', 'Nearly all'], a: 1, x: 'About 27% in 2022, more than any single source inside India [18].' },
  { t: 'Sources', q: 'Counting only sources inside Delhi, what adds the most to its winter PM2.5?', o: ['Vehicles', 'Household cooking', 'Firecrackers', 'Power plants'], a: 0, x: 'Vehicles made up about half of the PM2.5 from Delhi\u2019s own sources in the winters of 2023 to 2025 [24].' },
  { t: 'Sources', q: 'How did Punjab\u2019s farm-fire count in 2025 compare with 2021?', o: ['About the same', 'About 25% lower', 'About 93% lower', 'Twice as high'], a: 2, x: '5,114 fires in 2025, down 93% from 2021, though some burning now happens after satellites pass overhead [22].' },
  { t: 'Sources', q: 'What share of Indians were exposed to smoke from solid cooking fuels in 2023?', o: ['About 10%', 'About 42%', 'About 75%', 'About 90%'], a: 1, x: 'Down from 63% in 2013, largely thanks to LPG, but still hundreds of millions of people [19].' },
  { t: 'Sources', q: 'Why is North India\u2019s air usually worst in November?', o: ['More cars on the road', 'Stubble fires, festival crackers and winter inversions coincide', 'Factories work overtime', 'Monsoon dust'], a: 1, x: 'Emissions continue all year, but in November extra sources arrive just as cold, still air traps them.' },
  { t: 'Sources', q: 'What is a temperature inversion?', o: ['When it is colder at noon than at night', 'A warm layer of air sitting on cooler air near the ground, trapping pollution', 'A type of air purifier', 'A heat wave'], a: 1, x: 'Normally warm air rises and carries pollution away. An inversion acts like a lid.' },
  { t: 'Sources', q: 'Which gas from fertilisers and livestock helps form fine particles?', o: ['Oxygen', 'Ammonia', 'Helium', 'Argon'], a: 1, x: 'Ammonia reacts with SO₂ and NOx to form ammonium sulphate and nitrate, a major part of winter PM2.5.' },
  { t: 'Sources', q: 'Burning garbage in streets and public spaces in India is…', o: ['Allowed if under 1 kg', 'Forbidden under the Solid Waste Management Rules', 'Encouraged for leaves', 'Only banned in Delhi'], a: 1, x: 'It is forbidden across India. The Solid Waste Management Rules, 2026, in force since 1 April 2026, carry over the ban from the 2016 rules [17].' },
  { t: 'Health', q: 'About how many deaths in India were linked to air pollution in 2023?', o: ['About 2 lakh', 'About 7 lakh', 'About 20 lakh', 'About 70 lakh'], a: 2, x: 'More than 2 million (20 lakh), according to the State of Global Air 2025 report [19].' },
  { t: 'Health', q: 'Most deaths from air pollution are caused by…', o: ['Lung cancer only', 'Heart disease, stroke and lung disease', 'Eye infections', 'Allergies'], a: 1, x: 'Heart disease and stroke account for a very large share, alongside COPD, lung infections and lung cancer.' },
  { t: 'Health', q: 'Why are children more at risk?', o: ['They breathe more air for their body weight and their lungs are still growing', 'They are always indoors', 'They have bigger lungs', 'They aren\u2019t at more risk'], a: 0, x: 'Children breathe faster and are often outdoors at play, while their lungs keep developing until about age 20.' },
  { t: 'Health', q: 'Roughly how many cigarettes is a day of breathing air at 22 µg/m³ PM2.5 comparable to?', o: ['None', 'One', 'Ten', 'Twenty'], a: 1, x: 'Berkeley Earth estimated that 22 µg/m³ of PM2.5 for a day carries a health risk similar to smoking one cigarette [12].' },
  { t: 'Protect', q: 'Which mask protects best against PM2.5?', o: ['Cloth mask', 'Surgical mask', 'Well-fitted N95 / FFP2', 'Scarf'], a: 2, x: 'An N95 or FFP2 filters at least 95% of fine particles, but only if it seals well around the nose and chin.' },
  { t: 'Protect', q: 'What does HEPA stand for in air purifiers?', o: ['High-Efficiency Particulate Air', 'Home Environment Purification Apparatus', 'Heavy Emission Prevention Agent', 'Healthy Air Pump'], a: 0, x: 'True HEPA filters capture at least 99.97% of particles at 0.3 µm. Avoid ozone-generating "ionisers".' },
  { t: 'Protect', q: 'What does CADR on an air purifier tell you?', o: ['Its electricity use', 'How much clean air it delivers per hour or minute', 'Its noise level', 'Its filter life'], a: 1, x: 'Clean Air Delivery Rate. A common rule: CADR in cfm should be at least two-thirds of the room area in square feet [14].' },
  { t: 'Protect', q: 'Do houseplants meaningfully clean indoor air?', o: ['Yes, two plants per room is enough', 'Not really; you would need hundreds per room', 'Only money plants', 'Only at night'], a: 1, x: 'A 2020 review found you would need 10 to 1,000 plants per square metre to match normal ventilation [11].' },
  { t: 'Action', q: 'Which is the cleanest way to get around a city?', o: ['Solo car trips', 'Walking, cycling or public transport', 'Idling at signals', 'Old diesel vehicles'], a: 1, x: 'Shared and active travel cut emissions per person the most, and cycling also keeps you fit.' },
  { t: 'Action', q: 'Which app lets you check AQI and file pollution complaints with CPCB?', o: ['SAMEER', 'DigiLocker', 'UMANG Pay', 'IRCTC'], a: 0, x: 'CPCB\u2019s SAMEER app shows hourly AQI and lets citizens report pollution sources.' },
  { t: 'Action', q: 'What should you do with dry leaves instead of burning them?', o: ['Burn them at night', 'Compost or mulch them', 'Throw them in drains', 'Mix them with plastic'], a: 1, x: 'Leaves make excellent compost and mulch. Burning them adds PM2.5 right where people live.' },
  { t: 'Fact or myth', q: '\u201cAir pollution only harms the lungs.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Fine particles inflame the whole body. Heart disease and stroke cause a large share of pollution deaths, and it is also linked to about 6 lakh dementia deaths worldwide in 2023 [19].' },
  { t: 'Fact or myth', q: '\u201cPM2.5 can pass from the lungs into the bloodstream.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. Particles this small reach the deepest air sacs, and the finest cross into the blood and travel round the body [15].' },
  { t: 'Fact or myth', q: '\u201cThe air inside a home can be more polluted than the street outside.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. Chulhas, angithis, frying, incense and mosquito coils add their own smoke, and kitchen smoke from solid fuels can be many times worse than outdoor air.' },
  { t: 'Fact or myth', q: '\u201cIndia\u2019s legal limit for yearly PM2.5 is the same as the WHO guideline.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. India\u2019s 2009 standard is 40 µg/m³. The WHO guideline is 5 µg/m³, eight times stricter [1][7].' },
  { t: 'Fact or myth', q: '\u201cIndia tightened its air quality standards after the WHO updated its guidelines in 2021.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. India still uses its 2009 standards. A review began in 2020, and in December 2025 a parliamentary committee urged the government to notify new norms [29].' },
  { t: 'Fact or myth', q: '\u201cMost air-pollution deaths come from coughs and chest infections.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. In India, 89% of air-pollution deaths in 2023 were from non-communicable diseases such as heart disease, stroke, COPD, lung cancer and diabetes [19].' },
  { t: 'Fact or myth', q: '\u201cAir pollution is linked to diabetes.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. Nearly 1 in 5 diabetes deaths in India in 2023 were linked to air pollution, according to the State of Global Air 2025 report [19].' },
  { t: 'Fact or myth', q: '\u201cFarm fires made up less than 5% of Delhi\u2019s PM2.5, on average, over the 2025 burning season.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. About 3.5%, down from 10.6% in 2024, though on a few bad days fires can still add much more [23].' },
  { t: 'Fact or myth', q: '\u201cGround-level ozone is worst on cold winter nights.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Ozone forms when sunlight acts on NOx and VOCs, so it peaks on hot, sunny afternoons, often from April to June.' },
  { t: 'Fact or myth', q: '\u201cRain helps clean the air.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. Rain washes particles out of the air, which is why July and August are usually the cleanest months in North India.' },
  { t: 'Fact or myth', q: '\u201cThree in four Indians live where yearly PM2.5 is above even the WHO\u2019s most lenient interim target.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. About 75% of Indians live where annual PM2.5 is above 35 µg/m³, the WHO\u2019s first interim target [19].' },
  { t: 'Fact or myth', q: '\u201cAbout half the world breathes air that meets the WHO\u2019s PM2.5 guideline.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Fewer than 1% of people worldwide live where annual PM2.5 meets the 5 µg/m³ guideline [19].' },
  { t: 'Fact or myth', q: '\u201cAir pollution is linked to about 1 in 8 deaths worldwide.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. About 79 lakh (7.9 million) deaths in 2023, which makes it one of the world\u2019s leading causes of death [19].' },
  { t: 'Fact or myth', q: '\u201cIndians die from air pollution at about the same rate as people in rich countries.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. India\u2019s rate was 186 deaths per lakh people in 2023, more than ten times the 17 per lakh in high-income countries [19].' },
  { t: 'Fact or myth', q: '\u201cMost NCAP cities met their target of cutting PM10 by 40% by 2025–26.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. The government told Parliament in August 2026 that only 26 of the 130 NCAP cities met the target, and only 14 met India\u2019s PM10 standard [28].' },
  { t: 'Fact or myth', q: '\u201cEvery coal power plant in India must fit equipment to cut sulphur dioxide.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. In July 2025 the FGD requirement was limited mainly to plants near Delhi-NCR and million-plus cities, exempting about three in four coal units [25].' },
  { t: 'Fact or myth', q: '\u201cDiesel exhaust is officially classified as a cause of cancer.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. The WHO\u2019s cancer agency, IARC, classified diesel engine exhaust as carcinogenic to humans (Group 1) in 2012, mainly for lung cancer [30].' },
  { t: 'Fact or myth', q: '\u201cAn N95 mask works just as well over a beard.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Facial hair stops the mask sealing, so air leaks in around the edges instead of passing through the filter.' },
  { t: 'Fact or myth', q: '\u201cMasks are a safe way to protect babies under two from smog.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Masks aren\u2019t safe for children under 2. Protect babies by limiting time outdoors on bad days and cleaning the air in the room where they sleep.' },
  { t: 'Fact or myth', q: '\u201cIoniser and ozone-generating purifiers are a healthy choice.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Ozone irritates the lungs. Choose a purifier with a true HEPA filter and a published smoke CADR [14].' },
  { t: 'Fact or myth', q: '\u201cA box fan with a MERV-13 filter taped to it can work as a low-cost air cleaner.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. These DIY cleaners have been shown to cut indoor particles substantially. Seal the filter well and run it in a closed room.' },
  { t: 'Fact or myth', q: '\u201cHealthy adults can exercise outdoors as usual when the AQI is Severe.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. CPCB says Severe air affects healthy people, and effects may be felt even during light physical activity [6].' },
  { t: 'Fact or myth', q: '\u201cBurning dry leaves is harmless because they\u2019re natural.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Leaf smoke is full of PM2.5 and carbon monoxide, released right where people live. Compost or mulch leaves instead.' },
  { t: 'Fact or myth', q: '\u201cBurning plastic releases some of the most toxic air pollutants.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. Burning plastic and mixed garbage gives off dioxins, furans and black carbon as well as PM2.5. Burning waste in public places is banned [17].' },
  { t: 'Fact or myth', q: '\u201cFireworks only affect the air for a few minutes.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. In still winter air, smoke and metals from fireworks can hang over a city for hours, sometimes days.' },
  { t: 'Fact or myth', q: '\u201cLead in the air stopped being a problem when leaded petrol was banned.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Petrol has been lead-free in India since 2000, but informal battery recycling and smelters still release lead, and there is no known safe level for children.' },
  { t: 'Fact or myth', q: '\u201cUjjwala households refill about one LPG cylinder a month.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. They averaged about 4.7 refills a year in 2025–26 [21]. Affordable refills are what keep families cooking on LPG instead of wood and dung.' },
  { t: 'Fact or myth', q: '\u201cAbout half of rural households in India still don\u2019t cook with clean fuel.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. A 2022–23 national survey found 49.5% of rural households cooked with clean fuel, against 92.9% in cities [26].' },
  { t: 'Fact or myth', q: '\u201cIndia\u2019s AQI is the average of all the pollutants measured.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. The AQI is set by the worst pollutant\u2019s sub-index, which is usually PM2.5 or PM10 [6].' },
  { t: 'Fact or myth', q: '\u201cPollution a mother breathes during pregnancy can affect her baby.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. It is linked to low birth weight and preterm birth, both of which raise risks for the newborn.' },
  { t: 'Fact or myth', q: '\u201cA day of breathing Delhi\u2019s winter air carries a risk similar to smoking several cigarettes.\u201d', o: ['Fact', 'Myth'], a: 0, x: 'Fact. At about 110 µg/m³ of PM2.5, a day of breathing is comparable to about five cigarettes, using Berkeley Earth\u2019s estimate of 22 µg/m³ per cigarette [12].' },
  { t: 'Fact or myth', q: '\u201cVillages have clean air; pollution is a city problem.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. PM2.5 spreads across whole regions like the Indo-Gangetic Plain, and smoke from solid cooking fuels is worst in rural homes [18][26].' },
  { t: 'Fact or myth', q: '\u201cPlanting enough trees will fix a city\u2019s air pollution.\u201d', o: ['Fact', 'Myth'], a: 1, x: 'Myth. Trees help locally and are worth protecting, but they can\u2019t soak up pollution on the scale cities emit it. Cutting emissions is the real fix.' }
];

PV.stats = [
  [99, '% of people worldwide breathe air above WHO guideline levels [2]', v => Math.round(v)],
  [20, 'lakh deaths in India linked to air pollution in 2023 [19]', v => Math.round(v) + '+'],
  [186, 'air-pollution deaths per lakh people in India in 2023, vs 17 in high-income countries [19]', v => Math.round(v)],
  [8, '× India\u2019s annual PM2.5 standard vs the WHO guideline (40 vs 5 µg/m³)', v => Math.round(v)]
];

// [label, url, description]
PV.resources = [
  { group: 'Check the air now', items: [
    ['CPCB National AQI', 'https://airquality.cpcb.gov.in/AQI_India/', 'Official live AQI from India\u2019s monitoring stations.'],
    ['SAFAR-India', 'https://safar.tropmet.res.in/', 'Air quality and forecasts for major cities from IITM, Pune.'],
    ['World Air Quality Index', 'https://waqi.info/', 'Global map of real-time readings, including Indian stations.'],
    ['OpenAQ', 'https://openaq.org/', 'Open, downloadable air quality data from around the world.']
  ] },
  { group: 'Government & policy', items: [
    ['Central Pollution Control Board', 'https://cpcb.nic.in/', 'Standards, AQI bulletins, reports and the SAMEER app.'],
    ['PRANA: NCAP portal', 'https://prana.cpcb.gov.in/', 'Track the National Clean Air Programme and city action plans.'],
    ['Commission for Air Quality Management', 'https://caqm.nic.in/', 'Delhi-NCR authority that runs GRAP and issues directions.'],
    ['Ministry of Environment, Forest and Climate Change', 'https://moef.gov.in/', 'National environment policy and notifications.'],
    ['Pradhan Mantri Ujjwala Yojana', 'https://www.pmuy.gov.in/', 'LPG connections for low-income households.']
  ] },
  { group: 'Health evidence', items: [
    ['WHO Global Air Quality Guidelines (2021)', 'https://www.who.int/publications/i/item/9789240034228', 'The global health-based limits for six pollutants.'],
    ['WHO: Ambient air quality and health', 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health', 'Fact sheet on outdoor air pollution.'],
    ['WHO: Household air pollution', 'https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health', 'Fact sheet on cooking and heating smoke.'],
    ['State of Global Air', 'https://www.stateofglobalair.org/', 'Country-level health burden data from HEI and IHME.'],
    ['Air Quality Life Index', 'https://aqli.epic.uchicago.edu/', 'How many years of life pollution costs, by district.']
  ] },
  { group: 'Research & civil society', items: [
    ['Centre for Science and Environment', 'https://www.cseindia.org/', 'Research and advocacy on air, transport and energy.'],
    ['Council on Energy, Environment and Water', 'https://www.ceew.in/', 'Policy research including source studies.'],
    ['UrbanEmissions.info', 'https://urbanemissions.info/', 'Emission inventories, forecasts and city analyses.'],
    ['CREA', 'https://energyandcleanair.org/', 'Analysis of air quality trends and the energy sector.'],
    ['Clean Air Fund', 'https://www.cleanairfund.org/', 'Global philanthropy and India programmes on clean air.']
  ] },
  { group: 'Protect yourself', items: [
    ['US EPA: Guide to air cleaners in the home', 'https://www.epa.gov/indoor-air-quality-iaq/guide-air-cleaners-home', 'How to choose and size a purifier.'],
    ['US EPA: Particulate matter basics', 'https://www.epa.gov/pm-pollution/particulate-matter-pm-basics', 'What PM is and where it comes from.'],
    ['WHO: Air pollution topic page', 'https://www.who.int/health-topics/air-pollution', 'Overview, data and guidance.']
  ] }
];

PV.references = [
  'World Health Organization (2021). <i>WHO global air quality guidelines: particulate matter (PM2.5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide.</i> Geneva: WHO.',
  'World Health Organization. <i>Ambient (outdoor) air pollution</i>, fact sheet, updated 24 October 2024. 99% of the world\u2019s population lived where WHO guideline levels were not met in 2019.',
  'World Health Organization. <i>Household air pollution</i>, fact sheet, updated 16 December 2025. Estimated 2.9 million deaths in 2021, including over 309,000 children under five; about 2.1 billion people cook with polluting fuels.',
  'India State-Level Disease Burden Initiative Air Pollution Collaborators (2021). Health and economic impact of air pollution in the states of India: the Global Burden of Disease Study 2019. <i>The Lancet Planetary Health</i> 5(1): e25–e38.',
  'GBD MAPS Working Group (2018). <i>Burden of Disease Attributable to Major Air Pollution Sources in India.</i> Special Report 21. Boston: Health Effects Institute.',
  'Central Pollution Control Board (2014). <i>National Air Quality Index.</i> Ministry of Environment, Forest and Climate Change, Government of India.',
  'Central Pollution Control Board (2009). <i>National Ambient Air Quality Standards.</i> Gazette of India notification, 18 November 2009.',
  'Ministry of Environment, Forest and Climate Change (2019). <i>National Clean Air Programme (NCAP).</i> Government of India.',
  'Commission for Air Quality Management in NCR and Adjoining Areas. <i>Graded Response Action Plan (GRAP)</i>, revised schedule.',
  'International Agency for Research on Cancer (2016). <i>Outdoor Air Pollution.</i> IARC Monographs on the Evaluation of Carcinogenic Risks to Humans, Volume 109.',
  'Cummings, B. E. & Waring, M. S. (2020). Potted plants do not improve indoor air quality: a review and analysis of reported VOC removal efficiencies. <i>Journal of Exposure Science & Environmental Epidemiology</i> 30: 253–261.',
  'Muller, R. A. & Muller, E. A. (2015). <i>Air Pollution and Cigarette Equivalence.</i> Berkeley Earth.',
  'Energy Policy Institute at the University of Chicago (EPIC). <i>Air Quality Life Index</i>, annual update.',
  'US Environmental Protection Agency (2018). <i>Guide to Air Cleaners in the Home</i>, 3rd edition; and AHAM\u2019s "two-thirds rule" for sizing CADR.',
  'US Environmental Protection Agency. <i>Particulate Matter (PM) Basics.</i>',
  'Supreme Court of India (2018). <i>Arjun Gopal v. Union of India</i>, order on firecrackers and "green crackers".',
  'Ministry of Environment, Forest and Climate Change (2026). <i>Solid Waste Management Rules, 2026</i>, notified 27 January 2026, in force from 1 April 2026, superseding the Solid Waste Management Rules, 2016.',
  'Zhou, M., Mauzerall, D. L., Velamuri, V., Kota, S. H., Nambiar, M. & Xie, Y. (2026). Surface PM2.5 air pollution in 2022 India: emission updates, WRF-Chem model evaluation, and source attribution. <i>Atmospheric Chemistry and Physics</i> 26: 10533. <a href="https://doi.org/10.5194/acp-26-10533-2026" target="_blank" rel="noopener noreferrer">doi:10.5194/acp-26-10533-2026</a>',
  'Health Effects Institute (2025). <i>State of Global Air 2025.</i> Boston: HEI and IHME. 7.9 million deaths worldwide in 2023 (1 in 8 deaths); fewer than 1% of people live where the WHO PM2.5 guideline is met. India: more than 2 million deaths in 2023, 186 per lakh people, 89% from non-communicable diseases; about 75% of people living above the WHO interim target of 35 µg/m³; share exposed to household air pollution 63% (2013) and 42% (2023).',
  'International Institute for Population Sciences & Ministry of Health and Family Welfare (2021). <i>National Family Health Survey (NFHS-5), 2019–21: India Fact Sheet.</i> Households using clean fuel for cooking.',
  'Ministry of Petroleum and Natural Gas (2026). Lok Sabha Unstarred Question No. 734, answered 23 July 2026: about 10.58 crore PMUY connections as on 1 July 2026; average consumption about 4.71 refills per PMUY consumer in 2025–26.',
  'Commission for Air Quality Management, via Press Information Bureau (December 2025). Paddy stubble burning in Punjab and Haryana, 15 September–30 November 2025, monitored under the ISRO protocol.',
  'Central Pollution Control Board, using IITM\u2019s Decision Support System: average share of stubble burning in Delhi\u2019s PM2.5, 2020–2025. Lok Sabha reply (March 2025) and RTI reply reported by <i>Hindustan Times</i> (December 2025).',
  'Centre for Science and Environment (2024, 2025). Analyses of IITM Decision Support System data on Delhi\u2019s PM2.5 sources: 12 October–3 November 2024, and 10–20 November in 2023, 2024 and 2025.',
  'Ministry of Environment, Forest and Climate Change (2025). Notification of 11 July 2025 revising SO₂ emission norms for thermal power plants: FGD required for Category A plants (within 10 km of Delhi-NCR or million-plus cities), case by case for Category B, exempt for Category C; about 406 of 537 units fall in Category C, as reported by <i>The Hindu</i> and Health Policy Watch.',
  'National Statistics Office (2024). <i>Comprehensive Annual Modular Survey</i>, NSS 79th round, July 2022–June 2023: 63.4% of households use clean fuel for cooking (urban 92.9%, rural 49.5%). NFHS-6 (2023–24) fact sheets, released May 2026, did not report clean cooking fuel.',
  'Punjab Pollution Control Board, reported by ANI (10 November 2026): 4,657 stubble-burning incidents in Punjab up to 9 November 2026; the season runs to 30 November.',
  'Ministry of Environment, Forest and Climate Change, Lok Sabha reply of 10 August 2026, reported by <i>ThePrint</i>: 130 NCAP cities; 26 met the target of a 40% cut in PM10 by 2025–26, and 14 met the PM10 standard of 60 µg/m³.',
  'Department-related Parliamentary Standing Committee on Science and Technology, Environment, Forest and Climate Change (December 2025), reported by PTI: government asked to notify updated air quality norms. India\u2019s NAAQS were last notified in 2009; the review began in 2020.',
  'International Agency for Research on Cancer (2012). Press release No. 213: diesel engine exhaust classified as carcinogenic to humans (Group 1).',
  'Commission for Air Quality Management in NCR and Adjoining Areas (August 2024). Advisory asking Resident Welfare Associations and residential societies in Delhi to provide electric heaters to security and service staff, to curb open burning of biomass and waste in winter; reported by PTI.',
  'Ministry of New and Renewable Energy. <i>PM Surya Ghar: Muft Bijli Yojana</i>, launched February 2024: central subsidy for household rooftop solar, up to ₹78,000 for systems of 3 kW and above.'
];

PV.glossary = [
  ['AQI', 'Air Quality Index. Converts pollutant concentrations into a 0–500 score with six colour-coded categories. India\u2019s AQI is set by the worst pollutant.'],
  ['PM2.5', 'Particulate matter 2.5 micrometres across or smaller. The most harmful common pollutant.'],
  ['PM10', 'Inhalable particles up to 10 micrometres, including dust and pollen.'],
  ['µg/m³', 'Micrograms per cubic metre: how much pollutant, by weight, is in a cubic metre of air.'],
  ['NAAQS', 'National Ambient Air Quality Standards, India\u2019s legal limits for 12 pollutants (2009).'],
  ['NCAP', 'National Clean Air Programme (2019). City-level plans and funding to cut particulate pollution in 130 cities.'],
  ['Non-attainment city', 'A city that consistently fails to meet the NAAQS for PM10 or NO₂.'],
  ['GRAP', 'Graded Response Action Plan. Delhi-NCR emergency measures triggered in stages as AQI worsens.'],
  ['CAQM', 'Commission for Air Quality Management in NCR and Adjoining Areas, set up in 2020 and given statutory backing by an Act of Parliament in 2021.'],
  ['CAAQMS', 'Continuous Ambient Air Quality Monitoring Station, the instruments behind live AQI readings.'],
  ['Temperature inversion', 'A warm layer of air above cooler air near the ground that acts like a lid and traps pollution.'],
  ['Mixing height', 'How high pollution can spread vertically. Low in winter nights, high on summer afternoons.'],
  ['Secondary aerosol', 'Particles formed in the air from gases like SO₂, NOx and ammonia rather than emitted directly.'],
  ['Black carbon', 'Soot from incomplete burning. Harmful to health and a strong warming agent.'],
  ['VOCs', 'Volatile organic compounds from fuels, solvents and paints. Help form ozone.'],
  ['Source apportionment', 'A study estimating how much each source contributes to pollution in a place.'],
  ['Population-weighted average', 'An average that counts each place by how many people live there, so it reflects the air people actually breathe rather than the air over empty land.'],
  ['Transboundary pollution', 'Pollution that crosses a border: from another state, or from another country.'],
  ['DSS', 'Decision Support System for Air Quality Management, run by IITM Pune. It estimates daily how much each source adds to Delhi\u2019s PM2.5.'],
  ['PMUY', 'Pradhan Mantri Ujjwala Yojana, the 2016 scheme giving free LPG connections to women in poor households.'],
  ['Airshed', 'A region whose air mixes as one, regardless of city or state borders. Clean air needs airshed-level action.'],
  ['Parali', 'Paddy straw left after harvest; burning it is a major autumn source in North India.'],
  ['BS-VI', 'Bharat Stage VI, India\u2019s fuel and vehicle emission standard since April 2020.'],
  ['FGD', 'Flue-gas desulphurisation, equipment that removes SO₂ from power-plant smoke. Since July 2025 it is required mainly at plants near Delhi-NCR and million-plus cities.'],
  ['PUC', 'Pollution Under Control certificate, a mandatory periodic emission check for vehicles.'],
  ['HEPA', 'High-Efficiency Particulate Air filter, capturing at least 99.97% of 0.3 µm particles.'],
  ['CADR', 'Clean Air Delivery Rate: how much filtered air a purifier delivers, in m³/h or cfm.'],
  ['N95 / FFP2', 'Respirator masks rated to filter at least 95% (N95) or 94% (FFP2) of fine particles when well fitted.'],
  ['Smog', 'Smoke plus fog. Today it means a thick haze of pollutants, often in winter.'],
  ['SAFAR', 'System of Air Quality and Weather Forecasting and Research, run by IITM Pune.']
];
