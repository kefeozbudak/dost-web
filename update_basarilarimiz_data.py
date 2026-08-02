import re

with open('src/lib/defaultData.ts', 'a') as f:
    f.write("""
export const defaultBasarilarimizData = [
  {
    type: 'header',
    logoUrl: '/dost-logo-png.png',
    links: [
      { label: 'Kampüslerimiz', url: '#' },
      { label: 'İletişim', url: '#' }
    ],
    showSearch: true,
    ctaButton: { label: 'Ön Kayıt Formu', url: '#' }
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
          'İlk 1000\\'de 15 Öğrenci',
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
        desc: 'Uluslararası Robotik Olimpiyatları\\'nda "En İyi Yazılım" ödülü kazanan ekibimizle gurur duyuyoruz.'
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
""")

print("Appended defaultBasarilarimizData to defaultData.ts")
