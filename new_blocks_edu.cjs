const fs = require('fs');

const code = `
const EduSystemHeroBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const bgImage = block.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80';
  const posX = block.image_posX || '50';
  const posY = block.image_posY || '50';
  const scale = block.image_scale || '100';

  return (
    <section key={index} className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden" style={getStyle(block, "container")}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-on-background/40 z-10"></div>
        <div 
          className="w-full h-full bg-cover" 
          style={{ 
            backgroundImage: \`url('\${bgImage}')\`,
            backgroundPosition: \`\${posX}% \${posY}%\`,
            transform: \`scale(\${scale / 100})\`
          }}>
        </div>
      </div>
      <div className="relative z-20 w-full max-w-container-max px-margin-mobile md:px-margin-desktop py-20 text-center text-white">
        <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up" style={getTitleStyle(block)}>
          {block.title || 'Eğitim Sistemimiz'}
        </h1>
        <p className="font-body-lg text-lg md:text-xl max-w-3xl mx-auto text-surface-bright/90 opacity-0 animate-fade-in-up" style={{...getSubtitleStyle(block), animationDelay: '200ms', animationFillMode: 'forwards'}}>
          {block.subtitle || 'Geleceğe Güvenle Hazırlıyoruz'}
        </p>
      </div>
    </section>
  );
};

const EduSystemLevelsBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section key={index} className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" style={getStyle(block, "container")}>
      <div className="text-center mb-16">
        <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-text-main mb-4" style={getTitleStyle(block)}>{block.title}</h2>
        <div className="h-1 w-20 bg-secondary rounded-full mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(block.items || []).map((item: any, i: number) => {
          const isPrimary = i % 2 === 0;
          const colorClass = isPrimary ? 'primary' : 'secondary';
          return (
            <div key={i} className="bg-surface-card rounded-xl border border-border-subtle p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
              style={{
                backgroundColor: item.cardBgColor || undefined,
                borderColor: item.cardBorderColor || undefined,
                borderWidth: item.cardBorderWidth || undefined,
                borderRadius: item.cardBorderRadius || undefined,
                padding: item.cardPadding || undefined,
                boxShadow: item.cardShadow === 'none' ? 'none' : (item.cardShadow ? \`var(--tw-shadow-\${item.cardShadow})\` : undefined),
              }}
            >
              <div className={\`w-14 h-14 rounded-full bg-\${colorClass}/10 flex items-center justify-center mb-6 group-hover:bg-\${colorClass} group-hover:text-white transition-colors\`}>
                <span className={\`material-symbols-outlined text-3xl text-\${colorClass} group-hover:text-white transition-colors\`} translate="no" aria-hidden="true">{item.icon || 'school'}</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-text-main mb-3" style={{color: item.itemTitleColor}}>{item.title}</h3>
              <p className="font-body-md text-text-muted mb-6 flex-grow" style={{color: item.itemDescColor}}>{item.desc}</p>
              {item.url && (
                <SmartLink className={\`inline-flex items-center text-\${colorClass} font-label-md font-semibold hover:opacity-80 group/link\`} url={item.url}>
                  {item.buttonText || 'Detaylı Bilgi'}
                  <span className="material-symbols-outlined text-sm ml-1 group-hover/link:translate-x-1 transition-transform" translate="no" aria-hidden="true">arrow_forward</span>
                </SmartLink>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EduSystemYadepBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section key={index} className="py-section-gap bg-surface-container-low" style={getStyle(block, "container")}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-text-main mb-4" style={getTitleStyle(block)}>{block.title}</h2>
          <p className="font-body-lg text-text-muted max-w-2xl mx-auto" style={getSubtitleStyle(block)}>{block.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(block.items || []).map((item: any, i: number) => {
             let colorClass = 'primary';
             if (i === 1) colorClass = 'secondary';
             if (i === 2) colorClass = 'error';
             
             return (
              <div key={i} className="bg-surface-card p-8 rounded-xl shadow-sm border border-border-subtle hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: item.cardBgColor || undefined,
                  borderColor: item.cardBorderColor || undefined,
                  borderWidth: item.cardBorderWidth || undefined,
                  borderRadius: item.cardBorderRadius || undefined,
                  padding: item.cardPadding || undefined,
                  boxShadow: item.cardShadow === 'none' ? 'none' : (item.cardShadow ? \`var(--tw-shadow-\${item.cardShadow})\` : undefined),
                }}
              >
                <div className={\`w-14 h-14 rounded-xl flex items-center justify-center mb-6 \${colorClass === 'error' ? 'bg-error-container/30' : \`bg-\${colorClass}/10\`}\`}>
                  <span className={\`material-symbols-outlined text-3xl \${colorClass === 'error' ? 'text-error-red' : \`text-\${colorClass}\`}\`} translate="no" aria-hidden="true">{item.icon}</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-text-main mb-3" style={{color: item.itemTitleColor}}>{item.title}</h3>
                <p className="font-body-md text-text-muted" style={{color: item.itemDescColor}}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const EduSystemPhilosophyBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const bgImage = block.image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80';
  const posX = block.image_posX || '50';
  const posY = block.image_posY || '50';
  const scale = block.image_scale || '100';

  return (
    <section key={index} className="py-section-gap bg-surface-container relative overflow-hidden" style={getStyle(block, "container")}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div>
              <span className="text-secondary font-label-md tracking-wider uppercase mb-2 block">{block.badge}</span>
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-text-main" style={getTitleStyle(block)}>{block.title}</h2>
            </div>
            <p className="font-body-md text-text-muted text-lg" style={getSubtitleStyle(block)}>
              {block.subtitle || block.desc}
            </p>
            <div className="space-y-6">
              {(block.items || []).map((item: any, i: number) => {
                const colorClass = i % 2 === 0 ? 'primary' : 'secondary';
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center shadow-sm">
                      <span className={\`material-symbols-outlined text-\${colorClass}\`} translate="no" aria-hidden="true">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-lg font-bold text-text-main mb-1" style={{color: item.itemTitleColor}}>{item.title}</h4>
                      <p className="font-body-md text-text-muted text-sm" style={{color: item.itemDescColor}}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <div 
                className="w-full h-full bg-cover" 
                style={{
                  backgroundImage: \`url('\${bgImage}')\`,
                  backgroundPosition: \`\${posX}% \${posY}%\`,
                  transform: \`scale(\${scale / 100})\`
                }}
              ></div>
            </div>
            {block.cardTitle && (
              <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white shadow-lg max-w-xs hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-secondary text-3xl" translate="no" aria-hidden="true">{block.cardIcon || 'emoji_events'}</span>
                  <span className="font-headline-md font-bold text-text-main">{block.cardTitle}</span>
                </div>
                <p className="font-body-md text-sm text-text-muted">{block.cardDesc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const EduSystemCtaBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section key={index} className="py-24 bg-primary text-white relative overflow-hidden" style={getStyle(block, "container")}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
        <h2 className="font-headline-xl text-3xl md:text-5xl font-bold mb-6" style={getTitleStyle(block)}>{block.title}</h2>
        <p className="font-body-lg text-lg text-primary-fixed-dim mb-10 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>
          {block.subtitle || block.desc}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {(block.buttons || []).map((btn: any, btnIdx: number) => (
            <SmartLink key={btnIdx} url={btn.url} className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-label-md font-bold rounded-lg hover:bg-surface-bright hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              {btn.icon && <span className="material-symbols-outlined" translate="no" aria-hidden="true">{btn.icon}</span>}
              {btn.label || btn.buttonText}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
};
`;

let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

// Insert after CareerApplicationBlock
const insertPos = file.indexOf('const CareerApplicationBlock =');
if (insertPos > -1) {
  const endOfCareerApplication = file.indexOf('};', insertPos) + 2;
  file = file.slice(0, endOfCareerApplication) + '\n' + code + file.slice(endOfCareerApplication);
}

// Add to DynamicBlockRenderer cases
const newCases = `        case "edu_system_hero":
          return <EduSystemHeroBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "edu_system_levels":
          return <EduSystemLevelsBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "edu_system_yadep":
          return <EduSystemYadepBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "edu_system_philosophy":
          return <EduSystemPhilosophyBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "edu_system_cta":
          return <EduSystemCtaBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
`;

file = file.replace(
  `        case "contact_form":`,
  newCases + `        case "contact_form":`
);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
