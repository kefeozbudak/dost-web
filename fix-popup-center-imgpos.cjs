const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const replacement = `
/* Normal Mod Önizleme */
                    {(() => {
                      const imgPos = selectedPopup.imagePosition || 'left';
                      return (
                    <div className={\`flex \${imgPos === 'bottom' ? 'flex-col-reverse' : 'flex-col'} \${
                      previewMode === 'mobile'
                        ? ''
                        : imgPos === 'left' ? 'md:flex-row' : imgPos === 'right' ? 'md:flex-row-reverse' : ''
                    } \${imgPos === 'bg' ? 'relative' : ''}\`}>
                      
                      {/* Image Section */}
                      {selectedPopup.imageUrl && (
                        <div
                          className={\`relative bg-slate-100 \${
                            previewMode === 'mobile' && imgPos !== 'bg'
                              ? 'w-full h-48'
                              : imgPos === 'bg'
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
                          <div className={\`absolute inset-0 \${imgPos === 'bg' ? 'bg-black/60' : 'bg-gradient-to-t from-black/40 to-transparent'} pointer-events-none\`} />
                        </div>
                      )}

                      {/* Content Section */}
                      <div
                        className={\`p-8 flex flex-col justify-center text-left \${
                          selectedPopup.imageUrl && previewMode === 'desktop' && (imgPos === 'left' || imgPos === 'right') ? 'w-full md:w-1/2' : 'w-full'
                        } \${imgPos === 'bg' ? 'relative z-10' : ''}\`}
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
                      );
                    })()}
`;

const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('/* Normal Mod Önizleme */'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes(')}')) + 1;
// Wait, the `)}` is at line 689. Let's find `)}` that matches the condition.
// Actually, I can just replace lines 623 to 688

if (startIdx !== -1) {
    const endStr = "                                  )}";
    const endIdx = lines.findIndex((l, i) => i > startIdx && l === endStr);
    if (endIdx !== -1) {
        const newLines = [
            ...lines.slice(0, startIdx),
            replacement.trim(),
            ...lines.slice(endIdx)
        ];
        fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', newLines.join('\n'));
        console.log("Central preview updated successfully!");
    } else {
        console.log("end index not found");
    }
} else {
    console.log("start index not found");
}

