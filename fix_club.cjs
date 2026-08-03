const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ClubCenter.tsx', 'utf8');

// 1. activeTab type
code = code.replace(
    /const \[activeTab, setActiveTab\] = useState<'chat' \| 'pre_registration' \| 'contact' \| 'all'>\('chat'\);/g,
    "const [activeTab, setActiveTab] = useState<'club'>('club');"
);

// 2. tabs rendering - find the Controls Bar
const controlsStart = code.indexOf('{/* Controls Bar */}');
const additionalFiltersStart = code.indexOf('{/* Additional Filters */}');
if (controlsStart !== -1 && additionalFiltersStart !== -1) {
    let beforeControls = code.substring(0, controlsStart);
    let afterControls = code.substring(additionalFiltersStart);
    let newControls = `
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-wrap gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                <button 
                  onClick={() => setActiveTab('club')}
                  className={'font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer bg-[#004899] text-white shadow-sm'}
                >
                  Kulüp Başvuruları
                  <span className={'px-2 py-0.5 text-[10px] rounded-full font-extrabold bg-[#38C1D2] text-white'}>
                    {reports.filter(r => r.type === 'club_registration_form').length}
                  </span>
                </button>
              </div>

              <div className="relative flex-1 w-full lg:w-auto lg:min-w-[300px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="İsim, telefon, kampüs veya mesajlarda ara..." 
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                />
                {searchTerm && (
                  <button 
                     onClick={() => setSearchTerm('')} 
                     className="absolute right-2.5 top-2.5 p-0.5 hover:bg-slate-200 rounded-full text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
          </div>
          `;
    code = beforeControls + newControls + afterControls;
}

// 3. filteredReports logic
const filterStart = code.indexOf('const filteredReports = reports.filter(r => {');
const filterEndStr = '  });';
const filterEnd = code.indexOf(filterEndStr, filterStart);
if (filterStart !== -1 && filterEnd !== -1) {
    let beforeFilter = code.substring(0, filterStart);
    let afterFilter = code.substring(filterEnd + filterEndStr.length);
    let newFilter = `const filteredReports = reports.filter(r => {
    if (r.type !== 'club_registration_form') return false;

    const sender = extractSenderInfo(r.data);
    if (filterKampus && !sender.kampus.toLowerCase().includes(filterKampus.toLowerCase())) {
      return false;
    }
    if (filterKademe && !sender.kademe.toLowerCase().includes(filterKademe.toLowerCase())) {
      return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const rawDataString = JSON.stringify(r.data || {}).toLowerCase();
      return rawDataString.includes(term);
    }

    return true;
  });`;
    code = beforeFilter + newFilter + afterFilter;
}

// 4. delete the "chatFormsCount" stuff that causes errors if it still exists
code = code.replace(/const chatFormsCount = .*?;/g, "");
code = code.replace(/const preRegFormsCount = .*?;/g, "");
code = code.replace(/const contactFormsCount = .*?;/g, "");

// 5. Replace formName logic in handlePrint
code = code.replace(/const formName = rep.type === 'pre_registration_form' \? 'Ön Kayıt Formu' : rep.type === 'contact_form' \? 'İletişim Formu' : \(\(rep.type === 'chat' \|\| !rep.type\) \? 'Veli Asistanı Formu' : \(rep.data\?\.formName \|\| 'Veli Asistanı Formu'\)\);/g, "const formName = 'Kulüp Kayıt Formu';");

// 6. Replace form type display in the list
code = code.replace(/\{report\.type === 'pre_registration_form' \? 'Ön Kayıt Formu' : report\.type === 'contact_form' \? 'İletişim Formu' : report\.data\?\.formName \|\| 'Veli Asistanı Formu'\}/g, "{'Kulüp Kayıt Formu'}");

fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', code);
console.log('Fixed ClubCenter');
