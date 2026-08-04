import { resolveMediaUrls } from '../../lib/resolveMedia';
import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { extractAndSaveBase64Images } from '../../lib/imageCompressor';
import { PopupData } from '../../components/PopupOverlay';

const DEFAULT_POPUPS: PopupData[] = [
  {
    id: 'lgs-hazirlik-sinavi',
    name: 'LGS Hazırlık Sınavı',
    status: 'AKTİF',
    badgeText: 'BAŞVURULAR AÇIK',
    badgeColor: '#0606f9',
    title: 'LGS Hazırlık Sınavları Başladı!',
    description: 'Dost Koleji LGS hazırlık sınavları için başvurularınızı web sitemiz üzerinden online olarak yapabilirsiniz. Erken kayıt avantajlarını kaçırmayın.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7z1oXpXwhH7QTgZ2wgXtYlKXePoC_Sp6RZ6ZwL3DgCB_E4XQ8V0YBwI6liC5Cc4LPfygw0lt_Ufj3ybg6A3ZZpBK6rgmhfRGOdQ97rgjLcZf0GIVbfe_TLwh9cHTzg4TiXVKv8XGlHuBePsHfYNF6VDC9tKu1dB_9DNIaIIYeTxAA2BoGlzhJnDtrbGMSZNq9TnpKcOsMvCQgu24ZIMLDdmCkltvU6n9Ju0oRuO-IoyDSVA3ojWNzDQXD1Ii0EsJb4qoCWbQZKI',
    imagePosition: 'left',
    buttonText: 'Hemen Başvur',
    buttonUrl: '/bursluluk-basvuru-formu',
    onlyImage: false,
    popupSize: 'lg',
    triggerType: 'immediate',
    triggerDelay: 3,
    targetPages: 'all',
    onlyNewVisitors: false,
    frequency: 'always',
    style: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      buttonBgColor: '#0606f9',
      buttonTextColor: '#ffffff'
    }
  },
  {
    id: 'bursluluk-duyurusu',
    name: 'Bursluluk Duyurusu',
    status: 'PASİF',
    badgeText: 'BURSLULUK 2026',
    badgeColor: '#0606f9',
    title: 'Bursluluk ve Kabul Sınavı Kayıtları Açıldı',
    description: '2026 Bursluluk Sınavı başvuruları başlamıştır. Başvurunuzu tamamlayıp sınav giriş belgenizi hemen indirin.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcW18movsC69qnz9zpsbzsrJLWPy_Geo5sAAAi9nqoC0YE-bdMj0AiEUe-Z78NoFFBpFQy5UuXaMmRO0quff6khOovxlJfE1ptuTa38PqzHcJhVeJMUlPxZqHhxVw08UApxaSzgRKctOtlTu4DtjMgzPIZdZ0WMLs8KuA96cHwv2jaeSc1OpVg0rX0eqzr2iTpWL0N0C_Y9PkoQ7IeERePRqYH46NNAxWyoW03nr17RN7GXuwfevi2RYWTPiQtM4pg9fysMIgmkuk',
    imagePosition: 'left',
    buttonText: 'Sınav Başvurusu Yap',
    buttonUrl: '/bursluluk-basvuru-formu',
    onlyImage: false,
    popupSize: 'lg',
    triggerType: 'delay',
    triggerDelay: 5,
    targetPages: 'all',
    onlyNewVisitors: false,
    frequency: 'session',
    style: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      buttonBgColor: '#0606f9',
      buttonTextColor: '#ffffff'
    }
  },
  {
    id: 'veli-toplantisi',
    name: 'Veli Toplantısı',
    status: 'AKTİF',
    badgeText: 'ETKİNLİK DUYURUSU',
    badgeColor: '#059669',
    title: '2026 Veli Bilgilendirme Toplantısı',
    description: 'Yeni dönem akademisi, sosyal kulüpler ve eğitim vizyonumuz hakkında bilgi almak için toplantımıza davetlisiniz.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    imagePosition: 'left',
    buttonText: 'Detaylı Bilgi Al',
    buttonUrl: '/on-kayit',
    onlyImage: false,
    popupSize: 'lg',
    triggerType: 'exit_intent',
    triggerDelay: 0,
    targetPages: 'all',
    onlyNewVisitors: false,
    frequency: '24h',
    style: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      buttonBgColor: '#059669',
      buttonTextColor: '#ffffff'
    }
  }
];

