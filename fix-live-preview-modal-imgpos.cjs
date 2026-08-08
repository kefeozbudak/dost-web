const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const replacement = `
                    {(() => {
                      const imgPos = selectedPopup.imagePosition || 'left';
                      return (
<div className={\`flex \${imgPos === 'bottom' ? 'flex-col-reverse' : 'flex-col'} \${
                      imgPos === 'left' ? 'md:flex-row' : imgPos === 'right' ? 'md:flex-row-reverse' : ''
                    } \${imgPos === 'bg' ? 'relative' : ''}\`}>
                      
                      {selectedPopup.imageUrl && (
                        <div
                          className={\`relative bg-slate-100 \${
                            imgPos === 'bg'
                              ? 'absolute inset-0 z-0 h-full w-full'
                              : 'w-full md:w-1/2 min-h-[260px]'
                          }\`}
                        >
                          <img
                            src={selectedPopup.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className={\`absolute inset-0 \${imgPos === 'bg' ? 'bg-black/60' : 'bg-gradient-to-t from-black/40 to-transparent'}\`} />
                        </div>
                      )}

                      <div
                        className={\`p-6 md:p-8 flex flex-col justify-center text-left \${
                          selectedPopup.imageUrl && (imgPos === 'left' || imgPos === 'right') ? 'w-full md:w-1/2' : 'flex-1'
                        } \${imgPos === 'bg' ? 'relative z-10' : ''}\`}
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
                      );
                    })()}
`;

const lines = code.split('\n');
const startIdx = lines.findIndex((l, i) => i > 1400 && l.includes('<div className={`flex ${selectedPopup.imagePosition === \'bottom\' ? \'flex-col-reverse\' : \'flex-col\'} ${'));
if (startIdx !== -1) {
    const endStr = "                    </div>";
    const endIdx = lines.findIndex((l, i) => i > startIdx && l === endStr);
    if (endIdx !== -1) {
        const newLines = [
            ...lines.slice(0, startIdx),
            replacement.trim(),
            ...lines.slice(endIdx + 1)
        ];
        fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', newLines.join('\n'));
        console.log("Live modal preview updated successfully!");
    } else {
        console.log("end index not found");
    }
} else {
    console.log("start index not found");
}

