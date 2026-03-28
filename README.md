# Liat Wolf — Cleaning Service Website

## File Structure
- `index.html` — Home page (דף הבית)
- `services.html` — Services page (שירותים)
- `about.html` — About Liat page (על ליאת)
- `contact.html` — Contact page (יצירת קשר)
- `styles.css` — All styles, organized by section (see comments inside)
- `script.js` — Scroll animations, header state, hue shift
- `sentences.js` — Rotating eyebrow label sentences
- `assets/` — Images, logos, SVGs

## How to Update
- **Text changes:** Edit the Hebrew text directly in the HTML files.
  Don't forget to update the same text in ALL files if it's in the header or footer.
- **Colors:** All colors are defined as CSS variables in `:root` at the top of `styles.css`.
- **Rotating sentences:** Edit the array in `sentences.js`.
  To add a rotating label, add `data-rotate="true"` to an element.
- **Adding a new section:** Copy the pattern from an existing section.
  Use `light-section`, `dark-section`, or `accent-section` for the background.
  Add a `section-divider` between sections with the appropriate `--to-X` class.

## Contact
Phone: `052-730-3546`
WhatsApp: <https://wa.me/972527303546>
