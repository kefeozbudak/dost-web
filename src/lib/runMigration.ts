import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const runLibraryMigration = async () => {
  try {
    const pageRef = doc(db, "pages", "kitap-kutuphanesi");
    const pageSnap = await getDoc(pageRef);
    
    if (!pageSnap.exists()) {
      await setDoc(pageRef, {
        title: "Kitap Kütüphanesi",
        path: "/kitap-kutuphanesi",
        blocks: [
          {
            id: "lib-1",
            type: "hero",
            data: {
              title: "Kitap Kütüphanesi",
              subtitle: "Öğrencilerimiz için zengin basılı ve dijital kaynaklar.",
              image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            }
          },
          {
            id: "lib-2",
            type: "text",
            data: {
              content: "<h2>Kütüphanemiz Hakkında</h2><p>Okulumuz kütüphanesi, 10.000'i aşkın basılı kitap ve dijital yayınlara erişim imkanı sunmaktadır.</p>"
            }
          }
        ],
        isDeleted: false,
        isHidden: false
      });
      console.log("Kitap Kütüphanesi sayfası eklendi.");
    }

    const headerRef = doc(db, "settings", "header");
    const headerSnap = await getDoc(headerRef);
    if (headerSnap.exists()) {
      const headerData = headerSnap.data();
      const links = headerData.links || [];
      
      let iletisimMenu = links.find((l: any) => l.label === "İletişim");
      if (!iletisimMenu) {
        iletisimMenu = { label: "İletişim", url: "/iletisim", type: "dropdown", subLinks: [] };
        links.push(iletisimMenu);
      }
      
      if (!iletisimMenu.subLinks) iletisimMenu.subLinks = [];
      iletisimMenu.type = "dropdown";
      
      const hasLib = iletisimMenu.subLinks.find((sl: any) => sl.url === "/kitap-kutuphanesi");
      if (!hasLib) {
        iletisimMenu.subLinks.push({ label: "Kitap Kütüphanesi", url: "/kitap-kutuphanesi" });
        await setDoc(headerRef, { links }, { merge: true });
        console.log("Kitap Kütüphanesi menüye eklendi.");
      }
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
};
