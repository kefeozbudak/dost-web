import React, { useState, useEffect } from "react";
import { IconPreview } from "./IconField";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { format } from "date-fns";

const SubjectRow = ({
  subjectKey,
  label,
  isPrimary = true,
  subjects,
  handleInputChange,
}: {
  subjectKey: keyof typeof subjects;
  label: string;
  isPrimary?: boolean;
  subjects: any;
  handleInputChange: (subjectKey: any, field: string, value: string) => void;
}) => {
  const data = subjects[subjectKey];
  const ringColor = isPrimary
    ? "focus:ring-primary focus:border-primary"
    : "focus:ring-secondary focus:border-secondary";
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center group">
      <div className="col-span-1 md:col-span-3 font-body-md text-body-md font-semibold text-on-surface flex justify-between md:block">
        <span>{label}</span>
        <span className="md:hidden text-on-surface-variant text-sm">
          {data.total} Soru
        </span>
      </div>
      <div className="col-span-2 text-center hidden md:block text-on-surface-variant">
        {data.total}
      </div>
      <div className="col-span-1 md:col-span-2">
        <label
          className={`md:hidden text-xs ${isPrimary ? "text-primary" : "text-secondary"} mb-1 block`}
        >
          Doğru
        </label>
        <input
          id={`${String(subjectKey)}-correct`}
          name={`${String(subjectKey)}-correct`}
          type="number" min="0" max={data.total}
          placeholder="0"
          value={data.correct}
          onChange={(e) =>
            handleInputChange(subjectKey, "correct", e.target.value)
          }
          className={`w-full bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-center focus:ring-2 outline-none transition-shadow ${ringColor} font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1`}
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="md:hidden text-xs text-error-red mb-1 block">
          Yanlış
        </label>
        <input
          id={`${String(subjectKey)}-wrong`}
          name={`${String(subjectKey)}-wrong`}
          type="number" min="0" max={data.total}
          placeholder="0"
          value={data.wrong}
          onChange={(e) =>
            handleInputChange(subjectKey, "wrong", e.target.value)
          }
          className={`w-full bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-center focus:ring-2 outline-none transition-shadow ${ringColor} font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1`}
        />
      </div>
      <div className="col-span-1 md:col-span-1 flex items-center justify-center md:justify-center">
        <label className="md:hidden text-xs text-on-surface-variant mb-1 mr-2 block">
          Boş:
        </label>
        <div className="w-full bg-surface-variant/50 border border-border-subtle rounded-lg px-3 py-2 text-center text-on-surface-variant font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1">{data.empty}</div>
      </div>
      <div className="col-span-1 md:col-span-2 flex items-center justify-end md:justify-end">
        <label className="md:hidden text-xs text-primary font-bold mb-1 mr-2 block">
          Net:
        </label>
        <div className="w-full bg-surface-variant/50 border border-border-subtle rounded-lg px-3 py-2 text-center text-on-surface-variant font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1 font-bold">{data.net.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default function LgsCalculator({ block }: { block: any }) {
  const BASE_SCORE = 194.75;

  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    school: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [subjects, setSubjects] = useState({
    turkce: {
      correct: "",
      wrong: "",
      total: 20,
      coef: 4.35,
      net: 0,
      empty: 20,
    },
    tarih: { correct: "", wrong: "", total: 10, coef: 1.65, net: 0, empty: 10 },
    din: { correct: "", wrong: "", total: 10, coef: 1.8, net: 0, empty: 10 },
    ingilizce: {
      correct: "",
      wrong: "",
      total: 10,
      coef: 1.55,
      net: 0,
      empty: 10,
    },
    matematik: {
      correct: "",
      wrong: "",
      total: 20,
      coef: 4.25,
      net: 0,
      empty: 20,
    },
    fen: { correct: "", wrong: "", total: 20, coef: 4.1, net: 0, empty: 20 },
  });

  const [results, setResults] = useState({
    totalScore: 0,
    totalNet: 0,
    sozelNet: 0,
    sayisalNet: 0,
    percentile: "--%",
    });

  
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
          subjectsHtml += `
            <tr class="table-row">
              <td class="subj-name">${subjNames[key]}</td>
              <td>${subj.total}</td>
              <td>${parseInt(subj.correct) || 0}</td>
              <td>${parseInt(subj.wrong) || 0}</td>
              <td>${subj.empty}</td>
              <td style="font-weight: bold; color: #2563eb;">${subj.net.toFixed(2)}</td>
            </tr>
          `;
        });

        const printContent = `
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
                  <h2>${studentInfo.studentName || "Öğrenci Bilgisi Girilmedi"}</h2>
                  <span class="date">${format(new Date(), "dd.MM.yyyy HH:mm")}</span>
                </div>
                
                <div class="student-info">
                  <div><strong>Telefon:</strong> ${studentInfo.phone || '-'}</div>
                  <div><strong>Veli:</strong> ${studentInfo.parentName || '-'}</div>
                  <div><strong>Okul:</strong> ${studentInfo.school || '-'}</div>
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
                    ${subjectsHtml}
                  </tbody>
                </table>
                
                <div class="results-summary">
                  <div class="result-box">
                    <div class="label">Toplam Doğru</div>
                    <div class="value">${totalCorrect}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Toplam Yanlış</div>
                    <div class="value">${totalWrong}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Toplam Boş</div>
                    <div class="value">${totalEmpty}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Toplam Net</div>
                    <div class="value">${results.totalNet.toFixed(2)}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">LGS Puanı</div>
                    <div class="value score">${results.totalScore.toFixed(2)}</div>
                  </div>
                  <div class="result-box">
                    <div class="label">Yüzdelik Dilim</div>
                    <div class="value">${results.percentile ? '%' + results.percentile : '-'}</div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    } catch (e) {
      alert('Yazdırma işlemi açılamadı. Lütfen pop-up engelleyicinizi kontrol edin.');
    }
  };

  const handleInputChange = (
    subjectKey: string,
    field: "correct" | "wrong",
    value: string,
  ) => {
    if (value.length > 2) return;
    let numVal = parseInt(value, 10);
    if (isNaN(numVal) || numVal < 0) {
      if (value === "") {
        // allow empty
      } else {
        return;
      }
    }

    setSubjects((prev) => {
      const subject = prev[subjectKey as keyof typeof prev];
      let newCorrect = field === "correct" ? value : subject.correct;
      let newWrong = field === "wrong" ? value : subject.wrong;
      
      let c = parseInt(newCorrect as string) || 0;
      let w = parseInt(newWrong as string) || 0;

      // Do not cap it visually during typing to prevent cursor jump.
      let empty = subject.total - (c + w);
      if (empty < 0) empty = 0; // Visual clamp
      const net = c - w / 3;

      return {
        ...prev,
        [subjectKey]: {
          ...subject,
          correct: newCorrect,
          wrong: newWrong,
          empty,
          net,
        },
      };
    });
  };

  useEffect(() => {
    let totalNet = 0;
    let addedScore = 0;
    let sozelNet = 0;
    let sayisalNet = 0;

    Object.entries(subjects).forEach(([key, subject]) => {
      const net = subject.net;
      totalNet += net;
      addedScore += net * subject.coef;

      if (["turkce", "tarih", "din", "ingilizce"].includes(key)) {
        sozelNet += net;
      } else {
        sayisalNet += net;
      }
    });

    const finalScore = BASE_SCORE + addedScore;
    let displayScore = finalScore;

    // Exact 500 when full 90 nets (with these coefficients it might be slightly off depending on exact MEB formula, but let's stick to the prompt's script logic)
    if (totalNet === 90) displayScore = 500;
    displayScore = Math.min(Math.max(displayScore, BASE_SCORE), 500);

    let percentile = "--%";
    if (totalNet === 0 && addedScore === 0) {
      percentile = "--%";
    } else if (displayScore > 480) {
      percentile = "%0.1 - 0.5";
    } else if (displayScore > 450) {
      percentile = "%0.5 - 2.0";
    } else if (displayScore > 400) {
      percentile = "%2.0 - 5.0";
    } else if (displayScore > 350) {
      percentile = "%5.0 - 15.0";
    } else {
      percentile = "> %15.0";
    }

    setResults({
      totalScore: displayScore,
      totalNet,
      sozelNet,
      sayisalNet,
      percentile,
    });
  }, [subjects]);

  const handleSubmit = async () => {
    // Validate inputs
    for (const key in subjects) {
      const s = subjects[key as keyof typeof subjects];
      const c = parseInt(s.correct as string) || 0;
      const w = parseInt(s.wrong as string) || 0;
      if (c + w > s.total) {
        setSubmitStatus("error");
        setMessage("Lütfen girdiğiniz sayıları kontrol edin. Doğru ve yanlış sayıları toplamı, soru sayısını aşamaz.");
        setTimeout(() => setSubmitStatus("idle"), 5000);
        return;
      }
    }

    if (!studentInfo.studentName || !studentInfo.phone) {
      setSubmitStatus("error");
      setMessage("Lütfen öğrenci adı ve veli telefon numarasını doldurunuz.");
      setTimeout(() => setSubmitStatus("idle"), 5000);
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      await addDoc(collection(db, "reports"), {
        type: "lgs_calculator",
        studentName: studentInfo.studentName,
        parentName: studentInfo.parentName,
        phone: studentInfo.phone,
        school: studentInfo.school,
        results: results,
        subjects: subjects,
        createdAt: Date.now(),
        read: false,
      });
      setSubmitStatus("success");
      setMessage(
        "Hesaplama sonucunuz başarıyla iletilmiştir. Teşekkür ederiz.",
      );
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Error submitting LGS data:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStudentInfo({ studentName: "", parentName: "", phone: "", school: "" });
    setSubjects({
      turkce: {
        correct: "",
        wrong: "",
        total: 20,
        coef: 4.35,
        net: 0,
        empty: 20,
      },
      tarih: {
        correct: "",
        wrong: "",
        total: 10,
        coef: 1.65,
        net: 0,
        empty: 10,
      },
      din: { correct: "", wrong: "", total: 10, coef: 1.8, net: 0, empty: 10 },
      ingilizce: {
        correct: "",
        wrong: "",
        total: 10,
        coef: 1.55,
        net: 0,
        empty: 10,
      },
      matematik: {
        correct: "",
        wrong: "",
        total: 20,
        coef: 4.25,
        net: 0,
        empty: 20,
      },
      fen: { correct: "", wrong: "", total: 20, coef: 4.1, net: 0, empty: 20 },
    });
  };

  return (
    <section
      className="w-full bg-surface-background py-section-gap px-margin-mobile md:px-margin-desktop min-h-screen whitespace-normal md:whitespace-pre-line"
      style={
        block.styles?.backgroundColor
          ? { backgroundColor: block.styles.backgroundColor }
          : {}
      }
    >
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-gutter">
        {/* Left Side: Calculation Forms */}
        <div className="w-full lg:w-2/3 flex flex-col gap-gutter print:w-full">
          <div className="mb-6">
            <h1
              className="font-display-lg text-display-lg text-on-primary-fixed mb-2"
              style={{ color: block.styles?.titlePart1Color }}
            >
              {block.title || "LGS Puan Hesaplama Modülü"}
            </h1>
            <p
              className="font-body-lg text-body-lg text-on-surface-variant"
              style={{ color: block.styles?.color }}
            >
              {block.subtitle ||
                "2026 güncel katsayılarına göre tahmini LGS puanınızı ve yüzdelik diliminizi hesaplayın."}
            </p>
          </div>

          {/* Student Info Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mb-gutter print:shadow-none print:border-black">
            <div className="bg-primary/5 border-b border-border-subtle px-2 md:px-6 py-4 flex items-center gap-3 print:bg-white print:border-black">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary print:hidden">
                <IconPreview data="person" className="text-xl" />
              </div>
              <h2 className="font-headline-md text-headline-md text-primary print:text-black">
                {block.studentInfoTitle || "Öğrenci ve Veli Bilgileri"}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant print:text-black">
                    {block.studentNamePlaceholder || "Öğrenci Adı Soyadı"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      block.studentNamePlaceholder || "Ad Soyad giriniz"
                    }
                    value={studentInfo.studentName}
                    onChange={(e) =>
                      setStudentInfo({
                        ...studentInfo,
                        studentName: e.target.value,
                      })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant print:text-black">
                    {block.parentNamePlaceholder || "Veli Adı Soyadı"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      block.parentNamePlaceholder || "Ad Soyad giriniz"
                    }
                    value={studentInfo.parentName}
                    onChange={(e) =>
                      setStudentInfo({
                        ...studentInfo,
                        parentName: e.target.value,
                      })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant print:text-black">
                    {block.phonePlaceholder || "Veli Telefon"}
                  </label>
                  <input
                    type="tel"
                    placeholder={block.phonePlaceholder || "0 (5XX) XXX XX XX"}
                    value={studentInfo.phone}
                    onChange={(e) =>
                      setStudentInfo({ ...studentInfo, phone: e.target.value })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant print:text-black">
                    {block.schoolPlaceholder || "Mevcut Okulu"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      block.schoolPlaceholder || "Okul adını giriniz"
                    }
                    value={studentInfo.school}
                    onChange={(e) =>
                      setStudentInfo({ ...studentInfo, school: e.target.value })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sözel Oturum Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm print:shadow-none print:border-black">
            <div className="bg-primary/5 border-b border-border-subtle px-2 md:px-6 py-4 flex items-center gap-3 print:bg-white print:border-black">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary print:hidden">
                <IconPreview data="menu_book" className="text-xl" />
              </div>
              <h2 className="font-headline-md text-headline-md text-primary">
                {block.sozelTitle || "Sözel Oturum"}
              </h2>
              <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                50 Soru
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-12 gap-4 mb-4 font-label-md text-label-md text-on-surface-variant pb-2 border-b border-border-subtle hidden md:grid">
                <div className="col-span-3">Ders</div>
                <div className="col-span-2 text-center">Soru</div>
                <div className="col-span-2 text-center text-primary">Doğru</div>
                <div className="col-span-2 text-center text-error-red">
                  Yanlış
                </div>
                <div className="col-span-1 text-center">Boş</div>
                <div className="col-span-2 text-right text-primary font-bold">
                  Net
                </div>
              </div>
              <div className="flex flex-col gap-6 md:gap-4">
                <SubjectRow
                  subjects={subjects}
                  handleInputChange={handleInputChange}
                  subjectKey="turkce"
                  label="Türkçe"
                  isPrimary={true}
                />
                <SubjectRow
                  subjects={subjects}
                  handleInputChange={handleInputChange}
                  subjectKey="tarih"
                  label="T.C. İnkılap Tarihi"
                  isPrimary={true}
                />
                <SubjectRow
                  subjects={subjects}
                  handleInputChange={handleInputChange}
                  subjectKey="din"
                  label="Din Kültürü"
                  isPrimary={true}
                />
                <SubjectRow
                  subjects={subjects}
                  handleInputChange={handleInputChange}
                  subjectKey="ingilizce"
                  label="Yabancı Dil"
                  isPrimary={true}
                />
              </div>
            </div>
          </div>

          {/* Sayısal Oturum Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mt-4 print:shadow-none print:border-black">
            <div className="bg-secondary/5 border-b border-border-subtle px-2 md:px-6 py-4 flex items-center gap-3 print:bg-white print:border-black">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary print:hidden">
                <IconPreview data="calculate" className="text-xl" />
              </div>
              <h2 className="font-headline-md text-headline-md text-secondary">
                {block.sayisalTitle || "Sayısal Oturum"}
              </h2>
              <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                40 Soru
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-12 gap-4 mb-4 font-label-md text-label-md text-on-surface-variant pb-2 border-b border-border-subtle hidden md:grid">
                <div className="col-span-3">Ders</div>
                <div className="col-span-2 text-center">Soru</div>
                <div className="col-span-2 text-center text-secondary">
                  Doğru
                </div>
                <div className="col-span-2 text-center text-error-red">
                  Yanlış
                </div>
                <div className="col-span-1 text-center">Boş</div>
                <div className="col-span-2 text-right text-secondary font-bold">
                  Net
                </div>
              </div>
              <div className="flex flex-col gap-6 md:gap-4">
                <SubjectRow
                  subjects={subjects}
                  handleInputChange={handleInputChange}
                  subjectKey="matematik"
                  label="Matematik"
                  isPrimary={false}
                />
                <SubjectRow
                  subjects={subjects}
                  handleInputChange={handleInputChange}
                  subjectKey="fen"
                  label="Fen Bilimleri"
                  isPrimary={false}
                />
              </div>
            </div>
          </div>

          {/* Actions Row */}
                    {submitStatus !== "idle" && message && (
            <div className={`p-4 rounded-lg font-body-md text-body-md mb-4 flex items-center gap-2 ${submitStatus === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-error-red border border-red-200"}`}>
              <IconPreview data={submitStatus === "success" ? "check_circle" : "error"} className="text-[20px]" />
              {message}
            </div>
          )}
          <div className="flex justify-end gap-4 mt-4 print:hidden">
            <button
              onClick={handleReset}
              className="px-2 md:px-6 py-2.5 rounded-lg border border-border-subtle bg-surface-card text-text-main font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2"
            >
              {block.resetButtonLabel || "Sıfırla"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-2 md:px-6 py-2.5 rounded-lg bg-primary text-white font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <IconPreview
                data={
                  isSubmitting
                    ? "hourglass_empty"
                    : submitStatus === "success"
                      ? "check_circle"
                      : "send"
                }
                className="text-[20px]"
              />{" "}
              {submitStatus === "success"
                ? "Gönderildi!"
                : block.submitButtonLabel || "Gönder"}
            </button>
          </div>
        </div>

        {/* Right Side: Results Dashboard (Sticky on Desktop) */}
        <div className="w-full lg:w-1/3 print:w-full print:mt-4">
          <div className="sticky top-28 print:static bg-[#002147] print:bg-white print:text-black print:border print:border-black text-white rounded-xl shadow-sm overflow-hidden flex flex-col h-auto">
            {/* Golden Accent Header */}
            <div className="h-2 w-full bg-[#D4AF37]"></div>

            <div className="p-6 md:p-8 flex-grow flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <IconPreview
                  data="analytics"
                  className="text-[#D4AF37] text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                />
                <h2 className="font-headline-md text-headline-md font-bold">
                  {block.resultTitle || "Sınav Sonucu"}
                </h2>
              </div>

              {/* Score Display */}
              <div className="bg-white/10 rounded-xl p-6 text-center mb-6 border border-white/20 backdrop-blur-sm">
                <p className="font-label-md text-label-md text-[#D4AF37] print:text-black uppercase tracking-wider mb-2">
                  {block.estimatedScoreLabel || "Tahmini LGS Puanı"}
                </p>
                <div className="font-display-lg text-display-lg font-bold">
                  {results.totalScore.toFixed(2)}
                </div>
                <p className="text-sm text-white/70 print:text-black/70 mt-2">
                  {block.maxScoreLabel || "Max: 500 Puan"}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/60 print:text-black/60 mb-1">
                    {block.totalNetLabel || "Toplam Net"}
                  </p>
                  <p className="font-headline-md text-headline-md font-bold text-[#3adccc] print:text-black">
                    {results.totalNet.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/40 print:text-black/60 mt-1">
                    / 90 Soru
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/60 print:text-black/60 mb-1">
                    {block.estimatedPercentileLabel || "Tahmini Yüzdelik"}
                  </p>
                  <p className="font-headline-md text-headline-md font-bold text-[#D4AF37]">
                    {results.percentile}
                  </p>
                  <p className="text-xs text-white/40 print:text-black/60 mt-1">
                    {block.dataYearLabel || "2023 Verilerine Göre"}
                  </p>
                </div>
              </div>

              {/* Net Distribution Chart */}
              <div className="mt-auto">
                <p className="font-label-sm text-label-sm text-white/80 print:text-black mb-3">
                  {block.netDistributionLabel || "Oturum Bazlı Net Dağılımı"}
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70 print:text-black/70">
                        Sözel (Max 50)
                      </span>
                      <span className="text-white font-bold">
                        {results.sozelNet.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(0, (results.sozelNet / 50) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70 print:text-black/70">
                        Sayısal (Max 40)
                      </span>
                      <span className="text-white font-bold">
                        {results.sayisalNet.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-[#3adccc] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(0, (results.sayisalNet / 40) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="w-full mt-8 bg-[#D4AF37] print:hidden text-[#002147] font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <IconPreview data="download" className="text-[20px]" />
                {block.downloadButtonLabel || "PDF İndir / Yazdır"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
