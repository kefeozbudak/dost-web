import re

with open('src/admin/hubs/ReportCenter.tsx', 'r') as f:
    code = f.read()

target_state = "const [activeTab, setActiveTab] = useState<'chat' | 'pre_registration' | 'contact' | 'career' | 'newsletter' | 'all'>('chat');"
new_state = "const [activeTab, setActiveTab] = useState<'chat' | 'quick_contact' | 'pre_registration' | 'contact' | 'career' | 'newsletter' | 'all'>('chat');"
code = code.replace(target_state, new_state)

target_filter1 = "if (activeTab === 'chat' && !(r.type === 'chat' || !r.type || r.data?.formName)) return false;"
new_filter1 = target_filter1 + "\n    if (activeTab === 'quick_contact' && r.type !== 'quick_contact_form') return false;"
code = code.replace(target_filter1, new_filter1)

target_count1 = "const newsletterFormsCount = reports.filter(r => r.type === 'newsletter').length;"
new_count1 = target_count1 + "\n  const quickContactFormsCount = reports.filter(r => r.type === 'quick_contact_form').length;"
code = code.replace(target_count1, new_count1)

target_tab = """                <button
                  onClick={() => setActiveTab('pre_registration')}"""
new_tab = """                <button
                  onClick={() => setActiveTab('quick_contact')}
                  className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'quick_contact' 
                      ? 'border-[#004899] text-[#004899] bg-blue-50/50' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Hızlı İletişim
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'quick_contact' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {quickContactFormsCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('pre_registration')}"""
code = code.replace(target_tab, new_tab)

target_name = "report.type === 'contact_form' ? 'İletişim Formu' :"
new_name = target_name + " report.type === 'quick_contact_form' ? 'Hızlı İletişim Formu' :"
code = code.replace(target_name, new_name)

target_repname = "rep.type === 'contact_form' ? 'İletişim Formu' :"
new_repname = target_repname + " rep.type === 'quick_contact_form' ? 'Hızlı İletişim Formu' :"
code = code.replace(target_repname, new_repname)

with open('src/admin/hubs/ReportCenter.tsx', 'w') as f:
    f.write(code)
print("Patched ReportCenter tabs")
