import re

with open('src/components/AssistantWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('try {\n      // Rule-based fallback instead of AI')
end_idx = content.find('} finally {\n      setLoading(false);\n    }\n  };', start_idx) + len('} finally {\n      setLoading(false);\n    }\n  };')

new_logic = """try {
      const lowerInput = input.toLowerCase();
      let responseText = "Sorunuzu tam olarak anlayamadım. Lütfen hızlı iletişim formunu doldurarak veya aşağıdaki menüden ilgili sayfaları inceleyerek detaylı bilgi alabilirsiniz. [FORM_TEKLIFI]";
      
      const knowledge = ((settings?.knowledgeBase || '') + ' ' + (siteContext || '')).toLowerCase();
      
      // Kayıt, Ücret, Fiyat
      if (lowerInput.includes('fiyat') || lowerInput.includes('ücret') || lowerInput.includes('kayıt') || lowerInput.includes('ne kadar') || lowerInput.includes('taksit')) {
        responseText = "Kayıt ve ücret bilgileri döneme, eğitim kademesine ve kampüse göre değişiklik göstermektedir. Detaylı ve size özel bir fiyat teklifi alabilmek için lütfen iletişim formumuzu doldurun, kayıt birimimiz size en kısa sürede ulaşacaktır. [FORM_TEKLIFI]";
      } 
      // Kampüs, Konum, Adres
      else if (lowerInput.includes('kampüs') || lowerInput.includes('okul') || lowerInput.includes('şube') || lowerInput.includes('nerede') || lowerInput.includes('adres') || lowerInput.includes('konum') || lowerInput.includes('hangi semt')) {
        responseText = "Dost Koleji, Ankara genelinde modern kampüsleri ile eğitim vermektedir. Size en yakın kampüsümüzü öğrenmek ve adres bilgilerine ulaşmak için menüden 'Kampüslerimiz' sayfasını inceleyebilir veya formu doldurarak konum bilgisi talep edebilirsiniz. [FORM_TEKLIFI]";
      } 
      // Eğitim Kademeleri (Anaokulu, İlkokul, Ortaokul, Lise)
      else if (lowerInput.includes('anaokulu') || lowerInput.includes('ilkokul') || lowerInput.includes('ortaokul') || lowerInput.includes('lise') || lowerInput.includes('kademe') || lowerInput.includes('yaş')) {
        responseText = "Okulumuzda Anaokulu, İlkokul, Ortaokul ve Lise kademelerinde bütünsel bir eğitim modeli uygulanmaktadır. Her yaş grubunun fiziksel ve bilişsel gelişimine uygun, modern eğitim metotları kullanıyoruz. Detaylı bilgi için menüden ilgili eğitim kademesini seçebilir veya formu doldurabilirsiniz. [FORM_TEKLIFI]";
      } 
      // Yabancı Dil
      else if (lowerInput.includes('yabancı dil') || lowerInput.includes('ingilizce') || lowerInput.includes('almanca') || lowerInput.includes('dil eğitimi')) {
        responseText = "Yabancı dil eğitimimiz anasınıfından itibaren başlamakta olup, öğrencilerimize yoğun ve pratik odaklı bir İngilizce eğitimi (ve kademeye göre ikinci yabancı dil) sunulmaktadır. Uluslararası standartlarda dil sertifikasyonu ve çift dilli eğitim (Bilingual) sistemimiz hakkında detaylı bilgi için lütfen bize ulaşın. [FORM_TEKLIFI]";
      } 
      // Bursluluk Sınavı
      else if (lowerInput.includes('burs') || lowerInput.includes('sınav') || lowerInput.includes('indirim')) {
        responseText = "Bursluluk sınavlarımız ve başarı indirimlerimiz hakkında güncel tarihler ve başvuru koşullarını öğrenmek için 'Bursluluk Sınavı' sayfamızı ziyaret edebilir veya formu doldurarak doğrudan kayıt birimimizden bilgi talep edebilirsiniz. [FORM_TEKLIFI]";
      } 
      // Yemek, Yemekhane, Beslenme
      else if (lowerInput.includes('yemek') || lowerInput.includes('beslenme') || lowerInput.includes('kantin') || lowerInput.includes('menü') || lowerInput.includes('kahvaltı')) {
        responseText = "Okulumuzda öğrencilerimizin sağlıklı gelişimi için diyetisyen onaylı, organik ve taze ürünlerden oluşan günlük yemek menüleri sunulmaktadır. Hijyen standartlarının en üst düzeyde tutulduğu yemekhanelerimizde sabah kahvaltısı, öğle yemeği ve ikindi kahvaltısı (kademeye göre) verilmektedir.";
      } 
      // Ulaşım ve Servis
      else if (lowerInput.includes('servis') || lowerInput.includes('ulaşım') || lowerInput.includes('güzergah')) {
        responseText = "Ankara'nın birçok noktasına güvenli ve modern okul taşıtlarımızla servis hizmeti sunmaktayız. Servis güzergahları ve ücretleri hakkında bulunduğunuz konuma özel bilgi almak için lütfen iletişim formumuzu doldurun. [FORM_TEKLIFI]";
      } 
      // Sosyal Kulüpler ve Etkinlikler
      else if (lowerInput.includes('kulüp') || lowerInput.includes('sosyal') || lowerInput.includes('etkinlik') || lowerInput.includes('spor') || lowerInput.includes('sanat') || lowerInput.includes('müzik')) {
        responseText = "Öğrencilerimizin akademik başarılarının yanı sıra sosyal, kültürel, sanatsal ve sportif yönden de gelişmelerini önemsiyoruz. Kodlamadan satranca, müzikten spora kadar birçok alanda zengin kulüp etkinliklerimiz bulunmaktadır. Kulüpler sayfasından tüm etkinliklerimizi inceleyebilirsiniz.";
      } 
      // İletişim
      else if (lowerInput.includes('iletişim') || lowerInput.includes('telefon') || lowerInput.includes('numara') || lowerInput.includes('e-posta') || lowerInput.includes('mail') || lowerInput.includes('ulaş')) {
        responseText = "Bizimle iletişime geçmek için iletişim sayfamızı ziyaret edebilir, telefon numaralarımızdan bizi arayabilir veya hızlı iletişim formunu kullanarak size geri dönüş yapmamızı sağlayabilirsiniz. [FORM_TEKLIFI]";
      } 
      // Çalışma Saatleri ve Ders Saatleri
      else if (lowerInput.includes('saat') || lowerInput.includes('zaman') || lowerInput.includes('giriş') || lowerInput.includes('çıkış') || lowerInput.includes('ders saati')) {
        responseText = "Eğitim ve mesai saatlerimiz kademelere ve kampüslere göre farklılık gösterebilmektedir. Güncel giriş-çıkış saatleri ve etüt zamanları hakkında net bilgi almak için iletişim formumuz aracılığıyla bize ulaşabilirsiniz. [FORM_TEKLIFI]";
      } 
      // Öğretmen ve Eğitim Kadrosu
      else if (lowerInput.includes('öğretmen') || lowerInput.includes('kadro') || lowerInput.includes('eğitmen') || lowerInput.includes('akademik')) {
        responseText = "Dost Koleji akademik kadrosu, alanında uzman, yenilikçi eğitim yaklaşımlarını benimsemiş ve sürekli mesleki gelişim eğitimleri alan tecrübeli eğitimcilerden oluşmaktadır. Eğitmenlerimizle tanışmak ve eğitim kadromuz hakkında bilgi almak için kampüslerimizi ziyaret edebilirsiniz. [FORM_TEKLIFI]";
      }
      // Merhaba, Selam
      else if (lowerInput.includes('merhaba') || lowerInput.includes('selam') || lowerInput.includes('iyi günler') || lowerInput.includes('günaydın')) {
        responseText = "Merhaba! Size Ankara Dost Koleji kampüslerimiz, kayıt şartlarımız ve eğitim programlarımız hakkında nasıl yardımcı olabilirim?";
      }

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking delay

      let isForm = false;
      if (responseText.includes('[FORM_TEKLIFI]')) {
        responseText = responseText.replace('[FORM_TEKLIFI]', '').trim();
        isForm = true;
        openQuickContact();
      }

      setMessages(prev => [...prev, { role: 'assistant', text: responseText, isForm }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Hata oluştu. Lütfen tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };"""

if start_idx != -1:
    new_content = content[:start_idx] + new_logic + content[end_idx:]
    with open('src/components/AssistantWidget.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated successfully")
else:
    print("Could not find try block")
