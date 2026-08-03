import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import fs from "fs";

const configRaw = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configRaw);

const app = initializeApp(config.firebaseConfig || config);
const db = getFirestore(app, config.firestoreDatabaseId);

const seed = async () => {
    try {
        const docRef = doc(db, 'pages', 'on-kayit-formu');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const blocks = data.blocks || [];
            
            let updated = false;
            for (let b of blocks) {
                if (b.type === 'pre_registration_form') {
                    if (!b.inputs || b.inputs.length === 0) {
                        b.inputs = [
                            { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'school' },
                            { type: 'text', name: 'studentName', label: 'Öğrenci Adı Soyadı', required: true },
                            { type: 'text', name: 'studentTc', label: 'T.C. Kimlik Numarası', required: false },
                            { type: 'text', name: 'studentBirthDate', label: 'Doğum Tarihi', placeholder: 'GG/AA/YYYY', required: false },
                            { type: 'radio', name: 'studentGender', label: 'Cinsiyeti', required: true, options: 'Kız, Erkek' },
                            { type: 'select', name: 'studentGrade', label: 'Başvurulan Sınıf Düzeyi', required: true, options: 'Anaokulu, 1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf' },
                            
                            { type: 'section_title', label: 'Veli Bilgileri', icon: 'person' },
                            { type: 'text', name: 'parentName', label: 'Veli Adı Soyadı', required: true },
                            { type: 'tel', name: 'parentPhone', label: 'Veli Telefon Numarası', required: true },
                            { type: 'email', name: 'parentEmail', label: 'Veli E-posta Adresi', required: false },
                            { type: 'select', name: 'parentRelation', label: 'Yakınlık Derecesi', required: true, options: 'Anne, Baba, Diğer' },

                            { type: 'section_title', label: 'Tercihler', icon: 'list_alt' },
                            { type: 'select', name: 'campus', label: 'İlgilendiğiniz Kampüs', required: true, options: 'Eryaman, Oran, Ümitköy' },
                            { type: 'select', name: 'academicYear', label: 'Başvuru Yapılan Eğitim Dönemi', required: true, options: '2024-2025, 2025-2026' },
                            { type: 'select', name: 'heardFrom', label: 'Bizi Nereden Duydunuz?', required: false, options: 'Sosyal Medya, Arkadaş Tavsiyesi, İnternet Araması, Reklamlar, Diğer' },
                            
                            { type: 'textarea', name: 'notes', label: 'Eklemek İstedikleriniz', required: false }
                        ];
                        updated = true;
                    }
                }
            }
            
            if (updated) {
                await setDoc(docRef, { blocks }, { merge: true });
                console.log("Seeded default inputs for Ön Kayıt Formu");
            } else {
                console.log("Already has inputs.");
            }
        }
    } catch(e) {
        console.error(e);
    }
};

seed();
