const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

const oldResponsiveCSS = `/* Responsive Dynamic Styles for Blocks */
[style*="--desktop-text-align"] { text-align: var(--mobile-text-align, var(--desktop-text-align)) !important; }
[style*="--desktop-font-size"] { font-size: var(--mobile-font-size, var(--desktop-font-size)) !important; }
[style*="--desktop-padding-top"] { padding-top: var(--mobile-padding-top, var(--desktop-padding-top)) !important; }
[style*="--desktop-padding-bottom"] { padding-bottom: var(--mobile-padding-bottom, var(--desktop-padding-bottom)) !important; }
[style*="--desktop-padding-left"] { padding-left: var(--mobile-padding-left, var(--desktop-padding-left)) !important; }
[style*="--desktop-padding-right"] { padding-right: var(--mobile-padding-right, var(--desktop-padding-right)) !important; }
[style*="--desktop-margin-top"] { margin-top: var(--mobile-margin-top, var(--desktop-margin-top)) !important; }
[style*="--desktop-margin-bottom"] { margin-bottom: var(--mobile-margin-bottom, var(--desktop-margin-bottom)) !important; }

@media (min-width: 1025px) {
  [style*="--desktop-text-align"] { text-align: var(--desktop-text-align) !important; }
  [style*="--desktop-font-size"] { font-size: var(--desktop-font-size) !important; }
  [style*="--desktop-padding-top"] { padding-top: var(--desktop-padding-top) !important; }
  [style*="--desktop-padding-bottom"] { padding-bottom: var(--desktop-padding-bottom) !important; }
  [style*="--desktop-padding-left"] { padding-left: var(--desktop-padding-left) !important; }
  [style*="--desktop-padding-right"] { padding-right: var(--desktop-padding-right) !important; }
  [style*="--desktop-margin-top"] { margin-top: var(--desktop-margin-top) !important; }
  [style*="--desktop-margin-bottom"] { margin-bottom: var(--desktop-margin-bottom) !important; }
}`;

const newResponsiveCSS = `/* Responsive Dynamic Styles for Blocks */
@media (max-width: 1024px) {
  [style*="--mobile-text-align"] { text-align: var(--mobile-text-align) !important; }
  [style*="--mobile-font-size"] { font-size: var(--mobile-font-size) !important; }
  [style*="--mobile-padding-top"] { padding-top: var(--mobile-padding-top) !important; }
  [style*="--mobile-padding-bottom"] { padding-bottom: var(--mobile-padding-bottom) !important; }
  [style*="--mobile-padding-left"] { padding-left: var(--mobile-padding-left) !important; }
  [style*="--mobile-padding-right"] { padding-right: var(--mobile-padding-right) !important; }
  [style*="--mobile-margin-top"] { margin-top: var(--mobile-margin-top) !important; }
  [style*="--mobile-margin-bottom"] { margin-bottom: var(--mobile-margin-bottom) !important; }
}

@media (min-width: 1025px) {
  [style*="--desktop-text-align"] { text-align: var(--desktop-text-align) !important; }
  [style*="--desktop-font-size"] { font-size: var(--desktop-font-size) !important; }
  [style*="--desktop-padding-top"] { padding-top: var(--desktop-padding-top) !important; }
  [style*="--desktop-padding-bottom"] { padding-bottom: var(--desktop-padding-bottom) !important; }
  [style*="--desktop-padding-left"] { padding-left: var(--desktop-padding-left) !important; }
  [style*="--desktop-padding-right"] { padding-right: var(--desktop-padding-right) !important; }
  [style*="--desktop-margin-top"] { margin-top: var(--desktop-margin-top) !important; }
  [style*="--desktop-margin-bottom"] { margin-bottom: var(--desktop-margin-bottom) !important; }
}`;

content = content.replace(oldResponsiveCSS, newResponsiveCSS);
fs.writeFileSync('src/index.css', content);
console.log("Patched index.css");
