const fs = require('fs');

let code = fs.readFileSync('src/admin/hubs/LgsCenter.tsx', 'utf8');

const newPrintCode = `
  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let printContent = \`
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
                    <p>Toplam Kayıt: \${filteredReports.length}</p>
                  </div>
                  <button onclick="window.print()" style="padding: 10px 20px; background: #002147; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Raporu Yazdır</button>
                </div>
              </div>
        \`;

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
             
             subjectsHtml += \`
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
             \`;
             
             Object.entries(report.subjects).forEach(([key, subj]) => {
               // subj might be typed as any
               const typedSubj = subj;
               subjectsHtml += \`
                 <tr class="table-row">
                   <td class="subj-name">\${subjNames[key as keyof typeof subjNames] || key}</td>
                   <td>\${typedSubj.total || 0}</td>
                   <td>\${typedSubj.correct || 0}</td>
                   <td>\${typedSubj.wrong || (typedSubj.incorrect || 0)}</td>
                   <td>\${typedSubj.empty || 0}</td>
                   <td style="font-weight: bold; color: #2563eb;">\${Number(typedSubj.net || 0).toFixed(2)}</td>
                 </tr>
               \`;
             });
             
             subjectsHtml += \`
                 </tbody>
               </table>
             \`;
          } else {
             // Fallback if subjects object is missing
             subjectsHtml = \`<div style="padding: 15px; text-align: center; color: #666; font-size: 13px;">Ders detayları bulunamadı.</div>\`;
          }
          
          printContent += \`
            <div class="report">
              <div class="report-header">
                <h2>#\${index + 1} - \${senderName}</h2>
                <span class="date">\${date}</span>
              </div>
              <div class="student-info">
                <div><strong>Telefon:</strong> \${report.phone || '-'}</div>
                <div><strong>Veli:</strong> \${report.parentName || '-'}</div>
                <div><strong>Okul:</strong> \${report.school || '-'}</div>
              </div>
              
              \${subjectsHtml}
              
              <div class="results-summary">
                <div class="result-box">
                  <div class="label">Toplam Doğru</div>
                  <div class="value">\${report.results?.totalCorrect || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Toplam Yanlış</div>
                  <div class="value">\${report.results?.totalWrong || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Toplam Boş</div>
                  <div class="value">\${report.results?.totalEmpty || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Toplam Net</div>
                  <div class="value">\${report.results?.totalNet?.toFixed(2) || report.results?.net?.toFixed(2) || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">LGS Puanı</div>
                  <div class="value score">\${report.results?.totalScore?.toFixed(2) || '-'}</div>
                </div>
                <div class="result-box">
                  <div class="label">Yüzdelik Dilim</div>
                  <div class="value">\${report.results?.percentile ? '%' + report.results.percentile : '-'}</div>
                </div>
              </div>
            </div>
          \`;
        });

        printContent += \`
            </body>
          </html>
        \`;
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    } catch (e) {
      alert('Yazdırma işlemi açılamadı. Lütfen pop-up engelleyicinizi kontrol edin.');
    }
  };
`;

const regex = /const handlePrint = \(\) => \{[\s\S]*?\n  \};\n\n  const filteredReports/m;
code = code.replace(regex, `${newPrintCode.trim()}\n\n  const filteredReports`);

fs.writeFileSync('src/admin/hubs/LgsCenter.tsx', code);
