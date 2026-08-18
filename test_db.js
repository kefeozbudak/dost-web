const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
    projectId: "ai-studio-remixdostkolejiw"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
    const pages = ['home', 'akademik-takvim', 'yemek-menusu'];
    for (const pid of pages) {
        const d = await getDoc(doc(db, "pages", pid));
        if (d.exists()) {
            const data = d.data();
            console.log("Page:", pid);
            for (let block of data.blocks || []) {
                if (block.type === 'menu_calendar' || block.type === 'academic_calendar') {
                    console.log("Found calendar block:", block.type, "Month:", block.month);
                    console.log("Days mapped:", (block.days || []).map(day => day.date));
                }
            }
        }
    }
}
main().catch(console.error);
