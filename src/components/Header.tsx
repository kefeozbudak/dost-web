import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IconPreview } from './IconField';
import SmartLink from './SmartLink';

export default function Header({ data, announcement }: { data?: any; announcement?: any }) {
  const logoSrc = data?.logoUrl?.includes('lh3.googleusercontent.com') ? '/dost-logo-png.png' : (data?.logoUrl || '/dost-logo-png.png');
  
  const links = data?.links || [
    { label: 'Hakkımızda', url: '/hakkimizda' },
    { label: 'Eğitim Sistemimiz', url: '/egitim-sistemimiz' },
    { label: 'Başarılarımız', url: '/basarilarimiz' },
    { label: 'Duyurular', url: '/duyurular' },
    { label: 'İş Başvurusu', url: '/is-basvurusu' },
    { label: 'Kulüp Kayıt', url: '/kulup-kayit-formu' }
  ];
  
  const ctaHidden = data?.ctaButton?.hidden === true;
  const ctaLabel = data?.ctaButton?.label || 'Ön Kayıt Formu';
  const ctaUrl = data?.ctaButton?.url || '#';
  
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedMega, setMobileExpandedMega] = useState<number | null>(null);

  const normalColor = data?.menuColors?.normal || '#475569';
  const hoverColor = data?.menuColors?.hover || data?.hoverColor || '#f97316';
  const activeColor = data?.menuColors?.active || '#1d4ed8';
  
  const logoHeight = data?.logoHeight ? `${data.logoHeight}px` : '48px';

  const isAnnouncementActive = announcement?.announcementActive && announcement?.announcementText;
  
  const location = useLocation();

  const isLinkActive = (url: string) => {
    if (!url || url === '#') return false;
    let internalPath = url;
    if (!internalPath.startsWith('/')) {
      internalPath = '/' + internalPath;
    }
    return location.pathname === internalPath;
  };
  
  return (
    <>
      <style>{`
        .nav-link-normal {
          color: ${normalColor} !important;
        }
        .nav-link-normal:hover, .custom-hover-color:hover, .group:hover .custom-hover-color, .group:hover .group-custom-hover-color {
          color: ${hoverColor} !important;
        }
        .nav-link-active {
          color: ${activeColor} !important;
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
                   className={`nav-link-underline ${data?.menuTypography?.topMenuFontSize || 'text-sm'} ${data?.menuTypography?.topMenuFontWeight || 'font-bold'} transition-colors flex items-center gap-1.5 ${isLinkActive(link.url) ? 'nav-link-active' : 'nav-link-normal custom-hover-color'}`}
                   url={link.url}
                 >
                   {link.iconData?.position === 'left' || !link.iconData?.position ? (
                     <IconPreview data={link.iconData} className="w-5 h-5 shrink-0" />
                   ) : null}
                   {link.iconData?.position === 'top' ? (
                     <div className="flex flex-col items-center">
                       <IconPreview data={link.iconData} className="w-5 h-5 mb-1 shrink-0" />
                       {!link.iconData?.iconOnly && <span>{link.label}</span>}
                     </div>
                   ) : (
                     !link.iconData?.iconOnly && <span>{link.label}</span>
                   )}
                   {link.iconData?.position === 'right' ? (
                     <IconPreview data={link.iconData} className="w-5 h-5 shrink-0" />
                   ) : null}
                   {(link.type === 'mega' || link.type === 'dropdown') && <span className="material-symbols-outlined text-sm" translate="no" aria-hidden="true">expand_more</span>}
                 </SmartLink>
                 
                 {link.type === 'mega' && activeMegaMenu === i && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-[1200px] bg-white border border-border-subtle shadow-2xl rounded-b-2xl overflow-hidden transition-all duration-300 opacity-100 visible">
                      <div className="flex p-8 gap-8">
                         <div className="flex-1 grid grid-cols-3 gap-8">
                            {link.megaMenu?.columns?.map((col: any, colIdx: number) => (
                               <div key={colIdx} className="flex flex-col">
                                  <h4 className="font-bold text-sm text-primary tracking-wider mb-4 border-b border-border-subtle pb-2">{col.title}</h4>
                                  <div className={`flex flex-1 ${col.imagePosition === 'left' ? 'flex-row' : col.imagePosition === 'right' ? 'flex-row-reverse' : col.imagePosition === 'bottom' ? 'flex-col' : 'flex-col-reverse'} gap-4`}>
                                    <ul className="space-y-3 flex-1">
                                       {col.links?.map((clink: any, clinkIdx: number) => (
                                          <li key={clinkIdx}>
                                             <SmartLink url={clink.url} className="group flex items-start gap-3">
                                                {clink.icon && (
                                                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-custom-hover-bg group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined text-lg" translate="no" aria-hidden="true">{clink.icon}</span>
                                                  </div>
                                                )}
                                                <div>
                                                  <div className={`${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} transition-colors ${isLinkActive(clink.url) ? 'nav-link-active' : 'nav-link-normal group-custom-hover-color'}`}><span>{clink.label}</span></div>
                                                  {clink.desc && <div className="text-xs text-text-muted mt-0.5">{clink.desc}</div>}
                                                </div>
                                             </SmartLink>
                                          </li>
                                       ))}
                                    </ul>
                                    {col.image && (
                                      <div className="relative overflow-hidden rounded-lg bg-slate-50 border border-border-subtle shrink-0" style={{ 
                                        width: col.imageWidth ? `${col.imageWidth}px` : ((col.imagePosition === 'left' || col.imagePosition === 'right') ? '120px' : '100%'), 
                                        height: col.imageHeight ? `${col.imageHeight}px` : ((col.imagePosition === 'top' || col.imagePosition === 'bottom') ? '120px' : 'auto'), 
                                        minHeight: '100px' 
                                      }}>
                                        <img src={col.image} alt="" className="absolute max-w-none" style={{
                                          width: `${col.imageScale || 100}%`,
                                          left: `${col.imageX || 0}px`,
                                          top: `${col.imageY || 0}px`,
                                        }} />
                                      </div>
                                    )}
                                  </div>
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
                                 <SmartLink url={link.megaMenu.featured.url || '#'} className={`self-start ${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} bg-primary px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors`}>
                                   {link.megaMenu.featured.buttonText || 'Keşfet'}
                                 </SmartLink>
                              </div>
                           </div>
                         )}
                      </div>
                    </div>
                 )}
                 {link.type === 'dropdown' && activeMegaMenu === i && (
                    <div className="absolute top-full left-0 pt-4 opacity-100 visible z-50">
                       <div className="min-w-[240px] bg-white border border-border-subtle shadow-xl rounded-xl py-3">
                         <ul className="flex flex-col">
                            {link.subLinks?.map((sublink: any, subIdx: number) => (
                               <li key={subIdx}>
                                  <SmartLink url={sublink.url || '#'} className={`px-5 py-2.5 flex items-center gap-3 ${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} transition-colors outline-none focus:outline-none ${isLinkActive(sublink.url) ? 'nav-link-active' : 'nav-link-normal hover:bg-slate-50 custom-hover-color'}`}>
                                     <span>{sublink.label}</span>
                                  </SmartLink>
                               </li>
                            ))}
                         </ul>
                       </div>
                    </div>
                 )}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center gap-4 md:gap-6">
            {ctaLabel && !ctaHidden && (
              <SmartLink className={`hidden sm:flex items-center bg-primary text-white ${data?.menuTypography?.topMenuFontSize || 'text-sm'} ${data?.menuTypography?.topMenuFontWeight || 'font-bold'} px-6 py-3 rounded-lg custom-hover-bg/90 hover:shadow-lg active:scale-95 transition-all`} url={ctaUrl}>
                <span>{ctaLabel}</span>
              </SmartLink>
            )}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-primary">
              <span className="material-symbols-outlined text-[32px]" translate="no" aria-hidden="true">menu</span>
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
            <span className="material-symbols-outlined" translate="no" aria-hidden="true">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-2">
            {links.map((link: any, i: number) => (
              <div key={i} className="flex flex-col border-b border-border-subtle/50 pb-2 mb-2 last:border-0">
                <div className="flex justify-between items-center w-full p-2">
                  <SmartLink 
                    url={link.url || '#'} 
                    onClick={() => link.type !== 'mega' && link.type !== 'dropdown' && setMobileMenuOpen(false)}
                    className={`flex-1 flex items-center gap-2 ${data?.menuTypography?.topMenuFontSize || 'text-base'} ${data?.menuTypography?.topMenuFontWeight || 'font-bold'} ${isLinkActive(link.url) ? 'nav-link-active' : 'nav-link-normal custom-hover-color'}`}
                  >
                    {link.iconData && <IconPreview data={link.iconData} className="w-5 h-5 shrink-0" />}
                    {!link.iconData?.iconOnly && <span>{link.label}</span>}
                  </SmartLink>
                  {(link.type === 'mega' || link.type === 'dropdown') && (
                    <button 
                      onClick={(e) => {
                         e.preventDefault();
                         setMobileExpandedMega(mobileExpandedMega === i ? null : i);
                      }} 
                      className="p-1 rounded bg-surface-container text-primary ml-2"
                    >
                      <span className={`material-symbols-outlined transition-transform duration-300 ${mobileExpandedMega === i ? 'rotate-180' : ''}`} translate="no" aria-hidden="true">
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
                          <SmartLink url={sublink.url || '#'} onClick={() => setMobileMenuOpen(false)} className={`${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} block ${isLinkActive(sublink.url) ? 'nav-link-active' : 'nav-link-normal custom-hover-color'}`}>
                            <span>{sublink.label}</span>
                          </SmartLink>
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
                                <SmartLink 
                                  url={clink.url} 
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center gap-2 text-sm py-1 ${isLinkActive(clink.url) ? 'nav-link-active' : 'nav-link-normal custom-hover-color'}`}
                                >
                                  {clink.icon && <span className="material-symbols-outlined text-[16px] text-secondary" translate="no" aria-hidden="true">{clink.icon}</span>}
                                  <span>{clink.label}</span>
                                </SmartLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      
                      {link.megaMenu?.featured?.title && (
                        <SmartLink 
                          url={link.megaMenu.featured.url || '#'} 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block mt-4 p-3 rounded-lg bg-surface-container border border-border-subtle"
                        >
                          <div className={`${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} text-primary mb-1`}>{link.megaMenu.featured.title}</div>
                          <div className="text-xs text-text-muted mb-2">{link.megaMenu.featured.desc}</div>
                          <div className="text-xs font-bold text-secondary">{link.megaMenu.featured.buttonText || 'İncele'}</div>
                        </SmartLink>
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
            <SmartLink 
              url={ctaUrl} 
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center w-full bg-primary text-white font-bold px-6 py-3 rounded-lg active:scale-95 transition-all"
            >
              <span>{ctaLabel}</span>
            </SmartLink>
          </div>
        )}
      </div>

    </header>
    </>
  );
}

