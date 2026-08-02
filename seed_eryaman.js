import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp, config.firestoreDatabaseId);

async function run() {
  const blocks = [
    {
      type: "campus_hero",
      title: "Eryaman Kampüsü'nde Geleceği Tasarlıyoruz",
      subtitle: "Akademik mükemmeliyet, teknolojik donanım ve sosyal gelişim odaklı eğitim modelimizle Eryaman'ın kalbinde yarının liderlerini yetiştiriyoruz.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCENV3uuYAcGePhyS4QghYnKZRbrcx_lXh25us2v0JTXtBiFVRHI0RC4LB6GABrCOLtD51u4rU827ZLY_VjpYckCjSKW31X5hnuzEZC24U8O7GVbk4B9W4YJEfZadq6UHYFmswDWjy0JpqU2q6iX4GzFfUCdLR12nzYloIoWH06mY8C2BdZvCnjUoaznNdwq5fp9INzDUtHWPuGbnUogmfTofqPvh-_HY5rFOzJlNiDgzQx7v9CuIziunnPnghyoUwrGRGqaa-q8bA",
      buttons: [
        { label: "Kampüsü Gezin", icon: "arrow_forward", url: "#" }
      ]
    },
    {
      type: "campus_bento",
      title: "Eğitim Kademelerimiz",
      items: [
        {
          title: "Anaokulu",
          desc: "Merak eden, sorgulayan ve oyunla öğrenen mutlu çocuklar.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbAOHPKfo-D3eKt25IbOwRMK3Bq7mjZbTZB4DtC_1Ni6jsGOY2uOvVfFp7Cj5SldBNGCZ4683tk2Z7AMznWHQ7_YB-cpwyEEsSXEmrwFj8_2zaIEGZl_wlMMLpAqMiFvCOXXLoiBD2IkIRQhLwhXAVlVtRt6NezCLDOe4tYkDKyQITdws2RG0OgMYBlh6TMiLhiX0Mm78JXbMnaMElK2YbQ4-DuYEP6nBx7DaHR_3XlzTyMVhV67OqM3lhfxRozmns3cYGSejmvl4",
          colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
        },
        {
          title: "İlkokul",
          desc: "Temel yetkinliklerin kazanıldığı, akademik başarının ilk adımları.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfZJQCRKQw1O2yDT-s82vscJFnHa4lmqy7rPlmSrUmpe66GTAQA8Sbkf5XI4skkbmKF3XHttWwdJ1kO8uSNBnIr3qfEXqHSSznhZEZTwWNS86wXF0kGOsYlOekN34q5aIjEvsPOd8liCiwusPD4QeEi1RV2yWadTZlQPocxZGR5mgEpmoAkjWmcArNOKN_gD4hB8ALby8gWG6rOnZAPctpbohk8DiHQsFpmmFxYWCcnU-YyUzaKaDEmGJEItudFLr3jsnqCbJdHgQ",
          colSpan: "col-span-12 md:col-span-6 lg:col-span-8"
        },
        {
          title: "Ortaokul",
          desc: "LGS hazırlık süreci ve derinlemesine akademik uzmanlaşma.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD66MqdxvBs_1TmioSEWgSOb21lERmWoYX1wNpvXCDX5zbYa-rNLS11I1XJCbEP8Pv-Q-4bZw76nPC07PKQzFFpw3rNPkPoS-It6lO_qAzGmEvu_ppPflVzt0v4_YcOvirwmUEddSdD-c3AgZzvIy5216Yz2FvCH6XWBXhoRdMyyJKJTB87ERrWmt5tXzwITb2ihnnhgrp-QJcRAdqrG9qw-RXeTHQ-GFschnzXYmLChcGfm_mq5kJbTqpGOnuq6rOEeGVgNDoL1Y4",
          colSpan: "col-span-12 md:col-span-6 lg:col-span-8"
        },
        {
          title: "Lise",
          desc: "Üniversite hedeflerine giden yolda profesyonel rehberlik.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcLHNXXijfsdYkHgnxr8HROjM-MtU-qOSB2i3v_X7gMS0WO4pgyIu9WsI7mLS7kS4Q5x7o04Z9G6h5zGtSqDHN-oY4kpbHE2INsGEiUy8p6RSt_x8igYxFoxYYitPu17fbyy17Yy0xN9ObczKIbhDWIeCYYNS6ailvDK_rR3040lpUQF1HWdohWKsL9diZ2-AK2Xq0DvkP3clPFTBpexT1ZsiGsSO21HhF8QrSlJyllkoalDOIw6nEHL7QRD8fiFdVW92RQECOEM0",
          colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
          styles: { backgroundColor: "#747685" }
        }
      ]
    },
    {
      type: "campus_gallery",
      title: "Modern Eğitim Tesisleri",
      subtitle: "Eryaman Kampüsümüz, öğrencilerimizin her türlü ihtiyacını karşılayan son teknoloji donatılara sahiptir.",
      items: [
        {
          title: "Fen Laboratuvarı",
          desc: "Teorik bilgileri pratiğe dönüştüren tam donanımlı laboratuvarlar.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvi5y6dFgIDBAnvhUjMRN5KQ_AYhqSBzn7znQYqF3lc1ZiWGGG2qdy3G2RD6-d4g9f78LkGP5aVSzmhcKl_aFgOv2v0lnktnmsq93_I7-DZFVDLvEWk2eMYhsKLySlBS3gJA0QQ1Ra6SnGTi4uzjxtLahXwcwxG5VDl9WUWOiBoKZXLBFKNXavDM4FFxQ6WFU4yEIdvz4j1mU6wrtZfk2XZzCIOP_fgXNAC9zA4iGha8xgkyle8x5O43m9pVcA9bY06Ng_IufLYlw"
        },
        {
          title: "Spor Salonu",
          desc: "FIBA standartlarında parke zemin ve çok amaçlı antrenman alanları.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBizFQIbpbUGFlEgKpslrytAz_BNFDzl5nTmnaG3da1gSsiMWu7euVFXRRzoyfPIwEyitP5mlyRhn1-5yYnxnXE0B7TfnMNvMcVqWO6W6XUtSZewhGGHYAvzdtIuHpvuiQb1cd1OZysuTsMc_RGZ5RFUdcsKRIepi9oIdCPBq2_IWv5MI9nEauqNO9-IAqn7ZfiG_LgPtkTlZBlINT-si9fDhgeoiIDnnuykiVkBuif3p6LU2xKlKv-r-C5cfl36YmHo_nKxE-LRE0"
        },
        {
          title: "Kütüphane",
          desc: "Binlerce kaynak ve dijital yayınla sessiz çalışma alanları.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_-UVcFwd-YB6ZWtIVDtX4UOhhKkbPBOa58F5eMbqb5ExBnDdVWkqO9yscIFlxNCpylxdknByCsR0OLqVhytFnjqXtD9Fh0dsavaCVaGHsYL76zMmpdFoLXmP1S3GgR4cn32EqZ9digRbZKM3uCmtuANoshnNMzr82bTdHxxsyLxT_EN-rl5bZthJ-HVBcB_1H4eRlIJYchy1oCnGdgckovHkrklYmyBldqXTYNbtBeomPb-UMdtpmpqM_88fw1Vr4OUOaf1ijhm0"
        },
        {
          title: "Yemekhane",
          desc: "Diyetisyen onaylı menülerle sağlıklı ve hijyenik beslenme.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbKJGT_PMW6D8PpKY7vRd--6Fiaba_XLUX1jg_lYV5aVCuFKPf6zlHMx6m3wav2aWOOpLxHEVVjxoyIeDq10JMVLuSByrSWhz72xYKwPpdUAIsNO9U-Tl71SW2MhWTrpjIWxKrsoUGAn3aQ_Atjr8I9wf64TddFo6lKGKOhfjdBVvnEDUQ3Du4uUBcROYFtzONaXu_4vhy4f-8v3dlK_UicBDudrtYTxZ6uw1W46IApGBysGIJrZhDOG1FfcFWjLo8Lzoz0EQAbTs"
        }
      ]
    },
    {
      type: "campus_life",
      badge: "Kampüs Yaşamı",
      titlePart1: "Sadece Eğitim Değil,",
      titlePart2: "Bir Yaşam Alanı",
      subtitle: "Eryaman Kampüsümüzde öğrencilerimiz sadece derslerle değil, spor, sanat ve teknoloji kulüpleriyle de kendilerini geliştirirler. Her öğrencinin potansiyelini keşfedeceği özel alanlar yarattık.",
      image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3vWde0-mA9cnuMXtiTE0wWeS7Isjum_ED-UKzWzjExarDJgwZHZfgimBFRUBR0DGjh_2m2L_14iCQM6gi6X6H5UNSpADfYt3FbWxCw0fjaGRwxg1hgU9rB9cV6di0m7wcrlcVVP0zS_9b7HhQa9Yq54DUk1MBnbIXZ6wzg3sFYnMlciTqHrRDVwbk2rI7udhcAx6Noz31mFf8Sptvdzfm2rzvcSlMqDQfLtsdpqeIlTyXvs4rcn2lMw5k6SG2iaAF0PdIi-Tr2sQ",
      image2: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHp4NQd5u6AbF3F1HlP1_VBB-QGyda97kr2LJWvOqdR4NxCkdqF14J2gFHHTfugHpAjO4KKPRp65Jk-Fs4sHM9wNP5a_nuxgYWWwWEYg35jda2XS3VN6ZdIYyyE_XT6wwYeQXIptGQSVkSWRTExa5XDiDwQifJexvRzlqpUyqu1QEEhycdigg1iA1_7dkuf_mbYDM8AjNQecWemRTRSvfxiN4LhB2ep5ByKYCIgVnoux35q-M5Hgklteis1XIpLh5Dej7DydT1Yyo",
      image3: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6rTPhNG8dqjq6WMexmk_GTaFdFrC65N_YwuDpRWpXcD-M8gLRcRRN2F21dqxsHGkad0CPmO1qbHmn_d19mCs_3l0fZKU80YBYDtaUPA7ODsZ0WXzh4voJobAVlM8f62eidB-SiQJ3k0T9avBhKe4BmSz1l7zJqwFlYHBL5wNbN3cvZXm5yNNNHfw6Xo4QauLrDGDMX7cAcA-BY0EGT27SQ4Kfdctqq4N1d4VUrtHbVKV2EHyUnkoLJmBDdjUrG6CFU0hp-fNlIQw",
      image4: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyyZ9ThPJAsvglLKDD5zG18Ds3HIOSi4w7LRds6OUl-o0zy5oKY73tSWeRYNb2dQ3k3Nh-mpOInNn-7vjxlpWPUzwKb3eblyRRySDZQlz2Ly9AmB0JZS3vmbWJTEDvByu-WTjO-xAJ9KKR7F_EQlbo6HGssPSVLAhGnMN1V0zGd1ZJwocksDZHPS7l0e7MjEvVYiiKFMlLkzrPZDMgFtvSQH9PycOKcLK-lAOFyf57pO2cxd2elL98UDZl4SyuGA6ADeGTKsz8PcI",
      items: [
        { icon: "star", title: "50'den Fazla Sosyal Kulüp Seçeneği" },
        { icon: "language", title: "Çift Dilli Eğitim ve Yurt Dışı Programları" },
        { icon: "health_and_safety", title: "7/24 Güvenlik ve Tam Donanımlı Revir" }
      ],
      buttons: [
        { label: "Hakkımızda Daha Fazlası", style: "primary", url: "/hakkimizda" }
      ]
    },
    {
      type: "campus_contact",
      title: "Bizimle İletişime Geçin",
      items: [
        { icon: "location_on", title: "Adres", desc: "Eryaman Mahallesi, 2432. Cadde No:12, Çankaya/Ankara" },
        { icon: "phone_iphone", title: "Telefon", desc: "+90 (312) 235 00 00" },
        { icon: "mail", title: "E-Posta", desc: "eryaman@dostkoleji.k12.tr" }
      ],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkKjDl8hKnRsD977wNLvelGBR33nsDcj41qT-RfzwEx9xv14aRd5_5KLoKp3nIR10NXF_2M8mBkXfkojp7acuAhqH--o7LoddN4w3Zb413CQXRyfUGQ3i1lZrTKb5sPOjPZq1SlEE2MtsU4JaafQTD63-QOwL7g5u2PttFKtcTv8RT10jxHJ0JGXgTflRwVRONzrmXXby3MqUUi1BGhIpUhY1ZUgcB56pUdn0wbnri00VP9fqRoPuijpQY76xj8Ghp4e4J0ZykhtI",
      cardTitle: "Eryaman Kampüsü",
      cardDesc: "Eryaman Mahallesi, 2432. Cadde No:12, Çankaya/Ankara",
      buttons: [
        { icon: "directions", url: "#" }
      ]
    }
  ];

  await setDoc(doc(db, 'pages', 'eryaman-kampusu'), { 
    isDeleted: false,
    isHidden: false,
    path: '/eryaman-kampusu',
    status: 'published',
    title: 'Eryaman Kampüsü',
    blocks: blocks 
  });
  console.log("eryaman-kampusu added");
  process.exit(0);
}

run().catch(console.error);
