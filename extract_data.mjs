import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function extract() {
  try {
    const data = { pages: {}, settings: {} };
    
    // Fetch pages
    const pagesSnap = await getDocs(collection(db, 'pages'));
    pagesSnap.forEach(doc => {
      data.pages[doc.id] = doc.data();
    });

    // Fetch settings
    const headerSnap = await getDoc(doc(db, 'settings', 'header'));
    if (headerSnap.exists()) data.settings.header = headerSnap.data();

    const footerSnap = await getDoc(doc(db, 'settings', 'footer'));
    if (footerSnap.exists()) data.settings.footer = footerSnap.data();

    const generalSnap = await getDoc(doc(db, 'settings', 'general'));
    if (generalSnap.exists()) data.settings.general = generalSnap.data();

    const fileContent = `// Auto-generated comprehensive fallback data
export const liveFallbackData = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync('src/lib/liveFallbackData.ts', fileContent);
    console.log("Successfully generated src/lib/liveFallbackData.ts");
    process.exit(0);
  } catch (e) {
    console.error("Extraction Failed:", e);
    process.exit(1);
  }
}
extract();
