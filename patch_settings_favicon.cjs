const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/SettingsCenter.tsx', 'utf8');

// Remove from SEO tab
const seoFaviconBlock = `
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Favicon & Site İkon Görseli
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {settings.faviconUrl ? (
                          <img src={settings.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Globe className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={settings.faviconUrl}
                        onChange={(e) => updateField('faviconUrl', e.target.value)}
                        placeholder="/dost-logo-png.png"
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" /> Seç
                      </button>
                    </div>
                  </div>`;

// Check if we can find it exactly, or use regex
if (file.includes(seoFaviconBlock.trim())) {
    file = file.replace(seoFaviconBlock.trim(), "");
} else {
    console.log("Could not find exact block, using regex");
    file = file.replace(/<div>\s*<label className="block text-xs font-bold text-slate-700 uppercase mb-2">\s*Favicon & Site İkon Görseli\s*<\/label>[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/, "");
}

// Add to General tab
const generalInsertionPoint = `                  <p className="text-[11px] text-slate-400 mt-1">Tarayıcı sekmesinde ve arama sonuçlarında görünen ana başlık.</p>
                </div>`;

const newFaviconBlock = `                  <p className="text-[11px] text-slate-400 mt-1">Tarayıcı sekmesinde ve arama sonuçlarında görünen ana başlık.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Favicon & Site İkon Görseli
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.faviconUrl ? (
                        <img src={settings.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Globe className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={settings.faviconUrl}
                      onChange={(e) => updateField('faviconUrl', e.target.value)}
                      placeholder="/dost-logo-png.png"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" /> Seç
                    </button>
                  </div>
                </div>`;

file = file.replace(generalInsertionPoint, newFaviconBlock);

fs.writeFileSync('./src/admin/hubs/SettingsCenter.tsx', file);
console.log("Patched SettingsCenter.tsx");
