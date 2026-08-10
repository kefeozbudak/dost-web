import fs from 'fs';

let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const replacement = `            {renderArrayEditor(
              "items",
              [
                { key: "title", label: "Başlık", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon", type: "icon" },
                { key: "stat", label: "İstatistik (Kart 1)", type: "text" },
                {
                  key: "statLabel",
                  label: "İstatistik Etiketi (Kart 1)",
                  type: "text",
                },
                { key: "tag", label: "Rozet/Etiket (Kart 1)", type: "text" },
                {
                  key: "buttonText",
                  label: "Buton Metni (Kart 2)",
                  type: "text",
                },
                { key: "url", label: "Buton URL (Kart 2)", type: "url" },
                { key: "stat1Label", label: "İstatistik 1 Etiketi (Kart 2)", type: "text" },
                { key: "stat1Value", label: "İstatistik 1 Değeri (Kart 2)", type: "text" },
                { key: "stat2Label", label: "İstatistik 2 Etiketi (Kart 2)", type: "text" },
                { key: "stat2Value", label: "İstatistik 2 Değeri (Kart 2)", type: "text" },
                { key: "listString", label: "Özellik Listesi (Kart 3 - Her satıra bir tane)", type: "textarea" }
              ],
              "Öğeler (Max 3, Özel Tasarım)",
            )}`;

content = content.replace(/\{renderArrayEditor\(\s*"items",\s*\[[\s\S]*?\],\s*"Öğeler \(Max 3, Özel Tasarım\)",\s*\)\}/, replacement);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);

// Now update PageBlocks.tsx to use these new fields if the old arrays are not present or to gracefully handle them.
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Replace map of stats in YKS card
const statsMapRegex = /\{block\.items\[1\]\.stats\?\.map\(\(stat: any, i: number\) => \([\s\S]*?\}\)\)\}/g;
const newStatsRender = `{(() => {
                          const stats = block.items[1].stats || [];
                          if (block.items[1].stat1Label && block.items[1].stat1Value && stats.length === 0) {
                            stats.push({ label: block.items[1].stat1Label, value: block.items[1].stat1Value });
                          }
                          if (block.items[1].stat2Label && block.items[1].stat2Value && stats.length === 0) {
                            stats.push({ label: block.items[1].stat2Label, value: block.items[1].stat2Value });
                          }
                          return stats.map((stat: any, i: number) => (
                            <div key={i} className="bg-white/10 p-4 rounded-2xl whitespace-pre-line">
                              <div className="text-2xl font-bold text-gold whitespace-pre-line" style={{ color: "#D4AF37" }}>
                                {stat.value}
                              </div>
                              <div className="text-[10px] opacity-80 uppercase tracking-wider whitespace-pre-line">
                                {stat.label}
                              </div>
                            </div>
                          ));
                        })()}`;
pb = pb.replace(statsMapRegex, newStatsRender);

const listMapRegex = /\{block\.items\[2\]\.list\?\.map\(\s*\(\s*listItem:\s*string,\s*i:\s*number\s*\)\s*=>\s*\([\s\S]*?<\/li>\s*\)\s*\)\}/g;

const newListRender = `{(() => {
                          let list = block.items[2].list || [];
                          if (list.length === 0 && block.items[2].listString) {
                            list = block.items[2].listString.split('\\n').filter((x: string) => x.trim());
                          }
                          return list.map((listItem: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 whitespace-pre-line">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 whitespace-pre-line" style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}>
                                <span className="material-symbols-outlined text-gold text-lg whitespace-pre-line" translate="no" aria-hidden="true" style={{ color: "#D4AF37" }}>
                                  check_circle
                                </span>
                              </div>
                              <span className="font-body-md text-body-md text-on-surface whitespace-pre-line">
                                {listItem}
                              </span>
                            </li>
                          ));
                        })()}`;

pb = pb.replace(listMapRegex, newListRender);

fs.writeFileSync('src/components/PageBlocks.tsx', pb);
