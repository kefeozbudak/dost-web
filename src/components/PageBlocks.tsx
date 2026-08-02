import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import IconField, { IconPreview } from './IconField';

export const DynamicBlockRenderer = ({ blocks, onBlockClick }: { blocks: any[], onBlockClick?: (index: number, e?: React.MouseEvent) => void }) => {
  if (!blocks || !Array.isArray(blocks)) return null;
  const getStyle = (block: any, prefix: string) => {
    return {
      color: block.styles?.[prefix + 'Color'] || undefined,
      fontSize: block.styles?.[prefix + 'Size'] || undefined,
      fontWeight: block.styles?.[prefix + 'Weight'] || undefined,
      textAlign: block.styles?.[prefix + 'Align'] || undefined,
      marginTop: block.styles?.[prefix + 'MarginTop'] ? block.styles[prefix + 'MarginTop'] + 'px' : undefined,
      marginBottom: block.styles?.[prefix + 'MarginBottom'] ? block.styles[prefix + 'MarginBottom'] + 'px' : undefined,
      backgroundColor: (prefix === '' ? block.styles?.backgroundColor : undefined) || block.styles?.[prefix + 'BackgroundColor'] || undefined,
      paddingTop: block.styles?.[prefix + 'PaddingTop'] ? block.styles[prefix + 'PaddingTop'] + 'px' : undefined,
      paddingBottom: block.styles?.[prefix + 'PaddingBottom'] ? block.styles[prefix + 'PaddingBottom'] + 'px' : undefined,
      paddingLeft: block.styles?.[prefix + 'PaddingLeft'] ? block.styles[prefix + 'PaddingLeft'] + 'px' : undefined,
      paddingRight: block.styles?.[prefix + 'PaddingRight'] ? block.styles[prefix + 'PaddingRight'] + 'px' : undefined,
      borderRadius: block.styles?.[prefix + 'BorderRadius'] ? block.styles[prefix + 'BorderRadius'] + 'px' : undefined,
    };
  };

  const getTitleStyle = (block: any) => getStyle(block, 'title');
  const getSubtitleStyle = (block: any) => getStyle(block, 'subtitle');
  const getBadgeStyle = (block: any) => getStyle(block, 'badge');
  const getButtonStyle = (block: any) => getStyle(block, 'buttons');
  const getItemContainerStyle = (block: any) => getStyle(block, 'itemContainer');
  const getItemTitleStyle = (block: any) => getStyle(block, 'itemTitle');
  const getItemDescStyle = (block: any) => getStyle(block, 'itemDesc');
  const getTitlePart1Style = (block: any) => ({ ...getStyle(block, 'titlePart1'), color: block.styles?.titlePart1Color || block.titlePart1Color || undefined });
  const getTitlePart2Style = (block: any) => ({ ...getStyle(block, 'titlePart2'), color: block.styles?.titlePart2Color || block.titlePart2Color || undefined });

  const fallbackImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
  ];

  const getImageStyle = (obj: any, key: string, fallbackIndex = 0) => {
    let url = obj[key];
    if (!url || url.includes('lh3.googleusercontent.com/aida-public/')) {
      url = fallbackImages[fallbackIndex % fallbackImages.length];
    }
    const posX = obj[`${key}_posX`] ?? 50;
    const posY = obj[`${key}_posY`] ?? 50;
    const scale = obj[`${key}_scale`] ?? 100;
    return {
      backgroundImage: `url('${url}')`,
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundSize: scale !== 100 ? `${scale}%` : 'cover',
      backgroundRepeat: 'no-repeat'
    };
  };

  const renderBlock = (block: any, index: number) => {
    const renderContent = () => {
      switch (block.type) {

        case 'news_hero':
          return (
            <section key={index} className={`relative pt-32 pb-20 overflow-hidden ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10"></div>
                <div className="w-full h-full" style={getImageStyle(block, 'image')}></div>
              </div>
              <div className={`relative z-20 px-margin-mobile md:px-margin-desktop ${(block.fullWidth || block.styles?.fullWidth) ? 'max-w-container-max mx-auto' : 'w-full'}`}>
                <div className="max-w-2xl text-on-primary">
                  {block.title && <h1 style={getTitleStyle(block)} className="font-display-lg text-[36px] md:text-display-lg mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h1>}
                  {block.subtitle && <p style={getSubtitleStyle(block)} className="font-body-lg text-base md:text-body-lg opacity-90 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.subtitle }}></p>}
                </div>
              </div>
            </section>
          );

        case 'news_grid':
          return (
            <div key={index} className={(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto'} style={getStyle(block, '')}>
              <section className="bg-surface-container-lowest sticky top-20 z-40 border-b border-border-subtle" style={getStyle(block, 'filterContainer')}>
                <div className={`px-margin-mobile md:px-margin-desktop ${(block.fullWidth || block.styles?.fullWidth) ? 'max-w-container-max mx-auto' : 'w-full'}`}>
                  <div className="flex flex-nowrap md:flex-wrap overflow-x-auto items-center gap-6 md:gap-8 py-4 no-scrollbar">
                    {block.categories?.map((cat: any, i: number) => (
                      <button key={i} className={`whitespace-nowrap category-btn font-label-md text-sm md:text-label-md pb-4 transition-all ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                        {cat.label || cat}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-10 md:py-section-gap px-margin-mobile md:px-margin-desktop" style={getStyle(block, '')}>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-gutter ${(block.fullWidth || block.styles?.fullWidth) ? 'max-w-container-max mx-auto' : 'w-full'}`}>
                  {block.items?.map((item: any, i: number) => (
                    <div key={i} className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden hover:shadow-sm transition-all group flex flex-col" style={{ backgroundColor: item.cardBgColor, borderColor: item.cardBorderColor, borderRadius: item.cardBorderRadius }}>
                      <div className="relative aspect-video overflow-hidden">
                        <div className="w-full h-full group-hover:scale-105 transition-transform duration-500" style={getImageStyle(item, 'image')}></div>
                        {item.tag && <span className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full font-label-sm text-xs ${item.tagColor || 'bg-secondary'}`}>{item.tag}</span>}
                      </div>
                      <div className="p-6 flex flex-col flex-grow" style={{ padding: item.cardPadding }}>
                        {item.date && (
                          <div className="flex items-center gap-2 text-text-muted mb-3 font-label-sm text-xs md:text-label-sm">
                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">calendar_today</span>
                            <span>{item.date}</span>
                          </div>
                        )}
                        {item.title && <h3 style={{ ...getItemTitleStyle(block), color: item.itemTitleColor || getItemTitleStyle(block).color }} className="font-headline-md text-xl md:text-headline-md mb-3 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>}
                        {item.desc && <p style={{ ...getItemDescStyle(block), color: item.itemDescColor || getItemDescStyle(block).color }} className="font-body-md text-sm md:text-body-md text-on-surface-variant mb-6 line-clamp-3">{item.desc}</p>}
                        <div className="mt-auto">
                          <a href={item.url || '#'} className="flex items-center gap-2 text-primary font-label-md text-sm md:text-label-md hover:underline group/link">
                            {item.buttonText || 'Devamını Oku'}
                            <span className="material-symbols-outlined transition-transform group-hover/link:translate-x-1 text-sm md:text-base">arrow_forward</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {block.showPagination && (
                  <div className="mt-12 md:mt-16 flex justify-center items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md">1</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md">2</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md">3</button>
                    <span className="px-2 text-text-muted">...</span>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md">12</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </section>
            </div>
          );

        case 'newsletter':
          return (
            <section key={index} className={`py-12 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-primary-container/10 ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={`max-w-4xl mx-auto text-center ${(block.fullWidth || block.styles?.fullWidth) ? 'max-w-container-max mx-auto' : 'w-full'}`}>
                {block.icon && <span className="material-symbols-outlined text-primary text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>{block.icon}</span>}
                {block.title && <h2 style={getTitleStyle(block)} className="font-headline-xl text-[28px] md:text-headline-xl text-primary mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h2>}
                {block.desc && <p style={getSubtitleStyle(block)} className="font-body-lg text-base md:text-body-lg text-on-surface-variant mb-6 md:mb-8 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.desc }}></p>}
                
                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
                  <input className="flex-grow px-4 md:px-6 py-3 md:py-4 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary outline-none text-sm md:text-body-md" placeholder={block.inputPlaceholder || "E-posta adresiniz"} required type="email" />
                  <button className="bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-label-md text-sm md:text-label-md hover:opacity-90 transition-all shadow-md" type="submit">{block.buttonText || "Abone Ol"}</button>
                </form>
                {block.caption && <p className="mt-4 text-xs md:text-caption text-text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.caption }}></p>}
              </div>
            </section>
          );
        case 'hero':
          return (
            <section key={index} className={`relative flex flex-col justify-center items-center pt-8 pb-8 md:pt-12 md:pb-10 px-margin-mobile md:px-margin-desktop bg-[#f8f9fa] overflow-hidden ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              
              <div className="w-full flex flex-col gap-6 md:gap-10">
                {(() => {
                  const layoutOrder = block.layoutOrder || 'text_images_buttons';
                  
                  const textContent = (
                    <div className={`${(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto" : "w-full"} text-center relative z-10`}>
                      {block.badge && (
                        <span style={getBadgeStyle(block)} className="inline-block py-1.5 px-6 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold mb-4 tracking-widest">
                          {block.badge}
                        </span>
                      )}
                      {(() => {
                        const isStacked = block.titleLayout === 'stacked' || block.styles?.titleLayout === 'stacked';
                        const hasPart1 = Boolean(block.titlePart1 && block.titlePart1.trim());
                        const hasPart2 = Boolean(block.titlePart2 && block.titlePart2.trim());

                        if (hasPart1 || hasPart2) {
                          return (
                            <h1 
                              style={getTitleStyle(block)} 
                              className={`text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-4 max-w-4xl mx-auto leading-tight ${
                                isStacked 
                                  ? 'flex flex-col items-center justify-center gap-1 md:gap-2' 
                                  : 'flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 gap-y-1'
                              }`}
                            >
                              {hasPart1 && (
                                <span style={getTitlePart1Style(block)} className="inline-block">
                                  {block.titlePart1}
                                </span>
                              )}
                              {hasPart2 && (
                                <span style={getTitlePart2Style(block)} className="inline-block">
                                  {block.titlePart2}
                                </span>
                              )}
                            </h1>
                          );
                        }

                        return (
                          <h1 
                            style={getTitleStyle(block)} 
                            className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#232b38] mb-4 max-w-4xl mx-auto leading-tight whitespace-pre-line" 
                            dangerouslySetInnerHTML={{ __html: block.title || "" }}
                          />
                        );
                      })()}
                      <p style={getSubtitleStyle(block)} className="text-base md:text-[17px] text-[#556987] max-w-3xl mx-auto whitespace-pre-line font-medium leading-relaxed" dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></p>
                    </div>
                  );

                  const imagesContent = (
                    <div className="w-full">
                      {(() => {
                        const itemsToRender = (block.items && block.items.length > 0) ? block.items : [
                          { title: 'Eryaman Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' },
                          { title: 'Oran Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
                          { title: 'Ümitköy Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK' }
                        ];
                        return (
                          <div className="max-w-container-max mx-auto w-full flex flex-col md:flex-row gap-3 md:gap-6 relative z-10 px-4 md:px-0 h-[560px] md:h-[480px]">
                            {itemsToRender.map((item: any, i: number) => (
                              <div key={i} className="group relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[110px] md:min-h-0 h-full flex-1 hover:flex-[2.5] active:flex-[2.5] md:hover:flex-[2] lg:hover:flex-[3] transition-all duration-700 ease-in-out cursor-pointer select-none">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={getImageStyle(item, 'image', i)}></div>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent group-active:bg-transparent transition-colors duration-500"></div>
                                <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-max max-w-[90%] z-10">
                                  {item.url ? (
                                    <a href={item.url} style={getItemTitleStyle(block)} className="bg-white/95 backdrop-blur-sm text-primary font-bold text-[13px] md:text-[15px] px-5 md:px-8 py-2 md:py-3 rounded-full shadow-lg whitespace-nowrap block text-center transition-transform group-hover:-translate-y-1 duration-300 hover:bg-primary hover:text-white cursor-pointer">{item.title}</a>
                                  ) : (
                                    <span style={getItemTitleStyle(block)} className="bg-white/95 backdrop-blur-sm text-primary font-bold text-[13px] md:text-[15px] px-5 md:px-8 py-2 md:py-3 rounded-full shadow-lg whitespace-nowrap block text-center transition-transform group-hover:-translate-y-1 duration-300">{item.title}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );

                  const buttonsContent = block.buttons && block.buttons.length > 0 ? (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-container-max mx-auto relative z-10">
                      {block.buttons.map((btn: any, i: number) => {
                         const isCustomColors = btn.bgColor || btn.textColor;
                         const defaultClasses = btn.primary ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg' : 'bg-white text-primary border border-border-subtle hover:bg-surface-container';
                         
                         return (
                          <a key={i} href={btn.url || '#'} className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all ${!isCustomColors ? defaultClasses : 'hover:opacity-90 hover:shadow-lg'}`}
                             style={{
                               ...getButtonStyle(block),
                               ...(isCustomColors ? {
                                 backgroundColor: btn.bgColor || undefined,
                                 color: btn.textColor || undefined,
                                 borderColor: !btn.primary && btn.bgColor ? btn.bgColor : undefined,
                                 borderWidth: !btn.primary ? '1px' : undefined,
                                 borderStyle: !btn.primary ? 'solid' : undefined,
                               } : {})
                             }}
                          >
                            {btn.label}
                            {btn.icon && (typeof btn.icon === "string" && btn.icon === btn.icon.toLowerCase() ? <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span> : <IconPreview data={btn.icon} className="w-[1.1em] h-[1.1em]" />)}
                          </a>
                        );
                      })}
                    </div>
                  ) : null;

                  if (layoutOrder === 'images_text_buttons') {
                    return (
                      <>
                        {imagesContent}
                        {textContent}
                        {buttonsContent}
                      </>
                    );
                  } else if (layoutOrder === 'text_buttons_images') {
                    return (
                      <>
                        {textContent}
                        {buttonsContent}
                        {imagesContent}
                      </>
                    );
                  }
                  
                  return (
                    <>
                      {textContent}
                      {imagesContent}
                      {buttonsContent}
                    </>
                  );
                })()}
              </div>

            </section>
          );
        
        case 'education_levels':
          return (
            <section key={index} className={`py-section-gap px-margin-mobile md:px-margin-desktop ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={{ backgroundColor: block.styles?.backgroundColor || '#4873f4', ...getStyle(block, '') }}>
              <div className={(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto" : "w-full"}>
                <div className="flex flex-row items-center gap-4 mb-10 md:mb-12">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-3xl">school</span>
                  </div>
                  <div>
                    {block.subtitle && <span style={getSubtitleStyle(block)} className="text-white/80 text-xs md:text-sm font-bold tracking-widest mb-1 block whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.subtitle}}></span>}
                    <h2 style={getTitleStyle(block)} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white whitespace-pre-line leading-tight" dangerouslySetInnerHTML={{__html: block.title || ""}}></h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                   {block.items?.map((item: any, i: number) => (
                     <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-white/10 border border-white/10 hover:bg-white/[0.15] hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col text-left backdrop-blur-md">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                         {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="text-[#5eead4] w-6 h-6" /> : <span className="material-symbols-outlined text-[#5eead4]">{item.icon || 'school'}</span>}
                       </div>
                       <h3 style={getItemTitleStyle(block)} className="text-xl md:text-2xl font-bold mb-3 text-white">{item.title}</h3>
                       <p style={getItemDescStyle(block)} className="text-white/80 text-sm leading-relaxed mb-8 flex-1">{item.desc}</p>
                       {(item.buttonText || item.buttonUrl) && (
                          <a href={item.buttonUrl || '#'} className="w-full py-3.5 px-4 rounded-xl bg-[#5eead4] text-[#0f172a] font-bold text-sm text-center hover:bg-[#4fd1c5] hover:shadow-lg hover:shadow-[#5eead4]/20 transition-all duration-300">
                            {item.buttonText || 'Detaylı Bilgi'}
                          </a>
                       )}
                     </div>
                   ))}
                </div>
              </div>
            </section>
          );
          
        case 'features':
          return (
            <section key={index} className={`py-section-gap px-margin-desktop ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto" : "w-full"}>
              <div className="text-center mb-10 md:mb-16">
                <span style={getSubtitleStyle(block)} className="text-primary text-xs md:text-sm font-bold tracking-widest mb-3 md:mb-4 block whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></span>
                <h2 style={getTitleStyle(block)} className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-background whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.title || ""}}></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto">
                {block.items?.map((item: any, i: number) => (
                  <div key={i} className={`bento-card p-6 md:p-8 rounded-2xl border border-border-subtle flex flex-col ${item.highlight ? 'bg-primary text-white md:col-span-2 relative overflow-hidden' : 'bg-white text-on-surface'} ${item.rowSpan ? 'md:row-span-2' : ''}`}>
                    {item.highlight ? (
                      <>
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
                          <div className="flex-1">
                            <h3 style={getItemTitleStyle(block)} className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white whitespace-pre-line">{item.title}</h3>
                            <p style={getItemDescStyle(block)} className="text-white/80 mb-5 md:mb-6 text-sm md:text-base whitespace-pre-line">{item.desc}</p>
                            {item.buttonText && <button className="bg-white text-primary text-sm md:text-base font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-lg hover:bg-surface-container transition-all">{item.buttonText} {item.buttonIcon && <span className="material-symbols-outlined ml-1 text-[0.9em]">{item.buttonIcon}</span>}</button>}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center mb-5 shrink-0">
                          {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="w-6 h-6" /> : <span className="material-symbols-outlined text-2xl">{item.icon}</span>}
                        </div>
                        <h3 style={getItemTitleStyle(block)} className="text-lg font-bold mb-2">{item.title}</h3>
                        <p style={getItemDescStyle(block)} className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
              </div>
            </section>
          );
          
        case 'campuses':
          return (
            <section key={index} className={`py-section-gap px-margin-desktop bg-surface-container/50 ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto" : "w-full"}>
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 gap-6">
                <div>
                  <span style={getSubtitleStyle(block)} className="text-primary text-xs md:text-sm font-bold tracking-widest mb-3 md:mb-4 block whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></span>
                  <h2 style={getTitleStyle(block)} className="text-2xl md:text-3xl lg:text-4xl font-bold whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.title || ""}}></h2>
                </div>
                {block.viewAllText && (
                  <button className="hidden md:flex items-center gap-2 text-primary text-sm md:text-base font-bold hover:underline">
                    {block.viewAllText}
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-gutter">
                {block.items?.map((item: any, i: number) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border-subtle flex flex-col">
                    <div className="h-48 md:h-64 overflow-hidden shrink-0">
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={getImageStyle(item, 'image')}></div>
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h3 style={getItemTitleStyle(block)} className="text-xl md:text-2xl font-bold whitespace-pre-line">{item.title}</h3>
                        <span className="text-primary material-symbols-outlined">location_on</span>
                      </div>
                      <p style={getItemDescStyle(block)} className="text-text-muted text-sm md:text-base mb-5 md:mb-6 flex-1 whitespace-pre-line">{item.desc}</p>
                      <button className="w-full border-2 border-primary/20 text-primary text-sm md:text-base font-bold py-2.5 md:py-3 rounded-xl hover:bg-primary hover:text-white transition-all mt-auto">{item.buttonText || 'İncele'} {item.buttonIcon && <span className="material-symbols-outlined ml-1 text-[0.9em]">{item.buttonIcon}</span>}</button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </section>
          );
          
                case 'video':
          return (
            <section key={index} className={`py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto relative z-10" : "relative z-10"}>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                  {/* Left: Text Content */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    {block.title && <h2 style={getTitleStyle(block)} className="font-display-lg text-4xl md:text-5xl lg:text-display-lg text-on-surface mb-6 leading-tight whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h2>}
                    {block.subtitle && <p style={getSubtitleStyle(block)} className="font-body-lg text-lg md:text-body-lg text-text-muted mb-8 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.subtitle }}></p>}
                    {block.desc && <div className="prose prose-slate max-w-none text-on-surface-variant" dangerouslySetInnerHTML={{ __html: block.desc }}></div>}
                  </div>
                  
                  {/* Right: Video Area */}
                  <div className="lg:col-span-7 group relative aspect-video bg-inverse-surface rounded-2xl overflow-hidden shadow-2xl border border-border-subtle cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(29,78,202,0.2)]">
                    {block.thumbnailUrl ? (
                      <img src={block.thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Video Kapak Görseli</div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                    
                    {/* Video Play Interaction */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75 duration-1000"></div>
                        <a href={block.videoUrl || '#'} target="_blank" rel="noopener noreferrer" className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10 text-primary">
                          <span className="material-symbols-outlined text-4xl md:text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

        case 'stats':
          return (
            <section 
              key={index} 
              className={`py-section-gap px-margin-mobile md:px-margin-desktop text-center bg-primary-container ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} 
              style={getStyle(block, '')}
            >
              <div className="relative overflow-hidden w-full h-full absolute inset-0 rounded-3xl pointer-events-none">
                <div className="absolute inset-0 z-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
              </div>
              <div className={`${(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto" : "w-full"} relative z-10 p-4 md:p-8 lg:p-12`}>
                <div>
                  <h2 style={getTitleStyle(block)} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.title || ""}}></h2>
                  <p style={getSubtitleStyle(block)} className="text-white/80 max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-lg whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
                    {block.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div style={getItemTitleStyle(block)} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-fixed mb-1 md:mb-2">{item.value}</div>
                        <div style={getItemDescStyle(block)} className="text-white/70 text-xs md:text-sm font-bold tracking-wider">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  {block.buttonText && (
                    <a href={block.buttonUrl || '#'} className="inline-flex items-center gap-2 md:gap-3 bg-secondary-container text-teal-950 px-6 py-3 md:px-10 md:py-4 rounded-full text-sm md:text-base font-bold hover:bg-secondary-fixed transition-all">
                      {block.buttonText}
                      {block.buttonIcon && <span className="material-symbols-outlined text-[1.1em]">{block.buttonIcon}</span>}
                    </a>
                  )}
                </div>
              </div>
            </section>
          );
        case 'news':
          return (
            <section key={index} className={`py-section-gap px-margin-desktop ${(block.fullWidth || block.styles?.fullWidth) ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={(block.fullWidth || block.styles?.fullWidth) ? "max-w-container-max mx-auto" : "w-full"}>
              <div className="flex justify-between items-end mb-10 md:mb-12">
                <div>
                  <span style={getSubtitleStyle(block)} className="text-primary text-xs md:text-sm font-bold tracking-widest mb-3 md:mb-4 block whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></span>
                  <h2 style={getTitleStyle(block)} className="text-2xl md:text-3xl lg:text-4xl font-bold whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.title || ""}}></h2>
                </div>
                <div className="flex gap-2 md:gap-4">
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border-subtle flex items-center justify-center hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-xl md:text-2xl">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border-subtle flex items-center justify-center hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-xl md:text-2xl">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-gutter">
                {block.items?.map((item: any, i: number) => (
                  <div key={i} className={`group cursor-pointer ${i === 0 ? 'md:col-span-2 sm:col-span-2' : ''}`}>
                    <div className={`relative rounded-2xl overflow-hidden mb-4 md:mb-6 ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/5] sm:aspect-square md:aspect-[4/5]'}`}>
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={getImageStyle(item, 'image')}></div>
                      <div style={getBadgeStyle(block)} className={`absolute top-4 left-4 text-white text-[10px] px-3 py-1 rounded-full tracking-tighter font-bold ${item.tagColor || 'bg-primary'}`}>{item.tag}</div>
                    </div>
                    <h3 style={getItemTitleStyle(block)} className={`${i === 0 ? 'text-2xl mb-3' : 'text-sm font-bold mb-2'} group-hover:text-primary transition-colors line-clamp-2 whitespace-pre-line`}>{item.title}</h3>
                    <p style={getItemDescStyle(block)} className={`text-text-muted ${i === 0 ? 'text-base line-clamp-2' : 'text-xs'} whitespace-pre-line`}>{item.desc}</p>
                  </div>
                ))}
              </div>
              </div>
            </section>
          );
      case 'about_hero':
        return (
          <section key={index} className="relative h-[80vh] flex items-center overflow-hidden" style={getStyle(block, '')}>
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
              <div className="w-full h-full bg-cover bg-center" style={getImageStyle(block, 'image')}></div>
            </div>
            <div className="max-w-container-max mx-auto px-margin-desktop relative z-20 w-full">
              <div className="max-w-2xl text-white">
                {block.badge && (
                  <span style={getBadgeStyle(block)} className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-label-sm mb-6 uppercase tracking-wider">{block.badge}</span>
                )}
                {block.title && (
                  <h1 style={getTitleStyle(block)} className="font-display-lg text-display-lg mb-6 text-white whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h1>
                )}
                {block.subtitle && (
                  <p style={getSubtitleStyle(block)} className="font-body-lg text-body-lg text-on-primary-container mb-8 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.subtitle }}></p>
                )}
                
                {block.buttons && block.buttons.length > 0 && (
                  <div className="flex gap-4">
                    {block.buttons.map((btn: any, i: number) => {
                       const isCustomColors = btn.bgColor || btn.textColor;
                       return (
                      <a key={i} href={btn.url || '#'} 
                         style={{
                           ...getButtonStyle(block),
                           ...(isCustomColors ? {
                             backgroundColor: btn.bgColor || undefined,
                             color: btn.textColor || undefined,
                             borderColor: !btn.primary && btn.bgColor ? btn.bgColor : undefined,
                             borderWidth: !btn.primary ? '2px' : undefined,
                             borderStyle: !btn.primary ? 'solid' : undefined,
                           } : {})
                         }} 
                         className={!isCustomColors ? (btn.primary ? "bg-white text-primary px-8 py-3 rounded-xl font-label-md hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" : "border-2 border-white text-white px-8 py-3 rounded-xl font-label-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2") : "px-8 py-3 rounded-xl font-label-md transition-colors flex items-center justify-center gap-2 hover:opacity-90"}>
                        {btn.label}
                        {btn.icon && (typeof btn.icon === "string" && btn.icon === btn.icon.toLowerCase() ? <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span> : <IconPreview data={btn.icon} className="w-[1.1em] h-[1.1em]" />)}
                      </a>
                    )})}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      case 'timeline':
        return (
          <section key={index} className="py-section-gap bg-surface" style={getStyle(block, '')}>
            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="text-center mb-16">
                {block.title && <h2 style={getTitleStyle(block)} className="font-headline-xl text-headline-xl mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h2>}
                {block.subtitle && <p style={getSubtitleStyle(block)} className="text-text-muted max-w-2xl mx-auto whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.subtitle }}></p>}
              </div>
              <div className="space-y-24">
                {block.items?.map((item: any, i: number) => {
                  const isEven = i % 2 !== 0; 
                  return (
                    <div key={i} className="flex flex-col md:flex-row items-center gap-12">
                      <div className={`md:w-1/2 ${isEven ? '' : 'order-2 md:order-1'}`}>
                        {item.year && <div className={`inline-block ${isEven ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} px-4 py-1 rounded-full font-label-sm mb-4`}>{item.year}</div>}
                        <h3 style={getItemTitleStyle(block)} className="font-headline-xl text-headline-xl mb-4 whitespace-pre-line">{item.title}</h3>
                        <p style={getItemDescStyle(block)} className="text-body-lg text-text-muted leading-relaxed whitespace-pre-line">{item.desc}</p>
                      </div>
                      <div className={`md:w-1/2 ${isEven ? '' : 'order-1 md:order-2'}`}>
                        <div className="w-full h-64 md:h-96 bg-cover bg-center rounded-3xl shadow-lg border border-border-subtle" style={getImageStyle(item, 'image')}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      case 'mission_vision':
        return (
          <section key={index} className="py-section-gap bg-surface-container-low" style={getStyle(block, '')}>
            <div className="max-w-container-max mx-auto px-margin-desktop grid md:grid-cols-2 gap-gutter">
              {block.items?.map((item: any, i: number) => {
                const isSecondary = i % 2 !== 0;
                return (
                  <div key={i} className={`bg-surface-card p-10 rounded-2xl border border-border-subtle shadow-sm flex flex-col items-center text-center group transition-colors duration-300 ${isSecondary ? 'hover:border-secondary' : 'hover:border-primary'}`} style={getItemContainerStyle(block)}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isSecondary ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                      {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="w-10 h-10" /> : <span className="material-symbols-outlined text-4xl">{item.icon || (isSecondary ? 'visibility' : 'flag')}</span>}
                    </div>
                    <h2 style={getItemTitleStyle(block)} className="font-headline-xl text-headline-xl mb-4 whitespace-pre-line">{item.title}</h2>
                    <p style={getItemDescStyle(block)} className="text-text-muted leading-relaxed whitespace-pre-line">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        );
      case 'values':
        return (
          <section key={index} className="py-section-gap" style={getStyle(block, '')}>
            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="text-center mb-16">
                {block.title && <h2 style={getTitleStyle(block)} className="font-headline-xl text-headline-xl mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h2>}
                {block.subtitle && <p style={getSubtitleStyle(block)} className="text-text-muted max-w-2xl mx-auto whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.subtitle }}></p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {block.items?.map((item: any, i: number) => {
                  const colors = ['text-primary', 'text-secondary', 'text-error-red', 'text-tertiary'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={i} className="bg-white p-8 rounded-2xl border border-border-subtle hover:shadow-md transition-all" style={getItemContainerStyle(block)}>
                      {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className={`${color} w-8 h-8 mb-4`} /> : <span className={`material-symbols-outlined ${color} text-3xl mb-4`}>{item.icon || 'verified_user'}</span>}
                      <h4 style={getItemTitleStyle(block)} className="font-headline-md text-headline-md text-text-main mb-2 whitespace-pre-line">{item.title}</h4>
                      <p style={getItemDescStyle(block)} className="text-sm text-text-muted whitespace-pre-line">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      case 'quote_image':
        return (
          <section key={index} className="py-section-gap bg-surface-container-highest/30" style={getStyle(block, '')}>
            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="bg-surface-card rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
                <div className="md:w-1/2 h-64 md:h-auto min-h-[350px] bg-cover bg-center" style={getImageStyle(block, 'image')}></div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                  <span className="material-symbols-outlined text-primary-fixed text-8xl absolute top-4 md:top-8 left-4 md:left-8 opacity-40">format_quote</span>
                  <div className="relative z-10">
                    {block.title && <h2 style={getTitleStyle(block)} className="font-headline-xl text-headline-xl mb-6 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h2>}
                    <p style={getSubtitleStyle(block)} className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line">
                      {block.quote}
                    </p>
                    <div>
                      <h4 className="font-headline-md text-headline-md text-primary">{block.authorName}</h4>
                      <p className="text-text-muted">{block.authorTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'academic_hero':
        return (
          <section key={index} className="relative w-full h-[400px] overflow-hidden" style={getStyle(block, 'container')}>
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-cover bg-center" style={getImageStyle(block, 'image')}></div>
              <div className="absolute inset-0" style={{ backgroundColor: block.styles?.overlayColor || 'rgba(0,0,0,0.5)' }}></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-10 lg:px-20">
              <div className="max-w-3xl">
                {block.titlePart1 || block.titlePart2 ? (
                  <h1 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight" style={getTitleStyle(block)}>
                    {block.titlePart1 && <span style={getTitlePart1Style(block)}>{block.titlePart1}</span>}
                    {block.titlePart1 && block.titlePart2 && ' '}
                    {block.titlePart2 && <span style={getTitlePart2Style(block)}>{block.titlePart2}</span>}
                  </h1>
                ) : (
                  <h1 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight" style={getTitleStyle(block)} dangerouslySetInnerHTML={{__html: block.title || ""}}></h1>
                )}
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl" style={getSubtitleStyle(block)} dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></p>
                <div className="mt-8 flex gap-4">
                  <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        );


      case 'akademik_kadro':
        return (
          <div key={index} className="max-w-[1440px] mx-auto flex flex-col pt-8 pb-20 px-4 sm:px-10 lg:px-20 gap-8" style={getStyle(block, 'container')}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Navigation */}
              <aside className="w-full lg:w-72 shrink-0">
                <div className="border border-[#e5e7eb] dark:border-[#2d333d] rounded-xl p-5 sticky top-24" style={{ backgroundColor: block.styles?.sidebarBgColor || 'var(--sidebar-bg, #1a212c)' }}>
                  <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ ...getStyle(block, 'sidebarTitle'), color: block.styles?.sidebarTitleColor || block.styles?.sidebarTextColor || '#9ca3af' }}>
                      {block.sidebarTitle || 'Bölümler'}
                    </h3>
                    <p className="text-xs mt-1" style={{ ...getStyle(block, 'sidebarSubtitle'), color: block.styles?.sidebarSubtitleColor || block.styles?.sidebarTextColor || '#6b7280' }}>
                      {block.sidebarSubtitle || 'Hızlı Navigasyon'}
                    </p>
                  </div>
                  <nav className="space-y-1">
                    {(block.sidebarItems || []).map((item: any, i: number) => (
                      <a key={i} 
                         className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group font-semibold" 
                         style={{
                           backgroundColor: i === 0 ? (block.styles?.sidebarActiveBgColor || 'rgba(29, 78, 202, 0.1)') : 'transparent',
                           color: i === 0 ? (block.styles?.sidebarActiveTextColor || '#1d4eca') : (block.styles?.sidebarTextColor || '#e5e7eb'),
                         }}
                         href={item.url || '#'}>
                        {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="w-[20px] h-[20px]" /> : <span className="material-symbols-outlined text-[20px]" style={{ color: 'inherit' }}>{item.icon || 'school'}</span>}
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Faculty Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(block.items || []).map((item: any, i: number) => (
                    <div key={i} className="border border-[#e5e7eb] dark:border-[#2d333d] rounded-xl overflow-hidden hover:shadow-lg transition-shadow group" style={{
                      ...getStyle(block, 'card'),
                      backgroundColor: item.cardBgColor || block.styles?.cardBgColor || '#1a212c',
                      ...(item.cardBorderColor ? { borderColor: item.cardBorderColor } : {}),
                      ...(item.cardBorderWidth ? { borderWidth: item.cardBorderWidth } : {}),
                      ...(item.cardBorderRadius ? { borderRadius: item.cardBorderRadius } : {}),
                    }}>
                      <div className="aspect-square bg-slate-100 overflow-hidden relative" style={{ borderRadius: item.cardBorderRadius ? `calc(${item.cardBorderRadius} - 1px) calc(${item.cardBorderRadius} - 1px) 0 0` : undefined }}>
                        <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={item.image} alt={item.title} style={getImageStyle(item, 'image', i)} />
                        {item.tag && (
                          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white text-xs font-bold px-2 py-1 bg-primary rounded" style={item.tagColor ? { backgroundColor: item.tagColor } : {}}>{item.tag}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5" style={item.cardPadding ? { padding: item.cardPadding } : {}}>
                        <h3 className="text-lg font-bold mb-1" style={{ color: item.itemTitleColor || block.styles?.cardTitleColor || '#ffffff' }}>{item.title}</h3>
                        <p className="text-sm font-medium italic mb-3" style={{ color: item.itemDescColor || block.styles?.cardAccentColor || '#1d4eca' }}>{item.subtitle}</p>
                        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: item.itemTextColor || block.styles?.cardTextColor || '#9ca3af' }} dangerouslySetInnerHTML={{__html: item.desc || ""}}></p>
                        
                        {item.url && (
                          <div className="flex items-center justify-between border-t border-[#f0f2f4] dark:border-[#2d333d] pt-4">
                            <div className="flex gap-3"></div>
                            <a href={item.url} className="text-xs font-bold hover:underline" style={{ color: item.buttonTextColor || block.styles?.cardAccentColor || '#1d4eca' }}>{item.buttonText || 'Profili Görüntüle'}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'management_hero':
        return (
          <section key={index} className="relative w-full h-[400px] flex items-center justify-center overflow-hidden mb-12" style={getStyle(block, 'container')}>
            <div className="absolute inset-0 bg-cover bg-center" style={getImageStyle(block, 'image')}></div>
            <div className="absolute inset-0 bg-slate-900/60" style={block.styles?.overlayColor ? { backgroundColor: block.styles.overlayColor } : {}}></div>
            <div className="relative z-10 layout-content-container w-full max-w-[1200px] px-6 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight" style={getTitleStyle(block)} dangerouslySetInnerHTML={{__html: block.title || ""}}></h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed" style={getSubtitleStyle(block)} dangerouslySetInnerHTML={{__html: block.subtitle || ""}}></p>
            </div>
          </section>
        );

      case 'management_rector':
        return (
          <div key={index} className="layout-content-container flex flex-col w-full max-w-[1200px] px-6 py-8 mx-auto" style={getStyle(block, 'container')}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-2">
                {(typeof block.icon === 'object' || (typeof block.icon === 'string' && block.icon !== block.icon.toLowerCase())) ? <IconPreview data={block.icon} className="text-primary w-6 h-6" /> : <span className="material-symbols-outlined text-primary">{block.icon || 'school'}</span>}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={getTitleStyle(block)}>{block.title || 'Rektör'}</h2>
              </div>
              <div className="group relative flex flex-col md:flex-row items-stretch gap-0 rounded-xl bg-white dark:bg-background-dark shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="md:w-2/5 relative h-[350px] md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-all duration-500"></div>
                  <div className="w-full h-full bg-center bg-cover" style={getImageStyle(block, 'image')}></div>
                </div>
                <div className="md:w-3/5 flex flex-col justify-center p-8 md:p-12 gap-6 bg-gradient-to-br from-white to-slate-50 dark:from-background-dark dark:to-slate-900">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest">{block.badge || 'Rektörlük Makamı'}</span>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{block.name || 'Prof. Dr. Ahmet Yılmaz'}</h3>
                    <p className="text-primary font-bold text-lg">{block.role || 'Rektör'}</p>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute -top-4 -left-6 text-slate-200 dark:text-slate-800 text-6xl select-none">format_quote</span>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed relative z-10" dangerouslySetInnerHTML={{__html: block.quote || ""}}></p>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    {(block.buttons || []).map((btn: any, i: number) => {
                      const isCustom = btn.bgColor || btn.textColor;
                      return (
                      <a key={i} href={btn.url || '#'} 
                        style={isCustom ? { backgroundColor: btn.bgColor || undefined, color: btn.textColor || undefined } : {}}
                        className={!isCustom ? (btn.style === 'outline' ? "flex items-center gap-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" : "flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-md") : "flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all shadow-md hover:opacity-90"}>
                        {btn.label} {btn.icon && (typeof btn.icon === "string" && btn.icon === btn.icon.toLowerCase() ? <span className="material-symbols-outlined text-[18px]">{btn.icon}</span> : <IconPreview data={btn.icon} className="w-[18px] h-[18px]" />)}
                      </a>
                    )})}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'management_vice_rectors':
        return (
          <div key={index} className="layout-content-container flex flex-col w-full max-w-[1200px] px-6 py-8 mx-auto" style={getStyle(block, 'container')}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8 border-b border-primary/20 pb-2">
                {(typeof block.icon === 'object' || (typeof block.icon === 'string' && block.icon !== block.icon.toLowerCase())) ? <IconPreview data={block.icon} className="text-primary w-6 h-6" /> : <span className="material-symbols-outlined text-primary">{block.icon || 'groups'}</span>}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={getTitleStyle(block)}>{block.title || 'Rektör Yardımcıları & Genel Sekreter'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(block.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex flex-col bg-white dark:bg-background-dark rounded-xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="h-64 bg-center bg-cover" style={getImageStyle(item, 'image', i)}></div>
                    <div className="p-6 flex flex-col gap-3">
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{item.badge}</p>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{item.role}</p>
                      </div>
                      {item.url && (
                        <a className="flex items-center gap-1 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-primary transition-colors mt-2" href={item.url}>
                          {item.buttonText || 'Detaylı Profil'} <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'management_deans':
        return (
          <div key={index} className="layout-content-container flex flex-col w-full max-w-[1200px] px-6 py-8 mx-auto" style={getStyle(block, 'container')}>
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8 border-b border-primary/20 pb-2">
                <div className="flex items-center gap-3">
                  {(typeof block.icon === 'object' || (typeof block.icon === 'string' && block.icon !== block.icon.toLowerCase())) ? <IconPreview data={block.icon} className="text-primary w-6 h-6" /> : <span className="material-symbols-outlined text-primary">{block.icon || 'account_balance'}</span>}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={getTitleStyle(block)}>{block.title || 'Fakülte Dekanları'}</h2>
                </div>
                {block.subtitle && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">{block.subtitle}</div>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(block.items || []).map((item: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-white dark:bg-background-dark shadow hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-800">
                    <div className="aspect-square bg-center bg-cover rounded-lg mb-4" style={getImageStyle(item, 'image', i)}></div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-primary uppercase leading-tight">{item.badge}</p>
                      <h5 className="text-md font-bold text-slate-900 dark:text-white leading-snug">{item.name}</h5>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                    {item.url && (
                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                        <a className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary flex items-center gap-1" href={item.url}>
                          {item.buttonText || 'Fakülte Sayfası'} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        );
      }
      


      

      

      
      

      if (block.type === 'achievements_hero') {
        return (
          <section key={block.id} className="relative bg-[#00164f] text-white overflow-hidden min-h-[600px] flex items-center" style={block.image ? { backgroundImage: `linear-gradient(rgba(0, 22, 79, 0.7), rgba(0, 22, 79, 0.7)), url("${block.image}")`, backgroundSize: 'cover', backgroundPosition: 'center center' } : {}}>
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 gap-6 relative z-10 py-20 items-center w-full">
              <div className="space-y-6 text-center mx-auto">
                {block.badge && <span className="inline-block bg-[#3f68e4]/20 text-[#b6c4ff] px-4 py-1 rounded-full text-[12px] font-bold tracking-[0.05em]">{block.badge}</span>}
                <h1 className="font-bold text-4xl md:text-[48px] leading-tight tracking-[-0.02em]">
                  {block.titlePart1} {block.titlePart2 && <span style={{ color: block.titlePart2Color || '#D4AF37' }}>{block.titlePart2}</span>}
                </h1>
                {block.subtitle && <p className="text-lg md:text-[18px] text-[#dce1ff] max-w-xl mx-auto">{block.subtitle}</p>}
                
                {block.buttons && block.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-4 pt-4 justify-center">
                    {block.buttons.map((btn: any, i: number) => (
                      <a key={i} href={btn.url || '#'} style={{ backgroundColor: btn.bgColor || '#1d4eca', color: btn.textColor || '#ffffff' }} className="px-8 py-3 rounded-xl text-[14px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        {btn.label}
                        {btn.icon && (typeof btn.icon === "string" && btn.icon === btn.icon.toLowerCase() ? <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span> : <IconPreview data={btn.icon} className="w-[1.1em] h-[1.1em]" />)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === 'achievements_academic_bento') {
        return (
          <section key={block.id} className="py-20 bg-[#faf8ff]" style={getStyle(block, '')}>
            <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-16">
                <h2 className="font-bold text-[36px] text-[#1a1b23] mb-4">{block.title}</h2>
                <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(block.items || []).map((item: any, idx: number) => {
                  if (item.style === 'primary') {
                    return (
                      <div key={idx} className="bg-[#1d4eca] text-white rounded-3xl p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-2">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24 rotate-45"></div>
                        <div className="mb-6">
                          {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="text-[#D4AF37] w-10 h-10" /> : <span className="material-symbols-outlined text-[#D4AF37] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon || 'star'}</span>}
                        </div>
                        <h3 className="font-bold text-[24px] mb-2 text-white">{item.title}</h3>
                        <p className="text-[#dce1ff] mb-8">{item.desc}</p>
                        
                        {item.stats && item.stats.length > 0 && (
                          <div className="grid grid-cols-2 gap-4">
                            {item.stats.map((st: any, i: number) => (
                              <div key={i} className="bg-white/10 p-4 rounded-2xl">
                                <div className="text-2xl font-bold text-[#D4AF37]">{st.value}</div>
                                <div className="text-[10px] opacity-80 uppercase tracking-wider">{st.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.buttonText && (
                          <a href={item.url || '#'} className="mt-8 block w-full text-center py-3 bg-[#D4AF37] text-[#00164f] font-bold rounded-xl hover:bg-[#D4AF37]/90 transition-colors">
                            {item.buttonText}
                          </a>
                        )}
                      </div>
                    );
                  } else if (item.style === 'list') {
                    return (
                      <div key={idx} className="bg-white border border-[#e2e8f0] rounded-3xl p-8 flex flex-col justify-between transition-all duration-700 hover:-translate-y-2">
                        <div>
                          <div className="mb-6">
                            {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="text-[#1d4eca] w-10 h-10" /> : <span className="material-symbols-outlined text-[#1d4eca] text-4xl">{item.icon || 'analytics'}</span>}
                          </div>
                          <h3 className="font-bold text-[24px] mb-2">{item.title}</h3>
                          <p className="text-[#434654] mb-6">{item.desc}</p>
                        </div>
                        {item.listItems && item.listItems.length > 0 && (
                          <ul className="space-y-4">
                            {item.listItems.map((li: any, i: number) => (
                              <li key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-[#D4AF37] text-lg">check_circle</span>
                                </div>
                                <span className="text-[14px] font-semibold">{li}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="bg-white border border-[#e2e8f0] rounded-3xl p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="mb-6">
                          {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="text-[#1d4eca] w-10 h-10" /> : <span className="material-symbols-outlined text-[#1d4eca] text-4xl">{item.icon || 'school'}</span>}
                        </div>
                        <h3 className="font-bold text-[24px] mb-2">{item.title}</h3>
                        <p className="text-[#434654] mb-8">{item.desc}</p>
                        <div className="space-y-6">
                          {item.statValue && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-end gap-3">
                                <span className="text-4xl font-extrabold text-[#D4AF37]">{item.statValue}</span>
                                {item.statLabel && <span className="text-[14px] font-semibold text-[#434654] pb-1">{item.statLabel}</span>}
                              </div>
                              <div className="h-2 w-full bg-[#ededf8] rounded-full overflow-hidden">
                                <div className="h-full bg-[#D4AF37] w-[98%]"></div>
                              </div>
                            </div>
                          )}
                          {item.badge && <p className="text-[12px] font-bold tracking-[0.05em] text-[#1d4eca]">{item.badge}</p>}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === 'achievements_social_gallery') {
        return (
          <section key={block.id} className="py-20 bg-white" style={getStyle(block, '')}>
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div className="max-w-2xl">
                  <h2 className="font-bold text-[36px] text-[#1a1b23] mb-4">{block.title}</h2>
                  {block.subtitle && <p className="text-[18px] text-[#434654]">{block.subtitle}</p>}
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-full border border-[#e2e8f0] hover:bg-[#faf8ff] transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-3 rounded-full border border-[#e2e8f0] bg-[#1d4eca] text-white hover:opacity-90 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {(block.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
                      {item.image ? (
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.image} alt={item.title} />
                      ) : (
                        <div className="w-full h-full bg-slate-200"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white text-[12px] font-bold tracking-[0.05em]">{item.hoverText}</p>
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mb-1 text-slate-900">{item.title}</h4>
                    <p className="text-[#434654] text-[12px] font-bold tracking-[0.05em]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === 'achievements_science_projects') {
        return (
          <section key={block.id} className="py-20 bg-[#f3f2fd] overflow-hidden" style={getStyle(block, '')}>
            <div className="max-w-7xl mx-auto px-8">
              <div className="bg-[#0f172a] rounded-[40px] p-8 md:p-20 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1d4eca]/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px]"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div>
                    {block.badge && <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-1 rounded-full text-[12px] font-bold tracking-[0.05em] mb-6">{block.badge}</span>}
                    <h2 className="font-bold text-3xl md:text-[36px] mb-6 leading-tight">{block.title}</h2>
                    {block.subtitle && <p className="text-[#dce1ff] mb-10 text-lg">{block.subtitle}</p>}
                    
                    <div className="space-y-6">
                      {(block.items || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                          <div className="shrink-0 mt-1">
                            {(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className="text-[#D4AF37] w-8 h-8" /> : <span className="material-symbols-outlined text-[#D4AF37] text-3xl">{item.icon || 'science'}</span>}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                            <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative mt-10 md:mt-0">
                    {block.image && <img className="rounded-3xl shadow-2xl border border-white/10 w-full object-cover aspect-video" src={block.image} alt={block.title} />}
                    {block.imageBadge && (
                      <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-[#00164f] p-4 rounded-xl font-bold shadow-lg">
                        {block.imageBadge}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      return null;
    };

    if (block.isHidden && !onBlockClick) {
      return null;
    }

    return (
      <div 
        key={index}
        className={`${onBlockClick ? "relative group/block" : ""} ${block.isHidden ? "opacity-50 grayscale" : ""}`}
        onClick={(e) => { e.stopPropagation(); onBlockClick && onBlockClick(index, e); }}
      >
        {block.isHidden && onBlockClick && (
          <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-1 rounded z-50 shadow backdrop-blur-sm pointer-events-none">
            GİZLİ BÖLÜM
          </div>
        )}
        {renderContent()}
      </div>
    );
  };

  return (
    <>
      {blocks.map((block: any, index: number) => renderBlock(block, index))}
    </>
  );
};
