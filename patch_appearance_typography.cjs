const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

const replacement = `
              <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2"><Layout className="w-5 h-5 text-slate-400" /> Menü Renkleri (Global)</h3>
`;

const typographySection = `
              <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2"><Layout className="w-5 h-5 text-slate-400" /> Menü Yazı Tipi (Global)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-slate-700 mb-4">Üst Menü (Ana Linkler)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Boyutu</label>
                        <select 
                          value={headerData.menuTypography?.topMenuFontSize || 'text-sm'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), topMenuFontSize: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="text-xs">Çok Küçük (text-xs)</option>
                          <option value="text-sm">Küçük (text-sm)</option>
                          <option value="text-base">Normal (text-base)</option>
                          <option value="text-lg">Büyük (text-lg)</option>
                          <option value="text-xl">Çok Büyük (text-xl)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Kalınlığı</label>
                        <select 
                          value={headerData.menuTypography?.topMenuFontWeight || 'font-bold'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), topMenuFontWeight: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="font-normal">Normal</option>
                          <option value="font-medium">Orta (Medium)</option>
                          <option value="font-semibold">Yarı Kalın (Semibold)</option>
                          <option value="font-bold">Kalın (Bold)</option>
                          <option value="font-black">Çok Kalın (Black)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-slate-700 mb-4">Alt Menü (Mega Menü Linkleri)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Boyutu</label>
                        <select 
                          value={headerData.menuTypography?.subMenuFontSize || 'text-sm'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), subMenuFontSize: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="text-xs">Çok Küçük (text-xs)</option>
                          <option value="text-sm">Küçük (text-sm)</option>
                          <option value="text-base">Normal (text-base)</option>
                          <option value="text-lg">Büyük (text-lg)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Kalınlığı</label>
                        <select 
                          value={headerData.menuTypography?.subMenuFontWeight || 'font-medium'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), subMenuFontWeight: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="font-normal">Normal</option>
                          <option value="font-medium">Orta (Medium)</option>
                          <option value="font-semibold">Yarı Kalın (Semibold)</option>
                          <option value="font-bold">Kalın (Bold)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
` + replacement;

file = file.replace(replacement, typographySection);

fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
