import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, loginWithGoogle, auth } from '../lib/firebase';
import { Lock, Settings } from 'lucide-react';
import AssistantWidget from '../components/AssistantWidget';
import { DynamicBlockRenderer } from '../components/PageBlocks';
import { defaultHomePageData } from '../lib/defaultData';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PopupOverlay from '../components/PopupOverlay';
import { recordPageView } from '../lib/analytics';

function cleanBrokenImages(obj: any, contextTitle = ''): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.includes('lh3.googleusercontent.com') || obj.includes('aida-public')) {
      const lower = contextTitle.toLowerCase();
      if (lower.includes('eryaman')) return 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
      if (lower.includes('oran')) return 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80';
      if (lower.includes('ümitköy') || lower.includes('umitkoy')) return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
      return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanBrokenImages(item, contextTitle));
  }
  if (typeof obj === 'object') {
    const title = obj.title || obj.name || contextTitle;
    const res: any = {};
    for (const k of Object.keys(obj)) {
      res[k] = cleanBrokenImages(obj[k], title);
    }
    return res;
  }
  return obj;
}

export default function PublicView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<any>(null);
  const [headerData, setHeaderData] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch Header, Footer and General settings
    const fetchSettings = async () => {
      try {
        const headerDoc = await getDoc(doc(db, 'settings', 'header'));
        if (headerDoc.exists()) {
          setHeaderData(headerDoc.data());
        }
        
        const footerDoc = await getDoc(doc(db, 'settings', 'footer'));
        if (footerDoc.exists()) {
          setFooterData(footerDoc.data());
        }

        const generalDoc = await getDoc(doc(db, 'settings', 'general'));
        if (generalDoc.exists()) {
          const gData = generalDoc.data();
          setGeneralSettings(gData);
          if (gData.siteTitle) {
            document.title = gData.siteTitle;
          }
        }
      } catch (e) {
        console.error("Error fetching settings:", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    setLoading(true);
    const rawPath = location.pathname;
    const cleanPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
    const docId = rawPath === '/' ? 'home' : rawPath.substring(1);

    const docRef = doc(db, 'pages', docId);
    
    const unsubscribeDoc = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        let data = docSnap.data();
        
        if (data.isDeleted || data.isHidden) {
          setPageData(null);
        } else {
          // Auto-insert video block for homepage if missing
          if ((rawPath === '/' || docId === 'home') && data.blocks) {
             const hasVideo = data.blocks.some((b: any) => b.type === 'video');
             if (!hasVideo) {
                const statsIndex = data.blocks.findIndex((b: any) => b.type === 'stats');
                const videoBlock = defaultHomePageData.find(b => b.type === 'video');
                if (videoBlock) {
                    let newBlocks = [...data.blocks];
                    if (statsIndex !== -1) {
                        newBlocks.splice(statsIndex, 0, videoBlock);
                    } else {
                        newBlocks.push(videoBlock);
                    }
                    data.blocks = newBlocks;
                }
             }
          }
          setPageData(cleanBrokenImages(data));
          setLoading(false);
          return;
        }
      }

      // If document wasn't found by direct ID (e.g. custom slug), query by path
      try {
        const q = query(collection(db, 'pages'), where('path', '==', cleanPath));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          let data = snapshot.docs[0].data();
          if (data.isDeleted || data.isHidden) {
            setPageData(null);
          } else {
            setPageData(cleanBrokenImages(data));
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Query by path error:", err);
      }

      // Default built-in fallbacks if no doc in Firestore
      if (rawPath === '/' || docId === 'home') {
        setPageData({
          title: 'Ana Sayfa',
          blocks: defaultHomePageData.filter(b => b.type !== 'header' && b.type !== 'footer')
        });
      } else if (docId === 'kulup-kayit-formu' || cleanPath === '/kulup-kayit-formu') {
        setPageData({
          title: 'Kulüp Kayıt Formu',
          path: '/kulup-kayit-formu',
          blocks: [
            {
              type: 'club_registration_form',
              titlePart1: 'Dost Koleji',
              titlePart2: 'Kulüp Kayıt',
              subtitle: 'Lütfen Formu Eksiksiz Doldurunuz.'
            }
          ]
        });
      } else if (docId === 'duyurular' || cleanPath === '/duyurular') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Duyurular',
            blocks: module.defaultDuyurularData
          });
        });
      } else if (docId === 'basarilarimiz' || cleanPath === '/basarilarimiz') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Başarılarımız',
            blocks: module.defaultBasarilarimizData
          });
        });
      } else if (docId === 'hakkimizda' || cleanPath === '/hakkimizda') {
        import('../lib/defaultData').then(({ defaultHakkimizdaData }) => {
          setPageData({
            title: 'Hakkımızda',
            blocks: defaultHakkimizdaData
          });
        });
      } else if (docId === 'on-kayit' || cleanPath === '/on-kayit') {
        import('../lib/defaultData').then(({ defaultPreRegistrationData }) => {
          setPageData({
            title: 'Öğrenci Ön Kayıt Formu',
            blocks: defaultPreRegistrationData
          });
        });
      } else if (docId === 'bursluluk-basvuru-formu' || cleanPath === '/bursluluk-basvuru-formu') {
        import('../lib/defaultData').then(({ defaultScholarshipPageData }) => {
          setPageData({
            title: 'Bursluluk Sınav Başvurusu',
            path: '/bursluluk-basvuru-formu',
            blocks: defaultScholarshipPageData
          });
        });
      } else if (docId === 'bursluluk-basvuru-onay' || cleanPath === '/bursluluk-basvuru-onay') {
        import('../lib/defaultData').then(({ defaultScholarshipConfirmationPageData }) => {
          setPageData({
            title: 'Bursluluk Sınav Başvuru Onayı',
            path: '/bursluluk-basvuru-onay',
            blocks: defaultScholarshipConfirmationPageData
          });
        });
      } else {
        setPageData(null);
      }
      setLoading(false);
    }, (e) => {
      console.error("PUBLIC_VIEW_ERROR:", e);
      if (rawPath === '/' || docId === 'home') {
        setPageData({
          title: 'Ana Sayfa',
          blocks: defaultHomePageData.filter(b => b.type !== 'header' && b.type !== 'footer')
        });
      } else {
        setPageData(null);
      }
      setLoading(false);
    });

    return () => unsubscribeDoc();
  }, [location.pathname]);

  useEffect(() => {
    if (pageData && !pageData.isHidden && !pageData.isDeleted) {
      recordPageView(location.pathname, pageData.title || pageData.name || 'Sayfa');
    }
  }, [location.pathname, pageData]);

  const handleAdminLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface-background text-slate-500">Sayfa yükleniyor...</div>;

  if (generalSettings?.maintenanceMode && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/30">
          <Settings className="w-8 h-8 animate-spin-slow" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{generalSettings.schoolName || 'Özel Dost Koleji'}</h1>
        <p className="text-slate-300 max-w-lg mb-8 leading-relaxed text-sm md:text-base">
          {generalSettings.maintenanceMessage || 'Sitemiz şu anda planlı bakım çalışmasındadır. Kısa süre sonra tekrar hizmetinizde olacağız.'}
        </p>
        <button
          onClick={handleAdminLogin}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          Yönetici Girişi
        </button>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-background font-sans text-slate-900 px-4">
        <h1 className="text-3xl md:text-4xl font-light mb-4 text-center">404 - Sayfa Bulunamadı</h1>
        <p className="text-sm md:text-base text-slate-500 mb-8 text-center max-w-md">Aradığınız sayfa mevcut değil veya yayından kaldırılmış olabilir.</p>
        <button 
          onClick={handleAdminLogin}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Lock className="w-4 h-4" />
          Yönetici Girişi
        </button>
      </div>
    );
  }

  const isAnnouncementActive = generalSettings?.announcementActive && generalSettings?.announcementText;

  return (
    <div className="min-h-screen bg-surface-background relative text-on-background font-body-md selection:bg-primary/20 flex flex-col">
      <Header data={headerData} announcement={generalSettings} />

      <div className={`flex-1 transition-all duration-300 ${isAnnouncementActive ? 'pt-28 md:pt-32' : 'pt-20'}`}>
        <DynamicBlockRenderer blocks={pageData.blocks || []} />
      </div>
      <Footer data={footerData} />
      <AssistantWidget />
      <PopupOverlay />
      
      {/* Floating Admin Button */}
      <div className="fixed bottom-6 left-6 z-[999]">
        <button 
          onClick={() => {
            if (user) {
              navigate('/admin');
            } else {
              handleAdminLogin();
            }
          }}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white text-slate-400 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:scale-105 transition-all opacity-50 hover:opacity-100 group"
          title={user ? 'Yönetim Paneline Git' : 'Yönetici Girişi'}
        >
          {user ? (
            <Settings className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-spin-slow" />
          ) : (
            <Lock className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
