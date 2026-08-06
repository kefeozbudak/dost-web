const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/MediaCenter.tsx', 'utf8');

content = content.replace(
  /<p className="text-slate-600 text-sm mb-6">\s*\{deleteDialog\.isBulk\s*\?\s*`\$\{selectedIds\.length\} adet dosyayı kalıcı olarak silmek istediğinize emin misiniz\? Bu işlem geri alınamaz\.`\s*:\s*'Bu dosyayı kalıcı olarak silmek istediğinize emin misiniz\? Bu işlem geri alınamaz\.'\}\s*<\/p>/,
  `<p className="text-slate-600 text-sm mb-6">\n              <span>{deleteDialog.isBulk \n                ? \`\${selectedIds.length} adet dosyayı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.\`\n                : 'Bu dosyayı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'}</span>\n            </p>`
);

content = content.replace(
  /<p className="text-slate-500 text-sm max-w-md mx-auto">\s*\{searchTerm \? 'Aramanıza uygun dosya bulunamadı\.' : 'Henüz hiç medya yüklenmemiş\. Resim yükleyerek başlayabilirsiniz\.'\}\s*<\/p>/,
  `<p className="text-slate-500 text-sm max-w-md mx-auto">\n              <span>{searchTerm ? 'Aramanıza uygun dosya bulunamadı.' : 'Henüz hiç medya yüklenmemiş. Resim yükleyerek başlayabilirsiniz.'}</span>\n            </p>`
);

fs.writeFileSync('src/admin/hubs/MediaCenter.tsx', content);
console.log("Patched MediaCenter");
