# Sutanu Ghosh Portfolio (plain HTML, CSS, JavaScript)

No React, Vue or Angular. Works by double-clicking `index.html` (no ES modules) or on any static host.
Libraries loaded from CDN: GSAP + ScrollTrigger, Lenis, SplitType, particles.js, EmailJS.

## Structure
```
index.html          all page content (edit text here)
css/tokens.css      LIGHT and DARK colour tokens, fonts, container width (--wrap)
css/base.css nav.css hero.css sections.css projects.css contact.css
js/config.js        EmailJS keys, DOB default
js/app.js           theme, animations, nav, filters, form
assets/             Sutanu_Ghosh_Resume.pdf / .docx, favicon, og-image, images/profile.jpg
```

## Edit
- Photo: add `assets/images/profile.jpg` (portrait, ~900x1100). A "SG" monogram shows until then.
- Colours: `css/tokens.css` (`:root` = light, `:root[data-theme="dark"]` = dark; the site opens in dark by default).
- Container width: `--wrap` in `css/tokens.css` (now 1320px). Card density: `.pgrid` in `css/projects.css`.
- CV: replace the files in `assets/` keeping the same names.

## EmailJS (contact form)
Keys are in `js/config.js`. The Template ID must exist in the same EmailJS account as the Service ID and Public Key.
The template must use these variables: `from_name, from_email, company, enquiry_type, subject, message, reply_to`.
Set "To email" to sutanug100@gmail.com and "Reply-To" to `{{reply_to}}`.
The form only shows success when EmailJS confirms; otherwise it shows the real error.

## Deploy (free)
Netlify: drag this folder onto https://app.netlify.com/drop. GitHub Pages / Cloudflare Pages: publish the folder as-is.
After deploying, add `og:url` and `og:image` tags to `index.html`.
