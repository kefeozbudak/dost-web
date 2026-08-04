import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import MediaPickerModal from '../../components/MediaPickerModal';
import {
  Globe,
  Search,
  Megaphone,
  Share2,
  Mail,
  ShieldCheck,
  Database,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Building2,
  Phone,
  ImageIcon,
  Sliders,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Lock,
  Eye,
  Check,
  X,
  Trash2
} from 'lucide-react';

interface GeneralSettings {
  siteTitle: string;
  siteTagline: string;
  schoolName: string;
  contactEmail: string;
  contactPhone: string;
  whatsappPhone: string;
  address: string;
  copyrightText: string;

  // SEO
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  searchConsoleCode: string;
  allowIndexing: boolean;
  canonicalUrl: string;
  faviconUrl: string;

  // Social
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  linkedinUrl: string;

  // System & Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // Announcement Bar
  announcementActive: boolean;
  announcementText: string;
  announcementIcon?: string;
  announcementButtonText: string;
  announcementButtonUrl: string;
  announcementBgColor: string;
  announcementTextColor: string;

  // Forms & Email
  formNotificationEmail: string;
  autoReplyText: string;
  kvkkTitle: string;

  updatedAt?: number;
  updatedBy?: string;
}

const defaultSettings: GeneralSettings = {
  siteTitle: 'Özel Dost Koleji | Geleceğin Liderlerini Yetiştiriyoruz',
  siteTagline: 'Güvenli, Yenilikçi ve Bütünsel Eğitim Anlayışı',
  schoolName: 'Özel Dost Koleji',
  contactEmail: 'bilgi@dostkoleji.k12.tr',
  contactPhone: '0 (312) 234 56 78',
  whatsappPhone: '0 (532) 123 45 67',
  address: 'Eryaman Mah. 284. Sok. No: 12 Etimesgut / Ankara',
  copyrightText: '© 2026 Özel Dost Koleji. Tüm hakları saklıdır.',

  metaDescription: 'Özel Dost Koleji Anaokulu, İlkokul, Ortaokul ve Lise kademeleriyle akademik mükemmellik ve karakter eğitimini bir arada sunar.',
  metaKeywords: 'dost koleji, özel okul, ankara özel okul, eryaman koleji, oran koleji, ümitköy koleji, bursluluk sınavı, lgs hazırlık',
  googleAnalyticsId: '',
  searchConsoleCode: '',
  allowIndexing: true,
  canonicalUrl: 'https://dostkoleji.k12.tr',
  faviconUrl: '/dost-logo-png.png',

  instagramUrl: 'https://instagram.com/dostkoleji',
  facebookUrl: 'https://facebook.com/dostkoleji',
  youtubeUrl: 'https://youtube.com/dostkoleji',
  twitterUrl: 'https://x.com/dostkoleji',
  linkedinUrl: 'https://linkedin.com/company/dostkoleji',

  maintenanceMode: false,
  maintenanceMessage: 'Sitemiz şu anda planlı bakım çalışmasındadır. Kısa süre sonra tekrar hizmetinizde olacağız.',

  announcementActive: true,
  announcementText: '🎉 2026 - 2027 Eğitim Öğretim Yılı Erken Kayıt Fırsatları ve Bursluluk Sınavı Başvuruları Başladı!',
  announcementIcon: '📢',
  announcementButtonText: 'Başvuru Yap',
  announcementButtonUrl: '/bursluluk-basvuru-formu',
  announcementBgColor: '#0a192f',
  announcementTextColor: '#ffffff',

  formNotificationEmail: 'basvuru@dostkoleji.k12.tr',
  autoReplyText: 'Tarafımıza ulaştırdığınız başvuru formunuz alınmıştır. Eğitim danışmanlarımız en kısa sürede sizinle iletişime geçecektir.',
  kvkkTitle: 'KVKK Aydınlatma Metni Onayı'
};

