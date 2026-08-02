import re

with open("src/admin/hubs/ReportCenter.tsx", "r") as f:
    content = f.read()

# Add states
content = content.replace("const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);", "const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);\n  const [isSelectionMode, setIsSelectionMode] = useState(false);\n  const [selectedIds, setSelectedIds] = useState<string[]>([]);")

# Fix handleBulkDelete
target_bulk_delete = r"const handleBulkDelete = async \(\) => \{(.*?)\} catch \(e\) \{"
replacement_bulk_delete = r"""const handleBulkDelete = async () => {
    const idsToDelete = isSelectionMode ? selectedIds : filteredReports.map(r => r.id);
    if (idsToDelete.length === 0) return;
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('dost_forms_deleted_ids') || '[]');
    } catch (e) {"""
content = re.sub(target_bulk_delete, replacement_bulk_delete, content, count=1, flags=re.DOTALL)

target_bulk_after = r"""    setBulkDeleteConfirm\(false\);
    const updatedReports = reports\.filter\(r => !expandedIdsToDelete\.has\(r\.id\)\);
    setReports\(updatedReports\);
  \};"""
replacement_bulk_after = r"""    setBulkDeleteConfirm(false);
    setIsSelectionMode(false);
    setSelectedIds([]);
    const updatedReports = reports.filter(r => !expandedIdsToDelete.has(r.id));
    setReports(updatedReports);
  };"""
content = re.sub(target_bulk_after, replacement_bulk_after, content, count=1)

# Fix Toplu Sil Button logic
target_bulk_btn = r"""              \{bulkDeleteConfirm \? \(
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1\.5">
                  <span className="text-xs font-bold text-red-700 px-2">Listelenenleri Sil\?</span>
                  <button 
                    onClick=\{handleBulkDelete\}
                    className="px-3 py-1\.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    Evet
                  </button>
                  <button 
                    onClick=\{\(\) => setBulkDeleteConfirm\(false\)\}
                    className="px-3 py-1\.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              \) : \(
                <button 
                  onClick=\{\(\) => setBulkDeleteConfirm\(true\)\}
                  disabled=\{filteredReports\.length === 0\}
                  className="flex items-center gap-2 px-4 py-2\.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  title="Listelenen tüm formları sil"
                >
                  <Trash2 className="w-4 h-4" />
                  Toplu Sil
                </button>
              \)\}"""

replacement_bulk_btn = r"""              {isSelectionMode ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-bold text-red-700 px-2">{selectedIds.length} seçili</span>
                  <button 
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                  >
                    Seçilenleri Sil
                  </button>
                  <button 
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedIds([]);
                    }}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSelectionMode(true)}
                  disabled={filteredReports.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  title="Toplu silme modunu aç"
                >
                  <Trash2 className="w-4 h-4" />
                  Toplu Sil
                </button>
              )}"""
content = re.sub(target_bulk_btn, replacement_bulk_btn, content, count=1)

# Add checkbox inside report mapping
target_report_mapping = r"""                    \{/\* Top Meta Bar \*/\}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-\[\#004899\]/10 text-\[\#004899\] text-xs font-black rounded-lg border border-\[\#004899\]/20">"""
replacement_report_mapping = r"""                    {/* Top Meta Bar */}
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
                        <span className="px-3 py-1 bg-[#004899]/10 text-[#004899] text-xs font-black rounded-lg border border-[#004899]/20">"""
content = re.sub(target_report_mapping, replacement_report_mapping, content, count=1)

with open("src/admin/hubs/ReportCenter.tsx", "w") as f:
    f.write(content)
