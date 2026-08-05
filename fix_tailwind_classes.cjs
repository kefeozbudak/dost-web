const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

// Fix EduSystemLevelsBlock
let strToReplace = `              <div className={\`w-14 h-14 rounded-full bg-\${colorClass}/10 flex items-center justify-center mb-6 group-hover:bg-\${colorClass} group-hover:text-white transition-colors\`}>
                <span className={\`material-symbols-outlined text-3xl text-\${colorClass} group-hover:text-white transition-colors\`} translate="no" aria-hidden="true">{item.icon || 'school'}</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-text-main mb-3" style={{color: item.itemTitleColor}}>{item.title}</h3>
              <p className="font-body-md text-text-muted mb-6 flex-grow" style={{color: item.itemDescColor}}>{item.desc}</p>
              {item.url && (
                <SmartLink className={\`inline-flex items-center text-\${colorClass} font-label-md font-semibold hover:opacity-80 group/link\`} url={item.url}>`;

let replacement = `              <div className={\`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors \${isPrimary ? 'bg-primary/10 group-hover:bg-primary text-primary' : 'bg-secondary/10 group-hover:bg-secondary text-secondary'} group-hover:text-white\`}>
                <span className="material-symbols-outlined text-3xl transition-colors" translate="no" aria-hidden="true">{item.icon || 'school'}</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-text-main mb-3" style={{color: item.itemTitleColor}}>{item.title}</h3>
              <p className="font-body-md text-text-muted mb-6 flex-grow" style={{color: item.itemDescColor}}>{item.desc}</p>
              {item.url && (
                <SmartLink className={\`inline-flex items-center font-label-md font-semibold hover:opacity-80 group/link \${isPrimary ? 'text-primary' : 'text-secondary'}\`} url={item.url}>`;

file = file.replace(strToReplace, replacement);

// Fix EduSystemYadepBlock
let yadepTarget = `                <div className={\`w-14 h-14 rounded-xl flex items-center justify-center mb-6 \${colorClass === 'error' ? 'bg-error-container/30' : \`bg-\${colorClass}/10\`}\`}>
                  <span className={\`material-symbols-outlined text-3xl \${colorClass === 'error' ? 'text-error-red' : \`text-\${colorClass}\`}\`} translate="no" aria-hidden="true">{item.icon}</span>
                </div>`;

let yadepReplacement = `                <div className={\`w-14 h-14 rounded-xl flex items-center justify-center mb-6 \${
                  colorClass === 'error' ? 'bg-error-container/30 text-error-red' : 
                  colorClass === 'secondary' ? 'bg-secondary/10 text-secondary' : 
                  'bg-primary/10 text-primary'
                }\`}>
                  <span className="material-symbols-outlined text-3xl" translate="no" aria-hidden="true">{item.icon}</span>
                </div>`;
file = file.replace(yadepTarget, yadepReplacement);

// Fix EduSystemPhilosophyBlock
let philTarget = `                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center shadow-sm">
                      <span className={\`material-symbols-outlined text-\${colorClass}\`} translate="no" aria-hidden="true">{item.icon}</span>
                    </div>`;

let philReplacement = `                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center shadow-sm">
                      <span className={\`material-symbols-outlined \${colorClass === 'primary' ? 'text-primary' : 'text-secondary'}\`} translate="no" aria-hidden="true">{item.icon}</span>
                    </div>`;
file = file.replace(philTarget, philReplacement);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
