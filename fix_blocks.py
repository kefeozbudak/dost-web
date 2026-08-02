with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

new_blocks = """
        case 'news_hero':
          return (
            <section key={index} className={`relative pt-32 pb-20 overflow-hidden ${block.fullWidth ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10"></div>
                <div className="w-full h-full" style={getImageStyle(block, 'image')}></div>
              </div>
              <div className={`relative z-20 px-margin-mobile md:px-margin-desktop ${block.fullWidth ? 'max-w-container-max mx-auto' : 'w-full'}`}>
                <div className="max-w-2xl text-on-primary">
                  {block.title && <h1 style={getTitleStyle(block)} className="font-display-lg text-[36px] md:text-display-lg mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.title }}></h1>}
                  {block.subtitle && <p style={getSubtitleStyle(block)} className="font-body-lg text-base md:text-body-lg opacity-90 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.subtitle }}></p>}
                </div>
              </div>
            </section>
          );

        case 'news_grid':
          return (
            <div key={index} className={block.fullWidth ? 'w-full' : 'max-w-container-max mx-auto'}>
              <section className="bg-surface-container-lowest sticky top-20 z-40 border-b border-border-subtle" style={getStyle(block, 'filterContainer')}>
                <div className={`px-margin-mobile md:px-margin-desktop ${block.fullWidth ? 'max-w-container-max mx-auto' : 'w-full'}`}>
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
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-gutter ${block.fullWidth ? 'max-w-container-max mx-auto' : 'w-full'}`}>
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
                        {item.title && <h3 style={getItemTitleStyle(block)} className="font-headline-md text-xl md:text-headline-md mb-3 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>}
                        {item.desc && <p style={getItemDescStyle(block)} className="font-body-md text-sm md:text-body-md text-on-surface-variant mb-6 line-clamp-3">{item.desc}</p>}
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
            <section key={index} className={`py-12 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-primary-container/10 ${block.fullWidth ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={`max-w-4xl mx-auto text-center ${block.fullWidth ? 'max-w-container-max mx-auto' : 'w-full'}`}>
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
"""

marker = "      switch (block.type) {\n"
idx = code.find(marker)
if idx != -1:
    new_code = code[:idx + len(marker)] + new_blocks + code[idx + len(marker):]
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(new_code)
    print("Success: PageBlocks.tsx modified")
else:
    print("Error: marker not found")

