const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/ReportCenter.tsx', 'utf8');

const careerReportViewCode = `
const CareerReportView = ({ data }: { data: any }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm w-full max-w-4xl mx-auto my-4">
      <div className="p-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[#002147] text-xl">work</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">İŞ BAŞVURU BİLGİLERİ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ad Soyad</span>
              <p className="text-sm font-semibold text-slate-800">{data.firstName} {data.lastName}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-Posta</span>
              <p className="text-sm font-semibold text-slate-800">{data.email || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Telefon</span>
              <p className="text-sm font-semibold text-slate-800">{data.phone || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Başvurulan Pozisyon</span>
              <p className="text-sm font-semibold text-slate-800">
                {data.position === 'math_teacher' ? 'Matematik Öğretmeni' : 
                 data.position === 'academic_coordinator' ? 'Akademik Koordinatör' :
                 data.position === 'guidance_counselor' ? 'Rehber Danışman' :
                 data.position === 'general' ? 'Genel Başvuru' : data.position || '-'}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[#002147] text-xl">description</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">CV & ÖN YAZI</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ön Yazı</span>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{data.coverLetter || '-'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Özgeçmiş Dosyası</span>
                <p className="text-sm font-semibold text-slate-800">{data.fileName || 'Yüklenmiş CV'}</p>
              </div>
              {data.cvUrl ? (
                <a href={data.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-900 transition">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Görüntüle / İndir
                </a>
              ) : (
                <span className="text-xs text-red-500 font-bold">Dosya Yok</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
`;

file = file.replace("const PreRegistrationReportView", careerReportViewCode + "\nconst PreRegistrationReportView");

// Update list view conditional rendering
const formNameCondStr = "report.type === 'pre_registration_form' ? 'Ön Kayıt Formu' : report.type === 'contact_form' ? 'İletişim Formu' : ((report.type === 'chat' || !report.type) ? 'Veli Asistanı Formu' : (report.data?.formName || 'Veli Asistanı Formu'))";
const newFormNameCondStr = "report.type === 'is_basvuru_formu' ? 'İş Başvurusu' : " + formNameCondStr;
file = file.replace(formNameCondStr, newFormNameCondStr);

// In the row rendering
const expandViewStr = "report.type === 'pre_registration_form' ? <PreRegistrationReportView data={report.data} /> : (";
const newExpandViewStr = "report.type === 'is_basvuru_formu' ? <CareerReportView data={report.data} /> : report.type === 'pre_registration_form' ? <PreRegistrationReportView data={report.data} /> : (";
file = file.replace(expandViewStr, newExpandViewStr);

fs.writeFileSync('./src/admin/hubs/ReportCenter.tsx', file);
