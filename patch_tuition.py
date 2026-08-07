with open("src/lib/defaultData.ts", "a") as f:
    f.write('''

export const defaultTuitionFeesData = [
  {
    type: "tuition_fees",
    title: "2026-2027 Eğitim-Öğretim Yılı Ücretleri",
    subtitle: "Dost Koleji olarak, öğrencilerimize sunduğumuz kaliteli eğitim ve olanakların karşılığında belirlenen akademik yıl ücretlendirme detaylarımızı aşağıda inceleyebilirsiniz.",
    tableTitle: "Eğitim Kadranları Ücret Tablosu",
    items: [
      {
        title: "Anaokulu",
        icon: "child_care",
        tuitionFee: "120.000 ₺",
        foodFee: "40.000 ₺"
      },
      {
        title: "İlkokul",
        icon: "backpack",
        tuitionFee: "140.000 ₺",
        foodFee: "45.000 ₺"
      },
      {
        title: "Ortaokul",
        icon: "school",
        tuitionFee: "150.000 ₺",
        foodFee: "45.000 ₺"
      },
      {
        title: "Anadolu Lisesi",
        icon: "menu_book",
        tuitionFee: "160.000 ₺",
        foodFee: "50.000 ₺"
      },
      {
        title: "Fen Lisesi",
        icon: "science",
        tuitionFee: "170.000 ₺",
        foodFee: "50.000 ₺"
      }
    ],
    infoBoxTitle: "Önemli Bilgilendirmeler",
    infoBoxContent: "Yukarıda belirtilen ücretlere KDV dahildir.\\nKardeş indirimi %10 olarak uygulanmaktadır.\\nPeşin ödemelerde %5 indirim uygulanır.\\nEğitim materyalleri ve kıyafet ücretleri ayrıca hesaplanacaktır.",
    paymentsTitle: "Ödeme Seçenekleri",
    payments: [
      {
        title: "Peşin Ödeme",
        icon: "payments",
        desc: "Banka havalesi, EFT veya kredi kartı ile tek çekim olarak yapılabilir."
      },
      {
        title: "Taksitli Ödeme",
        icon: "credit_card",
        desc: "Anlaşmalı bankaların kredi kartlarına vade farksız taksit imkanı sunulmaktadır.",
        banks: "Bonus, Maximum, World, Ziraat"
      }
    ]
  }
];
''')
