const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const oldCareerBlockStart = `const CareerApplicationBlock = ({ block, index, getStyle, getTitleStyle }: any) => {`;
const oldCareerBlockEnd = `        </div>
      </div>
    </section>
  );
};`;

const regex = new RegExp(`const CareerApplicationBlock = \\(\\{ block, index, getStyle, getTitleStyle \\}: any\\) => \\{[\\s\\S]*?<\\/section>\\n  \\);\\n\\};`);

const newCareerBlock = `const CareerApplicationBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section key={index} id="application-form" className="py-section-gap w-full flex items-center justify-center p-4 md:p-8" style={getStyle(block, "container")}>
      <div className="w-full max-w-[640px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 text-center">
          <h1 className="font-display-lg text-display-lg text-[#002147] mb-2" style={getTitleStyle(block)}>{block.title || "İş Başvurusu"}</h1>
          <p className="font-body-lg text-body-lg text-text-muted">Dost Koleji ailesine katılmak için formu doldurun</p>
        </div>
        <DynamicFormBuilder block={block} type="career_application" />
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
