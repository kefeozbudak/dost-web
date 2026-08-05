const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

const moveUpBtn = `
                          <div className="flex flex-col gap-1 mr-2">
                            <button onClick={() => {
                                const newLinks = [...(headerData.links || [])];
                                if (index > 0) {
                                  const temp = newLinks[index - 1];
                                  newLinks[index - 1] = newLinks[index];
                                  newLinks[index] = temp;
                                  setHeaderData({ ...headerData, links: newLinks });
                                }
                            }} disabled={index === 0} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                                const newLinks = [...(headerData.links || [])];
                                if (index < newLinks.length - 1) {
                                  const temp = newLinks[index + 1];
                                  newLinks[index + 1] = newLinks[index];
                                  newLinks[index] = temp;
                                  setHeaderData({ ...headerData, links: newLinks });
                                }
                            }} disabled={index === (headerData.links || []).length - 1} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
`;

file = file.replace(
  `<div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-3">`,
  `<div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          ` + moveUpBtn + `
                          <div className="flex-1 grid grid-cols-2 gap-3">`
);

const subMoveBtn = `
                                 <div className="flex flex-col gap-1 shrink-0 mr-1">
                                    <button onClick={() => {
                                      const newLinks = [...(headerData.links || [])];
                                      if (subIdx > 0) {
                                        const temp = newLinks[index].subLinks[subIdx - 1];
                                        newLinks[index].subLinks[subIdx - 1] = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }
                                    }} disabled={subIdx === 0} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                        <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => {
                                      const newLinks = [...(headerData.links || [])];
                                      if (subIdx < newLinks[index].subLinks.length - 1) {
                                        const temp = newLinks[index].subLinks[subIdx + 1];
                                        newLinks[index].subLinks[subIdx + 1] = newLinks[index].subLinks[subIdx];
                                        newLinks[index].subLinks[subIdx] = temp;
                                        setHeaderData({ ...headerData, links: newLinks });
                                      }
                                    }} disabled={subIdx === newLinks[index].subLinks.length - 1} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">
                                        <ArrowDown className="w-3 h-3" />
                                    </button>
                                 </div>
`;

file = file.replace(
  `<div key={subIdx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded items-center">
                                 <div className="flex flex-col gap-1">`,
  `<div key={subIdx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded items-center">
                                 ` + subMoveBtn + `
                                 <div className="flex flex-col gap-1 w-full flex-1">`
);

const importRegex = /import \{([^\}]+)\} from 'lucide-react'/;
const match = file.match(importRegex);
if (match) {
  let imports = match[1];
  if (!imports.includes('ArrowUp')) imports += ', ArrowUp';
  if (!imports.includes('ArrowDown')) imports += ', ArrowDown';
  file = file.replace(match[0], "import {" + imports + "} from 'lucide-react'");
}

fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
