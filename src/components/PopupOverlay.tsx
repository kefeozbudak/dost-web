import { resolveMediaUrls } from '../lib/resolveMedia';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DynamicBlockRenderer } from './PageBlocks';
import {
  defaultHomePageData,
  defaultHakkimizdaData,
  defaultBasarilarimizData,
  defaultDuyurularData,
  defaultPreRegistrationData,
  defaultScholarshipPageData,
  defaultScholarshipConfirmationPageData,
  defaultEgitimSistemiData,
  defaultCareerPageData,
  defaultLgsCalculatorData
} from '../lib/defaultData';

export interface PopupData {
  id: string;
  name: string;
  status: 'AKTİF' | 'PASİF' | 'TASLAK';
  badgeText?: string;
  badgeColor?: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'top' | 'right' | 'bottom' | 'bg';
  buttonText?: string;
  buttonUrl?: string;
  onlyImage?: boolean;
  popupSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';
  customWidthPx?: number;
  customHeightPx?: number;
  triggerType?: 'immediate' | 'delay' | 'exit_intent' | 'scroll';
  triggerDelay?: number;
  targetPages?: 'all' | 'home' | 'custom';
  customPages?: string;
  pageEmbed?: string; // New field for embedding a page in the popup
  onlyNewVisitors?: boolean;
  frequency?: 'session' | '24h' | 'always';
  style?: {
    bgColor?: string;
    textColor?: string;
    titleColor?: string;
    descColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    borderRadius?: string;
    shadow?: string;
  };
}

