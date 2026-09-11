const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The broken part is at line 6355.
// We need to insert the beginning of the return statement for standard day rendering.

const missingPart = `                      return (
                        <div
                          key={i}
                          data-editor-item-index={day._oIndex !== undefined && day._oIndex !== -1 ? day._oIndex : (parseInt(day.date)-1)}
                          data-editor-array-key="days"
                          className="p-2 md:p-4 hover:bg-slate-50 transition-colors group min-h-[120px] md:min-h-[220px] bg-white whitespace-normal md:whitespace-pre-line"
`;

// Let's replace:
//                      }
//
//                        >
//                          <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3 whitespace-normal md:whitespace-pre-line">

const badPart = `                      }

                        >
                          <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3 whitespace-normal md:whitespace-pre-line">`;

const goodPart = `                      }

${missingPart}                        >
                          <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3 whitespace-normal md:whitespace-pre-line">`;

if (content.includes(badPart)) {
    content = content.replace(badPart, goodPart);
    fs.writeFileSync('src/components/PageBlocks.tsx', content);
    console.log("Fixed standard day rendering");
} else {
    console.log("Not found badPart");
}