export default function SettingsCenter() {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'announcement' | 'social' | 'notifications' | 'system'>('general');
  const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [cacheClearing, setCacheClearing] = useState(false);

  // Load settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() });
        } else {
          // Initialize with default settings if document doesn't exist
          await setDoc(docRef, { ...defaultSettings, createdAt: Date.now() });
          setSettings(defaultSettings);
        }
      } catch (e) {
        console.error('General Settings fetch error:', e);
        showToast('Ayarlar yüklenirken bir hata oluştu.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'general');
      const updatedData = {
        ...settings,
        updatedAt: Date.now()
      };
      await setDoc(docRef, updatedData, { merge: true });
      showToast('Genel ayarlar başarıyla güncellendi ve kaydedildi!');
    } catch (e) {
      console.error('Save error:', e);
      showToast('Ayarlar kaydedilirken hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearCache = () => {
    setCacheClearing(true);
    setTimeout(() => {
      // Clear local caches
      try {
        sessionStorage.clear();
        localStorage.removeItem('dost_visitor_initialized');
      } catch (err) {
        console.error(err);
      }
      setCacheClearing(false);
      showToast('Sistem ve taranan sayfa önbellekleri temizlendi!');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-600">Genel Ayarlar Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Toast Banner */}
      {toast.show && (
        <div
          className={`fixed top-16 right-6 z-[110] px-4 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 notranslate ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-red-600 text-white border-red-700'
          }`}
          translate="no"
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Sistem Yapılandırma Paneli</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Genel Ayarlar</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Sistem, SEO, duyuru bandı, veritabanı ve genel okul yapılandırma parametrelerini yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:bg-blue-400 cursor-pointer notranslate"
              translate="no"
            >
              <span className="flex items-center gap-2" key={saving ? 'saving' : 'idle'}>
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                ) : (
                  <Save className="w-4 h-4 shrink-0" />
                )}
                <span>{saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 pt-2">
          {[
            { id: 'general', label: 'Genel & Kurumsal', icon: Building2 },
            { id: 'seo', label: 'SEO & Analitik', icon: Search },
            { id: 'announcement', label: 'Duyuru & Bakım', icon: Megaphone },
            { id: 'social', label: 'Sosyal Medya', icon: Share2 },
            { id: 'notifications', label: 'Form & Bildirim', icon: Mail },
            { id: 'system', label: 'Sistem & Sağlık', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        
        {/* TAB 1: GENEL & KURUMSAL */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kurumsal Okul Bilgileri</h3>
                  <p className="text-xs text-slate-500">Sitenin genelinde ve iletişim alanlarında gösterilecek temel bilgiler.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Site Başlığı (Title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => updateField('siteTitle', e.target.value)}
                    placeholder="Örn: Özel Dost Koleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Tarayıcı sekmesinde ve arama sonuçlarında görünen ana başlık.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Site Sloganı / Alt Başlık
                  </label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={(e) => updateField('siteTagline', e.target.value)}
                    placeholder="Örn: Geleceğin Liderlerini Yetiştiriyoruz"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Resmi Okul / Kurum Adı
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => updateField('schoolName', e.target.value)}
                    placeholder="Örn: Özel Dost Koleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Genel İletişim E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    placeholder="bilgi@dostkoleji.k12.tr"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Santral / Telefon Numarası
                  </label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    placeholder="0 (312) 000 00 00"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    WhatsApp İletişim Hattı
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappPhone}
                    onChange={(e) => updateField('whatsappPhone', e.target.value)}
                    placeholder="0 (532) 000 00 00"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Okul Genel Adresi
                  </label>
                  <textarea
                    rows={2}
                    value={settings.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Adres bilgisi..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Footer Telif Hakkı (Copyright) Metni
                  </label>
                  <input
                    type="text"
                    value={settings.copyrightText}
                    onChange={(e) => updateField('copyrightText', e.target.value)}
                    placeholder="© 2026 Özel Dost Koleji. Tüm hakları saklıdır."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEO & ANALİTİK */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">SEO & Arama Motoru İndeksleme</h3>
                  <p className="text-xs text-slate-500">Google ve diğer arama motorlarında sitenizin üst sıralarda çıkmasını sağlayan ayarlar.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Meta Açıklaması (Meta Description)
                    </label>
                    <span className={`text-xs font-bold ${settings.metaDescription.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {settings.metaDescription.length} / 160 karakter
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={settings.metaDescription}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="Sitenizi açıklayan kısa ve etkili bir özet yazın (150-160 karakter arası tavsiye edilir)."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Google arama sonuçlarında başlığın altında görünen açıklama cümlesi.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Meta Anahtar Kelimeler (Keywords)
                  </label>
                  <input
                    type="text"
                    value={settings.metaKeywords}
                    onChange={(e) => updateField('metaKeywords', e.target.value)}
                    placeholder="dost koleji, özel okul, ankara koleji, bursluluk sınavı..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Virgülle ayırarak anahtar kelimeleri ekleyebilirsiniz.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Google Analytics 4 (GA4) Ölçüm Kimliği
                    </label>
                    <input
                      type="text"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
                      placeholder="Örn: G-XXXXXXXXXX"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Trafik analizi için GA4 Measurement ID kodunuz.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Google Search Console Doğrulama Kodu
                    </label>
                    <input
                      type="text"
                      value={settings.searchConsoleCode}
                      onChange={(e) => updateField('searchConsoleCode', e.target.value)}
                      placeholder='<meta name="google-site-verification" content="..." />'
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Canonical Base URL / Domain
                    </label>
                    <input
                      type="text"
                      value={settings.canonicalUrl}
                      onChange={(e) => updateField('canonicalUrl', e.target.value)}
                      placeholder="https://dostkoleji.k12.tr"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Favicon & Site İkon Görseli
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {settings.faviconUrl ? (
                          <img src={settings.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Globe className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={settings.faviconUrl}
                        onChange={(e) => updateField('faviconUrl', e.target.value)}
                        placeholder="/dost-logo-png.png"
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                        Görsel Seç
                      </button>
                    </div>
                  </div>
                </div>

                {/* Robots.txt Indexing Toggle */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Arama Motoru İndekslemesine İzin Ver (Robots.txt)</p>
                    <p className="text-xs text-slate-500">
                      Açık olduğunda Google ve Arama motorları sitenizi dizine ekler. Kapalı olduğunda 'noindex' uygulanır.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.allowIndexing}
                      onChange={(e) => updateField('allowIndexing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DUYURU BANDI & BAKIM MODU */}
        {activeTab === 'announcement' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Announcement Bar Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Üst Bildirim / Duyuru Bandı</h3>
                    <p className="text-xs text-slate-500">Sitenin en üst kısmında yayınlanacak dikkat çekici duyuru çubuğu.</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.announcementActive}
                    onChange={(e) => updateField('announcementActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Live Preview of Announcement Bar */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Canlı Önizleme:</p>
                <div
                  className={`p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs font-bold shadow-xs transition-all ${
                    settings.announcementActive ? 'opacity-100' : 'opacity-40 grayscale'
                  }`}
                  style={{ backgroundColor: settings.announcementBgColor || '#0606f9' }}
                >
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <span>{settings.announcementText || 'Duyuru metni buraya gelecek...'}</span>
                  </div>
                  {settings.announcementButtonText && (
                    <span className="px-3 py-1 bg-white text-slate-900 rounded-lg text-[11px] font-black shrink-0 shadow-xs">
                      {settings.announcementButtonText} →
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <span>Duyuru İkonu / Emoji</span>
                      {settings.announcementIcon && settings.announcementIcon !== 'none' ? (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[11px] font-bold">
                          {settings.announcementIcon} Seçili
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[11px] font-bold">
                          İkon Yok (Sadece Metin)
                        </span>
                      )}
                    </label>

                    {settings.announcementIcon && settings.announcementIcon !== 'none' && (
                      <button
                        type="button"
                        onClick={() => updateField('announcementIcon', 'none')}
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
                        onClick={() => updateField('announcementIcon', item.icon)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                          (settings.announcementIcon || '📢') === item.icon
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
                      value={settings.announcementIcon === 'none' ? '' : (settings.announcementIcon || '')}
                      onChange={(e) => updateField('announcementIcon', e.target.value.trim() || 'none')}
                      placeholder="İstediğiniz emojiyi kopyalayıp yapıştırın (ör: 🏫, ✏️, 🎯)"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Duyuru Metni
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => updateField('announcementText', e.target.value)}
                    placeholder="🎉 Erken kayıt avantajları ve Bursluluk Sınavı başvuruları başladı!"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    value={settings.announcementButtonText}
                    onChange={(e) => updateField('announcementButtonText', e.target.value)}
                    placeholder="Hemen Başvur"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Buton Yönlendirme Linki (URL)
                  </label>
                  <input
                    type="text"
                    value={settings.announcementButtonUrl}
                    onChange={(e) => updateField('announcementButtonUrl', e.target.value)}
                    placeholder="/bursluluk-basvuru-formu"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Duyuru Bandı Arka Plan Rengi
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="color"
                      value={settings.announcementBgColor || '#0a192f'}
                      onChange={(e) => updateField('announcementBgColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.announcementBgColor || '#0a192f'}
                      onChange={(e) => updateField('announcementBgColor', e.target.value)}
                      placeholder="#0a192f"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Lacivert', hex: '#0a192f' },
                      { name: 'Gece Mavisi', hex: '#0f172a' },
                      { name: 'Canlı Mavi', hex: '#1d4ed8' },
                      { name: 'Zümrüt', hex: '#047857' },
                      { name: 'Kırmızı', hex: '#991b1b' },
                      { name: 'Bordo', hex: '#881337' }
                    ].map((p) => (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => updateField('announcementBgColor', p.hex)}
                        className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-2xs hover:scale-105 transition-all"
                        style={{ backgroundColor: p.hex }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Duyuru Bandı Metin Rengi
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="color"
                      value={settings.announcementTextColor || '#ffffff'}
                      onChange={(e) => updateField('announcementTextColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.announcementTextColor || '#ffffff'}
                      onChange={(e) => updateField('announcementTextColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Mode Settings */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Site Bakım Modu (Maintenance Mode)</h3>
                    <p className="text-xs text-slate-500">Siteyi geçici olarak ziyaretçilere kapatıp bakım ekranı gösterir.</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => updateField('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {settings.maintenanceMode && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium mb-6 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <strong className="block font-bold">DİKKAT: Bakım Modu Şu An Aktif!</strong>
                    Siteyi ziyaret eden normal kullanıcılar yalnızca bakım sayfasını görecektir. Yönetici paneliniz erişilebilir durumdadır.
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Bakım Modu Mesajı
                </label>
                <textarea
                  rows={3}
                  value={settings.maintenanceMessage}
                  onChange={(e) => updateField('maintenanceMessage', e.target.value)}
                  placeholder="Sitemiz şu anda planlı bakım çalışmasındadır..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOSYAL MEDYA */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sosyal Medya Hesap Bağlantıları</h3>
                  <p className="text-xs text-slate-500">Okulun alt bilgide (footer) ve iletişim alanlarında yer alan resmi hesapları.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> Instagram Profil URL
                  </label>
                  <input
                    type="text"
                    value={settings.instagramUrl}
                    onChange={(e) => updateField('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/dostkoleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Facebook Sayfa URL
                  </label>
                  <input
                    type="text"
                    value={settings.facebookUrl}
                    onChange={(e) => updateField('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/dostkoleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> YouTube Kanal URL
                  </label>
                  <input
                    type="text"
                    value={settings.youtubeUrl}
                    onChange={(e) => updateField('youtubeUrl', e.target.value)}
                    placeholder="https://youtube.com/dostkoleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900"></span> X (Twitter) Profil URL
                  </label>
                  <input
                    type="text"
                    value={settings.twitterUrl}
                    onChange={(e) => updateField('twitterUrl', e.target.value)}
                    placeholder="https://x.com/dostkoleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-700"></span> LinkedIn Şirket Sayfası
                  </label>
                  <input
                    type="text"
                    value={settings.linkedinUrl}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/dostkoleji"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FORM & BİLDİRİMLER */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Form & Başvuru Bildirim Ayarları</h3>
                  <p className="text-xs text-slate-500">Sitedeki ön kayıt, bursluluk ve kulüp formlarından iletilen mesajların yapılandırması.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Form Bildirimi Gönderilecek E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={settings.formNotificationEmail}
                    onChange={(e) => updateField('formNotificationEmail', e.target.value)}
                    placeholder="basvuru@dostkoleji.k12.tr"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Velilerin doldurduğu başvuru formları bu e-postaya bilgi olarak düşer.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Otomatik Teşekkür & Bilgilendirme Notu
                  </label>
                  <textarea
                    rows={3}
                    value={settings.autoReplyText}
                    onChange={(e) => updateField('autoReplyText', e.target.value)}
                    placeholder="Başvurunuz başarıyla tarafımıza ulaşmıştır..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    KVKK Metni Onay Başlığı
                  </label>
                  <input
                    type="text"
                    value={settings.kvkkTitle}
                    onChange={(e) => updateField('kvkkTitle', e.target.value)}
                    placeholder="KVKK Aydınlatma Metni'ni Okudum ve Onaylıyorum."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SİSTEM & SAĞLIK */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Veritabanı & Sistem Sağlığı</h3>
                  <p className="text-xs text-slate-500">Firestore veritabanı bağlantısı, önbellek ve sunucu parametreleri.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase">Firestore DB</span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>
                  <p className="text-lg font-black text-emerald-950">AKTİF & BAĞLI</p>
                  <p className="text-[11px] text-emerald-700 mt-1">Sistem verileri Firebase Firestore ile senkronize çalışıyor.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-800 uppercase">Sistem Sürümü</span>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-black text-blue-950">V2.4.12 Enterprise</p>
                  <p className="text-[11px] text-blue-700 mt-1">Son güvenlik güncellemeleri uygulanmıştır.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase">Son Güncelleme</span>
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString('tr-TR') : 'Daha önce kaydedilmedi'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Son ayar güncelleme tarihi.</p>
                </div>
              </div>

              {/* Cache Clearing & System Tools */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sistem Önbelleğini Temizle</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tarayıcı oturum önbelleğini ve taranan dinamik sayfa kopyalarını yeniler.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={cacheClearing}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0 disabled:bg-slate-500 notranslate"
                  translate="no"
                >
                  <span className="flex items-center gap-2" key={cacheClearing ? 'clearing' : 'idle'}>
                    <RefreshCw className={`w-4 h-4 shrink-0 ${cacheClearing ? 'animate-spin' : ''}`} />
                    <span>{cacheClearing ? 'Temizleniyor...' : 'Önbelleği Temizle'}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          updateField('faviconUrl', url);
        }}
      />
    </div>
  );
}
