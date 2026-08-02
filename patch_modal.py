import re

with open("src/components/MediaPickerModal.tsx", "r") as f:
    content = f.read()

compress_func = """
const compressImage = (file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
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
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
"""

imports = """import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Image as ImageIcon, Search, X, Upload, Loader2 } from 'lucide-react';"""

content = content.replace("import { useState, useEffect } from 'react';\nimport { collection, getDocs, query, orderBy } from 'firebase/firestore';\nimport { db } from '../lib/firebase';\nimport { Image as ImageIcon, Search, X } from 'lucide-react';", imports)

content = content.replace("export default function MediaPickerModal", compress_func + "\nexport default function MediaPickerModal")

modal_state = """  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);"""

content = content.replace("  const [loading, setLoading] = useState(true);\n  const [searchTerm, setSearchTerm] = useState('');", modal_state)

fetch_media_logic = """      const fetchMedia = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMediaItems(items);
        } catch (err) {
          console.error("Error fetching media", err);
        } finally {
          setLoading(false);
        }
      };"""

handle_upload = """  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        
        const compressedBase64 = await compressImage(file);
        
        await addDoc(collection(db, 'media'), {
          name: file.name,
          url: compressedBase64,
          size: file.size,
          type: file.type,
          createdAt: serverTimestamp()
        });
      }
      
      // Refresh list
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMediaItems(items);
      
    } catch (err) {
      console.error("Error uploading files", err);
      alert("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };"""

content = content.replace(fetch_media_logic, fetch_media_logic + "\n" + handle_upload)

header_ui = """        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
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
                 <Loader2 className="w-4 h-4 animate-spin" />
               ) : (
                 <Upload className="w-4 h-4" />
               )}
               {uploading ? 'Yükleniyor...' : 'Yeni Görsel Yükle'}
             </button>
          </div>
        </div>"""

old_header_ui = """        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Dosya adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>"""

content = content.replace(old_header_ui, header_ui)

with open("src/components/MediaPickerModal.tsx", "w") as f:
    f.write(content)
