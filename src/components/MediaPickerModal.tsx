import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { compressImageFile } from '../lib/imageCompressor';
import { Image as ImageIcon, Search, X, Upload, AlertCircle } from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

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

export default function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setLoading(true);
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(30));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ 
           id: doc.id, 
           ...doc.data()
        }));
        setMediaItems(items);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching media", err);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setErrorMsg(null);
    
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
          console.error("Error processing file", file.name, innerErr);
          setErrorMsg(`"${file.name}" yüklenirken hata oluştu: ${innerErr.message || "Bilinmeyen Hata"}`);
        }
      }
      
      
      
    } catch (err: any) {
      console.error("Error uploading files", err);
      setErrorMsg(`Dosya yüklenirken bir hata oluştu: ${err.message || 'Bilinmeyen Hata'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Medya Kütüphanesi
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}
        
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Dosya adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          </div>
          <div>
             <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button 
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
               className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:bg-blue-400"
             >
               {uploading ? (
                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
               ) : (
                 <Upload className="w-4 h-4" />
               )}
               {uploading ? 'Yükleniyor...' : 'Yeni Görsel Yükle'}
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ImageIcon className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Bulunamadı</h3>
              <p className="text-slate-500 text-sm">Aradığınız kriterlere uygun görsel bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => { 
                    const selectedUrl = (item.url && item.url.startsWith('data:image/')) 
                      ? `/api/media/${item.id}` 
                      : item.url;
                    onSelect(selectedUrl); 
                    onClose(); 
                  }}
                  className="group bg-white border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-200 transition-all shadow-sm"
                >
                  <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {item.url ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <p className="text-[11px] font-medium text-slate-600 truncate" title={item.name}>{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
