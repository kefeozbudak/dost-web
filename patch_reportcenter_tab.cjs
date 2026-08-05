const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/ReportCenter.tsx', 'utf8');

file = file.replace(/const \[activeTab, setActiveTab\] = useState<'chat' \| 'pre_registration' \| 'contact' \| 'all'>\('chat'\);/, "const [activeTab, setActiveTab] = useState<'chat' | 'pre_registration' | 'contact' | 'career' | 'all'>('chat');");

file = file.replace(/if \(activeTab === 'contact' && r\.type !== 'contact_form'\) return false;/, "if (activeTab === 'contact' && r.type !== 'contact_form') return false;\n    if (activeTab === 'career' && r.type !== 'is_basvuru_formu') return false;");

const newTabBtn = `
                <button
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

file = file.replace(/<button\s+onClick=\{\(\) => setActiveTab\('all'\)\}/, newTabBtn + "\n                <button\n                  onClick={() => setActiveTab('all')}");

fs.writeFileSync('./src/admin/hubs/ReportCenter.tsx', file);
