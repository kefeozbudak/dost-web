const fs = require('fs');

const file = 'src/components/ManagementBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

// For management_deans image
content = content.replace(/className="aspect-square bg-center bg-cover rounded-lg mb-4 shrink-0"/g, 'className="aspect-[4/5] w-full bg-center bg-cover rounded-lg mb-4 shrink-0"');
content = content.replace(/className="aspect-square bg-slate-100 rounded-lg mb-4 shrink-0 flex items-center justify-center"/g, 'className="aspect-[4/5] w-full bg-slate-100 rounded-lg mb-4 shrink-0 flex items-center justify-center"');

// For management_vice_rectors image
content = content.replace(/className="aspect-square w-full bg-center bg-cover shrink-0"/g, 'className="aspect-[4/5] w-full bg-center bg-cover shrink-0"');
content = content.replace(/className="aspect-square w-full bg-slate-100 shrink-0 flex items-center justify-center"/g, 'className="aspect-[4/5] w-full bg-slate-100 shrink-0 flex items-center justify-center"');

fs.writeFileSync(file, content);
console.log("Patched ManagementBlocks.tsx");

const file2 = 'src/components/AboutBlocks.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/className="aspect-square w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"/g, 'className="aspect-[4/5] w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"');
content2 = content2.replace(/className="aspect-square w-full bg-slate-100 flex items-center justify-center"/g, 'className="aspect-[4/5] w-full bg-slate-100 flex items-center justify-center"');
fs.writeFileSync(file2, content2);
console.log("Patched AboutBlocks.tsx");

