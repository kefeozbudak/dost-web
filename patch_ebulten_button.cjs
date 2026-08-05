const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/ReportCenter.tsx', 'utf8');

const careerBtnStr = `                <button
                  onClick={() => setActiveTab('career')}
                  className={\`relative px-4 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all whitespace-nowrap \${
                    activeTab === 'career' 
                      ? 'text-[#38C1D2] border-b-2 border-[#38C1D2]' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }\`}
                >
                  <Briefcase className="w-4 h-4" />
                  İş Başvuruları
                  <span className={\`px-2 py-0.5 text-[10px] rounded-full font-extrabold \${activeTab === 'career' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}\`}>
                    {reports.filter(r => r.type === 'is_basvuru_formu').length}
                  </span>
                </button>`;

const newBtnStr = careerBtnStr + `
                <button
                  onClick={() => setActiveTab('newsletter')}
                  className={\`font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer \${
                    activeTab === 'newsletter' 
                      ? 'bg-[#004899] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }\`}
                >
                  <Mail className="w-4 h-4" />
                  E-Bülten
                  <span className={\`px-2 py-0.5 text-[10px] rounded-full font-extrabold \${activeTab === 'newsletter' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}\`}>
                    {reports.filter(r => r.type === 'newsletter').length}
                  </span>
                </button>`;

file = file.replace(careerBtnStr, newBtnStr);

fs.writeFileSync('./src/admin/hubs/ReportCenter.tsx', file);
