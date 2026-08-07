import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  Calculator,
  Trash2,
  Calendar,
  Search,
  Filter,
  Phone,
  AlertCircle,
  Download,
  CheckCircle2,
  Printer,
  ListChecks,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const LgsReportView = ({ data }: { data: any }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm w-full mx-auto my-4">
      <div className="p-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <Calculator className="w-5 h-5 text-[#002147]" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              HESAPLAMA SONUÇLARI
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Toplam Puan
              </span>
              <p className="text-2xl font-black text-indigo-600">
                {data.results?.totalScore?.toFixed(2) || "-"}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Yüzdelik Dilim
              </span>
              <p className="text-2xl font-black text-indigo-600">
                {data.results?.percentile || "-"}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Sayısal Net
              </span>
              <p className="text-xl font-bold text-slate-800">
                {data.results?.sayisalNet?.toFixed(2) || "-"}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Sözel Net
              </span>
              <p className="text-xl font-bold text-slate-800">
                {data.results?.sozelNet?.toFixed(2) || "-"}
              </p>
            </div>
          </div>
        </section>

        {data.subjects && (
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-[#002147] text-xl">
                analytics
              </span>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                DERS BAZINDA NETLER
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(data.subjects).map(
                ([key, subj]: [string, any]) => (
                  <div
                    key={key}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center"
                  >
                    <span className="text-sm font-bold text-slate-700 capitalize">
                      {key}
                    </span>
                    <div className="flex gap-3 text-xs font-medium">
                      <span className="text-emerald-600">{subj.correct || 0} D</span>
                      <span className="text-red-600">{subj.wrong || 0} Y</span>
                      <span className="text-slate-500">{subj.empty || 0} B</span>
                      <span className="text-indigo-600 font-bold ml-2">
                        {Number(subj.net).toFixed(2)} Net
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};


export default function LgsCenter() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'unread', 'read'
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "reports"), where("type", "==", "lgs_calculator"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const item = { id: doc.id, ...(doc.data() as any) };
          if (
            item.createdAt &&
            typeof item.createdAt === "object" &&
            item.createdAt.seconds
          ) {
            item.createdAt = item.createdAt.toDate().getTime();
          }
          return item;
        });
        setReports(data.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
      },
      (error) => {
        console.error("LGS raporları çekilirken hata:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "reports", id));
      } catch (error) {
        console.error("Kayıt silinirken hata:", error);
        alert("Kayıt silinirken bir hata oluştu.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const promises = selectedIds.map(id => deleteDoc(doc(db, "reports", id)));
      await Promise.all(promises);
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Toplu silme hatası:", error);
      alert("Kayıtlar silinirken bir hata oluştu.");
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "reports", id), {
        read: !currentStatus,
      });
    } catch (error) {
      console.error("Durum güncellenirken hata:", error);
    }
  };

  const toggleExpand = async (id: string, isRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!isRead) {
        await handleMarkAsRead(id, false);
      }
    }
  };

  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Tarih",
      "Öğrenci Adı",
      "Veli Adı",
      "Telefon",
      "Okul",
      "Toplam Puan",
      "Yüzdelik Dilim",
      "Sayısal Net",
      "Sözel Net",
      "Toplam Net",
      "Türkçe Net",
      "Matematik Net",
      "Fen Net",
      "İnkılap Net",
      "Din Net",
      "İngilizce Net",
    ];

    const csvData = filteredReports.map((report) => [
      report.createdAt
        ? format(report.createdAt?.toDate?.() || new Date(report.createdAt), "dd.MM.yyyy HH:mm")
        : "-",
      report.studentName || "-",
      report.parentName || "-",
      report.phone || "-",
      report.school || "-",
      report.results?.totalScore?.toFixed(2) || "-",
      report.results?.percentile || "-",
      report.results?.sayisalNet?.toFixed(2) || "-",
      report.results?.sozelNet?.toFixed(2) || "-",
      report.results?.totalNet?.toFixed(2) || "-",
      report.subjects?.turkce?.net?.toFixed(2) || "-",
      report.subjects?.matematik?.net?.toFixed(2) || "-",
      report.subjects?.fen?.net?.toFixed(2) || "-",
      report.subjects?.tarih?.net?.toFixed(2) || "-",
      report.subjects?.din?.net?.toFixed(2) || "-",
      report.subjects?.ingilizce?.net?.toFixed(2) || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,﻿" +
      [headers, ...csvData].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `lgs_sonuclari_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let printContent = `
          <html>
            <head>
              <title>LGS Merkezi Raporları</title>
              <style>
                @page { margin: 10mm; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; color: #222; margin: 0; background: #fff; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #002147; padding-bottom: 10px; }
                .header h1 { color: #002147; margin: 0 0 5px 0; font-size: 24px; }
                .header p { color: #555; font-size: 14px; margin: 0; }
                .report { border: 1px solid #ccc; margin-bottom: 30px; border-radius: 8px; page-break-inside: avoid; overflow: hidden; }
                .report-header { background-color: #f8fafc; padding: 12px 15px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center; }
                .report-header h2 { margin: 0; font-size: 16px; color: #0f172a; }
                .report-header .date { font-size: 12px; color: #64748b; }
                .student-info { display: flex; padding: 10px 15px; background: #fff; border-bottom: 1px solid #eee; font-size: 13px; }
                .student-info div { margin-right: 30px; }
                .student-info div strong { color: #475569; margin-right: 5px; }
                table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: center; }
                th { background-color: #f1f5f9; padding: 8px; border-bottom: 1px solid #cbd5e1; color: #334155; font-weight: 600; }
                td { padding: 8px; border-bottom: 1px solid #eee; }
                .table-row:last-child td { border-bottom: none; }
                .subj-name { text-align: left; font-weight: 500; color: #0f172a; padding-left: 15px; }
                .results-summary { display: flex; justify-content: space-around; background: #f8fafc; padding: 15px; border-top: 1px solid #ccc; }
                .result-box { text-align: center; }
                .result-box .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
                .result-box .value { font-size: 18px; font-weight: bold; color: #0f172a; }
                .result-box .value.score { color: #2563eb; }
                @media print {
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div style="display: flex; justify-content: space-between; align-items: center; text-align: left;">
                  <div>
                    <h1>LGS Merkezi Raporları</h1>
                    <p>Toplam Kayıt: ${filteredReports.length}</p>
                  </div>
                  <button onclick="window.print()" style="padding: 10px 20px; background: #002147; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Raporu Yazdır</button>
                </div>
              </div>
        `;

        filteredReports.forEach((report, index) => {
          const senderName = report.studentName || "İsimsiz Öğrenci";
          const date = report.createdAt ? format(report.createdAt?.toDate?.() || new Date(report.createdAt), "dd.MM.yyyy HH:mm") : "-";
          
          let subjectsHtml = '';
          if (report.subjects) {
             const subjNames = {
               turkce: "Türkçe",
               tarih: "T.C. İnkılap Tarihi",
               din: "Din Kültürü",
               ingilizce: "Yabancı Dil",
               matematik: "Matematik",
               fen: "Fen Bilimleri"
             };
             
             subjectsHtml += `
               <table>
                 <thead>
                   <tr>
                     <th style="text-align: left; padding-left: 15px;">Ders</th>
                     <th>Soru Sayısı</th>
                     <th>Doğru</th>
                     <th>Yanlış</th>
                     <th>Boş</th>
                     <th>Net</th>
                   </tr>
                 </thead>
                 <tbody>
             `;
             
             Object.entries(report.subjects).forEach(([key, subj]) => {
               // subj might be typed as any
               const typedSubj = subj as any;
               subjectsHtml += `
                 <tr class="table-row">
                   <td class="subj-name">${subjNames[key as keyof typeof subjNames] || key}</td>
                   <td>${typedSubj.total || 0}</td>
                   <td>${typedSubj.correct || 0}</td>
                   <td>${typedSubj.wrong || (typedSubj.incorrect || 0)}</td>
                   <td>${typedSubj.empty || 0}</td>
                   <td style="font-weight: bold; color: #2563eb;">${Number(typedSubj.net || 0).toFixed(2)}</td>
                 </tr>
               `;
             });
             
             subjectsHtml += `
                 </tbody>
               </table>
             `;
          } else {
             // Fallback if subjects object is missing
             subjectsHtml = `<div style="padding: 15px; text-align: center; color: #666; font-size: 13px;">Ders detayları bulunamadı.</div>`;
          }
          
          printContent += `
            <div class="report">
              <div class="report-header">
                <h2>#${index + 1} - ${senderName}</h2>
                <span class="date">${date}</span>
              </div>
              <div class="student-info">
                <div><strong>Telefon:</strong> ${report.phone || '-'}</div>
                <div><strong>Veli:</strong> ${report.parentName || '-'}</div>
                <div><strong>Okul:</strong> ${report.school || '-'}</div>
              </div>
              
              ${subjectsHtml}
              
              <div class="results-summary">
                <div class="result-box">
                  <div class="label">Toplam Doğru</div>
                  <div class="value">${report.results?.totalCorrect || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Toplam Yanlış</div>
                  <div class="value">${report.results?.totalWrong || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Toplam Boş</div>
                  <div class="value">${report.results?.totalEmpty || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Toplam Net</div>
                  <div class="value">${report.results?.totalNet?.toFixed(2) || report.results?.net?.toFixed(2) || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">LGS Puanı</div>
                  <div class="value score">${report.results?.totalScore?.toFixed(2) || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Yüzdelik Dilim</div>
                  <div class="value">${report.results?.percentile ? '%' + report.results.percentile : '-'}</div>
                </div>
              </div>
            </div>
          `;
        });

        printContent += `
            </body>
          </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    } catch (e) {
      alert('Yazdırma işlemi açılamadı. Lütfen pop-up engelleyicinizi kontrol edin.');
    }
  };

  const filteredReports = reports.filter((report) => {
    const searchString = `${report.studentName || ""} ${report.phone || ""} ${
      report.parentName || ""
    }`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());

    if (filterStatus === "read") return matchesSearch && report.read;
    if (filterStatus === "unread") return matchesSearch && !report.read;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1 flex items-center gap-3 text-[#004899]">
                <Calculator className="w-8 h-8 text-[#38C1D2]" />
                LGS Merkezi
              </h1>
              <p className="text-slate-500 text-sm">LGS puan hesaplama modülünden gelen sonuçları görüntüleyin</p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {bulkDeleteConfirm ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-1.5 rounded-xl animate-in fade-in zoom-in-95">
                  <span className="text-xs font-bold text-red-700 px-2">Listelenenleri Sil?</span>
                  <button 
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >Evet, Sil</button>
                  <button 
                    onClick={() => setBulkDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-white text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
                  >İptal</button>
                </div>
              ) : (
                <>
                  {selectedIds.length > 0 && (
                     <button
                       onClick={() => setBulkDeleteConfirm(true)}
                       className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
                     >
                       <Trash2 className="w-4 h-4" />
                       Seçilenleri Sil ({selectedIds.length})
                     </button>
                  )}
                  <button
                    onClick={handlePrint}
                    className="p-2 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                    title="Yazdır"
                  >
                    <Printer className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline-flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Yazdır
                    </span>
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="p-2 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                    title="Excel İndir"
                  >
                    <Download className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline-flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Excel İndir
                    </span>
                  </button>
                  <button
                    onClick={() => setIsSelectionMode(!isSelectionMode)}
                    className={`p-2 sm:px-4 sm:py-2 border rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-sm ${isSelectionMode ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    title="Çoklu Seçim"
                  >
                    {isSelectionMode ? <X className="w-4 h-4 sm:hidden" /> : <ListChecks className="w-4 h-4 sm:hidden" />}
                    <span className="hidden sm:inline-flex items-center gap-2">
                      {isSelectionMode ? <X className="w-4 h-4" /> : <ListChecks className="w-4 h-4" />}
                      {isSelectionMode ? 'İptal' : 'Seç'}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex w-full sm:w-auto items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Öğrenci veya telefon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 text-sm border-none focus:ring-0 p-0 outline-none"
                />
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border-none bg-transparent font-medium text-slate-700 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="all">Tümü</option>
                    <option value="unread">Yeni</option>
                    <option value="read">İncelendi</option>
                  </select>
                </div>
                <div className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
                  {filteredReports.length} Kayıt
                </div>
              </div>
            </div>

            {/* List */}
            <div className="p-4 md:p-6 bg-slate-50/30 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-700">
                      Sonuç Bulunamadı
                    </h3>
                    <p className="text-slate-500 mt-1">
                      Arama kriterlerinize uygun hesaplama bulunmuyor.
                    </p>
                  </div>
                ) : (
                  filteredReports.map((report) => {
                    const isExpanded = expandedId === report.id;
                    const senderName = report.studentName || "İsimsiz";

                    return (
                      <div 
                        key={report.id} 
                        className={`bg-white border-2 rounded-2xl p-4 md:p-5 transition-all shadow-sm space-y-3 ${
                          selectedIds.includes(report.id) ? 'border-indigo-500 bg-indigo-50/10' : (report.read ? 'border-slate-200 bg-slate-50/60 opacity-85' : 'border-slate-200 hover:border-[#38C1D2]')
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
                              LGS Puan Hesaplama
                            </span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleMarkAsRead(report.id, report.read); }}
                              className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                                report.read ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {report.read ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                              {report.read ? 'İncelendi' : 'Yeni / Bekliyor'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {report.createdAt ? format(new Date(report.createdAt), "dd.MM.yyyy HH:mm") : "-"}
                            </span>
                            
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                              className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-200/60"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              Sil
                            </button>
                          </div>
                        </div>

                        {/* Main Content Area */}
                        <div 
                          onClick={() => toggleExpand(report.id, report.read)}
                          className="cursor-pointer group select-none"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                                {senderName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                                  {senderName}
                                </p>
                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3.5 h-3.5" />
                                  {report.phone || '-'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
                              {!isExpanded && (
                                <div className="flex flex-1 sm:flex-initial items-center justify-between sm:justify-start gap-2 text-xs text-slate-600 font-medium">
                                  {report.results?.totalScore && (
                                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-indigo-700 font-bold whitespace-nowrap">
                                      Puan: {report.results.totalScore.toFixed(2)}
                                    </span>
                                  )}
                                  {report.results?.percentile && (
                                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-emerald-600 font-bold whitespace-nowrap">
                                      %{report.results.percentile}
                                    </span>
                                  )}
                                </div>
                              )}
                              <button className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0">
                                {isExpanded ? (
                                  <>
                                    <span className="hidden sm:inline">Daralt</span>
                                    <ChevronUp className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    <span className="hidden sm:inline">İncele</span>
                                    <ChevronDown className="w-4 h-4" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* EXPANDABLE DETAILS */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                            <LgsReportView data={report} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
