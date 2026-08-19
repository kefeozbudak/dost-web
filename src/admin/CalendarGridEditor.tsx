import React, { useState } from 'react';

export default function CalendarGridEditor({ block, arrayKey, onChange, activeArrayItem }: { block: any, arrayKey: string, onChange: (key: string, val: any) => void, activeArrayItem?: { arrayKey: string; index: number } | null }) {
      const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [monthOffset, setMonthOffset] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  
  
  const currentArray = block[arrayKey] || [];
  React.useEffect(() => {
    if (activeArrayItem && activeArrayItem.arrayKey === arrayKey && activeArrayItem.index !== undefined) {
      const activeItem = currentArray[activeArrayItem.index];
      if (activeItem && activeItem.date) {
        const parsedDay = parseInt(String(activeItem.date).replace(/\D/g, ''));
        if (!isNaN(parsedDay)) {
          setSelectedDay(parsedDay);
        }
      } else if (activeArrayItem.index !== -1 && activeArrayItem.index < 31) {
          setSelectedDay(activeArrayItem.index + 1);
      }
      
      // Scroll into view
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [activeArrayItem, arrayKey, currentArray]);
  
  // Extract year/month
  const monthMap: Record<string, number> = {
    "ocak": 0, "şubat": 1, "subat": 1, "mart": 2, "nisan": 3,
    "mayıs": 4, "mayis": 4, "haziran": 5, "temmuz": 6, "ağustos": 7, "agustos": 7,
    "eylül": 8, "eylul": 8, "ekim": 9, "kasım": 10, "kasim": 10, "aralık": 11, "aralik": 11
  };
  let baseMIndex = new Date().getMonth();
  const lowerMonth = (block.month || "").toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i');
  for (const [m, idx] of Object.entries(monthMap)) {
    if (lowerMonth.includes(m)) { baseMIndex = idx; break; }
  }
  const yearMatch = (block.month || "").match(/\d{4}/);
  let baseYear = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
  
  let mIndex = baseMIndex + monthOffset;
  let year = baseYear;
  while (mIndex > 11) { mIndex -= 12; year++; }
  while (mIndex < 0) { mIndex += 12; year--; }
  const daysInMonth = new Date(year, mIndex + 1, 0).getDate();

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(dayNum);
  };

  const activeItemIndex = currentArray.findIndex((d: any) => {
    const oDate = String(d.date || "");
    if (oDate.includes('-')) {
       return oDate === `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    } else {
       return monthOffset === 0 && parseInt(oDate.replace(/\D/g, '')) === selectedDay;
    }
  });
  const activeItem = activeItemIndex !== -1 ? currentArray[activeItemIndex] : { date: `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` };

  const updateActiveItem = (field: string, value: any) => {
    const newArray = [...currentArray];
    if (activeItemIndex !== -1) {
      newArray[activeItemIndex] = { ...newArray[activeItemIndex], [field]: value };
    } else {
      newArray.push({ ...activeItem, [field]: value });
    }
    onChange(arrayKey, newArray);
  };

  return (
    <div ref={containerRef} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
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
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-500">{d}</div>
        ))}
        {Array.from({ length: new Date(year, mIndex, 1).getDay() === 0 ? 6 : new Date(year, mIndex, 1).getDay() - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const hasData = currentArray.some((d: any) => {
            const oDate = String(d.date || "");
            const matchesDate = oDate.includes('-') 
              ? oDate === `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
              : (monthOffset === 0 && parseInt(oDate.replace(/\D/g, '')) === dayNum);
            return matchesDate && (d.meals?.length > 0 || d.events?.length > 0 || d.eventTitle);
          });
          return (
            <button
              key={dayNum}
              onClick={(e) => { e.preventDefault(); handleDayClick(dayNum); }}
              className={`p-2 rounded text-xs font-bold transition-colors ${selectedDay === dayNum ? 'bg-blue-600 text-white' : hasData ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="border-t border-slate-200 pt-4 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-bold text-sm text-slate-700">{selectedDay} {block.month} - Düzenle</h5>
            <button onClick={(e) => { e.preventDefault(); setSelectedDay(null); }} className="text-xs text-slate-500 hover:text-slate-800">Kapat</button>
          </div>
          
          {block.type === 'menu_calendar' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Yemekler (Virgülle veya satırla ayırın)</label>
                <textarea
                  value={activeItem.meals || activeItem.events || ""}
                  onChange={(e) => updateActiveItem('meals', e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded bg-white min-h-[80px]"
                  placeholder="Örn: Mercimek Çorbası, İzmir Köfte"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kalori</label>
                <input
                  type="text"
                  value={activeItem.kcal || ""}
                  onChange={(e) => updateActiveItem('kcal', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Örn: 850 kcal"
                />
              </div>
            </>
          )}

          {block.type === 'academic_calendar' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Etkinlik Başlığı</label>
                <input
                  type="text"
                  value={activeItem.eventTitle || ""}
                  onChange={(e) => updateActiveItem('eventTitle', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Etkinlik Alt Açıklaması</label>
                <input
                  type="text"
                  value={activeItem.eventSubtitle || ""}
                  onChange={(e) => updateActiveItem('eventSubtitle', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Hücre Arkaplan Rengi</label>
                <input
                  type="text"
                  value={activeItem.bgColor || ""}
                  onChange={(e) => updateActiveItem('bgColor', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Örn: bg-green-50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Etkinlik Sınıfları</label>
                <textarea
                  value={activeItem.eventColorClass || ""}
                  onChange={(e) => updateActiveItem('eventColorClass', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Örn: bg-secondary-fixed text-on-secondary-fixed-variant"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1 mt-2">
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input 
                type="checkbox" 
                checked={activeItem.isToday || false} 
                onChange={(e) => updateActiveItem('isToday', e.target.checked)}
              />
              Bugün Olarak İşaretle
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
