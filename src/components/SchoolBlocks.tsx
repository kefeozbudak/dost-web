import React from 'react';
import { IconPreview } from './IconField';

export const SchoolHeroBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
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
          {block.title || "Okul Başlığı"}
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

export const SchoolBentoBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <div className={`mb-16 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto whitespace-pre-line`} style={getStyle(block)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title}</h2>
        {block.subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col gap-4">
            {item.icon && (
               <div className="text-4xl text-primary">
                 <IconPreview data={item.icon} />
               </div>
            )}
            {item.image && (
               <div className="h-40 bg-center bg-cover rounded-lg" style={{ backgroundImage: `url(${item.image})` }} />
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SchoolBranchesBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <div className={`mb-16 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto bg-slate-50 py-12 rounded-2xl whitespace-pre-line`} style={getStyle(block)}>
      <div className="text-center mb-10 px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title || "Branşlar"}</h2>
        {block.subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 hover:shadow-md transition-all">
             {item.icon && (
               <div className="text-3xl text-primary mb-2 flex justify-center">
                 <IconPreview data={item.icon} />
               </div>
             )}
             <h4 className="font-bold text-slate-800">{item.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SchoolPedagogyBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <div className={`mb-16 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto whitespace-pre-line`} style={getStyle(block)}>
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2">
          {block.image ? (
            <img src={block.image} alt="Pedagogy" className="w-full rounded-2xl shadow-xl" />
          ) : (
            <div className="w-full h-80 bg-slate-100 rounded-2xl flex items-center justify-center">
               <span className="material-symbols-outlined text-5xl text-slate-300">school</span>
            </div>
          )}
        </div>
        <div className="md:w-1/2 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4" style={getTitleStyle(block)}>{block.title}</h2>
            <div className="text-lg text-slate-600 prose" dangerouslySetInnerHTML={{ __html: block.desc || block.subtitle || "" }} style={getSubtitleStyle(block)} />
          </div>
          <div className="space-y-4">
             {items.map((item: any, idx: number) => (
               <div key={idx} className="flex gap-4">
                 <div className="text-primary text-2xl shrink-0">
                   <IconPreview data={item.icon || 'check_circle'} />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900">{item.title}</h4>
                   <p className="text-slate-600 text-sm">{item.desc}</p>
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
  return (
    <div className={`mb-16 w-full ${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white whitespace-pre-line`} style={getStyle(block)}>
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-primary/20 text-primary-200 font-bold uppercase tracking-widest text-xs rounded-full mb-4">LGS Hazırlık</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={getTitleStyle(block)}>{block.title || "LGS Hazırlık Programı"}</h2>
        {block.subtitle && <p className="text-lg text-slate-300 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
             <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary-300">
                <IconPreview data={item.icon || 'star'} />
             </div>
             <h3 className="text-xl font-bold mb-2">{item.title}</h3>
             <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
