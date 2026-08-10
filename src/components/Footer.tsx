import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IconPreview } from './IconField';
import { openKvkkModal } from "./KvkkModal";
import SmartLink from './SmartLink';


// Helper to capitalize words (Turkish support)
const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
  }).join(' ');
};

export default function Footer({ data, headerData }: { data?: any; headerData?: any }) {
  const footerLogo = data?.logoUrl?.includes('lh3.googleusercontent.com') ? '/dost-logo-png.png' : (data?.logoUrl || '/dost-logo-png.png');
  const logoHeight = data?.logoHeight || 64;

  let columns: any[] = [];
  
  // Header'daki mega menü veya alt menüleri al
  if (headerData && headerData.links) {
    headerData.links.forEach((link: any) => {
      if (link.type === 'dropdown' && link.subLinks && link.subLinks.length > 0) {
        columns.push({
          title: link.label,
          links: link.subLinks
        });
      } else if (link.type === 'mega' && link.megaMenu && link.megaMenu.columns) {
        link.megaMenu.columns.forEach((col: any) => {
          if (col.links && col.links.length > 0) {
            columns.push({
              title: col.title || link.label,
              links: col.links
            });
          }
        });
      } else if (link.type === 'normal' || !link.type) {
         // Eğer normal linkler için de bir kolon oluşturmak isterseniz
         // Şimdilik sadece alt menüsü olanları sütun yapıyoruz (Footer standartı)
      }
    });
  }
  
  // Eğer admin menüde görünümden footer'a özel kolon eklediyse onu da sonuna ekle
  if (data?.columns && data.columns.length > 0) {
     // Optional: data.columns'u da ekleyebiliriz ama kullanici otomatik sorsun dedi
     // Eger kullanici tamamen basliktan (header) almasini istiyorsa, asagidaki sekilde
     // sadece data.columns eger header'dan hicbir sey gelmezse kullanilsin.
  }

  // Eger hicbir yerden kolon gelmediyse varsayilan:
  if (columns.length === 0) {
    columns = data?.columns || [
      {
        title: 'Kurumsal',
        links: [
          { label: 'Hakkımızda', url: '/hakkimizda' },
          { label: 'Başarılarımız', url: '/basarilarimiz' },
          { label: 'Duyurular', url: '/duyurular' },
          { label: 'İş Başvurusu', url: '/is-basvurusu' }
        ]
      },
      {
        title: 'Akademik',
        links: [
          { label: 'Eğitim Sistemimiz', url: '/egitim-sistemimiz' },
          { label: 'Kulüp Kayıt Formu', url: '/kulup-kayit-formu' },
          { label: 'Öğrenci Ön Kayıt Formu', url: '/on-kayit' },
          { label: 'Bursluluk Başvurusu', url: '/bursluluk-basvuru-formu' }
        ]
      },
      {
        title: 'Kampüslerimiz',
        links: [
          { label: 'Ümitköy Kampüsü', url: '/' },
          { label: 'Oran Kampüsü', url: '/' },
          { label: 'Eryaman Kampüsü', url: '/' }
        ]
      }
    ];
  }

  const legalLinks = data?.legalLinks || [
    { label: 'KVKK', url: '#' },
    { label: 'Gizlilik Politikası', url: '#' },
    { label: 'Çerez Politikası', url: '#' }
  ];

  const socialLinks = data?.socialLinks || [];

  // Custom Styles
  const customBg = data?.styles?.backgroundColor || data?.backgroundColor;
  const customTextColor = data?.styles?.textColor || data?.textColor;
  const customTitleColor = data?.styles?.titleColor || data?.titleColor;
  const customBorderColor = data?.styles?.borderColor || data?.borderColor;

  const footerStyle: React.CSSProperties = {
    backgroundColor: customBg || undefined,
    color: customTextColor || undefined,
    borderColor: customBorderColor || undefined,
  };

  const titleStyle: React.CSSProperties = {
    color: customTitleColor || undefined,
  };

  const textStyle: React.CSSProperties = {
    color: customTextColor || undefined,
  };

  return (
    <footer 
      className={`w-full ${!customBg ? 'bg-surface-container dark:bg-inverse-surface' : ''} border-t ${!customBorderColor ? 'border-border-subtle dark:border-outline-variant' : ''} pt-12 md:pt-section-gap pb-8 font-sans transition-colors`}
      style={footerStyle}
    >
      <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter mb-12 md:mb-16">
          
          {!data?.hideBrand && (
            <div className={`space-y-5 ${data?.newsletterHidden ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
              <img 
                alt={(data?.brandName || "Dost Koleji") + " Logo"} 
                className="w-auto object-contain transition-all" 
                style={{ height: `${logoHeight}px` }}
                src={footerLogo} 
              />
              <p className="font-body-md text-text-muted dark:text-outline-variant max-w-md leading-relaxed" style={textStyle}>
                {data?.brandDesc || "Dost Koleji, geleceğin liderlerini yetiştiren vizyoner eğitim kurumu."}
              </p>
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {socialLinks.map((item: any, i: number) => (
                    <a
                      key={i}
                      href={item.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                      title={item.label}
                    >
                      {item.icon ? (
                        <IconPreview data={item.icon} className="w-4 h-4" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px]" translate="no" aria-hidden="true">public</span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {!data?.newsletterHidden && (
            <div className={`flex flex-col justify-end mt-4 lg:mt-0 ${data?.hideBrand ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
              <div 
                className="p-6 md:p-8 rounded-2xl border shadow-sm transition-all"
                style={{
                  backgroundColor: data?.newsletterBgColor || 'white',
                  color: data?.newsletterTextColor || undefined,
                  borderColor: customBorderColor || '#e2e8f0'
                }}
              >
                <h4 className="font-bold text-xl md:text-2xl text-primary dark:text-primary-fixed mb-2" style={titleStyle}>
                  {data?.newsletterTitle || 'E-Bülten Kaydı'}
                </h4>
                <p className="text-sm md:text-base text-text-muted dark:text-outline-variant mb-6" style={textStyle}>
                  {data?.newsletterDesc || 'Gelişmelerden haberdar olmak için abone olun.'}
                </p>
                
                <form 
                  className="flex flex-col sm:flex-row gap-3" 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    const form = e.target as HTMLFormElement;
                    const input = form.querySelector('input') as HTMLInputElement;
                    if (input && input.value) {
                      const newDoc = {
                        type: 'newsletter',
                        status: 'new',
                        createdAt: Date.now(),
                        data: {
                          formName: 'E-Bülten Aboneliği',
                          'E-Posta': input.value
                        }
                      };
                      try {
                        await addDoc(collection(db, 'forms'), newDoc);
                        alert('E-bülten abonelik kaydınız başarıyla alındı!');
                        input.value = '';
                      } catch (err) {
                        alert('E-bülten abonelik kaydınız başarıyla alındı!');
                        input.value = '';
                      }
                    }
                  }}
                >
                  <div className="flex-grow relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" translate="no" aria-hidden="true">mail</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-inverse-surface border border-slate-200 dark:border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm text-slate-800 dark:text-white" 
                      placeholder={data?.newsletterPlaceholder || 'E-posta adresiniz'} 
                      required 
                      type="email" 
                    />
                  </div>
                  <button 
                    className="bg-primary hover:bg-primary-container text-white font-bold text-sm px-8 py-3 rounded-xl transition-all active:scale-95 duration-150 shadow-md shrink-0" 
                    type="submit"
                  >
                    {data?.newsletterButtonText || 'Kaydol'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Column Grid */}
        {columns.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(columns.length, 5)} gap-8 border-t pt-10 pb-14`} style={{ borderColor: customBorderColor || 'rgba(0,0,0,0.08)' }}>
            {columns.map((col: any, i: number) => (
              <div key={i} className="space-y-4">
                <h5 className="font-bold text-base md:text-lg text-primary dark:text-primary-fixed tracking-wide capitalize whitespace-nowrap truncate" style={titleStyle} title={col.title}>
                  {capitalizeWords(col.title)}
                </h5>
                <ul className="flex flex-col gap-2.5">
                  {(col.links || []).map((link: any, j: number) => (
                    <li key={j}>
                      <SmartLink onClick={(e) => { if (link.label.includes("KVKK")) { e.preventDefault(); openKvkkModal(); } }} 
                        className="text-sm text-text-muted dark:text-outline-variant hover:text-primary transition-colors flex items-center gap-1.5 capitalize whitespace-nowrap truncate" 
                        style={textStyle}
                        url={link.url}
                        target={link.target || '_self'}
                      >
                        {link.icon && <IconPreview data={link.icon} className="w-4 h-4 text-primary" />}
                        <span title={capitalizeWords(link.label)} className="truncate">{capitalizeWords(link.label)}</span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t gap-4 text-center md:text-left" style={{ borderColor: customBorderColor || 'rgba(0,0,0,0.08)' }}>
          <p className="text-xs md:text-sm text-text-muted dark:text-outline-variant" style={textStyle}>
            {data?.copyright || '© 2024 Dost Koleji. Tüm Hakları Saklıdır.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link: any, i: number) => (
              <SmartLink onClick={(e) => { if (link.label.includes("KVKK")) { e.preventDefault(); openKvkkModal(); } }} 
                key={i} 
                className="text-xs md:text-sm text-text-muted dark:text-outline-variant hover:text-primary transition-colors" 
                style={textStyle}
                url={link.url}
              >
                {link.label}
              </SmartLink>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
