const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/SettingsCenter.tsx', 'utf8');

file = file.replace(/burslulukActive: boolean;\n  burslulukInactiveMessage: string;/g, "burslulukActive: boolean;\n  burslulukStartDate?: string;\n  burslulukEndDate?: string;\n  burslulukInactiveMessage: string;");

file = file.replace(/burslulukActive: false,\n  burslulukInactiveMessage:/g, "burslulukActive: false,\n  burslulukStartDate: '',\n  burslulukEndDate: '',\n  burslulukInactiveMessage:");

const oldJsx = `                  {!settings.burslulukActive && (
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
                  )}`;

const newJsx = `                  {settings.burslulukActive && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                          Başlangıç Tarihi (İsteğe Bağlı)
                        </label>
                        <input
                          type="datetime-local"
                          value={settings.burslulukStartDate || ''}
                          onChange={(e) => updateField('burslulukStartDate', e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                          Bitiş Tarihi (İsteğe Bağlı)
                        </label>
                        <input
                          type="datetime-local"
                          value={settings.burslulukEndDate || ''}
                          onChange={(e) => updateField('burslulukEndDate', e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                  
                  {(!settings.burslulukActive || settings.burslulukStartDate || settings.burslulukEndDate) && (
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
                  )}`;

file = file.replace(oldJsx, newJsx);
fs.writeFileSync('./src/admin/hubs/SettingsCenter.tsx', file);
