const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

const targetStr = `<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <LayoutTemplate className="w-4 h-4" /> Footer Sütunları
                      </h3>`;

const replacementStr = `<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <LayoutTemplate className="w-4 h-4" /> Footer Sütunları (Otomatik)
                      </h3>
                      <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-sm font-medium border border-blue-200">
                        Sitenizin footer bölümündeki link sütunları artık otomatik olarak Header (Üst Menü) ayarlarınızdan çekilmektedir. Burada eklediğiniz sütunlar sadece eğer menüde uygun bağlantı yoksa gösterilir.
                      </div>`;

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
