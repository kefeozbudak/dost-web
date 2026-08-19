import re

with open('src/admin/hubs/ReportCenter.tsx', 'r') as f:
    code = f.read()

target = """            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Özgeçmiş Dosyası</span>
                <p className="text-sm font-semibold text-slate-800">{data.fileName || 'Yüklenmiş CV'}</p>
              </div>
              {data.cvUrl ? (
                <a href={data.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-900 transition">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Görüntüle / İndir
                </a>
              ) : (
                <span className="text-xs text-red-500 font-bold">Dosya Yok</span>
              )}
            </div>"""

new_logic = """            {Object.keys(data).filter(key => data[key]?.isUploaded).length > 0 ? (
              Object.keys(data).filter(key => data[key]?.isUploaded).map((key, idx) => {
                const file = data[key];
                return (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{key}</span>
                      <p className="text-sm font-semibold text-slate-800">{file.name || 'Yüklenmiş CV'}</p>
                    </div>
                    {file.dataUrl ? (
                      <a href={file.dataUrl} download={file.name} className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-900 transition">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        İndir
                      </a>
                    ) : file.cvUrl ? (
                        <a href={file.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-900 transition">
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          İndir
                        </a>
                    ) : (
                      <span className="text-xs text-red-500 font-bold">Dosya İçeriği Yok</span>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Özgeçmiş Dosyası</span>
                  <p className="text-sm font-semibold text-slate-800">{data.fileName || 'Yüklenmiş CV'}</p>
                </div>
                {data.cvUrl ? (
                  <a href={data.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-900 transition">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Görüntüle / İndir
                  </a>
                ) : (
                  <span className="text-xs text-red-500 font-bold">Dosya Yok</span>
                )}
              </div>
            )}"""

if target in code:
    code = code.replace(target, new_logic)
    with open('src/admin/hubs/ReportCenter.tsx', 'w') as f:
        f.write(code)
    print("Patched file view logic in ReportCenter")
else:
    print("Could not find target logic")
