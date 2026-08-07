import React, { useState, useEffect } from "react";
import { IconPreview } from "./IconField";

export default function LgsCalculator({ block }: { block: any }) {
  const BASE_SCORE = 194.75;

  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    school: "",
  });

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

  const handleInputChange = (
    subjectKey: string,
    field: "correct" | "wrong",
    value: string,
  ) => {
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

      if (c + w > subject.total) {
        if (field === "correct") {
          c = subject.total - w;
          newCorrect = c.toString();
        } else {
          w = subject.total - c;
          newWrong = w.toString();
        }
      }

      const empty = subject.total - (c + w);
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

  const SubjectRow = ({
    subjectKey,
    label,
    isPrimary = true,
  }: {
    subjectKey: keyof typeof subjects;
    label: string;
    isPrimary?: boolean;
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
            type="number"
            min="0"
            max={data.total}
            placeholder="0"
            value={data.correct}
            onChange={(e) =>
              handleInputChange(subjectKey, "correct", e.target.value)
            }
            className={`w-full border border-border-subtle rounded-lg px-3 py-2 text-center focus:ring-2 outline-none transition-shadow ${ringColor} font-body-md`}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="md:hidden text-xs text-error-red mb-1 block">
            Yanlış
          </label>
          <input
            type="number"
            min="0"
            max={data.total}
            placeholder="0"
            value={data.wrong}
            onChange={(e) =>
              handleInputChange(subjectKey, "wrong", e.target.value)
            }
            className={`w-full border border-border-subtle rounded-lg px-3 py-2 text-center focus:ring-2 outline-none transition-shadow ${ringColor} font-body-md`}
          />
        </div>
        <div className="col-span-1 md:col-span-1 flex items-center justify-center md:justify-center">
          <label className="md:hidden text-xs text-on-surface-variant mb-1 mr-2 block">
            Boş:
          </label>
          <span className="text-on-surface-variant font-medium">
            {data.empty}
          </span>
        </div>
        <div className="col-span-1 md:col-span-2 flex items-center justify-end md:justify-end">
          <label className="md:hidden text-xs text-primary font-bold mb-1 mr-2 block">
            Net:
          </label>
          <span
            className={`font-label-md text-label-md bg-opacity-5 px-3 py-1 rounded-md min-w-[3rem] text-center inline-block border ${isPrimary ? "text-primary bg-primary border-primary/20" : "text-secondary bg-secondary border-secondary/20"}`}
          >
            {data.net.toFixed(2)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      className="w-full bg-surface-background py-section-gap px-margin-mobile md:px-margin-desktop min-h-screen whitespace-pre-line"
      style={
        block.styles?.backgroundColor
          ? { backgroundColor: block.styles.backgroundColor }
          : {}
      }
    >
      <style>{`
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
        input[type="number"] {
            -moz-appearance: textfield;
        }
      `}</style>
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-gutter">
        {/* Left Side: Calculation Forms */}
        <div className="w-full lg:w-2/3 flex flex-col gap-gutter">
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
          <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mb-gutter">
            <div className="bg-primary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <IconPreview data="person" className="text-xl" />
              </div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Öğrenci ve Veli Bilgileri
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Öğrenci Adı Soyadı
                  </label>
                  <input
                    type="text"
                    placeholder="Ad Soyad giriniz"
                    value={studentInfo.studentName}
                    onChange={(e) =>
                      setStudentInfo({
                        ...studentInfo,
                        studentName: e.target.value,
                      })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Veli Adı Soyadı
                  </label>
                  <input
                    type="text"
                    placeholder="Ad Soyad giriniz"
                    value={studentInfo.parentName}
                    onChange={(e) =>
                      setStudentInfo({
                        ...studentInfo,
                        parentName: e.target.value,
                      })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Veli Telefon
                  </label>
                  <input
                    type="tel"
                    placeholder="0 (5XX) XXX XX XX"
                    value={studentInfo.phone}
                    onChange={(e) =>
                      setStudentInfo({ ...studentInfo, phone: e.target.value })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Mevcut Okulu
                  </label>
                  <input
                    type="text"
                    placeholder="Okul adını giriniz"
                    value={studentInfo.school}
                    onChange={(e) =>
                      setStudentInfo({ ...studentInfo, school: e.target.value })
                    }
                    className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sözel Oturum Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="bg-primary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <IconPreview data="menu_book" className="text-xl" />
              </div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Sözel Oturum
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
                  subjectKey="turkce"
                  label="Türkçe"
                  isPrimary={true}
                />
                <SubjectRow
                  subjectKey="tarih"
                  label="T.C. İnkılap Tarihi"
                  isPrimary={true}
                />
                <SubjectRow
                  subjectKey="din"
                  label="Din Kültürü"
                  isPrimary={true}
                />
                <SubjectRow
                  subjectKey="ingilizce"
                  label="Yabancı Dil"
                  isPrimary={true}
                />
              </div>
            </div>
          </div>

          {/* Sayısal Oturum Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mt-4">
            <div className="bg-secondary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <IconPreview data="calculate" className="text-xl" />
              </div>
              <h2 className="font-headline-md text-headline-md text-secondary">
                Sayısal Oturum
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
                  subjectKey="matematik"
                  label="Matematik"
                  isPrimary={false}
                />
                <SubjectRow
                  subjectKey="fen"
                  label="Fen Bilimleri"
                  isPrimary={false}
                />
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-lg border border-border-subtle bg-surface-card text-text-main font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2"
            >
              Sıfırla
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2">
              <IconPreview data="send" className="text-[20px]" /> Gönder
            </button>
          </div>
        </div>

        {/* Right Side: Results Dashboard (Sticky on Desktop) */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-28 bg-[#002147] text-white rounded-xl shadow-sm overflow-hidden flex flex-col h-auto">
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
                  Sınav Sonucu
                </h2>
              </div>

              {/* Score Display */}
              <div className="bg-white/10 rounded-xl p-6 text-center mb-6 border border-white/20 backdrop-blur-sm">
                <p className="font-label-md text-label-md text-[#D4AF37] uppercase tracking-wider mb-2">
                  Tahmini LGS Puanı
                </p>
                <div className="font-display-lg text-display-lg font-bold">
                  {results.totalScore.toFixed(2)}
                </div>
                <p className="text-sm text-white/70 mt-2">Max: 500 Puan</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Toplam Net</p>
                  <p className="font-headline-md text-headline-md font-bold text-[#3adccc]">
                    {results.totalNet.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/40 mt-1">/ 90 Soru</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Tahmini Yüzdelik</p>
                  <p className="font-headline-md text-headline-md font-bold text-[#D4AF37]">
                    {results.percentile}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    2023 Verilerine Göre
                  </p>
                </div>
              </div>

              {/* Net Distribution Chart */}
              <div className="mt-auto">
                <p className="font-label-sm text-label-sm text-white/80 mb-3">
                  Oturum Bazlı Net Dağılımı
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Sözel (Max 50)</span>
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
                      <span className="text-white/70">Sayısal (Max 40)</span>
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

              <button className="w-full mt-8 bg-[#D4AF37] text-[#002147] font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors">
                <IconPreview data="download" className="text-[20px]" />
                PDF İndir / Yazdır
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
