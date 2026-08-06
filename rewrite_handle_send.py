import re

with open('src/components/AssistantWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the try block in handleSend.
# Find the start of try { and end of finally { setLoading(false); }

start_idx = content.find('try {\n      let data: any = null;')
end_idx = content.find('} finally {\n      setLoading(false);\n    }\n  };', start_idx) + len('} finally {\n      setLoading(false);\n    }\n  };')

new_logic = """try {
      // Rule-based fallback instead of AI
      const lowerInput = input.toLowerCase();
      let responseText = "Sorunuzu tam olarak anlayamadım. Lütfen hızlı iletişim formunu doldurarak veya aşağıdaki menüden ilgili sayfaları inceleyerek detaylı bilgi alabilirsiniz. [FORM_TEKLIFI]";
      
      const knowledge = ((settings?.knowledgeBase || '') + ' ' + (siteContext || '')).toLowerCase();
      
      if (lowerInput.includes('kampüs') || lowerInput.includes('okul') || lowerInput.includes('şube')) {
        responseText = "Kampüslerimiz: Dost Koleji İstanbul genelinde modern kampüsleri ile eğitim vermektedir. Size en yakın kampüsümüzü öğrenmek veya eğitim kademelerimiz (Anaokulu, İlkokul, Ortaokul, Lise) hakkında detaylı bilgi almak için lütfen 'Kampüslerimiz' sayfasını ziyaret edin veya iletişim formunu doldurun. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('fiyat') || lowerInput.includes('ücret') || lowerInput.includes('kayıt')) {
        responseText = "Kayıt ve ücret bilgileri döneme ve eğitim kademesine göre değişiklik göstermektedir. Detaylı ve size özel bir fiyat teklifi alabilmek için lütfen kayıt formumuzu veya iletişim formumuzu doldurun, ilgili birimimiz size en kısa sürede ulaşacaktır. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('iletişim') || lowerInput.includes('telefon') || lowerInput.includes('adres')) {
        responseText = "Bizimle iletişime geçmek için iletişim sayfamızı ziyaret edebilir veya hızlı iletişim formunu kullanabilirsiniz. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('burs') || lowerInput.includes('sınav')) {
        responseText = "Bursluluk sınavlarımız ve güncel tarihler hakkında bilgi almak için 'Bursluluk Sınavı' sayfamızı ziyaret edebilir veya formu doldurarak detaylı bilgi talep edebilirsiniz. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('merhaba') || lowerInput.includes('selam')) {
        responseText = "Merhaba! Size kurumumuz, kampüslerimiz ve eğitim programlarımız hakkında nasıl yardımcı olabilirim?";
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

new_content = content[:start_idx] + new_logic + content[end_idx:]

with open('src/components/AssistantWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

