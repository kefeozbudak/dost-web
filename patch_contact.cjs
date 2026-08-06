const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /const \[formData, setFormData\] = useState\(\{\n\s*name: "",\n\s*email: "",\n\s*subject: "",\n\s*message: ""\n\s*\}\);/,
  `const [formData, setFormData] = useState({\n    name: "",\n    email: "",\n    phone: "",\n    campus: "",\n    educationLevel: "",\n    subject: "",\n    message: ""\n  });`
);

content = content.replace(
  /setFormData\(\{ name: "", email: "", subject: "", message: "" \}\);/,
  `setFormData({ name: "", email: "", phone: "", campus: "", educationLevel: "", subject: "", message: "" });`
);

const formFields = `              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">
                  Adınız Soyadınız
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ornek@email.com"
                />
              </div>
              
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">
                  Telefon
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="05XX XXX XX XX"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">
                  Kampüs Seçin
                </label>
                <select
                  required
                  value={formData.campus}
                  onChange={e => setFormData({...formData, campus: e.target.value})}
                  className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="" disabled>Kampüs Seçin</option>
                  <option value="Batıkent Kampüsü">Batıkent Kampüsü</option>
                  <option value="Eryaman Kampüsü">Eryaman Kampüsü</option>
                  <option value="Çayyolu Kampüsü">Çayyolu Kampüsü</option>
                  <option value="İncek Kampüsü">İncek Kampüsü</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">
                  Eğitim Kademesi
                </label>
                <select
                  required
                  value={formData.educationLevel}
                  onChange={e => setFormData({...formData, educationLevel: e.target.value})}
                  className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="" disabled>Kategori Seçin</option>
                  <option value="Anaokulu">Anaokulu</option>
                  <option value="İlkokul">İlkokul</option>
                  <option value="Ortaokul">Ortaokul</option>
                  <option value="Lise">Lise</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">`;

content = content.replace(
  /              <div className="flex flex-col gap-2">\n\s*<label className="font-label-md text-label-md text-on-surface">\n\s*Adınız Soyadınız\n\s*<\/label>\n\s*<input\n\s*type="text"\n\s*required\n\s*value=\{formData\.name\}\n\s*onChange=\{e => setFormData\(\{\.\.\.formData, name: e\.target\.value\}\)\}\n\s*className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary"\n\s*placeholder="Ahmet Yılmaz"\n\s*\/>\n\s*<\/div>\n\s*<div className="flex flex-col gap-2">\n\s*<label className="font-label-md text-label-md text-on-surface">\n\s*E-posta Adresiniz\n\s*<\/label>\n\s*<input\n\s*type="email"\n\s*required\n\s*value=\{formData\.email\}\n\s*onChange=\{e => setFormData\(\{\.\.\.formData, email: e\.target\.value\}\)\}\n\s*className="px-4 py-3 bg-surface-container rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary"\n\s*placeholder="ornek@email\.com"\n\s*\/>\n\s*<\/div>\n\s*<div className="md:col-span-2 flex flex-col gap-2">/,
  formFields
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched ContactFormBlock in PageBlocks.tsx");
