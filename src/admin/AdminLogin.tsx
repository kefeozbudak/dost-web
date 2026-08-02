import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../lib/firebase';
import { ShieldAlert } from 'lucide-react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuthData = useAuthStore(state => state.setAuthData);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle();
      const email = result.user.email;
      
      if (!email) {
         setError('Geçerli bir e-posta adresi bulunamadı.');
         setLoading(false);
         return;
      }

      if (email === 'yasinozbudak@gmail.com') {
         setAuthData('super_admin', []);
         navigate('/admin');
         return;
      }

      // Check role in database if not the main admin email
      const userDoc = await getDoc(doc(db, 'users', email));
      if (userDoc.exists()) {
         const data = userDoc.data();
         if (data.role && data.role !== 'guest') {
            setAuthData(data.role, data.allowedPages || []);
            navigate('/admin');
            return;
         }
      }
      
      setAuthData('guest', []);
      setError('Bu panele erişim yetkiniz bulunmamaktadır.');
    } catch (err: any) {
      console.error(err);
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#004899] to-slate-50 opacity-20 pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
        <div className="p-8 text-center bg-[#004899] text-white">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h1 className="text-2xl font-black mb-2 tracking-tight">Yönetici Girişi</h1>
          <p className="text-blue-100 text-sm leading-relaxed">Dost Koleji Yönetim Paneline erişmek için yetkili Google hesabınızla giriş yapın.</p>
        </div>
        <div className="p-8 pb-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100 text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-[#004899] hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 group cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#004899] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            Google ile Giriş Yap
          </button>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Güvenli Bağlantı (SSL)</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Sadece yetkilendirilmiş e-posta adresleri giriş yapabilir.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center relative z-10">
         <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-[#004899] transition-colors">
            ← Siteye Dön
         </button>
      </div>
    </div>
  );
}
