const fs = require('fs');
let lines = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8').split('\n');

const replacement = `
                    <div className={\`flex \${selectedPopup.imagePosition === 'bottom' ? 'flex-col-reverse' : 'flex-col'} \${
                      selectedPopup.imagePosition === 'left' ? 'md:flex-row' : selectedPopup.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
                    } \${selectedPopup.imagePosition === 'bg' ? 'relative' : ''}\`}>
                      
                      {selectedPopup.imageUrl && (
                        <div
                          className={\`relative bg-slate-100 \${
                            selectedPopup.imagePosition === 'bg'
                              ? 'absolute inset-0 z-0 h-full w-full'
                              : 'w-full md:w-1/2 min-h-[260px]'
                          }\`}
                        >
                          <img
                            src={selectedPopup.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className={\`absolute inset-0 \${selectedPopup.imagePosition === 'bg' ? 'bg-black/60' : 'bg-gradient-to-t from-black/40 to-transparent'}\`} />
                        </div>
                      )}

                      <div
                        className={\`p-6 md:p-8 flex flex-col justify-center text-left \${
                          selectedPopup.imageUrl && (selectedPopup.imagePosition === 'left' || selectedPopup.imagePosition === 'right') ? 'w-full md:w-1/2' : 'flex-1'
                        } \${selectedPopup.imagePosition === 'bg' ? 'relative z-10' : ''}\`}
                      >
                        {selectedPopup.badgeText && (
                          <span
                            className="font-bold text-xs uppercase tracking-widest mb-2"
                            style={{ color: selectedPopup.badgeColor || '#0606f9' }}
                          >
                            {selectedPopup.badgeText}
                          </span>
                        )}
                        <h3 className="text-xl font-bold mb-3" style={{ color: selectedPopup.style?.titleColor || undefined }}>{selectedPopup.title}</h3>
                        <p className="text-xs leading-relaxed mb-6 whitespace-pre-line" style={{ color: selectedPopup.style?.descColor || undefined, opacity: selectedPopup.style?.descColor ? 1 : 0.8 }}>{selectedPopup.description}</p>
                        <button
                          type="button"
                          onClick={() => setShowLivePreviewModal(false)}
                          className="w-full py-3 font-bold rounded-xl text-xs"
                          style={{
                            backgroundColor: selectedPopup.style?.buttonBgColor || '#0606f9',
                            color: selectedPopup.style?.buttonTextColor || '#ffffff'
                          }}
                        >
                          {selectedPopup.buttonText || 'Hemen Başvur'}
                        </button>
                      </div>
                    </div>
`.trim();

// find index 1442 (line 1443) to 1476 (line 1477)
let before = lines.slice(0, 1442).join('\n');
let after = lines.slice(1477).join('\n');

fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', before + '\n' + replacement + '\n' + after);
console.log("Replaced successfully!");
