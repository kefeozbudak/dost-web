const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const blocks = [
  {
    type: 'career_hero',
    title: 'Dost Koleji\'nde Kariyer',
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
    titlePart1: 'Dost Koleji',
    titlePart2: 'İş Başvurusu',
    subtitle: 'Lütfen Formu Eksiksiz Doldurunuz.'
  }
];

async function seed() {
  try {
    await setDoc(doc(db, "pages", "is-basvuru-formu"), {
      title: 'İş Başvurusu',
      path: '/is-basvuru-formu',
      isDeleted: false,
      isHidden: false,
      blocks: blocks,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }, { merge: false });
    
    // In case they had old is-basvurusu, also set it
    await setDoc(doc(db, "pages", "is-basvurusu"), {
      title: 'İş Başvurusu',
      path: '/is-basvuru-formu',
      isDeleted: false,
      isHidden: false,
      blocks: blocks,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }, { merge: false });

    console.log("Seeded successfully to correct DB");
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}
seed();
