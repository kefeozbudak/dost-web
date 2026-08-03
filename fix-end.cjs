const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');

const lines = code.split('\n');

while(lines[lines.length - 1].trim() !== '</div>' && lines[lines.length - 1].trim() !== '</>') {
    lines.pop();
}
// Now lines.length-1 is either </div> or </>.
// Let's replace the last 6 lines.
while (lines[lines.length - 1].trim().includes('div') || lines[lines.length - 1].trim().includes('</>')) {
    lines.pop();
}

lines.push('          </div>'); // closes map block
lines.push('        </div>'); // closes max-w-5xl
lines.push('      </div>'); // closes flex-1
lines.push('    </>');
lines.push('  );');
lines.push('};');
lines.push('export default ReportCenter;');

fs.writeFileSync('src/admin/hubs/ReportCenter.tsx', lines.join('\n'));
