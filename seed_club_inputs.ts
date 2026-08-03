import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import fs from "fs";

const configRaw = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configRaw);

const app = initializeApp(config.firebaseConfig || config);
const db = getFirestore(app, config.firestoreDatabaseId);

const seed = async () => {
    try {
        const docRef = doc(db, 'pages', 'kulup-kayit-formu');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const blocks = data.blocks || [];
            
            let updated = false;
            for (let b of blocks) {
                if (b.type === 'club_registration_form') {
                    if (!b.inputs || b.inputs.length === 0) {
                        b.inputs = [
                            { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'person' },
                            { type: 'text', name: 'studentName', label: 'Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', required: true },
                            { type: 'select', name: 'studentCampus', label: 'Kampüs Seçimi', placeholder: 'Kampüs Seçiniz', required: true, options: 'Eryaman Kampüsü, Oran Kampüsü, Ümitköy Kampüsü' },
                            { type: 'select', name: 'studentClass', label: 'Sınıfı', placeholder: 'Sınıf Seçiniz', required: true, options: '1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf' },
                            { type: 'section_title', label: 'Veli İletişim Bilgileri', icon: 'contact_phone' },
                            { type: 'text', name: 'parentName', label: 'Veli Adı Soyadı', placeholder: 'Örn: Mehmet Yılmaz', required: true },
                            { type: 'tel', name: 'parentPhone', label: 'Telefon Numarası', placeholder: '0(5xx) xxx xx xx', required: true },
                            { type: 'checkbox', name: 'kvkkConsent', label: 'KVKK Aydınlatma Metni\'ni okudum, kişisel verilerimin kulüp kaydı amacıyla işlenmesini onaylıyorum.', required: true }
                        ];
                        b.clubs = [
                            { id: 'spor', label: 'Spor', icon: 'sports_basketball' },
                            { id: 'sanat', label: 'Sanat', icon: 'palette' },
                            { id: 'bilim', label: 'Bilim', icon: 'biotech' },
                            { id: 'muzik', label: 'Müzik', icon: 'music_note' },
                            { id: 'robotik', label: 'Robotik', icon: 'smart_toy' },
                            { id: 'drama', label: 'Drama', icon: 'theater_comedy' }
                        ];
                        updated = true;
                    }
                }
            }
            
            if (updated) {
                await setDoc(docRef, { blocks }, { merge: true });
                console.log("Seeded default inputs for Kulüp Kayıt Formu");
            } else {
                console.log("Already has inputs.");
            }
        }
    } catch(e) {
        console.error(e);
    }
};

seed();
