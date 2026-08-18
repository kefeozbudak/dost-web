const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

const target = `        <div className="flex gap-4 uppercase font-bold tracking-tighter">
          <span className="hidden sm:inline">Audit Log</span>
          <span>V2.4.12</span>
    </div>`;

const replacement = `        <div className="flex items-center tracking-tighter text-xs">
          <span className="text-black font-black lowercase">yasin</span>
          <span className="text-red-600 font-black capitalize">Art</span>
          <span className="text-black font-bold ml-1 uppercase">Web Sistem</span>
        </div>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/admin/AdminLayout.tsx', code);
