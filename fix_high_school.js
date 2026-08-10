import fs from 'fs';

// 1. Fix BlockFormEditor.tsx
let editorContent = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
const editorPattern = /(block\.type === "high_school_programs"[\s\S]*?\{ key: "icon", label: "İkon", type: "icon" \},)/;

editorContent = editorContent.replace(editorPattern, `$1\n                { key: "buttonText", label: "Buton Yazısı (Örn: Detaylı Bilgi)", type: "text" },\n                { key: "url", label: "Buton Linki", type: "url" },`);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', editorContent);

// 2. Fix PageBlocks.tsx
let pageBlocksContent = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The block starts around line 7609: if (block.type === "high_school_programs") {
// We need to replace:
/*
                      <div
                        className={`font-label-md text-label-md ${isPrimary ? "text-primary" : "text-secondary"} group-hover:translate-x-2 transition-transform flex items-center gap-1`}
                      >
                        Detaylı Bilgi{" "}
                        <span
                          className="material-symbols-outlined text-sm whitespace-pre-line"
                          translate="no"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </div>
*/
// To use a link if url exists, and use item.buttonText or "Detaylı Bilgi"

const buttonPattern = /<div\s+className=\{`font-label-md text-label-md \$\{isPrimary \? "text-primary" : "text-secondary"\} group-hover:translate-x-2 transition-transform flex items-center gap-1`\}\s*>\s*Detaylı Bilgi\{" "\}\s*<span\s+className="material-symbols-outlined text-sm whitespace-pre-line"\s+translate="no"\s+aria-hidden="true"\s*>\s*arrow_forward\s*<\/span>\s*<\/div>/;

const replacement = `{item.buttonText !== "" && (
                        <div
                          className={\`font-label-md text-label-md \${isPrimary ? "text-primary" : "text-secondary"} group-hover:translate-x-2 transition-transform flex items-center gap-1\`}
                        >
                          {item.buttonText || "Detaylı Bilgi"}{" "}
                          <span
                            className="material-symbols-outlined text-sm whitespace-pre-line"
                            translate="no"
                            aria-hidden="true"
                          >
                            arrow_forward
                          </span>
                        </div>
                      )}`;

pageBlocksContent = pageBlocksContent.replace(buttonPattern, replacement);

// We should also change the wrapping div to an 'a' tag if url exists
// The wrapping div is <div key={i} className="bg-surface-card...
const itemWrapPattern = /(<div\s+key=\{i\}\s+className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-sm transition-all group cursor-pointer relative overflow-hidden whitespace-pre-line"\s+style=\{getCardStyle\(item, block\)\}\s*>)([\s\S]*?)(<\/div>\s+\);\s+\}\))/;

// Let's use a dynamic wrapper function in React instead of complex regex if possible.
// Actually, it's easier to just replace `<div key={i} className="bg-surface-card...` with `const Tag = item.url ? "a" : "div"; \n <Tag href={item.url || undefined} key={i} ...`

// Let's do it carefully with string replace.
