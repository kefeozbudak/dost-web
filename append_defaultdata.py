import re

with open('src/lib/defaultData.ts', 'a') as f:
    f.write("""
export const defaultAkademikKadroData = [
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
    type: 'academic_hero',
    title: 'Akademik Kadromuz',
    subtitle: 'Geleceği şekillendiren, alanında uzman ve vizyoner eğitimcilerimizle tanışın.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlAgjnZC1tB91ntcvXHAQj6bMEDDFxqYsxO7CnlkikSRyoYovur1CbSlz6yFgUH6o43KIbSa9m07NZg2bowFJBXjIWuSBPq6j99LBA7C4BZKM6WYyfD6ph-TIl2drPqkuWTl3G1aZcWooy-LZhTo9XBhPBNwBZ-RC2i4NisOD_-nizEBWwBhGwaiBsC_1l6rpqc8TG4N6UVc6wCgg4ee8mfhJSCnZ6iB_6qZMF3uwVjihZg29Tz0iLxi83oi0Plmr5rKRAfxN6_ys',
    styles: {
      overlayColor: 'rgba(0,0,0,0.5)'
    }
  },
  {
    type: 'akademik_kadro',
    sidebarTitle: 'Bölümler',
    sidebarSubtitle: 'Hızlı Navigasyon',
    sidebarItems: [
      { label: 'Tüm Bölümler', icon: 'school', url: '#' },
      { label: 'Bilgisayar Mühendisliği', icon: 'terminal', url: '#' },
      { label: 'Hukuk Fakültesi', icon: 'gavel', url: '#' },
      { label: 'Mimarlık ve Tasarım', icon: 'foundation', url: '#' },
      { label: 'İşletme Fakültesi', icon: 'corporate_fare', url: '#' },
      { label: 'Tıp Fakültesi', icon: 'medical_services', url: '#' },
      { label: 'Fen Edebiyat Fakültesi', icon: 'science', url: '#' }
    ],
    items: [
      {
        title: 'Prof. Dr. Ayşe Yılmaz',
        subtitle: 'Yapay Zeka ve Veri Bilimi',
        desc: 'Uzmanlık alanları arasında derin öğrenme, doğal dil işleme ve bilgisayarlı görü bulunmaktadır.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxg15wPkpjte4mOzE1or7O4e6sBs9QL5fMisx8ey1Ko8K_JLNCanp8Qu3NvklD_jbSYxHWP3Dt85UC2hVWU1jxeIpqBXqhYvpeBODFgWcFZQG9mi6CEyl2-OO_kps68fP4Q46Fxv8-FXFZxAly0zOTZcoU_CsJMRXXMZhwqHhL3IZB4pLZznYvr84y26n8wieDR0O7gz8-kv7otphwihahKzyFTBCR0Oxy4QcOFjvxthQJJh3uAtKNzwyg5KKnuN9RzQg_oV93lzk',
        tag: 'Bilgisayar Müh.',
        tagColor: '#144bb8',
        url: '#'
      },
      {
        title: 'Doç. Dr. Mehmet Demir',
        subtitle: 'Uluslararası Ticaret Hukuku',
        desc: 'Avrupa Birliği hukuk normları ve uluslararası tahkim süreçleri üzerine akademik çalışmaları bulunmaktadır.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_pSMJ1cxWNs71ursL21xk8Wfp3BQ7CEsLW_hhYXqmRN1D3nhzHaIOlF3n0YngQdRGLi5Jqn9RkkHjdqf90SBej_GsHZDuaGiAt3V1gwZzZ1Qx5DzhhMhWY_cN_H4vARFpcjRlOHiiMfjE4s2fSxfANf9fPQetKH1Rtcctpu5BEJPeTzUC5wZonkxKzra2FsqTC1XySgvY8myPeV-GHQZOEPUZYjGckHvFRcHEH4vsZJ77MoEVfFhIHsUT9c5Pd8P5in5dAx8dI5Q',
        tag: 'Hukuk Fakültesi',
        tagColor: '#144bb8',
        url: '#'
      },
      {
        title: 'Dr. Öğr. Üyesi Elif Kaya',
        subtitle: 'Sürdürülebilir Mimari',
        desc: 'Ekolojik tasarım ve enerji verimliliği sağlayan yapı teknolojileri konusunda uzmanlaşmıştır.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATK7QNUL4UyqE-JEaIorBpD0NtGr2GukjusQAbUbmgd4azNLSyLamCHC5fgIF_KQKBaHa9mfUiXbAdixSWKdfo72JyBm7_igevVvQ7Uaf4Ks1aePBGUfx-Tu4fGsHrbIj0eb2xUZ7rMso0tSQAo6n6QmC3aBmj3-A6ASqmIQwlgbBgTfXO0BNCElBCzMB_Kgg41hexYhRKN3Z_HdEEsipLDNEw69AMXEyB9df7KFxyUAatRDKikXAh3Qz-M4g-PRlCkB8yi3bHKFo',
        tag: 'Mimarlık Fakültesi',
        tagColor: '#144bb8',
        url: '#'
      },
      {
        title: 'Prof. Dr. Ahmet Şahin',
        subtitle: 'Stratejik Yönetim',
        desc: 'Organizasyonel değişim ve küresel rekabet stratejileri üzerine odaklanmaktadır.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWQB_0eZlgidUxdOnHTl1TbuNSVPdATkFZw2C86UkQAJo1OjCNZZ8HM06YoOGyVx5kicCyDewCJpP7q-lhwYsqi1c_ezCgqj9yL46q_GP8ke_ftW2UDjdVvr7vu5962UCnEewdH3qiuWnMPDpR-862DTr227euufVQGI4lDnfco3xMcVfe-Vx4IAEtbZMguG1F9lokV8PQjylB4D6ByGId0g02j-1K_OjcOdBFqdn8MPCQbTikbxEiNaShbdlUU3tvFK6eZuEp3To',
        tag: 'İşletme Fakültesi',
        tagColor: '#144bb8',
        url: '#'
      },
      {
        title: 'Doç. Dr. Sibel Aydın',
        subtitle: 'Moleküler Biyoloji',
        desc: 'Kanser genetiği ve kişiselleştirilmiş tıp üzerine yenilikçi çalışmalar yürütmektedir.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7lFRem2q_fCSSvo3LoZXSoknGU9tGZtzXncr3vfTifLPZzWVnuc4sKfunnDvvS4mYl34PaW5DLDNVKIvQhssXRn8L_qmaXWvZQhA3ZKCZvy16fjQuDKMVZpZjGiDDLdIhuoWWUqNLNZnBWoECSHrf-mNvt_Pa4SXfamm_VDPf27kK0MhnF8zZ_ohYZgbISogCnaNDhVPDu755ufQUPhsPzhHsLQIIxXO3OWhjjL3q1wKEW8-gYRHHKB1HThQk1iSLeeFJX-p6ykQ',
        tag: 'Tıp Fakültesi',
        tagColor: '#144bb8',
        url: '#'
      },
      {
        title: 'Dr. Kerem Can',
        subtitle: 'Bulut Bilişim',
        desc: 'Mikroservis mimarileri ve dağıtık sistemler güvenliği üzerine uzmanlaşmıştır.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNg2kDM54P_ffJoP1WEBV8PASuUbtnMKyi9zfaInloGTnZ4Z8uNabJuInz64cjJq6Hn4fHL0sKjSmoCfaFOX_b6rpAo6o_OrJgKYnhcz9YGdbB_Wk7mLjPy6ughtZSRqhyatpVvQwwfEfuLCOqx1rpqspj7tJDWQaRJStiFHJqUv32G0NZmtWVtjAHb3IxSo8M4LfXXok-60YtcOMkIfFYZW0lcbJHFZXrsW-jyg7FvtECclQj6iwpRlAsKoq7_vZlxt-LdAAkCAM',
        tag: 'Yazılım Müh.',
        tagColor: '#144bb8',
        url: '#'
      }
    ]
  },
  {
    type: 'footer',
    logoUrl: '/dost-logo-png.png',
    description: '1995\'ten beri eğitimde mükemmeliyetin adresi.',
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

print("Appended defaultAkademikKadroData to defaultData.ts")
