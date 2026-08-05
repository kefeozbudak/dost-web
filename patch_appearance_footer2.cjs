const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

const targetStr = `              {/* 3. Menü Sütunları Yönetimi (Multi-Column CRUD) */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Menu className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Menü Sütunları Yönetimi</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Footer alanındaki sütunları ve alt linkleri yönetin.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const newCols = [...(footerData.columns || [])];
                      newCols.push({ title: 'Yeni Sütun', links: [{ label: 'Yeni Link', url: '#' }] });
                      setFooterData({...footerData, columns: newCols});
                    }} 
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Yeni Sütun Ekle
                  </button>
                </div>`;

const replacementStr = `              {/* 3. Menü Sütunları Yönetimi (Multi-Column CRUD) */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Menu className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Menü Sütunları Yönetimi (Otomatik)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Sitenizin footer bölümündeki link sütunları artık otomatik olarak Header (Üst Menü) ayarlarınızdan çekilmektedir. </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-sm font-medium border border-blue-200">
                  Header'daki "Açılır Menü" ve "Mega Menü" başlıklarınız ve alt linkleriniz Footer kısmına otomatik olarak yansıtılacaktır. Bu alandan eklediğiniz sütunlar artık sadece Header menüsünde uygun bağlantı bulunamazsa "yedek" olarak kullanılacaktır.
                </div>`;

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
