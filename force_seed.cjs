const fs = require('fs');

const code = `
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const defaultCareerPageData = [
  {
    type: 'career_hero',
    title: 'Dost Koleji\\'nde Kariyer',
    subtitle: 'Geleceği birlikte inşa edelim.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80'
  },
  {
    type: 'career_benefits',
    items: [
      {
        title: 'Sürekli Gelişim',
        desc: 'Eğitim sektöründe sürekli eğitim, atölye çalışmaları ve mesleki gelişim fırsatları ile personelimize yatırım yapıyoruz.',
        icon: 'lucide:GraduationCap'
      },
      {
        title: 'Kurumsal Güven',
        desc: 'Dürüstlük ve istikrar temeli üzerine kurulmuş, güvenebileceğiniz güvenli ve şeffaf bir çalışma ortamı sunuyoruz.',
        icon: 'lucide:Shield'
      },
      {
        title: 'Huzurlu Ortam',
        desc: 'Kampüslerimiz hem öğrenciler hem de personel için refah, işbirliği ve uyumlu bir atmosferi teşvik etmek üzere tasarlanmıştır.',
        icon: 'lucide:Leaf'
      }
    ]
  },
  {
    type: 'career_application',
    title: 'İş Başvurusu',
    items: [
      { title: 'Sınıf Öğretmeni', type: 'Tam Zamanlı', dept: 'İlkokul' },
      { title: 'İngilizce Öğretmeni', type: 'Tam Zamanlı', dept: 'Ortaokul' }
    ]
  }
];

async function seed() {
  try {
    const docRef = doc(db, 'pages', 'is-basvurusu');
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        await setDoc(docRef, {
            title: "İş Başvurusu",
            path: "/is-basvurusu",
            isDeleted: false,
            isHidden: false,
            blocks: defaultCareerPageData,
            createdAt: Date.now()
        });
        console.log("Seeded is-basvurusu");
    } else {
        console.log("Already exists");
    }
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
seed();
`;
fs.writeFileSync('seed_script.js', code);
