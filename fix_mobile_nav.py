import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

target = r'<nav className="flex flex-col gap-2">.*?</nav>'

replacement = """<nav className="flex flex-col gap-2">
            {links.map((link: any, i: number) => (
              <div key={i} className="flex flex-col border-b border-border-subtle/50 pb-2 mb-2 last:border-0">
                <div className="flex justify-between items-center w-full p-2">
                  <a 
                    href={link.url || '#'} 
                    onClick={() => link.type !== 'mega' && link.type !== 'dropdown' && setMobileMenuOpen(false)}
                    className="text-primary font-bold flex-1"
                  >
                    {link.label}
                  </a>
                  {(link.type === 'mega' || link.type === 'dropdown') && (
                    <button 
                      onClick={(e) => {
                         e.preventDefault();
                         setMobileExpandedMega(mobileExpandedMega === i ? null : i);
                      }} 
                      className="p-1 rounded bg-surface-container text-primary ml-2"
                    >
                      <span className={`material-symbols-outlined transition-transform duration-300 ${mobileExpandedMega === i ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                  )}
                </div>
                
                {link.type === 'dropdown' && (
                  <div className={`overflow-hidden transition-all duration-300 ${mobileExpandedMega === i ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <ul className="pl-4 space-y-3 pb-2 border-l-2 border-border-subtle ml-2">
                      {link.subLinks?.map((sublink: any, subIdx: number) => (
                        <li key={subIdx}>
                          <a href={sublink.url || '#'} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-primary custom-hover-color block">
                            {sublink.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {link.type === 'mega' && (
                  <div className={`overflow-hidden transition-all duration-300 ${mobileExpandedMega === i ? 'max-h-[1500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 pr-2 space-y-4 pb-4">
                      {link.megaMenu?.columns?.map((col: any, colIdx: number) => (
                        <div key={colIdx}>
                          <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{col.title}</h5>
                          <ul className="space-y-2">
                            {col.links?.map((clink: any, clinkIdx: number) => (
                              <li key={clinkIdx}>
                                <a 
                                  href={clink.url} 
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-2 text-sm text-primary custom-hover-color py-1"
                                >
                                  {clink.icon && <span className="material-symbols-outlined text-[16px] text-secondary">{clink.icon}</span>}
                                  {clink.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      
                      {link.megaMenu?.featured?.title && (
                        <a 
                          href={link.megaMenu.featured.url || '#'} 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block mt-4 p-3 rounded-lg bg-surface-container border border-border-subtle"
                        >
                          <div className="text-sm font-bold text-primary mb-1">{link.megaMenu.featured.title}</div>
                          <div className="text-xs text-text-muted mb-2">{link.megaMenu.featured.desc}</div>
                          <div className="text-xs font-bold text-secondary">{link.megaMenu.featured.buttonText || 'İncele'}</div>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
