with open('src/admin/hubs/ReportCenter.tsx', 'r') as f:
    code = f.read()

target = """                <button 
                  onClick={() => setActiveTab('contact')}
                  className={`font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'contact' 
                      ? 'bg-[#004899] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  İLETİŞİM SAYFASI
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'contact' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {reports.filter(r => r.type === 'contact_form').length}
                  </span>
                </button>"""

new_target = """                <button 
                  onClick={() => setActiveTab('contact')}
                  className={`font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'contact' 
                      ? 'bg-[#004899] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  İLETİŞİM SAYFASI
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'contact' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {reports.filter(r => r.type === 'contact_form').length}
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab('quick_contact')}
                  className={`font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'quick_contact' 
                      ? 'bg-[#004899] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  HIZLI İLETİŞİM
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'quick_contact' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {reports.filter(r => r.type === 'quick_contact_form').length}
                  </span>
                </button>"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/admin/hubs/ReportCenter.tsx', 'w') as f:
        f.write(code)
    print("Patched successfully")
else:
    print("Could not find old block")

