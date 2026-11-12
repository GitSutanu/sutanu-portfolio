/**
 * Sutanu Ghosh Portfolio - Google Apps Script backend
 * Handles: (1) professional enquiry form  (2) newsletter subscription
 * Stores rows in Google Sheets and emails notifications via Gmail (MailApp).
 *
 * Setup: bind this script to a Google Sheet (Extensions > Apps Script), paste this file,
 * run setup() once to authorize, then Deploy > New deployment > Web app.
 */

// ===================== CONFIG (edit here) =====================
const CONFIG = {
  RECIPIENT: "sutanug100@gmail.com",   // where notifications are sent
  SITE_NAME: "Sutanu Ghosh Portfolio",
  ENQUIRY_SHEET: "Enquiries",
  SUBSCRIBER_SHEET: "Subscribers",
  MIN_FILL_MS: 3000,                   // forms submitted faster than this are treated as bots
  MAX_PER_HOUR: 3,                     // max submissions per email address per hour
  DUPLICATE_WINDOW_SEC: 3600,          // identical enquiry ignored within this window
};
const ENQUIRY_TYPES = ["Job Opportunity", "Interview Invitation", "Recruitment Enquiry", "Professional Connection", "Other"];
const EMAIL_RE = /^[^\s@<>()\[\]\\,;:"]+@[^\s@<>()\[\]\\,;:"]+\.[A-Za-z]{2,}$/;

