const fs = require('fs');
let file = fs.readFileSync('./src/pages/PublicView.tsx', 'utf8');

const replacement = `
        const generalDoc = await getDoc(doc(db, 'settings', 'general'));
        if (generalDoc.exists()) {
          const gData = await resolveMediaUrls(generalDoc.data());
          setGeneralSettings(gData);
          if (gData.siteTitle) {
            document.title = gData.siteTitle;
          }
          if (gData.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = gData.faviconUrl;
          }
        }
`;

file = file.replace(/const generalDoc = await getDoc\\(doc\\(db, 'settings', 'general'\\)\\);[\\s\\S]*?document\.title = gData\.siteTitle;\\s+\\}\\s+\\}/, replacement.trim());

fs.writeFileSync('./src/pages/PublicView.tsx', file);
