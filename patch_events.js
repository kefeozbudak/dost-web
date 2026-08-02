import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/components/PageBlocks.tsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{day.events?.map((event: any, eIndex: number) => (')) {
    // Replace lines i through i+5
    lines.splice(i, 6, 
      '                        {day.events && day.events.length > 0 ? day.events.map((event: any, eIndex: number) => (',
      '                          <div key={eIndex} className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-bold leading-tight truncate border ${event.colorClass || "bg-surface-container text-on-surface border-border-subtle"}`}>',
      '                            {event.title}',
      '                            {event.subtitle && <><br /><span className="font-normal opacity-90 text-center block">{event.subtitle}</span></>}',
      '                          </div>',
      '                        )) : day.eventTitle ? (',
      '                          <div className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-bold leading-tight truncate border ${day.eventColorClass || "bg-surface-container text-on-surface border-border-subtle"}`}>',
      '                            {day.eventTitle}',
      '                            {day.eventSubtitle && <><br /><span className="font-normal opacity-90 text-center block">{day.eventSubtitle}</span></>}',
      '                          </div>',
      '                        ) : null}'
    );
    fs.writeFileSync(file, lines.join('\n'));
    console.log("Patched events rendering");
    break;
  }
}
