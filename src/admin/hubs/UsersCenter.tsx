import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ShieldCheck, UserPlus, Trash2, Edit, Key, X } from 'lucide-react';

interface UserData {
  id: string; // The email
  email: string;
  role: string;
  allowedPages: string[];
  createdAt: number;
}

const AVAILABLE_PAGES = [
  { id: 'dashboard', label: 'Genel Bakış (Ana Panel)' },
  { id: 'reports', label: 'Rapor Merkezi' },
  { id: 'clubs', label: 'Kulüp Merkezi' },
  { id: 'scholarship', label: 'Bursluluk Merkezi' },
  { id: 'pages', label: 'Sayfa Yönetimi' },
  { id: 'appearance', label: 'Görünüm & Menü' },
  { id: 'analytics', label: 'Trafik Analizi' },
  { id: 'settings', label: 'Sistem Ayarları' },
  { id: 'backups', label: 'Yedekleme & Drive' },
  { id: 'assistant', label: 'Veli Asistanı' }
];

export default function UsersCenter() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'editor',
    allowedPages: [] as string[]
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
      setUsers(fetched);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleOpenModal = (user?: UserData) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        email: user.email || user.id || '',
        role: user.role,
        allowedPages: user.allowedPages || []
      });
    } else {
      setEditingId(null);
      setFormData({
        email: '',
        role: 'editor',
        allowedPages: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    
    try {
      const emailId = formData.email.trim().toLowerCase();
      const userRef = doc(db, 'users', emailId);
      
      await setDoc(userRef, {
        email: emailId,
        role: formData.role,
        allowedPages: formData.role === 'restricted' ? formData.allowedPages : [],
        createdAt: editingId ? (users.find(u => u.id === editingId)?.createdAt || Date.now()) : Date.now()
      }, { merge: true });
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Kullanıcı kaydedilirken hata oluştu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (id === 'yasinozbudak@gmail.com') {
       alert('Ana yönetici silinemez.');
       return;
    }
    if (confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const togglePageAccess = (pageId: string) => {
    setFormData(prev => {
      const current = prev.allowedPages;
      if (current.includes(pageId)) {
        return { ...prev, allowedPages: current.filter(id => id !== pageId) };
      } else {
        return { ...prev, allowedPages: [...current, pageId] };
      }
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 bg-slate-50/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#004899]" />
            Kullanıcı & Yetki Yönetimi
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Yönetim paneline erişebilecek kullanıcıları ve yetkilerini yönetin.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#004899] text-white rounded-xl text-sm font-bold hover:bg-[#00387a] transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#004899] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
                  {(user.email || user.id || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(user)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  {(user.email || user.id) !== 'yasinozbudak@gmail.com' && (
                    <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 truncate" title={user.email || user.id}>{user.email || user.id}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Key className="w-3 h-3 text-slate-400" />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    user.role === 'super_admin' ? 'bg-purple-50 text-purple-700' :
                    user.role === 'editor' ? 'bg-blue-50 text-blue-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>
                    {user.role === 'super_admin' ? 'Süper Yönetici' : user.role === 'editor' ? 'Editör' : 'Özel Yetkili'}
                  </span>
                </div>
              </div>

              {user.role === 'restricted' && user.allowedPages && user.allowedPages.length > 0 && (
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Erişilebilir Sayfalar</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.allowedPages.map(pageId => {
                      const pageInfo = AVAILABLE_PAGES.find(p => p.id === pageId);
                      return (
                        <span key={pageId} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                          {pageInfo?.label || pageId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 overflow-y-auto space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">E-posta Adresi</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingId}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004899] disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="ornek@gmail.com"
                  />
                  {!editingId && <p className="text-xs text-slate-400 mt-1">Kullanıcının Google hesabı (Gmail) olması önerilir.</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Yetki Seviyesi</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004899]"
                  >
                    <option value="editor">Editör (Sistem Ayarları Hariç Genel Erişim)</option>
                    <option value="restricted">Özel Yetkili (Sadece Seçilen Sayfalar)</option>
                    <option value="super_admin">Süper Yönetici (Tüm Yetkiler)</option>
                  </select>
                </div>

                {formData.role === 'restricted' && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <label className="block text-xs font-bold text-slate-800 mb-3">Erişim Verilecek Sayfalar</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_PAGES.map(page => (
                        <label key={page.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allowedPages.includes(page.id)}
                            onChange={() => togglePageAccess(page.id)}
                            className="rounded border-slate-300 text-[#004899] focus:ring-[#004899]"
                          />
                          <span className="text-sm font-medium text-slate-700">{page.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#004899] text-white rounded-lg text-sm font-bold hover:bg-[#00387a] transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
