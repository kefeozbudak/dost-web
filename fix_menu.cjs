const fs = require('fs');
let content = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

// Match the three submenu blocks
const regexEdu = /\{\/\* Eğitim Kademeleri Dropdown Submenu \*\/\}[\s\S]*?(?=\{\/\* Formlar Dropdown Submenu \*\/\}|  \{\/\* Formlar Dropdown Submenu \*\/\}|$)/;
const regexForms = /\{\/\* Formlar Dropdown Submenu \*\/\}[\s\S]*?(?=\{\/\* Kampüsler Dropdown Submenu \*\/\}|  \{\/\* Kampüsler Dropdown Submenu \*\/\}|$)/;
const regexCampus = /\{\/\* Kampüsler Dropdown Submenu \*\/\}[\s\S]*?(?=<Link\s+to="\/admin\/pages"|<Link\n\s+to="\/admin\/pages")/;

let eduMatch = content.match(regexEdu);
let formsMatch = content.match(regexForms);
let campusMatch = content.match(regexCampus);

if(eduMatch && formsMatch && campusMatch) {
    let eduText = eduMatch[0];
    let formsText = formsMatch[0];
    let campusText = campusMatch[0];

    // Remove from original
    content = content.replace(eduText, '');
    content = content.replace(formsText, '');
    content = content.replace(campusText, '');

    // Now modify the extracted texts to look like top-level buttons
    
    // For Edu
    eduText = eduText.replace(/px-2\.5 py-1\.5 rounded-md text-xs font-bold/, 'px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold');
    eduText = eduText.replace(/text-blue-700 bg-blue-50\/80 font-bold/, 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold');
    eduText = eduText.replace(/text-slate-700 hover:bg-slate-200\/60/, 'text-slate-600 hover:bg-slate-200');
    eduText = eduText.replace(/w-3\.5 h-3\.5/g, 'w-5 h-5 md:w-4 md:h-4');
    eduText = eduText.replace(/mt-1 ml-3 pl-3 border-l border-blue-200 space-y-1/, 'mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1');

    // For Forms
    formsText = formsText.replace(/px-2\.5 py-1\.5 rounded-md text-xs font-bold/, 'px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold');
    formsText = formsText.replace(/text-blue-700 bg-blue-50\/80 font-bold/, 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold');
    formsText = formsText.replace(/text-slate-700 hover:bg-slate-200\/60/, 'text-slate-600 hover:bg-slate-200');
    formsText = formsText.replace(/w-3\.5 h-3\.5/g, 'w-5 h-5 md:w-4 md:h-4');
    formsText = formsText.replace(/mt-1 ml-3 pl-3 border-l border-blue-200 space-y-1/, 'mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1');

    // For Campus
    campusText = campusText.replace(/px-2\.5 py-1\.5 rounded-md text-xs font-bold/, 'px-3 py-2.5 md:py-2 rounded-md text-sm md:text-xs font-semibold');
    campusText = campusText.replace(/text-blue-700 bg-blue-50\/80 font-bold/, 'bg-white text-blue-700 shadow-sm border border-blue-100 font-bold');
    campusText = campusText.replace(/text-slate-700 hover:bg-slate-200\/60/, 'text-slate-600 hover:bg-slate-200');
    campusText = campusText.replace(/w-3\.5 h-3\.5/g, 'w-5 h-5 md:w-4 md:h-4');
    campusText = campusText.replace(/mt-1 ml-3 pl-3 border-l border-blue-200 space-y-1/, 'mt-1 ml-3 pl-3 border-l border-slate-200 space-y-1');

    // Find the end of Sayfa Yönetimi and inject them
    // Look for:
    //                   )}
    //                 </div>
    //               )}
    // We can inject right after `</div>` of Sayfa Yönetimi.
    
    // Let's replace the closing of Sayfa Yönetimi block
    const injectionPoint = `                  )}
                </div>`;
    
    const replacement = `                  )}
                </div>
                
                <div>
${eduText}
                </div>
                <div>
${formsText}
                </div>
                <div>
${campusText}
                </div>`;

    content = content.replace(injectionPoint, replacement);

    fs.writeFileSync('src/admin/AdminLayout.tsx', content);
    console.log("Successfully moved menus");
} else {
    console.log("Could not match one of the menus");
}
