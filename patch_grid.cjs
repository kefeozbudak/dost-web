const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/ReportCenter.tsx', 'utf8');

const targetStr = `                          {/* 4. Telefon Numarası */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#004899]" />
                              Telefon Numarası
                            </span>
                            {sender.phone ? (
                              <a href={\`tel:\${sender.phone}\`} onClick={(e) => e.stopPropagation()} className="font-bold text-[#004899] hover:underline block text-sm">
                                {sender.phone}
                              </a>
                            ) : (
                              <p className="font-medium text-slate-400 text-sm">Belirtilmedi</p>
                            )}
                          </div>
                        </div>`;

const replacementStr = `                          {/* 4. Telefon Numarası */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#004899]" />
                              Telefon Numarası
                            </span>
                            {sender.phone ? (
                              <a href={\`tel:\${sender.phone}\`} onClick={(e) => e.stopPropagation()} className="font-bold text-[#004899] hover:underline block text-sm">
                                {sender.phone}
                              </a>
                            ) : (
                              <p className="font-medium text-slate-400 text-sm">Belirtilmedi</p>
                            )}
                          </div>
                          {/* E-Posta */}
                          {sender.email && (
                            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-[#004899]" />
                                E-Posta
                              </span>
                              <a href={\`mailto:\${sender.email}\`} onClick={(e) => e.stopPropagation()} className="font-bold text-[#004899] hover:underline block text-sm">
                                {sender.email}
                              </a>
                            </div>
                          )}
                        </div>`;

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('./src/admin/hubs/ReportCenter.tsx', file);