export default function PopupCenter() {
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [selectedPopup, setSelectedPopup] = useState<PopupData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'style'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [pagesList, setPagesList] = useState<{ id: string; title: string; path: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Available Pages for Button Link Selector
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const snap = await getDocs(collection(db, 'pages'));
        const pages = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as any))
          .filter((p) => !p.isDeleted);
        
        const defaultPages = [
          { id: 'home', title: 'Ana Sayfa', path: '/' },
          { id: 'on-kayit', title: 'Öğrenci Ön Kayıt', path: '/on-kayit' },
          { id: 'kulup-kayit-formu', title: 'Kulüp Kayıt Formu', path: '/kulup-kayit-formu' },
          { id: 'bursluluk-basvuru-formu', title: 'Bursluluk Sınav Başvurusu', path: '/bursluluk-basvuru-formu' },
          { id: 'bursluluk-basvuru-onay', title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay' },
          { id: 'duyurular', title: 'Duyurular', path: '/duyurular' }
        ];

        const map = new Map();
        defaultPages.forEach((dp) => map.set(dp.path, dp));
        pages.forEach((p) => {
          const path = p.path || `/${p.id}`;
          map.set(path, { id: p.id, title: p.title || p.id, path });
        });

        setPagesList(Array.from(map.values()));
      } catch (e) {
        console.error('Error fetching pages:', e);
      }
    };
    fetchPages();
  }, []);

  // Fetch & Seed Popups Realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'popups'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const popup of DEFAULT_POPUPS) {
            await setDoc(doc(db, 'popups', popup.id), popup);
          }
        } catch (e) {
          console.error('Error seeding default popups:', e);
        }
      } else {
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PopupData));
        setPopups(fetched);

        setSelectedPopup((current) => {
          if (!current) return fetched[0] || null;
          const match = fetched.find((p) => p.id === current.id);
          return match ? { ...match, ...current } : current;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update selected popup locally
  const updateCurrentPopup = (fields: Partial<PopupData>) => {
    if (!selectedPopup) return;
    const updated = { ...selectedPopup, ...fields };
    setSelectedPopup(updated);
    setPopups((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const updateStyleField = (styleFields: Partial<NonNullable<PopupData['style']>>) => {
    if (!selectedPopup) return;
    const currentStyle = selectedPopup.style || {};
    const updatedStyle = { ...currentStyle, ...styleFields };
    updateCurrentPopup({ style: updatedStyle });
  };

  // Image Upload Handlers
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Lütfen 8MB\'dan küçük bir görsel seçin.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateCurrentPopup({ imageUrl: dataUrl });
        showToast('Görsel başarıyla eklendi!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Lütfen 8MB\'dan küçük bir görsel seçin.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          updateCurrentPopup({ imageUrl: dataUrl });
          showToast('Görsel başarıyla yüklendi!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save selected popup to Firestore
  const handleSave = async () => {
    if (!selectedPopup) return;
    setSaving(true);
    try {
      // Clear closed state so admin can test the saved popup in current browser session
      sessionStorage.removeItem(`dost_popup_closed_${selectedPopup.id}`);
      localStorage.removeItem(`dost_popup_closed_${selectedPopup.id}`);

      const popupToSave = await extractAndSaveBase64Images({
        ...selectedPopup,
        updatedAt: Date.now()
      }, db);

      await setDoc(doc(db, 'popups', selectedPopup.id), popupToSave);

      if (selectedPopup.status === 'AKTİF') {
        showToast('Popup kaydedildi ve CANLI SİTEDE YAYINLANDI!');
      } else {
        showToast(`Popup kaydedildi (Durum: ${selectedPopup.status}). Sitede görünmesi için 'AKTİF' yapın.`);
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Kaydetme sırasında bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Add New Popup - Instant Local + Firestore Sync
  const handleAddNew = async () => {
    const newId = `popup-${Date.now()}`;
    const newPopup: PopupData = {
      id: newId,
      name: 'Yeni Popup Kampanyası',
      status: 'AKTİF',
      badgeText: 'YENİ DUYURU',
      badgeColor: '#0606f9',
      title: 'LGS Hazırlık ve Kabul Sınavı',
      description: 'Dost Koleji LGS ve bursluluk sınavları için online başvurularınızı yapabilirsiniz.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7z1oXpXwhH7QTgZ2wgXtYlKXePoC_Sp6RZ6ZwL3DgCB_E4XQ8V0YBwI6liC5Cc4LPfygw0lt_Ufj3ybg6A3ZZpBK6rgmhfRGOdQ97rgjLcZf0GIVbfe_TLwh9cHTzg4TiXVKv8XGlHuBePsHfYNF6VDC9tKu1dB_9DNIaIIYeTxAA2BoGlzhJnDtrbGMSZNq9TnpKcOsMvCQgu24ZIMLDdmCkltvU6n9Ju0oRuO-IoyDSVA3ojWNzDQXD1Ii0EsJb4qoCWbQZKI',
      imagePosition: 'left',
      buttonText: 'Hemen Başvur',
      buttonUrl: '/bursluluk-basvuru-formu',
      onlyImage: false,
      popupSize: 'lg',
      triggerType: 'immediate',
      triggerDelay: 3,
      targetPages: 'all',
      onlyNewVisitors: false,
      frequency: 'session',
      style: {
        bgColor: '#ffffff',
        textColor: '#0f172a',
        buttonBgColor: '#0606f9',
        buttonTextColor: '#ffffff'
      }
    };

    setPopups((prev) => [newPopup, ...prev]);
    setSelectedPopup(newPopup);
    showToast('Yeni aktif popup oluşturuldu!');

    try {
      await setDoc(doc(db, 'popups', newId), newPopup);
    } catch (e) {
      console.error('Add new popup error:', e);
    }
  };

  // Delete Popup
  const handleDeletePopup = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistically update local state
    const remaining = popups.filter((p) => p.id !== id);
    setPopups(remaining);
    if (selectedPopup?.id === id) {
      setSelectedPopup(remaining[0] || null);
    }

    try {
      await deleteDoc(doc(db, 'popups', id));
      showToast('Popup başarıyla silindi.');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Popup yerel listeden kaldırıldı.');
    }
  };

  const getSizeClass = (size?: string) => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-xl';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'full': return 'max-w-5xl';
      default: return 'max-w-2xl';
    }
  };

  const getPreviewDimensions = (popup: PopupData, mode: 'desktop' | 'mobile') => {
    if (mode === 'mobile') {
      return { className: 'w-80', style: {} };
    }
    if (popup.popupSize === 'custom' || popup.customWidthPx) {
      const style: React.CSSProperties = {};
      if (popup.customWidthPx) {
        style.width = `${popup.customWidthPx}px`;
        style.maxWidth = '100%';
      } else {
        style.width = '600px';
      }
      if (popup.customHeightPx) {
        style.height = `${popup.customHeightPx}px`;
        style.maxHeight = '75vh';
        style.overflowY = 'auto';
      }
      return { className: '', style };
    }
    return { className: getSizeClass(popup.popupSize), style: {} };
  };

  const filteredPopups = popups.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f5f5f8] font-display text-slate-900 min-h-screen flex flex-col font-sans overflow-hidden">
      
      {/* Hidden File Input for Image Picker */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[9999] bg-[#002147] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <span className="material-symbols-outlined text-green-400">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-[#0606f9]/10 text-[#0606f9] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">layers</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">Dost Koleji | Popup Oluşturucu</h1>
            <p className="text-[11px] text-slate-400">Gelişmiş Popup ve Kampanya Yönetim Paneli</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowLivePreviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
            Canlı Önizleme
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#0606f9] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#0606f9]/20 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet & Yayınla'}
          </button>
        </div>
      </header>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Popup List */}
        <aside className="w-72 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0606f9]/20 outline-none"
                placeholder="Popup ara..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mevcut Popuplar ({filteredPopups.length})
            </div>

            {filteredPopups.map((popup) => {
              const isSelected = selectedPopup?.id === popup.id;
              const statusPill =
                popup.status === 'AKTİF'
                  ? 'bg-green-100 text-green-700'
                  : popup.status === 'PASİF'
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-amber-100 text-amber-700';

              return (
                <div
                  key={popup.id}
                  onClick={() => setSelectedPopup(popup)}
                  className={`group relative flex flex-col gap-1 p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#0606f9]/5 border-[#0606f9]/20 shadow-sm'
                      : 'hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold truncate max-w-[130px] ${isSelected ? 'text-[#0606f9]' : 'text-slate-800'}`}>
                      {popup.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${statusPill}`}>
                        {popup.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeletePopup(popup.id, e)}
                        title="Popup'ı Sil"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer opacity-80 group-hover:opacity-100 shrink-0"
                      >
                        <span className="material-symbols-outlined !text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5 truncate pr-2">
                    {popup.title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Yeni Popup Ekle
            </button>
          </div>
        </aside>

        {/* Central Canvas: Live Preview */}
        <main className="flex-1 bg-[#f5f5f8] relative flex flex-col overflow-hidden">
          
          {/* Header Bar in Canvas */}
          <div className="p-3 px-4 flex flex-wrap items-center justify-between bg-white/70 backdrop-blur-md border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Önizleme:</span>
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 rounded-md transition-all cursor-pointer ${
                    previewMode === 'desktop'
                      ? 'bg-white shadow-sm text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined !text-[15px]">desktop_windows</span>
                  Masaüstü
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 rounded-md transition-all cursor-pointer ${
                    previewMode === 'mobile'
                      ? 'bg-white shadow-sm text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined !text-[15px]">smartphone</span>
                  Mobil
                </button>
              </div>

              {selectedPopup && (
                <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                  <span className="text-xs font-bold text-slate-500 mr-1">DURUM:</span>
                  {(['AKTİF', 'PASİF', 'TASLAK'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateCurrentPopup({ status: st })}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all cursor-pointer border ${
                        selectedPopup.status === st
                          ? st === 'AKTİF'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : st === 'PASİF'
                            ? 'bg-slate-700 text-white border-slate-700'
                            : 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-xs font-medium text-slate-500 flex items-center gap-3">
              {selectedPopup?.onlyImage && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-md">
                  Sadece Görsel Modu
                </span>
              )}
              <span className="hidden sm:inline">
                Ebat:{' '}
                {selectedPopup?.popupSize === 'custom' || selectedPopup?.customWidthPx
                  ? `${selectedPopup.customWidthPx || 600}px ${
                      selectedPopup.customHeightPx ? `x ${selectedPopup.customHeightPx}px` : ''
                    }`
                  : selectedPopup?.popupSize || 'lg'}
              </span>

              {selectedPopup && (
                <a
                  href="/?force_popup=1&reset_popups=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#0606f9] hover:bg-blue-100 rounded-lg text-xs font-bold transition-all border border-blue-200"
                  title="Sitede canlı popup test modunu açar"
                >
                  <span className="material-symbols-outlined !text-sm">open_in_new</span>
                  Sitede Canlı Test Et
                </a>
              )}
            </div>
          </div>

          {/* Canvas Center Card */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {selectedPopup ? (
              <div
                className={`transition-all duration-300 ${getPreviewDimensions(selectedPopup, previewMode).className}`}
                style={getPreviewDimensions(selectedPopup, previewMode).style}
              >
                {/* Popup Preview Card */}
                <div
                  className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 relative transition-all"
                  style={{
                    backgroundColor: selectedPopup.style?.bgColor || '#ffffff',
                    color: selectedPopup.style?.textColor || '#0f172a'
                  }}
                >
                  {/* Close button mock */}
                  <button
                    type="button"
                    className="absolute top-3 right-3 size-8 flex items-center justify-center bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition-colors z-20 shadow-md"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>

                  {selectedPopup.onlyImage ? (
                    /* Sadece Görsel Modu Önizleme */
                    <div className="w-full relative group cursor-pointer">
                      {selectedPopup.imageUrl ? (
                        <img
                          src={selectedPopup.imageUrl}
                          alt="Popup"
                          className="w-full h-auto object-cover max-h-[75vh] block"
                        />
                      ) : (
                        <div className="p-12 text-center text-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                          <span className="text-xs">Lütfen bir görsel seçin veya yükleyin.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Normal Mod Önizleme */
                    <div className={`flex ${previewMode === 'mobile' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                      
                      {/* Image Section */}
                      {selectedPopup.imageUrl && (
                        <div
                          className={`relative bg-slate-100 ${
                            previewMode === 'mobile' ? 'w-full h-48' : 'w-full md:w-1/2 min-h-[300px]'
                          }`}
                        >
                          <img
                            src={selectedPopup.imageUrl}
                            alt="Popup"
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDd7z1oXpXwhH7QTgZ2wgXtYlKXePoC_Sp6RZ6ZwL3DgCB_E4XQ8V0YBwI6liC5Cc4LPfygw0lt_Ufj3ybg6A3ZZpBK6rgmhfRGOdQ97rgjLcZf0GIVbfe_TLwh9cHTzg4TiXVKv8XGlHuBePsHfYNF6VDC9tKu1dB_9DNIaIIYeTxAA2BoGlzhJnDtrbGMSZNq9TnpKcOsMvCQgu24ZIMLDdmCkltvU6n9Ju0oRuO-IoyDSVA3ojWNzDQXD1Ii0EsJb4qoCWbQZKI";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      )}

                      {/* Content Section */}
                      <div
                        className={`p-8 flex flex-col justify-center text-left ${
                          selectedPopup.imageUrl && previewMode === 'desktop' ? 'w-full md:w-1/2' : 'w-full'
                        }`}
                      >
                        {selectedPopup.badgeText && (
                          <span
                            className="font-bold text-xs uppercase tracking-widest mb-2 inline-block"
                            style={{ color: selectedPopup.badgeColor || '#0606f9' }}
                          >
                            {selectedPopup.badgeText}
                          </span>
                        )}

                        <h2 className="text-2xl font-bold leading-tight mb-4">
                          {selectedPopup.title}
                        </h2>

                        <p className="text-slate-600 text-sm leading-relaxed mb-8 whitespace-pre-line">
                          {selectedPopup.description}
                        </p>

                        <button
                          type="button"
                          className="w-full py-3 font-bold rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer"
                          style={{
                            backgroundColor: selectedPopup.style?.buttonBgColor || '#0606f9',
                            color: selectedPopup.style?.buttonTextColor || '#ffffff'
                          }}
                        >
                          {selectedPopup.buttonText || 'Hemen Başvur'}
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">Lütfen düzenlemek için bir popup seçin.</div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Settings/Properties */}
        <aside className="w-80 border-l border-slate-200 bg-white flex flex-col overflow-hidden shrink-0">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-4 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'text-[#0606f9] border-b-2 border-[#0606f9]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              İÇERİK
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'text-[#0606f9] border-b-2 border-[#0606f9]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              AYARLAR
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-4 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'style'
                  ? 'text-[#0606f9] border-b-2 border-[#0606f9]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              STİL
            </button>
          </div>

          {/* Form Properties Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {selectedPopup ? (
              <>
                {/* 1. İÇERİK TAB */}
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Kampanya / Popup Adı</span>
                      <input
                        type="text"
                        value={selectedPopup.name || ''}
                        onChange={(e) => updateCurrentPopup({ name: e.target.value })}
                        className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none"
                      />
                    </label>

                    {/* Only Image Toggle Option */}
                    <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">Sadece Görsel Olarak Göster</span>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={!!selectedPopup.onlyImage}
                            onChange={(e) => updateCurrentPopup({ onlyImage: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0606f9]"></div>
                        </label>
                      </div>
                      <p className="text-[11px] text-amber-700 leading-snug">
                        Açıldığında metin ve butonlar gizlenir, sadece afiş/görsel gösterilir.
                      </p>
                    </div>

                    {/* Image Selection / Upload Box */}
                    <div className="block space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Popup Görseli</span>

                      {/* Dropzone & File Picker Button */}
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#0606f9] rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                      >
                        <div className="size-10 rounded-full bg-[#0606f9]/10 text-[#0606f9] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-xl">cloud_upload</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-slate-700 block">
                            Görsel Seç / Bilgisayardan Yükle
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Sürükleyip bırakın veya tıklayın (PNG, JPG)
                          </span>
                        </div>
                      </div>

                      {/* Image Preview & Actions */}
                      {selectedPopup.imageUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 p-2 flex items-center gap-3">
                          <img
                            src={selectedPopup.imageUrl}
                            alt="Mevcut Görsel"
                            className="w-12 h-12 rounded object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-slate-700 block truncate">
                              Yüklü Görsel
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {selectedPopup.imageUrl.startsWith('data:') ? 'Yerel Yükleme' : selectedPopup.imageUrl}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateCurrentPopup({ imageUrl: '' })}
                            className="text-rose-500 hover:text-rose-700 p-1 text-xs font-bold cursor-pointer"
                            title="Görseli Kaldır"
                          >
                            Kaldır
                          </button>
                        </div>
                      )}

                      {/* Direct URL input fallback */}
                      <div className="pt-1">
                        <span className="text-[11px] text-slate-400 block mb-1">veya Görsel URL Girin:</span>
                        <input
                          type="text"
                          value={selectedPopup.imageUrl || ''}
                          onChange={(e) => updateCurrentPopup({ imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-1.5 border outline-none"
                        />
                      </div>
                    </div>

                    {!selectedPopup.onlyImage && (
                      <>
                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase">Rozet / Kategori Metni</span>
                          <input
                            type="text"
                            value={selectedPopup.badgeText || ''}
                            onChange={(e) => updateCurrentPopup({ badgeText: e.target.value })}
                            placeholder="Örn: BAŞVURULAR AÇIK"
                            className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase">Başlık</span>
                          <input
                            type="text"
                            value={selectedPopup.title || ''}
                            onChange={(e) => updateCurrentPopup({ title: e.target.value })}
                            className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none font-semibold"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase">Açıklama Metni</span>
                          <textarea
                            rows={4}
                            value={selectedPopup.description || ''}
                            onChange={(e) => updateCurrentPopup({ description: e.target.value })}
                            className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase">Buton Metni</span>
                          <input
                            type="text"
                            value={selectedPopup.buttonText || ''}
                            onChange={(e) => updateCurrentPopup({ buttonText: e.target.value })}
                            className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none"
                          />
                        </label>
                      </>
                    )}

                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {selectedPopup.onlyImage ? 'Görsele Tıklayınca Açılacak Sayfa (Link)' : 'Buton Yönlendirme (Link)'}
                      </span>
                      <select
                        value={selectedPopup.buttonUrl || '/'}
                        onChange={(e) => updateCurrentPopup({ buttonUrl: e.target.value })}
                        className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none"
                      >
                        {pagesList.map((p) => (
                          <option key={p.id} value={p.path}>
                            {p.title} ({p.path})
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {/* 2. AYARLAR TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Popup Durumu</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['AKTİF', 'PASİF', 'TASLAK'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateCurrentPopup({ status: st })}
                            className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              selectedPopup.status === st
                                ? st === 'AKTİF'
                                  ? 'bg-green-600 text-white border-green-600'
                                  : st === 'PASİF'
                                  ? 'bg-slate-700 text-white border-slate-700'
                                  : 'bg-amber-600 text-white border-amber-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Popup Sizing Setting */}
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Popup Boyutu</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'sm', label: 'Küçük' },
                          { id: 'md', label: 'Orta' },
                          { id: 'lg', label: 'Büyük' },
                          { id: 'xl', label: 'Ekstra' },
                          { id: 'full', label: 'Geniş' },
                          { id: 'custom', label: 'Özel (px)' }
                        ].map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => {
                              if (sz.id === 'custom') {
                                updateCurrentPopup({
                                  popupSize: 'custom',
                                  customWidthPx: selectedPopup.customWidthPx || 600
                                });
                              } else {
                                updateCurrentPopup({ popupSize: sz.id as any });
                              }
                            }}
                            className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              (selectedPopup.popupSize || 'lg') === sz.id
                                ? 'bg-[#0606f9] text-white border-[#0606f9] shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom Pixel Inputs */}
                      {(selectedPopup.popupSize === 'custom' || selectedPopup.customWidthPx !== undefined) && (
                        <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3">
                          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="material-symbols-outlined !text-base text-[#0606f9]">straighten</span>
                            Piksel Cinsinden Ebat (Genişlik x Yükseklik)
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="block">
                              <span className="text-[11px] font-semibold text-slate-500">Genişlik (px)</span>
                              <div className="relative mt-1">
                                <input
                                  type="number"
                                  min={200}
                                  max={2000}
                                  placeholder="Örn: 600"
                                  value={selectedPopup.customWidthPx ?? ''}
                                  onChange={(e) => {
                                    const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                                    updateCurrentPopup({
                                      popupSize: 'custom',
                                      customWidthPx: val
                                    });
                                  }}
                                  className="w-full pl-3 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-[#0606f9] focus:border-[#0606f9] outline-none font-medium text-slate-800"
                                />
                                <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold pointer-events-none">px</span>
                              </div>
                            </label>

                            <label className="block">
                              <span className="text-[11px] font-semibold text-slate-500">Yükseklik (px)</span>
                              <div className="relative mt-1">
                                <input
                                  type="number"
                                  min={100}
                                  max={2000}
                                  placeholder="Otomatik"
                                  value={selectedPopup.customHeightPx ?? ''}
                                  onChange={(e) => {
                                    const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                                    updateCurrentPopup({
                                      popupSize: 'custom',
                                      customHeightPx: val
                                    });
                                  }}
                                  className="w-full pl-3 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-[#0606f9] focus:border-[#0606f9] outline-none font-medium text-slate-800"
                                />
                                <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold pointer-events-none">px</span>
                              </div>
                            </label>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            Yükseklik boş bırakılırsa içeriğe göre otomatik ayarlanır.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">Tetikleyiciler (Triggers)</span>
                      <div className="space-y-2">
                        {[
                          { id: 'immediate', icon: 'timer', label: 'Sayfa yüklendiğinde' },
                          { id: 'delay', icon: 'hourglass_top', label: '5 saniye sonra' },
                          { id: 'exit_intent', icon: 'logout', label: 'Sayfadan çıkarken' }
                        ].map((tr) => (
                          <label
                            key={tr.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedPopup.triggerType === tr.id
                                ? 'border-[#0606f9] bg-[#0606f9]/5 font-semibold'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-slate-400">{tr.icon}</span>
                              <span className="text-sm font-medium">{tr.label}</span>
                            </div>
                            <input
                              type="radio"
                              name="trigger"
                              checked={selectedPopup.triggerType === tr.id}
                              onChange={() => updateCurrentPopup({ triggerType: tr.id as any })}
                              className="text-[#0606f9] focus:ring-[#0606f9]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">Hedefleme</span>
                      <label className="block">
                        <span className="text-xs font-medium text-slate-500">Görüntülenecek Sayfalar</span>
                        <select
                          value={selectedPopup.targetPages || 'home'}
                          onChange={(e) => updateCurrentPopup({ targetPages: e.target.value as any })}
                          className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] px-3 py-2 border outline-none"
                        >
                          <option value="home">Sadece ana sayfada</option>
                          <option value="all">Tüm sayfalarda</option>
                          <option value="custom">Belirli URL'lerde</option>
                        </select>
                      </label>

                      <div className="space-y-1 py-2 border-t border-slate-100 mt-2 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sadece yeni ziyaretçilere göster</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!selectedPopup.onlyNewVisitors}
                              onChange={(e) => updateCurrentPopup({ onlyNewVisitors: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0606f9]"></div>
                          </label>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Açık ise popup sadece siteye ilk kez giren kişilere gösterilir. (Kaydedildiğinde test etmeniz için ilk 10 dk herkese açık görünür).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STİL TAB */}
                {activeTab === 'style' && (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Rozet Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.badgeColor || '#0606f9'}
                          onChange={(e) => updateCurrentPopup({ badgeColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.badgeColor || '#0606f9'}
                          onChange={(e) => updateCurrentPopup({ badgeColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Arka Plan Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.style?.bgColor || '#ffffff'}
                          onChange={(e) => updateStyleField({ bgColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.style?.bgColor || '#ffffff'}
                          onChange={(e) => updateStyleField({ bgColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Metin Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.style?.textColor || '#0f172a'}
                          onChange={(e) => updateStyleField({ textColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.style?.textColor || '#0f172a'}
                          onChange={(e) => updateStyleField({ textColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Buton Arka Plan Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.style?.buttonBgColor || '#0606f9'}
                          onChange={(e) => updateStyleField({ buttonBgColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.style?.buttonBgColor || '#0606f9'}
                          onChange={(e) => updateStyleField({ buttonBgColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Buton Metin Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.style?.buttonTextColor || '#ffffff'}
                          onChange={(e) => updateStyleField({ buttonTextColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.style?.buttonTextColor || '#ffffff'}
                          onChange={(e) => updateStyleField({ buttonTextColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                      </div>
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-400 text-xs">Lütfen düzenlemek için soldan bir popup seçin.</div>
            )}
          </div>

          {/* Sticky Footer Save Button */}
          {selectedPopup && (
            <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10 shadow-lg shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0606f9] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0606f9]/25 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined">save</span>
                {saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
              </button>
            </div>
          )}
        </aside>

      </div>

      {/* Live Preview Modal */}
      {showLivePreviewModal && selectedPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-6">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="material-symbols-outlined text-green-400 text-base">verified</span>
                Canlı Site Üzerinde Popup Önizlemesi
              </div>
              <button
                type="button"
                onClick={() => setShowLivePreviewModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex-1 relative bg-slate-100 overflow-hidden">
              <iframe
                src="/"
                title="Live Site Preview"
                className="w-full h-full border-none opacity-60 pointer-events-none"
              />

              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs">
                <div
                  className={`w-full ${getSizeClass(selectedPopup.popupSize)} rounded-2xl shadow-2xl overflow-hidden relative`}
                  style={{
                    backgroundColor: selectedPopup.style?.bgColor || '#ffffff',
                    color: selectedPopup.style?.textColor || '#0f172a'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowLivePreviewModal(false)}
                    className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-slate-900/70 text-white rounded-full"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>

                  {selectedPopup.onlyImage ? (
                    <div className="w-full cursor-pointer">
                      {selectedPopup.imageUrl ? (
                        <img
                          src={selectedPopup.imageUrl}
                          alt=""
                          className="w-full h-auto object-cover max-h-[75vh]"
                        />
                      ) : (
                        <div className="p-12 text-center text-slate-400">Görsel seçilmedi</div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row">
                      {selectedPopup.imageUrl && (
                        <div className="w-full md:w-1/2 min-h-[260px] bg-slate-100 relative">
                          <img
                            src={selectedPopup.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6 md:p-8 flex flex-col justify-center text-left flex-1">
                        {selectedPopup.badgeText && (
                          <span
                            className="font-bold text-xs uppercase tracking-widest mb-2"
                            style={{ color: selectedPopup.badgeColor || '#0606f9' }}
                          >
                            {selectedPopup.badgeText}
                          </span>
                        )}
                        <h3 className="text-xl font-bold mb-3">{selectedPopup.title}</h3>
                        <p className="text-xs opacity-80 leading-relaxed mb-6 whitespace-pre-line">{selectedPopup.description}</p>
                        <button
                          type="button"
                          onClick={() => setShowLivePreviewModal(false)}
                          className="w-full py-3 font-bold rounded-xl text-xs"
                          style={{
                            backgroundColor: selectedPopup.style?.buttonBgColor || '#0606f9',
                            color: selectedPopup.style?.buttonTextColor || '#ffffff'
                          }}
                        >
                          {selectedPopup.buttonText || 'Hemen Başvur'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
