const fs = require('fs');
let code = fs.readFileSync('src/components/PopupOverlay.tsx', 'utf8');

const replacement = `
          /* Normal Mod (Görsel + Metin + Buton) */
          <div className={\`flex \${imgPos === 'bottom' ? 'flex-col-reverse' : 'flex-col'} \${imgPos === 'left' ? 'md:flex-row' : imgPos === 'right' ? 'md:flex-row-reverse' : ''} \${imgPos === 'bg' ? 'relative' : ''}\`}>
            {/* Image Section */}
            {currentPopup.imageUrl && (
              <div className={\`w-full \${imgPos === 'left' || imgPos === 'right' ? 'md:w-1/2 min-h-[260px] md:min-h-[320px] relative' : imgPos === 'bg' ? 'absolute inset-0 z-0 h-full' : 'h-48 relative'} bg-slate-100 overflow-hidden\`}>
                <img
                  src={currentPopup.imageUrl}
                  alt={currentPopup.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDd7z1oXpXwhH7QTgZ2wgXtYlKXePoC_Sp6RZ6ZwL3DgCB_E4XQ8V0YBwI6liC5Cc4LPfygw0lt_Ufj3ybg6A3ZZpBK6rgmhfRGOdQ97rgjLcZf0GIVbfe_TLwh9cHTzg4TiXVKv8XGlHuBePsHfYNF6VDC9tKu1dB_9DNIaIIYeTxAA2BoGlzhJnDtrbGMSZNq9TnpKcOsMvCQgu24ZIMLDdmCkltvU6n9Ju0oRuO-IoyDSVA3ojWNzDQXD1Ii0EsJb4qoCWbQZKI";
                  }}
                />
                <div className={\`absolute inset-0 \${imgPos === 'bg' ? 'bg-black/60' : 'bg-gradient-to-t from-black/30 to-transparent'} pointer-events-none\`} />
              </div>
            )}

            {/* Content Section */}
            <div className={\`w-full \${currentPopup.imageUrl && (imgPos === 'left' || imgPos === 'right') ? 'md:w-1/2' : ''} \${imgPos === 'bg' ? 'relative z-10' : ''} p-6 sm:p-8 flex flex-col justify-center text-left\`}>
              {currentPopup.badgeText && (
                <span
                  className="font-bold text-xs uppercase tracking-widest mb-2 inline-block"
                  style={{ color: badgeColor }}
                >
                  {currentPopup.badgeText}
                </span>
              )}

              <h2 className="text-2xl font-bold leading-tight mb-3" style={{ color: currentPopup.style?.titleColor || undefined }}>
                {currentPopup.title}
              </h2>

              <p className="text-sm leading-relaxed mb-6 whitespace-pre-line" style={{ color: currentPopup.style?.descColor || undefined, opacity: currentPopup.style?.descColor ? 1 : 0.8 }}>
                {currentPopup.description}
              </p>

              <button
                type="button"
                onClick={handleAction}
                className="w-full py-3.5 px-6 font-bold rounded-xl shadow-md hover:opacity-90 transition-all text-sm cursor-pointer text-center"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              >
                {currentPopup.buttonText || 'Hemen Başvur'}
              </button>
            </div>
          </div>
`;

// use string replace for easier matching
const startStr = "          /* Normal Mod (Görsel + Metin + Buton) */\n          <div className={`flex flex-col ${imgPos === 'left' ? 'md:flex-row' : imgPos === 'right' ? 'md:flex-row-reverse' : ''}`}>";
const startIndex = code.indexOf(startStr);
if (startIndex !== -1) {
    const endStr = "          </div>\n        )}\n      </div>\n    </div>";
    const endIndex = code.indexOf(endStr, startIndex);
    if (endIndex !== -1) {
        code = code.substring(0, startIndex) + replacement.trim() + '\n        ' + code.substring(endIndex + 17);
        fs.writeFileSync('src/components/PopupOverlay.tsx', code);
        console.log("Replaced popup render code successfully!");
    } else {
        console.log("Could not find end index.");
    }
} else {
    console.log("Could not find start index.");
}
