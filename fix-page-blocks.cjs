const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const badgeOverlayCode = `
                  {(block.imageBadgeTitle || block.imageBadgeDesc) && (
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end whitespace-pre-line">
                      <div className="bg-surface/90 backdrop-blur-sm p-4 rounded-lg border border-border-subtle whitespace-pre-line">
                        <div className="flex items-center gap-3 whitespace-pre-line">
                          <span
                            className="material-symbols-outlined text-secondary text-[32px] whitespace-pre-line"
                            translate="no"
                            aria-hidden="true"
                          >
                            {block.imageBadgeIcon || "extension"}
                          </span>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface font-bold whitespace-pre-line">
                              {block.imageBadgeTitle}
                            </p>
                            <p className="font-caption text-caption text-text-muted whitespace-pre-line">
                              {block.imageBadgeDesc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
`;

// 1. High School Hero: add badge overlay
code = code.replace(
  /<div className="absolute inset-0 bg-gradient-to-t from-black\/50 to-transparent whitespace-pre-line"><\/div>/,
  '<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent whitespace-pre-line"></div>' + badgeOverlayCode
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("High school hero updated");
