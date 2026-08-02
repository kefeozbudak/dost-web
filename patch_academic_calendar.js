import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/components/PageBlocks.tsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

const calendarBlocks = `      if (block.type === 'academic_calendar_hero') {
        return (
          <section key={index} className="relative bg-primary text-on-primary overflow-hidden" style={getStyle(block, 'container')}>
            <div className="absolute inset-0 z-0">
              <div 
                className="w-full h-full bg-cover bg-center opacity-30 mix-blend-multiply" 
                style={getImageStyle(block, 'image', index)} 
              />
            </div>
            <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop py-section-gap flex flex-col items-center text-center">
              <h1 className="font-display-lg text-display-lg text-on-primary mb-6" style={getTitleStyle(block)}>{block.title}</h1>
              {block.subtitle && (
                <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl" style={getSubtitleStyle(block)}>
                  {block.subtitle}
                </p>
              )}
            </div>
          </section>
        );
      }

      if (block.type === 'academic_calendar') {
        return (
          <div key={index} className="max-w-container-max mx-auto px-margin-desktop py-section-gap" style={getStyle(block, 'container')}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-surface-card p-6 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">{block.month || "Ekim 2023"}</h2>
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="flex space-x-4">
                {block.pdfUrl && (
                  <a href={block.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 border-2 border-primary text-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    <span>{block.pdfButtonText || "PDF İndir"}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mb-section-gap">
              <div className="grid grid-cols-7 border-b border-border-subtle bg-surface-container-low">
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant hidden md:block">Pazartesi</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant hidden md:block">Salı</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant hidden md:block">Çarşamba</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant hidden md:block">Perşembe</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant hidden md:block">Cuma</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant text-error hidden md:block">Cumartesi</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant text-error hidden md:block">Pazar</div>
                
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant md:hidden">Pzt</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant md:hidden">Sal</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant md:hidden">Çar</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant md:hidden">Per</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant md:hidden">Cum</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant text-error md:hidden">Cmt</div>
                <div className="py-4 text-center font-label-md text-label-md text-on-surface-variant text-error md:hidden">Paz</div>
              </div>

              <div className="grid grid-cols-7 border-l border-t border-border-subtle">
                {block.days?.map((day: any, i: number) => {
                  if (!day.isCurrentMonth) {
                    return (
                      <div key={i} className="min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border-subtle bg-surface-container relative">
                        <span className="font-label-md text-label-md text-on-surface-variant opacity-50 absolute top-1 md:top-2 right-1 md:right-2">{day.date}</span>
                      </div>
                    );
                  }

                  if (day.isWeekend) {
                    return (
                      <div key={i} className="min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border-subtle bg-surface-container-high relative">
                        <span className="font-label-md text-label-md text-on-surface-variant opacity-50 absolute top-1 md:top-2 right-1 md:right-2">{day.date}</span>
                        <div className="mt-8 text-center text-on-surface-variant font-caption text-[8px] md:text-caption opacity-50">Hafta Sonu</div>
                      </div>
                    );
                  }

                  return (
                    <div key={i} className={\`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border-subtle relative group hover:bg-surface-container-lowest transition-colors \${day.isToday ? 'ring-2 ring-primary ring-inset' : ''} \${day.bgColor ? day.bgColor : 'bg-surface-card'}\`}>
                      {day.isToday && <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-primary text-on-primary font-caption text-[8px] md:text-caption px-1.5 py-0.5 rounded uppercase tracking-wider">Bugün</span>}
                      <span className={\`font-label-md text-label-md absolute top-1 md:top-2 right-1 md:right-2 \${day.isToday ? 'text-primary font-bold' : 'text-on-surface'}\`}>{day.date}</span>
                      
                      <div className="mt-6 md:mt-8 space-y-1">
                        {day.events?.map((event: any, eIndex: number) => (
                          <div key={eIndex} className={\`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-bold leading-tight truncate border \${event.colorClass || 'bg-surface-container text-on-surface border-border-subtle'}\`}>
                            {event.title}
                            {event.subtitle && <><br /><span className="font-normal opacity-90 text-center block">{event.subtitle}</span></>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {block.legends && block.legends.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {block.legends.map((legend: any, i: number) => (
                  <div key={i} className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" style={getCardStyle(legend, 'card', i)}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={\`w-8 h-8 rounded flex items-center justify-center \${legend.iconBgClass || 'bg-surface-container'}\`}>
                        <span className={\`material-symbols-outlined text-sm \${legend.iconColorClass || 'text-on-surface'}\`} style={{ fontVariationSettings: "'FILL' 1" }}>{legend.icon}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface" style={{ color: legend.itemTitleColor }}>{legend.title}</h3>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4" style={{ color: legend.itemDescColor }}>{legend.desc}</p>
                    {legend.url && (
                      <a href={legend.url} className="text-primary font-label-md text-label-md font-bold flex items-center space-x-1 hover:underline">
                        <span>{legend.buttonText || "İncele"}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }`;

let insertIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('return null;')) {
    if (lines[i-1].trim() === '}' || lines[i-2].trim() === '}') {
      insertIndex = i;
      break;
    }
  }
}

if (insertIndex !== -1 && !fs.readFileSync(file, 'utf8').includes("block.type === 'academic_calendar'")) {
  lines.splice(insertIndex, 0, calendarBlocks);
  fs.writeFileSync(file, lines.join('\n'));
  console.log("Successfully patched PageBlocks.tsx");
} else {
  console.log("Could not find insert point or already patched");
}
