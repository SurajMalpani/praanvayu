# Praanvayu

**Praanvayu** (प्राणवायु, "breath of life") is an interactive guide to air pollution in India. It explains what's in the air, where it comes from and what it does to your body, then helps you protect yourself, take action and sign up as a clean-air volunteer. It describes itself as "an independent, citizen-led initiative".

## Running it

It's a static site with no build step. Open `Praanvayu/index.html` in a browser, or serve the folder with any static server, for example `python3 -m http.server`. Serving it is more reliable: on `file://` some browsers block the saved pledge and the address bar updates.

The only external resource is Google Fonts (Baloo 2 and Inter). There's no live air-quality feed: visitors enter today's AQI themselves, from the CPCB or SAFAR apps.

## What's inside

- **Overview:** key stats, a clickable AQI colour scale ("Read the AQI in ten seconds"), the mission (AQI below 100 within five years and below 50 by 2035) and an eight-question quiz.
- **Learn**
  - **What's in the air:** the pollutants, how small PM2.5 is, what a PM2.5 reading means, and India's standards compared with the WHO guideline.
  - **What causes it:** a "Who adds what" donut chart of each source's share of PM2.5 (all India in 2022, or Delhi's own sources in winter 2024) with then-and-now trends, a source explorer, why winter nights are worst, a pollution calendar for the Indo-Gangetic Plain, and indoor air.
  - **Health effects:** an interactive body map, who is most at risk, and when to get medical help.
- **Protect yourself**
  - A personal action plan for today's AQI, for healthy adults, at-risk groups or outdoor workers
  - Which masks actually work
  - Cleaning the air indoors
  - A purifier size calculator (room size gives the CADR you need)
  - Myth or fact
- **Take action & volunteer**
  - A clean-air habits check
  - A shareable pledge, saved on the device
  - Ideas for your community
  - How to report pollution and speak up (SAMEER, Swachhata, RTI and more)
  - **Find your local officials:** search by pin code, city, district, state or locality to get the municipal helplines, ward or zone offices, state grievance portal and pollution control board that handle garbage pickup (ghanta gaadi), open burning and dust. See below.
  - A volunteer sign-up form with nine roles, such as Clean Air Ambassador, Citizen science and Data & tech
- **Resources & references:** links for checking the air, government policy, health evidence and research, 24 numbered references, and a searchable glossary.

## Volunteer sign-ups

Out of the box, the volunteer form opens a pre-filled email to `contact@praanvayu.org`. To collect sign-ups in a Google Sheet instead:

1. Create a Google Sheet, for example "Praanvayu volunteers".
2. Open **Extensions → Apps Script**, paste in `volunteer-sheet.gs` and save.
3. Choose **Deploy → New deployment**, type **Web app**, with **Execute as: Me** and **Who has access: Anyone**. Authorize it and copy the URL ending in `/exec`.
4. Paste that URL into `volunteerEndpoint` in `js/config.js`.
5. Send a test sign-up and check for a new row in the **Volunteers** tab.

The script appends one row per sign-up (`submitted_at`, `name`, `email`, `phone`, `city`, `roles`, `availability`, `languages`, `message`). It guards against spreadsheet formula injection and silently drops bots that fill the hidden `website` field. After editing the script, deploy a **New version**, or the old code keeps running.

Apps Script doesn't send CORS headers, so the form posts in `no-cors` mode and can't read the response. If the request fails at the network level, the page falls back to the email option.

## Local officials finder

`js/officials.js` holds the data and the search; `js/pincodes.js` maps every Indian pin code to its district and state and is only loaded when someone searches.

- **National:** Swachhata-MoHUA app, SAMEER, the 14420 sewer helpline and CPGRAMS.
- **Every state and UT (36):** its public grievance portal (which accepts complaints about any municipality or gram panchayat) and its State Pollution Control Board or Committee, with office numbers from CPCB's directory.
- **Cities:** helplines, WhatsApp lines and ward or zone offices for about 30 municipal bodies (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Pune, Lucknow, Jaipur and more), plus all 29 Maharashtra corporations by name.
- **Search:** a pin code resolves to its district and the municipal bodies there; city names, old names (Bombay, Gurgaon), districts, states and post-office localities (Koramangala, Andheri) all work.

Data policy: official offices and published helpline numbers only, never personal mobiles or officers' names. Each row has a source link and a `verified` flag: `true` only when copied from the body's own site, otherwise the card says "Confirm before relying". Many numbers come from news reports or third-party compilations, so check them before printing or sharing widely.

To add a city, add it to `CITY` (state code, the district names as India Post spells them, alternative names), then add its offices with `add(city, source, verified, rows)`. To rebuild the pin data, see `tools/build-pincodes.js`.

## Notes

- The guide is educational and not medical advice.
- Figures come from the cited references and are fixed in `js/data.js`; they don't update automatically.
- The pollution calendar describes a typical year in North India. Coastal and southern cities differ.

## Project structure

```
Praanvayu/
├── index.html          All tabs and sections
├── styles.css          Styling
├── volunteer-sheet.gs  Google Apps Script that saves volunteer sign-ups to a Sheet
├── Logo.png            Logo (not used by the page)
├── img/
│   ├── logo_mark.png   Header mark and favicon
│   └── logo_full.png   Full logo
├── js/
│   ├── config.js       Settings (volunteerEndpoint)
│   ├── data.js         Content: AQI bands, pollutants, sources, source shares, quiz, stats, references, glossary
│   ├── ui.js           Shared helpers, saved data, AQI and PM2.5 conversions
│   ├── learn.js        Overview and Learn tabs
│   ├── act.js          Protect and Take action tabs, including the volunteer form
│   ├── officials.js    Local officials finder: national, state and city contacts, and the search
│   ├── pincodes.js     Pin code → district and state index (generated, loaded on demand)
│   └── app.js          Tab routing and the Resources tab
└── tools/
    └── build-pincodes.js   Regenerates js/pincodes.js from India Post's pin code directory
```
