const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

const importTarget = "import { onSnapshot, collection } from 'firebase/firestore';";
if (code.indexOf("getDoc, setDoc, doc") === -1) {
    code = code.replace(
        "import { onSnapshot, collection } from 'firebase/firestore';",
        "import { onSnapshot, collection, getDoc, setDoc, doc } from 'firebase/firestore';"
    );
}

const target = "const { role, allowedPages } = useAuthStore();";
const seedFunc = `
  useEffect(() => {
    const seedClubPage = async () => {
      try {
        const docRef = doc(db, 'pages', 'kulup-kayit-formu');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
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
          console.log("Seeded Kulüp Kayıt Formu");
        }
      } catch (e) {
        console.error("Failed to seed:", e);
      }
    };
    seedClubPage();
  }, []);
`;

if (code.indexOf("seedClubPage") === -1) {
    code = code.replace(target, target + seedFunc);
    fs.writeFileSync('src/admin/AdminLayout.tsx', code);
    console.log("Patched AdminLayout");
} else {
    console.log("Already patched");
}
