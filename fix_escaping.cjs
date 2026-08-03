const fs = require('fs');

let code = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');

// The escaped dollars and backticks are mainly between handlePrint and its end.
// We can just replace \${ with ${ and \` with ` inside that function.

let lines = code.split('\n');
let inHandlePrint = false;
for(let i=0; i<lines.length; i++) {
   if (lines[i].includes("const handlePrint = (target: 'all' | any) => {")) {
       inHandlePrint = true;
   }
   if (inHandlePrint) {
       lines[i] = lines[i].replace(/\\\$/g, '$');
       lines[i] = lines[i].replace(/\\\`/g, '`');
   }
   if (inHandlePrint && lines[i].includes("alert('Yazdırma işlemi açılamadı. Lütfen pop-up engelleyicinizi kontrol edin.');")) {
       inHandlePrint = false; // end after this
   }
}

fs.writeFileSync('src/admin/hubs/ReportCenter.tsx', lines.join('\n'));
