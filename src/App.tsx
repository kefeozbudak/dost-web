/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "./store/authStore";

// Placeholder imports for pages
import PublicView from "./pages/PublicView";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import PageEditor from "./admin/PageEditor";
import ReportCenter from "./admin/hubs/ReportCenter";
import LgsCenter from "./admin/hubs/LgsCenter";
import ClubCenter from "./admin/hubs/ClubCenter";
import ScholarshipCenter from "./admin/hubs/ScholarshipCenter";
import BackupCenter from "./admin/hubs/BackupCenter";
import AssistantCenter from "./admin/hubs/AssistantCenter";
import PagesCenter from "./admin/hubs/PagesCenter";
import AppearanceCenter from "./admin/hubs/AppearanceCenter";
import AnalyticsCenter from "./admin/hubs/AnalyticsCenter";
import MediaCenter from "./admin/hubs/MediaCenter";
import SettingsCenter from "./admin/hubs/SettingsCenter";
import UsersCenter from "./admin/hubs/UsersCenter";
import PopupCenter from "./admin/hubs/PopupCenter";
import QuickNav from "./components/QuickNav";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const { role, setAuthData } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        try {
          const userDocRef = doc(db, "users", currentUser.email);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setAuthData(data.role, data.allowedPages || []);
          } else {
            if (currentUser.email === "yasinozbudak@gmail.com") {
              await import("firebase/firestore").then(({ setDoc }) => {
                setDoc(userDocRef, {
                  email: currentUser.email,
                  role: "super_admin",
                  allowedPages: [],
                  createdAt: Date.now(),
                });
              });
              setAuthData("super_admin", []);
            } else {
              setAuthData("guest", []);
            }
          }
        } catch (e) {
          console.error("APP_ERROR:", e);
          setAuthData("guest", []);
        }
      } else {
        setAuthData(null, []);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setAuthData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        Yükleniyor...
      </div>
    );
  }

  // Create a helper for checking if the user is admin (any valid role)
  const isAdmin = (user || auth.currentUser) && role && role !== "guest";

  return (
    <BrowserRouter>
      <QuickNav />
      <Routes>
        {/* Public Routes */}
        <Route path="*" element={<PublicView />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="editor/:pageId" element={<PageEditor />} />
          <Route path="reports" element={<ReportCenter />} />
          <Route path="lgs-center" element={<LgsCenter />} />
          <Route path="clubs" element={<ClubCenter />} />
          <Route path="scholarship" element={<ScholarshipCenter />} />
          <Route path="backups" element={<BackupCenter />} />
          <Route path="assistant" element={<AssistantCenter />} />
          <Route path="pages" element={<PagesCenter />} />
          <Route path="appearance" element={<AppearanceCenter />} />
          <Route path="analytics" element={<AnalyticsCenter />} />
          <Route path="media" element={<MediaCenter />} />
          <Route path="settings" element={<SettingsCenter />} />
          <Route path="popups" element={<PopupCenter />} />
          <Route path="users" element={<UsersCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
