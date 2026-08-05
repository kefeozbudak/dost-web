const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const targetStr = `        <DynamicFormBuilder block={block} type="bursluluk_exam_form" submitForm={submitForm} />
        
        {/* Aesthetic Footer Graphic */}`;

const newStr = `        {burslulukActive ? (
          <DynamicFormBuilder block={block} type="bursluluk_exam_form" submitForm={submitForm} />
        ) : (
          <div className="p-8 md:p-12">
            <div className="text-center bg-blue-50 border border-blue-100 p-8 rounded-xl">
              <span className="material-symbols-outlined text-blue-500 text-5xl mb-4" translate="no" aria-hidden="true">info</span>
              <p className="text-lg text-slate-700 whitespace-pre-line leading-relaxed max-w-2xl mx-auto">
                {burslulukInactiveMessage || "Değerli Velimiz,\\n2026-2027 Eğitim-Öğretim yılı Bursluluk ve Kabul Sınavı başvuru sürecimiz şu an için aktif değildir. Yeni dönem sınav takvimimiz ve başvuru tarihlerimiz belirlendiğinde web sitemiz ve sosyal medya hesaplarımız üzerinden duyurulacaktır. Kurumumuza gösterdiğiniz değerli ilgi için teşekkür ederiz."}
              </p>
            </div>
          </div>
        )}
        
        {/* Aesthetic Footer Graphic */}`;

file = file.replace(targetStr, newStr);
fs.writeFileSync('./src/components/PageBlocks.tsx', file);
