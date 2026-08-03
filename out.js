import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  FileText,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  Phone,
  MapPin,
  GraduationCap,
  Search,
  X,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
const PreRegistrationReportView = ({ data }) => {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm w-full max-w-4xl mx-auto my-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-8", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[#2b5ec9] text-xl", children: "school" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 uppercase tracking-wider", children: "\xD6\u011ERENC\u0130 B\u0130LG\u0130LER\u0130" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "\xD6\u011Frenci Ad\u0131 Soyad\u0131" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.studentName || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "T.C. Kimlik Numaras\u0131" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.studentTc || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Do\u011Fum Tarihi" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.studentBirthDate ? data.studentBirthDate.split("-").reverse().join(".") : "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Cinsiyet" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.studentGender || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Mevcut S\u0131n\u0131f Seviyesi" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.studentGrade || "-" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[#2b5ec9] text-xl", children: "family_restroom" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 uppercase tracking-wider", children: "VEL\u0130 B\u0130LG\u0130LER\u0130" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Veli Ad\u0131 Soyad\u0131" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.parentName || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "T.C. Kimlik Numaras\u0131" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.parentTc || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Telefon Numaras\u0131" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.parentPhone || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "E-posta Adresi" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.parentEmail || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "\xD6\u011Frenciye Yak\u0131nl\u0131k Derecesi" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.parentRelation || "-" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[#2b5ec9] text-xl", children: "location_on" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 uppercase tracking-wider", children: "KAMP\xDCS VE TERC\u0130HLER" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Kamp\xFCs Se\xE7imi" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.campus || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Akademik Y\u0131l" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.academicYear || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Bizi nereden duydunuz?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: data.heardFrom || "-" })
          ] })
        ] })
      ] }),
      data.notes && /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-100", children: [
        /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-[#002147] uppercase mb-1", children: "Eklemek \u0130stedikleriniz" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-800 whitespace-pre-wrap", children: data.notes })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-1.5 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "w-1/3 bg-[#2357c6]" }),
      /* @__PURE__ */ jsx("div", { className: "w-1/3 bg-[#001b3b]" }),
      /* @__PURE__ */ jsx("div", { className: "w-1/3 bg-[#2b5ec9]" })
    ] })
  ] });
};
const PreRegistrationPrintView = ({ data, date, index }) => {
  return /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #e2e8f0", borderRadius: "8px", marginBottom: "24px", pageBreakInside: "avoid", overflow: "hidden", fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { padding: "24px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: "16px" }, children: /* @__PURE__ */ jsxs("div", { style: { fontSize: "12px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }, children: [
        "#",
        index + 1,
        " - \xD6\u011ERENC\u0130 \xD6N KAYIT FORMU"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: "bold", color: "#1e293b" }, children: "1. \xD6\u011ERENC\u0130 B\u0130LG\u0130LER\u0130" }) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "\xD6\u011Frenci Ad\u0131 Soyad\u0131" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.studentName || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "T.C. Kimlik Numaras\u0131" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.studentTc || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Do\u011Fum Tarihi" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.studentBirthDate ? data.studentBirthDate.split("-").reverse().join(".") : "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Cinsiyet" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.studentGender || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 100%", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Mevcut S\u0131n\u0131f Seviyesi" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.studentGrade || "-" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: "bold", color: "#1e293b" }, children: "2. VEL\u0130 B\u0130LG\u0130LER\u0130" }) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Veli Ad\u0131 Soyad\u0131" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.parentName || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "T.C. Kimlik Numaras\u0131" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.parentTc || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Telefon Numaras\u0131" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.parentPhone || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "E-posta Adresi" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.parentEmail || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 100%", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "\xD6\u011Frenciye Yak\u0131nl\u0131k Derecesi" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.parentRelation || "-" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: data.notes ? "24px" : "0" }, children: [
        /* @__PURE__ */ jsx("div", { style: { borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: "bold", color: "#1e293b" }, children: "3. KAMP\xDCS VE TERC\u0130HLER" }) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Kamp\xFCs Se\xE7imi" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.campus || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 calc(50% - 8px)", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Akademik Y\u0131l" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.academicYear || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: "1 1 100%", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }, children: "Bizi nereden duydunuz?" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "600", color: "#0f172a" }, children: data.heardFrom || "-" })
          ] })
        ] })
      ] }),
      data.notes && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: { borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: "bold", color: "#1e293b" }, children: "4. EK NOTLAR" }) }),
        /* @__PURE__ */ jsx("div", { style: { backgroundColor: "#eff6ff", padding: "16px", borderRadius: "6px", border: "1px solid #dbeafe" }, children: /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: "500", color: "#1e3a8a", whiteSpace: "pre-wrap" }, children: data.notes }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", height: "6px", width: "100%" }, children: [
      /* @__PURE__ */ jsx("div", { style: { flex: "1", backgroundColor: "#2357c6" } }),
      /* @__PURE__ */ jsx("div", { style: { flex: "1", backgroundColor: "#001b3b" } }),
      /* @__PURE__ */ jsx("div", { style: { flex: "1", backgroundColor: "#2b5ec9" } })
    ] })
  ] });
};
export default function ReportCenter() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKampus, setFilterKampus] = useState("");
  const [filterKademe, setFilterKademe] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const [printTarget, setPrintTarget] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  useEffect(() => {
    const mergeWithLocalBackup = (firestoreItems) => {
      let localItems = [];
      try {
        localItems = JSON.parse(localStorage.getItem("dost_forms_backup") || "[]");
      } catch (e) {
        localItems = [];
      }
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem("dost_forms_deleted_ids") || "[]");
      } catch (e) {
        deletedIds = [];
      }
      const map = /* @__PURE__ */ new Map();
      firestoreItems.forEach((item) => {
        if (item && item.id && !deletedIds.includes(item.id)) {
          map.set(item.id, item);
        }
      });
      localItems.forEach((localItem) => {
        if (!localItem || !localItem.id || deletedIds.includes(localItem.id)) return;
        const localTime = typeof localItem.createdAt === "number" ? localItem.createdAt : 0;
        const localDataStr = JSON.stringify(localItem.data || {});
        let isDuplicate = false;
        for (const fsItem of firestoreItems) {
          const fsTime = typeof fsItem.createdAt === "number" ? fsItem.createdAt : fsItem.createdAt?.toMillis ? fsItem.createdAt.toMillis() : 0;
          const fsDataStr = JSON.stringify(fsItem.data || {});
          if (fsDataStr === localDataStr || localTime > 0 && fsTime > 0 && Math.abs(fsTime - localTime) < 3e3) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate && !map.has(localItem.id)) {
          map.set(localItem.id, localItem);
        }
      });
      const combined = Array.from(map.values());
      combined.sort((a, b) => {
        const timeA = typeof a.createdAt === "number" ? a.createdAt : a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = typeof b.createdAt === "number" ? b.createdAt : b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      try {
        localStorage.setItem("dost_forms_backup", JSON.stringify(combined));
      } catch (e) {
        console.warn("LocalStorage save warning:", e);
      }
      return combined;
    };
    const unsubscribe = onSnapshot(collection(db, "forms"), (snapshot) => {
      const fetchedReports = snapshot.docs.map((d) => ({
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
  const handleDelete = async (id) => {
    if (!id) return;
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem("dost_forms_deleted_ids") || "[]");
    } catch (e) {
      deletedIds = [];
    }
    const targetReport = reports.find((r) => r.id === id);
    const targetDataStr = targetReport ? JSON.stringify(targetReport.data || {}) : "";
    const targetTime = targetReport ? typeof targetReport.createdAt === "number" ? targetReport.createdAt : targetReport.createdAt?.toMillis ? targetReport.createdAt.toMillis() : 0 : 0;
    const idsToDelete = [id];
    reports.forEach((r) => {
      if (r.id === id) return;
      const rDataStr = JSON.stringify(r.data || {});
      const rTime = typeof r.createdAt === "number" ? r.createdAt : r.createdAt?.toMillis ? r.createdAt.toMillis() : 0;
      if (targetDataStr && rDataStr === targetDataStr || targetTime > 0 && rTime > 0 && Math.abs(rTime - targetTime) < 3e3) {
        idsToDelete.push(r.id);
      }
    });
    const updatedDeletedIds = Array.from(/* @__PURE__ */ new Set([...deletedIds, ...idsToDelete]));
    try {
      localStorage.setItem("dost_forms_deleted_ids", JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.warn("LocalStorage deleted_ids error:", e);
    }
    setReports((prev) => prev.filter((r) => !idsToDelete.includes(r.id)));
    setDeleteConfirmId(null);
    try {
      const localItems = JSON.parse(localStorage.getItem("dost_forms_backup") || "[]");
      const updatedBackup = localItems.filter((item) => !idsToDelete.includes(item.id));
      localStorage.setItem("dost_forms_backup", JSON.stringify(updatedBackup));
    } catch (err) {
      console.error("Error updating local storage on delete:", err);
    }
    for (const delId of idsToDelete) {
      if (!delId.startsWith("local_")) {
        try {
          await deleteDoc(doc(db, "forms", delId));
        } catch (err) {
          console.error("Error deleting form from Firestore:", err);
        }
      }
    }
  };
  const handleBulkDelete = async () => {
    const idsToDelete = isSelectionMode ? selectedIds : filteredReports.map((r) => r.id);
    if (idsToDelete.length === 0) return;
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem("dost_forms_deleted_ids") || "[]");
    } catch (e) {
      deletedIds = [];
    }
    const expandedIdsToDelete = /* @__PURE__ */ new Set();
    const reportsToProcess = isSelectionMode ? filteredReports.filter((r) => idsToDelete.includes(r.id)) : filteredReports;
    reportsToProcess.forEach((targetReport) => {
      const targetDataStr = JSON.stringify(targetReport.data || {});
      const targetTime = typeof targetReport.createdAt === "number" ? targetReport.createdAt : targetReport.createdAt?.toMillis ? targetReport.createdAt.toMillis() : 0;
      reports.forEach((r) => {
        const rDataStr = JSON.stringify(r.data || {});
        const rTime = typeof r.createdAt === "number" ? r.createdAt : r.createdAt?.toMillis ? r.createdAt.toMillis() : 0;
        if (targetDataStr && rDataStr === targetDataStr || targetTime > 0 && rTime > 0 && Math.abs(rTime - targetTime) < 3e3) {
          expandedIdsToDelete.add(r.id);
        }
      });
    });
    const idsToDeleteArray = Array.from(expandedIdsToDelete);
    const updatedDeletedIds = Array.from(/* @__PURE__ */ new Set([...deletedIds, ...idsToDeleteArray]));
    try {
      localStorage.setItem("dost_forms_deleted_ids", JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.warn("LocalStorage deleted_ids error:", e);
    }
    setReports((prev) => prev.filter((r) => !idsToDeleteArray.includes(r.id)));
    setBulkDeleteConfirm(false);
    try {
      const localItems = JSON.parse(localStorage.getItem("dost_forms_backup") || "[]");
      const updatedBackup = localItems.filter((item) => !idsToDeleteArray.includes(item.id));
      localStorage.setItem("dost_forms_backup", JSON.stringify(updatedBackup));
    } catch (err) {
      console.error("Error updating local storage on delete:", err);
    }
    for (const delId of idsToDeleteArray) {
      if (!delId.startsWith("local_")) {
        try {
          await deleteDoc(doc(db, "forms", delId));
        } catch (err) {
          console.error("Error deleting form from Firestore:", err);
        }
      }
    }
  };
  const handleToggleStatus = async (report) => {
    const nextStatus = report.status === "processed" ? "new" : "processed";
    try {
      await updateDoc(doc(db, "forms", report.id), {
        status: nextStatus
      });
    } catch (err) {
      console.error("Error updating status in Firestore:", err);
    }
    try {
      const localItems = JSON.parse(localStorage.getItem("dost_forms_backup") || "[]");
      const updated = localItems.map((item) => item.id === report.id ? { ...item, status: nextStatus } : item);
      localStorage.setItem("dost_forms_backup", JSON.stringify(updated));
      setReports(updated);
    } catch (err) {
      console.error("Error updating local storage on status change:", err);
    }
  };
  const formatReportDate = (rawDate) => {
    if (!rawDate) return "-";
    try {
      if (typeof rawDate === "number") {
        return format(new Date(rawDate), "dd.MM.yyyy HH:mm");
      }
      if (rawDate.toDate && typeof rawDate.toDate === "function") {
        return format(rawDate.toDate(), "dd.MM.yyyy HH:mm");
      }
      return format(new Date(rawDate), "dd.MM.yyyy HH:mm");
    } catch (e) {
      return "-";
    }
  };
  const extractSenderInfo = (data = {}) => {
    let name = "";
    let phone = "";
    let email = "";
    let kampus = "";
    let kademe = "";
    let message = "";
    const otherFields = [];
    const keyTranslations = {
      studentName: "\xD6\u011Frenci Ad\u0131",
      studentTc: "\xD6\u011Frenci TC",
      studentBirthDate: "Do\u011Fum Tarihi",
      studentGender: "Cinsiyet",
      studentGrade: "S\u0131n\u0131f Seviyesi",
      parentName: "Veli Ad\u0131",
      parentTc: "Veli TC",
      parentPhone: "Veli Telefon",
      parentEmail: "Veli E-posta",
      parentRelation: "Yak\u0131nl\u0131k",
      campus: "Kamp\xFCs",
      academicYear: "Akademik Y\u0131l",
      heardFrom: "Nereden Duydu",
      notes: "Ek Notlar"
    };
    Object.entries(data).forEach(([key, val]) => {
      if (!val) return;
      const lowerKey = key.toLowerCase().trim();
      const label = keyTranslations[key] || key;
      if (lowerKey.includes("formname")) return;
      if (lowerKey.includes("kademe") || lowerKey.includes("s\u0131n\u0131f") || lowerKey.includes("e\u011Fitim") || lowerKey.includes("grade")) {
        if (!kademe) kademe = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes("kamp\xFCs") || lowerKey.includes("kampus") || lowerKey.includes("campus")) {
        if (!kampus) kampus = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes("telefon") || lowerKey.includes("tel") || lowerKey.includes("phone") || lowerKey.includes("gsm")) {
        if (!phone) phone = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes("email") || lowerKey.includes("eposta") || lowerKey.includes("e-posta")) {
        if (!email) email = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes("mesaj") || lowerKey.includes("not") || lowerKey.includes("a\xE7\u0131klama") || lowerKey.includes("notes")) {
        if (!message) message = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes("ad\u0131") || lowerKey.includes("soyad") || lowerKey.includes("isim") || lowerKey.includes("ad ") || lowerKey === "ad" || lowerKey.includes("name")) {
        if (!name) name = String(val);
        else otherFields.push({ label, value: val });
      } else {
        otherFields.push({ label, value: val });
      }
    });
    return {
      name: name || "Belirtilmedi",
      phone,
      email,
      kampus,
      kademe,
      message,
      otherFields
    };
  };
  const filteredReports = reports.filter((r) => {
    if (activeTab === "chat" && !(r.type === "chat" || !r.type || r.data?.formName)) return false;
    if (activeTab === "pre_registration" && r.type !== "pre_registration_form") return false;
    if (activeTab === "contact" && r.type !== "contact_form") return false;
    const sender = extractSenderInfo(r.data);
    if (filterKampus && !sender.kampus.toLowerCase().includes(filterKampus.toLowerCase())) {
      return false;
    }
    if (filterKademe && !sender.kademe.toLowerCase().includes(filterKademe.toLowerCase())) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const rawDataString = JSON.stringify(r.data || {}).toLowerCase();
      return rawDataString.includes(term);
    }
    return true;
  });
  const chatFormsCount = reports.filter((r) => r.type === "chat" || !r.type || r.data?.formName).length;
  const handlePrint = (target) => {
    const items = target === "all" ? filteredReports : [target];
    if (!items || items.length === 0) return;
    try {
      const printWindow = window.open("", "_blank", "width=900,height=750");
      if (printWindow) {
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Dost Koleji - Form Rapor \xC7\u0131kt\u0131s\u0131</title>
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
                    <h1 class="title">DOST KOLEJ\u0130</h1>
                    <p class="subtitle">Rapor Merkezi - Ba\u015Fvuru Formu \xC7\u0131kt\u0131s\u0131</p>
                  </div>
                </div>
                <div class="meta">
                  <p style="margin: 0;"><strong>Tarih:</strong> ${format(/* @__PURE__ */ new Date(), "dd.MM.yyyy HH:mm")}</p>
                  <p style="margin: 0;"><strong>Kay\u0131t Say\u0131s\u0131:</strong> ${items.length}</p>
                </div>
              </div>

              ${items.map((rep, idx) => {
          const sender = extractSenderInfo(rep.data);
          const data = rep.data || {};
          if (rep.type === "pre_registration_form") {
            const birthDate = data.studentBirthDate ? data.studentBirthDate.split("-").reverse().join(".") : "-";
            return `
                    <div class="card" style="margin-bottom: 24px;">
                      <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                        <div style="font-size: 12px; color: #64748b; background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                          #${idx + 1} - \xD6\u011ERENC\u0130 \xD6N KAYIT FORMU
                        </div>
                      </div>
                      
                      <!-- 1. \xD6\u011ERENC\u0130 B\u0130LG\u0130LER\u0130 -->
                      <div style="margin-bottom: 24px;">
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">1. \xD6\u011ERENC\u0130 B\u0130LG\u0130LER\u0130</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">\xD6\u011Frenci Ad\u0131 Soyad\u0131</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.studentName || "-"}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">T.C. Kimlik Numaras\u0131</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.studentTc || "-"}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Do\u011Fum Tarihi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${birthDate}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Cinsiyet</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.studentGender || "-"}</div>
                          </div>
                          <div style="flex: 1 1 100%; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Mevcut S\u0131n\u0131f Seviyesi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.studentGrade || "-"}</div>
                          </div>
                        </div>
                      </div>

                      <!-- 2. VEL\u0130 B\u0130LG\u0130LER\u0130 -->
                      <div style="margin-bottom: 24px;">
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">2. VEL\u0130 B\u0130LG\u0130LER\u0130</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Veli Ad\u0131 Soyad\u0131</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.parentName || "-"}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">T.C. Kimlik Numaras\u0131</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.parentTc || "-"}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Telefon Numaras\u0131</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.parentPhone || "-"}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">E-posta Adresi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.parentEmail || "-"}</div>
                          </div>
                          <div style="flex: 1 1 100%; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">\xD6\u011Frenciye Yak\u0131nl\u0131k Derecesi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.parentRelation || "-"}</div>
                          </div>
                        </div>
                      </div>

                      <!-- 3. KAMP\xDCS VE TERC\u0130HLER -->
                      <div style="margin-bottom: ${data.notes ? "24px" : "0"};">
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">3. KAMP\xDCS VE TERC\u0130HLER</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Kamp\xFCs Se\xE7imi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.campus || "-"}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Akademik Y\u0131l</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.academicYear || "-"}</div>
                          </div>
                          <div style="flex: 1 1 100%; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Bizi nereden duydunuz?</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${data.heardFrom || "-"}</div>
                          </div>
                        </div>
                      </div>

                      <!-- 4. NOTLAR -->
                      ${data.notes ? `
                      <div>
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">4. EK NOTLAR</span>
                        </div>
                        <div style="background-color: #eff6ff; padding: 16px; border-radius: 6px; border: 1px solid #dbeafe;">
                          <div style="font-size: 13px; font-weight: 500; color: #1e3a8a; white-space: pre-wrap;">${data.notes}</div>
                        </div>
                      </div>
                      ` : ""}
                      
                      <!-- Footer bar -->
                      <div style="display: flex; height: 6px; width: 100%; margin-top: 24px; border-radius: 3px; overflow: hidden;">
                        <div style="flex: 1; background-color: #2357c6;"></div>
                        <div style="flex: 1; background-color: #001b3b;"></div>
                        <div style="flex: 1; background-color: #2b5ec9;"></div>
                      </div>
                    </div>
                  `;
          }
          return `
                  <div class="card">
                    <div class="card-header">
                      <span class="form-name">#${idx + 1} - ${rep.type === "contact_form" ? "\u0130leti\u015Fim Formu" : rep.data?.formName || "Form"}</span>
                      <span class="date">${formatReportDate(rep.createdAt)}</span>
                    </div>
                    <div class="field"><strong>G\xF6nderen:</strong> ${sender.name || "Bilinmiyor"}</div>
                    <div class="field"><strong>\u0130lgilendi\u011Fi E\u011Fitim Kademesi:</strong> ${sender.kademe || "Belirtilmedi"}</div>
                    <div class="field"><strong>\u0130lgilendi\u011Fi Kamp\xFCs:</strong> ${sender.kampus || "Belirtilmedi"}</div>
                    <div class="field"><strong>Telefon Numaras\u0131:</strong> ${sender.phone || "Belirtilmedi"}</div>
                    ${sender.email ? `<div class="field"><strong>E-posta:</strong> ${sender.email}</div>` : ""}
                    <div class="message-box">
                      <strong>Mesaj:</strong><br/>
                      ${sender.message ? `"${sender.message}"` : "Mesaj bulunmuyor"}
                    </div>
                  </div>
                `;
        }).join("")}

              <div class="footer">Dost Koleji Y\xF6netim Paneli Rapor \xC7\u0131kt\u0131s\u0131</div>

              <script>
                window.onload = function() {
                  window.print();
                };
              <\/script>
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
    alert("Yazd\u0131rma i\u015Flemi a\xE7\u0131l\u0131r pencere (popup) engelleyicisi taraf\u0131ndan durduruldu. L\xFCtfen taray\u0131c\u0131n\u0131z\u0131n adres \xE7ubu\u011Fundan izin verin veya pop-up engelleyiciyi kapat\u0131n.");
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl md:text-3xl font-black tracking-tight mb-1 flex items-center gap-3 text-[#004899]", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8 text-[#38C1D2]" }),
            "Rapor Merkezi"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "Veli Asistan\u0131 ve web sitesi ba\u015Fvuru formlar\u0131n\u0131 canl\u0131 olarak takip edin ve PDF \xE7\u0131kt\u0131s\u0131 al\u0131n." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: bulkDeleteConfirm ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-red-50 border border-red-200 p-1.5 rounded-xl animate-in fade-in zoom-in-95", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-red-700 px-2", children: "Listelenenleri Sil?" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleBulkDelete,
              className: "px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors",
              children: "Evet, Sil"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setBulkDeleteConfirm(false),
              className: "px-3 py-1.5 bg-white text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold border border-slate-200 transition-colors",
              children: "\u0130ptal"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          selectedIds.length > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setBulkDeleteConfirm(true),
              className: "px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
                "Se\xE7ilenleri Sil (",
                selectedIds.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsSelectionMode(!isSelectionMode),
              className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${isSelectionMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
                isSelectionMode ? "Se\xE7imi \u0130ptal Et" : "Se\xE7"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handlePrint("all"),
              className: "px-4 py-2 bg-[#004899] hover:bg-[#003875] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" }),
                "T\xFCm\xFCn\xFC Yazd\u0131r"
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("chat"),
              className: `font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "chat" ? "bg-[#004899] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: [
                "Veli Asistan\u0131",
                /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === "chat" ? "bg-[#38C1D2] text-white" : "bg-slate-200 text-slate-700"}`, children: reports.filter((r) => r.type === "chat" || !r.type || r.data?.formName).length })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("pre_registration"),
              className: `font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "pre_registration" ? "bg-[#004899] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: [
                "\xD6N KAYIT FORMU",
                /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === "pre_registration" ? "bg-[#38C1D2] text-white" : "bg-slate-200 text-slate-700"}`, children: reports.filter((r) => r.type === "pre_registration_form").length })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("contact"),
              className: `font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "contact" ? "bg-[#004899] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: [
                "\u0130LET\u0130\u015E\u0130M SAYFASI",
                /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === "contact" ? "bg-[#38C1D2] text-white" : "bg-slate-200 text-slate-700"}`, children: reports.filter((r) => r.type === "contact_form").length })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("all"),
              className: `font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "all" ? "bg-[#004899] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: "T\xFCm Formlar"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "\u0130sim, telefon, kamp\xFCs veya mesajlarda ara...",
              className: "w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
            }
          ),
          searchTerm && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSearchTerm(""),
              className: "absolute right-2.5 top-2.5 p-0.5 hover:bg-slate-200 rounded-full text-slate-400",
              children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto flex-1 max-w-xs relative", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterKampus,
              onChange: (e) => setFilterKampus(e.target.value),
              className: "w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38C1D2]",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "T\xFCm Kamp\xFCsler" }),
                /* @__PURE__ */ jsx("option", { value: "\xFCmitk\xF6y", children: "\xDCmitk\xF6y Kamp\xFCs\xFC" }),
                /* @__PURE__ */ jsx("option", { value: "oran", children: "Oran Kamp\xFCs\xFC" }),
                /* @__PURE__ */ jsx("option", { value: "eryaman", children: "Eryaman Kamp\xFCs\xFC" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto flex-1 max-w-xs relative", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterKademe,
              onChange: (e) => setFilterKademe(e.target.value),
              className: "w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#38C1D2]",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "T\xFCm Kademeler" }),
                /* @__PURE__ */ jsx("option", { value: "anaokulu", children: "Anaokulu" }),
                /* @__PURE__ */ jsx("option", { value: "ilkokul", children: "\u0130lkokul" }),
                /* @__PURE__ */ jsx("option", { value: "ortaokul", children: "Ortaokul" }),
                /* @__PURE__ */ jsx("option", { value: "lise", children: "Lise" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-center text-slate-500 py-12 text-sm font-bold animate-pulse", children: "Formlar y\xFCkleniyor..." }) : filteredReports.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center text-slate-500 py-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6", children: [
      /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 text-slate-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "font-bold text-sm text-slate-700", children: "Hen\xFCz kay\u0131tl\u0131 bir form bulunmuyor." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Sitede Sitedeki formlar dolduruldu\u011Funda an\u0131nda buraya d\xFC\u015Fecektir." })
    ] }) : filteredReports.map((report) => {
      const isProcessed = report.status === "processed";
      const sender = extractSenderInfo(report.data);
      const isExpanded = !!expandedIds[report.id];
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `bg-white border-2 rounded-2xl p-4 md:p-5 transition-all shadow-sm space-y-3 ${isProcessed ? "border-slate-200 bg-slate-50/60 opacity-85" : "border-slate-200 hover:border-[#38C1D2]"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                isSelectionMode && /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 mr-2 cursor-pointer",
                    checked: selectedIds.includes(report.id),
                    onChange: (e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, report.id]);
                      } else {
                        setSelectedIds((prev) => prev.filter((id) => id !== report.id));
                      }
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-[#004899]/10 text-[#004899] text-xs font-black rounded-lg border border-[#004899]/20", children: report.type === "pre_registration_form" ? "\xD6n Kay\u0131t Formu" : report.type === "contact_form" ? "\u0130leti\u015Fim Formu" : report.data?.formName || "Veli Asistan\u0131 Formu" }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleToggleStatus(report);
                    },
                    className: `px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${isProcessed ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-amber-100 text-amber-800 hover:bg-amber-200"}`,
                    children: [
                      isProcessed ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-amber-600" }),
                      isProcessed ? "\u0130ncelendi" : "Yeni / Bekliyor"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-lg", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }),
                  formatReportDate(report.createdAt)
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handlePrint(report);
                    },
                    className: "flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#004899] hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-blue-200/60",
                    title: "Bu Raporu PDF Olarak \u0130ndir / Yazd\u0131r",
                    children: [
                      /* @__PURE__ */ jsx(Printer, { className: "w-3.5 h-3.5 text-[#38C1D2]" }),
                      "PDF / Yazd\u0131r"
                    ]
                  }
                ),
                deleteConfirmId === report.id ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-red-50 border border-red-200 p-1 rounded-xl animate-in fade-in zoom-in-95 duration-150", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-red-700 px-1", children: "Silinsin mi?" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDelete(report.id);
                      },
                      className: "px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs",
                      children: "Evet"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(null);
                      },
                      className: "px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                      children: "Vazge\xE7"
                    }
                  )
                ] }) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(report.id);
                    },
                    className: "p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer",
                    title: "Kayd\u0131 Sil",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => toggleExpand(report.id),
                className: "flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all select-none",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#004899] text-white flex items-center justify-center font-black text-base shadow-2xs shrink-0", children: (sender.name || "B").charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "G\xF6nderen" }),
                      /* @__PURE__ */ jsx("p", { className: "text-base font-black text-[#004899]", children: sender.name || "Bilinmiyor" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    !isExpanded && /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2 text-xs text-slate-600 font-medium", children: [
                      sender.kademe && /* @__PURE__ */ jsx("span", { className: "bg-white px-2.5 py-1 rounded-md border border-slate-200", children: sender.kademe }),
                      sender.kampus && /* @__PURE__ */ jsx("span", { className: "bg-white px-2.5 py-1 rounded-md border border-slate-200", children: sender.kampus }),
                      sender.phone && /* @__PURE__ */ jsx("span", { className: "bg-white px-2.5 py-1 rounded-md border border-slate-200", children: sender.phone })
                    ] }),
                    /* @__PURE__ */ jsx("button", { className: "flex items-center gap-1.5 text-xs font-bold text-[#004899] px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition-colors", children: isExpanded ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { children: "Detay\u0131 Kapat" }),
                      /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 text-[#004899]" })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { children: "Detay\u0131 G\xF6r" }),
                      /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-[#004899]" })
                    ] }) })
                  ] })
                ]
              }
            ),
            isExpanded && (report.type === "pre_registration_form" ? /* @__PURE__ */ jsx(PreRegistrationReportView, { data: report.data }) : /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-blue-50/50 to-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#004899] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0", children: (sender.name || "B").charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider block", children: "G\xF6nderen" }),
                    /* @__PURE__ */ jsx("span", { className: "text-base font-black text-[#004899]", children: sender.name || "Bilinmiyor" })
                  ] })
                ] }),
                sender.phone && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `https://wa.me/90${sender.phone.replace(/\D/g, "")}`,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "self-start sm:self-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs",
                    onClick: (e) => e.stopPropagation(),
                    children: [
                      /* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5" }),
                      "WhatsApp"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5 text-[#004899]" }),
                    "\u0130lgilendi\u011Fi E\u011Fitim Kademesi"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm", children: sender.kademe || "Belirtilmedi" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-[#004899]" }),
                    "\u0130lgilendi\u011Fi Kamp\xFCs"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm", children: sender.kampus || "Belirtilmedi" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-[#004899]" }),
                    "Telefon Numaras\u0131"
                  ] }),
                  sender.phone ? /* @__PURE__ */ jsx("a", { href: `tel:${sender.phone}`, onClick: (e) => e.stopPropagation(), className: "font-bold text-[#004899] hover:underline block text-sm", children: sender.phone }) : /* @__PURE__ */ jsx("p", { className: "font-medium text-slate-400 text-sm", children: "Belirtilmedi" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-3.5 rounded-lg border border-slate-200/80 space-y-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5 text-[#38C1D2]" }),
                  "Mesaj"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap", children: sender.message ? `"${sender.message}"` : "Mesaj b\u0131rak\u0131lmad\u0131." })
              ] }),
              sender.otherFields.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1", children: sender.otherFields.map((field, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded border border-slate-200", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: [
                  field.label,
                  ":"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-800", children: String(field.value) })
              ] }, idx)) })
            ] }))
          ]
        },
        report.id
      );
    }) })
  ] }) });
}
;
