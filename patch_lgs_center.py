import re

with open("src/admin/hubs/LgsCenter.tsx", "r") as f:
    c = f.read()

# Replace the table layout with the same design as ReportCenter
new_content = """import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Calculator, Trash2, Calendar, Search, Filter, Phone, AlertCircle, Download, CheckCircle2, ChevronDown, ChevronUp, MessageSquare, GraduationCap, MapPin } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const LgsReportView = ({ data }: { data: any }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm w-full mx-auto my-4">
      <div className="p-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <Calculator className="w-5 h-5 text-[#002147]" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">HESAPLAMA SONUÇLARI</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Toplam Puan</span>
              <p className="text-2xl font-black text-indigo-600">{data.results?.totalScore?.toFixed(2) || '-'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Yüzdelik Dilim</span>
              <p className="text-2xl font-black text-indigo-600">{data.results?.percentile || '-'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sayısal Net</span>
              <p className="text-xl font-bold text-slate-800">{data.results?.sayisalNet?.toFixed(2) || '-'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sözel Net</span>
              <p className="text-xl font-bold text-slate-800">{data.results?.sozelNet?.toFixed(2) || '-'}</p>
            </div>
          </div>
        </section>
        
        {data.subjects && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[#002147] text-xl">analytics</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">DERS BAZINDA NETLER</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.subjects).map(([key, subj]: [string, any]) => (
              <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700 capitalize">{key}</span>
                <div className="flex gap-3 text-xs font-medium">
                  <span className="text-emerald-600">{subj.correct} D</span>
                  <span className="text-red-600">{subj.wrong} Y</span>
                  <span className="text-slate-500">{subj.empty} B</span>
                  <span className="text-indigo-600 font-bold ml-2">{subj.net} Net</span>
                </div>
              </div>
            ))}
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const item = { id: doc.id, ...(doc.data() as any) };
          // If createdAt is a timestamp, convert it
          if (item.createdAt && typeof item.createdAt === 'object' && item.createdAt.seconds) {
            item.createdAt = item.createdAt.toDate().getTime();
          }
          return item;
        });
        
        // Sadece LGS Calculator verilerini filtrele
        const lgsData = data.filter((item) => item.type === "lgs_calculator");
        setReports(lgsData.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
      },
      (error) => {
        console.error("LGS raporları çekilirken hata:", error);
        setLoading(false);
      }
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

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "reports", id), {
        read: !currentStatus,
      });
    } catch (error) {
      console.error("Durum güncellenirken hata:", error);
    }
  };

  const exportToCSV = () => {
    // ... same as before
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
      report.createdAt ? format(new Date(report.createdAt), "dd.MM.yyyy HH:mm") : "-",
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
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...csvData].map((e) => e.join(",")).join("\\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lgs_sonuclari_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const filteredReports = reports.filter((report) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (report.studentName || "").toLowerCase().includes(search) ||
      (report.parentName || "").toLowerCase().includes(search) ||
      (report.phone || "").toLowerCase().includes(search);

    if (filterStatus === "read") return matchesSearch && report.read;
    if (filterStatus === "unread") return matchesSearch && !report.read;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
            <Calculator className="w-6 h-6 text-[#002147]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">LGS Merkezi</h1>
            <p className="text-sm font-medium text-slate-500">LGS puan hesaplama modülünden gelen sonuçları görüntüleyin</p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Excel (CSV) İndir
        </button>
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
        <div className="p-4 bg-slate-50/30 flex-1 overflow-y-auto">
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Sonuç Bulunamadı</h3>
                <p className="text-slate-500 mt-1">Arama kriterlerinize uygun hesaplama bulunmuyor.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isExpanded = expandedId === report.id;
                const senderName = report.studentName || 'İsimsiz';
                
                return (
                  <div key={report.id} className="relative group">
                    {!report.read && (
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10 shadow-sm animate-pulse" />
                    )}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(report.id, report.read);
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-[#004899] hover:bg-blue-50 shadow-sm"
                        title={report.read ? "Okunmadı İşaretle" : "Okundu İşaretle"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 shadow-sm"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div 
                      onClick={() => toggleExpand(report.id, report.read)}
                      className={`p-3 bg-white border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between select-none shadow-sm ${!report.read ? 'border-red-200 bg-red-50/10' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{report.createdAt ? format(report.createdAt, "dd MMM HH:mm", { locale: tr }) : ''}</span>
                          </div>
                          <p className="text-base font-black text-indigo-900">{senderName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {!isExpanded && (
                          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 font-medium mr-4">
                            {report.results?.totalScore && <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-indigo-700 font-bold">Puan: {report.results.totalScore.toFixed(2)}</span>}
                            {report.results?.percentile && <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-emerald-600 font-bold">%{report.results.percentile}</span>}
                            {report.phone && <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">{report.phone}</span>}
                          </div>
                        )}
                        <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors">
                          {isExpanded ? (
                            <><span>Daralt</span><ChevronUp className="w-4 h-4 text-indigo-700" /></>
                          ) : (
                            <><span>Genişlet</span><ChevronDown className="w-4 h-4 text-indigo-700" /></>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDABLE DETAILS */}
                    {isExpanded && (
                      <div className="mt-2">
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
  );
}
"""

with open("src/admin/hubs/LgsCenter.tsx", "w") as f:
    f.write(new_content)

