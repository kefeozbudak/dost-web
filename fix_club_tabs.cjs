const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ClubCenter.tsx', 'utf8');

const startTabStr = `<div className="flex flex-wrap gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">`;
const searchInputStr = `                  placeholder="İsim, telefon, kampüs veya mesajlarda ara..."`;

const startIdx = code.indexOf(startTabStr);
const endIdx = code.indexOf(searchInputStr);

if (startIdx !== -1 && endIdx !== -1) {
    const newTabs = `
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
                  placeholder="İsim, telefon, kampüs veya mesajlarda ara..."`;
    code = code.substring(0, startIdx) + newTabs + code.substring(endIdx + searchInputStr.length);
    fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', code);
    console.log('Fixed tabs in ClubCenter');
} else {
    console.log('Could not find boundaries');
}