// ===================== ENTRY POINTS =====================
function doGet() {
  return ContentService.createTextOutput("Portfolio form backend is running.");
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const rid = /^[A-Za-z0-9-]{8,64}$/.test(p.rid || "") ? p.rid : "";
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    // --- anti-spam ---
    if (clean(p.website, 200)) return reply(rid, false, "Submission rejected.");
    if (!rid) return reply(rid, false, "Invalid request. Please reload the page and try again.");
    const fillMs = Number(p.fillMs);
    if (!isFinite(fillMs) || fillMs < CONFIG.MIN_FILL_MS) return reply(rid, false, "That was too fast. Please wait a few seconds and submit again.");

    if (p.formType === "contact") return handleContact(rid, p);
    if (p.formType === "newsletter") return handleNewsletter(rid, p);
    return reply(rid, false, "Unknown form type.");
  } catch (err) {
    console.error(err);
    return reply(rid, false, "The server could not process your request. Please try again or email " + CONFIG.RECIPIENT + ".");
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// ===================== HANDLERS =====================
function handleContact(rid, p) {
  const d = {
    name: clean(p.name, 100), email: clean(p.email, 254).toLowerCase(), company: clean(p.company, 100),
    type: clean(p.enquiryType, 60), subject: clean(p.subject, 150), message: cleanMultiline(p.message, 3000),
  };
  if (d.name.length < 2) return reply(rid, false, "Please enter your full name.");
  if (!EMAIL_RE.test(d.email)) return reply(rid, false, "Please enter a valid email address.");
  if (ENQUIRY_TYPES.indexOf(d.type) === -1) return reply(rid, false, "Please choose an enquiry type.");
  if (d.subject.length < 3) return reply(rid, false, "Please enter a subject (at least 3 characters).");
  if (d.message.length < 10) return reply(rid, false, "Please write a message of at least 10 characters.");

  const cache = CacheService.getScriptCache();
  const dupKey = "dup:" + hash(d.email + "|" + d.subject + "|" + d.message);
  if (cache.get(dupKey)) return reply(rid, false, "This enquiry was already received. No need to send it again.");
  if (overLimit(cache, d.email)) return reply(rid, false, "Too many submissions from this email address. Please try again later.");

  const sheet = getSheet(CONFIG.ENQUIRY_SHEET, ["Received", "Name", "Email", "Company", "Enquiry type", "Subject", "Message", "Email status"]);
  sheet.appendRow([new Date(), safeCell(d.name), safeCell(d.email), safeCell(d.company), d.type, safeCell(d.subject), safeCell(d.message), "Pending"]);
  const row = sheet.getLastRow();
  cache.put(dupKey, "1", CONFIG.DUPLICATE_WINDOW_SEC);

  try {
    MailApp.sendEmail({
      to: CONFIG.RECIPIENT, replyTo: d.email, name: CONFIG.SITE_NAME,
      subject: "[Portfolio] " + d.type + ": " + d.subject,
      body: ["New enquiry from your portfolio", "", "Name: " + d.name, "Email: " + d.email, "Company: " + (d.company || "-"),
             "Enquiry type: " + d.type, "Subject: " + d.subject, "", "Message:", d.message].join("\n"),
      htmlBody: '<div style="font-family:Arial,sans-serif;max-width:560px">' +
        "<h2>New portfolio enquiry</h2>" +
        "<p><b>Name:</b> " + esc(d.name) + "<br><b>Email:</b> " + esc(d.email) + "<br><b>Company:</b> " + esc(d.company || "-") +
        "<br><b>Enquiry type:</b> " + esc(d.type) + "<br><b>Subject:</b> " + esc(d.subject) + "</p>" +
        "<p><b>Message:</b></p><p style=\"white-space:pre-wrap\">" + esc(d.message) + "</p>" +
        "<p style=\"color:#666\">Reply to this email to answer the sender directly.</p></div>",
    });
    sheet.getRange(row, 8).setValue("Sent");
  } catch (mailErr) {
    console.error(mailErr);
    sheet.getRange(row, 8).setValue("FAILED: " + String(mailErr).slice(0, 120));
    return reply(rid, false, "Your enquiry was saved, but the notification email failed. Please also email " + CONFIG.RECIPIENT + " directly.");
  }
  return reply(rid, true, "Thank you, " + d.name.split(" ")[0] + ". Your enquiry has been delivered. I will reply to " + d.email + " soon.");
}

function handleNewsletter(rid, p) {
  const email = clean(p.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return reply(rid, false, "Please enter a valid email address.");
  if (p.consent !== "yes") return reply(rid, false, "Please tick the consent box to subscribe.");

  const cache = CacheService.getScriptCache();
  if (overLimit(cache, "news:" + email)) return reply(rid, false, "Too many attempts. Please try again later.");

  const sheet = getSheet(CONFIG.SUBSCRIBER_SHEET, ["Subscribed", "Email", "Source", "Consent"]);
  const last = sheet.getLastRow();
  if (last > 1) {
    const existing = sheet.getRange(2, 2, last - 1, 1).getValues().map(function (r) { return String(r[0]).toLowerCase(); });
    if (existing.indexOf(email) !== -1) return reply(rid, true, "This email address is already subscribed. Nothing more to do.");
  }
  sheet.appendRow([new Date(), safeCell(email), "Portfolio website", "Consent given"]);

  try {
    MailApp.sendEmail({
      to: CONFIG.RECIPIENT, name: CONFIG.SITE_NAME, subject: "[Portfolio] New subscriber: " + email,
      body: "New newsletter subscriber (consent given): " + email + "\nSaved in the '" + CONFIG.SUBSCRIBER_SHEET + "' tab.",
    });
  } catch (mailErr) {
    console.error(mailErr); // subscription itself is saved; notification is best-effort
  }
  return reply(rid, true, "You are subscribed. Thank you for staying connected.");
}

// ===================== HELPERS =====================
function reply(rid, ok, message) {
  const payload = JSON.stringify({ source: "sg-portfolio", rid: rid, ok: ok, message: message }).replace(/</g, "\\u003c");
  const html = "<!doctype html><html><body><script>try{window.top.postMessage(" + payload + ",'*');}catch(e){}</script>" +
    "<p style=\"font-family:Arial\">" + esc(message) + "</p></body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sh;
}

function overLimit(cache, key) {
  const k = "rl:" + hash(key);
  const n = Number(cache.get(k) || 0);
  if (n >= CONFIG.MAX_PER_HOUR) return true;
  cache.put(k, String(n + 1), 3600);
  return false;
}

function hash(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s).map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
}
function clean(v, max) { return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max); }
function cleanMultiline(v, max) { return String(v == null ? "" : v).replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max); }
function safeCell(v) { v = String(v); return /^[=+\-@\t\r]/.test(v) ? "'" + v : v; } // blocks spreadsheet formula injection
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }

// ===================== ONE-TIME SETUP / TEST =====================
/** Run once from the editor: creates both tabs, asks for permissions, sends a test email. */
function setup() {
  getSheet(CONFIG.ENQUIRY_SHEET, ["Received", "Name", "Email", "Company", "Enquiry type", "Subject", "Message", "Email status"]);
  getSheet(CONFIG.SUBSCRIBER_SHEET, ["Subscribed", "Email", "Source", "Consent"]);
  MailApp.sendEmail(CONFIG.RECIPIENT, "[Portfolio] Backend setup test", "If you can read this, Gmail sending works.");
  Logger.log("Setup complete. Check " + CONFIG.RECIPIENT + " for the test email.");
}
