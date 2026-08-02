import { useState, useEffect } from 'react';
import { Bot, Save, Plus, Trash2, Settings, ToggleLeft, ToggleRight, Edit2, X, ArrowUp, ArrowDown, Check, MessageCircle, Mail, ExternalLink, CheckCircle2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface FormField {
  label: string;
  key: string;
  type: 'text' | 'tel' | 'email' | 'select' | 'textarea';
  options?: string[];
  required?: boolean;
}

interface FormItem {
  id: string;
  name: string;
  active: boolean;
  fields: FormField[];
}

const defaultInitialForms: FormItem[] = [
  {
    id: 'hizli-iletisim',
    name: 'Hızlı İletişim Formu',
    active: true,
    fields: [
      { label: 'Adı Soyadı', key: 'Adı Soyadı', type: 'text', required: true },
      { label: 'Telefon Numarası', key: 'Telefon Numarası', type: 'tel', required: true },
      { label: 'Kampüs Seçimi', key: 'Kampüs', type: 'select', options: ['Ümitköy Kampüsü', 'Oran Kampüsü', 'Eryaman Kampüsü'], required: true },
      { label: 'Eğitim Kademesi', key: 'Eğitim Kademesi', type: 'select', options: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'], required: true },
      { label: 'Mesajınız', key: 'Mesaj', type: 'textarea', required: false }
    ]
  }
];

export default function AssistantCenter() {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'forms' | 'settings'>('knowledge');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings States
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [forms, setForms] = useState<FormItem[]>(defaultInitialForms);

  // Form Builder Editing State
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'assistant');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKnowledgeBase(data.knowledgeBase || '');
          setIsActive(data.isActive ?? true);
          setWhatsapp(data.whatsapp || '');
          setEmail(data.email || '');
          if (data.forms && Array.isArray(data.forms) && data.forms.length > 0) {
            // Normalize legacy array or string fields
            const normalized = data.forms.map((f: any, idx: number) => ({
              id: f.id || `form-${idx}`,
              name: f.name || 'İletişim Formu',
              active: f.active ?? true,
              fields: Array.isArray(f.fields) 
                ? f.fields.map((field: any) => {
                    if (typeof field === 'string') {
                      const lower = field.toLowerCase();
                      if (lower.includes('kampüs')) {
                        return { label: field, key: field, type: 'select', options: ['Ümitköy Kampüsü', 'Oran Kampüsü', 'Eryaman Kampüsü'], required: true };
                      }
                      if (lower.includes('kademe') || lower.includes('eğitim')) {
                        return { label: field, key: field, type: 'select', options: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'], required: true };
                      }
                      if (lower.includes('telefon') || lower.includes('tel')) {
                        return { label: field, key: field, type: 'tel', required: true };
                      }
                      if (lower.includes('mesaj') || lower.includes('not')) {
                        return { label: field, key: field, type: 'textarea', required: false };
                      }
                      return { label: field, key: field, type: 'text', required: true };
                    }
                    return field;
                  })
                : []
            }));
            setForms(normalized);
          }
        }
      } catch (error) {
        console.error("Error fetching assistant settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (updatedForms?: FormItem[]) => {
    setSaving(true);
    const formsToSave = updatedForms || forms;
    try {
      await setDoc(doc(db, 'settings', 'assistant'), {
        knowledgeBase,
        isActive,
        whatsapp,
        email,
        forms: formsToSave
      }, { merge: true });
      alert('Tüm ayarlar ve formlar başarıyla kaydedildi!');
    } catch (error) {
      console.error("Error saving assistant settings:", error);
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenNewForm = () => {
    setEditingForm({
      id: 'form-' + Date.now(),
      name: 'Yeni İletişim Formu',
      active: true,
      fields: [
        { label: 'Adı Soyadı', key: 'Adı Soyadı', type: 'text', required: true },
        { label: 'Telefon Numarası', key: 'Telefon Numarası', type: 'tel', required: true },
        { label: 'Kampüs Seçimi', key: 'Kampüs', type: 'select', options: ['Ümitköy Kampüsü', 'Oran Kampüsü', 'Eryaman Kampüsü'], required: true },
        { label: 'Eğitim Kademesi', key: 'Eğitim Kademesi', type: 'select', options: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'], required: true },
        { label: 'Mesajınız', key: 'Mesaj', type: 'textarea', required: false }
      ]
    });
    setIsModalOpen(true);
  };

  const handleEditForm = (form: FormItem) => {
    setEditingForm(JSON.parse(JSON.stringify(form)));
    setIsModalOpen(true);
  };

  const handleDeleteForm = (id: string) => {
    const nextForms = forms.filter(f => f.id !== id);
    setForms(nextForms);
    handleSave(nextForms);
  };

  const handleToggleFormActive = (id: string) => {
    const nextForms = forms.map(f => f.id === id ? { ...f, active: !f.active } : f);
    setForms(nextForms);
    handleSave(nextForms);
  };

  const handleSaveModalForm = () => {
    if (!editingForm || !editingForm.name.trim()) {
      alert('Lütfen form adı girin.');
      return;
    }
    let nextForms: FormItem[];
    const exists = forms.some(f => f.id === editingForm.id);
    if (exists) {
      nextForms = forms.map(f => f.id === editingForm.id ? editingForm : f);
    } else {
      nextForms = [...forms, editingForm];
    }
    setForms(nextForms);
    setIsModalOpen(false);
    setEditingForm(null);
    handleSave(nextForms);
  };

  const handleAddFieldToModal = () => {
    if (!editingForm) return;
    const newField: FormField = {
      label: 'Yeni Alan',
      key: 'Yeni Alan',
      type: 'text',
      required: true
    };
    setEditingForm({
      ...editingForm,
      fields: [...editingForm.fields, newField]
    });
  };

  const handleRemoveFieldFromModal = (idx: number) => {
    if (!editingForm) return;
    const updated = editingForm.fields.filter((_, i) => i !== idx);
    setEditingForm({ ...editingForm, fields: updated });
  };

  const handleUpdateFieldInModal = (idx: number, keyToUpdate: keyof FormField, value: any) => {
    if (!editingForm) return;
    const updatedFields = [...editingForm.fields];
    updatedFields[idx] = {
      ...updatedFields[idx],
      [keyToUpdate]: value
    };
    if (keyToUpdate === 'label') {
      updatedFields[idx].key = value;
    }
    setEditingForm({ ...editingForm, fields: updatedFields });
  };

  const handleMoveField = (idx: number, direction: 'up' | 'down') => {
    if (!editingForm) return;
    const fields = [...editingForm.fields];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const temp = fields[idx];
    fields[idx] = fields[targetIdx];
    fields[targetIdx] = temp;
    setEditingForm({ ...editingForm, fields });
  };

  if (loading) return <div className="p-6 text-slate-500 font-bold">Yükleniyor...</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3 text-[#004899]">
              <Bot className="w-8 h-8 text-[#38C1D2]" />
              Veli Asistanı Yönetimi
            </h1>
            <p className="text-slate-500 text-sm">Yapay zeka asistanının bilgi bankasını, sohbet formlarını ve ayarlarını yönetin.</p>
          </div>
          <button 
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#004899] hover:bg-[#38C1D2] text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
          </button>
        </div>

        {/* Status Toggle */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Veli Asistanı Durumu</h3>
            <p className="text-sm text-slate-500">Sitedeki yapay zeka canlı destek butonunun aktifliğini ayarlayın.</p>
          </div>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer ${isActive ? 'bg-cyan-50 text-[#38C1D2] border border-[#38C1D2]/30' : 'bg-slate-100 text-slate-500'}`}
          >
            {isActive ? <ToggleRight className="w-6 h-6 text-[#38C1D2]" /> : <ToggleLeft className="w-6 h-6" />}
            {isActive ? 'Aktif' : 'Pasif'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'knowledge' ? 'border-[#38C1D2] text-[#38C1D2]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Bilgi Bankası & Prompt
          </button>
          <button 
            onClick={() => setActiveTab('forms')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'forms' ? 'border-[#38C1D2] text-[#38C1D2]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Form Oluşturucu ({forms.length})
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'settings' ? 'border-[#38C1D2] text-[#38C1D2]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Bildirim Ayarları
          </button>
        </div>

        {/* Tab 1: Knowledge Base */}
        {activeTab === 'knowledge' && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-lg mb-1 text-slate-900">Kurumsal Bilgi Bankası</h3>
              <p className="text-sm text-slate-500">Asistanın site içeriklerine ek olarak bilmesini istediğiniz ek duyuruları, kuralları, fiyat/burs tarihlerini veya özel talimatları buraya ekleyin.</p>
            </div>
            <textarea
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              className="w-full h-80 p-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] font-sans text-sm leading-relaxed"
              placeholder="Örn: 2026 Bursluluk Sınavı başvuruları başlamıştır. Ümitköy, Oran ve Eryaman kampüslerimizde ilkokul ve ortaokul kayıtları devam etmektedir..."
            ></textarea>
          </div>
        )}

        {/* Tab 2: Dynamic Form Builder */}
        {activeTab === 'forms' && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1 text-slate-900">Dinamik Sohbet Formları</h3>
                <p className="text-sm text-slate-500">Sohbet penceresi içinde velilerin dolduracağı formları oluşturun, düzenleyin ve alanlarını özelleştirin.</p>
              </div>
              <button 
                onClick={handleOpenNewForm}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A896] hover:bg-[#0B2545] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Yeni Form Oluştur
              </button>
            </div>

            <div className="grid gap-4">
              {forms.map(form => (
                <div key={form.id} className="border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#00A896] transition-colors bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">{form.name}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${form.active ? 'bg-teal-100 text-[#00A896]' : 'bg-slate-200 text-slate-600'}`}>
                        {form.active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      <strong>Alanlar ({form.fields.length}):</strong> {form.fields.map(f => typeof f === 'string' ? f : f.label).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => handleToggleFormActive(form.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${form.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-teal-50 text-[#00A896] hover:bg-teal-100'}`}
                    >
                      {form.active ? 'Pasife Al' : 'Aktif Et'}
                    </button>
                    <button 
                      onClick={() => handleEditForm(form)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDeleteForm(form.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Formu Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Notification Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="font-bold text-lg mb-1 text-slate-900">Otomatik Bildirimler & İletişim Kanalları</h3>
              <p className="text-sm text-slate-500">Sitede doldurulan formların düşeceği WhatsApp hattını ve e-posta bildirim adresini tanımlayın.</p>
            </div>

            {/* Active Status Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-900">Bildirim Yönlendirme Sistemi Aktif</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Tüm form başvuruları anında <strong>Rapor Merkezi</strong>'ne kaydedilir ve velilere WhatsApp/E-posta ile yöneticiye iletme butonları sunulur.
                  </p>
                </div>
              </div>

              {whatsapp && (
                <button
                  onClick={() => {
                    const clean = whatsapp.replace(/[^0-9]/g, '');
                    const phone = clean.length === 10 && clean.startsWith('5') ? '90' + clean : clean;
                    const testUrl = `https://wa.me/${phone}?text=${encodeURIComponent('Dost Koleji Bildirim Testi: WhatsApp hattınız başarıyla tanımlandı! 🎉')}`;
                    window.open(testUrl, '_blank');
                  }}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Testi Gönder</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </div>

            <div className="space-y-5 max-w-xl">
              <div>
                <label className="block text-sm font-bold mb-1.5 text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  WhatsApp Bildirim Numarası
                </label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+905356004552"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Form doldurulduğunda bilgiler bu WhatsApp numarasına pre-filled olarak aktarılır.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 text-slate-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#004899]" />
                  E-posta Bildirim Adresi
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yasinozbudak@gmail.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Gelen tüm iletişim talepleri bu e-posta adresi için hazır bildirim taslağı oluşturur.</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button 
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#004899] hover:bg-[#38C1D2] text-white rounded-lg font-bold text-sm transition-colors cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Editor Modal */}
      {isModalOpen && editingForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Form Düzenleyici</h3>
                <p className="text-xs text-slate-500">Veli asistanında açılacak form alanlarını ve seçeneklerini yapılandırın.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Form Name & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Form Adı</label>
                  <input 
                    type="text" 
                    value={editingForm.name}
                    onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                    className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A896] outline-none"
                    placeholder="Örn: Hızlı İletişim Formu"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingForm.active}
                      onChange={(e) => setEditingForm({ ...editingForm, active: e.target.checked })}
                      className="w-4 h-4 text-[#00A896] rounded focus:ring-[#00A896]"
                    />
                    Form Aktif Olsun
                  </label>
                </div>
              </div>

              {/* Form Fields List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-800">Form Alanları ({editingForm.fields.length})</h4>
                  <button 
                    onClick={handleAddFieldToModal}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00A896] hover:bg-teal-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Yeni Alan Ekle
                  </button>
                </div>

                {editingForm.fields.map((f, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold bg-[#0B2545] text-white px-2 py-0.5 rounded">Alan #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleMoveField(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMoveField(idx, 'down')}
                          disabled={idx === editingForm.fields.length - 1}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveFieldFromModal(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Alanı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Alan Etiketi (Başlık)</label>
                        <input 
                          type="text" 
                          value={f.label}
                          onChange={(e) => handleUpdateFieldInModal(idx, 'label', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#00A896] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Veri Tipi</label>
                        <select 
                          value={f.type}
                          onChange={(e) => handleUpdateFieldInModal(idx, 'type', e.target.value as any)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#00A896] outline-none"
                        >
                          <option value="text">Kısa Metin (Input)</option>
                          <option value="tel">Telefon Numarası (Tel)</option>
                          <option value="email">E-posta Adresi (Email)</option>
                          <option value="select">Açılır Liste Seçenekli (Select)</option>
                          <option value="textarea">Uzun Metin (Textarea)</option>
                        </select>
                      </div>
                    </div>

                    {/* Select Options */}
                    {f.type === 'select' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Seçenekler (Virgülle Ayırın)</label>
                        <input 
                          type="text" 
                          value={f.options ? f.options.join(', ') : ''}
                          onChange={(e) => handleUpdateFieldInModal(idx, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#00A896] outline-none"
                          placeholder="Örn: Ümitköy Kampüsü, Oran Kampüsü, Eryaman Kampüsü"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`req-${idx}`}
                        checked={f.required !== false}
                        onChange={(e) => handleUpdateFieldInModal(idx, 'required', e.target.checked)}
                        className="w-3.5 h-3.5 text-[#00A896] rounded"
                      />
                      <label htmlFor={`req-${idx}`} className="text-xs text-slate-600 cursor-pointer">Doldurulması Zorunlu Alan</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button 
                onClick={handleSaveModalForm}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#0B2545] hover:bg-[#00A896] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                Kaydet ve Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