export default function PopupOverlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePopups, setActivePopups] = useState<PopupData[]>([]);
  const [currentPopup, setCurrentPopup] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Track visitor history gently
  useEffect(() => {
    // Check if URL has ?reset_popups=1 or ?force_popup=1 to clear closed state for testing
    if (location.search.includes('reset_popups') || location.search.includes('force_popup')) {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('dost_popup_closed_')) sessionStorage.removeItem(key);
      });
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('dost_popup_closed_')) localStorage.removeItem(key);
      });
    }

    if (!localStorage.getItem('dost_visitor_first_seen')) {
      localStorage.setItem('dost_visitor_first_seen', Date.now().toString());
    } else {
      // Mark as returning after 10 minutes of first visit
      const firstSeen = parseInt(localStorage.getItem('dost_visitor_first_seen') || '0', 10);
      if (Date.now() - firstSeen > 10 * 60 * 1000) {
        localStorage.setItem('dost_visitor_is_returning', 'true');
      }
    }
  }, [location.search]);

  // Subscribe to active popups from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'popups'), (snapshot) => {
      const popups = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((p: any) => {
          const st = (p.status || '').toString().trim().toUpperCase();
          return st === 'AKTİF' || st === 'AKTIF';
        }) as PopupData[];
      setActivePopups(popups);
    }, (err) => {
      console.error('Error fetching popups:', err);
    });
    return () => unsubscribe();
  }, []);

  // Evaluate candidate popup for current page
  useEffect(() => {
    if (activePopups.length === 0) {
      setCurrentPopup(null);
      setIsOpen(false);
      return;
    }

    const currentPath = location.pathname;
    const isForceMode = location.search.includes('force_popup') || location.search.includes('preview');

    const candidate = activePopups.find((popup) => {
      // 1. Target Page Check
      if (popup.targetPages === 'home') {
        if (currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html') return false;
      } else if (popup.targetPages === 'custom') {
        const paths = (popup.customPages || '')
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        const normCurrent = currentPath.toLowerCase().replace(/\/$/, '') || '/';
        const isMatched = paths.some((p) => {
          const normP = (p.startsWith('/') ? p : '/' + p).toLowerCase().replace(/\/$/, '') || '/';
          return normP === normCurrent;
        });
        if (!isMatched) return false;
      }

      // If popup was created or updated within the last 10 minutes, bypass frequency and returning visitor checks for testing
      const popupUpdatedAt = (popup as any).updatedAt || 0;
      const isRecentlySaved = popupUpdatedAt > 0 && (Date.now() - popupUpdatedAt < 10 * 60 * 1000);

      if (!isForceMode && !isRecentlySaved) {
        // 2. Only New Visitors Check
        if (popup.onlyNewVisitors) {
          const isReturning = localStorage.getItem('dost_visitor_is_returning') === 'true';
          if (isReturning) return false;
        }

        // 3. Frequency Check
        const freq = popup.frequency || 'session';
        if (freq === 'session') {
          if (sessionStorage.getItem(`dost_popup_closed_${popup.id}`)) return false;
        } else if (freq === '24h') {
          const closedAt = localStorage.getItem(`dost_popup_closed_${popup.id}`);
          if (closedAt) {
            const timeDiff = Date.now() - parseInt(closedAt, 10);
            if (timeDiff < 24 * 60 * 60 * 1000) return false;
          }
        }
      }

      return true;
    });

    if (!candidate) {
      setCurrentPopup(null);
      setIsOpen(false);
      return;
    }

    setCurrentPopup(candidate);

    // Handle Triggers
    const trigger = candidate.triggerType || 'immediate';

    if (trigger === 'immediate') {
      setIsOpen(true);
    } else if (trigger === 'delay') {
      const delayMs = (candidate.triggerDelay || 3) * 1000;
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delayMs);
      return () => clearTimeout(timer);
    } else if (trigger === 'exit_intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 10) {
          setIsOpen(true);
        }
      };
      window.addEventListener('mouseleave', handleMouseLeave);
      return () => window.removeEventListener('mouseleave', handleMouseLeave);
    } else if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= 30) {
          setIsOpen(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [activePopups, location.pathname, location.search]);

  const handleClose = () => {
    if (currentPopup) {
      sessionStorage.setItem(`dost_popup_closed_${currentPopup.id}`, 'true');
      localStorage.setItem(`dost_popup_closed_${currentPopup.id}`, Date.now().toString());
    }
    setIsOpen(false);
  };

  const handleAction = () => {
    if (!currentPopup) return;
    handleClose();
    const targetUrl = currentPopup.buttonUrl || '/';
    if (targetUrl.startsWith('/')) {
      navigate(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  };

  if (!isOpen || !currentPopup) return null;

  const style = currentPopup.style || {};
  const bgColor = style.bgColor || '#ffffff';
  const textColor = style.textColor || '#0f172a';
  const buttonBgColor = style.buttonBgColor || '#0606f9';
  const buttonTextColor = style.buttonTextColor || '#ffffff';
  const badgeColor = currentPopup.badgeColor || '#0606f9';
  const imgPos = currentPopup.imagePosition || 'left';
  const isOnlyImage = !!currentPopup.onlyImage;

  const sizeClassMap: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-5xl'
  };
  const isCustomSize = currentPopup.popupSize === 'custom' || !!currentPopup.customWidthPx;
  const sizeClass = !isCustomSize ? (sizeClassMap[currentPopup.popupSize || 'lg'] || 'max-w-2xl') : '';

  const containerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor
  };

  if (isCustomSize) {
    if (currentPopup.customWidthPx) {
      containerStyle.width = `${currentPopup.customWidthPx}px`;
      containerStyle.maxWidth = '95vw';
    }
    if (currentPopup.customHeightPx) {
      containerStyle.height = `${currentPopup.customHeightPx}px`;
      containerStyle.maxHeight = '90vh';
      containerStyle.overflowY = 'auto';
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Popup Container */}
      <div
        className={`relative w-full ${sizeClass} overflow-hidden shadow-2xl border border-slate-100 rounded-2xl transition-all transform scale-100 z-10`}
        style={containerStyle}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer shadow-lg backdrop-blur-xs"
          title="Kapat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {currentPopup.pageEmbed ? (
          <div className="w-full h-full max-h-[85vh] overflow-y-auto bg-white popup-embed-scroll">
            <EmbeddedPageLoader pageId={currentPopup.pageEmbed} />
          </div>
        ) : isOnlyImage ? (
          /* Sadece Resim Olarak Yayınlama Modu */
          <div
            onClick={handleAction}
            className="w-full cursor-pointer relative group overflow-hidden"
          >
            {currentPopup.imageUrl ? (
              <img
                src={currentPopup.imageUrl}
                alt={currentPopup.title || currentPopup.name}
                className="w-full h-auto object-cover max-h-[82vh] block transition-transform duration-300 group-hover:scale-[1.01]"
              />
            ) : (
              <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl block mb-2">image</span>
                Görsel Yüklenmedi
              </div>
            )}
          </div>
        ) : (
/* Normal Mod (Görsel + Metin + Buton) */
          <div className={`flex ${imgPos === 'bottom' ? 'flex-col-reverse' : 'flex-col'} ${imgPos === 'left' ? 'md:flex-row' : imgPos === 'right' ? 'md:flex-row-reverse' : ''} ${imgPos === 'bg' ? 'relative' : ''}`}>
            {/* Image Section */}
            {currentPopup.imageUrl && (
              <div className={`w-full ${imgPos === 'left' || imgPos === 'right' ? 'md:w-1/2 min-h-[260px] md:min-h-[320px] relative' : imgPos === 'bg' ? 'absolute inset-0 z-0 h-full' : 'h-48 relative'} bg-slate-100 overflow-hidden`}>
                <img
                  src={currentPopup.imageUrl}
                  alt={currentPopup.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDd7z1oXpXwhH7QTgZ2wgXtYlKXePoC_Sp6RZ6ZwL3DgCB_E4XQ8V0YBwI6liC5Cc4LPfygw0lt_Ufj3ybg6A3ZZpBK6rgmhfRGOdQ97rgjLcZf0GIVbfe_TLwh9cHTzg4TiXVKv8XGlHuBePsHfYNF6VDC9tKu1dB_9DNIaIIYeTxAA2BoGlzhJnDtrbGMSZNq9TnpKcOsMvCQgu24ZIMLDdmCkltvU6n9Ju0oRuO-IoyDSVA3ojWNzDQXD1Ii0EsJb4qoCWbQZKI";
                  }}
                />
                <div className={`absolute inset-0 ${imgPos === 'bg' ? 'bg-black/60' : 'bg-gradient-to-t from-black/30 to-transparent'} pointer-events-none`} />
              </div>
            )}

            {/* Content Section */}
            <div className={`w-full ${currentPopup.imageUrl && (imgPos === 'left' || imgPos === 'right') ? 'md:w-1/2' : ''} ${imgPos === 'bg' ? 'relative z-10' : ''} p-6 sm:p-8 flex flex-col justify-center text-left`}>
              {currentPopup.badgeText && (
                <span
                  className="font-bold text-xs uppercase tracking-widest mb-2 inline-block"
                  style={{ color: badgeColor }}
                >
                  {currentPopup.badgeText}
                </span>
              )}

              <h2 className="text-2xl font-bold leading-tight mb-3" style={{ color: currentPopup.style?.titleColor || undefined }}>
                {currentPopup.title}
              </h2>

              <p className="text-sm leading-relaxed mb-6 whitespace-normal md:whitespace-pre-line" style={{ color: currentPopup.style?.descColor || undefined, opacity: currentPopup.style?.descColor ? 1 : 0.8 }}>
                {currentPopup.description}
              </p>

              <button
                type="button"
                onClick={handleAction}
                className="w-full py-3.5 px-2 md:px-6 font-bold rounded-xl shadow-md hover:opacity-90 transition-all text-sm cursor-pointer text-center"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              >
                {currentPopup.buttonText || 'Hemen Başvur'}
              </button>
            </div>
          </div>
                )}
      </div>
    </div>
  );
}

