import re

with open('src/lib/defaultData.ts', 'a') as f:
    f.write("""
export const defaultYonetimKadrosuData = [
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
    type: 'management_hero',
    title: 'Yönetim Kadromuz',
    subtitle: 'Dost Koleji\\'nin vizyoner liderliğiyle geleceğe yön veren yönetim ekibimizle tanışın.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIuSTVShiqhfw9FWk75uEicIOs31dgoHnoLWXqNd8QqcbpPaI5P7HhKGoDrFs5P5dEpHsXI6WEy3SJJnCgsD1tnhhb6Y72uNTBujW5rEhxaBi3iVesDrNUDbMIoOTzI0LYD55_AgB9mow5DewAVnewUFMmKsOE9Z7UJ4Rh2vEJAqdsZ8dWgVf_eFq4utDfl26tGUX9F3hGDOmK-d9NFZBajz-GZEcfHst2pMY0geHpZdSLQsXSR3-pFnCVVG7Gvr1RndKvQ_Rrv4',
    styles: {
      overlayColor: 'rgba(15, 23, 42, 0.6)'
    }
  },
  {
    type: 'management_rector',
    title: 'Rektör',
    icon: 'school',
    badge: 'Rektörlük Makamı',
    name: 'Prof. Dr. Ahmet Yılmaz',
    role: 'Rektör',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKTONd7JEOuklV7iRD6B3-VBGMo_WIRUEdCr7Bb9nfJhH7rbsxjCZVWdSvQoX8m9t4jZvQKHcqsYnDAmxbablI6YkikYT8i1tNZNY0uhmBWI9WI-MnaybqJgQPu1LI-jED04nvEF3K9s8C8fFBWIxDaQyLsYcEIqxMUpo8So8ZaFfwgCNE8E67hpbiMzaYpBMtlAa3xvJ9-4ulw7-ypfCqLzHhwveSU2PzSpJXUaHK96Uma3nNbP5r3k_beFJzbA1R_ecbvNuMU-w',
    quote: '"Geleceğin dünyasını inşa ederken bilimin ışığında, evrensel değerlerle donatılmış bireyler yetiştirmek en büyük önceliğimizdir. Araştırma odaklı kampüsümüzle Türkiye\\'nin gelişimine katkı sağlamaya devam edeceğiz."',
    buttons: [
      { label: 'Rektörün Mesajı', url: '#', icon: 'arrow_right_alt', style: 'primary' },
      { label: 'Akademik Özgeçmiş', url: '#', style: 'outline' }
    ]
  },
  {
    type: 'management_vice_rectors',
    title: 'Rektör Yardımcıları & Genel Sekreter',
    icon: 'groups',
    items: [
      {
        badge: 'Eğitim-Öğretim',
        name: 'Prof. Dr. Ayşe Kaya',
        role: 'Rektör Yardımcısı',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVIkHgBSKTOsA4xfKB-ngw-sExLjZOWolwbSMec6BqMkH62vjZfD-Ry0ouGM0T-PB7Ns7lYhX53HkZLEAkfVfCa_EsNU5AbaW70P1PVRQwfk6PtgA7LXYIip1UN5FQJxYML3syxniIu2hcDd-9HYHfYs_iARtbpvR-lHhrVkZgX7BrlEhwJqi26UeAdx0Ild72I0eUW6FmHjmgD8SPGLOp6o36owdnlxPto2d66rqDl7K2V4LRhseXnYNb92xVVoC_w6A7O1yK_Tk',
        url: '#',
        buttonText: 'Detaylı Profil'
      },
      {
        badge: 'Araştırma ve Geliştirme',
        name: 'Prof. Dr. Mehmet Demir',
        role: 'Rektör Yardımcısı',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT1cRkPCgYDQchbDgvolbxhN9pqRrwPdD4TM1kK6-mLwQYmG0V59T2SV82_HB6sPhh2DdxJAQ4GlL2x3y7u6vJmH3W-t59Tk7kHs4PfYxNbffSAD0k5PuMLN4voqllKvfvxScYETNA8Rg_FEn89pJ0d2D_3UnKwyib01C3MOcu75tgR11YHYSwbXpbH5WjbMLKqykIoFlzP2Cxzys5fyMIVYmma_FAItIV62w78z1uL4Cc6PS3Gw67627nK89ds4wzfRQRDld44qI',
        url: '#',
        buttonText: 'Detaylı Profil'
      },
      {
        badge: 'İdari İşler',
        name: 'Dr. Caner Özcan',
        role: 'Genel Sekreter',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHuVqqcHOuQO_1bUMKtWew_Ms9vGGVCTi91jAPk78lQHb6HsvW9nqz6nAeQj7d65_OMoMr6OYe3AsX5DSX5dlJaFhUvxrQ5f7Wpd15Sqdc68Z1NYNVHKxH6myN4wEqT1JKDV4YmuP6oSI8CreP379tad0FEHyQv6G7yd10QLOXUSLLuMBerx7VuKv0glAyvep5BvuKvKB0WhwIODJCbQTyeQofw1NQ7nqy5kulB1K6MSAdEP0LP0eu0HQXfDybFpkLIzDp76orhXE',
        url: '#',
        buttonText: 'İdari Birimler'
      }
    ]
  },
  {
    type: 'management_deans',
    title: 'Fakülte Dekanları',
    subtitle: 'Akademik Birimler',
    icon: 'account_balance',
    items: [
      {
        badge: 'Mühendislik Fakültesi',
        name: 'Prof. Dr. Elif Sönmez',
        role: 'Dekan',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuXkjrawd2uK9-nb7Dqvfa_pI8k89bfZ5U8pxGXgSY5rfM1bKatQoiKJh5YiC8y_NQojEi-vOHFKAOI_hzyyQxq9PjRKUEbtp4ABI31kaUcrA6rXj88-_OU73wfArk9YzYjJ5jvcgHTWGErypUQ4mjg6uPgpqFgXti7Tm9Z8cic5KJ5sLy6RNJDTdTmF1ynfqge9ovF1DInioaiW5v702LSZSt5YOFXXp34wd8oFwtcVlh0YyzppW7TOce5OehiuH-aeUto_wOzq8',
        url: '#',
        buttonText: 'Fakülte Sayfası'
      },
      {
        badge: 'Tıp Fakültesi',
        name: 'Prof. Dr. Murat Aksu',
        role: 'Dekan',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JB9S3AxN3A21mAXBYIQiq6Cqa52A00uHdFOTm3dPqoy2ckLgcUJqicAxujjnIN8MYowKFPnA5zeSXRRNCToD7mKVurRKqkxQ_lFDWZOL-6kSf2i1pVBDw_NiT4jlsUvckGX7vVvsPQ9FWlEzDdC-RQ4f9z1hTCsHrIHSuI9uQEqkqE4YBFxGyyYd9KtV4FTTTUiACOjU0VZxaUk5oYk-JKAyQNPHY4zlqb3JM9p5yLUnnEDCvaRbY05j-IFrT-wtU2LvLhTzWNs',
        url: '#',
        buttonText: 'Fakülte Sayfası'
      },
      {
        badge: 'Hukuk Fakültesi',
        name: 'Prof. Dr. Kerem Bulut',
        role: 'Dekan',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaCU3PgLoSoMxx5fAXlLY8akhVCzJl8ScEc9Fort97QvIvyqpgp-CkTuUNWMCmmWS7spJ9pd33JVQ6W00RJGroBmvHdxcRy7ZZKO20BjX17ql5LhTpKTIXqUHMQbhqR8ZWRA9JD5L2D0Dl-bAtkVB8LeRyQhzNFFMhLCMQl6LYarGc2jq4EdzuvOccmAEK4kjsndqCigMoaVRK_cqz4OVVQcW6Fkpc9gn33g3sBI4oTsu8joQej9xETySh1Tk8-wIWAGASERB4yU8',
        url: '#',
        buttonText: 'Fakülte Sayfası'
      },
      {
        badge: 'Fen-Edebiyat Fakültesi',
        name: 'Prof. Dr. Selin Tekin',
        role: 'Dekan',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA3LBOaxW4ft2bW0HKcQQYan7Mxe02ekufvYLLrDLOzMLOvghYJ10JsaCU7kWbklLT0QBxBBJll_h33X16raYEnjqMxRY6MVxpOEY0BAZ2J51UDSUMDhbIfCyyTSeby0hdNHgEpYHZVznAQ4eW0HA_Q1wDco4lz0LmxSdtkMKyxyIkZ4LLEYU2UnH_TZI5zpdy0JS7j2FR8FXLwzHd-ygBNLuZ9xaVC7ptKmsDFH3dxR-zJBrS3UyH61OGkEWogX7F5vJBYLpGE6E',
        url: '#',
        buttonText: 'Fakülte Sayfası'
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

print("Appended defaultYonetimKadrosuData to defaultData.ts")
