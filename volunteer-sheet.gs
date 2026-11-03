/**
 * Praanvayu volunteer sign-ups → Google Sheet.
 *
 * Setup (about 5 minutes):
 *  1. Create a Google Sheet (e.g. "Praanvayu volunteers") in the account that should own the data.
 *  2. In the sheet: Extensions → Apps Script. Replace the editor contents with this file and save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Authorise when asked, then copy the web-app URL (ends in /exec).
 *  4. Paste that URL into volunteerEndpoint in js/config.js.
 *  5. Submit a test sign-up on the site and check that a row appears in the "Volunteers" tab.
 *
 * "Anyone" can only append rows through this script; nobody can read the sheet unless you share it.
 * After editing this script, use Deploy → Manage deployments → Edit → New version, or the URL keeps running the old code.
 */

const SHEET_NAME = 'Volunteers';
const FIELDS = ['name', 'email', 'phone', 'city', 'roles', 'availability', 'languages', 'message'];
const MAX_LEN = 2000;

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true }); // honeypot filled: a bot
  if (!p.name || !p.email || !p.city) return json_({ ok: false, error: 'missing required fields' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['submitted_at'].concat(FIELDS));
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date()].concat(FIELDS.map(f => clean_(p[f]))));
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Text starting with = + - @ would otherwise be run as a spreadsheet formula.
function clean_(v) {
  const s = String(v || '').slice(0, MAX_LEN).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
