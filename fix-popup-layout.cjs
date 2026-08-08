const fs = require('fs');

// 1. Update index.css
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.is-popup')) {
  css += `

/* Fix for side-by-side layouts in popups */
.is-popup .lg\\:flex-row {
  flex-direction: column !important;
}
.is-popup .md\\:flex-row {
  flex-direction: column !important;
}
.is-popup .lg\\:w-1\\/3,
.is-popup .lg\\:w-2\\/3,
.is-popup .lg\\:w-1\\/2,
.is-popup .md\\:w-1\\/2,
.is-popup .md\\:w-1\\/3,
.is-popup .md\\:w-2\\/3 {
  width: 100% !important;
}
.is-popup .lg\\:grid-cols-2,
.is-popup .lg\\:grid-cols-3,
.is-popup .lg\\:grid-cols-4,
.is-popup .md\\:grid-cols-2,
.is-popup .md\\:grid-cols-3 {
  grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
}
.is-popup .max-w-container-max {
  max-width: 100% !important;
}
.is-popup .sticky {
  position: static !important;
}
`;
  fs.writeFileSync('src/index.css', css);
}

// 2. Update PopupOverlay.tsx
let popupCode = fs.readFileSync('src/components/PopupOverlay.tsx', 'utf8');
popupCode = popupCode.replace(
  '<div className="embedded-page-content">',
  '<div className="embedded-page-content is-popup">'
);
fs.writeFileSync('src/components/PopupOverlay.tsx', popupCode);

console.log("Popup layout fixes applied.");
