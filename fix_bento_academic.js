import fs from 'fs';
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The stats block:
/*
                      <div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">
                        {block.items[1].stats?.map((stat: any, i: number) => (
                          <div
                            key={i}
                            className="bg-white/10 p-4 rounded-2xl whitespace-pre-line"
                          >
                            <div
                              className="text-2xl font-bold text-gold whitespace-pre-line"
                              style={{ color: "#D4AF37" }}
                            >
                              {stat.value}
                            </div>
                            <div className="text-[10px] opacity-80 uppercase tracking-wider whitespace-pre-line">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
*/
const statsPattern = /<div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">\s*\{block\.items\[1\]\.stats\?\.map\(\(stat: any, i: number\) => \([\s\S]*?\}\)\)\}\s*<\/div>/;

const newStats = `<div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">
                        {(() => {
                          const stats = block.items[1].stats || [];
                          if (block.items[1].stat1Label && block.items[1].stat1Value && stats.length === 0) {
                            stats.push({ label: block.items[1].stat1Label, value: block.items[1].stat1Value });
                          }
                          if (block.items[1].stat2Label && block.items[1].stat2Value && stats.length === 0) {
                            stats.push({ label: block.items[1].stat2Label, value: block.items[1].stat2Value });
                          }
                          return stats.map((stat: any, i: number) => (
                            <div
                              key={i}
                              className="bg-white/10 p-4 rounded-2xl whitespace-pre-line"
                            >
                              <div
                                className="text-2xl font-bold text-gold whitespace-pre-line"
                                style={{ color: "#D4AF37" }}
                              >
                                {stat.value}
                              </div>
                              <div className="text-[10px] opacity-80 uppercase tracking-wider whitespace-pre-line">
                                {stat.label}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>`;

pb = pb.replace(statsPattern, newStats);

/*
                      <ul className="space-y-4 whitespace-pre-line">
                        {block.items[2].list?.map(
                          (listItem: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 whitespace-pre-line"
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 whitespace-pre-line"
                                style={{
                                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                                }}
                              >
                                <span
                                  className="material-symbols-outlined text-gold text-lg whitespace-pre-line"
                                  translate="no"
                                  aria-hidden="true"
                                  style={{ color: "#D4AF37" }}
                                >
                                  check_circle
                                </span>
                              </div>
                              <span className="font-body-md text-body-md whitespace-pre-line">
                                {listItem}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
*/
const listPattern = /<ul className="space-y-4 whitespace-pre-line">\s*\{block\.items\[2\]\.list\?\.map\(\s*\(\s*listItem:\s*string,\s*i:\s*number\s*\)\s*=>\s*\([\s\S]*?\)\s*\)\}\s*<\/ul>/;

const newList = `<ul className="space-y-4 whitespace-pre-line">
                        {(() => {
                          let list = block.items[2].list || [];
                          if (list.length === 0 && block.items[2].listString) {
                            list = block.items[2].listString.split('\\n').filter((x: string) => x.trim());
                          }
                          return list.map(
                            (listItem: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 whitespace-pre-line"
                              >
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 whitespace-pre-line"
                                  style={{
                                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                                  }}
                                >
                                  <span
                                    className="material-symbols-outlined text-gold text-lg whitespace-pre-line"
                                    translate="no"
                                    aria-hidden="true"
                                    style={{ color: "#D4AF37" }}
                                  >
                                    check_circle
                                  </span>
                                </div>
                                <span className="font-body-md text-body-md whitespace-pre-line">
                                  {listItem}
                                </span>
                              </li>
                            )
                          );
                        })()}
                      </ul>`;

pb = pb.replace(listPattern, newList);

fs.writeFileSync('src/components/PageBlocks.tsx', pb);