function EmbeddedPageLoader({ pageId }: { pageId: string }) {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().blocks && docSnap.data().blocks.length > 0) {
          let data = docSnap.data();
          if (!data.isDeleted && !data.isHidden) {
            setPageData(await resolveMediaUrls(data));
            setLoading(false);
            return;
          }
        }
        
        // Fallback to built-in templates
        const normalizedPath = '/' + pageId.toLowerCase();
        let fallbackData = null;
        
        if (pageId === 'home') {
          fallbackData = { title: 'Ana Sayfa', blocks: defaultHomePageData.filter((b: any) => b.type !== 'header' && b.type !== 'footer') };
        } else if (pageId === 'kulup-kayit-formu') {
          fallbackData = {
            title: 'Kulüp Kayıt Formu',
            blocks: [{ type: 'club_registration_form', titlePart1: 'Dost Koleji', titlePart2: 'Kulüp Kayıt', subtitle: 'Lütfen Formu Eksiksiz Doldurunuz.' }]
          };
        } else if (pageId === 'duyurular') {
          fallbackData = { title: 'Duyurular', blocks: defaultDuyurularData };
        } else if (pageId === 'basarilarimiz') {
          fallbackData = { title: 'Başarılarımız', blocks: defaultBasarilarimizData };
        } else if (pageId === 'hakkimizda') {
          fallbackData = { title: 'Hakkımızda', blocks: defaultHakkimizdaData };
        } else if (pageId === 'is-basvuru-formu' || pageId === 'is-basvurusu') {
          fallbackData = { title: 'İş Başvurusu', blocks: defaultCareerPageData };
        } else if (pageId === 'egitim-sistemimiz') {
          fallbackData = { title: 'Eğitim Sistemimiz', blocks: defaultEgitimSistemiData };
        } else if (pageId === 'on-kayit') {
          fallbackData = { title: 'Öğrenci Ön Kayıt Formu', blocks: defaultPreRegistrationData };
        } else if (pageId === 'bursluluk-basvuru-formu') {
          fallbackData = { title: 'Bursluluk Sınav Başvurusu', blocks: defaultScholarshipPageData };
        } else if (pageId === 'bursluluk-basvuru-onay') {
          fallbackData = { title: 'Bursluluk Sınav Başvuru Onayı', blocks: defaultScholarshipConfirmationPageData };
        } else if (pageId === 'lgs-puan-hesaplama') {
          fallbackData = { title: 'LGS Puan Hesaplama Modülü', blocks: defaultLgsCalculatorData };
        }

        if (fallbackData) {
          setPageData(fallbackData);
        } else {
          console.warn('Embedded page not found:', pageId);
        }
      } catch (err) {
        console.error('Error fetching embedded page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!pageData || !pageData.blocks || pageData.blocks.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        Sayfa içeriği bulunamadı.
      </div>
    );
  }

  return (
    <div className="embedded-page-content is-popup">
      <DynamicBlockRenderer blocks={pageData.blocks} />
    </div>
  );
}
