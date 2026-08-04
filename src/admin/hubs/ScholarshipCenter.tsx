import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  FileText, Calendar, Trash2, CheckCircle2, Clock, Printer, 
  User, Phone, Mail, MapPin, GraduationCap, Search, X, MessageSquare,
  ChevronDown, ChevronUp, Award, Download, Building2, Filter
} from 'lucide-react';
import { format } from 'date-fns';

const ScholarshipReportView = ({ data }: { data: any }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm w-full max-w-4xl mx-auto my-4">
      <div className="p-6 space-y-8">
        {/* 1. ÖĞRENCİ BİLGİLERİ */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[#004899] text-xl">school</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">BURSLULUK ÖĞRENCİ BİLGİLERİ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Öğrenci Adı Soyadı</span>
              <p className="text-sm font-semibold text-slate-800">{data.student_fullname || data.studentName || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">T.C. Kimlik Numarası</span>
              <p className="text-sm font-semibold text-slate-800">{data.student_tc || data.studentTc || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doğum Tarihi</span>
              <p className="text-sm font-semibold text-slate-800">
                {data.dob ? data.dob.split('-').reverse().join('.') : (data.studentBirthDate ? data.studentBirthDate.split('-').reverse().join('.') : '-')}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cinsiyet</span>
              <p className="text-sm font-semibold text-slate-800">{data.gender || data.studentGender || '-'}</p>
            </div>
            <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sınıf Seviyesi</span>
              <p className="text-sm font-semibold text-slate-800">{data.grade || data.studentGrade || '-'}</p>
            </div>
          </div>
        </section>

        {/* 2. VELİ BİLGİLERİ */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[#004899] text-xl">family_restroom</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">VELİ BİLGİLERİ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Veli Adı Soyadı</span>
              <p className="text-sm font-semibold text-slate-800">{data.parent_fullname || data.parentName || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">T.C. Kimlik Numarası</span>
              <p className="text-sm font-semibold text-slate-800">{data.parent_tc || data.parentTc || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Telefon Numarası</span>
              <p className="text-sm font-semibold text-slate-800">{data.phone || data.parentPhone || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-posta Adresi</span>
              <p className="text-sm font-semibold text-slate-800">{data.email || data.parentEmail || '-'}</p>
            </div>
            <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Öğrenciye Yakınlık Derecesi</span>
              <p className="text-sm font-semibold text-slate-800">{data.relation || data.parentRelation || '-'}</p>
            </div>
          </div>
        </section>

        {/* 3. SINAV TERCİHLERİ */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[#004899] text-xl">location_on</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">KAMPÜS VE SINAV TERCİHLERİ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kampüs Seçimi</span>
              <p className="text-sm font-semibold text-slate-800">{data.campus || data.kampus || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sınav Tarihi / Seansı</span>
              <p className="text-sm font-semibold text-slate-800">{data.examSession || data.session || data.academic_year || data.academicYear || '-'}</p>
            </div>
            <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bizi nereden duydunuz?</span>
              <p className="text-sm font-semibold text-slate-800">{data.referral || data.heardFrom || '-'}</p>
            </div>
          </div>
        </section>

        {(data.notes || data.message) && (
          <section>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <span className="block text-[10px] font-bold text-[#002147] uppercase mb-1">Eklemek İstedikleriniz</span>
              <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap">{data.notes || data.message}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default function ScholarshipCenter() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Campus Tab State
  const [selectedCampusTab, setSelectedCampusTab] = useState<'all' | 'umitkoy' | 'eryaman' | 'oran'>('all');
  
  // Grade Filter State
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  
  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const mergeWithLocalBackup = (fetchedDocs: any[]) => {
      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('dost_scholarship_forms_deleted_ids') || '[]');
      } catch (e) {
        console.error("Localstorage deleted ids error", e);
      }

      let localItems: any[] = [];
      try {
        localItems = JSON.parse(localStorage.getItem('dost_scholarship_forms_backup') || '[]');
      } catch (e) {
        console.error("Localstorage backup read error", e);
      }

      const mergedMap = new Map<string, any>();
      fetchedDocs.forEach(item => {
        if (!deletedIds.includes(item.id)) {
          mergedMap.set(item.id, item);
        }
      });

      localItems.forEach(item => {
        if (!deletedIds.includes(item.id) && !mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        }
      });

      const mergedList = Array.from(mergedMap.values());
      try {
        localStorage.setItem('dost_scholarship_forms_backup', JSON.stringify(mergedList));
      } catch (e) {
        console.error("Localstorage set backup error", e);
      }

      return mergedList;
    };

    const unsubscribe = onSnapshot(collection(db, "forms"), (snapshot) => {
      const fetchedReports: any[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const merged = mergeWithLocalBackup(fetchedReports);
      setReports(merged);
      setLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error in ScholarshipCenter:", error);
      let localItems: any[] = [];
      try {
        localItems = JSON.parse(localStorage.getItem('dost_scholarship_forms_backup') || '[]');
      } catch (e) {
        console.error("Localstorage backup fallback read error", e);
      }
      setReports(localItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Bu bursluluk başvuru kaydını silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, "forms", id));
      } catch (err) {
        console.error("Firestore delete error, removing locally:", err);
      }
      try {
        const deletedIds = JSON.parse(localStorage.getItem('dost_scholarship_forms_deleted_ids') || '[]');
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          localStorage.setItem('dost_scholarship_forms_deleted_ids', JSON.stringify(deletedIds));
        }

        const localItems = JSON.parse(localStorage.getItem('dost_scholarship_forms_backup') || '[]');
        const updated = localItems.filter((item: any) => item.id !== id);
        localStorage.setItem('dost_scholarship_forms_backup', JSON.stringify(updated));
        setReports(updated);
      } catch (e) {
        console.error("Localstorage delete handling error", e);
      }
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = isSelectionMode ? selectedIds : filteredReports.map(r => r.id);
    if (idsToDelete.length === 0) return;

    if (confirm(`${idsToDelete.length} adet bursluluk başvuru kaydını silmek istediğinize emin misiniz?`)) {
      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('dost_scholarship_forms_deleted_ids') || '[]');
      } catch (e) {
        console.error(e);
      }

      for (const id of idsToDelete) {
        try {
          await deleteDoc(doc(db, "forms", id));
        } catch (err) {
          console.error(err);
        }
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
        }
      }

      try {
        localStorage.setItem('dost_scholarship_forms_deleted_ids', JSON.stringify(deletedIds));
        const localItems = JSON.parse(localStorage.getItem('dost_scholarship_forms_backup') || '[]');
        const updated = localItems.filter((item: any) => !deletedIds.includes(item.id));
        localStorage.setItem('dost_scholarship_forms_backup', JSON.stringify(updated));
        setReports(updated);
      } catch (e) {
        console.error(e);
      }

      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  const handleStatusChange = async (report: any, nextStatus: string) => {
    try {
      await updateDoc(doc(db, "forms", report.id), { status: nextStatus });
    } catch (err) {
      console.error("Firestore update status error, updating locally:", err);
    }

    try {
      const localItems = JSON.parse(localStorage.getItem('dost_scholarship_forms_backup') || '[]');
      const updated = localItems.map((item: any) => item.id === report.id ? { ...item, status: nextStatus } : item);
      localStorage.setItem('dost_scholarship_forms_backup', JSON.stringify(updated));
      setReports(updated);
    } catch (err) {
      console.error("Error updating local storage on status change:", err);
    }
  };

  const extractSenderInfo = (data: any = {}) => {
    let name = data.student_fullname || data.studentName || data.parent_fullname || data.parentName || data.name || '';
    let phone = data.phone || data.parentPhone || '';
    let email = data.email || data.parentEmail || '';
    let kampus = data.campus || data.kampus || '';
    let kademe = data.grade || data.studentGrade || data.kademe || '';
    let message = data.notes || data.message || '';
    const otherFields: { label: string; value: any }[] = [];

    const keyTranslations: Record<string, string> = {
      student_fullname: "Öğrenci Adı Soyadı",
      student_tc: "Öğrenci TC",
      dob: "Doğum Tarihi",
      gender: "Cinsiyet",
      grade: "Sınıf Seviyesi",
      parent_fullname: "Veli Adı Soyadı",
      parent_tc: "Veli TC",
      phone: "Telefon",
      email: "E-posta",
      relation: "Yakınlık",
      campus: "Kampüs",
      examSession: "Sınav Seansı",
      referral: "Nereden Duydu",
      notes: "Ek Notlar"
    };

    Object.entries(data).forEach(([key, val]) => {
      if (!val) return;
      const lowerKey = key.toLowerCase().trim();
      const label = keyTranslations[key] || key;
      if (lowerKey.includes('formname')) return;

      if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('grade')) {
        if (!kademe) kademe = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('kampüs') || lowerKey.includes('kampus') || lowerKey.includes('campus')) {
        if (!kampus) kampus = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('telefon') || lowerKey.includes('tel') || lowerKey.includes('phone')) {
        if (!phone) phone = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('email') || lowerKey.includes('eposta') || lowerKey.includes('e-posta')) {
        if (!email) email = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('mesaj') || lowerKey.includes('not') || lowerKey.includes('notes')) {
        if (!message) message = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('adı') || lowerKey.includes('soyad') || lowerKey.includes('name')) {
        if (!name) name = String(val);
        else otherFields.push({ label, value: val });
      } else {
        otherFields.push({ label, value: val });
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

  // Helper to identify scholarship forms
  const isScholarshipForm = (r: any) => {
    if (r.type === 'scholarship_form' || r.type === 'bursluluk_form' || r.type === 'bursluluk_basvuru_formu') return true;
    if (r.data?.formName?.toLowerCase().includes('bursluluk') || r.data?.formType?.toLowerCase().includes('bursluluk')) return true;
    if (r.data?.title?.toLowerCase().includes('bursluluk')) return true;
    return false;
  };

  // Campus matching logic
  const matchCampus = (r: any, campusKey: string) => {
    if (campusKey === 'all') return true;
    const sender = extractSenderInfo(r.data);
    const c = (sender.kampus || r.data?.campus || r.data?.kampus || '').toLowerCase();
    if (campusKey === 'umitkoy') return c.includes('ümitköy') || c.includes('umitkoy');
    if (campusKey === 'eryaman') return c.includes('eryaman');
    if (campusKey === 'oran') return c.includes('oran');
    return false;
  };

  // Grade matching logic
  const matchGrade = (r: any, gradeNum: string) => {
    if (gradeNum === 'all') return true;
    const sender = extractSenderInfo(r.data);
    const g = (sender.kademe || r.data?.grade || r.data?.studentGrade || r.data?.kademe || '').toLowerCase();
    return g.includes(gradeNum);
  };

  // Base list of all scholarship reports
  const allScholarshipReports = reports.filter(isScholarshipForm);

  // Stats calculation
  const totalScholarshipCount = allScholarshipReports.length;
  const umitkoyTotalCount = allScholarshipReports.filter(r => matchCampus(r, 'umitkoy')).length;
  const eryamanTotalCount = allScholarshipReports.filter(r => matchCampus(r, 'eryaman')).length;
  const oranTotalCount = allScholarshipReports.filter(r => matchCampus(r, 'oran')).length;

  // Grade options based on selected campus tab
  // Ümitköy & Oran: 4, 5, 6, 7, 8
  // Eryaman & All: 4, 5, 6, 7, 8, 9, 10, 11
  const availableGradeList = selectedCampusTab === 'eryaman' || selectedCampusTab === 'all'
    ? ['4', '5', '6', '7', '8', '9', '10', '11']
    : ['4', '5', '6', '7', '8'];

  // Calculate grade counts for the currently selected campus
  const getGradeCount = (gradeNum: string) => {
    return allScholarshipReports.filter(r => matchCampus(r, selectedCampusTab) && matchGrade(r, gradeNum)).length;
  };

  // Filtered reports for display
  const filteredReports = allScholarshipReports.filter(r => {
    if (!matchCampus(r, selectedCampusTab)) return false;
    if (!matchGrade(r, selectedGradeFilter)) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const rawDataString = JSON.stringify(r.data || {}).toLowerCase();
      return rawDataString.includes(term);
    }

    return true;
  });

  const handlePrint = (target: 'all' | any) => {
    const items = target === 'all' ? filteredReports : [target];
    if (!items || items.length === 0) return;

    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Dost Koleji - Bursluluk Başvuru Raporu</title>
              <style>
                body { font-family: sans-serif; padding: 20px; line-height: 1.6; color: #000; }
                .report { border-bottom: 2px dashed #004899; padding-bottom: 20px; margin-bottom: 30px; page-break-after: always; }
                .dost-header { font-size: 22px; font-weight: 900; color: #004899; margin-bottom: 15px; border-bottom: 2px solid #004899; pb-2; }
                .row { margin-bottom: 8px; font-size: 14px; }
                .label { font-weight: bold; color: #333; }
              </style>
            </head>
            <body>
        `;

        items.forEach((item: any) => {
          const sender = extractSenderInfo(item.data);
          printContent += `
            <div class="report">
              <div class="dost-header">DOST KOLEJİ BURSLULUK SINAVI BAŞVURU KARTI</div>
              <div class="row"><span class="label">Başvuru Sahibi / Öğrenci:</span> ${sender.name}</div>
              <div class="row"><span class="label">Telefon:</span> ${sender.phone || '-'}</div>
              <div class="row"><span class="label">E-Posta:</span> ${sender.email || '-'}</div>
              <div class="row"><span class="label">Kampüs:</span> ${sender.kampus || '-'}</div>
              <div class="row"><span class="label">Sınıf / Kademe:</span> ${sender.kademe || '-'}</div>
              <div class="row"><span class="label">Başvuru Tarihi:</span> ${item.createdAt ? format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm') : '-'}</div>
              <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;" />
              <div style="font-weight: bold; margin-bottom: 5px;">Form Detayları:</div>
          `;

          Object.entries(item.data || {}).forEach(([k, v]) => {
            if (v && k !== 'formName') {
              printContent += `<div class="row"><span class="label">${k}:</span> ${v}</div>`;
            }
          });

          printContent += `</div>`;
        });

        printContent += `</body></html>`;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
      }
    } catch (e) {
      console.error(e);
      alert('Yazdırılamadı.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 bg-blue-50 text-[#004899] rounded-xl font-bold">
                <Award className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bursluluk Sınavı Merkezi</h1>
            </div>
            <p className="text-slate-500 text-sm">Bursluluk sınavı başvurularını kampüsler ve sınıf kademelerine göre detaylı filtreleyip yönetin.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePrint('all')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Rapor Çıktısı Al ({filteredReports.length})
            </button>

            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all border ${
                isSelectionMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSelectionMode ? 'Seçimi Kapat' : 'Çoklu Seçim'}
            </button>

            {isSelectionMode && selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm animate-in fade-in"
              >
                <Trash2 className="w-4 h-4" />
                Seçilenleri Sil ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* MAVİ ALAN: Stats Row - Toplam Başvuru ve Kampüslere Göre Dağılım */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Toplam Başvuru */}
          <div 
            onClick={() => { setSelectedCampusTab('all'); setSelectedGradeFilter('all'); }}
            className={`bg-white p-5 rounded-2xl border-2 shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
              selectedCampusTab === 'all' ? 'border-[#004899] bg-blue-50/20 ring-2 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="p-3 bg-blue-50 text-[#004899] rounded-xl font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Toplam Başvuru</span>
              <span className="text-2xl font-black text-slate-900">{totalScholarshipCount}</span>
            </div>
          </div>

          {/* Card 2: Ümitköy Kampüsü */}
          <div 
            onClick={() => { setSelectedCampusTab('umitkoy'); setSelectedGradeFilter('all'); }}
            className={`bg-white p-5 rounded-2xl border-2 shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
              selectedCampusTab === 'umitkoy' ? 'border-[#004899] bg-blue-50/20 ring-2 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ümitköy Kampüsü</span>
              <span className="text-2xl font-black text-slate-900">{umitkoyTotalCount}</span>
            </div>
          </div>

          {/* Card 3: Eryaman Kampüsü */}
          <div 
            onClick={() => { setSelectedCampusTab('eryaman'); setSelectedGradeFilter('all'); }}
            className={`bg-white p-5 rounded-2xl border-2 shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
              selectedCampusTab === 'eryaman' ? 'border-[#004899] bg-blue-50/20 ring-2 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eryaman Kampüsü</span>
              <span className="text-2xl font-black text-slate-900">{eryamanTotalCount}</span>
            </div>
          </div>

          {/* Card 4: Oran Kampüsü */}
          <div 
            onClick={() => { setSelectedCampusTab('oran'); setSelectedGradeFilter('all'); }}
            className={`bg-white p-5 rounded-2xl border-2 shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
              selectedCampusTab === 'oran' ? 'border-[#004899] bg-blue-50/20 ring-2 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Oran Kampüsü</span>
              <span className="text-2xl font-black text-slate-900">{oranTotalCount}</span>
            </div>
          </div>
        </div>

        {/* KIRMIZI ALAN: Kampüs ve Sınıf Kademe Filtreleme Alanı */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          
          {/* Top Bar: Campus Tabs & Search Box */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-100">
            {/* Campus Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => { setSelectedCampusTab('all'); setSelectedGradeFilter('all'); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCampusTab === 'all' ? 'bg-white text-[#004899] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tüm Başvurular ({totalScholarshipCount})
              </button>

              <button
                onClick={() => { setSelectedCampusTab('umitkoy'); setSelectedGradeFilter('all'); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCampusTab === 'umitkoy' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Ümitköy Kampüsü ({umitkoyTotalCount})
              </button>

              <button
                onClick={() => { setSelectedCampusTab('eryaman'); setSelectedGradeFilter('all'); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCampusTab === 'eryaman' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Eryaman Kampüsü ({eryamanTotalCount})
              </button>

              <button
                onClick={() => { setSelectedCampusTab('oran'); setSelectedGradeFilter('all'); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCampusTab === 'oran' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Oran Kampüsü ({oranTotalCount})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Öğrenci / veli adı veya TC ile ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sub Bar: Sınıf Kademeleri Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider mr-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Sınıf Kademe Filtresi:
            </span>

            {/* Tüm Kademeler Chip */}
            <button
              onClick={() => setSelectedGradeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedGradeFilter === 'all'
                  ? 'bg-[#004899] text-white border-[#004899] shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tüm Sınıflar ({allScholarshipReports.filter(r => matchCampus(r, selectedCampusTab)).length})
            </button>

            {/* Individual Grade Chips */}
            {availableGradeList.map((gradeNum) => {
              const count = getGradeCount(gradeNum);
              const isSelected = selectedGradeFilter === gradeNum;

              return (
                <button
                  key={gradeNum}
                  onClick={() => setSelectedGradeFilter(gradeNum)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : count > 0 
                        ? 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {gradeNum}. Sınıf ({count})
                </button>
              );
            })}
          </div>

        </div>

        {/* Content List */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400 font-medium">
            Başvurular yükleniyor...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Seçilen kriterlere uygun bursluluk başvurusu bulunamadı.</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Farklı bir kampüs veya sınıf kademesi seçerek veya arama terimini değiştirerek tekrar deneyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-500">
                Görüntülenen Kayıt Sayısı: <span className="text-slate-900 font-black">{filteredReports.length} adet başvuru</span>
              </span>

              <button
                onClick={() => handlePrint('all')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Bu Listeyi Yazdır
              </button>
            </div>

            {filteredReports.map((report) => {
              const sender = extractSenderInfo(report.data);
              const isExpanded = !!expandedIds[report.id];
              const status = report.status || 'pending';

              return (
                <div 
                  key={report.id} 
                  className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-sm space-y-4 ${
                    status === 'approved' ? 'border-emerald-200 bg-emerald-50/20' :
                    status === 'contacted' ? 'border-purple-200 bg-purple-50/20' :
                    status === 'cancelled' ? 'border-slate-200 opacity-75' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {isSelectionMode && (
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedIds.includes(report.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(prev => [...prev, report.id]);
                            else setSelectedIds(prev => prev.filter(i => i !== report.id));
                          }}
                        />
                      )}
                      
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.createdAt ? format(new Date(report.createdAt), 'dd.MM.yyyy HH:mm') : 'Tarih Belirtilmedi'}
                      </span>

                      <span className="px-2.5 py-1 bg-blue-50 text-[#004899] font-bold text-[11px] rounded-full border border-blue-100">
                        Bursluluk Sınav Başvurusu
                      </span>
                    </div>

                    {/* Status dropdown & action buttons */}
                    <div className="flex items-center gap-2">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(report, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                          status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          status === 'contacted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          status === 'cancelled' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">⏳ Beklemede</option>
                        <option value="approved">✅ Onaylandı / Kayıt Alındı</option>
                        <option value="contacted">📞 Görüşüldü</option>
                        <option value="cancelled">❌ İptal Edildi</option>
                      </select>

                      <button
                        onClick={() => handlePrint(report)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Yazdır"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Grid Card */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Öğrenci / Başvuran</span>
                      <p className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-600" />
                        {sender.name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">İletişim Numarası</span>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        {sender.phone || '-'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kampüs / Sınıf</span>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-purple-600" />
                        {sender.kampus || sender.kademe ? `${sender.kampus || ''} ${sender.kademe ? `(${sender.kademe})` : ''}` : '-'}
                      </p>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setExpandedIds(prev => ({ ...prev, [report.id]: !prev[report.id] }))}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 transition-all"
                      >
                        {isExpanded ? (
                          <>Detayları Gizle <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Sınav Belgesini Gör <ChevronDown className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Report View */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                      <ScholarshipReportView data={report.data} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
