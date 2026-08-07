const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

// Replace in the fields array
code = code.replace(/\{\s*key:\s*"cardBgColor",\s*label:\s*"Kart Arka Plan Rengi",\s*type:\s*"color",\s*\}/g, `{
                  key: "cardBgColor",
                  label: "Kart Arka Plan Rengi",
                  type: "color",
                },
                {
                  key: "cardBgImage",
                  label: "Kart Arka Plan Görseli",
                  type: "image",
                }`);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
