const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const badgeOverlayCode = `
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent whitespace-pre-line"></div>
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

const rightSideImageCode = `
                </div>
                <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-sm group whitespace-pre-line">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 whitespace-pre-line"
                    style={getImageStyle(block, "image")}
                  ></div>${badgeOverlayCode}
                </div>
              </div>
            </header>
`;

code = code.replace(/(\s*)\}\)\}\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/header>\s*\);\s*case "primary_school_bento":/, (match, p1) => {
    return `${p1}})}\n                    </div>\n                  )}\n${rightSideImageCode}\n          );\n\n        case "primary_school_bento":`;
});

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Primary school hero updated 2");
