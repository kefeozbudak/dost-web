import React from 'react';

export const ManagementHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section
      className={`relative w-full h-[400px] flex items-center justify-center overflow-hidden mb-12 whitespace-pre-line`}
      style={getStyle(block, "container")}
    >
      {block.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${block.image})` }}
        />
      )}
      <div className="absolute inset-0 bg-slate-900/60"></div>
      <div className={`relative z-10 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} text-center md:text-left`}>
        <h1
          className={`text-4xl md:text-6xl font-black text-white mb-4 tracking-tight`}
          style={getTitleStyle(block)}
        >
          {block.title || "Yönetim Kadromuz"}
        </h1>
        {block.subtitle && (
          <p
            className={`text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed`}
            style={getSubtitleStyle(block)}
          >
            {block.subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export const ManagementRectorBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto mb-12 whitespace-pre-line`} style={getStyle(block)}>
      {block.hideHeader !== true && (
      <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-2">
        {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "school"}</span>}
        <h2 className="text-2xl font-bold text-slate-900">{block.sectionTitle || "Rektör"}</h2>
      </div>
  )}
      
      <div className="group relative flex flex-col md:flex-row items-stretch gap-0 rounded-xl bg-white shadow-xl overflow-hidden border border-slate-100">
        <div className="md:w-2/5 relative h-[350px] md:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-all duration-500"></div>
          {block.image ? (
            <div 
              className="w-full h-full bg-center bg-cover" 
              style={{ backgroundImage: `url(${block.image})` }}
            />
          ) : (
             <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
             </div>
          )}
        </div>
        <div className="md:w-3/5 flex flex-col justify-center p-8 md:p-12 gap-6 bg-gradient-to-br from-white to-slate-50">
          <div className="space-y-2">
            {block.hideBadge !== true && (
    <span className="inline-block px-3 py-1 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest">
      {block.badge || "Rektörlük Makamı"}
    </span>
  )}
            <h3 className="text-3xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "İsim Belirtilmemiş"}</h3>
            <p className="text-primary font-bold text-lg" style={getSubtitleStyle(block)}>{block.subtitle || "Unvan Belirtilmemiş"}</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute -top-4 -left-6 text-slate-200 text-6xl select-none">format_quote</span>
            <div 
              className="text-slate-600 text-lg leading-relaxed relative z-10 prose prose-slate"
              dangerouslySetInnerHTML={{ __html: block.desc || "" }}
            />
          </div>
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
              {block.buttons.map((btn: any, i: number) => (
                <a
                  key={i}
                  href={btn.url || "#"}
                  className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all ${
                    btn.style === "outline"
                      ? "border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-primary text-white hover:bg-primary/90 shadow-md"
                  }`}
                >
                  {btn.label}
                  {btn.style !== "outline" && <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ManagementTeamGridBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  const isDeans = block.type === 'management_deans';
  return (
    <div className={`mb-16 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto whitespace-pre-line`} style={getStyle(block)}>
      {block.hideHeader !== true && (
      <div className={`flex items-center ${isDeans ? 'justify-between' : 'gap-3'} mb-8 border-b border-primary/20 pb-2`}>
        {isDeans ? (
          <>
            <div className="flex items-center gap-3">
              {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "account_balance"}</span>}
              <h2 className="text-2xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Fakülte Dekanları"}</h2>
            </div>
            {block.subtitle && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block" style={getSubtitleStyle(block)}>{block.subtitle}</div>}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "groups"}</span>}
              <h2 className="text-2xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Rektör Yardımcıları & Genel Sekreter"}</h2>
            </div>
            {block.subtitle && <p className="text-sm text-slate-500 ml-4 hidden md:block" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
          </>
        )}
      </div>
      )}
      <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${items.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {items.map((item: any, idx: number) => {
          if (isDeans) {
            return (
              <div key={idx} className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow border border-slate-100 flex flex-col">
                {item.image ? (
                  <div 
                    className="aspect-square bg-center bg-cover rounded-lg mb-4 shrink-0" 
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ) : (
                  <div className="aspect-square bg-slate-100 rounded-lg mb-4 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
                  </div>
                )}
                <div className="space-y-1 flex-grow">
                  <p className="text-[11px] font-bold text-primary uppercase leading-tight line-clamp-2">{item.desc || "Bölüm"}</p>
                  <h5 className="text-md font-bold text-slate-900 leading-snug">{item.name}</h5>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50">
                  {item.hideButton !== true && (
                    <a href={item.url || "#"} className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1 cursor-pointer">
                        {item.buttonText || "Fakülte Sayfası"} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="flex flex-col bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              {item.image ? (
                <div 
                  className="h-64 bg-center bg-cover shrink-0" 
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              ) : (
                 <div className="h-64 bg-slate-100 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
                 </div>
              )}
              <div className="p-6 flex flex-col gap-3 flex-grow">
                <div className="flex-grow">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 line-clamp-2">{item.desc || "Birim"}</p>
                  <h4 className="text-xl font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">{item.role}</p>
                </div>
                {item.hideButton !== true && (
                  <a href={item.url || "#"} className="flex items-center gap-1 text-sm font-bold text-slate-800 hover:text-primary transition-colors mt-2 cursor-pointer">
                      {item.buttonText || "Detaylı Profil"} <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};