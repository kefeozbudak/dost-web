import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

new_akademik = """
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
                        <span className="material-symbols-outlined text-[20px]" style={{ color: 'inherit' }}>{item.icon || 'school'}</span>
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
                        <h3 className="text-lg font-bold mb-1" style={{ color: item.itemTitleColor || '#ffffff' }}>{item.title}</h3>
                        <p className="text-sm font-medium italic mb-3" style={{ color: item.itemDescColor || '#1d4eca' }}>{item.subtitle}</p>
                        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: item.itemTextColor || '#9ca3af' }} dangerouslySetInnerHTML={{__html: item.desc || ""}}></p>
                        
                        {item.url && (
                          <div className="flex items-center justify-between border-t border-[#f0f2f4] dark:border-[#2d333d] pt-4">
                            <div className="flex gap-3"></div>
                            <a href={item.url} className="text-xs font-bold hover:underline" style={{ color: item.buttonTextColor || '#1d4eca' }}>{item.buttonText || 'Profili Görüntüle'}</a>
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
"""

pattern = r"      case 'akademik_kadro':\s*return \(\s*<div key=\{index\} className=\"max-w-\[1440px\][\s\S]*?\{/\* Faculty Grid \*/\}[\s\S]*?<\/div>\s*<\/div>\s*\);\s*"

new_code = re.sub(pattern, new_akademik, code)

if new_code == code:
    print("No change made. Regex might be wrong.")
else:
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(new_code)
    print("Updated PageBlocks.tsx successfully.")

