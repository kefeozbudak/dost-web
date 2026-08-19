const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const targetLogic = `    let bestMatchIndex = -1;
    let bestMatch = null;
    for (let j = 0; j < originalDays.length; j++) {
      const d = originalDays[j];
      if (!d) continue;
      
      const oDate = String(d.date || "").replace(/\\D/g, '');
      if (oDate === dayStr || oDate === padStr || parseInt(oDate) === i) {
          bestMatch = d;
          bestMatchIndex = j;
          break;
      }
    }`;

const newLogic = `    let bestMatchIndex = -1;
    let bestMatch = null;
    for (let j = 0; j < originalDays.length; j++) {
      const d = originalDays[j];
      if (!d) continue;
      
      const oDate = String(d.date || "");
      if (oDate.includes('-')) {
          if (oDate === \`\${year}-\${String(mIndex + 1).padStart(2, '0')}-\${padStr}\`) {
             bestMatch = d;
             bestMatchIndex = j;
             break;
          }
      } else {
          // legacy
          if (monthOffset === 0 && (oDate.replace(/\\D/g, '') === dayStr || parseInt(oDate) === i)) {
             bestMatch = d;
             bestMatchIndex = j;
             break;
          }
      }
    }`;

if (code.includes(targetLogic)) {
    code = code.replace(targetLogic, newLogic);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("Patched getAlignedCalendarDays");
} else {
    console.log("Could not find target logic in PageBlocks.tsx");
}
