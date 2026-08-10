import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export const openKvkkModal = () => {
  window.dispatchEvent(new Event("open-kvkk-modal"));
};

const KvkkModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-kvkk-modal", handleOpen);
    return () => window.removeEventListener("open-kvkk-modal", handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl relative">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed space-y-4">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Kişisel Verilerin İşlenmesine İlişkin Web Sitesi Aydınlatma Metni</h3>
          <p>
            <strong>Kişisel Veri Talep Etme Amacımız</strong><br/>
            Web sitemize erişim esnasında bazı menülerde işlem yapılabilmesi için tarafınızdan bir takım kişisel verilerinizi sisteme girmeniz istenmektedir. Bu verilerin sizden talep edilme amacı, Merkezimize danıştığınız hususlar konusunda tarafınıza dönüş yapabilmektir.
          </p>
          <p>
            Bu kapsamda tarafınızdan istediğimiz kişisel veriler şunlardır:<br/>
            Bize Ulaşın Bölümü için: Adınız, soyadınız, telefon numaranız, e-posta adresiniz.
          </p>
          <p>
            <strong>Kişisel Verilerinizin Korunma Esasları ve Paylaşılma Sınırları</strong><br/>
            Tarafınızdan talep edilen sınırlı sayıdaki kişisel veriler, Kişisel Verilerin Otomatik İşleme Tabi Tutulması Karşısında Bireylerin Korunması Sözleşmesi (108 Sayılı Avrupa Konseyi Sözleşmesi), Avrupa İnsan Hakları Sözleşmesinin 8. Maddesi, Anayasa’nın 20. Maddesi, 6698 sayılı Kişisel Verilerin Korunması Kanunu hükümleri ile veri koruma politikamız çerçevesinde kullanılacak, korunacak ve işlenmesi gereken sebeplerin ortadan kalkması halinde silinecektir. Bu kapsamda verileriniz edindiğimiz tarihten itibaren 10 yıl sürelerle saklanacak, süre bitiminde tarafımızca imha edilecektir.
          </p>
          <p>
            Edindiğimiz kişisel verilerinizin iletilmesi yönünde kamu kurumlarından, adli mercilerden ve diğer resmi makamlardan gelen talepler;
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Talebin 108 sayılı Sözleşmeye ve Avrupa İnsan Hakları Sözleşmesinin 8. Maddesine uygunluğu,</li>
            <li>Kanuni açık bir zorunluluğa dayanıp dayanmadığı,</li>
            <li>Demokratik bir toplumda gerekli olma koşullarını taşıyıp taşımadığı,</li>
            <li>Talebin amacının hukuka uygun ve meşru olup olmadığı, bunun somut biçimde ortaya konup konamadığı, talep edilen veriler ile ulaşılmak istenen amacın örtüşüp örtüşmediği, belirtilen amaca ulaşmanın tek yolunun tarafınıza ait verilerin anonimleştirilmeden iletilmesi olup olmadığı,</li>
          </ul>
          <p>
            Unsurları yönünden değerlendirilecek, bu unsurların tamamını sağlamayan veri iletme talepleri yerine getirilmeyecektir. Sayılan unsurların tamamını taşıyan bir veri talebi karşısında, tarafınıza ait verilerin iletilmesi zorunluluğu doğabilecektir.
          </p>
          <p>
            Bunun dışında edinilen verileriniz, tarafınızın açık rızası olmaksızın 3. gerçek ve tüzel kişilerle/kurumlarla paylaşılmayacak ve aktarılmayacak, bu verilere tarafımızdan talep ettiğiniz hizmeti yerine getirebilmek için zorunlu olan hallerle sınırlı olmak üzere ilgili çalışanlarımız ulaşabilecektir. Eğer talep ettiğiniz hizmetin sunulabilmesi verinizin yurt dışına aktarılmasını gerektiriyor ise, tarafınızdan açık rıza alınacaktır.
          </p>
          <p>
            <strong>Haklarınız</strong><br/>
            Verilerinize ilişkin, başta Kişisel Verilerin Otomatik İşleme Tabi Tutulması Karşısında Bireylerin Korunması Sözleşmesi (108 Sayılı Avrupa Konseyi Sözleşmesi), Avrupa İnsan Hakları Sözleşmesinin 8. Maddesi, Anayasa’nın 20. Maddesi, 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini, işlenen verilerinizin kapsamını öğrenme,</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi alma, bu verilere erişme ve bunlardan örnek alma,</li>
            <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını, Yurt içinde veya yurt dışında 3. bir kişiye ya da kuruma aktarılıp aktarılmadığını öğrenme, kişisel verilerinizde meydana gelen değişikliklerin verilerin paylaşıldığı kişi ya da kurumlara bildirilmesini isteme,</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini, silinmesini, anonim hale getirilmesini, imha edilmesini isteme haklarınızın olduğunu,</li>
          </ul>
          <p>
            Bu hakkınızı Şehit Osman Avcı Mah. 2651. Cad.No:4F Eryaman/Ankara, TÜRKİYE adresimize bizzat ya da yazılı şekilde başvurmak suretiyle kullanılabileceğinizi ya da info@dostkoleji.com adresimize mail atarak kullanabileceğinizi önemle hatırlatırız.
          </p>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default KvkkModal;
