const fs = require('fs');

let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const heroCaseRegex = /(case 'hero':\s*return \(\s*<section key=\{index\} className=\{`relative flex flex-col justify-center items-center pt-8 pb-8 md:pt-12 md:pb-10 px-margin-mobile md:px-margin-desktop bg-\[#f8f9fa\] overflow-hidden \$\{block\.fullWidth \? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'\}`\}>\s*)([\s\S]*?)(\s*<\/section>\s*\);)/;

const match = code.match(heroCaseRegex);

if (match) {
    const innerContent = match[2];
    
    // We need to carefully wrap the three parts.
    // The three parts are:
    // 1. Text div
    // 2. {/* Campus Bento Grid */} to end of that IIFE
    // 3. {block.buttons && ... }

    // Let's replace the innerContent with variables that evaluate them, and then reorder them.
    const newInner = `
              <div className="w-full flex flex-col gap-6 md:gap-10">
                {(() => {
                  const layoutOrder = block.layoutOrder || 'text_images_buttons';
                  
                  const textContent = (
                    <div className={\`\${block.fullWidth ? "max-w-container-max mx-auto" : "w-full"} text-center relative z-10\`}>
                      {block.badge && (
                        <span style={getBadgeStyle(block)} className="inline-block py-1.5 px-6 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold mb-4 tracking-widest">
                          {block.badge}
                        </span>
                      )}
                      {block.titlePart1 || block.titlePart2 ? (
                        <h1 style={getTitleStyle(block)} className="text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-4 max-w-4xl mx-auto leading-tight whitespace-pre-wrap">
                          {block.titlePart1 && <span style={getTitlePart1Style(block)}>{block.titlePart1}</span>}
                          {' '}
                          {block.titlePart2 && <span style={getTitlePart2Style(block)}>{block.titlePart2}</span>}
                        </h1>
                      ) : (
                        <h1 style={getTitleStyle(block)} className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#232b38] mb-4 max-w-4xl mx-auto leading-tight whitespace-pre-line" dangerouslySetInnerHTML={{__html: block.title || ""}}></h1>
                      )}
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
                          <a key={i} href={btn.url || '#'} className={\`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all \${!isCustomColors ? defaultClasses : 'hover:opacity-90 hover:shadow-lg'}\`}
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
                            {btn.icon && <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span>}
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
`;
    
    code = code.replace(heroCaseRegex, match[1] + newInner + match[3]);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("Updated PageBlocks.tsx!");
} else {
    console.log("Regex not found!");
}
