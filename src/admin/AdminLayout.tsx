import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { collection, onSnapshot, getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  DatabaseBackup,
  Menu,
  GraduationCap,
  ClipboardList,
  Building2,
  MessageSquare,
  X,
  Bot,
  ChevronDown,
  ShieldCheck,
  Layers,
  Image as ImageIcon,
  Calculator
} from 'lucide-react';
import { logout } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { defaultEgitimSistemiData, defaultLgsCalculatorData } from '../lib/defaultData';

import MigrateTuitionFees from "./MigrateTuitionFees";
export default function AdminLayout() {
  const location = useLocation();
  const editorMatch = location.pathname.match(/\/admin\/editor\/([^/]+)/);
  const currentEditingPageId = editorMatch ? editorMatch[1] : null;
  const currentPreviewUrl = currentEditingPageId 
    ? (currentEditingPageId === 'home' ? '/' : `/${currentEditingPageId}`)
    : '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [isEduMenuOpen, setIsEduMenuOpen] = useState(true);
  const [isFormsMenuOpen, setIsFormsMenuOpen] = useState(true);
  const [isCampusMenuOpen, setIsCampusMenuOpen] = useState(true);
  const [pagesList, setPagesList] = useState<any[]>([]);
  const { role, allowedPages } = useAuthStore();


  // Auto-seed lgs-puan-hesaplama
  useEffect(() => {
    const seedLgs = async () => {
      try {
        const docRef = doc(db, 'pages', 'lgs-puan-hesaplama');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultLgsCalculatorData } = await import('../lib/defaultData');
          await setDoc(docRef, {
            title: 'LGS Puan Hesaplama Modülü',
            path: '/lgs-puan-hesaplama',
            isDeleted: false,
            isHidden: false,
            blocks: defaultLgsCalculatorData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedLgs();
  }, []);

  // Auto-seed kayit-fiyatlari
  useEffect(() => {
    const seedKayit = async () => {
      try {
        const docRef = doc(db, 'pages', 'kayit-fiyatlari');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultTuitionFeesData } = await import('../lib/defaultData');
          await setDoc(docRef, {
            title: 'Kayıt Fiyatları',
            path: '/kayit-fiyatlari',
            isDeleted: false,
            isHidden: false,
            blocks: defaultTuitionFeesData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedKayit();
  }, []);

  useEffect(() => {
    const seedPages = async () => {
      try {
        const docRef = doc(db, 'pages', 'kulup-kayit-formu');
        const docSnap = await getDoc(docRef);
        
        const defaultBlocks = [
            {
                type: "club_registration_form",
                titlePart1: "Dost Koleji",
                titlePart2: "Kulüp Kayıt",
                subtitle: "Öğrenci Kulüp Kayıt Portalı",
                clubs: [
                    { id: "cimnastik", label: "Cimnastik", icon: "sports_gymnastics" },
                    { id: "basketbol", label: "Basketbol", icon: "sports_basketball" },
                    { id: "voleybol", label: "Voleybol", icon: "sports_volleyball" },
                    { id: "halk_oyunlari", label: "Halk Oyunları", icon: "accessibility_new" },
                    { id: "oryantiring", label: "Oryantiring", icon: "explore" },
                    { id: "masa_tenisi", label: "Masa Tenisi", icon: "sports_tennis" },
                    { id: "okculuk", label: "Okçuluk", icon: "sports_martial_arts" },
                    { id: "atletik_koordinasyon", label: "Atletik Koordinasyon", icon: "fitness_center" },
                    { id: "yuzme", label: "Yüzme", icon: "pool" },
                    { id: "taekwondo", label: "Taekwondo", icon: "sports_martial_arts" },
                    { id: "futsal", label: "Futsal", icon: "sports_soccer" },
                    { id: "keman", label: "Keman", icon: "music_note" },
                    { id: "gitar", label: "Gitar", icon: "music_note" },
                    { id: "piyano", label: "Piyano", icon: "piano" }
                ],
                inputs: [
                    { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'person' },
                    { type: 'text', name: 'studentName', label: 'Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', required: true },
                    { type: 'select', name: 'studentCampus', label: 'Kampüs Seçimi', options: 'Eryaman Kampüsü, Oran Kampüsü, Ümitköy Kampüsü', required: true },
                    { type: 'select', name: 'studentClass', label: 'Sınıfı', options: '1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf', required: true },
                    { type: 'section_title', label: 'Veli İletişim Bilgileri', icon: 'contact_phone' },
                    { type: 'text', name: 'parentName', label: 'Veli Adı Soyadı', placeholder: 'Örn: Mehmet Yılmaz', required: true },
                    { type: 'tel', name: 'parentPhone', label: 'Telefon Numarası', placeholder: '0(5xx) xxx xx xx', required: true },
                    { type: 'checkbox', name: 'kvkkConsent', label: 'KVKK Aydınlatma Metni\'ni okudum, kişisel verilerimin kulüp kaydı amacıyla işlenmesini onaylıyorum.', required: true }
                ]
            }
        ];

        if (!docSnap.exists()) {
          await setDoc(docRef, {
              title: "Kulüp Kayıt Formu",
              path: "/kulup-kayit-formu",
              isDeleted: false,              
              isHidden: false,
              blocks: defaultBlocks,
              createdAt: Date.now()
          });
        } else {
          const data = docSnap.data();
          if (!data.blocks || data.blocks.length === 0 || !data.blocks.some((b: any) => b.type === 'club_registration_form')) {
            await setDoc(docRef, { blocks: defaultBlocks }, { merge: true });
          } else {
            const hasCimnastik = data.blocks.some((b: any) => b.type === 'club_registration_form' && b.clubs && b.clubs.some((c: any) => c.id === 'cimnastik'));
            if (!hasCimnastik) {
              const newBlocks = data.blocks.map((b: any) => {
                if (b.type === 'club_registration_form') {
                  return { ...b, clubs: defaultBlocks[0].clubs };
                }
                return b;
              });
              await setDoc(docRef, { blocks: newBlocks }, { merge: true });
            }
          }
        }

        // Seed Education Level, Form & Campus Pages if missing
        const pagesToSeed = [
          { id: 'anaokulu', title: 'Anaokulu', path: '/anaokulu' },
          { id: 'ilkokul', title: 'İlkokul', path: '/ilkokul' },
          { id: 'ortaokul', title: 'Ortaokul', path: '/ortaokul' },
          { id: 'lise', title: 'Lise', path: '/lise' },
          { id: 'on-kayit', title: 'Öğrenci Ön Kayıt Formu', path: '/on-kayit' },
          { id: 'kulup-kayit-formu', title: 'Kulüp Kayıt Formu', path: '/kulup-kayit-formu' },
    { id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },
          { id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' },
          { id: 'bursluluk-basvuru-formu', title: 'Bursluluk Sınav Başvurusu', path: '/bursluluk-basvuru-formu' },
          { id: 'bursluluk-basvuru-onay', title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay' },
    { id: 'lgs-puan-hesaplama', title: 'LGS Puan Hesaplama Modülü', path: '/lgs-puan-hesaplama' },
          { id: 'umitkoy-kampusu', title: 'Ümitköy Kampüsü', path: '/umitkoy-kampusu' },
          { id: 'eryaman-kampusu', title: 'Eryaman Kampüsü', path: '/eryaman-kampusu' },
          { id: 'oran-kampusu', title: 'Oran Kampüsü', path: '/oran-kampusu' },
        ];
        for (const item of pagesToSeed) {
          const pageRef = doc(db, 'pages', item.id);
          const pageSnap = await getDoc(pageRef);
          
          let initialBlocks = [];
          if (item.id === 'egitim-sistemimiz') {
             initialBlocks = defaultEgitimSistemiData;
          } else if (item.id === 'lgs-puan-hesaplama') {
             initialBlocks = defaultLgsCalculatorData;
          }

          if (!pageSnap.exists()) {
            await setDoc(pageRef, {
              title: item.title,
              path: item.path,
              isDeleted: false,
              isHidden: false,
              blocks: initialBlocks,
              createdAt: Date.now()
            });
          } else if (item.id === 'egitim-sistemimiz' || item.id === 'lgs-puan-hesaplama') {
            const data = pageSnap.data();
            if (!data.blocks || data.blocks.length === 0) {
              await setDoc(pageRef, { blocks: initialBlocks }, { merge: true });
            }
          }
        }
      } catch (e) {
        console.error("Failed to seed pages:", e);
      }
    };
    seedPages();
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pages'), (snapshot) => {
      try {
        let fetched = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        let filtered = fetched.filter((p: any) => !p.isDeleted);
        if (!filtered.find(p => p.id === 'egitim-sistemimiz')) {
          filtered.push({ id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' });
        }
        setPagesList(filtered);
      } catch (e) {
        console.error("Error processing pages:", e);
      }
    }, (error) => {
      console.error("Error subscribing to pages:", error);
    });
    return () => unsubscribe();
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Genel Bakış', path: '/admin' },
    { id: 'reports', icon: MessageSquare, label: 'Rapor Merkezi', path: '/admin/reports' },
    { id: 'lgs-center', icon: Calculator, label: 'LGS Merkezi', path: '/admin/lgs-center' },
    { id: 'clubs', icon: Users, label: 'Kulüp Merkezi', path: '/admin/clubs' },
    { id: 'scholarship', icon: GraduationCap, label: 'Bursluluk Merkezi', path: '/admin/scholarship' },
    { id: 'assistant', icon: Bot, label: 'Veli Asistanı', path: '/admin/assistant' },
    { id: 'media', icon: ImageIcon, label: 'Medya Merkezi', path: '/admin/media' },
    { id: 'appearance', icon: Menu, label: 'Görünüm & Menü', path: '/admin/appearance' },
    { id: 'popups', icon: Layers, label: 'Popup Yönetimi', path: '/admin/popups' },
    { id: 'analytics', icon: BarChart3, label: 'Trafik Analizi', path: '/admin/analytics' },
    { id: 'backups', icon: DatabaseBackup, label: 'Yedekleme & Drive', path: '/admin/backups' },
    { id: 'settings', icon: Settings, label: 'Ayarlar', path: '/admin/settings' },
    ...(role === 'super_admin' ? [{ id: 'users', icon: ShieldCheck, label: 'Kullanıcı Yönetimi', path: '/admin/users' }] : []),
  ];

  const hasAccess = (id: string) => {
    if (role === 'super_admin') return true;
    if (role === 'editor') {
       if (['settings', 'users', 'backups'].includes(id)) return false;
       return true;
    }
    if (role === 'restricted') return allowedPages.includes(id);
    return false;
  };

  const filteredMenuItems = menuItems.filter(item => hasAccess(item.id));
  const hasPagesAccess = hasAccess('pages');

  const EDU_SLUGS = [
    { id: 'anaokulu', title: 'Anaokulu', path: '/anaokulu' },
    { id: 'ilkokul', title: 'İlkokul', path: '/ilkokul' },
    { id: 'ortaokul', title: 'Ortaokul', path: '/ortaokul' },
    { id: 'lise', title: 'Lise', path: '/lise' },
  ];

  const FORM_SLUGS = [
    { id: 'on-kayit', title: 'Öğrenci Ön Kayıt Formu', path: '/on-kayit' },
    { id: 'kulup-kayit-formu', title: 'Kulüp Kayıt Formu', path: '/kulup-kayit-formu' },
    { id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },
    { id: 'bursluluk-basvuru-formu', title: 'Bursluluk Sınav Başvurusu', path: '/bursluluk-basvuru-formu' },
    { id: 'bursluluk-basvuru-onay', title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay' },
    { id: 'lgs-puan-hesaplama', title: 'LGS Puan Hesaplama Modülü', path: '/lgs-puan-hesaplama' },
  ];

  const CAMPUS_SLUGS = [
    { id: 'umitkoy-kampusu', title: 'Ümitköy Kampüsü', path: '/umitkoy-kampusu' },
    { id: 'eryaman-kampusu', title: 'Eryaman Kampüsü', path: '/eryaman-kampusu' },
    { id: 'oran-kampusu', title: 'Oran Kampüsü', path: '/oran-kampusu' },
  ];

  const eduPages = EDU_SLUGS.map(target => {
    const match = pagesList.find(p => 
      p.id?.toLowerCase() === target.id ||
      p.path?.toLowerCase() === target.path ||
      p.title?.toLowerCase().trim() === target.title.toLowerCase()
    );
    return match ? { ...match, title: match.title || target.title } : target;
  });

  const formPages = FORM_SLUGS.map(target => {
    const match = pagesList.find(p => 
      p.id?.toLowerCase() === target.id ||
      p.path?.toLowerCase() === target.path
    );
    return match ? { ...match, title: match.title || target.title } : target;
  });

  const campusPages = CAMPUS_SLUGS.map(target => {
    const match = pagesList.find(p => 
      p.id?.toLowerCase() === target.id ||
      p.id?.toLowerCase() === target.id.replace('-kampusu', '') ||
      p.path?.toLowerCase() === target.path ||
      p.path?.toLowerCase() === `/${target.id.replace('-kampusu', '')}` ||
      (p.title?.toLowerCase().includes('ümitköy') && target.id.includes('umitkoy')) ||
      (p.title?.toLowerCase().includes('eryaman') && target.id.includes('eryaman')) ||
      (p.title?.toLowerCase().includes('oran') && target.id.includes('oran'))
    );
    return match ? { ...match, title: match.title || target.title } : target;
  });

  const eduIds = eduPages.map(p => p.id);
  const formIds = formPages.map(p => p.id);
  const campusIds = campusPages.map(p => p.id);
  const otherPages = pagesList
    .filter(p => !eduIds.includes(p.id) && !formIds.includes(p.id) && !campusIds.includes(p.id))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden" translate="no">
      {/* Top Header */}
      <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 md:px-6 border-b border-slate-700 shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-1 hover:bg-slate-800 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src="/dost-logo-png.png" alt="Dost Koleji" className="h-8 w-auto object-contain shrink-0" />
          <MigrateTuitionFees />
    </div>
        <div className="flex items-center gap-4 md:gap-6">
          <a 
            href={currentPreviewUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => {
              e.preventDefault();
              window.open(currentPreviewUrl, '_blank');
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            title="Önizlemeyi Yeni Sekmede Aç"
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            <span key={currentEditingPageId ? '1' : '0'}>{currentEditingPageId ? 'Sayfayı Ön İzle' : 'Siteyi Ön İzle'}</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white uppercase">{role === 'super_admin' ? 'Süper Yönetici' : role === 'editor' ? 'Editör' : 'Yetkili Kullanıcı'}</p>
              <MigrateTuitionFees />
    </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              <MigrateTuitionFees />
    </div>
            <MigrateTuitionFees />
    </div>
          <MigrateTuitionFees />
    </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`absolute inset-y-0 left-0 z-20 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out w-64 md:w-60 bg-slate-100 border-r border-slate-200 flex flex-col shrink-0 h-full`}>
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Menü</p>
            <nav className="space-y-1">
              {hasAccess('dashboard') && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LayoutDashboard className={`w-5 h-5 md:w-4 md:h-4 ${location.pathname === '/admin' ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>Genel Bakış</span>
                </Link>
              )}
              
              {hasPagesAccess && (
                <>
                <div>
                  <button
                    onClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold transition-colors ${
                      location.pathname.startsWith('/admin/editor') || location.pathname === '/admin/pages'
                        ? 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold' 
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 md:w-4 md:h-4 ${location.pathname.startsWith('/admin/editor') || location.pathname === '/admin/pages' ? 'text-blue-700' : 'text-slate-500'}`} />
                      Sayfa Yönetimi
                      <MigrateTuitionFees />
    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isPagesMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isPagesMenuOpen && (
                    <div className="mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1">
                      {otherPages.map((page) => (
                        <Link
                          key={page.id}
                          to={`/admin/editor/${page.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            location.pathname === `/admin/editor/${page.id}`
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          {page.title}
                        </Link>
                      ))}

                          <Link
                        to="/admin/pages"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors mt-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100`}
                      >
                        + Yeni Sayfa / Yönetim
                      </Link>
                      <MigrateTuitionFees />
    </div>
                  )}
                  <MigrateTuitionFees />
    </div>
                
                <div>
{/* Eğitim Kademeleri Dropdown Submenu */}
                      <div className="pt-1">
                        <button
                          onClick={() => setIsEduMenuOpen(!isEduMenuOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold transition-colors ${
                            eduPages.some(p => location.pathname === `/admin/editor/${p.id}`)
                              ? 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 md:w-4 md:h-4 text-blue-600 shrink-0" />
                            <span>Eğitim Kademeleri</span>
                            <MigrateTuitionFees />
    </div>
                          <ChevronDown className={`w-5 h-5 md:w-4 md:h-4 text-slate-400 transition-transform ${isEduMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isEduMenuOpen && (
                          <div className="mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1">
                            {eduPages.map((page) => (
                              <Link
                                key={page.id}
                                to={`/admin/editor/${page.id}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                  location.pathname === `/admin/editor/${page.id}`
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                {page.title}
                              </Link>
                            ))}
                            <MigrateTuitionFees />
    </div>
                        )}
                        <MigrateTuitionFees />
    </div>

                    
                  <MigrateTuitionFees />
    </div>
                <div>
{/* Formlar Dropdown Submenu */}
                      <div className="pt-1">
                        <button
                          onClick={() => setIsFormsMenuOpen(!isFormsMenuOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold transition-colors ${
                            formPages.some(p => location.pathname === `/admin/editor/${p.id}`)
                              ? 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 md:w-4 md:h-4 text-blue-600 shrink-0" />
                            <span>Formlar</span>
                            <MigrateTuitionFees />
    </div>
                          <ChevronDown className={`w-5 h-5 md:w-4 md:h-4 text-slate-400 transition-transform ${isFormsMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFormsMenuOpen && (
                          <div className="mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1">
                            {formPages.map((page) => (
                              <Link
                                key={page.id}
                                to={`/admin/editor/${page.id}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                  location.pathname === `/admin/editor/${page.id}`
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                {page.title}
                              </Link>
                            ))}
                            <MigrateTuitionFees />
    </div>
                        )}
                        <MigrateTuitionFees />
    </div>

                    
                  <MigrateTuitionFees />
    </div>
                <div>
{/* Kampüsler Dropdown Submenu */}
                      <div className="pt-1">
                        <button
                          onClick={() => setIsCampusMenuOpen(!isCampusMenuOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold transition-colors ${
                            campusPages.some(p => location.pathname === `/admin/editor/${p.id}`)
                              ? 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 md:w-4 md:h-4 text-blue-600 shrink-0" />
                            <span>Kampüsler</span>
                            <MigrateTuitionFees />
    </div>
                          <ChevronDown className={`w-5 h-5 md:w-4 md:h-4 text-slate-400 transition-transform ${isCampusMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCampusMenuOpen && (
                          <div className="mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1">
                            {campusPages.map((page) => (
                              <Link
                                key={page.id}
                                to={`/admin/editor/${page.id}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                  location.pathname === `/admin/editor/${page.id}`
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                {page.title}
                              </Link>
                            ))}
                            <MigrateTuitionFees />
    </div>
                        )}
                        <MigrateTuitionFees />
    </div>

                      
                  <MigrateTuitionFees />
    </div>
                </>
              )}
              {filteredMenuItems.filter(i => i.id !== 'dashboard').map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold transition-colors ${
                      isActive 
                        ? 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold' 
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 md:w-4 md:h-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <MigrateTuitionFees />
    </div>
          
          <div className="mt-auto p-4 border-t border-slate-200 bg-slate-50">
            <button 
              onClick={logout}
              className="w-full py-2.5 md:py-2 px-4 bg-slate-200 text-slate-700 rounded-md text-xs md:text-[10px] font-bold uppercase hover:bg-slate-300 transition-colors tracking-widest"
            >
              Çıkış Yap
            </button>
            <MigrateTuitionFees />
    </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative w-full">
          <Outlet />
        </main>
        <MigrateTuitionFees />
    </div>

      <footer className="h-10 md:h-8 bg-slate-100 border-t border-slate-200 px-4 md:px-6 flex items-center justify-between text-[10px] font-medium text-slate-500 shrink-0">
        <div className="flex gap-2 md:gap-4 items-center">
          <span className="flex items-center gap-1 font-bold"><span className="w-2 h-2 bg-green-500 rounded-full"></span> <span className="hidden sm:inline">FIREBASE CONNECTED</span></span>
          <span className="hidden sm:inline">|</span>
          <span>99.998%</span>
          <MigrateTuitionFees />
    </div>
        <div className="flex gap-4 uppercase font-bold tracking-tighter">
          <span className="hidden sm:inline">Audit Log</span>
          <span>V2.4.12</span>
          <MigrateTuitionFees />
    </div>
      </footer>
      <MigrateTuitionFees />
    </div>
  );
}
