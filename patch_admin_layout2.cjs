const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

const target = `<span className="text-black font-black lowercase">yasin</span>
          <span className="text-red-600 font-black capitalize">Art</span>
          <span className="text-black font-bold ml-1 uppercase">Web Sistem</span>`;

const replacement = `<span className="text-black font-black">yasin</span>
          <span className="text-red-600 font-black">Art</span>
          <span className="text-black font-bold ml-1">Web Sistem</span>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/admin/AdminLayout.tsx', code);
