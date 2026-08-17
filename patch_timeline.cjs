const fs = require('fs');
const file = 'src/components/AboutBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = `                 <div className={\`md:w-1/2 \${isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'}\`}>`;
const replacement = `                 <div className={\`w-full md:w-1/2 \${isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'}\`}>`;

const anchor2 = `                 <div className={\`md:w-1/2 \${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}\`}>`;
const replacement2 = `                 <div className={\`w-full md:w-1/2 \${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}\`}>`;

const anchor3 = `                   <div className="w-full h-96 bg-cover bg-center rounded-3xl shadow-lg border border-[#e2e8f0]"`;
const replacement3 = `                   <div className="w-full h-64 md:h-96 bg-cover bg-center rounded-3xl shadow-lg border border-[#e2e8f0]"`;


if (content.includes(anchor)) {
    content = content.replace(new RegExp(anchor.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replacement);
    content = content.replace(new RegExp(anchor2.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replacement2);
    content = content.replace(new RegExp(anchor3.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replacement3);
    fs.writeFileSync(file, content);
    console.log("Patched AboutBlocks.tsx (mobile width)");
} else {
    console.log("Could not find anchor in AboutBlocks.tsx");
}
