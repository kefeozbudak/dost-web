import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { defaultPreRegistrationData } from '../../lib/defaultData';
import { FileText, Plus, Trash2, Eye, EyeOff, Edit, ExternalLink, Settings, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PagesCenter() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', path: '' });
  const [creating, setCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();


  
  const updateHomePageUrls = async () => {
    try {
      const docRef = doc(db, 'pages', 'home');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let modified = false;
        const newBlocks = (data.blocks || []).map((block: any) => {
          if (block.type === 'hero' && block.items) {
            block.items = block.items.map((item: any) => {
              if (item.title === 'Eryaman Kampüsü' && !item.url) { modified = true; return { ...item, url: '#eryaman-kampusu' }; }
              if (item.title === 'Oran Kampüsü' && !item.url) { modified = true; return { ...item, url: '#oran-kampusu' }; }
              if (item.title === 'Ümitköy Kampüsü' && !item.url) { modified = true; return { ...item, url: '#umitkoy-kampusu' }; }
              return item;
            });
          }
          return block;
        });
        
        if (modified) {
          await setDoc(docRef, { blocks: newBlocks }, { merge: true });
          alert('Ana sayfa kampüs linkleri güncellendi.');
        } else {
          alert('Güncellenecek link bulunamadı.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const seedAllDefaults = async () => {
    try {
      const {
        defaultHomePageData,
        defaultHakkimizdaData,
        defaultBasarilarimizData,
        defaultDuyurularData,
        defaultPreRegistrationData,
        defaultScholarshipPageData,
        defaultScholarshipConfirmationPageData,
        defaultEgitimSistemiData,
        defaultCareerPageData,
        defaultTuitionFeesData,
        defaultLgsCalculatorData
      } = await import('../../lib/defaultData');

      const defaultPagesMap: Record<string, { title: string; path: string; blocks: any[] }> = {
        'home': {
          title: 'Ana Sayfa',
          path: '/',
          blocks: defaultHomePageData.filter(b => b.type !== 'header' && b.type !== 'footer')
        },
        'hakkimizda': {
          title: 'Hakkımızda',
          path: '/hakkimizda',
          blocks: defaultHakkimizdaData
        },
        'egitim-sistemimiz': {
          title: 'Eğitim Sistemimiz',
          path: '/egitim-sistemimiz',
          blocks: defaultEgitimSistemiData
        },
        'basarilarimiz': {
          title: 'Başarılarımız',
          path: '/basarilarimiz',
          blocks: defaultBasarilarimizData
        },
        'duyurular': {
          title: 'Duyurular',
          path: '/duyurular',
          blocks: defaultDuyurularData
        },
        'on-kayit': {
          title: 'Öğrenci Ön Kayıt',
          path: '/on-kayit',
          blocks: defaultPreRegistrationData
        },
        'is-basvuru-formu': {
          title: 'İş Başvurusu',
          path: '/is-basvuru-formu',
          blocks: defaultCareerPageData
        },
        'bursluluk-basvuru-formu': {
          title: 'Bursluluk Sınav Başvurusu',
          path: '/bursluluk-basvuru-formu',
          blocks: defaultScholarshipPageData
        },
        'bursluluk-basvuru-onay': {
          title: 'Bursluluk Sınav Başvuru Onayı',
          path: '/bursluluk-basvuru-onay',
          blocks: defaultScholarshipConfirmationPageData
        },
        'lgs-puan-hesaplama': {
          title: 'LGS Puan Hesaplama Modülü',
          path: '/lgs-puan-hesaplama',
          blocks: defaultLgsCalculatorData
        },
        
        'kayit-fiyatlari': {
          title: 'Kayıt Fiyatları',
          path: '/kayit-fiyatlari',
          blocks: defaultTuitionFeesData
        },
        'kulup-kayit-formu': {

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
        }
      };

      for (const [id, page] of Object.entries(defaultPagesMap)) {
        try {
          const docRef = doc(db, 'pages', id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists() || !docSnap.data()?.blocks || docSnap.data().blocks.length === 0 || docSnap.data()?.isDeleted) {
            await setDoc(docRef, {
              title: page.title,
              path: page.path,
              isDeleted: false,
              isHidden: false,
              blocks: page.blocks,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }, { merge: true });
          }
        } catch (err) {
          console.error(`Error seeding ${id}:`, err);
        }
      }
    } catch (e) {
      console.error('Failed to seed defaults', e);
    }
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'pages'));
      let fetchedPages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // If after fetching we have 0 non-deleted pages, try seeding defaults
      if (fetchedPages.filter((p: any) => !p.isDeleted).length === 0) {
        try { await seedAllDefaults(); } catch (err) { console.error('Seed error', err); }
        const snap2 = await getDocs(collection(db, 'pages'));
        fetchedPages = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      fetchedPages.sort((a: any, b: any) => {
        const getTime = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'number') return val;
          if (val.toMillis) return val.toMillis();
          if (val.seconds) return val.seconds * 1000;
          return new Date(val).getTime() || 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      });

      setPages(fetchedPages.filter((p: any) => !p.isDeleted));
    } catch (e) {
      console.error("fetchPages error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);


  // Auto-seed lgs-puan-hesaplama if missing
  useEffect(() => {
    const seedLgs = async () => {
      try {
        const docRef = doc(db, 'pages', 'lgs-puan-hesaplama');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultLgsCalculatorData } = await import('../../lib/defaultData');
          await setDoc(docRef, {
            title: 'LGS Puan Hesaplama Modülü',
            path: '/lgs-puan-hesaplama',
            isDeleted: false,
            isHidden: false,
            blocks: defaultLgsCalculatorData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
          fetchPages();
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedLgs();
  }, []);

  // Auto-seed kayit-fiyatlari if missing
  useEffect(() => {
    const seedKayit = async () => {
      try {
        const docRef = doc(db, 'pages', 'kayit-fiyatlari');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultTuitionFeesData } = await import('../../lib/defaultData');
          await setDoc(docRef, {
            title: 'Kayıt Fiyatları',
            path: '/kayit-fiyatlari',
            isDeleted: false,
            isHidden: false,
            blocks: defaultTuitionFeesData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
          fetchPages();
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedKayit();
  }, []);


  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title || !newPage.path) return;
    setCreating(true);
    
    // Format path
    let formattedPath = newPage.path.trim();
    if (!formattedPath.startsWith('/')) formattedPath = '/' + formattedPath;
    
    // Format ID
    const pageId = formattedPath.substring(1).replace(/[^a-zA-Z0-9-]/g, '-') || 'home';
    if (!pageId) {
      console.error("Failed to generate page ID from path:", formattedPath);
      alert("Geçersiz yol formatı.");
      setCreating(false);
      return;
    }

    try {
      // 1. Save Page
      await setDoc(doc(db, 'pages', pageId), {
        title: newPage.title,
        path: formattedPath,
        blocks: [],
        isCustom: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // 2. Automatically add to header menu if requested by user
      const headerDocRef = doc(db, 'settings', 'header');
      const headerDoc = await getDoc(headerDocRef);
      if (headerDoc.exists()) {
        const headerData = headerDoc.data();
        const updatedLinks = [...(headerData.links || []), { label: newPage.title, url: formattedPath }];
        await setDoc(headerDocRef, { ...headerData, links: updatedLinks });
      } else {
        await setDoc(headerDocRef, { links: [{ label: newPage.title, url: formattedPath }] });
      }

      setShowCreateModal(false);
      setNewPage({ title: '', path: '' });
      await fetchPages();
      
      // Navigate to editor
      navigate(`/admin/editor/${pageId}`);
      
    } catch (err) {
      console.error(err);
      alert('Sayfa oluşturulurken hata: ' + err);
    } finally {
      setCreating(false);
    }
  };

  
  const handleDuplicatePage = async (page: any) => {
    if (confirm(`"${page.title}" sayfasını çoğaltmak istediğinize emin misiniz?`)) {
      setLoading(true);
      try {
        const docRef = doc(db, 'pages', page.id);
        const docSnap = await getDoc(docRef);
        let blocksToCopy = [];
        
        if (docSnap.exists() && docSnap.data().blocks && docSnap.data().blocks.length > 0) {
          blocksToCopy = docSnap.data().blocks;
        } else {
           // Fallback to default blocks if they are missing in the DB (for default pages)
           if (page.id === 'home') {
             const { defaultHomePageData } = await import('../../lib/defaultData');
             blocksToCopy = defaultHomePageData;
           } else if (page.id === 'hakkimizda') {
             const { defaultHakkimizdaData } = await import('../../lib/defaultData');
             blocksToCopy = defaultHakkimizdaData;
           } else if (page.id === 'iletisim') {
             const defaultContactData: any[] = [];
             blocksToCopy = defaultContactData;
           } else if (page.id === 'egitim-sistemimiz') {
             const { defaultEgitimSistemiData } = await import('../../lib/defaultData');
             blocksToCopy = defaultEgitimSistemiData;
           } else if (page.id === 'is-basvurusu' || page.id === 'is-basvuru-formu') {
             const { defaultCareerPageData } = await import('../../lib/defaultData');
             blocksToCopy = defaultCareerPageData;
           } else if (page.id === 'duyurular') {
             const { defaultDuyurularData } = await import('../../lib/defaultData');
             blocksToCopy = defaultDuyurularData;
           } else if (page.id === 'basarilarimiz') {
             const { defaultBasarilarimizData } = await import('../../lib/defaultData');
             blocksToCopy = defaultBasarilarimizData;
           } else if (page.id === 'on-kayit') {
             const { defaultPreRegistrationData } = await import('../../lib/defaultData');
             blocksToCopy = defaultPreRegistrationData;
           } else if (page.id === 'bursluluk-basvuru-formu') {
             const { defaultScholarshipPageData } = await import('../../lib/defaultData');
             blocksToCopy = defaultScholarshipPageData;
           } else if (page.id === 'bursluluk-basvuru-onay') {
             const { defaultScholarshipConfirmationPageData } = await import('../../lib/defaultData');
             blocksToCopy = defaultScholarshipConfirmationPageData;
           } else if (page.id === 'lgs-puan-hesaplama') {
             const { defaultLgsCalculatorData } = await import('../../lib/defaultData');
             blocksToCopy = defaultLgsCalculatorData;
           } else if (page.id === 'kayit-fiyatlari') {
             const { defaultTuitionFeesData } = await import('../../lib/defaultData');
             blocksToCopy = defaultTuitionFeesData;
           }
        }

        const newId = page.id + '-' + Math.random().toString(36).substr(2, 6);
        const newPage = {
          ...page,
          id: newId,
          title: page.title + ' (Kopya)',
          path: page.path + '-kopya',
          isHidden: true,
          isCloned: true,
          blocks: blocksToCopy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'pages', newId), newPage);
        await fetchPages();
      } catch (err) {
        console.error("Clone error:", err);
        alert('Sayfa çoğaltılamadı: ' + err);
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDeleteAction = async () => {
    if (deleteConfirmId) {
      try {
        await setDoc(doc(db, 'pages', deleteConfirmId), { isDeleted: true }, { merge: true });
        fetchPages();
        setDeleteConfirmId(null);
      } catch (err) {
        alert('Silinemedi.');
      }
    }
  };

  const handleToggleVisibility = async (id: string, isHidden: boolean) => {
    try {
      await setDoc(doc(db, 'pages', id), { isHidden: !isHidden }, { merge: true });
      fetchPages();
    } catch (err) {
      alert('Durum güncellenemedi.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-800">Sayfa Yönetimi</h1>
            <p className="text-slate-500 text-sm">Sitenizdeki tüm sayfaları buradan yönetebilir, yeni sayfalar oluşturabilirsiniz.</p>
          </div>
          <button
            onClick={async () => {
              if (window.confirm('Eksik tüm varsayılan sayfaları (Ana Sayfa, Hakkımızda, Eğitim Sistemimiz, Başarılarımız, Duyurular, Ön Kayıt, Bursluluk, İş Başvurusu vb.) yüklemek/yenilemek istiyor musunuz?')) {
                setLoading(true);
                await seedAllDefaults();
                await fetchPages();
                alert('Tüm varsayılan sayfalar başarıyla kontrol edildi ve yüklendi.');
              }
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Varsayılanları Kur
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Sayfa Ekle
          </button>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Yeni Sayfa Oluştur
              </h3>
              <form onSubmit={handleCreatePage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sayfa Başlığı</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Örn: Hakkımızda"
                    value={newPage.title}
                    onChange={e => setNewPage({...newPage, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sayfa Yolu (URL)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Örn: /hakkimizda"
                    value={newPage.path}
                    onChange={e => {
                      let val = e.target.value;
                      if (!val.startsWith('/') && val.length > 0) val = '/' + val;
                      setNewPage({...newPage, path: val});
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">İngilizce karakterler kullanmaya özen gösterin.</p>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {creating ? 'Oluşturuluyor...' : 'Oluştur ve Düzenle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Yükleniyor...</div>
          ) : pages.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>Henüz hiçbir sayfa oluşturulmamış.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Sayfa Başlığı</th>
                    <th className="px-6 py-4">URL Yolu</th>
                    <th className="px-6 py-4 text-center">Durum</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {page.title}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {page.path}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${page.isHidden ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'}`}>
                          {page.isHidden ? <EyeOff className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {page.isHidden ? 'Gizli' : 'Yayında'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <a 
                          href={page.path || (page.id === 'home' ? '/' : `/${page.id}`)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Önizle (Yeni Sekmede Aç)"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleToggleVisibility(page.id, !!page.isHidden)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${page.isHidden ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                          title={page.isHidden ? 'Yayına Al' : 'Gizle'}
                        >
                          {page.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <Link 
                          to={`/admin/editor/${page.id}`}
                          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {page.id !== 'home' && (
                          <button 
                            onClick={() => {
                              const isCustomPage = page.isCustom || page.isCloned || !['home', 'hakkimizda', 'egitim-sistemimiz', 'basarilarimiz', 'duyurular', 'iletisim', 'is-basvurusu', 'is-basvuru-formu', 'on-kayit', 'bursluluk-basvuru-formu', 'bursluluk-basvuru-onay', 'lgs-puan-hesaplama', 'kayit-fiyatlari'].includes(page.id);
                              if (!isCustomPage) {
                                alert('Orijinal sistem sayfaları silinemez.');
                                return;
                              }
                              if (!page.isHidden) {
                                alert('Lütfen sayfayı silmeden önce yayından kaldırın (göz ikonuna tıklayarak gizleyin).');
                                return;
                              }
                              setDeleteConfirmId(page.id);
                            }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${(! (page.isCustom || page.isCloned || !['home', 'hakkimizda', 'egitim-sistemimiz', 'basarilarimiz', 'duyurular', 'iletisim', 'is-basvurusu', 'is-basvuru-formu', 'on-kayit', 'bursluluk-basvuru-formu', 'bursluluk-basvuru-onay', 'lgs-puan-hesaplama', 'kayit-fiyatlari'].includes(page.id)) || !page.isHidden) ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
                            title={! (page.isCustom || page.isCloned || !['home', 'hakkimizda', 'egitim-sistemimiz', 'basarilarimiz', 'duyurular', 'iletisim', 'is-basvurusu', 'is-basvuru-formu', 'on-kayit', 'bursluluk-basvuru-formu', 'bursluluk-basvuru-onay', 'lgs-puan-hesaplama', 'kayit-fiyatlari'].includes(page.id)) ? "Sistem sayfaları silinemez" : (!page.isHidden ? "Önce yayından kaldırın" : "Sil")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sayfayı Sil</h3>
            <p className="text-slate-600 mb-6 text-sm">
              Bu sayfayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={confirmDeleteAction}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}