import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  FileText, Calendar, Trash2, CheckCircle2, Clock, Printer, 
  User, Phone, Mail, MapPin, GraduationCap, Search, X, MessageSquare,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';

export default function ReportCenter() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'all'>('chat');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKampus, setFilterKampus] = useState('');
  const [filterKademe, setFilterKademe] = useState('');
  
  // Track expanded cards (key = report id, val = boolean)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // PDF / Print Modal State
  const [printTarget, setPrintTarget] = useState<'all' | any | null>(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    // Helper to merge Firestore docs with local persistent backup
    const mergeWithLocalBackup = (firestoreItems: any[]) => {
      let localItems: any[] = [];
      try {
        localItems = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
      } catch (e) {
        localItems = [];
      }

      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('dost_forms_deleted_ids') || '[]');
      } catch (e) {
        deletedIds = [];
      }

      const map = new Map<string, any>();

      // 1. Add real Firestore items (excluding deleted ones)
      firestoreItems.forEach(item => {
        if (item && item.id && !deletedIds.includes(item.id)) {
          map.set(item.id, item);
        }
      });

      // 2. Add local backup items (excluding deleted ones and duplicates of firestore items)
      localItems.forEach(localItem => {
        if (!localItem || !localItem.id || deletedIds.includes(localItem.id)) return;

        const localTime = typeof localItem.createdAt === 'number' ? localItem.createdAt : 0;
        const localDataStr = JSON.stringify(localItem.data || {});

        let isDuplicate = false;
        for (const fsItem of firestoreItems) {
          const fsTime = typeof fsItem.createdAt === 'number' ? fsItem.createdAt : fsItem.createdAt?.toMillis ? fsItem.createdAt.toMillis() : 0;
          const fsDataStr = JSON.stringify(fsItem.data || {});

          if (fsDataStr === localDataStr || (localTime > 0 && fsTime > 0 && Math.abs(fsTime - localTime) < 3000)) {
            isDuplicate = true;
            break;
          }
        }

        if (!isDuplicate && !map.has(localItem.id)) {
          map.set(localItem.id, localItem);
        }
      });

      const combined = Array.from(map.values());

      // Sort newest first
      combined.sort((a, b) => {
        const timeA = typeof a.createdAt === 'number' ? a.createdAt : a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = typeof b.createdAt === 'number' ? b.createdAt : b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      // Update backup store with clean combined data
      try {
        localStorage.setItem('dost_forms_backup', JSON.stringify(combined));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }

      return combined;
    };

    // Real-time listener for forms collection
    const unsubscribe = onSnapshot(collection(db, 'forms'), (snapshot) => {
      const fetchedReports: any[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const merged = mergeWithLocalBackup(fetchedReports);
      setReports(merged);
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to forms:", error);
      const merged = mergeWithLocalBackup([]);
      setReports(merged);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    // Get deleted IDs history
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('dost_forms_deleted_ids') || '[]');
    } catch (e) {
      deletedIds = [];
    }

    // Find the target report to identify duplicate local/firestore IDs
    const targetReport = reports.find(r => r.id === id);
    const targetDataStr = targetReport ? JSON.stringify(targetReport.data || {}) : '';
    const targetTime = targetReport ? (typeof targetReport.createdAt === 'number' ? targetReport.createdAt : targetReport.createdAt?.toMillis ? targetReport.createdAt.toMillis() : 0) : 0;

    // Find all matching report IDs (e.g., local backup copies or duplicates)
    const idsToDelete = [id];
    reports.forEach(r => {
      if (r.id === id) return;
      const rDataStr = JSON.stringify(r.data || {});
      const rTime = typeof r.createdAt === 'number' ? r.createdAt : r.createdAt?.toMillis ? r.createdAt.toMillis() : 0;
      if ((targetDataStr && rDataStr === targetDataStr) || (targetTime > 0 && rTime > 0 && Math.abs(rTime - targetTime) < 3000)) {
        idsToDelete.push(r.id);
      }
    });

    const updatedDeletedIds = Array.from(new Set([...deletedIds, ...idsToDelete]));
    try {
      localStorage.setItem('dost_forms_deleted_ids', JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.warn('LocalStorage deleted_ids error:', e);
    }

    // Update state immediately in UI
    setReports(prev => prev.filter(r => !idsToDelete.includes(r.id)));
    setDeleteConfirmId(null);

    // Remove from localStorage backup
    try {
      const localItems = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
      const updatedBackup = localItems.filter((item: any) => !idsToDelete.includes(item.id));
      localStorage.setItem('dost_forms_backup', JSON.stringify(updatedBackup));
    } catch (err) {
      console.error("Error updating local storage on delete:", err);
    }

    // Delete from Firestore if valid Firestore doc ID (non-local)
    for (const delId of idsToDelete) {
      if (!delId.startsWith('local_')) {
        try {
          await deleteDoc(doc(db, 'forms', delId));
        } catch (err) {
          console.error("Error deleting form from Firestore:", err);
        }
      }
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = isSelectionMode ? selectedIds : filteredReports.map(r => r.id);
    if (idsToDelete.length === 0) return;
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('dost_forms_deleted_ids') || '[]');
    } catch (e) {
      deletedIds = [];
    }

    // Expand deletion to include duplicates in local memory (similar to handleDelete)
    const expandedIdsToDelete = new Set<string>();
    const reportsToProcess = isSelectionMode ? filteredReports.filter(r => idsToDelete.includes(r.id)) : filteredReports;
    reportsToProcess.forEach(targetReport => {
      const targetDataStr = JSON.stringify(targetReport.data || {});
      const targetTime = typeof targetReport.createdAt === 'number' ? targetReport.createdAt : targetReport.createdAt?.toMillis ? targetReport.createdAt.toMillis() : 0;
      
      reports.forEach(r => {
        const rDataStr = JSON.stringify(r.data || {});
        const rTime = typeof r.createdAt === 'number' ? r.createdAt : r.createdAt?.toMillis ? r.createdAt.toMillis() : 0;
        if ((targetDataStr && rDataStr === targetDataStr) || (targetTime > 0 && rTime > 0 && Math.abs(rTime - targetTime) < 3000)) {
          expandedIdsToDelete.add(r.id);
        }
      });
    });

    const idsToDeleteArray = Array.from(expandedIdsToDelete);

    const updatedDeletedIds = Array.from(new Set([...deletedIds, ...idsToDeleteArray]));
    try {
      localStorage.setItem('dost_forms_deleted_ids', JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.warn('LocalStorage deleted_ids error:', e);
    }

    setReports(prev => prev.filter(r => !idsToDeleteArray.includes(r.id)));
    setBulkDeleteConfirm(false);

    try {
      const localItems = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
      const updatedBackup = localItems.filter((item: any) => !idsToDeleteArray.includes(item.id));
      localStorage.setItem('dost_forms_backup', JSON.stringify(updatedBackup));
    } catch (err) {
      console.error("Error updating local storage on delete:", err);
    }

    for (const delId of idsToDeleteArray) {
      if (!delId.startsWith('local_')) {
        try {
          await deleteDoc(doc(db, 'forms', delId));
        } catch (err) {
          console.error("Error deleting form from Firestore:", err);
        }
      }
    }
  };

  const handleToggleStatus = async (report: any) => {
    const nextStatus = report.status === 'processed' ? 'new' : 'processed';
    // Update Firestore
    try {
      await updateDoc(doc(db, 'forms', report.id), {
        status: nextStatus
      });
    } catch (err) {
      console.error("Error updating status in Firestore:", err);
    }
    // Update localStorage backup
    try {
      const localItems = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
      const updated = localItems.map((item: any) => item.id === report.id ? { ...item, status: nextStatus } : item);
      localStorage.setItem('dost_forms_backup', JSON.stringify(updated));
      setReports(updated);
    } catch (err) {
      console.error("Error updating local storage on status change:", err);
    }
  };

  const formatReportDate = (rawDate: any) => {
    if (!rawDate) return '-';
    try {
      if (typeof rawDate === 'number') {
        return format(new Date(rawDate), 'dd.MM.yyyy HH:mm');
      }
      if (rawDate.toDate && typeof rawDate.toDate === 'function') {
        return format(rawDate.toDate(), 'dd.MM.yyyy HH:mm');
      }
      return format(new Date(rawDate), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return '-';
    }
  };

  // Helper to extract sender info dynamically
  const extractSenderInfo = (data: any = {}) => {
    let name = '';
    let phone = '';
    let email = '';
    let kampus = '';
    let kademe = '';
    let message = '';
    const otherFields: { label: string; value: any }[] = [];

    Object.entries(data).forEach(([key, val]) => {
      if (!val) return;
      const lowerKey = key.toLowerCase().trim();

      if (lowerKey.includes('formname')) return;

      if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('eğitim')) {
        if (!kademe) kademe = String(val);
      } else if (lowerKey.includes('kampüs') || lowerKey.includes('kampus')) {
        if (!kampus) kampus = String(val);
      } else if (lowerKey.includes('telefon') || lowerKey.includes('tel') || lowerKey.includes('phone') || lowerKey.includes('gsm')) {
        if (!phone) phone = String(val);
      } else if (lowerKey.includes('email') || lowerKey.includes('eposta') || lowerKey.includes('e-posta')) {
        if (!email) email = String(val);
      } else if (lowerKey.includes('mesaj') || lowerKey.includes('not') || lowerKey.includes('açıklama')) {
        if (!message) message = String(val);
      } else if (lowerKey.includes('adı') || lowerKey.includes('soyad') || lowerKey.includes('isim') || lowerKey.includes('ad ') || lowerKey === 'ad' || lowerKey.includes('name')) {
        if (!name) name = String(val);
      } else {
        otherFields.push({ label: key, value: val });
      }
    });

    return {
      name: name || 'Belirtilmedi',
      phone,
      email,
      kampus,
      kademe,
      message,
      otherFields
    };
  };

  // Filter forms based on tab & search term
  const filteredReports = reports.filter(r => {
    // Tab filter
    if (activeTab === 'chat' && !(r.type === 'chat' || !r.type || r.data?.formName)) {
      return false;
    }
    
    const sender = extractSenderInfo(r.data);

    if (filterKampus && !sender.kampus.toLowerCase().includes(filterKampus.toLowerCase())) {
      return false;
    }

    if (filterKademe && !sender.kademe.toLowerCase().includes(filterKademe.toLowerCase())) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const rawDataString = JSON.stringify(r.data || {}).toLowerCase();
      return rawDataString.includes(term);
    }
    return true;
  });

  const chatFormsCount = reports.filter(r => r.type === 'chat' || !r.type || r.data?.formName).length;

  const handlePrint = (target: 'all' | any) => {
    const items = target === 'all' ? filteredReports : [target];
    if (!items || items.length === 0) return;

    try {
      const printWindow = window.open('', '_blank', 'width=900,height=750');
      if (printWindow) {
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Dost Koleji - Form Rapor Çıktısı</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; line-height: 1.5; background: #fff; }
                .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #004899; padding-bottom: 12px; margin-bottom: 24px; }
                .logo-title { display: flex; align-items: center; gap: 12px; }
                .logo { height: 48px; width: auto; }
                .title { font-size: 20px; font-weight: 800; color: #004899; margin: 0; }
                .subtitle { font-size: 12px; color: #64748b; margin: 0; }
                .meta { text-align: right; font-size: 12px; color: #475569; }
                .card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; background: #ffffff; }
                .card-header { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
                .form-name { font-weight: 800; color: #004899; font-size: 14px; }
                .date { font-size: 12px; color: #64748b; }
                .field { margin-bottom: 8px; font-size: 13px; }
                .field strong { color: #334155; display: inline-block; width: 200px; }
                .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin-top: 10px; font-size: 13px; }
                .footer { text-align: center; margin-top: 32px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo-title">
                  <img src="/yelken_transparent.png" class="logo" alt="Dost Koleji" />
                  <div>
                    <h1 class="title">DOST KOLEJİ</h1>
                    <p class="subtitle">Rapor Merkezi - Başvuru Formu Çıktısı</p>
                  </div>
                </div>
                <div class="meta">
                  <p style="margin: 0;"><strong>Tarih:</strong> ${format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
                  <p style="margin: 0;"><strong>Kayıt Sayısı:</strong> ${items.length}</p>
                </div>
              </div>

              ${items.map((rep, idx) => {
                const sender = extractSenderInfo(rep.data);
                return `
                  <div class="card">
                    <div class="card-header">
                      <span class="form-name">#${idx + 1} - ${rep.data?.formName || 'İletişim Formu'}</span>
                      <span class="date">${formatReportDate(rep.createdAt)}</span>
                    </div>
                    <div class="field"><strong>Gönderen:</strong> ${sender.name || 'Bilinmiyor'}</div>
                    <div class="field"><strong>İlgilendiği Eğitim Kademesi:</strong> ${sender.kademe || 'Belirtilmedi'}</div>
                    <div class="field"><strong>İlgilendiği Kampüs:</strong> ${sender.kampus || 'Belirtilmedi'}</div>
                    <div class="field"><strong>Telefon Numarası:</strong> ${sender.phone || 'Belirtilmedi'}</div>
                    ${sender.email ? `<div class="field"><strong>E-posta:</strong> ${sender.email}</div>` : ''}
                    <div class="message-box">
                      <strong>Mesaj:</strong><br/>
                      ${sender.message ? `"${sender.message}"` : 'Mesaj bulunmuyor'}
                    </div>
                  </div>
                `;
              }).join('')}

              <div class="footer">Dost Koleji Yönetim Paneli Rapor Çıktısı</div>

              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        return;
      }
    } catch (e) {
      console.warn("Popup blocked, using fallback", e);
    }

    // Fallback
    setPrintTarget(target);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <>
      {/* Printable Area CSS for window.print() */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-report-area, #printable-report-area * {
            visibility: visible !important;
          }
          #printable-report-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            padding: 20px !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1 flex items-center gap-3 text-[#004899]">
                <FileText className="w-8 h-8 text-[#38C1D2]" />
                Rapor Merkezi
              </h1>
              <p className="text-slate-500 text-sm">Veli Asistanı ve web sitesi başvuru formlarını canlı olarak takip edin ve PDF çıktısı alın.</p>
            </div>

            {/* Print / Export All Button */}
            <div className="flex items-center gap-2">
              {bulkDeleteConfirm ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-1.5 rounded-xl animate-in fade-in zoom-in-95">
                  <span className="text-xs font-bold text-red-700 px-2">Listelenenleri Sil?</span>
                  <button 
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    Evet
                  </button>
                  <button 
                    onClick={() => setBulkDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setBulkDeleteConfirm(true)}
                  disabled={filteredReports.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  title="Listelenen tüm formları sil"
                >
                  <Trash2 className="w-4 h-4" />
                  Toplu Sil
                </button>
              )}
              
              <button 
                onClick={() => handlePrint('all')}
                disabled={filteredReports.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#004899] hover:bg-[#38C1D2] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                title="Listelenen tüm formları PDF / Yazdır"
              >
                <Printer className="w-4 h-4" />
                Listeyi PDF / Yazdır
              </button>
            </div>
          </div>

          {/* Controls & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-3 border-b md:border-b-0 border-slate-200 pb-2 md:pb-0">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'chat' 
                      ? 'bg-[#004899] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Veli Asistanı Formları
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'chat' ? 'bg-[#38C1D2] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {chatFormsCount}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('all')}
                  className={`font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-[#004899] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tüm Formlar ({reports.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="İsim, telefon, kampüs veya mesajlarda ara..." 
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-2.5 top-2.5 p-0.5 hover:bg-slate-200 rounded-full text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-full sm:w-auto flex-1 max-w-xs relative">
                <select
                  value={filterKampus}
                  onChange={(e) => setFilterKampus(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                >
                  <option value="">Tüm Kampüsler</option>
                  <option value="ümitköy">Ümitköy Kampüsü</option>
                  <option value="oran">Oran Kampüsü</option>
                  <option value="eryaman">Eryaman Kampüsü</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              <div className="w-full sm:w-auto flex-1 max-w-xs relative">
                <select
                  value={filterKademe}
                  onChange={(e) => setFilterKademe(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                >
                  <option value="">Tüm Kademeler</option>
                  <option value="anaokulu">Anaokulu</option>
                  <option value="ilkokul">İlkokul</option>
                  <option value="ortaokul">Ortaokul</option>
                  <option value="lise">Lise</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Main List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-500 py-12 text-sm font-bold animate-pulse">
                Formlar yükleniyor...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center text-slate-500 py-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-sm text-slate-700">Henüz kayıtlı bir form bulunmuyor.</p>
                <p className="text-xs text-slate-400 mt-1">Sitede Veli Asistanı formları doldurulduğunda anında buraya düşecektir.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isProcessed = report.status === 'processed';
                const sender = extractSenderInfo(report.data);
                const isExpanded = !!expandedIds[report.id];

                return (
                  <div 
                    key={report.id} 
                    className={`bg-white border-2 rounded-2xl p-4 md:p-5 transition-all shadow-sm space-y-3 ${
                      isProcessed ? 'border-slate-200 bg-slate-50/60 opacity-85' : 'border-slate-200 hover:border-[#38C1D2]'
                    }`}
                  >
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {isSelectionMode && (
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 mr-2 cursor-pointer"
                            checked={selectedIds.includes(report.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds(prev => [...prev, report.id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== report.id));
                              }
                            }}
                          />
                        )}
                        <span className="px-3 py-1 bg-[#004899]/10 text-[#004899] text-xs font-black rounded-lg border border-[#004899]/20">
                          {report.data?.formName || 'İletişim Formu'}
                        </span>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(report); }}
                          className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isProcessed ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {isProcessed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {isProcessed ? 'İncelendi' : 'Yeni / Bekliyor'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatReportDate(report.createdAt)}
                        </span>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handlePrint(report); }}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#004899] hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-blue-200/60"
                          title="Bu Raporu PDF Olarak İndir / Yazdır"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#38C1D2]" />
                          PDF / Yazdır
                        </button>

                        {deleteConfirmId === report.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 p-1 rounded-xl animate-in fade-in zoom-in-95 duration-150">
                            <span className="text-[11px] font-bold text-red-700 px-1">Silinsin mi?</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            >
                              Evet
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              Vazgeç
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(report.id); }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Kaydı Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ALWAYS VISIBLE SUMMARY BAR (CLICKABLE TO TOGGLE DETAILS) */}
                    <div 
                      onClick={() => toggleExpand(report.id)}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#004899] text-white flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                          {(sender.name || 'B').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gönderen</p>
                          <p className="text-base font-black text-[#004899]">{sender.name || 'Bilinmiyor'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isExpanded && (
                          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 font-medium">
                            {sender.kademe && <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">{sender.kademe}</span>}
                            {sender.kampus && <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">{sender.kampus}</span>}
                            {sender.phone && <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">{sender.phone}</span>}
                          </div>
                        )}
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#004899] px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition-colors">
                          {isExpanded ? (
                            <><span>Detayı Kapat</span><ChevronUp className="w-4 h-4 text-[#004899]" /></>
                          ) : (
                            <><span>Detayı Gör</span><ChevronDown className="w-4 h-4 text-[#004899]" /></>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDABLE DETAILS AREA */}
                    {isExpanded && (
                      <div className="bg-gradient-to-b from-blue-50/50 to-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
                        
                        {/* 1. Gönderen & WhatsApp */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#004899] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                              {(sender.name || 'B').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gönderen</span>
                              <span className="text-base font-black text-[#004899]">{sender.name || 'Bilinmiyor'}</span>
                            </div>
                          </div>

                          {sender.phone && (
                            <a 
                              href={`https://wa.me/90${sender.phone.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="self-start sm:self-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                          )}
                        </div>

                        {/* 2 & 3 & 4 Grid Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          
                          {/* 2. İlgilendiği Eğitim Kademesi */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-[#004899]" />
                              İlgilendiği Eğitim Kademesi
                            </span>
                            <p className="font-bold text-slate-800 text-sm">
                              {sender.kademe || 'Belirtilmedi'}
                            </p>
                          </div>

                          {/* 3. İlgilendiği Kampüs */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#004899]" />
                              İlgilendiği Kampüs
                            </span>
                            <p className="font-bold text-slate-800 text-sm">
                              {sender.kampus || 'Belirtilmedi'}
                            </p>
                          </div>

                          {/* 4. Telefon Numarası */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#004899]" />
                              Telefon Numarası
                            </span>
                            {sender.phone ? (
                              <a href={`tel:${sender.phone}`} onClick={(e) => e.stopPropagation()} className="font-bold text-[#004899] hover:underline block text-sm">
                                {sender.phone}
                              </a>
                            ) : (
                              <p className="font-medium text-slate-400 text-sm">Belirtilmedi</p>
                            )}
                          </div>

                        </div>

                        {/* 5. Mesaj */}
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#38C1D2]" />
                            Mesaj
                          </span>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {sender.message ? `"${sender.message}"` : 'Mesaj bırakılmadı.'}
                          </p>
                        </div>

                        {/* Extra fields if any */}
                        {sender.otherFields.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {sender.otherFields.map((field, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{field.label}:</span>
                                <p className="text-xs font-semibold text-slate-800">{String(field.value)}</p>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* PRINTABLE RENDER CONTAINER FOR WINDOW.PRINT() */}
      <div id="printable-report-area" className="hidden print:block">
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          {/* Print Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #004899', paddingBottom: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/yelken_transparent.png" alt="Dost Koleji" style={{ height: '48px', width: 'auto' }} />
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#004899', margin: 0 }}>DOST KOLEJİ</h1>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Rapor Merkezi - Başvuru Formu Dökümü</p>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#555' }}>
              <p style={{ margin: 0 }}><strong>Rapor Tarihi:</strong> {format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
              <p style={{ margin: 0 }}><strong>Toplam Kayıt:</strong> {printTarget === 'all' ? filteredReports.length : 1}</p>
            </div>
          </div>

          {/* Print Body */}
          {(printTarget === 'all' ? filteredReports : [printTarget]).map((rep, index) => {
            if (!rep) return null;
            const sender = extractSenderInfo(rep.data);
            return (
              <div key={rep.id || index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '20px', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: '#004899', fontSize: '14px' }}>
                    #{index + 1} - {rep.data?.formName || 'İletişim Formu'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Tarih: {formatReportDate(rep.createdAt)}
                  </span>
                </div>

                <div style={{ backgroundColor: '#fafafa', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', fontSize: '13px', lineHeight: '1.8' }}>
                  <p style={{ margin: 0 }}><strong>Gönderen:</strong> {sender.name || 'Bilinmiyor'}</p>
                  <p style={{ margin: 0 }}><strong>İlgilendiği Eğitim Kademesi:</strong> {sender.kademe || 'Belirtilmedi'}</p>
                  <p style={{ margin: 0 }}><strong>İlgilendiği Kampüs:</strong> {sender.kampus || 'Belirtilmedi'}</p>
                  <p style={{ margin: 0 }}><strong>Telefon Numarası:</strong> {sender.phone || 'Belirtilmedi'}</p>
                  {sender.email && <p style={{ margin: 0 }}><strong>E-posta:</strong> {sender.email}</p>}
                  <p style={{ margin: '8px 0 0 0', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}><strong>Mesaj:</strong> {sender.message || 'Mesaj bulunmuyor'}</p>
                </div>

                {sender.otherFields.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '11px', marginTop: '10px' }}>
                    {sender.otherFields.map((f, i) => (
                      <div key={i}>
                        <strong>{f.label}:</strong> {String(f.value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '30px', textAlign: 'center', fontSize: '10px', color: '#888' }}>
            Dost Koleji Yönetim Paneli Otomatik Çıktı Belgesidir.
          </div>
        </div>
      </div>
    </>
  );
}

