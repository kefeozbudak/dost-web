import React from 'react';

export const TestComponent = () => {
  const index = 0;
  const block: any = {};
  const getStyle = (b: any, s: string) => ({});
  const getImageStyle = (b: any, s: string, i: number) => ({});
  const getBadgeStyle = (b: any) => ({});
  const renderTitle = (b: any, s: string) => <div></div>;
  const getCardStyle = (i: any, s: string, id: number) => ({});

  switch(block.type) {
      case 'menu_hero':
        return (
          <section key={index} className="relative h-[400px] flex items-center overflow-hidden" style={getStyle(block, 'container')}>
            {block.image && <img alt="" className="absolute inset-0 w-full h-full object-cover" src={block.image} style={getImageStyle(block, 'image', index)} />}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
            <div className="max-w-container-max mx-auto px-margin-desktop relative z-10 w-full">
              <div className="max-w-2xl">
                {block.badge && (
                  <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-[#b6c4ff] text-sm font-semibold mb-4 backdrop-blur-sm border border-white/10" style={getBadgeStyle(block)}>
                    {block.badge}
                  </span>
                )}
                {renderTitle(block, "text-4xl lg:text-6xl font-black text-white mb-6 leading-tight")}
                {block.subtitle && (
                  <p className="text-lg lg:text-xl text-white/80 font-light leading-relaxed">
                    {block.subtitle}
                  </p>
                )}
              </div>
            </div>
          </section>
        );

      case 'menu_calendar':
        return (
          <section key={index} className="py-12 bg-surface-background" style={getStyle(block, 'container')}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 max-w-container-max mx-auto px-margin-desktop">
              <div>
                {renderTitle(block, "text-2xl font-bold text-slate-800")}
                {block.subtitle && <p className="text-slate-500">{block.subtitle}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm">
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-slate-500">chevron_left</span>
                  </button>
                  <span className="px-6 font-bold text-slate-800 min-w-[140px] text-center">{block.month || "Ekim 2023"}</span>
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block">Pazartesi</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block">Salı</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block">Çarşamba</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block">Perşembe</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block">Cuma</div>
                  <div className="py-5 text-center text-xs font-black text-primary uppercase tracking-widest hidden md:block">Cumartesi</div>
                  <div className="py-5 text-center text-xs font-black text-red-500 uppercase tracking-widest hidden md:block">Pazar</div>
                  
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest md:hidden">Pzt</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest md:hidden">Sal</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest md:hidden">Çar</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest md:hidden">Per</div>
                  <div className="py-5 text-center text-xs font-black text-slate-600 uppercase tracking-widest md:hidden">Cum</div>
                  <div className="py-5 text-center text-xs font-black text-primary uppercase tracking-widest md:hidden">Cmt</div>
                  <div className="py-5 text-center text-xs font-black text-red-500 uppercase tracking-widest md:hidden">Paz</div>
                </div>
                
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
                  {block.days?.map((day: any, i: number) => {
                    if (!day.isCurrentMonth) {
                      return (
                        <div key={i} className="p-2 md:p-4 bg-slate-50/50 min-h-[120px] md:min-h-[220px]">
                          <span className="text-slate-400 font-medium opacity-50 text-xs md:text-base">{day.date}</span>
                        </div>
                      );
                    }
                    
                    if (day.isClosed) {
                      return (
                        <div key={i} className="p-2 md:p-4 hover:bg-slate-50 transition-colors group min-h-[120px] md:min-h-[220px] bg-red-50/30">
                          <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 mb-3">
                            <span className="text-sm md:text-xl font-black text-slate-800">{day.date}</span>
                            <span className="text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-red-100 text-red-600 uppercase text-center w-full md:w-auto">Kapalı</span>
                          </div>
                        </div>
                      );
                    }
                    
                    if (day.isToday) {
                      return (
                        <div key={i} className="p-2 md:p-4 bg-primary/5 transition-colors ring-1 md:ring-2 ring-inset ring-primary relative min-h-[120px] md:min-h-[220px]">
                          <div className="absolute -top-1 -right-1">
                            <span className="flex h-3 w-3 md:h-4 md:w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-primary"></span>
                            </span>
                          </div>
                          <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3">
                            <span className="text-sm md:text-xl font-black text-primary">{day.date}</span>
                            <span className="text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-primary text-white uppercase text-center w-full xl:w-auto">Bugün</span>
                          </div>
                          <ul className="space-y-1 md:space-y-2">
                            {day.meals?.map((meal: string, mIndex: number) => (
                              <li key={mIndex} className="text-[10px] md:text-sm font-bold text-slate-800 flex items-start gap-1 md:gap-2 leading-tight">
                                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary mt-1 md:mt-1.5 shrink-0"></span> {meal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={i} className="p-2 md:p-4 hover:bg-slate-50 transition-colors group min-h-[120px] md:min-h-[220px]">
                        <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3">
                          <span className="text-sm md:text-xl font-black text-slate-800">{day.date}</span>
                          {day.kcal && <span className="text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] uppercase text-center w-full xl:w-auto">{day.kcal}</span>}
                        </div>
                        <ul className="space-y-1 md:space-y-2">
                          {day.meals?.map((meal: string, mIndex: number) => (
                            <li key={mIndex} className="text-[10px] md:text-sm text-slate-700 flex items-start gap-1 md:gap-2 leading-tight">
                              <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary mt-1 md:mt-1.5 shrink-0"></span> {meal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  
                  {Array.from({ length: Math.max(0, 35 - (block.days?.length || 0)) }).map((_, i) => (
                    <div key={"empty-" + i} className="p-2 md:p-4 bg-slate-50/50 min-h-[120px] md:min-h-[220px]"></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'menu_features':
        return (
          <section key={index} className="py-8 bg-surface-background max-w-container-max mx-auto px-margin-desktop" style={getStyle(block, 'container')}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {block.items?.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4" style={getCardStyle(item, 'card', i)}>
                  {item.icon && <span className="material-symbols-outlined text-4xl" style={{ color: item.iconColor || 'var(--color-primary)' }}>{item.icon}</span>}
                  <div>
                    <h4 className="font-bold text-slate-800" style={{ color: item.itemTitleColor }}>{item.title}</h4>
                    <p className="text-sm text-slate-500" style={{ color: item.itemDescColor }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
  }
  return null;
}
