import fs from 'fs';
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const ruinedHero = `                        {renderArrayEditor(
              "items",
              [
                { key: "title", label: "Başlık", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon", type: "icon" },
                { key: "stat", label: "İstatistik (Kart 1)", type: "text" },
                {
                  key: "statLabel",
                  label: "İstatistik Etiketi (Kart 1)",
                  type: "text",
                },
                { key: "tag", label: "Rozet/Etiket (Kart 1)", type: "text" },
                {
                  key: "buttonText",
                  label: "Buton Metni (Kart 2)",
                  type: "text",
                },
                { key: "url", label: "Buton URL (Kart 2)", type: "url" },
                { key: "stat1Label", label: "İstatistik 1 Etiketi (Kart 2)", type: "text" },
                { key: "stat1Value", label: "İstatistik 1 Değeri (Kart 2)", type: "text" },
                { key: "stat2Label", label: "İstatistik 2 Etiketi (Kart 2)", type: "text" },
                { key: "stat2Value", label: "İstatistik 2 Değeri (Kart 2)", type: "text" },
                { key: "listString", label: "Özellik Listesi (Kart 3 - Her satıra bir tane)", type: "textarea" }
              ],
              "Öğeler (Max 3, Özel Tasarım)",
            )}`;

const fixedHeroArray = `{renderArrayEditor(
              "items",
              [
                { key: "image", label: "Görsel", type: "image" },
                { key: "title", label: "Görsel Altı Yazı (Opsiyonel)", type: "text" },
              ],
              "Hero Görselleri",
            )}`;

content = content.replace(ruinedHero, fixedHeroArray);

// Now fix the bento_academic properly
// It's around line 4520-4550

const bentoPattern = /(block\.type === "bento_academic"[\s\S]*?\{renderArrayEditor\(\s*"items",\s*\[[\s\S]*?\{ key: "url", label: "Buton URL \(Kart 2\)", type: "url" \},\s*\])/;
if (content.match(bentoPattern)) {
    content = content.replace(bentoPattern, `$1,
                { key: "stat1Label", label: "İstatistik 1 Etiketi (Kart 2)", type: "text" },
                { key: "stat1Value", label: "İstatistik 1 Değeri (Kart 2)", type: "text" },
                { key: "stat2Label", label: "İstatistik 2 Etiketi (Kart 2)", type: "text" },
                { key: "stat2Value", label: "İstatistik 2 Değeri (Kart 2)", type: "text" },
                { key: "listString", label: "Özellik Listesi (Kart 3 - Her satıra bir tane)", type: "textarea" }`);
    console.log("Fixed bento_academic");
} else {
    console.log("bento_academic pattern not found");
}

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);

