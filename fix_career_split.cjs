const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const regex = /const CareerApplicationBlock = \(\{ block, index, getStyle, getTitleStyle, getSubtitleStyle \}: any\) => \{[\s\S]*?<DynamicFormBuilder block=\{block\} type="career_application" \/>[\s\S]*?<\/section>\n  \);\n\};/;

const newCareerBlock = `const CareerApplicationBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const positions = block.items || [];
  
  return (
    <section key={index} id="application-form" className="w-full px-4 md:px-0 mb-16" style={getStyle(block, "container")}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Open Positions */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <h2 className="font-bold text-[28px] text-[#002147] mb-6" style={getTitleStyle(block)}>
              {block.title || "Açık Pozisyonlar"}
            </h2>
            {positions.length > 0 ? (
              <div className="space-y-4">
                {positions.map((pos: any, idx: number) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#D4AF37] hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-[#002147] group-hover:text-[#D4AF37] transition-colors">{pos.title}</h4>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{pos.type}</span>
                    </div>
                    <p className="text-[13px] text-slate-500">{pos.dept}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 text-slate-500 p-6 rounded-xl text-center text-sm border border-slate-100">
                Şu an açık pozisyon bulunmamaktadır. Genel başvuru yapabilirsiniz.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Application Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative">
             {/* Header */}
            <div className="bg-[#002147] px-8 py-6 text-white text-center">
              <h2 className="font-bold text-[24px]">İş Başvurusu</h2>
              <p className="text-white/80 mt-2">Dost Koleji ailesine katılmak için formu doldurun</p>
            </div>
            
            <div className="p-8">
              <DynamicFormBuilder block={block} type="career_application" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};`;

if (file.match(regex)) {
  file = file.replace(regex, newCareerBlock);
} else {
  console.log("Could not find CareerApplicationBlock exactly to replace.");
}

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
