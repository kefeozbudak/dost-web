import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IconPreview } from './IconField';
import SmartLink from './SmartLink';

export default function Header({ data, announcement }: { data?: any; announcement?: any }) {
  const logoSrc = data?.logoUrl?.includes('lh3.googleusercontent.com') ? '/dost-logo-png.png' : (data?.logoUrl || '/dost-logo-png.png');
  
  const links = data?.links || [
    { label: 'Hakkımızda', url: '#' },
    { label: 'Akademik', url: '#' },
    { label: 'Kampüslerimiz', url: '#' }
  ];
  
  const ctaHidden = data?.ctaButton?.hidden === true;
  const ctaLabel = data?.ctaButton?.label || 'Ön Kayıt Formu';
  const ctaUrl = data?.ctaButton?.url || '#';
  
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedMega, setMobileExpandedMega] = useState<number | null>(null);

  const hoverColor = data?.hoverColor || '#f97316';
  const logoHeight = data?.logoHeight ? `${data.logoHeight}px` : '48px';

  const isAnnouncementActive = announcement?.announcementActive && announcement?.announcementText;
  
  return (
    <>
      <style>{`
        .custom-hover-color:hover, .group:hover .custom-hover-color {
          color: ${hoverColor} !important;
        }
        .custom-hover-bg:hover, .group:hover .custom-hover-bg {
          background-color: ${hoverColor} !important;
          color: white !important;
        }
      `}</style>
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar */}
      {isAnnouncementActive && (
        <div 
          className="w-full py-2.5 px-4 text-xs font-bold text-center flex flex-wrap items-center justify-center gap-2.5 md:gap-4 shadow-xs border-b border-white/10 relative transition-all"
          style={{ 
            backgroundColor: announcement.announcementBgColor || '#0a192f',
            color: announcement.announcementTextColor || '#ffffff'
          }}
        >
          <div className="flex items-center gap-2 max-w-4xl truncate">
            {announcement?.announcementIcon !== 'none' && announcement?.announcementIcon !== '' && (
              <span className="shrink-0 text-sm">{announcement?.announcementIcon ?? '📢'}</span>
            )}
            <span className="truncate">{announcement.announcementText}</span>
          </div>
          {announcement.announcementButtonText && (
            <a
              href={announcement.announcementButtonUrl || '#'}
              className="px-3 py-1 bg-white text-slate-900 rounded-md text-[11px] font-black hover:bg-slate-100 transition-all shrink-0 shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <span>{announcement.announcementButtonText}</span>
              <span className="text-[10px]">→</span>
            </a>
          )}
        </div>
      )}

      {/* Main Header Navigation Container */}
      <div className="bg-white/95 backdrop-header border-b border-border-subtle shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-desktop h-20 flex justify-between items-center w-full relative">
          <div className="flex items-center shrink-0">
            <Link className="block" to="/">
              <img alt="Dost Koleji Logo" className="w-auto object-contain" style={{ height: logoHeight }} src={logoSrc} />
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 h-full">
            {links.map((link: any, i: number) => (
               <div key={i} className="h-full flex items-center group/nav relative"
                    onMouseEnter={() => (link.type === 'mega' || link.type === 'dropdown') && setActiveMegaMenu(i)}
                    onMouseLeave={() => (link.type === 'mega' || link.type === 'dropdown') && setActiveMegaMenu(null)}>
                 <SmartLink 
                   className="nav-link-underline font-label-md text-label-md text-primary custom-hover-color transition-colors flex items-center gap-1.5" 
                   url={link.url}
                 >
                   {link.iconData?.position === 'left' || !link.iconData?.position ? (
                     <IconPreview data={link.iconData} className="w-5 h-5 shrink-0" />
                   ) : null}
                   {link.iconData?.position === 'top' ? (
                     <div className="flex flex-col items-center">
                       <IconPreview data={link.iconData} className="w-5 h-5 mb-1 shrink-0" />
                       {!link.iconData?.iconOnly && link.label}
                     </div>
                   ) : (
                     !link.iconData?.iconOnly && <span>{link.label}</span>
                   )}
                   {link.iconData?.position === 'right' ? (
                     <IconPreview data={link.iconData} className="w-5 h-5 shrink-0" />
                   ) : null}
                   {(link.type === 'mega' || link.type === 'dropdown') && <span className="material-symbols-outlined text-sm">expand_more</span>}
                 </SmartLink>
                 
                 {link.type === 'mega' && activeMegaMenu === i && (
                    <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-screen max-w-[1200px] bg-white border border-border-subtle shadow-2xl rounded-b-2xl overflow-hidden transition-all duration-300 opacity-100 visible">
                      <div className="flex p-8 gap-8">
                         <div className="flex-1 grid grid-cols-3 gap-8">
                            {link.megaMenu?.columns?.map((col: any, colIdx: number) => (
                               <div key={colIdx}>
                                  <h4 className="font-bold text-sm text-primary tracking-wider mb-4 border-b border-border-subtle pb-2">{col.title}</h4>
                                  <ul className="space-y-3">
                                     {col.links?.map((clink: any, clinkIdx: number) => (
                                        <li key={clinkIdx}>
                                           <a href={clink.url} className="group flex items-start gap-3">
                                              {clink.icon && (
                                                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-custom-hover-bg group-hover:text-white transition-colors">
                                                  <span className="material-symbols-outlined text-lg">{clink.icon}</span>
                                                </div>
                                              )}
                                              <div>
                                                <div className="text-sm font-bold text-primary group-custom-hover-color transition-colors">{clink.label}</div>
                                                {clink.desc && <div className="text-xs text-text-muted mt-0.5">{clink.desc}</div>}
                                              </div>
                                           </a>
                                        </li>
                                     ))}
                                  </ul>
                               </div>
                            ))}
                         </div>
                         
                         {link.megaMenu?.featured && link.megaMenu.featured.title && (
                           <div className="w-80 shrink-0 bg-surface-container rounded-xl overflow-hidden relative group">
                              {link.megaMenu.featured.image && (
                                 <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" style={{backgroundImage: `url('${link.megaMenu.featured.image}')`}}></div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                              <div className="relative h-full p-6 flex flex-col justify-end text-white min-h-[300px]">
                                 <h4 className="text-xl font-bold mb-2">{link.megaMenu.featured.title}</h4>
                                 <p className="text-sm text-white/80 mb-4">{link.megaMenu.featured.desc}</p>
                                 <a href={link.megaMenu.featured.url || '#'} className="self-start text-sm font-bold bg-primary px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors">
                                   {link.megaMenu.featured.buttonText || 'Keşfet'}
                                 </a>
                              </div>
                           </div>
                         )}
                      </div>
                    </div>
                 )}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center gap-4 md:gap-6">
            {ctaLabel && !ctaHidden && (
              <SmartLink className="hidden sm:flex items-center bg-primary text-white font-label-md text-label-md px-6 py-3 rounded-lg custom-hover-bg/90 hover:shadow-lg active:scale-95 transition-all" url={ctaUrl}>
                {ctaLabel}
              </SmartLink>
            )}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-primary">
              <span className="material-symbols-outlined text-[32px]">menu</span>
            </button>
          </div>
        </div>
      </div>
    
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)}></div>
      
      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[320px] bg-white z-[70] lg:hidden flex flex-col shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-border-subtle shrink-0">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img alt="Logo" className="w-auto object-contain" style={{ height: `calc(${logoHeight} * 0.7)` }} src={logoSrc} />
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-2">
            {links.map((link: any, i: number) => (
              <div key={i} className="flex flex-col border-b border-border-subtle/50 pb-2 mb-2 last:border-0">
                <div className="flex justify-between items-center w-full p-2">
                  <a 
                    href={link.url || '#'} 
                    onClick={() => link.type !== 'mega' && link.type !== 'dropdown' && setMobileMenuOpen(false)}
                    className="text-primary font-bold flex-1 flex items-center gap-2"
                  >
                    {link.iconData && <IconPreview data={link.iconData} className="w-5 h-5 shrink-0" />}
                    {!link.iconData?.iconOnly && link.label}
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
                          <h5 className="text-xs font-bold text-text-muted tracking-wider mb-2">{col.title}</h5>
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
          </nav>
        </div>
        
        {ctaLabel && !ctaHidden && (
          <div className="p-6 border-t border-border-subtle shrink-0">
            <a 
              href={ctaUrl} 
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center w-full bg-primary text-white font-bold px-6 py-3 rounded-lg active:scale-95 transition-all"
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>

    </header>
    </>
  );
}

