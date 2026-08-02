import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

new_block_code = """
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
"""

# Insert before 'default:'
code = code.replace('        default:', new_block_code + '\n        default:')

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

print("Updated PageBlocks.tsx with academic_hero")
