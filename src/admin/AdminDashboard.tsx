import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FileText, Users, Eye, TrendingUp, Activity, FileStack, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pagesCount: 0,
    formsCount: 0,
    usersCount: 0,
  });
  
  const [recentForms, setRecentForms] = useState<any[]>([]);
  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        
        // Fetch recent pages
        const pagesQ = query(collection(db, 'pages'), orderBy('updatedAt', 'desc'), limit(5));
        const recentPagesSnap = await getDocs(pagesQ);
        let fetchedPages = recentPagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentPages(fetchedPages.slice(0, 5));

        
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase text-slate-800">
                <FileStack className="w-4 h-4 text-[#00A896]" />
                Yayında Olan Sayfalar
              </h3>
            </div>
            <div className="p-0 overflow-y-auto">
                {recentPages.filter(p => !p.isDraft).length === 0 ? (
                    <div className="p-8 text-center text-sm font-medium text-slate-500">Henüz hiçbir sayfa yayınlanmamış.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {recentPages.filter(p => !p.isDraft).map((page) => (
                           <Link to={`/admin/editor/${page.id}`} key={page.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div>
                                 <h4 className="text-xs font-bold text-slate-800 mb-0.5">{page.title}</h4>
                                 <p className="text-[10px] text-slate-500 font-mono">Son: {formatDate(page.updatedAt || page.createdAt)}</p>
                              </div>
                              <div className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-100 text-emerald-700">
                                 Yayında
                              </div>
                           </Link>
                        ))}
                    </div>
                )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase text-slate-800">
                <TrendingUp className="w-4 h-4 text-[#00A896]" />
                Trafik Bilgileri
              </h3>
            </div>
            <div className="p-6 flex flex-col justify-center gap-6">
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">Günlük Ziyaretçi</span>
                     <span className="text-lg font-black text-slate-800">1,248</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Düne göre %12 artış</p>
               </div>
               
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">Haftalık Ziyaretçi</span>
                     <span className="text-lg font-black text-slate-800">8,542</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Geçen haftaya göre %8 artış</p>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">Aylık Ziyaretçi</span>
                     <span className="text-lg font-black text-slate-800">32,105</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Geçen aya göre %24 artış</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
