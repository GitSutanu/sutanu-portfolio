/* =========================================================
   SITE CONFIGURATION
   Update these values before publishing.
   ========================================================= */

// EmailJS: create a service + email template at https://dashboard.emailjs.com/
window.SUTANU_EMAILJS = {
  PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",
  SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",
  TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID"
};

// Existing Google Apps Script endpoint is used for newsletter storage.
// Paste your deployed Web App URL (ending in /exec). Leave blank until deployed.
window.SUTANU_NEWSLETTER = {
  APPS_SCRIPT_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"
};

// Optional profile photo: place profile.jpg inside assets/images/ and set true.
window.SUTANU_SHOW_DOB = true;
