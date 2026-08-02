import sys

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

video_block = """        case 'video':
          return (
            <section key={index} className={`py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden ${block.fullWidth ? 'w-full' : 'max-w-container-max mx-auto rounded-3xl'}`} style={getStyle(block, '')}>
              <div className={block.fullWidth ? "max-w-container-max mx-auto relative z-10" : "relative z-10"}>
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
"""

if "case 'video':" not in code:
    code = code.replace("case 'stats':", video_block + "\n        case 'stats':")
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Added video block")
else:
    print("Video block already exists")
