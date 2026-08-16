import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle, getIndividualButtonStyle } from "../lib/styleUtils";
import React from 'react';
import { IconPreview } from './IconField';

export const SchoolHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="relative pt-32 pb-20 px-6 md:px-8 bg-[#faf8ff] overflow-hidden whitespace-pre-line" style={getStyle(block, "container")}>
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center relative z-10">
        <div className="space-y-6">
          {block.badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#61f9e9]/20 text-[#006a62] rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">school</span>
              {block.badge}
            </div>
          )}
          <h1 className="text-4xl md:text-[48px] font-extrabold text-[#1a1b23] leading-[1.2] tracking-tight" style={getTitleStyle(block)}>
            {block.title ? <span dangerouslySetInnerHTML={{ __html: block.title }} /> : "Okul Başlığı"}
            {block.title2 && <span className="text-[#1d4eca] block mt-2" style={getStyle(block, "title2")} dangerouslySetInnerHTML={{ __html: block.title2 }} />}
          </h1>
          {block.subtitle && (
            <p className="text-lg text-[#434654] max-w-lg leading-[1.6]" style={getSubtitleStyle(block)}>
              {block.subtitle}
            </p>
          )}
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {block.buttons.map((btn: any, idx: number) => {
                const btnStyle = getIndividualButtonStyle(btn, block);
                if (btn.style === 'outline' || btn.primary === false || btn.primary === "false") {
                  return (
                    <a key={idx} href={btn.url || "#"} 
                       className="border-2 border-[#1d4eca] text-[#1d4eca] px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#1d4eca]/5 transition-colors"
                       style={btnStyle}>
                      {btn.label}
                    </a>
                  );
                }
                return (
                  <a key={idx} href={btn.url || "#"} 
                     className="bg-[#1d4eca] text-white px-8 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
                     style={btnStyle}>
                    {btn.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-sm border border-[#e2e8f0] group">
          {block.image ? (
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={block.image} alt="Hero" />
          ) : (
              <div className="w-full h-full bg-[#e2e8f0]"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    {(block.overlayCard?.enabled !== false) && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="backdrop-blur-sm p-4 rounded-lg border" style={{ backgroundColor: block.overlayCard?.bgColor || "rgba(250, 248, 255, 0.9)", borderColor: block.overlayCard?.borderColor || "#e2e8f0" }}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px]" style={{ color: block.overlayCard?.iconColor || "#006a62" }}>{block.overlayCard?.icon || "extension"}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: block.overlayCard?.titleColor || "#1a1b23" }}>{block.overlayCard?.title || "Oyun Temelli Eğitim"}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: block.overlayCard?.subtitleColor || "#64748b" }}>{block.overlayCard?.subtitle || "Aktif Öğrenme Yaklaşımı"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f3f2fd] rounded-l-full -z-10 transform translate-x-1/2"></div>
    </section>
  );
};

export const SchoolBentoBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 px-6 md:px-8 bg-[#f6f6f8] whitespace-pre-line" style={getStyle(block, "container")}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-bold text-[#1a1b23] mb-4 leading-[1.3]" style={getTitleStyle(block)}>{block.title}</h2>
          {block.subtitle && <p className="text-base text-[#434654]" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[250px]">
          {items.map((item: any, idx: number) => {
            const isLarge = idx === 0 || idx === 3;
            const isPrimary = idx === 3;

            if (isPrimary) {
              return (
                <div key={idx} className={getCardClass(item, "md:col-span-2 bg-[#1d4eca] text-white rounded-xl shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group")} style={getCardStyle(item, block)}>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="text-[#61f9e9] text-[40px] mb-4" style={getIconStyle(item, block)}>
                        <IconPreview data={item.icon || 'forest'} />
                      </div>
                      <h3 className="text-[24px] font-bold mb-2 leading-[1.4]" style={getCardTitleStyle(item, block)}>{item.title}</h3>
                      <p className="max-w-md opacity-90" style={getCardDescStyle(item, block)}>{item.desc}</p>
                    </div>

                  </div>
                  <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-black/10 to-transparent z-0"></div>
                </div>
              );
            }

            if (isLarge) {
              return (
                <div key={idx} className={getCardClass(item, "md:col-span-2 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden")} style={getCardStyle(item, block)}>
                  <div className="relative z-10">
                    <div className="text-[#1d4eca] text-[40px] mb-4" style={getIconStyle(item, block)}>
                      <IconPreview data={item.icon || 'psychology'} />
                    </div>
                    <h3 className="text-[24px] font-bold text-[#1a1b23] mb-2 leading-[1.4]" style={getCardTitleStyle(item, block)}>{item.title}</h3>
                    <p className="text-[#434654] max-w-md" style={getCardDescStyle(item, block)}>{item.desc}</p>
                  </div>
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#f3f2fd] rounded-tl-full opacity-50 group-hover:scale-110 transition-transform z-0"></div>
                </div>
              );
            }

            return (
              <div key={idx} className={getCardClass(item, "bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col justify-between hover:bg-[#f3f2fd] transition-colors group")} style={getCardStyle(item, block)}>
                <div>
                  <div className="text-[#006a62] text-[32px] mb-4" style={getIconStyle(item, block)}>
                    <IconPreview data={item.icon || 'favorite'} />
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1a1b23] mb-2" style={getCardTitleStyle(item, block)}>{item.title}</h3>
                  <p className="text-[16px] text-[#434654]" style={getCardDescStyle(item, block)}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const SchoolBranchesBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 px-6 md:px-8 bg-[#faf8ff] border-t border-[#e2e8f0] whitespace-pre-line" style={getStyle(block, "container")}>
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[36px] font-bold text-[#1a1b23] mb-4 leading-[1.3]" style={getTitleStyle(block)}>{block.title || "Geleceğe Hazırlayan Branşlar"}</h2>
            {block.subtitle && <p className="text-[16px] text-[#434654]" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item: any, idx: number) => {
             const iconColor = idx % 2 === 1 ? 'text-[#006a62]' : 'text-[#1d4eca]';
             const bgColor = idx % 2 === 1 ? 'bg-[#006a62]/10' : 'bg-[#1d4eca]/10';

             return (
              <div key={idx} className={getCardClass(item, "bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-shadow group")} style={getCardStyle(item, block)}>
                <div className="h-48 relative overflow-hidden">
                  {item.image ? (
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.title} />
                  ) : (
                    <div className="w-full h-full bg-[#f3f2fd] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#c4c5d6]">image</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 ${bgColor} group-hover:bg-transparent transition-colors duration-500`}></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={iconColor}>
                      <IconPreview data={item.icon || 'language'} />
                    </div>
                    <h3 className="text-[14px] font-bold text-[#1a1b23]">{item.title}</h3>
                  </div>
                  <p className="text-[16px] text-[#434654]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const SchoolPedagogyBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <div className={`py-20 w-full px-6 md:px-8 bg-[#faf8ff] whitespace-pre-line`} style={getStyle(block, "container")}>
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-12 items-stretch">
        <div className="md:w-1/2 relative min-h-[300px] rounded-2xl overflow-hidden shadow-xl">
          {block.image ? (
            <img src={block.image} alt="Pedagogy" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[#e2e8f0] flex items-center justify-center">
               <span className="material-symbols-outlined text-5xl text-[#747685]">school</span>
            </div>
          )}
        </div>
        <div className="md:w-1/2 space-y-6 flex flex-col justify-center py-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1a1b23] mb-4" style={getTitleStyle(block)}>{block.title}</h2>
            <div className="text-lg text-[#434654] prose" dangerouslySetInnerHTML={{ __html: block.desc || block.subtitle || "" }} style={getSubtitleStyle(block)} />
          </div>
          <div className="space-y-4">
             {items.map((item: any, idx: number) => (
               <div key={idx} className="flex gap-4">
                 <div className="text-[#1d4eca] text-2xl shrink-0" style={getIconStyle(item, block)}>
                   <IconPreview data={item.icon || 'check_circle'} />
                 </div>
                 <div>
                   <h4 className="font-bold text-[#1a1b23]">{item.title}</h4>
                   <p className="text-[#434654] text-sm">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SchoolLgsBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  
  const innerBgStyle = block.styles?.innerBgColor || block.styles?.innerBgOpacity !== undefined 
    ? { backgroundColor: `color-mix(in srgb, ${block.styles?.innerBgColor || '#0f172a'} ${block.styles?.innerBgOpacity ?? 100}%, transparent)` }
    : {};
  
  const defaultBgClass = !block.styles?.innerBgColor && block.styles?.innerBgOpacity === undefined 
    ? "bg-gradient-to-br from-[#0f172a] to-[#1a1b23] text-white" 
    : (block.styles?.innerBgOpacity === 0 ? "text-[#1e293b]" : "text-white");

  return (
    <div className={`py-20 w-full px-6 md:px-8 bg-[#f6f6f8] whitespace-pre-line`} style={getStyle(block, "container")}>
      <div 
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-6"} mx-auto rounded-3xl p-8 md:p-12 shadow-lg ${defaultBgClass}`}
        style={innerBgStyle}
      >
        <div className={`${block.styles?.textAlign ? "" : "text-center"} mb-12`}>
          <span className="inline-block px-3 py-1 bg-[#3f68e4]/20 text-[#b6c4ff] font-bold uppercase tracking-widest text-xs rounded-full mb-4">LGS Hazırlık</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${block.styles?.innerBgOpacity === 0 ? "text-[#1e293b]" : "text-white"}`} style={getTitleStyle(block)}>{block.title || "LGS Hazırlık Programı"}</h2>
          {block.subtitle && <p className={`text-lg max-w-2xl mx-auto ${block.styles?.innerBgOpacity === 0 ? "text-[#475569]" : "text-[#c4c5d6]"}`} style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item: any, idx: number) => (
            <div key={idx} className={`${block.styles?.innerBgOpacity === 0 ? "bg-white border-slate-200 shadow-sm" : "bg-[#2f3038]/50 border-[#434654]/50 text-white"} p-6 rounded-2xl border backdrop-blur-sm`}>
               <div className="w-12 h-12 bg-[#3f68e4]/20 rounded-lg flex items-center justify-center mb-4 text-[#61f9e9]" style={getIconStyle(item, block)}>
                  <IconPreview data={item.icon || 'star'} />
               </div>
               <h3 className={`text-xl font-bold mb-2 ${block.styles?.innerBgOpacity === 0 ? "text-[#1e293b]" : "text-white"}`}>{item.title}</h3>
               <p className={`text-sm leading-relaxed ${block.styles?.innerBgOpacity === 0 ? "text-[#475569]" : "text-[#c4c5d6]"}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HighSchoolHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-white border-b border-[#e2e8f0]" style={getStyle(block, "container")}>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto grid md:grid-cols-2 gap-12 items-center`}>
        <div className="z-10 flex flex-col gap-6">
          {block.badge && (
            <div className="inline-flex items-center gap-2 bg-[#dce1ff]/20 text-[#3f68e4] px-3 py-1 rounded-full w-fit">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span className="text-[12px] font-bold uppercase tracking-wider">{block.badge}</span>
            </div>
          )}
          <h1 className="text-[48px] font-[800] text-[#0f172a] leading-[1.2] tracking-tight" style={getTitleStyle(block)}>
            {block.title ? <span dangerouslySetInnerHTML={{ __html: block.title }} /> : "Dost Koleji'nde Lise:"}
            {block.title2 && (
              <>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1d4eca] to-[#006a62]" style={getStyle(block, "title2")} dangerouslySetInnerHTML={{ __html: block.title2 }}></span>
              </>
            )}
          </h1>
          {block.subtitle && (
            <p className="text-[18px] text-[#434654] max-w-xl leading-[1.6]" style={getSubtitleStyle(block)}>
              {block.subtitle}
            </p>
          )}
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {block.buttons.map((btn: any, idx: number) => (
                <a key={idx} href={btn.url || "#"} 
                   className={`px-8 py-3 rounded-lg text-[14px] font-bold transition-all flex items-center gap-2 shadow-sm ${btn.primary !== false ? 'bg-[#1d4eca] text-white hover:opacity-90' : 'border-2 border-[#1d4eca] text-[#1d4eca] bg-transparent hover:bg-[#1d4eca]/5'}`}
                   style={{
                     backgroundColor: btn.bgColor || undefined,
                     color: btn.textColor || undefined,
                     borderColor: btn.borderColor || undefined,
                     borderRadius: btn.borderRadius || undefined,
                     borderWidth: btn.borderColor ? '2px' : undefined,
                     borderStyle: btn.borderColor ? 'solid' : undefined
                   }}>
                  {btn.label} 
                  {btn.primary !== false && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm group">
          {block.image ? (
            <img alt={block.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={block.image} />
          ) : (
            <div className="absolute inset-0 bg-[#f3f2fd] flex items-center justify-center">
               <span className="material-symbols-outlined text-4xl text-[#c4c5d6]">image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          {(block.overlayCard?.enabled !== false) && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="backdrop-blur-sm p-4 rounded-lg border" style={{ backgroundColor: block.overlayCard?.bgColor || "rgba(250, 248, 255, 0.9)", borderColor: block.overlayCard?.borderColor || "#e2e8f0" }}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px]" style={{ color: block.overlayCard?.iconColor || "#006a62" }}>{block.overlayCard?.icon || "extension"}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: block.overlayCard?.titleColor || "#1a1b23" }}>{block.overlayCard?.title || "Oyun Temelli Eğitim"}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: block.overlayCard?.subtitleColor || "#64748b" }}>{block.overlayCard?.subtitle || "Aktif Öğrenme Yaklaşımı"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const HighSchoolProgramsBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 bg-[#f6f6f8]" style={getStyle(block, "container")}>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto`}>
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-bold text-[#0f172a] mb-4 leading-[1.3]" style={getTitleStyle(block)}>{block.title || "Akademik Seçenekler"}</h2>
          {block.subtitle && <p className="text-[16px] text-[#64748b] max-w-2xl mx-auto leading-[1.6]" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item: any, idx: number) => {
             const isSecondary = idx % 2 === 1;
             const colorClass = isSecondary ? 'text-[#006a62]' : 'text-[#1d4eca]';
             const iconBg = isSecondary ? 'bg-[#5ef6e6]/30' : 'bg-[#dce1ff]';
             const decoBg = isSecondary ? 'bg-[#5ef6e6]/20' : 'bg-[#1d4eca]/5';

             return (
               <div key={idx} className="bg-white border border-[#e2e8f0] rounded-xl p-8 hover:shadow-sm transition-all group relative overflow-hidden flex flex-col h-full">
                 <div className={`absolute top-0 right-0 w-32 h-32 ${decoBg} rounded-bl-full -z-10 transition-transform group-hover:scale-110`}></div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className={`w-12 h-12 ${iconBg} flex items-center justify-center rounded-lg ${colorClass}`}>
                     <IconPreview data={item.icon || (isSecondary ? 'science' : 'account_balance')} />
                   </div>
                   <h3 className="text-[24px] font-bold text-[#0f172a]">{item.title}</h3>
                 </div>
                 <p className="text-[16px] text-[#434654] mb-6 flex-grow leading-[1.6]">
                   {item.desc}
                 </p>
                 <ul className="space-y-3 mb-8">
                   {(() => {
                     let list = item.features || item.list || item.listItems || [];
                     if (typeof list === 'string') {
                       list = (list as string).split('\n').filter((x: string) => x.trim());
                     } else if (!Array.isArray(list)) {
                       list = [];
                     }
                     
                     if (list.length === 0 && typeof item.listString === 'string') {
                       list = item.listString.split('\n').filter((x: string) => x.trim());
                     }
                     return list.map((feature: any, fIdx: number) => (
                       <li key={fIdx} className="flex items-start gap-2 text-[#434654]">
                         <span className={`material-symbols-outlined ${colorClass} text-sm mt-1`}>check_circle</span>
                         <span className="text-[16px] leading-[1.6]">{feature.text || feature}</span>
                       </li>
                     ));
                   })()}
                 </ul>
                 {item.buttonText && (
                   <a href={item.url || "#"} className={`text-[14px] font-bold ${colorClass} group-hover:translate-x-2 transition-transform flex items-center gap-1 w-fit`}>
                     {item.buttonText} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                   </a>
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
};
