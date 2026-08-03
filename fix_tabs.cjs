const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ClubCenter.tsx', 'utf8');

// replace the tabs div
const startTabStr = `<div className="flex flex-wrap gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">`;
const searchInputStr = `              <div className="relative flex-1 w-full lg:w-auto lg:min-w-[300px]">`;

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
`;
    code = code.substring(0, startIdx) + newTabs + code.substring(endIdx);
    fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', code);
    console.log('Fixed tabs');
} else {
    console.log('Could not find boundaries');
}

// also fix the filterReports logic
const filterStart = `  const filteredReports = reports.filter(r => {`;
const returnStat = `    return matchSearch && matchKampus && matchKademe;`;
let filterIdx = code.indexOf(filterStart);
let returnIdx = code.indexOf(returnStat, filterIdx);
if (filterIdx !== -1 && returnIdx !== -1) {
    let beforeFilter = code.substring(0, filterIdx);
    let afterFilter = code.substring(returnIdx + returnStat.length);
    let newFilter = `
  const filteredReports = reports.filter(r => {
    if (r.type !== 'club_registration_form') return false;
    
    // Check search term
    let matchSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const searchStr = JSON.stringify(r).toLowerCase();
      matchSearch = searchStr.includes(term);
    }
    
    let matchKampus = true;
    if (filterKampus) {
      const dataStr = JSON.stringify(r.data || {}).toLowerCase();
      matchKampus = dataStr.includes(filterKampus.toLowerCase());
    }

    let matchKademe = true;
    if (filterKademe) {
      const dataStr = JSON.stringify(r.data || {}).toLowerCase();
      matchKademe = dataStr.includes(filterKademe.toLowerCase());
    }

    return matchSearch && matchKampus && matchKademe;
`;
    fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', beforeFilter + newFilter + afterFilter);
    console.log('Fixed filter logic');
}
