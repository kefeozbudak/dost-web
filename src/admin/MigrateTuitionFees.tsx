import { useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, withTimeout } from '../lib/firebase';

export default function MigrateTuitionFees() {
    useEffect(() => {
        const run = async () => {
            console.log("Running hero cleanup...");
            try {
                const pagesRef = collection(db, 'pages');
                const snap = await getDocs(pagesRef);
                for (const pageDoc of snap.docs) {
                    const data = pageDoc.data();
                    if (data.blocks) {
                        let heroCount = 0;
                        let changed = false;
                        const newBlocks = [];
                        for (const block of data.blocks) {
                            if (block.type === 'tuition_fees_hero') {
                                heroCount++;
                                if (heroCount === 1) {
                                    newBlocks.push(block);
                                } else {
                                    changed = true;
                                }
                            } else {
                                newBlocks.push(block);
                            }
                        }
                        if (changed) {
                            console.log(`Cleaning up duplicated heroes for page: ${pageDoc.id}`);
                            await withTimeout(setDoc(doc(db, 'pages', pageDoc.id), { ...data, blocks: newBlocks }), 15000);
                        }
                    }
                }
                console.log("Hero cleanup complete.");
            } catch (err) {
                console.error("Cleanup failed:", err);
            }
        };
        run();
    }, []);

    return null;
}
