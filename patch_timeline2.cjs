const fs = require('fs');
const file = 'src/components/AboutBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

const t1 = 'className={`md:w-1/2 ${isEven ? \\'order-2 md:order-2\\' : \\'order-2 md:order-1\\'}`}';
const r1 = 'className={`w-full md:w-1/2 ${isEven ? \\'order-2 md:order-2\\' : \\'order-2 md:order-1\\'}`}';

const t2 = 'className={`md:w-1/2 ${isEven ? \\'order-1 md:order-1\\' : \\'order-1 md:order-2\\'}`}';
const r2 = 'className={`w-full md:w-1/2 ${isEven ? \\'order-1 md:order-1\\' : \\'order-1 md:order-2\\'}`}';

const t3 = 'className="w-full h-96 bg-cover bg-center rounded-3xl shadow-lg border border-[#e2e8f0]"';
const r3 = 'className="w-full min-h-[250px] md:h-96 bg-cover bg-center rounded-3xl shadow-lg border border-[#e2e8f0]"';

content = content.replace(t1, r1);
content = content.replace(t2, r2);
content = content.replace(t3, r3);
content = content.replace(t3, r3); // In case there are multiple
content = content.replace(t3, r3); // In case there are multiple

fs.writeFileSync(file, content);
console.log("Patched AboutBlocks.tsx definitively");
