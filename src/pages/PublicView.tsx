import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, loginWithGoogle, auth } from '../lib/firebase';
import { Lock, Settings } from 'lucide-react';
import AssistantWidget from '../components/AssistantWidget';
import { DynamicBlockRenderer } from '../components/PageBlocks';
import { defaultHomePageData } from '../lib/defaultData';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PublicView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<any>(null);
  const [headerData, setHeaderData] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch Header and Footer settings
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
      } catch (e) {
        console.error("Error fetching settings:", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'pages'), where('path', '==', location.pathname));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        let data = snapshot.docs[0].data();
        
        // Auto-insert video block for homepage if missing
        if (location.pathname === '/' && data.blocks) {
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

        if (data.isDeleted || data.isHidden) {
          setPageData(null); // Pretend it doesn't exist if deleted or hidden
        } else {
          setPageData(data);
        }
      } else if (location.pathname === '/') {
        setPageData({
          title: 'Ana Sayfa',
          blocks: defaultHomePageData.filter(b => b.type !== 'header' && b.type !== 'footer')
        });
                        } else if (location.pathname === '/duyurular') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Duyurular',
            blocks: module.defaultDuyurularData
          });
        });
} else if (location.pathname === '/basarilarimiz') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Başarılarımız',
            blocks: module.defaultBasarilarimizData
          });
        });
} else if (location.pathname === '/hakkimizda') {
        import('../lib/defaultData').then(({ defaultHakkimizdaData }) => {
          setPageData({
            title: 'Hakkımızda',
            blocks: defaultHakkimizdaData
          });
        });
      } else if (location.pathname === '/on-kayit') {
        import('../lib/defaultData').then(({ defaultPreRegistrationData }) => {
          setPageData({
            title: 'Öğrenci Ön Kayıt Formu',
            blocks: defaultPreRegistrationData
          });
        });
      } else {
        setPageData(null);
      }
      setLoading(false);
    }, (e) => {
      console.error("PUBLIC_VIEW_ERROR:", e);
      if (location.pathname === '/') {
        setPageData({
          title: 'Ana Sayfa',
          blocks: defaultHomePageData.filter(b => b.type !== 'header' && b.type !== 'footer')
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [location.pathname]);

  const handleAdminLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface-background text-slate-500">Sayfa yükleniyor...</div>;

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

  return (
    <div className="min-h-screen bg-surface-background relative text-on-background font-body-md selection:bg-primary/20 flex flex-col">
      <Header data={headerData} />
      <div className="pt-20 flex-1">
        <DynamicBlockRenderer blocks={pageData.blocks || []} />
      </div>
      <Footer data={footerData} />
      <AssistantWidget />
      
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
