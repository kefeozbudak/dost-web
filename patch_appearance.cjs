const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

// Patch dropdown sublinks
const oldDropdownLink = `                               <div key={subIdx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded">
                                 <input type="text" value={sublink.label || ''} onChange={(e) => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks[subIdx].label = e.target.value;
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} placeholder="Link Adı" className="w-1/3 px-2 py-1 text-xs border rounded" />
                                 <div className="flex-1">
                                   {renderUrlEditor(sublink.url || '', (val) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].subLinks[subIdx].url = val;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   })}
                                 </div>
                                 <button onClick={() => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks.splice(subIdx, 1);
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>`;

const newDropdownLink = `                               <div key={subIdx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded items-center">
                                 <div className="flex flex-col gap-1">
                                   <button 
                                      onClick={() => {
                                        if (subIdx === 0) return;
                                        const newLinks = [...(headerData.links || [])];
                                        const temp = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = newLinks[index].subLinks[subIdx - 1];
                                        newLinks[index].subLinks[subIdx - 1] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }} 
                                      disabled={subIdx === 0}
                                      className={\`p-0.5 rounded \${subIdx === 0 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100'}\`}>
                                      <ChevronUp className="w-3.5 h-3.5" />
                                   </button>
                                   <button 
                                      onClick={() => {
                                        if (subIdx === link.subLinks.length - 1) return;
                                        const newLinks = [...(headerData.links || [])];
                                        const temp = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = newLinks[index].subLinks[subIdx + 1];
                                        newLinks[index].subLinks[subIdx + 1] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }} 
                                      disabled={subIdx === link.subLinks.length - 1}
                                      className={\`p-0.5 rounded \${subIdx === link.subLinks.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100'}\`}>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                   </button>
                                 </div>
                                 <input type="text" value={sublink.label || ''} onChange={(e) => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks[subIdx].label = e.target.value;
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} placeholder="Link Adı" className="w-1/3 px-2 py-1 text-xs border rounded" />
                                 <div className="flex-1">
                                   {renderUrlEditor(sublink.url || '', (val) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].subLinks[subIdx].url = val;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   })}
                                 </div>
                                 <button onClick={() => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks.splice(subIdx, 1);
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} className="p-1.5 text-red-500 hover:bg-red-50 rounded bg-red-50/50">
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>`;

file = file.replace(oldDropdownLink, newDropdownLink);

// Patch Mega Menu sublinks
const oldMegaMenuLink = `                                    {(col.links || []).map((clink: any, clinkIdx: number) => (
                                      <div key={clinkIdx} className="bg-slate-50 p-2 rounded border border-slate-100 relative group">
                                         <input type="text" value={clink.label || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].label = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="Link Adı" className="w-full px-2 py-1 mb-1 text-xs border rounded" />
                                         {renderUrlEditor(clink.url || "", (val) => { const newLinks = [...(headerData.links || [])]; newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].url = val; setHeaderData({ ...headerData, links: newLinks }); })}
                                         <input type="text" value={clink.desc || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].desc = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="Kısa Açıklama (Opsiyonel)" className="w-full px-2 py-1 mb-1 text-xs border rounded" />
                                         <input type="text" value={clink.icon || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].icon = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="İkon (Opsiyonel, örn: school)" className="w-full px-2 py-1 text-xs border rounded" />
                                         <button onClick={() => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links.splice(clinkIdx, 1);
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                           <Trash2 className="w-3 h-3" />
                                         </button>
                                      </div>
                                    ))}`;

const newMegaMenuLink = `                                    {(col.links || []).map((clink: any, clinkIdx: number) => (
                                      <div key={clinkIdx} className="bg-slate-50 p-2 rounded border border-slate-100 relative">
                                         <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-1">
                                              <button 
                                                onClick={() => {
                                                  if (clinkIdx === 0) return;
                                                  const newLinks = [...(headerData.links || [])];
                                                  const temp = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx] = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx - 1];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx - 1] = temp;
                                                  setHeaderData({ ...headerData, links: newLinks });
                                                }}
                                                disabled={clinkIdx === 0}
                                                className={\`p-1 rounded \${clinkIdx === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-200'}\`}>
                                                <ChevronUp className="w-3.5 h-3.5" />
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  if (clinkIdx === col.links.length - 1) return;
                                                  const newLinks = [...(headerData.links || [])];
                                                  const temp = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx] = newLinks[index].megaMenu.columns[colIdx].links[clinkIdx + 1];
                                                  newLinks[index].megaMenu.columns[colIdx].links[clinkIdx + 1] = temp;
                                                  setHeaderData({ ...headerData, links: newLinks });
                                                }}
                                                disabled={clinkIdx === col.links.length - 1}
                                                className={\`p-1 rounded \${clinkIdx === col.links.length - 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-200'}\`}>
                                                <ChevronDown className="w-3.5 h-3.5" />
                                              </button>
                                              <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Sıra: {clinkIdx + 1}</span>
                                            </div>
                                            <button onClick={() => {
                                                const newLinks = [...(headerData.links || [])];
                                                newLinks[index].megaMenu.columns[colIdx].links.splice(clinkIdx, 1);
                                                setHeaderData({ ...headerData, links: newLinks });
                                            }} className="bg-red-50 text-red-600 p-1.5 rounded hover:bg-red-100 transition-colors flex items-center gap-1">
                                              <Trash2 className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold uppercase">Sil</span>
                                            </button>
                                         </div>
                                         <input type="text" value={clink.label || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].label = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="Link Adı" className="w-full px-2 py-1 mb-1 text-xs border rounded" />
                                         {renderUrlEditor(clink.url || "", (val) => { const newLinks = [...(headerData.links || [])]; newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].url = val; setHeaderData({ ...headerData, links: newLinks }); })}
                                         <input type="text" value={clink.desc || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].desc = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="Kısa Açıklama (Opsiyonel)" className="w-full px-2 py-1 mb-1 text-xs border rounded mt-1" />
                                         <input type="text" value={clink.icon || ''} onChange={(e) => {
                                            const newLinks = [...(headerData.links || [])];
                                            newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].icon = e.target.value;
                                            setHeaderData({ ...headerData, links: newLinks });
                                         }} placeholder="İkon (Opsiyonel, örn: school)" className="w-full px-2 py-1 text-xs border rounded mt-1" />
                                      </div>
                                    ))}`;

file = file.replace(oldMegaMenuLink, newMegaMenuLink);
fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
