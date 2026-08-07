const fs = require('fs');

let code = fs.readFileSync('src/components/LgsCalculator.tsx', 'utf8');

const importReplacement = `import React, { useState, useEffect } from "react";
import { IconPreview } from "./IconField";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { format } from "date-fns";`;

code = code.replace(/import React, { useState, useEffect } from "react";\nimport { IconPreview } from "\.\/IconField";\nimport { collection, addDoc, serverTimestamp } from "firebase\/firestore";\nimport { db } from "\.\.\/lib\/firebase";/, importReplacement);


const printFunction = `
  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let subjectsHtml = '';
        const subjNames = {
          turkce: "Türkçe",
          tarih: "T.C. İnkılap Tarihi",
          din: "Din Kültürü",
          ingilizce: "Yabancı Dil",
          matematik: "Matematik",
          fen: "Fen Bilimleri"
        };
        
        let totalCorrect = 0;
        let totalWrong = 0;
        let totalEmpty = 0;
        
        Object.entries(subjects).forEach(([key, subj]) => {
          totalCorrect += (parseInt(subj.correct) || 0);
          totalWrong += (parseInt(subj.wrong) || 0);
          totalEmpty += subj.empty;
          subjectsHtml += \`
            <tr class="table-row">
              <td class="subj-name">\${subjNames[key]}</td>
              <td>\${subj.total}</td>
              <td>\${parseInt(subj.correct) || 0}</td>
              <td>\${parseInt(subj.wrong) || 0}</td>
              <td>\${subj.empty}</td>
              <td style="font-weight: bold; color: #2563eb;">\${subj.net.toFixed(2)}</td>
            </tr>
          \`;
        });

        const printContent = \`
          <html>
            <head>
              <title>LGS Puan Hesaplama Raporu</title>
              <style>
                @page { margin: 10mm; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #222; margin: 0; background: #fff; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #002147; padding-bottom: 10px; }
                .header h1 { color: #002147; margin: 0 0 5px 0; font-size: 24px; }
                .report { border: 1px solid #ccc; margin-bottom: 30px; border-radius: 8px; page-break-inside: avoid; overflow: hidden; }
                .report-header { background-color: #f8fafc; padding: 12px 15px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center; }
                .report-header h2 { margin: 0; font-size: 16px; color: #0f172a; }
                .report-header .date { font-size: 12px; color: #64748b; }
                .student-info { display: flex; padding: 10px 15px; background: #fff; border-bottom: 1px solid #eee; font-size: 13px; flex-wrap: wrap; gap: 15px; }
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
                .result-box .value.score { color: #2563eb; font-size: 24px; }
                @media print {
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div style="display: flex; justify-content: space-between; align-items: center; text-align: left;">
                  <div>
                    <h1>LGS Deneme Sonucu Raporu</h1>
                  </div>
                  <button onclick="window.print()" style="padding: 10px 20px; background: #002147; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Yazdır</button>
                </div>
              </div>

              <div class="report">
                <div class="report-header">
                  <h2>\${studentInfo.studentName || "Öğrenci Bilgisi Girilmedi"}</h2>
                  <span class="date">\${format(new Date(), "dd.MM.yyyy HH:mm")}</span>
                </div>
                
                <div class="student-info">
                  <div><strong>Telefon:</strong> \${studentInfo.phone || '-'}</div>
                  <div><strong>Veli:</strong> \${studentInfo.parentName || '-'}</div>
                  <div><strong>Okul:</strong> \${studentInfo.school || '-'}</div>
                </div>
                
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
                    \${subjectsHtml}
                  </tbody>
                </table>
                
                <div class="results-summary">
                  <div class="result-box">
                    <div class="label">Toplam Doğru</div>
                    <div class="value">\${totalCorrect}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Toplam Yanlış</div>
                    <div class="value">\${totalWrong}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Toplam Boş</div>
                    <div class="value">\${totalEmpty}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Toplam Net</div>
                    <div class="value">\${results.totalNet.toFixed(2)}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">LGS Puanı</div>
                    <div class="value score">\${results.totalScore.toFixed(2)}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Yüzdelik Dilim</div>
                    <div class="value">\${results.percentile ? '%' + results.percentile : '-'}</div>
                  </div>
                </div>
              </div>
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

code = code.replace(/const handleInputChange = \(/, printFunction + '\n  const handleInputChange = (');

code = code.replace(/onClick=\{\(\) => window\.print\(\)\}/g, 'onClick={handlePrint}');

fs.writeFileSync('src/components/LgsCalculator.tsx', code);
