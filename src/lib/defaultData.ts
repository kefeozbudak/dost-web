export const defaultHomePageData = [
  {
    type: 'header',
    logoUrl: '/dost-logo-png.png',
    links: [
      { label: 'Kampüslerimiz', url: '#' },
      { label: 'Ön Kayıt', url: '/on-kayit' },
      { label: 'İletişim', url: '#' }
    ],
    showSearch: true,
    ctaButton: { label: 'Ön Kayıt Formu', url: '/on-kayit' }
  },
  
  
  
  {
    type: 'hero',
    badge: '',
    titlePart1: 'Geleceği Dostça\n',
    titlePart1Color: '#232b38',
    titlePart2: 'İnşa Ediyoruz',
    titlePart2Color: '#232b38',
    title: '',
    subtitle: 'Modern eğitim yaklaşımları ve köklü değerlerimizle, her öğrencimizin\npotansiyelini zirveye taşıyoruz.',
    items: [
      { title: 'Eryaman Kampüsü', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' },
      { title: 'Oran Kampüsü', image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80' },
      { title: 'Ümitköy Kampüsü', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80' }
    ],
    buttons: [
      { label: 'Hemen Ön Kayıt Ol', style: 'primary', url: '/on-kayit' },
      { label: 'Hemen Başvur', style: 'secondary' }
    ]
  },
  {
    type: 'education_levels',
    title: 'Eğitim Kademelerimiz',
    icon: 'school',
    items: [
      { icon: 'child_care', title: 'Anaokulu', desc: 'Geleceğin temellerini sevgi ve oyunla atıyoruz.', buttonText: 'Detaylı Bilgi' },
      { icon: 'menu_book', title: 'İlkokul', desc: 'Temel eğitim yolculuğunda merak uyandıran keşifler.', buttonText: 'Detaylı Bilgi' },
      { icon: 'groups', title: 'Ortaokul', desc: 'Gelişim ve keşif sürecinde akademik derinlik.', buttonText: 'Detaylı Bilgi' },
      { icon: 'workspace_premium', title: 'Lise', desc: 'Üniversiteye ve hayata güçlü, vizyoner hazırlık.', buttonText: 'Detaylı Bilgi' }
    ]
  },
  {
    type: 'features',
    title: 'Ayrıcalıklı Eğitim Standartları',
    subtitle: 'Neden Biz?',
    items: [
      { 
        icon: 'verified_user', 
        title: 'Akademik Mükemmellik', 
        desc: 'Uluslararası standartlarda müfredat ve alanında uzman eğitim kadromuzla öğrencilerimizi geleceğe en iyi şekilde hazırlıyoruz.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        rowSpan: true
      },
      { icon: 'translate', title: 'Çift Dilli Eğitim', desc: 'İngilizceyi ana dil yetkinliğinde öğrenen, dünya vatandaşı bireyler yetiştiriyoruz.' },
      { icon: 'psychology', title: 'STEM Odaklı Öğrenme', desc: 'Bilim, teknoloji, mühendislik ve matematik odaklı laboratuvarlarımızla inovatif düşünceyi destekliyoruz.' },
      { 
        icon: 'neurology', 
        title: 'Yapay Zeka Destekli Kişiselleştirilmiş Eğitim', 
        desc: 'Her öğrencinin öğrenme hızına ve ilgi alanlarına göre özelleşen dijital öğrenme platformlarımızla başarıyı garantiliyoruz.',
        highlight: true,
        buttonText: 'Detaylı Bilgi'
      }
    ]
  },
  {
    type: 'campuses',
    title: 'Size En Yakın Dost Koleji',
    subtitle: 'Kampüslerimiz',
    viewAllText: 'Tüm Şubeleri Gör',
    items: [
      { title: 'Ümitköy Kampüsü', desc: 'Anaokulu, İlkokul ve Ortaokul kademelerinde doğayla iç içe bir eğitim ortamı.', buttonText: 'İncele', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80' },
      { title: 'Oran Kampüsü', desc: 'Fen ve Teknoloji Lisemiz ile inovatif projelerin merkezi olan modern şehir kampüsü.', buttonText: 'İncele', image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80' },
      { title: 'Eryaman Kampüsü', desc: 'Geniş spor alanları ve sanat atölyeleri ile donatılmış, huzurlu bir kampüs hayatı.', buttonText: 'İncele', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  {
    type: 'video',
    title: 'Eğitimde Geleceğe Bakış: <span class="text-primary">Dost Koleji</span> Tanıtım Filmi',
    subtitle: 'Akademik başarılarımızdan kampüs yaşamına kadar bizi biz yapan değerleri keşfedin. Nitelikli eğitim anlayışımızla tanışın.',
    desc: '<p>Alanında uzman kadromuz, modern eğitim teknolojilerimiz ve öğrenci merkezli yaklaşımımız ile çocuklarımızı sadece akademik başarıya değil, hayata hazırlıyoruz.</p><p>Dost Koleji, sadece bir okul değil, büyük bir ailedir.</p>',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
  },
  {
    type: 'stats',
    title: 'Başarı Bir Gelenektir',
    subtitle: 'Öğrencilerimiz Türkiye\'nin ve dünyanın en saygın üniversitelerine yerleşerek bizleri gururlandırmaya devam ediyor.',
    buttonText: 'Başarı Tablomuzu İnceleyin',
    items: [
      { value: '%100', label: 'YKS Yerleşme Oranı' },
      { value: '450+', label: 'TÜBİTAK Derecesi' },
      { value: '25+', label: 'Ülke Mezun Ağı' },
      { value: '9.5/10', label: 'Veli Memnuniyeti' }
    ]
  },
  {
    type: 'news',
    title: 'Dost\'tan Haberler',
    items: [
      { title: '2024 Bilim ve Sanat Festivali Büyük Bir Coşkuyla Gerçekleşti', desc: 'Kampüslerimizde düzenlenen festivalde öğrencilerimiz yıl boyunca hazırladıkları projeleri ailelerine ve ziyaretçilere sundular.', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80', tag: 'Etkinlik', tagColor: 'bg-primary' },
      { title: 'Robotics Takımımız Dünya Şampiyonası\'ndan Ödülle Döndü', desc: '12 Mayıs 2024', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', tag: 'Başarı', tagColor: 'bg-secondary' },
      { title: 'Yeni Kayıt Dönemi Bilgilendirme Toplantıları Başladı', desc: '08 Mayıs 2024', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', tag: 'Duyuru', tagColor: 'bg-tertiary-container' }
    ]
  },
  {
    type: 'footer',
    logoUrl: '/dost-logo-png.png',
    brandName: 'Dost Koleji',
    brandDesc: 'Dost Koleji, geleceğin liderlerini akademik mükemmeliyet, etik değerler ve modern eğitim yaklaşımlarıyla yetiştirmeyi misyon edinmiş köklü bir eğitim kurumudur. Ankara\'da üç farklı kampüsümüzle eğitimde fark yaratıyoruz.',
    newsletterTitle: 'E-Bülten Kaydı',
    newsletterDesc: 'Gelişmelerden ve etkinliklerimizden haberdar olmak için bültenimize abone olun.',
    newsletterPlaceholder: 'E-posta adresiniz',
    newsletterButtonText: 'Kaydol',
    columns: [
      {
        title: 'Kurumsal',
        links: [
          { label: 'Hakkımızda', url: '#' },
          { label: 'Vizyon & Misyon', url: '#' },
          { label: 'Kurucularımız', url: '#' },
          { label: 'İnsan Kaynakları', url: '#' }
        ]
      },
      {
        title: 'Akademik',
        links: [
          { label: 'Anaokulu', url: '#' },
          { label: 'İlkokul', url: '#' },
          { label: 'Ortaokul', url: '#' },
          { label: 'Fen ve Anadolu Lisesi', url: '#' }
        ]
      },
      {
        title: 'Kampüslerimiz',
        links: [
          { label: 'Ümitköy Kampüsü', url: '#' },
          { label: 'Oran Kampüsü', url: '#' },
          { label: 'Eryaman Kampüsü', url: '#' }
        ]
      }
    ],
    copyright: '© 2024 Dost Koleji. Tüm Hakları Saklıdır.',
    legalLinks: [
      { label: 'KVKK', url: '#' },
      { label: 'Gizlilik Politikası', url: '#' },
      { label: 'Çerez Politikası', url: '#' }
    ]
  }
];



export const defaultHakkimizdaData = [
  {
    type: 'header',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQvGjZIfU8rL4P84C8y4zL1Rj0K4h6V4H9F9S3Y7U0g6I2s9M1c8T5X4k2P5E7M1A9',
    links: [
      { label: 'Ana Sayfa', url: '/' },
      { label: 'Kurumsal', url: '/hakkimizda' }
    ],
    buttonText: 'Kayıt Ol',
    buttonUrl: '#',
    styles: { backgroundColor: '#ffffff', color: '#1a1b23' }
  },
  {
    type: 'about_hero',
    badge: 'Geleceğe Hazırlıyoruz',
    title: 'Eğitimde 25 Yıllık Güven ve Başarı',
    subtitle: 'Dost Koleji, 1998 yılından bu yana akademik mükemmelliği ve karakter gelişimini odağına alarak, yarının liderlerini yetiştirmektedir.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCijzfAHE3wK3ySMb4dMKh0bQRV2MPrugw08hxyIuLqZf5APBZYCRfHXLa0nn4Ha65bWRshepqg3DA-8TK0wR2_OEx2-50bMsyxLR_jcGniF-3PQodeLfOgdHyyLrsHY3Hk9D1zyRk6MgvIWwi46AsUShQllofJp-l0qGkP4z6GotJUpo1aRPbAzhrIyc9kxdIcsKXKq47hY0uVpipX5ZrjHjuR6hddtsOigDbxHaDUlJS0UjPEjFdl',
    buttons: [
      { label: 'Tanıtım Filmi', url: '#', primary: true },
      { label: 'Kampüs Turu', url: '#', primary: false }
    ],
    styles: {
      color: '#ffffff'
    }
  },
  {
    type: 'timeline',
    title: 'Başarı Yolculuğumuz',
    subtitle: 'Çeyrek asırlık tecrübemizle her geçen gün büyüyerek, binlerce öğrencinin hayatına dokunduk.',
    items: [
      {
        year: '1998',
        title: 'Kuruluş',
        desc: 'Eğitim meşalemiz 1998 yılında, modern bir eğitim anlayışıyla ilk kampüsümüzde yakıldı. Kuruluşumuzdan bu yana, her bir öğrencimizin potansiyelini en üst düzeye çıkarmayı hedefleyen bir vizyonla yola çıktık.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFJjPBhGD5Emz2IDfG8Q8sOz1EzdpKJheTaz_hqSEpHaytRqrRbAP8tsig0gu79P4RaDbKCDHkAfvX5Av2y5SfFFzf4vS7RCYkZnnRVNBwgTcU2t6QAQE7M2W2mFPRThYq5OKItW6EcuDepDcitk27W_mYr_bPUvbUWwPNNdBZ3ZtSWETZ7nhNRkb4bllrKr4wWwJZTaHn77XfsyZMbXXUEjwllXuMjEVDOiuZZxEP4283vQAsPZVh'
      },
      {
        year: '2010',
        title: 'Modernizasyon',
        desc: 'Teknolojiyi eğitimle birleştiren ilk akıllı sınıf sistemlerimiz ve modern laboratuvarlarımız devreye girdi. Bu dönemde, bilimsel araştırmalara ve dijital okuryazarlığa verdiğimiz önemi artırarak eğitim kalitemizi uluslararası standartlara taşıdık.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSKV1poAOJy9AacLpe7sziO8S1pQKTxeYi1Yebge1RhJ5aa1RS4qKiDXj_FfU5g89NWnaQ5FQ3zCGQD7w-75HYKu0XEaXAll1_-YBXro48jspXOonRVHp0OE9UQoK_L0zWbJRRPfH0LOJ7fyP_b8cVXFCQoL5WJ_6T7JMHfCFtGNO3WEg_zFmNAPF7CTgebakp1zh2SOIe9RA_eZaDxY66dnKyEUyDOtqdH_fNrqBiqzb6v55JpzC8'
      },
      {
        year: '2024',
        title: 'Bugün',
        desc: '25. yılımızda Türkiye\'nin en saygın eğitim kurumlarından biri olarak binlerce mezunumuzla geleceğe güvenle bakıyoruz. Sürdürülebilir kampüsümüz ve yenilikçi eğitim modellerimizle, yarının dünyasını şekillendirecek liderler yetiştirmeye devam ediyoruz.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYXA-Z-mXEJ2CgDh4MuI3GAEhoTqFRxMZCaveSjnplXbj66pq897E4lbeTv71aX8QlNbStHcEUbjIkqeOT95odmy7Bid23wAZS8qR_oKCy3zguajXGhQbyw_XnycW-pnt9u9RI4dk624p-LELYCixSwGDe4kQWRNJbCR5RQPoCiylK687IBdvDCcu5n9cUpJP-My60-MS9JjSkPde7wx8tnsMbbGfOxgp4WWFsuh1nAxQxPm2XWe8B'
      }
    ]
  },
  {
    type: 'mission_vision',
    items: [
      {
        icon: 'flag',
        title: 'Misyonumuz',
        desc: 'Öğrencilerimizi evrensel değerlerle donatılmış, bilimsel düşünen, özgüveni yüksek ve topluma karşı sorumlu bireyler olarak yetiştirmek; onlara öğrenmeyi sevdiren bir eğitim ortamı sunmaktır.'
      },
      {
        icon: 'visibility',
        title: 'Vizyonumuz',
        desc: 'Uluslararası standartlarda eğitim kalitesiyle tanınan, inovatif yaklaşımları eğitim süreçlerine entegre eden, Türkiye\'nin örnek alınan ve en çok tercih edilen öncü eğitim kurumu olmaktır.'
      }
    ]
  },
  {
    type: 'values',
    title: 'Temel Değerlerimiz',
    subtitle: 'Karakterimizi belirleyen ve bizi biz yapan temel ilkelerimiz.',
    items: [
      {
        icon: 'verified_user',
        title: 'Dürüstlük',
        desc: 'Tüm ilişkilerimizde açıklık, şeffaflık ve etik değerlere bağlılığı esas alırız.'
      },
      {
        icon: 'lightbulb',
        title: 'İnovasyon',
        desc: 'Geleneksel eğitim yöntemlerini modern teknoloji ve yaratıcı yaklaşımlarla harmanlıyoruz.'
      },
      {
        icon: 'favorite',
        title: 'Sevgi',
        desc: 'Eğitimin temelinin sevgi olduğuna inanıyor, öğrencilerimize şefkatle yaklaşıyoruz.'
      },
      {
        icon: 'gavel',
        title: 'Disiplin',
        desc: 'Başarının anahtarı olan öz disiplini, baskıcı değil yol gösterici bir biçimde aşılıyoruz.'
      }
    ]
  },
  {
    type: 'quote_image',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOD_d1rJUx_Jz73WeiEm2hKPVsyhgYIX7xJqpeGD7W2yhF3JlJ_eghXDYFgj4bRUiQ41HUo0oBOTuo7qFSevOF8lLpsit5qhUR8A9RWrRMIMVQrS8UZ_kHynvi3F5IuRJa4PkW070GV7Qisk9TaXPjlN46tviE2685h6XTzLHCn3CMujOEYUGPteJUC_zEbO7SXtW7V2_ZqNnLTZNKGNXhwbvNva0wbl746vPD9lPP7zgRoEg0Au6Z',
    title: 'Kurucumuzdan Mesaj',
    quote: '"Dost Koleji\'ni kurarken hayalimiz, sadece ders notları yüksek değil, hayat başarısı yüksek, vicdanı hür bireyler yetiştirmekti. 25 yıldır bu hayali gerçeğe dönüştürmenin gururunu yaşıyoruz. Eğitim bir gönül işidir ve biz bu yolda tüm paydaşlarımızla el ele yürümeye devam edeceğiz."',
    authorName: 'Dr. Ahmet Yılmaz',
    authorTitle: 'Dost Koleji Kurucusu & Yönetim Kurulu Başkanı'
  },
  {
    type: 'footer',
    companyName: 'Dost Koleji',
    companyDesc: 'Geleceğin liderlerini yetiştiren, yenilikçi ve köklü eğitim kurumu.',
    links: [
      { label: 'Hakkımızda', url: '/hakkimizda' },
      { label: 'Eğitim', url: '#' },
      { label: 'Kabul', url: '#' },
      { label: 'İletişim', url: '#' }
    ],
    social: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' }
    ],
    styles: { backgroundColor: '#1a1b23', color: '#ffffff' }
  }
];





export const defaultBasarilarimizData = [
  {
    type: 'header',
    logoUrl: '/dost-logo-png.png',
    links: [
      { label: 'Kampüslerimiz', url: '#' },
      { label: 'Ön Kayıt', url: '/on-kayit' },
      { label: 'İletişim', url: '#' }
    ],
    showSearch: true,
    ctaButton: { label: 'Ön Kayıt Formu', url: '/on-kayit' }
  },
  {
    type: 'achievements_hero',
    badge: 'BİZİM GURUR TABLOMUZ',
    titlePart1: 'Geleceği İnşa Eden ',
    titlePart2: 'Başarılarımız',
    titlePart2Color: '#D4AF37',
    subtitle: 'Dost Koleji olarak, her öğrencimizin içindeki potansiyeli keşfediyor, akademik mükemmellik ve karakter gelişimiyle harmanlanmış bir başarı yolculuğu sunuyoruz.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDclSWgXGDCdKOXaON8pIof0uJYpf9_sU6BVo6kWpFyj5umBZ2qgknO4mUlLTk5lEPDeIPtwnMcNWawwu-jupdVFCtjYvUMjCO5qND-jER1h5Lq0Z39Y0NqMh9bfT5O6OZml1bZ9P0eVAuJFjYokzeyQUNS3uiR9RFwJq1X7-2fpAoY5yzZLO9hMVZHLouja8_PSRucLdSJuIh3zynUKZY1ypR8TIK2gKp4U8wOatlgLxp3qQQDAL7w',
    buttons: [
      { label: 'Başarı Hikayelerini Keşfet', url: '#', icon: 'arrow_forward', bgColor: '#1d4eca', textColor: '#ffffff' }
    ]
  },
  {
    type: 'achievements_academic_bento',
    title: 'Akademik Mükemmellik',
    items: [
      {
        style: 'light',
        icon: 'school',
        title: 'LGS Başarısı',
        desc: 'Ortaokul kademesinde üstün akademik hazırlık ve sonuç odaklı rehberlik.',
        statValue: '498.4',
        statLabel: 'Puan Ortalaması',
        badge: 'TÜRKİYE BİRİNCİLİĞİ DERECESİ'
      },
      {
        style: 'primary',
        icon: 'star',
        title: 'YKS Başarısı',
        desc: 'Üniversite maratonunda her yıl çıtayı daha yükseğe taşıyoruz.',
        stats: [
          { value: '%98', label: 'Yerleştirme Oranı' },
          { value: '82+', label: 'Tıp & Mühendislik' }
        ],
        buttonText: 'Detaylı Liste',
        url: '#'
      },
      {
        style: 'list',
        icon: 'analytics',
        title: 'Zirve İstatistikleri',
        desc: 'Tüm puan türlerinde kitlesel başarıda rakipsiz performans.',
        listItems: [
          'İlk 1000\'de 15 Öğrenci',
          'Sözel Puan Türünde İl 1.si',
          'Yabancı Dil Ortalaması 78.5'
        ]
      }
    ]
  },
  {
    type: 'achievements_social_gallery',
    title: 'Sosyal ve Kültürel Başarılar',
    subtitle: 'Sadece derslerde değil, hayatın her alanında şampiyonlar yetiştiriyoruz.',
    items: [
      {
        title: 'Basketbol Takımı',
        desc: 'Bölge Şampiyonu',
        hoverText: 'Ankara Gençler Ligi Şampiyonluğu - 2023',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCquMk48tzar5BY8-hU31vpomq_1ywRkTnVHCT7tmNJ3y09lvscPZ-XSgmgu-pAwFSyAYK-hTvKLpYG3p5bGdYXU5kAnkNMYTsiBKh86v9-qkor-Q2-6p4HWumCWT28dv_ei8_P_4CZId5w3orRudJRWztWwnmE_riivyVtgDFJZjSK17GuYagp4UmVNqSJOzWC-_G9mSkidJj5PnY3_pLHF5PHSx1oDaKldA4NX6g7xbYwDAoYbJKt'
      },
      {
        title: 'Müzik ve Sanat',
        desc: 'Piyano Resitali',
        hoverText: 'Uluslararası Chopin Piyano Yarışması 2.liği',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxLNUV3WlC4eUE8UTObvsaMinRPyoTb6y2qhCfg696xHJPwByzqt-VjergyJauRCT0N6kxVWykJ-a55kMmjqHKeQlYtbbAnnCg87OtHnAbpKKJoUIXMugXKl24NoQqBat2ZV90iTh7JriAmgSufymx4XqzFO1Xwd84k-Z2dcguRspdk-7waXzYqvpA2C-Yq1oFfnddtWZp7ERLJJhrX1yZ3NXPsLpUb-GtzVqioIQeUlkJcsl_kJtR'
      },
      {
        title: 'Satranç Kulübü',
        desc: 'Ulusal Dereceler',
        hoverText: 'Ulusal Satranç Turnuvası - Altın Madalya',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyvGuHpk6vq2a3nqr5aGf2mwwSGbQme5tUezV4nbcGKs_mnTjRFY40uQHzdBDjyIW07tfLnkng1FdYDzatshgzq1fY-OoadG0OVz6m04yK22p4di96ue7dosZfSC70va7xLEeAQb9VlUD_la4QFuM5qvMsuhoGnNtoqfhOGkeyPV5MQI-rORmKIKiN608RAPU8Ugg-UOW-_VZ3R94I66CczPTF7p05-vDVlfGE-vZG-a5htIqIaj7d'
      },
      {
        title: 'Yüzme Takımı',
        desc: '12 Altın Madalya',
        hoverText: 'Okullar Arası Yüzme Şampiyonası',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBobthVP908_0_3H1N429YnscOa5GJ8fTUupxfxm5BdpPqYAl_CG6o0BTxorz7G9j779kzKfiKJCBViFtJZSbTWhgughmPE2n65AFTnFZ2w6RjDtugQDEYl0x3PWX9pDpUnqb9G9PAIUA16LrHma-fw7OjA6IIOqSZuNWDaK_jo_dFy5G8pMV3S5RlXZpn3cKuqjCIMUI21zG7LkxWJs5T2Y3xTx0VoDY-csDcgBJ7nYU0-t2CTszip'
      }
    ]
  },
  {
    type: 'achievements_science_projects',
    badge: 'İNOVASYON VE TEKNOLOJİ',
    title: 'Bilim ve Geleceğin Projeleri',
    subtitle: 'TÜBİTAK, Teknofest ve uluslararası bilim olimpiyatlarında Dost Koleji imzası.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnacTnyUQX61YCKJQwBh9JdWSa4m3NGw5Y3XmHNIjBs_UYSf3fscDVJ4q4lFWrhDE6FwGoeKRXssVWsVSYd36h_n6z6HgecJTYV4UQTDFWHrYeFfoHYD7dAQpR20W6RCYXKshGgYYEsr4MTb1JoN-rzw_MulQTTdvc75mc1HwdnLL7a2Ye1bMkDiy_OgFRHbk5lKMUUTpusUtDH6gpJdl7eeQ5Y9sIOPoavRxD2RGM3xsn92-UFHok',
    imageBadge: 'DÜNYA 3.LÜĞÜ',
    items: [
      {
        icon: 'precision_manufacturing',
        title: 'Robotik Kodlama',
        desc: 'Uluslararası Robotik Olimpiyatları\'nda "En İyi Yazılım" ödülü kazanan ekibimizle gurur duyuyoruz.'
      },
      {
        icon: 'science',
        title: 'TÜBİTAK Bölge 1.liği',
        desc: 'Biyoloji alanında sürdürülebilir tarım projemiz Türkiye finallerine kalmaya hak kazandı.'
      }
    ]
  },
  {
    type: 'footer',
    logoUrl: '/dost-logo-png.png',
    description: "1995'ten beri eğitimde mükemmeliyetin adresi.",
    address: 'Eryaman Mah. 123. Sok. Etimesgut/Ankara',
    phone: '+90 (312) 555 00 00',
    email: 'info@dostkoleji.edu.tr',
    socialLinks: [
      { label: 'Instagram', url: '#' },
      { label: 'Twitter', url: '#' },
      { label: 'LinkedIn', url: '#' }
    ],
    links: [
      { label: 'Hakkımızda', url: '/hakkimizda' },
      { label: 'Vizyon & Misyon', url: '#' },
      { label: 'İletişim', url: '/iletisim' }
    ],
    copyright: '© 2024 Dost Koleji. Tüm hakları saklıdır.'
  }
];

export const defaultDuyurularData = [
  {
    type: 'news_hero',
    title: 'Duyurular ve Haberler',
    subtitle: 'Dost Koleji ailesindeki güncel gelişmeleri, akademik başarıları ve yaklaşan etkinlikleri buradan takip edebilirsiniz. Eğitim yolculuğumuzun her adımını sizinle paylaşıyoruz.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Bmxu3AAUzepW3NL7-9gphkAJEtOZxEmh7grfk_qiyTZU8hdTAf0Rb2U8PwvwgpU2mJ3A3JvDoZcNwbUfzCelpbfOFVmAUxZ4V-C8-l0W9IumUSK349bi5G8M0dcjRWdorztXhDLZ8q75-gFEmyDwpbDXDgfGXbC_N5hYnMSIE6nrxhiFzMH5WVqX8LzMlg_avpcvrmfqI9iAAnSZO40YxI0azwPy7IT3Mdl_fWryM4T7kTP19k9S',
  },
  {
    type: 'news_grid',
    showPagination: true,
    categories: [
      { label: 'Tümü' },
      { label: 'Akademik' },
      { label: 'Etkinlikler' },
      { label: 'Duyurular' },
      { label: 'Sanat & Spor' }
    ],
    items: [
      {
        tag: 'Akademik',
        tagColor: 'bg-secondary',
        date: '15 Mayıs 2024',
        title: 'TÜBİTAK Bilim Yarışmasında Büyük Başarı',
        desc: 'Öğrencilerimiz tarafından hazırlanan yapay zeka tabanlı çevre projesi, TÜBİTAK Bölge Yarışmasında birincilik ödülüne layık görüldü.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe6xqScqU2HxFB6TrgNtxc0XkIo6WrtnrVHTW8ohQGaXV1xZpiDDRRA966YHLx1G_AEdHkbYfXz4QfLeO8kTNLwS8SVQEKKk4479Q3VGlKeyQXrBcDmfIHetdzJULPLKkTa4_CoadJmD6KT1T5RdzpF6UEi3JuPyOt8KrOqMQQaFEOwcwD8PX5Uq87ZcTAM70a2S118BvZiKT3ri6YvYn7lmWXr2hnPKKGNuQxTJUnZQJGkzHL6ZU-',
        url: '#'
      },
      {
        tag: 'Etkinlikler',
        tagColor: 'bg-secondary',
        date: '12 Mayıs 2024',
        title: 'Geleneksel Dost Kupası Turnuvası Başlıyor',
        desc: 'Bu yıl 10.sunu düzenleyeceğimiz Dost Kupası Basketbol Turnuvası, çevre okulların katılımıyla heyecan dolu karşılaşmalara sahne olacak.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE6pT6AMzqgskqVB9WNnxORogZMJvEPBrozL1kUhgmm745GtAVzTLsJsnuN8fQDr4wa3gEC4OD5TEsvUnZlhtGl8nQR_IIiD3IxjTqh5D0EQTjFB8s3fhgnn6ImIU927o968n-zfyCG8SyN09UIL9tBfHvmmXSIJ1ukZpPNrw_vxD42JUvQVMNM6znuQPD6KDPJ5efY_QCfwNzL7zXGhJr_Wiy0XhUzcMzME6Mm3J2dEjoj0jidDMZ',
        url: '#'
      },
      {
        tag: 'Duyurular',
        tagColor: 'bg-primary',
        date: '10 Mayıs 2024',
        title: 'Veli Bilgilendirme Seminerleri',
        desc: 'Yeni dönem eğitim modellerimiz ve öğrenci gelişim takip sistemimiz hakkında detaylı bilgilendirme yapacağımız seminerimize tüm velilerimiz davetlidir.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpuUc59kwHCS35masJqTs8rjf5S95T1tnzpxxWGhI943UjvidEbWm6uHSOTGv4O9Pe7PUk50vYirELKLMrqTQ9gkdilad3ogvYk7_v5kyA0yjV7MBvRSk4mCdpgx1ZJ4AdGNPLVDNAMHYOGLuuTNhsyXAhx6IL_4F0yox9DUQ3WC_0k9pQzgyOMGR2gKj_7cUd5UxWQRjwo4JkOxSgGXg2Nbab5-HOiFnmBI4sht8cxH4gAikjKmSG',
        url: '#'
      },
      {
        tag: 'Sanat & Spor',
        tagColor: 'bg-secondary',
        date: '08 Mayıs 2024',
        title: 'Bahar Konseri Hazırlıkları Tam Gaz',
        desc: 'Okul orkestramız ve koromuz, 25 Mayıs\'ta gerçekleşecek olan büyük bahar konseri için provalarını sürdürüyor.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXqFt91fX0wf5lO29SBg_Ww0quKfuLOhZUCl91oDkOulc-ki7Ec5vwcj61Qmds3itrevHMwafqZIv7AXbrxQRa59J1Caq0Kjew9R3VjVt7yNiTWggRbS16DQvLmsXMwLLc8h-olA2w3H4hzMCnNuDj761r51nyfJvR8rUcKlKDHVa5vEFYR9xIlWoDLDHgfzvDiNesCdHLVUFzVyksEQIXpw8Z71qJ1NW3U6q-JH4fSUKduiTsSwXP',
        url: '#'
      },
      {
        tag: 'Akademik',
        tagColor: 'bg-secondary',
        date: '05 Mayıs 2024',
        title: 'Kütüphane Kaynaklarımız Genişliyor',
        desc: 'Dijital kütüphane veri tabanımıza eklenen yeni bilimsel yayınlar ve e-kitaplar ile akademik kaynaklarımızı zenginleştirmeye devam ediyoruz.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsJr-RTEcP-lLbbqCi6hInHVBDSB5dAyXWF_cioPeUctSMyVx_HV1pGgY58hxELKSpqDopaeMO7JqXbtFaAT_Mqqa99-IKRNga0CYhM5D_v2aq6GpfljPsfkJqVROiuQRzI9ZwTsO03tk4SQM5d_FTt-isDnfV8qUsPdws01Tn9BrSFHVWJkUB4pJhluYSAa_vjZrCcb6l5LKIdeqgUb2B6pKHg0fyUlMdP-MC0MZjTAz0B-La-4bG',
        url: '#'
      },
      {
        tag: 'Duyurular',
        tagColor: 'bg-primary',
        date: '01 Mayıs 2024',
        title: 'Yaz Dönemi Kurs Kayıtları',
        desc: 'Yaz aylarını verimli geçirmek isteyen öğrencilerimiz için düzenlenen spor ve sanat okulu kayıtlarımız başlamıştır.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLXXk5BMaLvflgDA9MImcxpv6fq8YGYxrEr_YmTcrSPfevBexGmWQpeAf37_ve71bTK2IKiie5A48S09c8UJjnSVb2o0EEyCYLmok_WjFxf0bFlQYiTwubl0UWf_5DWdOiCLQmbRRzi6U75Tmt1N6Rw35WvnQeRCEsObgLw7wvWNA8Ifry8LG5kuY3NeDhLhoEPjPd_pPAazldWTixRfztPlv1q70aruEtj8p3HyjSmMA0Kc5a6UFS',
        url: '#'
      }
    ]
  },
  {
    type: 'newsletter',
    icon: 'mail',
    title: 'Duyurulardan Haberdar Olun',
    desc: 'Haftalık bültenimize abone olarak okulumuzdaki en güncel haberleri ve etkinlikleri e-posta adresinize alabilirsiniz.',
    inputPlaceholder: 'E-posta adresiniz',
    buttonText: 'Abone Ol',
    caption: 'Kayıt olarak Gizlilik Politikamızı ve KVKK metnini kabul etmiş sayılırsınız.'
  }
];

export const defaultPreRegistrationData = [
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

export const defaultScholarshipPageData = [
  {
    type: "bursluluk_hero",
    badge: "2026-2027 EĞİTİM YILI",
    title: "Akademik Başarıya Giden Yolunuz",
    subtitle: "Geleceğin liderlerini yetiştiren Dost Koleji'nde yerinizi ayırtın. Bursluluk sınavımıza katılarak %100'e varan eğitim desteği fırsatlarından yararlanın.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { value: "16-17 Mart", label: "Sınav Tarihi" },
      { value: "4-11. Sınıflar", label: "Katılımcı Seviyesi" },
      { value: "%100'e Varan", label: "Burs İmkanı" }
    ],
    styles: {
      backgroundColor: "#002147",
      color: "#ffffff"
    }
  },
  {
    type: "bursluluk_exam_form",
    title: "Bursluluk Sınavı Başvuru Formu",
    subtitle: "Lütfen aşağıdaki bilgileri eksiksiz ve doğru bir şekilde doldurunuz.",
    styles: {
      backgroundColor: "#faf8ff"
    }
  },
  {
    type: "bursluluk_info_cards",
    title: "Sınav Bilgilendirmeleri",
    subtitle: "Sınav süreci, gerekli belgeler ve değerlendirme kriterleri hakkında detaylı bilgi alabilirsiniz.",
    items: [
      {
        icon: "history_edu",
        title: "Sınav Kuralları",
        rules: [
          "Sınav saatinden 30 dk önce okulda olunmalıdır.",
          "Kalem, silgi ve su öğrenci tarafından getirilir."
        ]
      },
      {
        icon: "content_paste",
        title: "Gerekli Belgeler",
        rules: [
          "Nüfus Cüzdanı veya Kimlik Kartı aslı.",
          "Sistemden alınan Sınav Giriş Belgesi."
        ]
      },
      {
        icon: "insights",
        title: "Puanlama",
        rules: [
          "4 yanlış 1 doğruyu götürmektedir.",
          "Sonuçlar sınavdan 1 hafta sonra açıklanır."
        ]
      }
    ],
    styles: {
      backgroundColor: "#ffffff"
    }
  },
  {
    type: "bursluluk_result_query",
    title: "Sınav Sonuç Sorgulama",
    subtitle: "Aşağıdaki butona tıklayarak sınav sonuç sorgulama sayfasına ulaşabilirsiniz.",
    buttonText: "SINAV SONUCUNU ÖĞREN",
    buttonUrl: "#",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    styles: {
      backgroundColor: "#e2e1ec"
    }
  }
];

export const defaultScholarshipConfirmationPageData = [
  {
    type: "bursluluk_confirmation",
    successIcon: "check_circle",
    titlePart1: "Başvurunuz Başarıyla ",
    titlePart1Color: "#002147",
    titlePart2: "Alındı!",
    titlePart2Color: "#002147",
    title: "Başvurunuz Başarıyla Alındı!",
    subtitle: "Sınav giriş belgeniz aşağıda oluşturulmuştur. Lütfen sınav günü yanınızda bulundurunuz. Belgenizi indirip yazdırarak sınava getirmeyi unutmayınız.",
    documentTitle: "Bursluluk Sınavı Giriş Belgesi",
    documentLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcW18movsC69qnz9zpsbzsrJLWPy_Geo5sAAAi9nqoC0YE-bdMj0AiEUe-Z78NoFFBpFQy5UuXaMmRO0quff6khOovxlJfE1ptuTa38PqzHcJhVeJMUlPxZqHhxVw08UApxaSzgRKctOtlTu4DtjMgzPIZdZ0WMLs8KuA96cHwv2jaeSc1OpVg0rX0eqzr2iTpWL0N0C_Y9PkoQ7IeERePRqYH46NNAxWyoW03nr17RN7GXuwfevi2RYWTPiQtM4pg9fysMIgmkuk",
    documentNoPrefix: "BELGE NO: ",
    rules: [
      "Sınav başlamadan 30 dk. önce salonda hazır bulununuz.",
      "İlk 30 dk. ve son 15 dk. salondan çıkmak yasaktır.",
      "Optik formda kodlamaları kurşun kalemle yapınız."
    ],
    requiredDocuments: [
      "Nüfus Cüzdanı veya Kimlik Kartı",
      "Sınav Giriş Belgesi"
    ],
    campusAddresses: {
      eryaman: "Şehit Osman Avcı Mh. Malazgirt 1071 Cad. No:20 Eryaman / Etimesgut / Ankara",
      oran: "Oran Mh. Rafet Canıtez Cd. No:8 Çankaya / Ankara",
      umitkoy: "Ümitköy Mh. 2432. Cd. No:18 Çankaya / Ankara"
    },
    buttons: [
      { label: "İndir (PDF)", action: "download", style: "primary", icon: "download" },
      { label: "Yazdır", action: "print", style: "outline", icon: "print" }
    ],
    styles: {
      backgroundColor: "#f6f6f8",
      cardBgColor: "#ffffff"
    }
  }
];


export const defaultEgitimSistemiData = [
  {
    type: "edu_system_hero",
    title: "Eğitim Sistemimiz: Geleceğe Güvenle Hazırlıyoruz",
    subtitle: "Öğrencilerimizi sadece akademik olarak değil, sosyal, duygusal ve fiziksel olarak da destekleyen bütüncül (holistik) ve öğrenci odaklı bir eğitim modeli uyguluyoruz.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXrfv9nG993CiDepWkpLVnJsyr4V4H0omhGEazGnoozOFIBn416oFqVDB0cU2KMjZ42WLGbfxzwGkfZpQB7RDZU2nFk6r0Fp-P8_EpALDAsjOzJHSwfSFekrpfepwCYUqWG1JJjcVg9rT4GSdexOGAcEsZnaVtgQft5ukI1hgqV4oaWwSUZ6m8mrcmxvj_9faGCMhX5JcOze8sYGkCVEgCW0So_2_F8TpGVXCuwJASLPt9t0rS8TSw",
    image_posX: "50",
    image_posY: "50",
    image_scale: "100"
  },
  {
    type: "edu_system_levels",
    title: "Eğitim Kademelerimiz",
    items: [
      {
        icon: "child_care",
        title: "Anaokulu",
        desc: "Oyun temelli öğrenme ile çocukların merak duygusunu besleyerek ilköğretime sağlam bir temel atıyoruz.",
        buttonText: "Detaylı Bilgi",
        url: "#"
      },
      {
        icon: "school",
        title: "İlkokul",
        desc: "Temel akademik becerilerin yanı sıra, karakter eğitimi ve değerler eğitimini merkeze alarak birey olma yolculuğunu destekliyoruz.",
        buttonText: "Detaylı Bilgi",
        url: "#"
      },
      {
        icon: "local_library",
        title: "Ortaokul",
        desc: "Liselere geçiş sınavlarına (LGS) profesyonel hazırlık sürecini, yoğun dil eğitimi ve kulüp faaliyetleriyle zenginleştiriyoruz.",
        buttonText: "Detaylı Bilgi",
        url: "#"
      },
      {
        icon: "account_balance",
        title: "Lise",
        desc: "Üniversite hedeflerine yönelik yoğun akademik program, kariyer danışmanlığı ve uluslararası geçerliliği olan sertifika programları sunuyoruz.",
        buttonText: "Detaylı Bilgi",
        url: "#"
      }
    ]
  },
  {
    type: "edu_system_yadep",
    title: "YADEP: Yaşam Becerileri ve Değerler Eğitimi",
    subtitle: "Öğrencilerimizi sadece sınavlara değil, hayata hazırlayan özgün programımız.",
    items: [
      {
        icon: "psychology",
        title: "Eleştirel Düşünme",
        desc: "Bilgiyi sorgulama, analiz etme ve bağımsız fikirler üretebilme yetkinliği kazandırılır."
      },
      {
        icon: "schedule",
        title: "Zaman Yönetimi",
        desc: "Öğrenciler, önceliklendirme ve planlama becerileriyle verimli çalışma alışkanlıkları edinir."
      },
      {
        icon: "favorite",
        title: "Duygusal Zeka",
        desc: "Empati kurma, kriz yönetimi ve sağlıklı iletişim becerileriyle güçlü karakter inşası desteklenir."
      }
    ]
  },
  {
    type: "edu_system_philosophy",
    badge: "Pedagojik Felsefemiz",
    title: "Öğrenci Odaklı Eğitim Felsefesi",
    desc: "Her öğrencinin öğrenme hızı, ilgi alanları ve yetenekleri farklıdır. Bu bilinçle, standartlaşmış kalıplar yerine, her bireyin potansiyelini en üst düzeye çıkaracak kişiselleştirilmiş yaklaşımlar benimsiyoruz.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiIc6awQpL3bVLsx7HUW7LAV6Is3Ys8NSNkcy59GGWgLaFiHU7BuvUjE3W0_Q6BpQw5jmtD7KM__i88i9ce-GrN8JLIQiiXxqaVd2c9Vm6pWKB8UKyWxLaatni_MGolw8vhxtABCIR4-FZlTBzPMi_B5a16-jJhBQc6CJSZ96pAyLXZPy9ydJBFEPJ1jhObunc_PtMYK_ySR7Ivtsy6dgw91uc_5IWsS6lZcegAbP8ji_jOrA1xNVG",
    image_posX: "50",
    image_posY: "50",
    image_scale: "100",
    cardIcon: "emoji_events",
    cardTitle: "Ödüllü Yaklaşım",
    cardDesc: "Modern eğitim standartlarına tam uyum sağlayan yenilikçi müfredat.",
    items: [
      {
        icon: "psychology",
        title: "Bireyselleştirilmiş Takip",
        desc: "Düzenli akademik ve psikolojik değerlendirmelerle öğrencinin gelişimini adım adım izliyor, ihtiyaçlarına özel destek programları oluşturuyoruz."
      },
      {
        icon: "rocket_launch",
        title: "Girişimci Ruh",
        desc: "Öğrencilerimizi proje bazlı çalışmalar, atölyeler ve kulüpler aracılığıyla inovatif düşünmeye ve problem çözmeye teşvik ediyoruz."
      },
      {
        icon: "diversity_1",
        title: "Sosyal Duygusal Öğrenme",
        desc: "Empati, öz-farkındalık, iletişim becerileri ve zorluklarla başa çıkma gibi 21. yüzyıl yaşam becerilerini müfredatımızın merkezine koyuyoruz."
      }
    ]
  },
  {
    type: "edu_system_cta",
    title: "Okulumuzu Daha Yakından Tanımak İster misiniz?",
    desc: "Eğitim felsefemiz, kampüs olanaklarımız ve kayıt süreçlerimiz hakkında detaylı bilgi almak için bizimle iletişime geçin veya e-kataloğumuzu inceleyin.",
    buttons: [
      {
        label: "Tanışma Randevusu Al",
        url: "#",
        icon: "calendar_month"
      }
    ]
  }
];
