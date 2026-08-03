import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import fs from 'fs';

// Read config
const configPath = './firebase-applet-config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function fixLists() {
    try {
        // 1. Create page if missing
        const pageRef = doc(db, 'pages', 'on-kayit');
        const pageSnap = await getDoc(pageRef);
        
        let created = false;
        if (!pageSnap.exists()) {
            console.log('Creating /on-kayit page...');
            
            // Read default data
            const defaultDataContent = fs.readFileSync('./src/lib/defaultData.ts', 'utf8');
            // We just need the basic block structure
            const blocks = [
              {
                type: 'pre_registration_form',
                title: 'ÖĞRENCİ ÖN KAYIT FORMU',
                subtitle: 'Lütfen Formu Eksiksiz Doldurunuz.',
                styles: {
                  backgroundColor: '#f6f6f8',
                  headerBgColor: '#002147',
                  cardBgColor: '#ffffff',
                  titlePart1Color: '#1d4eca'
                }
              }
            ];
            
            await setDoc(pageRef, {
                title: 'Öğrenci Ön Kayıt',
                path: '/on-kayit',
                blocks: blocks,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                author: 'admin'
            });
            console.log('Created /on-kayit page.');
            created = true;
        } else {
            console.log('/on-kayit page already exists.');
        }

        // 2. Add to homepage header links and ctaButton
        const homeRef = doc(db, 'pages', 'home');
        const homeSnap = await getDoc(homeRef);
        
        if (homeSnap.exists()) {
            const data = homeSnap.data();
            if (data.blocks) {
                let modified = false;
                const newBlocks = [...data.blocks];
                
                for (let i=0; i<newBlocks.length; i++) {
                    if (newBlocks[i].type === 'header') {
                        if (newBlocks[i].ctaButton && newBlocks[i].ctaButton.label === 'Ön Kayıt Formu') {
                            newBlocks[i].ctaButton.url = '/on-kayit';
                            modified = true;
                        }
                        
                        // Let's also add it to the links if not present
                        if (!newBlocks[i].links) newBlocks[i].links = [];
                        const hasLink = newBlocks[i].links.some((l: any) => l.url === '/on-kayit');
                        if (!hasLink) {
                            newBlocks[i].links.push({ label: 'Ön Kayıt', url: '/on-kayit' });
                            modified = true;
                        }
                    }
                    if (newBlocks[i].type === 'hero') {
                       if (newBlocks[i].buttons && newBlocks[i].buttons.length > 0) {
                           const hasReg = newBlocks[i].buttons.some((b: any) => b.url === '/on-kayit');
                           if (!hasReg) {
                              newBlocks[i].buttons.push({ label: 'Hemen Ön Kayıt Ol', style: 'secondary', url: '/on-kayit' });
                              modified = true;
                           }
                       }
                    }
                }
                
                if (modified) {
                    console.log('Updating home page links...');
                    await updateDoc(homeRef, { blocks: newBlocks });
                    console.log('Updated home page links.');
                }
            }
        }
        console.log('Done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixLists();
