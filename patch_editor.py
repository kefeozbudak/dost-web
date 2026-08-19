import re

with open('src/admin/CalendarGridEditor.tsx', 'r') as f:
    code = f.read()

# Add month navigation state
code = code.replace(
    'const [selectedDay, setSelectedDay] = useState<number | null>(null);',
    'const [selectedDay, setSelectedDay] = useState<number | null>(null);\n  const [monthOffset, setMonthOffset] = useState<number>(0);'
)

# Apply monthOffset to mIndex and year
target_mindex = """  let mIndex = new Date().getMonth();
  const lowerMonth = (block.month || "").toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i');
  for (const [m, idx] of Object.entries(monthMap)) {
    if (lowerMonth.includes(m)) { mIndex = idx; break; }
  }
  const yearMatch = (block.month || "").match(/\\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();"""

new_mindex = """  let baseMIndex = new Date().getMonth();
  const lowerMonth = (block.month || "").toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i');
  for (const [m, idx] of Object.entries(monthMap)) {
    if (lowerMonth.includes(m)) { baseMIndex = idx; break; }
  }
  const yearMatch = (block.month || "").match(/\\d{4}/);
  let baseYear = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
  
  let mIndex = baseMIndex + monthOffset;
  let year = baseYear;
  while (mIndex > 11) { mIndex -= 12; year++; }
  while (mIndex < 0) { mIndex += 12; year--; }"""

code = code.replace(target_mindex, new_mindex)

# Change activeItemIndex logic
target_active_index = """  const activeItemIndex = currentArray.findIndex((d: any) => parseInt(String(d.date).replace(/\\D/g, '')) === selectedDay);"""
new_active_index = """  const activeItemIndex = currentArray.findIndex((d: any) => {
    const oDate = String(d.date || "");
    if (oDate.includes('-')) {
       return oDate === `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    } else {
       return monthOffset === 0 && parseInt(oDate.replace(/\\D/g, '')) === selectedDay;
    }
  });"""
code = code.replace(target_active_index, new_active_index)

# Change activeItem initial logic
target_active_item = """  const activeItem = activeItemIndex !== -1 ? currentArray[activeItemIndex] : { date: String(selectedDay) };"""
new_active_item = """  const activeItem = activeItemIndex !== -1 ? currentArray[activeItemIndex] : { date: `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` };"""
code = code.replace(target_active_item, new_active_item)

# Change hasData logic
target_has_data = """          const hasData = currentArray.some((d: any) => parseInt(String(d.date).replace(/\\D/g, '')) === dayNum && (d.meals?.length > 0 || d.events?.length > 0 || d.eventTitle));"""
new_has_data = """          const hasData = currentArray.some((d: any) => {
            const oDate = String(d.date || "");
            const matchesDate = oDate.includes('-') 
              ? oDate === `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
              : (monthOffset === 0 && parseInt(oDate.replace(/\\D/g, '')) === dayNum);
            return matchesDate && (d.meals?.length > 0 || d.events?.length > 0 || d.eventTitle);
          });"""
code = code.replace(target_has_data, new_has_data)

# Add month navigation UI
target_ui = """      <div className="grid grid-cols-7 gap-1 mb-4">"""
new_ui = """      <div className="flex items-center justify-between mb-4">
        <button onClick={(e) => { e.preventDefault(); setMonthOffset(prev => prev - 1); setSelectedDay(null); }} className="p-1 hover:bg-slate-200 rounded">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <div className="text-sm font-bold text-slate-700">
          {new Date(year, mIndex).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={(e) => { e.preventDefault(); setMonthOffset(prev => prev + 1); setSelectedDay(null); }} className="p-1 hover:bg-slate-200 rounded">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">"""
code = code.replace(target_ui, new_ui)

with open('src/admin/CalendarGridEditor.tsx', 'w') as f:
    f.write(code)

print("Patched CalendarGridEditor.")
