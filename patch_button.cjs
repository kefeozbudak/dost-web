const fs = require('fs');

const file = 'src/components/SchoolBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

const original = `                    <a href={item.url || "#"} className="inline-flex items-center gap-2 text-sm font-bold mt-4 hover:opacity-80 transition-opacity w-fit cursor-pointer" style={getItemButtonStyle(block)}>
                        {item.buttonText || "Kampüsümüzü İnceleyin"} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>`;

if (content.includes(original)) {
    content = content.replace(original, '');
    fs.writeFileSync(file, content);
    console.log("Patched SchoolBlocks.tsx");
} else {
    console.log("Could not find the target string in SchoolBlocks.tsx");
}
