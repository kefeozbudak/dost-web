const fs = require('fs');

function getBalancedBraces(str, startIndex) {
    let i = startIndex;
    if (str[i] !== '{') return null;
    let count = 0;
    for (; i < str.length; i++) {
        if (str[i] === '{') count++;
        else if (str[i] === '}') count--;
        if (count === 0) return str.substring(startIndex, i + 1);
    }
    return null;
}

const files = [
  'src/admin/hubs/PopupCenter.tsx',
  'src/admin/hubs/SettingsCenter.tsx',
  'src/admin/hubs/AppearanceCenter.tsx',
  'src/admin/components/FieldStylePicker.tsx'
];

for (let file of files) {
    let code = fs.readFileSync(file, 'utf8');
    let output = '';
    let index = 0;

    const regex = /<input\s+type="text"/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
        let textBefore = code.substring(index, match.index);
        output += textBefore;
        index = match.index;

        let inputEnd = code.indexOf('/>', index) + 2;
        if (inputEnd === 1) inputEnd = code.indexOf('>', index) + 1;
        
        let inputTag = code.substring(index, inputEnd);
        
        // Find if this text input is preceded by a color input inside the same flex div
        if (textBefore.lastIndexOf('type="color"') > textBefore.lastIndexOf('<div')) {
            let onChangeIdx = inputTag.indexOf('onChange=');
            if (onChangeIdx !== -1) {
                let braceStart = inputTag.indexOf('{', onChangeIdx);
                if (braceStart !== -1) {
                    let onChangeCode = getBalancedBraces(inputTag, braceStart);
                    if (onChangeCode) {
                        let buttonHtml = `\n                            <button
                              type="button"
                              onClick={() => {
                                const handler = ${onChangeCode};
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>`;
                        
                        output += inputTag + buttonHtml;
                        index = inputEnd;
                        continue;
                    }
                }
            }
        }
        
        output += inputTag;
        index = inputEnd;
    }

    output += code.substring(index);
    
    // Fix syntax errors immediately for this file
    output = output.replace(/const handler = \{([\s\S]*?)\};\s*handler\(\{ target: \{ value: "transparent" \} \} as any\);/g, (match, p1) => {
        return `const handler = ${p1};\n                                handler({ target: { value: "transparent" } } as any);`;
    });
    
    fs.writeFileSync(file, output);
    console.log("Updated", file);
}
