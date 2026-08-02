import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Globe } from 'lucide-react';
import { auth, loginWithGoogle } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function QuickNav() {
  const [user, setUser] = useState(auth.currentUser);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleAdminClick = async () => {
    if (user) {
      navigate('/admin');
    } else {
      try {
        await loginWithGoogle();
        navigate('/admin');
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2">
      {isAdminRoute ? (
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-[#33C1CF] text-teal-950 px-5 py-3 rounded-full shadow-2xl hover:bg-[#33C1CF]/90 transition-transform hover:scale-105 group border-2 border-white"
          title="Siteyi Önizle"
        >
          <Globe className="w-6 h-6 group-hover:animate-spin" />
          <span className="font-bold">Siteyi Önizle</span>
        </button>
      ) : (
        <button
          onClick={handleAdminClick}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-slate-800 transition-transform hover:scale-105 group border-2 border-white"
          title="Yönetim Paneli"
        >
          <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Yönetim Paneli</span>
        </button>
      )}
    </div>
  );
}
