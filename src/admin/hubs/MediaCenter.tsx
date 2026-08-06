import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { compressImageFile } from '../../lib/imageCompressor';
import { Image as ImageIcon, Search, Trash2, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const compressImage = (file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> => {
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

export default function MediaCenter() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Custom dialog state
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, isBulk: boolean, id?: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
      }));
      setMediaItems(items);
    } catch (err) {
      console.error("Error fetching media in MediaCenter:", err);
      setError("Medyalar yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        
        try {
          // High-quality image upload (zero compression if < 950KB)
          const base64 = await compressImageFile(file, 2000, 2000, 0.88);
          
          await addDoc(collection(db, 'media'), {
            name: file.name,
            url: base64,
            size: file.size,
            type: file.type,
            createdAt: serverTimestamp()
          });
        } catch (innerErr: any) {
           setError(`"${file.name}" yüklenirken hata: ${innerErr.message || 'Bilinmeyen'}`);
        }
      }
      await fetchMedia();
    } catch (err: any) {
      console.error("Error uploading files", err);
      setError("Dosya yüklenirken bir hata oluştu: " + (err.message || ''));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const executeDelete = async () => {
    if (!deleteDialog) return;
    
    try {
      if (deleteDialog.isBulk) {
        for (const id of selectedIds) {
          await deleteDoc(doc(db, 'media', id));
        }
        setSelectedIds([]);
      } else if (deleteDialog.id) {
        await deleteDoc(doc(db, 'media', deleteDialog.id));
        setSelectedIds(prev => prev.filter(sId => sId !== deleteDialog.id));
      }
      await fetchMedia();
    } catch (err) {
      console.error("Error deleting files", err);
      setError("Dosyalar silinirken bir hata oluştu.");
    } finally {
      setDeleteDialog(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(item => item.id));
    }
  };

  const filteredItems = mediaItems.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Medya Kütüphanesi</h2>
          <p className="text-sm text-slate-500 mt-1">Sitenizde kullandığınız tüm görselleri buradan yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileUpload} 
            ref={fileInputRef}
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Yükleniyor...' : 'Yeni Dosya Yükle'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Emin misiniz?</h3>
            <p className="text-slate-600 text-sm mb-6">
              <span>{deleteDialog.isBulk 
                ? `${selectedIds.length} adet dosyayı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
                : 'Bu dosyayı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'}</span>
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setDeleteDialog(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Tümünü Seç
            </label>

            {selectedIds.length > 0 && (
              <button 
                onClick={() => setDeleteDialog({ isOpen: true, isBulk: true })}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> <span>{selectedIds.length} Seçili Öğeyi Sil</span>
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Dosya adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Medya Bulunamadı</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              <span>{searchTerm ? 'Aramanıza uygun dosya bulunamadı.' : 'Henüz hiç medya yüklenmemiş. Resim yükleyerek başlayabilirsiniz.'}</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleSelect(item.id)}
                className={`relative group bg-slate-50 border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedIds.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedIds.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'bg-white/80 border-slate-300 group-hover:border-blue-400'
                  }`}>
                    {selectedIds.includes(item.id) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); setDeleteDialog({ isOpen: true, isBulk: false, id: item.id }); }}
                  className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {item.url ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <div className="p-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700 truncate" title={item.name}>{item.name || 'İsimsiz Dosya'}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-500">{formatSize(item.size)}</span>
                    <span className="text-[10px] text-slate-400">
                      {item.createdAt?.seconds ? format(new Date(item.createdAt.seconds * 1000), 'dd MMM yyyy') : 'Yeni'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
