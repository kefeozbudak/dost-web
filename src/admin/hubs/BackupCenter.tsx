import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, getAccessToken, loginWithGoogle, initAuth } from '../../lib/firebase';
import { DatabaseBackup, DownloadCloud, History, CheckCircle2, AlertCircle, ShieldCheck, Download, RefreshCw, Sparkles } from 'lucide-react';

export default function BackupCenter() {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(() => {
    return localStorage.getItem('dost_auto_backup_enabled') !== 'false';
  });

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, t) => { setNeedsAuth(false); setToken(t); loadBackupsAndAutoSync(t); },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result) {
        const t = await getAccessToken();
        setToken(t);
        setNeedsAuth(false);
        if (t) loadBackupsAndAutoSync(t);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const loadBackupsAndAutoSync = async (accessToken: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,createdTime)&q=mimeType="application/json" and trashed=false&orderBy=createdTime desc', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const files = data.files || [];
      setBackups(files);

      // Auto Backup Check for today
      if (localStorage.getItem('dost_auto_backup_enabled') !== 'false') {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayBackupExists = files.some((f: any) => f.name && f.name.includes(todayStr));
        if (!todayBackupExists) {
          console.log("Bugünün otomatik yedeği oluşturuluyor...");
          createBackup(accessToken, true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAutoBackup = (enabled: boolean) => {
    setAutoBackupEnabled(enabled);
    localStorage.setItem('dost_auto_backup_enabled', enabled ? 'true' : 'false');
  };

  const getFullBackupData = async () => {
    const collections = ['settings', 'pages', 'forms', 'users'];
    const backupData: Record<string, any> = {
      meta: {
        exportedAt: new Date().toISOString(),
        site: 'Dost Koleji Web Platformu',
        version: '2.0'
      }
    };
    
    for (const col of collections) {
      const querySnapshot = await getDocs(collection(db, col));
      backupData[col] = {};
      querySnapshot.forEach((docSnap) => {
        backupData[col][docSnap.id] = docSnap.data();
      });
    }

    // Also include local forms backup if any offline entries exist
    try {
      const localForms = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
      if (localForms && localForms.length > 0) {
        backupData['local_forms_cache'] = localForms;
      }
    } catch (e) {
      console.warn(e);
    }

    return backupData;
  };

  const createBackup = async (currentToken?: string | null, isAuto = false) => {
    const activeToken = currentToken || token;
    if (!activeToken) return;
    setLoading(true);
    if (!isAuto) setStatusMsg(null);

    try {
      const backupData = await getFullBackupData();
      const backupString = JSON.stringify(backupData, null, 2);
      const fileName = `DostKoleji_Backup_${new Date().toISOString().split('T')[0]}.json`;

      // 2. Create file metadata in Drive
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: 'application/json',
        })
      });
      const fileData = await createRes.json();

      if (!fileData.id) throw new Error('Failed to create file in Drive');

      // 3. Upload content
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileData.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${activeToken}`,
          'Content-Type': 'application/json',
        },
        body: backupString
      });

      setStatusMsg({ 
        type: 'success', 
        text: isAuto ? 'Bugünün otomatik Google Drive yedeği başarıyla alındı.' : 'Yedekleme başarıyla Google Drive\'a kaydedildi.' 
      });

      // Reload list
      const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,createdTime)&q=mimeType="application/json" and trashed=false&orderBy=createdTime desc', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json();
      if (data.files) setBackups(data.files);

    } catch (e) {
      console.error(e);
      if (!isAuto) {
        setStatusMsg({ type: 'error', text: 'Yedekleme sırasında bir hata oluştu.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadLocalJSON = async () => {
    setLoading(true);
    try {
      const data = await getFullBackupData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DostKoleji_TamYedek_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', text: 'Yedek dosyası (.JSON) bilgisayarınıza indirildi.' });
    } catch (e) {
      console.error(e);
      setStatusMsg({ type: 'error', text: 'İndirme sırasında hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (fileId: string) => {
    if (!token) return;
    const confirmed = window.confirm(
      'UYARI: Bu işlem mevcut tüm site verilerinin (Sayfalar, Ayarlar, Formlar, Veli Asistanı Verileri) üzerine yazacaktır. Siteniz bu yedek anına geri dönecektir. Devam etmek istediğinize emin misiniz?'
    );
    if (!confirmed) return;

    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const backupData = await res.json();
      
      // Restore collections
      const collections = ['settings', 'pages', 'forms', 'users'];
      for (const col of collections) {
        if (backupData[col]) {
          const docs = Object.keys(backupData[col]);
          for (const docId of docs) {
            await setDoc(doc(db, col, docId), backupData[col][docId]);
          }
        }
      }

      // Restore local forms cache if exists
      if (backupData['local_forms_cache']) {
        localStorage.setItem('dost_forms_backup', JSON.stringify(backupData['local_forms_cache']));
      }

      setStatusMsg({ type: 'success', text: 'Tüm site verileri ve veritabanı yedeği başarıyla geri yüklendi! Sayfayı yenileyerek değişiklikleri görebilirsiniz.' });
    } catch (e) {
      console.error(e);
      setStatusMsg({ type: 'error', text: 'Geri yükleme sırasında bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
        <DatabaseBackup className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-black mb-2 text-slate-800">Google Drive Entegrasyonu</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center text-sm">
          Yedekleme işlemlerini gerçekleştirmek için lütfen Google hesabınızla yetki verin. Sadece yedek dosyalarına erişim istenir.
        </p>
        <button 
          onClick={handleLogin}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Google ile Giriş Yap ve İzin Ver
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 text-[#004899]">Yedekleme & Drive</h1>
            <p className="text-slate-500 text-sm">Site veritabanını, sayfaları ve gelen formları Google Drive'a yedekleyin ve geri yükleyin.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={downloadLocalJSON}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              title="Bilgisayarınıza .json yedek dosyası indirir"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Bilgisayara İndir (.JSON)</span>
            </button>

            <button
              onClick={() => createBackup()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#004899] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              {loading ? 'Yedekleniyor...' : 'Drive\'a Şimdi Yedekle'}
            </button>
          </div>
        </div>

        {/* AUTOMATIC BACKUP SETTING BANNER */}
        <div className="bg-gradient-to-r from-blue-900 to-[#004899] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Otomatik Günlük Google Drive Yedeği
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Siz unutsanız bile, Yönetim Paneline her girdiğinizde o günün yedeği yoksa sistem arka planda otomatik olarak Drive'ınıza kaydeder.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end md:self-center">
            <input 
              type="checkbox" 
              checked={autoBackupEnabled} 
              onChange={(e) => toggleAutoBackup(e.target.checked)} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-blue-950/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            <span className="ml-2.5 text-xs font-extrabold uppercase text-white">
              {autoBackupEnabled ? 'Aktif' : 'Pasif'}
            </span>
          </label>
        </div>

        {/* BACKUP GUARANTEE & INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-[#004899] font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bu Yedek İle Neler Saklanır?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Tüm İçerik ve Ayarlar:</strong> Sitedeki bütün sayfalar, dinamik bloklar, renk ve logo ayarları, Veli Asistanı SSS verileri, yöneticiler ve gelen tüm **Rapor Merkezi form başvuruları** tek bir dosyada güvenle saklanır.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-[#004899] font-bold text-sm">
              <RefreshCw className="w-4 h-4 text-[#38C1D2]" />
              <span>Tek Tıkla Sorunsuz Geri Yükleme</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Veritabanı veya site tamamen sıfırlansa bile, Drive geçmişinizdeki herhangi bir yedeğin yanındaki **"Geri Yükle"** butonuna bastığınızda, sistem saniyeler içerisinde yedeğin alındığı anki tam haline döner.
            </p>
          </div>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />}
            <p className="text-sm font-semibold">{statusMsg.text}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-black text-sm flex items-center gap-2 text-slate-800">
              <History className="w-4 h-4 text-[#004899]" />
              Sürüm Geçmişi (Google Drive)
            </h2>
            <button 
              onClick={() => token && loadBackupsAndAutoSync(token)} 
              className="text-[11px] text-[#004899] font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Yenile
            </button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {backups.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">
                Henüz Google Drive'ınızda kayıtlı bir yedek bulunamadı. "Drive'a Şimdi Yedekle" butonunu kullanarak ilk yedeğinizi alabilirsiniz.
              </div>
            ) : (
              backups.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004899] shrink-0">
                      <DatabaseBackup className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{file.name}</h3>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        Oluşturulma: {file.createdTime && !isNaN(new Date(file.createdTime).getTime()) ? new Date(file.createdTime).toLocaleString('tr-TR') : 'Bugün'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => restoreBackup(file.id)}
                    disabled={loading}
                    className="px-4 py-2 border border-slate-200 bg-white text-[#004899] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Geri Yükle
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

