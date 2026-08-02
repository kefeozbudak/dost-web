import React, { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import IconField from '../components/IconField';
import MediaPickerModal from '../components/MediaPickerModal';
import FieldStylePicker from './components/FieldStylePicker';

interface BlockFormEditorProps {
  block: any;
  onChange: (block: any) => void;
  pagesList?: any[];
  onSave?: () => Promise<void> | void;
  saving?: boolean;
}

export default function BlockFormEditor({ block, onChange, pagesList, onSave, saving }: BlockFormEditorProps) {
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{ isOpen: boolean; onSelect: (url: string) => void }>({ isOpen: false, onSelect: () => {} });

  if (!block) return <div className="text-sm text-slate-500 text-center py-8">Lütfen düzenlemek için bir modül seçin.</div>;

  const handleChange = (key: string, value: any) => {
    onChange({ ...block, [key]: value });
  };

  const handleStyleChange = (key: string, value: any) => {
    onChange({ ...block, styles: { ...(block.styles || {}), [key]: value } });
  };

  const handleArrayChange = (arrayKey: string, index: number, itemKey: string, value: any) => {
    const newArray = [...(block[arrayKey] || [])];
    newArray[index] = { ...newArray[index], [itemKey]: value };
    handleChange(arrayKey, newArray);
  };

  const renderInputWithStyle = (label: string, key: string) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        <FieldStylePicker block={block} fieldKey={key} onChange={handleStyleChange} />
      </div>
      <input type="text" value={block[key] || ''} onChange={e => handleChange(key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" />
    </div>
  );

  const renderTextareaWithStyle = (label: string, key: string) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        <FieldStylePicker block={block} fieldKey={key} onChange={handleStyleChange} />
      </div>
      <textarea value={block[key] || ''} onChange={e => handleChange(key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 min-h-[100px]" />
    </div>
  );

  const renderImageUpload = (label: string, key: string) => (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={block[key] || ''} onChange={e => handleChange(key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none" />
        <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap">Seç</button>
      </div>
    </div>
  );

  const renderArrayEditor = (arrayKey: string, itemFields: {key: string, label: string, type: 'text' | 'textarea' | 'icon' | 'image' | 'checkbox' | 'url' | 'color' | 'select', options?: {value: string, label: string}[]}[], title: string = "Öğeler", hasStyles: boolean = false, arrayStyleKey?: string) => {
    const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', index.toString());
    };
    const handleDrop = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (fromIndex === index) return;
      
      const newArray = [...(block[arrayKey] || [])];
      const [movedItem] = newArray.splice(fromIndex, 1);
      newArray.splice(index, 0, movedItem);
      handleChange(arrayKey, newArray);
    };
    return (
    <div className="border-t border-slate-200 pt-4 mt-4">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</label>
          {arrayStyleKey && <FieldStylePicker block={block} fieldKey={arrayStyleKey} onChange={handleStyleChange} />}
        </div>
        {hasStyles && (
          <div className="flex flex-wrap gap-2 items-center bg-slate-100 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase">Başlık Stili:</span>
            <FieldStylePicker block={block} fieldKey="itemTitle" onChange={handleStyleChange} />
            <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">Açıklama Stili:</span>
            <FieldStylePicker block={block} fieldKey="itemDesc" onChange={handleStyleChange} />
          </div>
        )}
      </div>
      {(block[arrayKey] || []).map((item: any, idx: number) => (
        <div 
          key={idx} 
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, idx)}
          className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2 relative cursor-move"
        >

          <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0 cursor-move" />
          <div className="flex-1 space-y-2">
            {itemFields.map(field => {
              if (field.type === 'select') {
                return (
                  <div key={field.key} className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <select
                      value={item[field.key] || ''}
                      onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz...</option>
                      {(field.options || []).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (field.type === 'text') {
                return <input key={field.key} type="text" value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} placeholder={field.label} className="w-full text-sm border-slate-300 rounded p-1.5 font-bold" />
              }
              if (field.type === 'url') {
                const val = item[field.key] || '';
                return (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <div className="flex gap-2 w-full mt-1">
                      <select
                        value={val === '/' || pagesList?.find(p => p.path === val) ? val : 'custom'}
                        onChange={(e) => {
                          if (e.target.value !== 'custom') handleArrayChange(arrayKey, idx, field.key, e.target.value);
                        }}
                        className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="custom">Sayfa Seç</option>
                        <option value="/">Ana Sayfa</option>
                        {pagesList?.filter(p => p.id !== 'home').map(p => (
                          <option key={p.id} value={p.path}>{p.title}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)}
                        placeholder="Özel URL Girin"
                        className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              }
              if (field.type === 'textarea') {
                return <textarea key={field.key} value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} placeholder={field.label} className="w-full text-sm border-slate-300 rounded p-1.5 h-16" />
              }
              if (field.type === 'icon') {
                return <div key={field.key}><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{field.label}</label><IconField value={item[field.key] || ''} onChange={(val) => handleArrayChange(arrayKey, idx, field.key, val)} /></div>
              }
              if (field.type === 'image') {
                return (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <div className="flex gap-2">
                      <input type="text" value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} className="flex-1 text-sm border-slate-300 rounded p-1.5" />
                      <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, idx, field.key, url) })} className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold">Seç</button>
                    </div>
                  </div>
                );
              }
                            if (field.type === 'color') {
                return (
                  <div key={field.key} className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={item[field.key] || '#000000'} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} className="w-8 h-8 rounded border border-slate-300 cursor-pointer" />
                      <input type="text" value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} placeholder="örn: #FFFFFF" className="flex-1 text-sm border-slate-300 rounded p-1.5" />
                    </div>
                  </div>
                )
              }
              if (field.type === 'checkbox') {
                return (
                  <label key={field.key} className="flex items-center gap-2 text-sm font-bold text-slate-600 mt-2">
                    <input type="checkbox" checked={!!item[field.key]} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.checked)} className="rounded text-blue-600" />
                    {field.label}
                  </label>
                )
              }
              return null;
            })}
          </div>
          <button onClick={() => {
            const newItems = [...(block[arrayKey] || [])];
            newItems.splice(idx, 1);
            handleChange(arrayKey, newItems);
          }} className="text-red-500 hover:text-red-700 p-1">Sil</button>
        </div>
      ))}
      <button onClick={() => handleChange(arrayKey, [...(block[arrayKey] || []), {}])} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded flex items-center justify-center gap-1 mt-2">
        <Plus className="w-3 h-3" /> Ekle
      </button>
    </div>
  ); };

  const renderCommonFields = () => (
    <div className="space-y-4">
      {renderInputWithStyle('Başlık', 'title')}
      {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">Modül Düzenleyici</h3>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
          <input 
            type="checkbox" 
            checked={!block.isHidden} 
            onChange={(e) => handleChange('isHidden', !e.target.checked)} 
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className={block.isHidden ? "text-slate-400" : "text-blue-600"}>
            {block.isHidden ? "Gizli" : "Görünür"}
          </span>
        </label>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        {block.type === 'hero' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Görünüm Düzeni</label>
              <select 
                value={block.layoutOrder || 'text_images_buttons'} 
                onChange={(e) => handleChange('layoutOrder', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
              >
                <option value="text_images_buttons">Yazı - Resimler - Butonlar</option>
                <option value="images_text_buttons">Resimler - Yazı - Butonlar</option>
                <option value="text_buttons_images">Yazı - Butonlar - Resimler</option>
              </select>
            </div>

            {renderInputWithStyle('Badge (İsteğe Bağlı)', 'badge')}
            {renderTextareaWithStyle('Ana Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},
              {key: 'url', label: 'Link URL', type: 'url'}
            ], "Görseller")}
                        {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Butonlar", false, 'buttons')}
          </div>
        )}
        
        
        {block.type === 'academic_hero' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Ana Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Karartma Rengi (örn: rgba(0,0,0,0.5))</label>
              <input 
                type="text" 
                value={block.styles?.overlayColor || ''} 
                onChange={(e) => handleStyleChange('overlayColor', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" 
              />
            </div>
          </div>
        )}
        
        {block.type === 'akademik_kadro' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Arka Plan Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarBgColor || '#1a212c'} onChange={(e) => handleStyleChange('sidebarBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarBgColor || ''} onChange={(e) => handleStyleChange('sidebarBgColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Aktif Öğe Arka Planı</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarActiveBgColor || '#1d4eca'} onChange={(e) => handleStyleChange('sidebarActiveBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarActiveBgColor || ''} onChange={(e) => handleStyleChange('sidebarActiveBgColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Aktif Metin Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarActiveTextColor || '#1d4eca'} onChange={(e) => handleStyleChange('sidebarActiveTextColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarActiveTextColor || ''} onChange={(e) => handleStyleChange('sidebarActiveTextColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Pasif Metin Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarTextColor || '#e5e7eb'} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarTextColor || ''} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Arka Plan Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardBgColor || '#1a212c'} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardBgColor || ''} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Başlık Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardTitleColor || '#ffffff'} onChange={(e) => handleStyleChange('cardTitleColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardTitleColor || ''} onChange={(e) => handleStyleChange('cardTitleColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Metin/İkon Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardTextColor || '#9ca3af'} onChange={(e) => handleStyleChange('cardTextColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardTextColor || ''} onChange={(e) => handleStyleChange('cardTextColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vurgu/Aksiyon Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardAccentColor || '#1d4eca'} onChange={(e) => handleStyleChange('cardAccentColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardAccentColor || ''} onChange={(e) => handleStyleChange('cardAccentColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
            </div>
            
            {renderInputWithStyle('Sidebar Ana Başlık', 'sidebarTitle')}
            {renderInputWithStyle('Sidebar Alt Başlık', 'sidebarSubtitle')}
            
            {renderArrayEditor('sidebarItems', [
              {key: 'label', label: 'Menü Etiketi', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon (Material)', type: 'icon'}
            ], "Sidebar Menü Öğeleri")}

            {renderArrayEditor('items', [
              {key: 'title', label: 'Kişi Adı', type: 'text'},
              {key: 'subtitle', label: 'Ünvan/Bölüm', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Profil Görseli', type: 'image'},
              {key: 'tag', label: 'Etiket (Örn: Bilgisayar Müh.)', type: 'text'},
              {key: 'tagColor', label: 'Etiket Rengi', type: 'color'},
              {key: 'url', label: 'Profil URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'},
              {key: 'cardBgColor', label: 'Kart Arka Plan Rengi', type: 'color'},
              {key: 'cardBorderColor', label: 'Kart Kenarlık Rengi', type: 'color'},
              {key: 'itemTitleColor', label: 'İsim Metin Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Ünvan Metin Rengi', type: 'color'},
              {key: 'itemTextColor', label: 'Açıklama Metin Rengi', type: 'color'},
              {key: 'buttonTextColor', label: 'Link Metin Rengi', type: 'color'}
            ], "Kadro Öğeleri")}
          </div>
        )}

        
        {block.type === 'management_hero' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Ana Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Karartma Rengi</label>
              <input type="text" value={block.styles?.overlayColor || ''} onChange={(e) => handleStyleChange('overlayColor', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
        )}

        {block.type === 'management_rector' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderInputWithStyle('Bölüm İkonu (Material)', 'icon')}
            {renderImageUpload('Rektör Görseli', 'image')}
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Rektör Adı', 'name')}
            {renderInputWithStyle('Ünvan/Rol', 'role')}
            {renderTextareaWithStyle('Alıntı (Söz)', 'quote')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Aksiyon Butonları")}
          </div>
        )}

        {block.type === 'management_vice_rectors' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderInputWithStyle('Bölüm İkonu', 'icon')}
            {renderArrayEditor('items', [
              {key: 'name', label: 'Kişi Adı', type: 'text'},
              {key: 'role', label: 'Rol/Ünvan', type: 'text'},
              {key: 'badge', label: 'Sorumluluk (Badge)', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},
              {key: 'url', label: 'Profil Linki', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}
            ], "Yöneticiler")}
          </div>
        )}

        {block.type === 'management_deans' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderInputWithStyle('Bölüm İkonu', 'icon')}
            {renderArrayEditor('items', [
              {key: 'name', label: 'Dekan Adı', type: 'text'},
              {key: 'role', label: 'Rol/Ünvan', type: 'text'},
              {key: 'badge', label: 'Fakülte (Badge)', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},
              {key: 'url', label: 'Fakülte Linki', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}
            ], "Dekanlar")}
          </div>
        )}

        {block.type === 'about_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Badge (İsteğe Bağlı)', 'badge')}
            {renderTextareaWithStyle('Ana Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
                        {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'primary', label: 'Birincil Buton', type: 'checkbox'},
              {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Butonlar", false, 'buttons')}
          </div>
        )}

        {block.type === 'mission_vision' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'}
            ], "Kartlar", true)}
          </div>
        )}

        {block.type === 'timeline' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderArrayEditor('items', [
              {key: 'year', label: 'Yıl/Etiket', type: 'text'},
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Görsel', type: 'image'}
            ], "Tarihçe Öğeleri", true)}
          </div>
        )}

        {block.type === 'values' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'}
            ], "Değerler", true)}
          </div>
        )}

        {block.type === 'quote_image' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alıntı Metni (Quote)', 'quote')}
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Yazar Adı', 'authorName')}
              {renderInputWithStyle('Yazar Unvanı', 'authorTitle')}
            </div>
            {renderImageUpload('Görsel', 'image')}
          </div>
        )}
        
                {block.type === 'video' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Açıklama (Metin)', 'desc')}
            {renderImageUpload('Video URL (MP4 veya YouTube vb. Destekleniyorsa, yoksa link)', 'videoUrl')}
            <p className="text-xs text-slate-500 italic mt-1">Not: Medya kütüphanesinden video yükleyebilir veya doğrudan link yapıştırabilirsiniz.</p>
            {renderImageUpload('Video Kapak Görseli', 'thumbnailUrl')}
          </div>
        )}
        {['features', 'stats', 'education_levels', 'campuses', 'news'].includes(block.type) && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'url', label: 'Link URL', type: 'url'}
            ], "Öğeler", true)}
          </div>
        )}


        {block.type === 'achievements_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2 (Renkli)', 'titlePart2')}
            {renderInputWithStyle('Başlık Bölüm 2 Rengi', 'titlePart2Color')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arkaplan Görseli', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link (URL)', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'bgColor', label: 'Arkaplan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'achievements_academic_bento' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (primary/list/stat/default)', type: 'text'},
              {key: 'statValue', label: 'İstatistik Değeri', type: 'text'},
              {key: 'statLabel', label: 'İstatistik Etiketi', type: 'text'},
              {key: 'badge', label: 'Rozet (Badge)', type: 'text'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Buton URL', type: 'url'}
            ], "Öğeler")}
          </div>
        )}

        {block.type === 'achievements_social_gallery' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},
              {key: 'hoverText', label: 'Hover Metni', type: 'text'}
            ], "Galeri Öğeleri")}
          </div>
        )}

        {block.type === 'achievements_science_projects' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Görsel Üzeri Etiket', 'imageBadge')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'}
            ], "Projeler")}
          </div>
        )}


        {block.type === 'news_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arkaplan Görseli', 'image')}
          </div>
        )}

        {block.type === 'news_grid' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={block.showPagination || false} onChange={e => handleChange('showPagination', e.target.checked)} id="showPagination" />
              <label htmlFor="showPagination" className="text-sm">Sayfalama (Pagination) Göster</label>
            </div>
            {renderArrayEditor('categories', [
              {key: 'label', label: 'Kategori Adı', type: 'text'}
            ], "Kategoriler")}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'date', label: 'Tarih', type: 'text'},
              {key: 'tag', label: 'Kategori Seç (Rozet)', type: 'select', options: (block.categories || []).filter((c: any) => c.label !== 'Tümü').map((c: any) => ({value: c.label || c, label: c.label || c}))},
              {key: 'tagColor', label: 'Etiket Rengi (Tailwind class)', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Buton URL', type: 'url'}
            ,
              {key: 'cardBgColor', label: 'Kart Arka Plan Rengi', type: 'color'},
              {key: 'cardBorderColor', label: 'Kart Kenarlık Rengi', type: 'color'},
              {key: 'cardBorderRadius', label: 'Kart Oval (Örn: 12px)', type: 'text'},
              {key: 'cardPadding', label: 'Kart İç Boşluk (Örn: 24px)', type: 'text'},
              {key: 'itemTitleColor', label: 'Özel Başlık Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Özel Açıklama Rengi', type: 'color'}
            ], "Haber / Duyuru Öğeleri")}
          </div>
        )}

        {block.type === 'newsletter' && (
          <div className="space-y-4">
            {renderInputWithStyle('İkon', 'icon')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'desc')}
            {renderInputWithStyle('Input Placeholder', 'inputPlaceholder')}
            {renderInputWithStyle('Buton Metni', 'buttonText')}
            {renderInputWithStyle('Alt Açıklama (Caption)', 'caption')}
          </div>
        )}

      </div>
      <MediaPickerModal 
        isOpen={mediaPickerConfig.isOpen} 
        onClose={() => setMediaPickerConfig(prev => ({ ...prev, isOpen: false }))} 
        onSelect={(url) => { mediaPickerConfig.onSelect(url); setMediaPickerConfig(prev => ({ ...prev, isOpen: false })); }} 
      />
    </div>
  );
}
