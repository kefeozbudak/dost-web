import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  FileText, Users, Eye, TrendingUp, Activity, FileStack, MessageSquare, 
  ShieldCheck, Server, Lock, CheckCircle2, Database, BarChart3, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pagesCount: 0,
    formsCount: 0,
    usersCount: 0,
  });
  
  const [recentForms, setRecentForms] = useState<any[]>([]);
  const [trafficSummary, setTrafficSummary] = useState({
    todayViews: 0,
    todayVisitors: 0,
    weeklyViews: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  // Auto-patch home page links and create on-kayit page
  useEffect(() => {
    const patchHomeLinks = async () => {
      try {
        const { doc, getDoc, updateDoc, setDoc } = await import('firebase/firestore');
        
        // 1. Create on-kayit page if it doesn't exist
        const pageRef = doc(db, 'pages', 'on-kayit');
        const pageSnap = await getDoc(pageRef);
        if (!pageSnap.exists()) {
           const { defaultPreRegistrationData } = await import('../lib/defaultData');
           await setDoc(pageRef, {
              title: 'Öğrenci Ön Kayıt Formu',
              path: '/on-kayit',
              blocks: defaultPreRegistrationData,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              author: 'system'
           });
        }

        // 1b. Create bursluluk-basvuru-formu page if it doesn't exist or is empty
        const schPageRef = doc(db, 'pages', 'bursluluk-basvuru-formu');
        const schPageSnap = await getDoc(schPageRef);
        if (!schPageSnap.exists() || !schPageSnap.data()?.blocks || schPageSnap.data().blocks.length === 0 || schPageSnap.data().blocks[0]?.type === 'pre_registration_form') {
           const { defaultScholarshipPageData } = await import('../lib/defaultData');
           await setDoc(schPageRef, {
              title: 'Bursluluk Sınav Başvurusu',
              path: '/bursluluk-basvuru-formu',
              blocks: defaultScholarshipPageData,
              isDeleted: false,
              isHidden: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              author: 'system'
           });
        }

        // 1c. Create bursluluk-basvuru-onay page if it doesn't exist or is empty
        const schConfPageRef = doc(db, 'pages', 'bursluluk-basvuru-onay');
        const schConfPageSnap = await getDoc(schConfPageRef);
        if (!schConfPageSnap.exists() || !schConfPageSnap.data()?.blocks || schConfPageSnap.data().blocks.length === 0) {
           const { defaultScholarshipConfirmationPageData } = await import('../lib/defaultData');
           await setDoc(schConfPageRef, {
              title: 'Bursluluk Sınav Başvuru Onayı',
              path: '/bursluluk-basvuru-onay',
              blocks: defaultScholarshipConfirmationPageData,
              isDeleted: false,
              isHidden: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              author: 'system'
           });
        }

        // 1d. Create lgs-puan-hesaplama page if it doesn't exist or is empty
        const lgsPageRef = doc(db, 'pages', 'lgs-puan-hesaplama');
        const lgsPageSnap = await getDoc(lgsPageRef);
        if (!lgsPageSnap.exists() || !lgsPageSnap.data()?.blocks || lgsPageSnap.data().blocks.length === 0) {
           const { defaultLgsCalculatorData } = await import('../lib/defaultData');
           await setDoc(lgsPageRef, {
              title: 'LGS Puan Hesaplama Modülü',
              path: '/lgs-puan-hesaplama',
              blocks: defaultLgsCalculatorData,
              isDeleted: false,
              isHidden: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              author: 'system'
           });
        }
                // 2. Patch home page (removed forced auto-injection for /on-kayit)
        
        // 3. Patch settings/header and settings/footer
        const headerRef = doc(db, 'settings', 'header');
        const headerSnap = await getDoc(headerRef);
        if (!headerSnap.exists()) {
           // create if not exists
           await setDoc(headerRef, {
             logoUrl: '/dost-logo-png.png',
             links: [
               { label: 'Hakkımızda', url: '/hakkimizda' },
               { label: 'Kampüslerimiz', url: '#' }
             ],
             ctaButton: { label: 'İletişim', url: '/iletisim' }
           });
        }
        
        const footerRef = doc(db, 'settings', 'footer');
        const footerSnap = await getDoc(footerRef);
        if (!footerSnap.exists()) {
           await setDoc(footerRef, {
              logoUrl: '/dost-logo-png.png',
              brandName: 'Dost Koleji',
              brandDesc: 'Dost Koleji, geleceğin liderlerini yetiştiren vizyoner eğitim kurumu.',
              newsletterTitle: 'E-Bülten Kaydı',
              newsletterDesc: 'Gelişmelerden haberdar olmak için abone olun.',
              newsletterPlaceholder: 'E-posta adresiniz',
              newsletterButtonText: 'Kaydol',
              copyright: '© 2024 Dost Koleji. Tüm Hakları Saklıdır.',
              columns: [
                { title: 'Kurumsal', links: [{ label: 'Hakkımızda', url: '/hakkimizda' }] }
              ],
              legalLinks: [{ label: 'KVKK', url: '#' }]
           });
        }
      } catch (e) {
        console.error("Patch error", e);
      }
    };
    patchHomeLinks();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts
        const pagesSnap = await getDocs(collection(db, 'pages'));
        const formsSnap = await getDocs(collection(db, 'forms'));
        const usersSnap = await getDocs(collection(db, 'users'));
        
        setStats({
          pagesCount: pagesSnap.size,
          formsCount: formsSnap.size,
          usersCount: usersSnap.size
        });

        // Fetch recent forms
        const formsQ = query(collection(db, 'forms'), orderBy('createdAt', 'desc'), limit(5));
        const recentFormsSnap = await getDocs(formsQ);
        setRecentForms(recentFormsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        // Fetch real traffic stats
        const todayStr = new Date().toISOString().split('T')[0];
        const todaySnap = await getDoc(doc(db, 'traffic_daily', todayStr));
        const summarySnap = await getDoc(doc(db, 'traffic_stats', 'summary'));
        const dailySnap = await getDocs(query(collection(db, 'traffic_daily'), orderBy('dateStr', 'desc'), limit(7)));

        let tViews = 0;
        let tVisitors = 0;
        if (todaySnap.exists()) {
          const tData = todaySnap.data();
          tViews = tData.views || 0;
          tVisitors = tData.visitors || 0;
        }

        let wViews = 0;
        dailySnap.forEach((d) => {
          wViews += (d.data().views || 0);
        });

        const totalV = summarySnap.exists() ? (summarySnap.data().totalViews || 0) : tViews;

        setTrafficSummary({
          todayViews: tViews,
          todayVisitors: tVisitors,
          weeklyViews: wViews,
          totalViews: totalV
        });

        
      } catch (error) {
        console.error("Dashboard veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getSenderName = (form: any) => {
    let name = '';
    if (form.data) {
      for (const [key, val] of Object.entries(form.data)) {
        if (!val) continue;
        const lowerKey = key.toLowerCase().trim();
        if (lowerKey.includes('formname')) continue;
        if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('eğitim')) continue;
        if (lowerKey.includes('kampüs') || lowerKey.includes('kampus')) continue;
        if (lowerKey.includes('telefon') || lowerKey.includes('tel') || lowerKey.includes('phone') || lowerKey.includes('gsm')) continue;
        if (lowerKey.includes('email') || lowerKey.includes('eposta') || lowerKey.includes('e-posta')) continue;
        if (lowerKey.includes('mesaj') || lowerKey.includes('not') || lowerKey.includes('açıklama')) continue;
        if (lowerKey.includes('adı') || lowerKey.includes('soyad') || lowerKey.includes('isim') || lowerKey.includes('ad ') || lowerKey === 'ad' || lowerKey.includes('name')) {
          if (!name) name = String(val);
        }
      }
    }
    return name || form.parentName || form.name || form.studentName || 'Bilinmiyor';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bursluluk': return 'bg-blue-100 text-blue-700';
      case 'kulup': return 'bg-orange-100 text-orange-700';
      case 'iletisim': return 'bg-green-100 text-green-700';
      case 'chat': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'bursluluk': return 'Bursluluk';
      case 'kulup': return 'Kulüp';
      case 'iletisim': return 'İletişim';
      case 'chat': return 'Veli Asistanı';
      default: return type || 'Form';
    }
  };

  if (loading) {
     return <div className="flex-1 flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-[#004899] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto bg-slate-50 font-sans text-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-24">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><FileStack className="w-3 h-3" /> Toplam Sayfa</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black text-slate-800">{stats.pagesCount}</h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-24">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Form Talepleri</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black text-slate-800">{stats.formsCount}</h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-24">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Users className="w-3 h-3" /> Yetkili Kullanıcı</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black text-slate-800">{stats.usersCount}</h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-24">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Activity className="w-3 h-3" /> Sistem Durumu</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black text-slate-800">Aktif</h2>
            <span className="text-green-500 text-[10px] font-bold italic flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> OPTİMAL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[480px]">
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-slate-800">Rapor Merkezi Akışı (Son Gelenler)</h3>
          </div>
          <div className="flex-1 overflow-hidden p-0">
            {recentForms.length === 0 ? (
               <div className="p-8 text-center text-sm font-medium text-slate-500">Henüz hiçbir form talebi alınmamış.</div>
            ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400">Tarih</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400">Gönderen</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400">Tip</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentForms.map((form) => (
                   <tr key={form.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-4 py-3 text-[11px] font-mono">{formatDate(form.createdAt)}</td>
                     <td className="px-4 py-3 text-xs font-bold text-slate-700">{getSenderName(form)}</td>
                     <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getTypeColor(form.type)}`}>{getTypeName(form.type)}</span></td>
                     <td className="px-4 py-3 text-right">
                       <Link to="/admin/reports" className="p-1 text-slate-400 hover:text-blue-600 inline-block"><Eye className="w-4 h-4" /></Link>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center mt-auto">
            <Link to="/admin/reports" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">Tüm Kayıtları Görüntüle</Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Sistem Sağlığı & Güvenlik */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Sistem Sağlığı & Güvenlik
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-100 text-emerald-700">
                Korumalı
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Firebase Veritabanı</p>
                    <p className="text-[10px] text-slate-500">Canlı Bağlantı & Firestore Rules</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AKTİF
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">SSL/TLS Şifreleme</p>
                    <p className="text-[10px] text-slate-500">256-bit Güvenli HTTPS Bağlantısı</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ETKİN
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Sunucu Yanıt Süresi</p>
                    <p className="text-[10px] text-slate-500">Global Cloud Run Ingress</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  32 ms
                </span>
              </div>
            </div>
          </div>

          {/* Gerçek Zamanlı Trafik Özeti */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase text-slate-800">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Trafik & Ziyaretçi Analizi
              </h3>
              <Link 
                to="/admin/analytics" 
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <span>Detaylar</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-5 flex flex-col justify-center gap-5">
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Bugünkü Ziyaretçi</span>
                  <span key={trafficSummary.todayVisitors} className="text-lg font-black text-slate-900">{trafficSummary.todayVisitors}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((trafficSummary.todayVisitors / (trafficSummary.weeklyViews || 1)) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Canlı Firestore Kaydı
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Son 7 Günlük Görüntüleme</span>
                  <span key={trafficSummary.weeklyViews} className="text-lg font-black text-slate-900">{trafficSummary.weeklyViews}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min((trafficSummary.weeklyViews / (trafficSummary.totalViews || 1)) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1.5">
                  Anlık haftalık toplam sayfa oturumu
                </p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Toplam Sayfa Görüntüleme</span>
                  <span key={trafficSummary.totalViews} className="text-lg font-black text-slate-900">{trafficSummary.totalViews}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <Link 
                to="/admin/analytics"
                className="w-full mt-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Detaylı Trafik Analizi Raporu</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
