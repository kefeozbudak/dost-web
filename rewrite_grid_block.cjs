const fs = require('fs');
let content = fs.readFileSync('src/components/ManagementBlocks.tsx', 'utf8');

const newGridBlock = `export const ManagementTeamGridBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  const isDeans = block.type === 'management_deans';
  return (
    <div className={\`mb-16 w-full \${block.styles?.fullWidth ? "max-w-full px-6" : "max-w-[1200px] px-6"} mx-auto whitespace-pre-line\`} style={getStyle(block)}>
      {block.hideHeader !== true && (
      <div className={\`flex items-center \${isDeans ? 'justify-between' : 'gap-3'} mb-8 border-b border-primary/20 pb-2\`}>
        {isDeans ? (
          <>
            <div className="flex items-center gap-3">
              {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "account_balance"}</span>}
              <h2 className="text-2xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Fakülte Dekanları"}</h2>
            </div>
            {block.subtitle && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block" style={getSubtitleStyle(block)}>{block.subtitle}</div>}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "groups"}</span>}
              <h2 className="text-2xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Rektör Yardımcıları & Genel Sekreter"}</h2>
            </div>
            {block.subtitle && <p className="text-sm text-slate-500 ml-4 hidden md:block" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
          </>
        )}
      </div>
      )}
      <div className={\`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 \${items.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}\`}>
        {items.map((item: any, idx: number) => {
          if (isDeans) {
            return (
              <div key={idx} className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow border border-slate-100 flex flex-col">
                {item.image ? (
                  <div 
                    className="aspect-square bg-center bg-cover rounded-lg mb-4 shrink-0" 
                    style={{ backgroundImage: \`url(\${item.image})\` }}
                  />
                ) : (
                  <div className="aspect-square bg-slate-100 rounded-lg mb-4 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
                  </div>
                )}
                <div className="space-y-1 flex-grow">
                  <p className="text-[11px] font-bold text-primary uppercase leading-tight line-clamp-2">{item.desc || "Bölüm"}</p>
                  <h5 className="text-md font-bold text-slate-900 leading-snug">{item.name}</h5>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50">
                  {item.hideButton !== true && (
                    <a href={item.url || "#"} className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1 cursor-pointer">
                        {item.buttonText || "Fakülte Sayfası"} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="flex flex-col bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              {item.image ? (
                <div 
                  className="h-64 bg-center bg-cover shrink-0" 
                  style={{ backgroundImage: \`url(\${item.image})\` }}
                />
              ) : (
                 <div className="h-64 bg-slate-100 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
                 </div>
              )}
              <div className="p-6 flex flex-col gap-3 flex-grow">
                <div className="flex-grow">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 line-clamp-2">{item.desc || "Birim"}</p>
                  <h4 className="text-xl font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">{item.role}</p>
                </div>
                {item.hideButton !== true && (
                  <a href={item.url || "#"} className="flex items-center gap-1 text-sm font-bold text-slate-800 hover:text-primary transition-colors mt-2 cursor-pointer">
                      {item.buttonText || "Detaylı Profil"} <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};`;

content = content.replace(/export const ManagementTeamGridBlock = \(\{[\s\S]+/, newGridBlock);

fs.writeFileSync('src/components/ManagementBlocks.tsx', content);
