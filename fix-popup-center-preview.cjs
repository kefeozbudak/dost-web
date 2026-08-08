const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const replacement = `
                    /* Normal Mod Önizleme */
                    <div className={\`flex \${selectedPopup.imagePosition === 'bottom' ? 'flex-col-reverse' : 'flex-col'} \${
                      previewMode === 'mobile'
                        ? ''
                        : selectedPopup.imagePosition === 'left' ? 'md:flex-row' : selectedPopup.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
                    } \${selectedPopup.imagePosition === 'bg' ? 'relative' : ''}\`}>
                      
                      {/* Image Section */}
                      {selectedPopup.imageUrl && (
                        <div
                          className={\`relative bg-slate-100 \${
                            previewMode === 'mobile' && selectedPopup.imagePosition !== 'bg'
                              ? 'w-full h-48'
                              : selectedPopup.imagePosition === 'bg'
                              ? 'absolute inset-0 z-0 h-full w-full'
                              : 'w-full md:w-1/2 min-h-[300px]'
                          }\`}
                        >
                          <img
                            src={selectedPopup.imageUrl}
                            alt="Popup"
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDd7z1oXpXwhH7QTgZ2wgXtYlKXePoC_Sp6RZ6ZwL3DgCB_E4XQ8V0YBwI6liC5Cc4LPfygw0lt_Ufj3ybg6A3ZZpBK6rgmhfRGOdQ97rgjLcZf0GIVbfe_TLwh9cHTzg4TiXVKv8XGlHuBePsHfYNF6VDC9tKu1dB_9DNIaIIYeTxAA2BoGlzhJnDtrbGMSZNq9TnpKcOsMvCQgu24ZIMLDdmCkltvU6n9Ju0oRuO-IoyDSVA3ojWNzDQXD1Ii0EsJb4qoCWbQZKI";
                            }}
                          />
                          <div className={\`absolute inset-0 \${selectedPopup.imagePosition === 'bg' ? 'bg-black/60' : 'bg-gradient-to-t from-black/40 to-transparent'}\`} />
                        </div>
                      )}

                      {/* Content Section */}
                      <div
                        className={\`p-8 flex flex-col justify-center text-left \${
                          selectedPopup.imageUrl && previewMode === 'desktop' && (selectedPopup.imagePosition === 'left' || selectedPopup.imagePosition === 'right') ? 'w-full md:w-1/2' : 'w-full'
                        } \${selectedPopup.imagePosition === 'bg' ? 'relative z-10' : ''}\`}
                      >
                        {selectedPopup.badgeText && (
                          <span
                            className="font-bold text-xs uppercase tracking-widest mb-2 inline-block"
                            style={{ color: selectedPopup.badgeColor || '#0606f9' }}
                          >
                            {selectedPopup.badgeText}
                          </span>
                        )}

                        <h2 className="text-2xl font-bold leading-tight mb-4" style={{ color: selectedPopup.style?.titleColor || undefined }}>
                          {selectedPopup.title}
                        </h2>

                        <p className="text-sm leading-relaxed mb-8 whitespace-pre-line" style={{ color: selectedPopup.style?.descColor || undefined, opacity: selectedPopup.style?.descColor ? 1 : 0.8 }}>
                          {selectedPopup.description}
                        </p>

                        <button
                          type="button"
                          className="w-full py-3 font-bold rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer"
                          style={{
                            backgroundColor: selectedPopup.style?.buttonBgColor || '#0606f9',
                            color: selectedPopup.style?.buttonTextColor || '#ffffff'
                          }}
                        >
                          {selectedPopup.buttonText || 'Hemen Başvur'}
                        </button>
                      </div>

                    </div>
`;

// Find start and end for canvas preview
const startStr = "                    /* Normal Mod Önizleme */\n                    <div className={`flex ${previewMode === 'mobile' ? 'flex-col' : 'flex-col md:flex-row'}`}>";
const startIndex = code.indexOf(startStr);
if (startIndex !== -1) {
    const endStr = "                    </div>\n                  )}\n                </div>\n              </div>\n            ) : (";
    const endIndex = code.indexOf(endStr, startIndex);
    if (endIndex !== -1) {
        code = code.substring(0, startIndex) + replacement.trim() + '\n                  ' + code.substring(endIndex + 29);
        fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', code);
        console.log("Canvas preview updated successfully!");
    } else {
        console.log("Could not find end index.");
    }
} else {
    console.log("Could not find start index.");
}

