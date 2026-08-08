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

let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
let output = '';
let index = 0;

const regex = /<input\s+type="text"/g;
let match;
while ((match = regex.exec(code)) !== null) {
    // Check if the previous input was a color input
    let textBefore = code.substring(index, match.index);
    output += textBefore;
    index = match.index;

    // Find the end of this input tag
    let inputEnd = code.indexOf('/>', index) + 2;
    if (inputEnd === 1) inputEnd = code.indexOf('>', index) + 1; // fallback
    
    let inputTag = code.substring(index, inputEnd);
    
    // Only process if it's a color sibling
    if (textBefore.lastIndexOf('type="color"') > textBefore.lastIndexOf('<div')) {
        // Find onChange in inputTag
        let onChangeIdx = inputTag.indexOf('onChange=');
        if (onChangeIdx !== -1) {
            let braceStart = inputTag.indexOf('{', onChangeIdx);
            if (braceStart !== -1) {
                let onChangeCode = getBalancedBraces(inputTag, braceStart);
                if (onChangeCode) {
                    // We can generate a button using this onChangeCode!
                    // Wait, onChangeCode expects an event `e` where `e.target.value` is the color.
                    // We can create a button with onClick={() => { const e = { target: { value: "transparent" } }; (onChangeCode_function)(e); }}
                    // But onChangeCode is usually just `{ (e) => ... }` or `{ handleChange }`.
                    // If it is `{(e) => ... }`, we can just call it like `onChangeCode({ target: { value: 'transparent' } } as any)`.
                    
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
    
    // If not processed, just add the input tag
    output += inputTag;
    index = inputEnd;
}

output += code.substring(index);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', output);
console.log("Updated colors.");
