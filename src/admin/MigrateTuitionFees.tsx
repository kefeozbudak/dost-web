import { useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function MigrateTuitionFees() {
    useEffect(() => {
        const run = async () => {
            console.log("Running migration...");
            const pagesRef = collection(db, 'pages');
            const snap = await getDocs(pagesRef);
            let migratedCount = 0;
            for (const pageDoc of snap.docs) {
                const data = pageDoc.data();
                if (data.blocks) {
                    let changed = false;
                    const newBlocks = [];
                    for (const block of data.blocks) {
                        if (block.type === 'tuition_fees') {
                            newBlocks.push({
                                id: 'tf_hero_' + Date.now() + Math.random(),
                                type: 'tuition_fees_hero',
                                title: block.title || "2026-2027 Eğitim-Öğretim Yılı Ücretleri",
                                subtitle: block.subtitle || "Dost Koleji olarak, öğrencilerimize sunduğumuz kaliteli eğitim ve olanakların karşılığında belirlenen akademik yıl ücretlendirme detaylarımızı aşağıda inceleyebilirsiniz.",
                                badge: "2026-2027 EĞİTİM YILI",
                                image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
                            });
                            const newTfBlock = { ...block };
                            delete newTfBlock.title;
                            delete newTfBlock.subtitle;
                            delete newTfBlock.badge;
                            delete newTfBlock.image;
                            newBlocks.push(newTfBlock);
                            changed = true;
                        } else {
                            newBlocks.push(block);
                        }
                    }
                    if (changed) {
                        console.log("Migrating page:", pageDoc.id);
                        await setDoc(doc(db, 'pages', pageDoc.id), { ...data, blocks: newBlocks });
                        migratedCount++;
                    }
                }
            }
            console.log("Migration complete. Migrated: " + migratedCount);
        };
        run();
    }, []);
    return null;
}
