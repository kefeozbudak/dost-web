import React from 'react';
import { IconPreview } from './IconField';

export const AboutHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden" style={getStyle(block, "container")}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        {block.image && (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${block.image})` }} />
        )}
      </div>
      <div className={`relative z-20 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} text-center`}>
        {block.badge && (
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-200 font-bold uppercase tracking-widest text-xs rounded-full mb-6">
            {block.badge}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight" style={getTitleStyle(block)}>
          {block.title || "Hakkımızda"}
        </h1>
        {block.subtitle && (
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-8" style={getSubtitleStyle(block)}>
            {block.subtitle}
          </p>
        )}
        {block.buttons && block.buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {block.buttons.map((btn: any, idx: number) => (
               <a key={idx} href={btn.url || "#"} className={`px-6 py-3 rounded-lg font-bold transition-all ${btn.primary !== false ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}>
                 {btn.label}
               </a>
            ))}
          </div>
        )}
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
    <section className="py-20 bg-white" style={getStyle(block, "container")}>
      <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1000px] px-6"} mx-auto`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title || "Tarihçe"}</h2>
          {block.subtitle && <p className="text-lg text-slate-600" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="space-y-12">
          {items.map((item: any, idx: number) => (
             <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
               <div className="md:w-1/4 shrink-0">
                 <div className="text-3xl font-black text-primary">{item.year}</div>
                 <h3 className="text-xl font-bold text-slate-900 mt-2">{item.title}</h3>
               </div>
               <div className="md:w-3/4 flex flex-col md:flex-row gap-6">
                 <p className="text-slate-600 leading-relaxed md:w-1/2">{item.desc}</p>
                 {item.image && (
                   <div className="md:w-1/2 h-48 bg-cover bg-center rounded-xl shadow-md" style={{ backgroundImage: `url(${item.image})` }} />
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const MissionVisionBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 bg-slate-50" style={getStyle(block, "container")}>
      <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto`}>
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title || "Misyon & Vizyon"}</h2>
           {block.subtitle && <p className="text-lg text-slate-600" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {items.map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                    <IconPreview data={item.icon || 'lightbulb'} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                 <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
           ))}
         </div>
      </div>
    </section>
  );
};

export const ValuesBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 bg-white" style={getStyle(block, "container")}>
      <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto`}>
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title || "Değerlerimiz"}</h2>
           {block.subtitle && <p className="text-lg text-slate-600" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {items.map((item: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl text-center hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                 <div className="text-primary text-4xl mb-4">
                    <IconPreview data={item.icon || 'favorite'} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                 <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
           ))}
         </div>
      </div>
    </section>
  );
};

export const QuoteImageBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section className="py-20 bg-slate-900 text-white" style={getStyle(block, "container")}>
      <div className={`w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1000px] px-6"} mx-auto flex flex-col md:flex-row gap-12 items-center`}>
         <div className="md:w-1/2">
            {block.image && <img src={block.image} alt={block.title} className="w-full rounded-2xl shadow-xl" />}
         </div>
         <div className="md:w-1/2 space-y-6">
            <span className="material-symbols-outlined text-6xl text-primary opacity-50">format_quote</span>
            <h2 className="text-2xl md:text-3xl font-light italic leading-relaxed" style={getTitleStyle(block)}>"{block.title}"</h2>
            <div>
               <p className="font-bold text-lg text-primary">{block.subtitle}</p>
               {block.desc && <p className="text-slate-400">{block.desc}</p>}
            </div>
         </div>
      </div>
    </section>
  );
};
