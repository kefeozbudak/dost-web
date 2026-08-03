import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const configRaw = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configRaw);

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
    try {
        await setDoc(doc(db, "pages", "kulup-kayit-formu"), {
            title: "Kulüp Kayıt Formu",
            path: "/kulup-kayit-formu",
            isDeleted: false,
            isHidden: false,
            blocks: [
                {
                    type: "club_registration_form",
                    titlePart1: "Dost Koleji",
                    titlePart2: "Kulüp Kayıt",
                    subtitle: "Lütfen Formu Eksiksiz Doldurunuz.",
                }
            ],
            createdAt: Date.now()
        });
        console.log("SUCCESS: Created Kulüp Kayıt Formu page.");
    } catch (e) {
        console.error("ERROR:", e);
    }
    process.exit(0);
}

seed();
