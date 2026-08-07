with open('src/components/PageBlocks.tsx', 'r') as f:
    c = f.read()

target = '''        case "social_media":
          const validItems = (block.items || []).filter((item: any) => item.icon || item.url);
          if (validItems.length === 0 && !block.title && !block.subtitle) return null;
          
          return (
            <section
              key={index}
              className={`py-8 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
              style={getStyle(block, "container")}
            >
              <div className={`${block.styles?.textAlign ? "" : "text-center"}`}>
                {(block.title || block.subtitle) && (
                  <div className="mb-6">
                    {block.title && <h2 className="font-headline-sm text-headline-sm mb-2" style={getTitleStyle(block)}>{block.title}</h2>}
                    {block.subtitle && <p className="font-body-md text-text-muted" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
                  </div>
                )}
                <div className={`flex flex-wrap gap-4 ${block.styles?.textAlign === 'left' ? '' : block.styles?.textAlign === 'right' ? 'justify-end' : 'justify-center'}`}>
                  {validItems.map((item: any, i: number) => (
                    <a
                      key={i}
                      href={item.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:-translate-y-1 transition-all duration-300"
                      style={{
                        backgroundColor: item.bgColor || block.styles?.itemContainerBackgroundColor || '#f1f5f9',
                        color: item.textColor || block.styles?.itemTitleColor || '#64748b'
                      }}
                    >
                      {item.icon && <IconPreview data={item.icon} className="w-6 h-6" />}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          );'''

if target in c:
    print("Found target")
    c = c.replace(target, target + '''\n        default:\n          console.log("Unknown block type:", block.type);\n          return <div className="p-4 border border-red-500 m-4 bg-red-100 text-red-700">Unknown block type: {block.type}</div>;''')
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(c)
else:
    print("Target not found")
