const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');

const regex = /\$\{items\.map\(\(rep, idx\) => \{[\s\S]*?\}\)\.join\(''\)\}/;

const replacement = `\${items.map((rep, idx) => {
                const sender = extractSenderInfo(rep.data);
                const data = rep.data || {};
                
                if (rep.type === 'pre_registration_form') {
                  const birthDate = data.studentBirthDate ? data.studentBirthDate.split('-').reverse().join('.') : '-';
                  return \`
                    <div class="card" style="margin-bottom: 24px;">
                      <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                        <div style="font-size: 12px; color: #64748b; background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                          #\${idx + 1} - ÖĞRENCİ ÖN KAYIT FORMU
                        </div>
                      </div>
                      
                      <!-- 1. ÖĞRENCİ BİLGİLERİ -->
                      <div style="margin-bottom: 24px;">
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">1. ÖĞRENCİ BİLGİLERİ</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Öğrenci Adı Soyadı</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.studentName || '-'}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">T.C. Kimlik Numarası</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.studentTc || '-'}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Doğum Tarihi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${birthDate}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Cinsiyet</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.studentGender || '-'}</div>
                          </div>
                          <div style="flex: 1 1 100%; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Mevcut Sınıf Seviyesi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.studentGrade || '-'}</div>
                          </div>
                        </div>
                      </div>

                      <!-- 2. VELİ BİLGİLERİ -->
                      <div style="margin-bottom: 24px;">
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">2. VELİ BİLGİLERİ</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Veli Adı Soyadı</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.parentName || '-'}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">T.C. Kimlik Numarası</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.parentTc || '-'}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Telefon Numarası</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.parentPhone || '-'}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">E-posta Adresi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.parentEmail || '-'}</div>
                          </div>
                          <div style="flex: 1 1 100%; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Öğrenciye Yakınlık Derecesi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.parentRelation || '-'}</div>
                          </div>
                        </div>
                      </div>

                      <!-- 3. KAMPÜS VE TERCİHLER -->
                      <div style="margin-bottom: \${data.notes ? '24px' : '0'};">
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">3. KAMPÜS VE TERCİHLER</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Kampüs Seçimi</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.campus || '-'}</div>
                          </div>
                          <div style="flex: 1 1 calc(50% - 8px); background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Akademik Yıl</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.academicYear || '-'}</div>
                          </div>
                          <div style="flex: 1 1 100%; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9;">
                            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Bizi nereden duydunuz?</div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${data.heardFrom || '-'}</div>
                          </div>
                        </div>
                      </div>

                      <!-- 4. NOTLAR -->
                      \${data.notes ? \`
                      <div>
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">4. EK NOTLAR</span>
                        </div>
                        <div style="background-color: #eff6ff; padding: 16px; border-radius: 6px; border: 1px solid #dbeafe;">
                          <div style="font-size: 13px; font-weight: 500; color: #1e3a8a; white-space: pre-wrap;">\${data.notes}</div>
                        </div>
                      </div>
                      \` : ''}
                      
                      <!-- Footer bar -->
                      <div style="display: flex; height: 6px; width: 100%; margin-top: 24px; border-radius: 3px; overflow: hidden;">
                        <div style="flex: 1; background-color: #2357c6;"></div>
                        <div style="flex: 1; background-color: #001b3b;"></div>
                        <div style="flex: 1; background-color: #2b5ec9;"></div>
                      </div>
                    </div>
                  \`;
                }

                // Fallback / Standard Form
                return \`
                  <div class="card">
                    <div class="card-header">
                      <span class="form-name">#\${idx + 1} - \${rep.type === 'contact_form' ? 'İletişim Formu' : (rep.data?.formName || 'Form')}</span>
                      <span class="date">\${formatReportDate(rep.createdAt)}</span>
                    </div>
                    <div class="field"><strong>Gönderen:</strong> \${sender.name || 'Bilinmiyor'}</div>
                    <div class="field"><strong>İlgilendiği Eğitim Kademesi:</strong> \${sender.kademe || 'Belirtilmedi'}</div>
                    <div class="field"><strong>İlgilendiği Kampüs:</strong> \${sender.kampus || 'Belirtilmedi'}</div>
                    <div class="field"><strong>Telefon Numarası:</strong> \${sender.phone || 'Belirtilmedi'}</div>
                    \${sender.email ? \`<div class="field"><strong>E-posta:</strong> \${sender.email}</div>\` : ''}
                    <div class="message-box">
                      <strong>Mesaj:</strong><br/>
                      \${sender.message ? \`"\${sender.message}"\` : 'Mesaj bulunmuyor'}
                    </div>
                  </div>
                \`;
              }).join('')}`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/admin/hubs/ReportCenter.tsx', content);
    console.log("Patched print view");
} else {
    console.log("Regex didn't match.");
}
