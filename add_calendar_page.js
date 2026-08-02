import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const pageData = {
  title: "Akademik Takvim",
  path: "/akademik-takvim",
  isHidden: false,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [
    {
      type: "academic_calendar_hero",
      title: "Akademik Takvim",
      subtitle: "Eğitim yılı boyunca planlanan tüm akademik süreçler, etkinlikler ve tatil günlerini buradan takip edebilirsiniz.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGeDhmxi6eGoiaKbOF7NbrDSb2MQ6OqKXaU-OdM_o5Kbajfku6cS4fJ_y_5HHzXJ2X238GcmI_ysoLm-EJRMfmWj138UP95t1E9Mvig7fo77nKodwWuOpneiHEO9Dt6ytm9wa74zm-5njZRvSsU-NfAmROGrO0XdlZgYifeTDR2F8FduL7MjwuhvlXT0zLt9bJPf7e65zOpSh7jWXQpIKbwyFizWSAQH0BF7Ttmis_rwtITX68bzMZmfksjYzKNq2jI52hL-hz_sY"
    },
    {
      type: "academic_calendar",
      month: "Ekim 2023",
      pdfUrl: "#",
      pdfButtonText: "PDF İndir",
      days: [
        { date: "25" }, { date: "26" }, { date: "27" }, { date: "28" }, { date: "29" },
        { date: "30", isWeekend: true }, { date: "1", isWeekend: true },
        
        { date: "2", isCurrentMonth: true },
        { date: "3", isCurrentMonth: true },
        { date: "4", isCurrentMonth: true, eventTitle: "Veli Toplantısı", eventColorClass: "bg-secondary-fixed text-on-secondary-fixed-variant border-secondary/20" },
        { date: "5", isCurrentMonth: true, isToday: true },
        { date: "6", isCurrentMonth: true },
        { date: "7", isCurrentMonth: true, isWeekend: true },
        { date: "8", isCurrentMonth: true, isWeekend: true },
        
        { date: "9", isCurrentMonth: true, eventTitle: "Sınav Haftası", eventColorClass: "bg-error-container text-on-error-container border-error/20" },
        { date: "10", isCurrentMonth: true, eventTitle: "Sınav Haftası", eventColorClass: "bg-error-container text-on-error-container border-error/20" },
        { date: "11", isCurrentMonth: true, eventTitle: "Sınav Haftası", eventColorClass: "bg-error-container text-on-error-container border-error/20" },
        { date: "12", isCurrentMonth: true, eventTitle: "Sınav Haftası", eventColorClass: "bg-error-container text-on-error-container border-error/20" },
        { date: "13", isCurrentMonth: true, eventTitle: "Sınav Haftası", eventColorClass: "bg-error-container text-on-error-container border-error/20" },
        { date: "14", isCurrentMonth: true, isWeekend: true },
        { date: "15", isCurrentMonth: true, isWeekend: true },
        
        { date: "16", isCurrentMonth: true },
        { date: "17", isCurrentMonth: true, eventTitle: "Okul Gezisi", eventColorClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20" },
        { date: "18", isCurrentMonth: true },
        { date: "19", isCurrentMonth: true },
        { date: "20", isCurrentMonth: true, eventTitle: "Kulüp Etkinlikleri", eventColorClass: "bg-primary-fixed text-on-primary-fixed-variant border-primary/20" },
        { date: "21", isCurrentMonth: true, isWeekend: true },
        { date: "22", isCurrentMonth: true, isWeekend: true },
        
        { date: "23", isCurrentMonth: true },
        { date: "24", isCurrentMonth: true },
        { date: "25", isCurrentMonth: true },
        { date: "26", isCurrentMonth: true },
        { date: "27", isCurrentMonth: true },
        { date: "28", isCurrentMonth: true, isWeekend: true },
        { date: "29", isCurrentMonth: true, isWeekend: true, bgColor: "bg-green-50", eventTitle: "29 Ekim Cumhuriyet Bayramı", eventSubtitle: "(Resmi Tatil)", eventColorClass: "bg-green-100 text-green-800 border-green-200" }
      ],
      legends: [
        {
          icon: "edit_document",
          iconBgClass: "bg-error-container",
          iconColorClass: "text-on-error-container",
          title: "Sınav Takvimi",
          desc: "Dönem içi ortak sınav tarihleri ve deneme sınavı programlarına detaylı olarak buradan ulaşabilirsiniz.",
          buttonText: "Sınav Programı",
          url: "#"
        },
        {
          icon: "groups",
          iconBgClass: "bg-primary-fixed",
          iconColorClass: "text-on-primary-fixed-variant",
          title: "Sosyal Etkinlikler",
          desc: "Öğrencilerimizin gelişimini destekleyen kulüp faaliyetleri, okul gezileri ve seminer programları.",
          buttonText: "Etkinlik Detayları",
          url: "#"
        },
        {
          icon: "event_available",
          iconBgClass: "bg-green-100",
          iconColorClass: "text-green-800",
          title: "Resmi Tatiller",
          desc: "Milli ve dini bayramlar, ara tatiller ve sömestr tatili tarihlerinin tam listesini inceleyin.",
          buttonText: "Tatil Günleri Listesi",
          url: "#"
        }
      ]
    }
  ]
};

async function run() {
  await setDoc(doc(db, 'pages', 'akademik-takvim'), pageData);
  console.log("Successfully added Akademik Takvim page to Firestore.");
  process.exit(0);
}

run().catch(console.error);
