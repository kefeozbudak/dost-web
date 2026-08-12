import React from 'react';
import { IconPreview } from './IconField';

export const AboutHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden" style={getStyle(block, "container")}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1d4eca]/80 to-transparent z-10"></div>
        {block.image && (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${block.image})` }} />
        )}
      </div>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto relative z-20 w-full`}>
        <div className="max-w-2xl text-white">
          {block.badge && (
            <span className="inline-block bg-[#5ef6e6] text-[#006f66] px-4 py-1 rounded-full text-[12px] font-bold mb-6 uppercase tracking-wider">
              {block.badge}
            </span>
          )}
          <h1 className="text-[48px] font-[800] leading-[1.2] tracking-tight mb-6 text-white" style={getTitleStyle(block)}>
            {block.title || "Eğitimde 25 Yıllık Güven ve Başarı"}
          </h1>
          {block.subtitle && (
            <p className="text-[18px] leading-[1.6] font-normal text-[#f7f6ff] mb-8" style={getSubtitleStyle(block)}>
              {block.subtitle}
            </p>
          )}
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex gap-4">
              {block.buttons.map((btn: any, idx: number) => (
                <a key={idx} href={btn.url || "#"} className={`px-8 py-3 rounded-xl text-[14px] font-bold transition-colors ${btn.primary !== false ? 'bg-white text-[#1d4eca] hover:bg-[#dce1ff]' : 'border-2 border-white text-white hover:bg-white/10'}`}>
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const AcademicHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="py-20 bg-slate-50" style={getStyle(block, "container")}>
      <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto flex flex-col md:flex-row gap-12 items-center`}>
        <div className="md:w-1/2 space-y-6">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Akademik Vizyon"}</h2>
           <p className="text-lg text-slate-600 leading-relaxed" style={getSubtitleStyle(block)}>{block.subtitle}</p>
        </div>
        <div className="md:w-1/2">
           {block.image && <img src={block.image} alt={block.title} className="w-full rounded-2xl shadow-xl" />}
        </div>
      </div>
    </section>
  );
};

export const AkademikKadroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20" style={getStyle(block, "container")}>
      <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title || "Akademik Kadro"}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item: any, idx: number) => (
             <div key={idx} className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden group">
               {item.image ? (
                 <div className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }} />
               ) : (
                 <div className="h-64 bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300">person</span>
                 </div>
               )}
               <div className="p-6 text-center">
                 <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                 <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">{item.role}</p>
                 <p className="text-slate-500 text-sm">{item.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TimelineBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 bg-[#faf8ff]" style={getStyle(block, "container")}>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto`}>
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-bold leading-[1.3] mb-4 text-[#1a1b23]" style={getTitleStyle(block)}>{block.title || "Başarı Yolculuğumuz"}</h2>
          {block.subtitle && <p className="text-[#64748b] text-[16px] max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="space-y-24">
          {items.map((item: any, idx: number) => {
             const isEven = idx % 2 === 1;
             const colorText = isEven ? 'text-[#006a62]' : 'text-[#1d4eca]';
             const colorBg = isEven ? 'bg-[#006a62]/10' : 'bg-[#1d4eca]/10';

             return (
               <div key={idx} className="flex flex-col md:flex-row items-center gap-12">
                 <div className={`md:w-1/2 ${isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'}`}>
                   <div className={`inline-block ${colorBg} ${colorText} px-4 py-1 rounded-full text-[12px] font-bold mb-4`}>{item.year || item.title}</div>
                   <h3 className="text-[36px] font-bold mb-4 leading-[1.3] text-[#1a1b23]">{item.title}</h3>
                   <p className="text-[18px] text-[#64748b] leading-relaxed">{item.desc}</p>
                 </div>
                 <div className={`md:w-1/2 ${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}>
                   <div className="w-full h-96 bg-cover bg-center rounded-3xl shadow-lg border border-[#e2e8f0]" style={item.image ? { backgroundImage: `url(${item.image})` } : { backgroundColor: '#e2e8f0' }} />
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export const MissionVisionBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 bg-[#f3f2fd]" style={getStyle(block, "container")}>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto grid md:grid-cols-2 gap-6`}>
        {items.map((item: any, idx: number) => {
           const colorText = idx % 2 === 1 ? 'text-[#006a62]' : 'text-[#1d4eca]';
           const colorBg = idx % 2 === 1 ? 'bg-[#006a62]/10' : 'bg-[#1d4eca]/10';
           const hoverBorder = idx % 2 === 1 ? 'hover:border-[#006a62]' : 'hover:border-[#1d4eca]';

           return (
             <div key={idx} className={`bg-white p-10 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col items-center text-center group ${hoverBorder} transition-colors duration-300`}>
               <div className={`w-16 h-16 ${colorBg} rounded-full flex items-center justify-center mb-6 ${colorText} group-hover:scale-110 transition-transform`}>
                 <IconPreview data={item.icon || 'flag'} />
               </div>
               <h2 className="text-[36px] font-bold mb-4 text-[#1a1b23] leading-[1.3]">{item.title}</h2>
               <p className="text-[#64748b] leading-relaxed text-[16px]">{item.desc}</p>
             </div>
           );
        })}
      </div>
    </section>
  );
};

export const ValuesBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 bg-[#faf8ff]" style={getStyle(block, "container")}>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto`}>
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-bold mb-4 leading-[1.3] text-[#1a1b23]" style={getTitleStyle(block)}>{block.title || "Temel Değerlerimiz"}</h2>
          {block.subtitle && <p className="text-[#64748b] text-[16px] max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => {
             const colors = ['text-[#1d4eca]', 'text-[#006a62]', 'text-[#ef4444]', 'text-[#555967]'];
             const iconColor = colors[idx % colors.length];
             
             return (
               <div key={idx} className="bg-white p-8 rounded-2xl border border-[#e2e8f0] hover:shadow-md transition-all">
                 <div className={`${iconColor} text-3xl mb-4`}>
                    <IconPreview data={item.icon || 'verified_user'} />
                 </div>
                 <h4 className="text-[24px] font-bold text-[#0f172a] mb-2 leading-[1.4]">{item.title}</h4>
                 <p className="text-sm text-[#64748b]">{item.desc}</p>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export const QuoteImageBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="py-20 bg-[#e2e1ec]/30" style={getStyle(block, "container")}>
      <div className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto`}>
        <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
          <div className="md:w-1/2 h-96 md:h-auto bg-cover bg-center" style={block.image ? { backgroundImage: `url(${block.image})` } : { backgroundColor: '#e2e8f0' }} />
          <div className="md:w-1/2 p-12 flex flex-col justify-center relative">
            <span className="material-symbols-outlined text-[#dce1ff] text-8xl absolute top-8 left-8 opacity-40">format_quote</span>
            <div className="relative z-10">
              <h2 className="text-[36px] font-bold mb-6 leading-[1.3] text-[#1a1b23]" style={getTitleStyle(block)}>{block.title || "Kurucumuzdan Mesaj"}</h2>
              <p className="text-[18px] italic mb-8 leading-relaxed text-[#0f172a]" style={getSubtitleStyle(block)}>"{block.quote || block.desc}"</p>
              <div>
                 <h4 className="text-[24px] font-bold text-[#1d4eca] leading-[1.4]">{block.author || block.authorName || block.subtitle}</h4>
                 <p className="text-[#64748b]">{block.authorTitle || block.extra || "Kurucu Mesajı"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
