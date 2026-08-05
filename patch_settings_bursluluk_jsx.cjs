const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/SettingsCenter.tsx', 'utf8');

const targetStr = `                  <input
                    type="text"
                    value={settings.kvkkTitle}
                    onChange={(e) => updateField('kvkkTitle', e.target.value)}
                    placeholder="KVKK Aydınlatma Metni'ni Okudum ve Onaylıyorum."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>`;

const newStr = `                  <input
                    type="text"
                    value={settings.kvkkTitle}
                    onChange={(e) => updateField('kvkkTitle', e.target.value)}
                    placeholder="KVKK Aydınlatma Metni'ni Okudum ve Onaylıyorum."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Bursluluk Sınavı Başvuruları
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Başvuru Durumu</p>
                      <p className="text-[11px] text-slate-500 mt-1">Sınav başvurularını açıp kapatabilirsiniz.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.burslulukActive} onChange={(e) => updateField('burslulukActive', e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {!settings.burslulukActive && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Başvurular Kapalıyken Gösterilecek Mesaj
                      </label>
                      <textarea
                        rows={5}
                        value={settings.burslulukInactiveMessage}
                        onChange={(e) => updateField('burslulukInactiveMessage', e.target.value)}
                        placeholder="Değerli Velimiz..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  )}
                </div>`;

file = file.replace(targetStr, newStr);
fs.writeFileSync('./src/admin/hubs/SettingsCenter.tsx', file);
