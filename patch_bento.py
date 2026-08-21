with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """                  return (
                    <div
                      key={i}
                      className={`${cols} group relative overflow-hidden rounded-3xl h-[400px] border border-border-subtle hover:border-primary transition-all duration-500 shadow-sm`}
                      style={baseStyle}
                    >
                      {item.image && (
                        <img
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 whitespace-normal md:whitespace-pre-line"
                          src={item.image}
                          alt=""
                          style={getImageStyle(item, "image", i)}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex flex-col justify-end p-8 whitespace-normal md:whitespace-pre-line">
                        <h3
                          className="font-headline-md text-headline-md text-white mb-2 whitespace-normal md:whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.title}
                        </h3>
                        {item.desc && (
                          <p
                            className="text-white/80 font-body-md whitespace-normal md:whitespace-pre-line"
                            style={getCardDescStyle(item, block)}
                          >
                            {item.subtitle || item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );"""

new_target = """                  const cardContent = (
                    <>
                      {item.image && (
                        <img
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 whitespace-normal md:whitespace-pre-line"
                          src={item.image}
                          alt=""
                          style={getImageStyle(item, "image", i)}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex flex-col justify-end p-8 whitespace-normal md:whitespace-pre-line">
                        <h3
                          className="font-headline-md text-headline-md text-white mb-2 whitespace-normal md:whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.title}
                        </h3>
                        {(item.desc || item.subtitle) && (
                          <p
                            className="text-white/80 font-body-md whitespace-normal md:whitespace-pre-line"
                            style={getCardDescStyle(item, block)}
                          >
                            {item.subtitle || item.desc}
                          </p>
                        )}
                      </div>
                    </>
                  );

                  return item.url ? (
                    <SmartLink
                      key={i}
                      url={item.url}
                      className={`${cols} group relative overflow-hidden rounded-3xl h-[400px] border border-border-subtle hover:border-primary transition-all duration-500 shadow-sm block cursor-pointer`}
                      style={baseStyle}
                    >
                      {cardContent}
                    </SmartLink>
                  ) : (
                    <div
                      key={i}
                      className={`${cols} group relative overflow-hidden rounded-3xl h-[400px] border border-border-subtle hover:border-primary transition-all duration-500 shadow-sm`}
                      style={baseStyle}
                    >
                      {cardContent}
                    </div>
                  );"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched campus_bento successfully")
else:
    print("Could not find target block in PageBlocks.tsx")

