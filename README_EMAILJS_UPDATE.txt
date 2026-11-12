Portfolio update notes

- Main website sections are now written directly in index.html. JavaScript no longer builds the page markup.
- CSS remains separated in the css/ folder.
- JavaScript remains separated in the js/ folder.
- Contact form uses EmailJS Browser SDK v4 loaded from jsDelivr.
- EmailJS configuration is in js/config.js:
  Public Key: P3Ut3NVOO5WoDBBFn
  Service ID: service_p4jjhqm
  Template ID: template_3z7rapz
- The old Stay Connected newsletter section and its submission code were removed.
- Replaced it with an Open to the Right Opportunity section for recruiters.

IMPORTANT EMAILJS NOTE:
The browser console previously returned HTTP 400: "The template ID not found" for template_3z7rapz. The code now uses the exact ID supplied by the user. If this error continues, verify in the same EmailJS account that the Contact Us template is saved and that its Template ID exactly matches template_3z7rapz. A template ID cannot be corrected from website code if the dashboard account does not contain that template.

Run locally using VS Code Live Server or deploy the folder to GitHub Pages/Netlify. Because app.js uses ES modules, avoid opening index.html directly with file://.
