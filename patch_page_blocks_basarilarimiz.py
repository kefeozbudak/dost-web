import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

basarilarimiz_blocks = """
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
          <section key={block.id} className="py-20 bg-[#faf8ff]">
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
          <section key={block.id} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div className="max-w-2xl">
                  <h2 className="font-bold text-[36px] text-[#1a1b23] mb-4">{block.title}</h2>
                  {block.subtitle && <p className="text-[18px] text-[#434654]">{block.subtitle}</p>}
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
          <section key={block.id} className="py-20 bg-[#f3f2fd] overflow-hidden">
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
"""

code = code.replace("return null;", basarilarimiz_blocks + "\n      return null;")

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

print("Added basarilarimiz blocks to PageBlocks.tsx")
