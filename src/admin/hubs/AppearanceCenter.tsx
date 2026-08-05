
import IconField from "../../components/IconField";
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import MediaPickerModal from '../../components/MediaPickerModal';
import { ChevronUp, ChevronDown, Save, Plus, Trash2, Layout, LayoutTemplate, Menu, Image as ImageIcon, Megaphone, Eye, Check , ArrowUp, ArrowDown} from 'lucide-react';



const PreviewImage = ({ src, alt, className, style }: any) => {
  const [resolved, setResolved] = useState(src);
  useEffect(() => {
    if (src && typeof src === 'string' && src.startsWith('/api/media/')) {
      const mediaId = src.split('/api/media/')[1];
      getDoc(doc(db, 'media', mediaId)).then(snap => {
        if (snap.exists() && snap.data().url) setResolved(snap.data().url);
      }).catch(()=>{});
    } else {
      setResolved(src);
    }
  }, [src]);
  if (!resolved) return null;
  return <img src={resolved} alt={alt} className={className} style={style} />;
};

const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.5): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
    img.src = objectUrl;
  });
};

export default function AppearanceCenter() {
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{ isOpen: boolean; onSelect: (url: string) => void }>({ isOpen: false, onSelect: () => {} });
  const [activeTab, setActiveTab] = useState<'header' | 'announcement' | 'footer'>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagesList, setPagesList] = useState<any[]>([]);

  const [announcementData, setAnnouncementData] = useState<any>({
    announcementActive: true,
    announcementText: '🎉 2026 - 2027 Eğitim Öğretim Yılı Erken Kayıt Fırsatları ve Bursluluk Sınavı Başvuruları Başladı!',
    announcementIcon: '📢',
    announcementButtonText: 'Başvuru Yap',
    announcementButtonUrl: '/bursluluk-basvuru-formu',
    announcementBgColor: '#0a192f',
    announcementTextColor: '#ffffff'
  });
  
  const [headerData, setHeaderData] = useState<any>({
    logoUrl: '/dost-logo-png.png',
    links: [
      { label: 'Hakkımızda', url: '#' },
      { label: 'Akademik', url: '#' },
      { label: 'Kampüslerimiz', url: '#' }
    ],
    ctaButton: { label: 'Ön Kayıt Formu', url: '#' }
  });
  
  const [footerData, setFooterData] = useState<any>({
    logoUrl: '/dost-logo-png.png',
    brandName: 'Dost Koleji',
    brandDesc: 'Dost Koleji, geleceğin liderlerini yetiştiren vizyoner eğitim kurumu.',
    newsletterTitle: 'E-Bülten Kaydı',
    newsletterDesc: 'Gelişmelerden haberdar olmak için abone olun.',
    newsletterPlaceholder: 'E-posta adresiniz',
    newsletterButtonText: 'Kaydol',
    copyright: '© 2024 Dost Koleji. Tüm Hakları Saklıdır.',
    columns: [
      { title: 'Kurumsal', links: [{ label: 'Hakkımızda', url: '#' }] }
    ],
    legalLinks: [{ label: 'KVKK', url: '#' }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerDoc = await getDoc(doc(db, 'settings', 'header'));
        if (headerDoc.exists()) setHeaderData(headerDoc.data());
        
        const footerDoc = await getDoc(doc(db, 'settings', 'footer'));
        if (footerDoc.exists()) setFooterData(footerDoc.data());

        const generalDoc = await getDoc(doc(db, 'settings', 'general'));
        if (generalDoc.exists()) {
          const gData = generalDoc.data();
          setAnnouncementData({
            announcementActive: gData.announcementActive ?? true,
            announcementText: gData.announcementText || '',
            announcementIcon: gData.announcementIcon !== undefined ? gData.announcementIcon : '📢',
            announcementButtonText: gData.announcementButtonText || '',
            announcementButtonUrl: gData.announcementButtonUrl || '',
            announcementBgColor: gData.announcementBgColor || '#0a192f',
            announcementTextColor: gData.announcementTextColor || '#ffffff'
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Live listener for pages so all created pages appear in dropdowns instantly
    const unsubscribePages = onSnapshot(collection(db, 'pages'), (snapshot) => {
      const fetchedPages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const validPages = fetchedPages.filter((p: any) => !p.isDeleted);

      const defaultPagesList = [
        { id: 'home', title: 'Ana Sayfa', path: '/' },
        { id: 'on-kayit', title: 'Öğrenci Ön Kayıt', path: '/on-kayit' },
        { id: 'kulup-kayit-formu', title: 'Kulüp Kayıt Formu', path: '/kulup-kayit-formu' },
          { id: 'is-basvurusu', title: 'İş Başvurusu', path: '/is-basvurusu' },
        { id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' },
        { id: 'bursluluk-basvuru-formu', title: 'Bursluluk Sınav Başvurusu', path: '/bursluluk-basvuru-formu' },
        { id: 'bursluluk-basvuru-onay', title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay' }
      ];

      const mergedMap = new Map();
      defaultPagesList.forEach(dp => mergedMap.set(dp.path, dp));
      validPages.forEach((p: any) => {
        const pagePath = p.path || (p.id ? `/${p.id}` : '#');
        mergedMap.set(pagePath, {
          id: p.id,
          title: p.title || p.id,
          path: pagePath
        });
      });

      setPagesList(Array.from(mergedMap.values()));
    }, (err) => {
      console.error("Error listening pages:", err);
    });

    return () => unsubscribePages();
  }, []);

  const renderUrlEditor = (value: string, onChange: (val: string) => void) => {
    const currentVal = value || '';
    const isKnownPage = pagesList?.some((p: any) => p.path === currentVal || p.path === `/${currentVal.replace(/^\//, '')}`);
    const isHomePage = currentVal === '/' || currentVal === '';
    const selectVal = isHomePage ? '/' : (isKnownPage ? currentVal : 'custom');

    return (
      <div className="flex gap-2 w-full mt-1">
        <select
          value={selectVal}
          onChange={(e) => {
            if (e.target.value !== 'custom') onChange(e.target.value);
          }}
          className="w-1/2 px-2 py-1 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="custom">Özel Link / Yönlendirme</option>
          <option value="/">Ana Sayfa (/)</option>
          {pagesList?.filter((p: any) => p.path !== '/').map((p: any) => {
            const pagePath = p.path || (p.id ? `/${p.id}` : '#');
            return (
              <option key={p.id || pagePath} value={pagePath}>
                {p.title} ({pagePath})
              </option>
            );
          })}
        </select>
        <input
          type="text"
          value={currentVal}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL veya Sayfa Yolu (ör: /hakkimizda)"
          className="w-1/2 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  };

  
  const sanitizeData = (obj: any): any => {
    if (typeof obj === 'string') {
      if (obj.startsWith('data:image/')) return '';
      return obj;
    }
    if (Array.isArray(obj)) return obj.map(sanitizeData);
    if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        if (obj[key] !== undefined) {
           newObj[key] = sanitizeData(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      if (activeTab === 'header') {
        await setDoc(doc(db, 'settings', 'header'), headerData);
      } else if (activeTab === 'announcement') {
        const generalRef = doc(db, 'settings', 'general');
        const generalSnap = await getDoc(generalRef);
        const currentGeneral = generalSnap.exists() ? generalSnap.data() : {};
        await setDoc(generalRef, {
          ...currentGeneral,
          announcementActive: announcementData.announcementActive,
          announcementText: announcementData.announcementText,
          announcementIcon: announcementData.announcementIcon,
          announcementButtonText: announcementData.announcementButtonText,
          announcementButtonUrl: announcementData.announcementButtonUrl,
          announcementBgColor: announcementData.announcementBgColor,
          announcementTextColor: announcementData.announcementTextColor,
          updatedAt: Date.now()
        });
      } else {
        await setDoc(doc(db, 'settings', 'footer'), footerData);
      }
      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (e) {
      console.error("Error saving settings:", e);
      setMessage({ type: 'error', text: 'Kaydedilirken hata oluştu: ' + (e as any).message });
    } finally {
      setSaving(false);
    }
  };

  const handleHeaderLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...(headerData.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setHeaderData({ ...headerData, links: newLinks });
  };
  
  const addHeaderLink = () => {
    setHeaderData({ ...headerData, links: [...(headerData.links || []), { label: 'Yeni Menü', url: '#' }] });
  };
  
  const removeHeaderLink = (index: number) => {
    const newLinks = [...(headerData.links || [])];
    newLinks.splice(index, 1);
    setHeaderData({ ...headerData, links: newLinks });
  };

  const handleImageUpload = async (file: File, isHeader: boolean) => {
    try {
      const base64 = await compressImage(file);
      if (isHeader) {
        setHeaderData({ ...headerData, logoUrl: base64 });
      } else {
        setFooterData({ ...footerData, logoUrl: base64 });
      }
    } catch (e) {
      console.error("Error uploading image to media:", e);
      alert("Görsel yüklenirken bir hata oluştu: " + ((e as any).message || "Bilinmeyen hata"));
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 text-slate-900">Görünüm & Menü</h1>
            <p className="text-slate-500 text-sm">Site üst (header) ve alt (footer) kısımlarını düzenleyin.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('header')} 
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'header' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Layout className="w-4 h-4" /> Header & Menü
          </button>
          <button 
            onClick={() => setActiveTab('announcement')} 
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'announcement' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Megaphone className="w-4 h-4" /> Duyuru Bandı
          </button>
          <button 
            onClick={() => setActiveTab('footer')} 
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'footer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Footer
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {activeTab === 'announcement' && (
            <div className="p-6 md:p-8 space-y-8">
              {/* Top Banner Header & Toggle */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      Duyuru Bandı Durumu
                      {announcementData.announcementActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Yayında (Aktif)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          Pasif (Gizli)
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      Sitenizin en üstünde (header üstünde) öne çıkan başvuru, sınav, kayıt veya özel duyurularınızı sergileyin.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs shrink-0 self-start md:self-auto">
                  <span className="text-xs font-bold text-slate-700">Görünürlük:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementData.announcementActive}
                      onChange={(e) => setAnnouncementData({ ...announcementData, announcementActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className={`text-xs font-black ${announcementData.announcementActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {announcementData.announcementActive ? 'AÇIK' : 'KAPALI'}
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-400" /> Sitede Nasıl Görünecek? (Canlı Önizleme)
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Anlık Güncellenir</span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 p-4 shadow-inner">
                  {announcementData.announcementActive ? (
                    <div className="space-y-3">
                      {/* Announcement Bar Preview */}
                      <div
                        className="w-full py-2.5 px-4 text-xs font-bold text-center flex flex-wrap items-center justify-center gap-3 rounded-xl shadow-xs transition-all"
                        style={{
                          backgroundColor: announcementData.announcementBgColor || '#0a192f',
                          color: announcementData.announcementTextColor || '#ffffff'
                        }}
                      >
                        <div className="flex items-center gap-2 max-w-xl truncate">
                          {announcementData.announcementIcon !== 'none' && announcementData.announcementIcon !== '' && (
                            <span className="shrink-0">{announcementData.announcementIcon ?? '📢'}</span>
                          )}
                          <span className="truncate">{announcementData.announcementText || 'Duyuru metni buraya gelecek...'}</span>
                        </div>
                        {announcementData.announcementButtonText && (
                          <span className="px-3 py-1 bg-white text-slate-900 rounded-md text-[11px] font-black shrink-0 shadow-xs flex items-center gap-1">
                            <span>{announcementData.announcementButtonText}</span>
                            <span>→</span>
                          </span>
                        )}
                      </div>

                      {/* Mock Header Preview underneath */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between opacity-80">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-slate-200"></div>
                          <div className="text-xs font-bold text-slate-600">Dost Koleji Logo</div>
                        </div>
                        <div className="flex gap-4 text-xs font-medium text-slate-400">
                          <span>Hakkımızda</span>
                          <span>Akademik</span>
                          <span>İletişim</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs font-bold">
                      🚫 Duyuru bandı pasif konumda. Sitede ziyaretçilere görünmeyecektir.
                    </div>
                  )}
                </div>
              </div>

              {/* Content Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Announcement Icon Selection */}
                <div className="col-span-1 md:col-span-2 space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <span>Duyuru İkonu / Emoji</span>
                      {announcementData.announcementIcon && announcementData.announcementIcon !== 'none' ? (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[11px] font-bold">
                          {announcementData.announcementIcon} Seçili
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[11px] font-bold">
                          İkon Yok (Sadece Metin)
                        </span>
                      )}
                    </label>

                    {announcementData.announcementIcon && announcementData.announcementIcon !== 'none' && (
                      <button
                        type="button"
                        onClick={() => setAnnouncementData({ ...announcementData, announcementIcon: 'none' })}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> İkonu Kaldır / Sil
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">Hazır İkonlar:</span>
                    {[
                      { icon: '📢', label: 'Megafon' },
                      { icon: '🎉', label: 'Kutlama' },
                      { icon: '🔔', label: 'Zil' },
                      { icon: '🔥', label: 'Fırsat' },
                      { icon: '⭐', label: 'Yıldız' },
                      { icon: '🚀', label: 'Roket' },
                      { icon: '🎓', label: 'Eğitim' },
                      { icon: '🏆', label: 'Başarı' },
                      { icon: 'none', label: '🚫 İkon Yok' },
                    ].map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setAnnouncementData({ ...announcementData, announcementIcon: item.icon })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                          (announcementData.announcementIcon || '📢') === item.icon
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.icon !== 'none' ? item.icon : ''}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 shrink-0">Özel Emoji Girin:</span>
                    <input
                      type="text"
                      value={announcementData.announcementIcon === 'none' ? '' : (announcementData.announcementIcon || '')}
                      onChange={(e) => setAnnouncementData({ ...announcementData, announcementIcon: e.target.value.trim() || 'none' })}
                      placeholder="İstediğiniz emojiyi kopyalayıp yapıştırın (ör: 🏫, ✏️, 🎯)"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Duyuru Metni
                  </label>
                  <input
                    type="text"
                    value={announcementData.announcementText || ''}
                    onChange={(e) => setAnnouncementData({ ...announcementData, announcementText: e.target.value })}
                    placeholder="🎉 2026 - 2027 Eğitim Öğretim Yılı Erken Kayıt Fırsatları Başladı!"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400">Duyuru bandında görüntülenecek ana metin mesajı.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Buton Metni (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    value={announcementData.announcementButtonText || ''}
                    onChange={(e) => setAnnouncementData({ ...announcementData, announcementButtonText: e.target.value })}
                    placeholder="Başvuru Yap veya Detaylı Bilgi"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400">Boş bırakırsanız sadece metin görünür, buton kaldırılır.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Buton Yönlendirme Linki (URL)
                  </label>
                  {renderUrlEditor(announcementData.announcementButtonUrl || '', (val) => setAnnouncementData({ ...announcementData, announcementButtonUrl: val }))}
                  <p className="text-[11px] text-slate-400">Ziyaretçi butona tıklandığında açılacak sayfa adresi.</p>
                </div>

                {/* Background Color Picker & Presets */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Arka Plan Rengi
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={announcementData.announcementBgColor || '#0a192f'}
                      onChange={(e) => setAnnouncementData({ ...announcementData, announcementBgColor: e.target.value })}
                      className="w-11 h-11 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={announcementData.announcementBgColor || '#0a192f'}
                      onChange={(e) => setAnnouncementData({ ...announcementData, announcementBgColor: e.target.value })}
                      placeholder="#0a192f"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Hızlı Renk Şablonları:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Lacivert', hex: '#0a192f' },
                        { name: 'Gece Mavisi', hex: '#0f172a' },
                        { name: 'Canlı Mavi', hex: '#1d4ed8' },
                        { name: 'Zümrüt Yeşil', hex: '#047857' },
                        { name: 'Koyu Kırmızı', hex: '#991b1b' },
                        { name: 'Bordo', hex: '#881337' },
                        { name: 'Turuncu', hex: '#c2410c' }
                      ].map((preset) => (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => setAnnouncementData({ ...announcementData, announcementBgColor: preset.hex })}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:scale-105 transition-all shadow-2xs"
                          style={{
                            borderColor: announcementData.announcementBgColor === preset.hex ? '#3b82f6' : '#e2e8f0',
                            backgroundColor: preset.hex,
                            color: '#ffffff'
                          }}
                        >
                          <span>{preset.name}</span>
                          {announcementData.announcementBgColor === preset.hex && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Color Picker & Presets */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Metin & İkon Rengi
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={announcementData.announcementTextColor || '#ffffff'}
                      onChange={(e) => setAnnouncementData({ ...announcementData, announcementTextColor: e.target.value })}
                      className="w-11 h-11 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={announcementData.announcementTextColor || '#ffffff'}
                      onChange={(e) => setAnnouncementData({ ...announcementData, announcementTextColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Metin Rengi Şablonları:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Beyaz', hex: '#ffffff' },
                        { name: 'Açık Sarı', hex: '#fef08a' },
                        { name: 'Açık Mavi', hex: '#e0f2fe' }
                      ].map((preset) => (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => setAnnouncementData({ ...announcementData, announcementTextColor: preset.hex })}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:scale-105 transition-all shadow-2xs bg-slate-800 text-white"
                          style={{
                            borderColor: announcementData.announcementTextColor === preset.hex ? '#3b82f6' : '#475569'
                          }}
                        >
                          <span style={{ color: preset.hex }}>● {preset.name}</span>
                          {announcementData.announcementTextColor === preset.hex && <Check className="w-3 h-3 text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'header' && (
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-slate-400" /> Logo & Buton</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo Yükle</label>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {headerData.logoUrl && <PreviewImage src={headerData.logoUrl} alt="Logo" className="h-12 object-contain bg-slate-100 p-2 rounded border" />}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => setHeaderData({ ...headerData, logoUrl: url }) })}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" /> Kütüphaneden Seç
                        </button>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} className="text-xs" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo Boyutu (Yükseklik: {headerData.logoHeight || 48}px)</label>
                      <input 
                        type="range" min="20" max="120" 
                        value={headerData.logoHeight || 48} 
                        onChange={(e) => setHeaderData({...headerData, logoHeight: parseInt(e.target.value)})} 
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <input 
                        type="checkbox" 
                        id="ctaHidden" 
                        checked={headerData.ctaButton?.hidden || false} 
                        onChange={(e) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, hidden: e.target.checked}})} 
                        className="rounded text-blue-600 w-4 h-4 cursor-pointer" 
                      />
                      <label htmlFor="ctaHidden" className="text-sm font-bold text-slate-700 cursor-pointer select-none flex-1">Aksiyon Butonunu Gizle</label>
                    </div>
                    <div className={headerData.ctaButton?.hidden ? 'opacity-50 pointer-events-none' : ''}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aksiyon Butonu Metni</label>
                      <input type="text" value={headerData.ctaButton?.label || ''} onChange={(e) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, label: e.target.value}})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div className={headerData.ctaButton?.hidden ? 'opacity-50 pointer-events-none' : ''}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aksiyon Butonu Linki</label>
                      {renderUrlEditor(headerData.ctaButton?.url || "", (val) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, url: val}}))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2"><Layout className="w-5 h-5 text-slate-400" /> Menü Yazı Tipi (Global)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-slate-700 mb-4">Üst Menü (Ana Linkler)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Boyutu</label>
                        <select 
                          value={headerData.menuTypography?.topMenuFontSize || 'text-sm'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), topMenuFontSize: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="text-xs">Çok Küçük (text-xs)</option>
                          <option value="text-sm">Küçük (text-sm)</option>
                          <option value="text-base">Normal (text-base)</option>
                          <option value="text-lg">Büyük (text-lg)</option>
                          <option value="text-xl">Çok Büyük (text-xl)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Kalınlığı</label>
                        <select 
                          value={headerData.menuTypography?.topMenuFontWeight || 'font-bold'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), topMenuFontWeight: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="font-normal">Normal</option>
                          <option value="font-medium">Orta (Medium)</option>
                          <option value="font-semibold">Yarı Kalın (Semibold)</option>
                          <option value="font-bold">Kalın (Bold)</option>
                          <option value="font-black">Çok Kalın (Black)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-slate-700 mb-4">Alt Menü (Mega Menü Linkleri)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Boyutu</label>
                        <select 
                          value={headerData.menuTypography?.subMenuFontSize || 'text-sm'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), subMenuFontSize: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="text-xs">Çok Küçük (text-xs)</option>
                          <option value="text-sm">Küçük (text-sm)</option>
                          <option value="text-base">Normal (text-base)</option>
                          <option value="text-lg">Büyük (text-lg)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yazı Kalınlığı</label>
                        <select 
                          value={headerData.menuTypography?.subMenuFontWeight || 'font-medium'} 
                          onChange={(e) => setHeaderData({...headerData, menuTypography: {...(headerData.menuTypography || {}), subMenuFontWeight: e.target.value}})}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="font-normal">Normal</option>
                          <option value="font-medium">Orta (Medium)</option>
                          <option value="font-semibold">Yarı Kalın (Semibold)</option>
                          <option value="font-bold">Kalın (Bold)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2"><Layout className="w-5 h-5 text-slate-400" /> Menü Renkleri (Global)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Normal Renk</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={headerData.menuColors?.normal || '#475569'} onChange={(e) => setHeaderData({...headerData, menuColors: {...(headerData.menuColors || {}), normal: e.target.value}})} className="w-10 h-10 rounded cursor-pointer p-0.5 bg-white border border-slate-200" />
                      <input type="text" value={headerData.menuColors?.normal || '#475569'} onChange={(e) => setHeaderData({...headerData, menuColors: {...(headerData.menuColors || {}), normal: e.target.value}})} className="w-full px-3 py-2 border rounded-lg text-sm uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hover Rengi</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={headerData.menuColors?.hover || '#2563eb'} onChange={(e) => setHeaderData({...headerData, menuColors: {...(headerData.menuColors || {}), hover: e.target.value}})} className="w-10 h-10 rounded cursor-pointer p-0.5 bg-white border border-slate-200" />
                      <input type="text" value={headerData.menuColors?.hover || '#2563eb'} onChange={(e) => setHeaderData({...headerData, menuColors: {...(headerData.menuColors || {}), hover: e.target.value}})} className="w-full px-3 py-2 border rounded-lg text-sm uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aktif Renk</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={headerData.menuColors?.active || '#1d4ed8'} onChange={(e) => setHeaderData({...headerData, menuColors: {...(headerData.menuColors || {}), active: e.target.value}})} className="w-10 h-10 rounded cursor-pointer p-0.5 bg-white border border-slate-200" />
                      <input type="text" value={headerData.menuColors?.active || '#1d4ed8'} onChange={(e) => setHeaderData({...headerData, menuColors: {...(headerData.menuColors || {}), active: e.target.value}})} className="w-full px-3 py-2 border rounded-lg text-sm uppercase" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Menu className="w-5 h-5 text-slate-400" /> Ana Menü Öğeleri</h3>
                  <button onClick={addHeaderLink} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                    <Plus className="w-4 h-4" /> Ekle
                  </button>
                </div>
                
                
                <div className="space-y-6">
                  {(headerData.links || []).map((link: any, index: number) => (
                    <div key={index} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          
                          <div className="flex flex-col gap-1 mr-2">
                            <button onClick={() => {
                                const newLinks = [...(headerData.links || [])];
                                if (index > 0) {
                                  const temp = newLinks[index - 1];
                                  newLinks[index - 1] = newLinks[index];
                                  newLinks[index] = temp;
                                  setHeaderData({ ...headerData, links: newLinks });
                                }
                            }} disabled={index === 0} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                                const newLinks = [...(headerData.links || [])];
                                if (index < newLinks.length - 1) {
                                  const temp = newLinks[index + 1];
                                  newLinks[index + 1] = newLinks[index];
                                  newLinks[index] = temp;
                                  setHeaderData({ ...headerData, links: newLinks });
                                }
                            }} disabled={index === (headerData.links || []).length - 1} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <input type="text" value={link.label || ''} onChange={(e) => handleHeaderLinkChange(index, 'label', e.target.value)} placeholder="Menü Adı" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                            {renderUrlEditor(link.url || "", (val) => handleHeaderLinkChange(index, "url", val))}
                          </div>
                          <select 
                            value={link.type || 'normal'} 
                            onChange={(e) => handleHeaderLinkChange(index, 'type', e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                          >
                            <option value="normal">Normal Menü</option>
                            <option value="dropdown">Açılır Menü (Dropdown)</option>
                            <option value="mega">Mega Menü</option>
                          </select>
                          <button onClick={() => removeHeaderLink(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 border-t border-slate-200 pt-3">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Menü İkonu (İsteğe Bağlı)</label>
                          <IconField value={link.iconData || ''} onChange={(val) => handleHeaderLinkChange(index, 'iconData', val)} showAdvanced={true} />
                        </div>
                      </div>
                      
                      {link.type === 'dropdown' && (
                        <div className="pl-4 border-l-2 border-blue-200 space-y-3 mt-4">
                           <div className="flex justify-between items-center mb-2">
                             <h4 className="text-sm font-bold text-slate-700">Alt Menüler</h4>
                             <button onClick={() => {
                               const newLinks = [...(headerData.links || [])];
                               if (!newLinks[index].subLinks) newLinks[index].subLinks = [];
                               newLinks[index].subLinks.push({ label: 'Yeni Link', url: '#' });
                               setHeaderData({ ...headerData, links: newLinks });
                             }} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">Link Ekle</button>
                           </div>
                           <div className="space-y-2">
                             {(link.subLinks || []).map((sublink: any, subIdx: number) => (
                               <div key={subIdx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded items-center">
                                 
                                 <div className="flex flex-col gap-1 shrink-0 mr-1">
                                    <button onClick={() => {
                                      const newLinks = [...(headerData.links || [])];
                                      if (subIdx > 0) {
                                        const temp = newLinks[index].subLinks[subIdx - 1];
                                        newLinks[index].subLinks[subIdx - 1] = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }
                                    }} disabled={subIdx === 0} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                        <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => {
                                      const newLinks = [...(headerData.links || [])];
                                      if (subIdx < newLinks[index].subLinks.length - 1) {
                                        const temp = newLinks[index].subLinks[subIdx + 1];
                                        newLinks[index].subLinks[subIdx + 1] = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }
                                    }} disabled={subIdx === (headerData.links?.[index]?.subLinks?.length || 0) - 1} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                        <ArrowDown className="w-3 h-3" />
                                    </button>
                                 </div>

                                 <div className="flex flex-col gap-1 w-full flex-1">
                                   <button 
                                      onClick={() => {
                                        if (subIdx === 0) return;
                                        const newLinks = [...(headerData.links || [])];
                                        const temp = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = newLinks[index].subLinks[subIdx - 1];
                                        newLinks[index].subLinks[subIdx - 1] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }} 
                                      disabled={subIdx === 0}
                                      className={`p-0.5 rounded ${subIdx === 0 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100'}`}>
                                      <ChevronUp className="w-3.5 h-3.5" />
                                   </button>
                                   <button 
                                      onClick={() => {
                                        if (subIdx === link.subLinks.length - 1) return;
                                        const newLinks = [...(headerData.links || [])];
                                        const temp = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = newLinks[index].subLinks[subIdx + 1];
                                        newLinks[index].subLinks[subIdx + 1] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }} 
                                      disabled={subIdx === link.subLinks.length - 1}
                                      className={`p-0.5 rounded ${subIdx === link.subLinks.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100'}`}>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                   </button>
                                 </div>
                                 <input type="text" value={sublink.label || ''} onChange={(e) => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks[subIdx].label = e.target.value;
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} placeholder="Link Adı" className="w-1/3 px-2 py-1 text-xs border rounded" />
                                 <div className="flex-1">
                                   {renderUrlEditor(sublink.url || '', (val) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].subLinks[subIdx].url = val;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   })}
                                 </div>
                                 <button onClick={() => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks.splice(subIdx, 1);
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} className="p-1.5 text-red-500 hover:bg-red-50 rounded bg-red-50/50">
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                      
                      {link.type === 'mega' && (
                        <div className="pl-4 border-l-2 border-blue-200 space-y-6 mt-4">
                           <div className="flex justify-between items-center">
                             <h4 className="text-sm font-bold text-slate-700">Mega Menü Sütunları</h4>
                             <button onClick={() => {
                               const newLinks = [...(headerData.links || [])];
                               if (!newLinks[index].megaMenu) newLinks[index].megaMenu = { columns: [], featured: {} };
                               if (!newLinks[index].megaMenu.columns) newLinks[index].megaMenu.columns = [];
                               newLinks[index].megaMenu.columns.push({ title: 'Yeni Sütun', links: [] });
                               setHeaderData({ ...headerData, links: newLinks });
                             }} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">Sütun Ekle</button>
                           </div>
                           
                           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                             {(link.megaMenu?.columns || []).map((col: any, colIdx: number) => (
                               <div key={colIdx} className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                                  <div className="flex gap-2">
                                    <input type="text" value={col.title || ''} onChange={(e) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].megaMenu.columns[colIdx].title = e.target.value;
                                      setHeaderData({ ...headerData, links: newLinks });
                                    }} placeholder="Sütun Başlığı" className="flex-1 px-3 py-1.5 border rounded text-sm font-bold" />
                                    <button onClick={() => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].megaMenu.columns.splice(colIdx, 1);
                                      setHeaderData({ ...headerData, links: newLinks });
                                    }} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-2">
                                    <h5 className="text-[11px] font-bold text-slate-500 uppercase">Sütun Görseli (Opsiyonel)</h5>
                                    <div className="flex gap-2">
                                      <input type="text" value={col.image || ''} onChange={(e) => {
                                        const newLinks = [...(headerData.links || [])];
                                        newLinks[index].megaMenu.columns[colIdx].image = e.target.value;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }} placeholder="Görsel URL (Örn: /img.jpg)" className="flex-1 px-2 py-1.5 text-xs border rounded" />
                                      <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => {
                                        const newLinks = [...(headerData.links || [])];
                                        newLinks[index].megaMenu.columns[colIdx].image = url;
                                        setHeaderData({ ...headerData, links: newLinks });
                                        setMediaPickerConfig({ isOpen: false, onSelect: () => {} });
                                      }})} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded border border-blue-200 hover:bg-blue-100 flex items-center gap-1 shrink-0">
                                        <ImageIcon className="w-3.5 h-3.5" /> Seç
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                      <div>
                                        <label className="block text-[10px] text-slate-500 mb-0.5">Konum</label>
                                        <select value={col.imagePosition || 'top'} onChange={(e) => {
                                          const newLinks = [...(headerData.links || [])];
                                          newLinks[index].megaMenu.columns[colIdx].imagePosition = e.target.value;
                                          setHeaderData({ ...headerData, links: newLinks });
                                        }} className="w-full px-2 py-1 text-xs border rounded">
                                          <option value="top">Başlık ile Menü Arası</option>
                                          <option value="bottom">Menünün Altı</option>
                                          <option value="left">Menünün Solu</option>
                                          <option value="right">Menünün Sağı</option>
                                        </select>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[10px] text-slate-500 mb-0.5">Büyütme % ({col.imageScale || 100})</label>
                                          <input type="range" min="10" max="300" value={col.imageScale || 100} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].imageScale = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                          }} className="w-full" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-500 mb-0.5">X Konumu ({col.imageX || 0}px)</label>
                                          <input type="range" min="-300" max="300" value={col.imageX || 0} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].imageX = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                          }} className="w-full" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-500 mb-0.5">Y Konumu ({col.imageY || 0}px)</label>
                                          <input type="range" min="-300" max="300" value={col.imageY || 0} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].imageY = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                          }} className="w-full" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-500 mb-0.5">Genişlik (px, boş=Varsayılan)</label>
                                          <input type="number" value={col.imageWidth || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].imageWidth = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                          }} className="w-full px-2 py-1 text-xs border rounded" placeholder="100%" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-500 mb-0.5">Yükseklik (px, boş=Varsayılan)</label>
                                          <input type="number" value={col.imageHeight || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].imageHeight = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                          }} className="w-full px-2 py-1 text-xs border rounded" placeholder="Oto" />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {col.image && (
                                      <div className="mt-2 border border-slate-200 rounded p-2 bg-white">
                                        <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Canlı Önizleme</p>
                                        <div className="relative overflow-hidden rounded bg-slate-50 border border-slate-200" style={{ 
                                          width: col.imageWidth ? `${col.imageWidth}px` : '100%',
                                          height: col.imageHeight ? `${col.imageHeight}px` : '120px', 
                                          minHeight: '80px' 
                                        }}>
                                          <PreviewImage src={col.image} alt="Önizleme" className="absolute max-w-none" style={{
                                            width: `${col.imageScale || 100}%`,
                                            left: `${col.imageX || 0}px`,
                                            top: `${col.imageY || 0}px`,
                                          }} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    {(col.links || []).map((clink: any, clinkIdx: number) => (
                                      <div key={clinkIdx} className="bg-slate-50 p-2 rounded border border-slate-100 relative">
                                         <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-1">
                                              <button 
                                                onClick={() => {
                                                  if (clinkIdx === 0) return;
                                                  const newLinks = [...(headerData.links || [])];
                                                  const temp = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx] = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx - 1];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx - 1] = temp;
                                                  setHeaderData({ ...headerData, links: newLinks });
                                                }}
                                                disabled={clinkIdx === 0}
                                                className={`p-1 rounded ${clinkIdx === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-200'}`}>
                                                <ChevronUp className="w-3.5 h-3.5" />
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  if (clinkIdx === col.links.length - 1) return;
                                                  const newLinks = [...(headerData.links || [])];
                                                  const temp = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx] = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx + 1];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx + 1] = temp;
                                                  setHeaderData({ ...headerData, links: newLinks });
                                                }}
                                                disabled={clinkIdx === col.links.length - 1}
                                                className={`p-1 rounded ${clinkIdx === col.links.length - 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-200'}`}>
                                                <ChevronDown className="w-3.5 h-3.5" />
                                              </button>
                                              <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Sıra: {clinkIdx + 1}</span>
                                            </div>
                                            <button onClick={() => {
                                                const newLinks = [...(headerData.links || [])];
                                                newLinks[index].megaMenu.columns[colIdx].links.splice(clinkIdx, 1);
                                                setHeaderData({ ...headerData, links: newLinks });
                                            }} className="bg-red-50 text-red-600 p-1.5 rounded hover:bg-red-100 transition-colors flex items-center gap-1">
                                              <Trash2 className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold uppercase">Sil</span>
                                            </button>
                                         </div>
                                         <input type="text" value={clink.label || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].label = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="Link Adı" className="w-full px-2 py-1 mb-1 text-xs border rounded" />
                                         {renderUrlEditor(clink.url || "", (val) => { const newLinks = [...(headerData.links || [])]; newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].url = val; setHeaderData({ ...headerData, links: newLinks }); })}
                                         <input type="text" value={clink.desc || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].desc = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="Kısa Açıklama (Opsiyonel)" className="w-full px-2 py-1 mb-1 text-xs border rounded mt-1" />
                                         <input type="text" value={clink.icon || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].icon = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="İkon (Opsiyonel, örn: school)" className="w-full px-2 py-1 text-xs border rounded mt-1" />
                                      </div>
                                    ))}
                                    <button onClick={() => {
                                      const newLinks = [...(headerData.links || [])];
                                      if (!newLinks[index].megaMenu.columns[colIdx].links) newLinks[index].megaMenu.columns[colIdx].links = [];
                                      newLinks[index].megaMenu.columns[colIdx].links.push({ label: 'Yeni Link', url: '#' });
                                      setHeaderData({ ...headerData, links: newLinks });
                                    }} className="w-full py-1.5 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
                                      + Alt Link Ekle
                                    </button>
                                  </div>
                               </div>
                             ))}
                           </div>
                           
                           <div className="bg-white p-4 rounded-lg border border-slate-200">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold text-slate-700">Öne Çıkan Kart (Opsiyonel)</h4>
                                <label className="flex items-center gap-2 text-xs">
                                  <input type="checkbox" checked={!!link.megaMenu?.featured?.title} onChange={(e) => {
                                    const newLinks = [...(headerData.links || [])];
                                    if (!newLinks[index].megaMenu) newLinks[index].megaMenu = { columns: [], featured: {} };
                                    if (e.target.checked) {
                                      newLinks[index].megaMenu.featured = { title: 'Öne Çıkan', desc: '', url: '#', buttonText: 'İncele' };
                                    } else {
                                      newLinks[index].megaMenu.featured = {};
                                    }
                                    setHeaderData({ ...headerData, links: newLinks });
                                  }} className="rounded" />
                                  Aktif
                                </label>
                              </div>
                              {link.megaMenu?.featured?.title !== undefined && (
                                <div className="grid grid-cols-2 gap-4">
                                   <input type="text" value={link.megaMenu.featured.title || ''} onChange={(e) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].megaMenu.featured.title = e.target.value;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   }} placeholder="Başlık" className="px-3 py-2 text-sm border rounded" />
                                   <input type="text" value={link.megaMenu.featured.desc || ''} onChange={(e) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].megaMenu.featured.desc = e.target.value;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   }} placeholder="Açıklama" className="px-3 py-2 text-sm border rounded" />
                                   {renderUrlEditor(link.megaMenu.featured.url || "", (val) => { const newLinks = [...(headerData.links || [])]; newLinks[index].megaMenu.featured.url = val; setHeaderData({ ...headerData, links: newLinks }); })}
                                   <input type="text" value={link.megaMenu.featured.buttonText || ''} onChange={(e) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].megaMenu.featured.buttonText = e.target.value;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   }} placeholder="Buton Metni" className="px-3 py-2 text-sm border rounded" />
                                   <div className="col-span-2">
                                     <input type="text" value={link.megaMenu.featured.image || ''} onChange={(e) => {
                                        const newLinks = [...(headerData.links || [])];
                                        newLinks[index].megaMenu.featured.image = e.target.value;
                                        setHeaderData({ ...headerData, links: newLinks });
                                     }} placeholder="Arka Plan Görseli URL" className="w-full px-3 py-2 text-sm border rounded" />
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!headerData.links || headerData.links.length === 0) && (
                     <div className="text-center p-4 text-sm text-slate-500">Menü öğesi bulunmuyor.</div>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="p-6 space-y-8">
              
              {/* 1. Marka & Logo Yönetimi */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" /> Marka & Logo Yönetimi
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                    <input 
                      type="checkbox" 
                      checked={!!footerData.hideBrand} 
                      onChange={(e) => setFooterData({ ...footerData, hideBrand: e.target.checked })} 
                      className="rounded text-blue-600 w-4 h-4" 
                    />
                    Marka Bölümünü Gizle
                  </label>
                </div>

                <div className={footerData.hideBrand ? 'opacity-50 pointer-events-none' : ''}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Footer Logo</label>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {footerData.logoUrl && (
                          <PreviewImage src={footerData.logoUrl} 
                            alt="Logo" 
                            className="h-12 object-contain bg-slate-800 p-2 rounded border border-slate-700" 
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => setFooterData({ ...footerData, logoUrl: url }) })}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" /> Kütüphaneden Seç
                          </button>
                          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} className="text-xs" />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                          Logo Yüksekliği: {footerData.logoHeight || 64}px
                        </label>
                        <input 
                          type="range" min="20" max="120" 
                          value={footerData.logoHeight || 64} 
                          onChange={(e) => setFooterData({...footerData, logoHeight: parseInt(e.target.value)})} 
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Marka Adı</label>
                        <input 
                          type="text" 
                          value={footerData.brandName || ''} 
                          onChange={(e) => setFooterData({...footerData, brandName: e.target.value})} 
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium" 
                          placeholder="Dost Koleji"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Marka Açıklaması</label>
                      <textarea 
                        value={footerData.brandDesc || ''} 
                        onChange={(e) => setFooterData({...footerData, brandDesc: e.target.value})} 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-36 resize-none font-medium"
                        placeholder="Kurum ile ilgili kısa alt bilgi açıklaması..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. E-Bülten Kaydı Kartı */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-blue-600" /> E-Bülten Abonelik Kartı
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                    <input 
                      type="checkbox" 
                      checked={!!footerData.newsletterHidden} 
                      onChange={(e) => setFooterData({ ...footerData, newsletterHidden: e.target.checked })} 
                      className="rounded text-blue-600 w-4 h-4" 
                    />
                    Kartı Gizle
                  </label>
                </div>

                <div className={footerData.newsletterHidden ? 'opacity-50 pointer-events-none space-y-4' : 'space-y-4'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Başlık</label>
                      <input type="text" value={footerData.newsletterTitle || ''} onChange={(e) => setFooterData({...footerData, newsletterTitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="E-Bülten Kaydı" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Açıklama</label>
                      <input type="text" value={footerData.newsletterDesc || ''} onChange={(e) => setFooterData({...footerData, newsletterDesc: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Gelişmelerden haberdar olmak için abone olun." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Giriş Alanı Yer Tutucusu</label>
                      <input type="text" value={footerData.newsletterPlaceholder || ''} onChange={(e) => setFooterData({...footerData, newsletterPlaceholder: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="E-posta adresiniz" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buton Metni</label>
                      <input type="text" value={footerData.newsletterButtonText || ''} onChange={(e) => setFooterData({...footerData, newsletterButtonText: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Kaydol" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kart Arka Plan Rengi</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={footerData.newsletterBgColor || '#ffffff'} 
                          onChange={(e) => setFooterData({...footerData, newsletterBgColor: e.target.value})}
                          className="w-8 h-8 p-0 border border-slate-300 rounded cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={footerData.newsletterBgColor || '#ffffff'} 
                          onChange={(e) => setFooterData({...footerData, newsletterBgColor: e.target.value})}
                          className="w-full px-3 py-1.5 border rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kart Metin Rengi</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={footerData.newsletterTextColor || '#0f172a'} 
                          onChange={(e) => setFooterData({...footerData, newsletterTextColor: e.target.value})}
                          className="w-8 h-8 p-0 border border-slate-300 rounded cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={footerData.newsletterTextColor || '#0f172a'} 
                          onChange={(e) => setFooterData({...footerData, newsletterTextColor: e.target.value})}
                          className="w-full px-3 py-1.5 border rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Menü Sütunları Yönetimi (Multi-Column CRUD) */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Menu className="w-4 h-4 text-blue-600" /> Menü Sütunları Yönetimi
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Sitede gösterilecek menü sütunlarını ve her sütunun altındaki bağlantıları düzenleyin.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const newCols = [...(footerData.columns || [])];
                      newCols.push({ title: 'Yeni Sütun', links: [{ label: 'Yeni Link', url: '#' }] });
                      setFooterData({...footerData, columns: newCols});
                    }} 
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Yeni Sütun Ekle
                  </button>
                </div>

                <div className="space-y-6">
                  {(footerData.columns || []).map((col: any, colIdx: number) => (
                    <div key={colIdx} className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                          <span className="text-xs font-extrabold bg-blue-100 text-blue-700 px-2 py-1 rounded">Sütun {colIdx + 1}</span>
                          <input 
                            type="text" 
                            value={col.title || ''} 
                            onChange={(e) => {
                              const newCols = [...(footerData.columns || [])];
                              newCols[colIdx].title = e.target.value;
                              setFooterData({...footerData, columns: newCols});
                            }} 
                            placeholder="Sütun Başlığı (ör: Kurumsal)" 
                            className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {colIdx > 0 && (
                            <button 
                              type="button"
                              onClick={() => {
                                const newCols = [...(footerData.columns || [])];
                                const temp = newCols[colIdx];
                                newCols[colIdx] = newCols[colIdx - 1];
                                newCols[colIdx - 1] = temp;
                                setFooterData({...footerData, columns: newCols});
                              }}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded font-bold"
                              title="Sütunu Yukarı Taşı"
                            >
                              ↑
                            </button>
                          )}
                          {colIdx < (footerData.columns || []).length - 1 && (
                            <button 
                              type="button"
                              onClick={() => {
                                const newCols = [...(footerData.columns || [])];
                                const temp = newCols[colIdx];
                                newCols[colIdx] = newCols[colIdx + 1];
                                newCols[colIdx + 1] = temp;
                                setFooterData({...footerData, columns: newCols});
                              }}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded font-bold"
                              title="Sütunu Aşağı Taşı"
                            >
                              ↓
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => {
                              const newCols = [...(footerData.columns || [])];
                              newCols.splice(colIdx, 1);
                              setFooterData({...footerData, columns: newCols});
                            }} 
                            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors border border-red-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Sütunu Sil
                          </button>
                        </div>
                      </div>

                      {/* Column Links List */}
                      <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sütun Linkleri ({col.links?.length || 0})</span>
                          <button 
                            type="button"
                            onClick={() => {
                              const newCols = [...(footerData.columns || [])];
                              if (!newCols[colIdx].links) newCols[colIdx].links = [];
                              newCols[colIdx].links.push({ label: 'Yeni Link', url: '#' });
                              setFooterData({...footerData, columns: newCols});
                            }} 
                            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                          >
                            + Link Ekle
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(col.links || []).map((link: any, linkIdx: number) => (
                            <div key={linkIdx} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <input 
                                type="text" 
                                value={link.label || ''} 
                                onChange={(e) => {
                                  const newCols = [...(footerData.columns || [])];
                                  newCols[colIdx].links[linkIdx].label = e.target.value;
                                  setFooterData({...footerData, columns: newCols});
                                }} 
                                placeholder="Link Adı" 
                                className="w-full md:w-1/3 px-3 py-1.5 text-xs font-semibold border rounded-lg bg-white" 
                              />
                              <div className="flex-1">
                                {renderUrlEditor(link.url || "", (val) => { 
                                  const newCols = [...(footerData.columns || [])]; 
                                  newCols[colIdx].links[linkIdx].url = val; 
                                  setFooterData({...footerData, columns: newCols}); 
                                })}
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newCols = [...(footerData.columns || [])];
                                  newCols[colIdx].links.splice(linkIdx, 1);
                                  setFooterData({...footerData, columns: newCols});
                                }} 
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg self-end md:self-auto"
                                title="Link Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {(!col.links || col.links.length === 0) && (
                            <p className="text-xs text-slate-400 italic py-1">Bu sütunda henüz link bulunmuyor.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!footerData.columns || footerData.columns.length === 0) && (
                    <div className="text-center p-6 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm">
                      Henüz menü sütunu eklenmemiş. Yukarıdaki butonla sütun ekleyebilirsiniz.
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Sosyal Medya Linkleri */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <LayoutTemplate className="w-4 h-4 text-blue-600" /> Sosyal Medya Hesapları
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Footer marka alanında görüntülenecek sosyal medya ve iletişim simgeleri.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const newSocial = [...(footerData.socialLinks || [])];
                      newSocial.push({ label: 'Instagram', url: 'https://instagram.com', icon: { name: 'Instagram' } });
                      setFooterData({...footerData, socialLinks: newSocial});
                    }} 
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Sosyal Medya Ekle
                  </button>
                </div>

                <div className="space-y-3">
                  {(footerData.socialLinks || []).map((item: any, sIdx: number) => (
                    <div key={sIdx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <input 
                          type="text" 
                          value={item.label || ''} 
                          onChange={(e) => {
                            const newSocial = [...(footerData.socialLinks || [])];
                            newSocial[sIdx].label = e.target.value;
                            setFooterData({...footerData, socialLinks: newSocial});
                          }} 
                          placeholder="Platform Adı (ör: Instagram)" 
                          className="w-full md:w-1/4 px-3 py-1.5 text-xs font-bold border rounded-lg" 
                        />
                        <div className="flex-1">
                          {renderUrlEditor(item.url || "", (val) => {
                            const newSocial = [...(footerData.socialLinks || [])];
                            newSocial[sIdx].url = val;
                            setFooterData({...footerData, socialLinks: newSocial});
                          })}
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newSocial = [...(footerData.socialLinks || [])];
                            newSocial.splice(sIdx, 1);
                            setFooterData({...footerData, socialLinks: newSocial});
                          }} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-end md:self-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sosyal Medya İkonu</label>
                        <IconField 
                          value={item.icon || ''} 
                          onChange={(val) => {
                            const newSocial = [...(footerData.socialLinks || [])];
                            newSocial[sIdx].icon = val;
                            setFooterData({...footerData, socialLinks: newSocial});
                          }} 
                          showAdvanced={false}
                        />
                      </div>
                    </div>
                  ))}
                  {(!footerData.socialLinks || footerData.socialLinks.length === 0) && (
                    <p className="text-xs text-slate-400 italic">Henüz sosyal medya hesabı eklenmemiş.</p>
                  )}
                </div>
              </div>

              {/* 5. Alt Bilgi (Copyright & Yasal Linkler) */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-3">Alt Bilgi (Copyright & Yasal Linkler)</h3>
                
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Copyright Metni</label>
                    <input 
                      type="text" 
                      value={footerData.copyright || ''} 
                      onChange={(e) => setFooterData({...footerData, copyright: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg text-sm font-medium" 
                      placeholder="© 2024 Dost Koleji. Tüm Hakları Saklıdır."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Yasal Linkler (KVKK, Çerez Politikası vb.)</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setFooterData({...footerData, legalLinks: [...(footerData.legalLinks || []), { label: 'Yeni Link', url: '#' }]});
                        }} 
                        className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100"
                      >
                        + Yasal Link Ekle
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(footerData.legalLinks || []).map((link: any, idx: number) => (
                        <div key={idx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg">
                          <input 
                            type="text" 
                            value={link.label || ''} 
                            onChange={(e) => {
                              const newLinks = [...(footerData.legalLinks || [])];
                              newLinks[idx].label = e.target.value;
                              setFooterData({...footerData, legalLinks: newLinks});
                            }} 
                            placeholder="Başlık (ör: KVKK Metni)" 
                            className="flex-1 px-3 py-1.5 border rounded text-xs font-medium" 
                          />
                          <div className="flex-1">
                            {renderUrlEditor(link.url || "", (val) => { 
                              const newLinks = [...(footerData.legalLinks || [])]; 
                              newLinks[idx].url = val; 
                              setFooterData({...footerData, legalLinks: newLinks}); 
                            })}
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newLinks = [...(footerData.legalLinks || [])];
                              newLinks.splice(idx, 1);
                              setFooterData({...footerData, legalLinks: newLinks});
                            }} 
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Renk & Stil Yönetimi (Anasayfa Yönetim Paneli Standartları) */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-3">Renk & Stil Teması</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Arka Plan Rengi</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={footerData.styles?.backgroundColor || footerData.backgroundColor || '#f8fafc'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          backgroundColor: e.target.value,
                          styles: { ...(footerData.styles || {}), backgroundColor: e.target.value }
                        })}
                        className="w-8 h-8 p-0 border rounded cursor-pointer shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={footerData.styles?.backgroundColor || footerData.backgroundColor || '#f8fafc'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          backgroundColor: e.target.value,
                          styles: { ...(footerData.styles || {}), backgroundColor: e.target.value }
                        })}
                        className="w-full px-2 py-1 border rounded text-xs font-mono" 
                      />
                    </div>
                    {/* Presets */}
                    <div className="flex gap-1.5 mt-2">
                      {[
                        { name: 'Açık Gri', hex: '#f8fafc' },
                        { name: 'Koyu Lacivert', hex: '#0f172a' },
                        { name: 'Gece Mavisi', hex: '#1e293b' },
                        { name: 'Beyaz', hex: '#ffffff' }
                      ].map((p, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          title={p.name}
                          onClick={() => setFooterData({
                            ...footerData,
                            backgroundColor: p.hex,
                            styles: { ...(footerData.styles || {}), backgroundColor: p.hex }
                          })}
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-sm transition-transform hover:scale-110"
                          style={{ backgroundColor: p.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Başlık Rengi</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={footerData.styles?.titleColor || footerData.titleColor || '#0f172a'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          titleColor: e.target.value,
                          styles: { ...(footerData.styles || {}), titleColor: e.target.value }
                        })}
                        className="w-8 h-8 p-0 border rounded cursor-pointer shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={footerData.styles?.titleColor || footerData.titleColor || '#0f172a'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          titleColor: e.target.value,
                          styles: { ...(footerData.styles || {}), titleColor: e.target.value }
                        })}
                        className="w-full px-2 py-1 border rounded text-xs font-mono" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Metin / Link Rengi</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={footerData.styles?.textColor || footerData.textColor || '#64748b'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          textColor: e.target.value,
                          styles: { ...(footerData.styles || {}), textColor: e.target.value }
                        })}
                        className="w-8 h-8 p-0 border rounded cursor-pointer shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={footerData.styles?.textColor || footerData.textColor || '#64748b'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          textColor: e.target.value,
                          styles: { ...(footerData.styles || {}), textColor: e.target.value }
                        })}
                        className="w-full px-2 py-1 border rounded text-xs font-mono" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kenarlık Rengi</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={footerData.styles?.borderColor || footerData.borderColor || '#e2e8f0'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          borderColor: e.target.value,
                          styles: { ...(footerData.styles || {}), borderColor: e.target.value }
                        })}
                        className="w-8 h-8 p-0 border rounded cursor-pointer shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={footerData.styles?.borderColor || footerData.borderColor || '#e2e8f0'} 
                        onChange={(e) => setFooterData({
                          ...footerData, 
                          borderColor: e.target.value,
                          styles: { ...(footerData.styles || {}), borderColor: e.target.value }
                        })}
                        className="w-full px-2 py-1 border rounded text-xs font-mono" 
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <MediaPickerModal 
         isOpen={mediaPickerConfig.isOpen} 
         onClose={() => setMediaPickerConfig({ isOpen: false, onSelect: () => {} })} 
         onSelect={(url) => { mediaPickerConfig.onSelect(url); }} 
      />
    </div>
  );
}
