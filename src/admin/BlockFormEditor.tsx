import React, { useState, useRef, useEffect } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import IconField from '../components/IconField';
import MediaPickerModal from '../components/MediaPickerModal';
import FieldStylePicker from './components/FieldStylePicker';
import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS } from '../lib/defaultFormInputs';

interface BlockFormEditorProps {
  activeArrayItem?: { arrayKey: string, index: number } | null;
  block: any;
  onChange: (block: any) => void;
  pagesList?: any[];
  onSave?: () => Promise<void> | void;
  saving?: boolean;
}

export default function BlockFormEditor({ block, onChange, pagesList, onSave, saving, activeArrayItem }: BlockFormEditorProps) {
  const arrayItemRefs = useRef<{[key: string]: HTMLDetailsElement | null}>({});
  useEffect(() => {
    if (activeArrayItem) {
      const key = `${activeArrayItem.arrayKey}-${activeArrayItem.index}`;
      const el = arrayItemRefs.current[key];
      if (el) {
        el.open = true;
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  }, [activeArrayItem, block]);

  const [mediaPickerConfig, setMediaPickerConfig] = useState<{ isOpen: boolean; onSelect: (url: string) => void }>({ isOpen: false, onSelect: () => {} });

  if (!block) return <div className="text-sm text-slate-500 text-center py-8">Lütfen düzenlemek için bir modül seçin.</div>;

  const handleChange = (key: string, value: any) => {
    const updated = { ...block, [key]: value };
    if (key === 'url' || key === 'buttonUrl') {
      updated.url = value;
      updated.buttonUrl = value;
      updated.link = value;
    }
    onChange(updated);
  };

  const handleStyleChange = (key: string, value: any) => {
    onChange({ ...block, styles: { ...(block.styles || {}), [key]: value } });
  };

  const getEffectiveArray = (arrayKey: string) => {
    let current = block[arrayKey];
    if (arrayKey === 'inputs' && (!current || current.length === 0)) {
      if (block.type === 'pre_registration_form') return DEFAULT_PRE_REGISTRATION_INPUTS;
      if (block.type === 'club_registration_form') return DEFAULT_CLUB_INPUTS;
      if (block.type === 'career_application') return DEFAULT_CAREER_INPUTS;
      if (block.type === 'bursluluk_exam_form') return DEFAULT_SCHOLARSHIP_INPUTS;
      return [];
    }
    return current || [];
  };

  const handleArrayChange = (arrayKey: string, index: number, itemKey: string, value: any) => {
    const currentArray = getEffectiveArray(arrayKey);
    const newArray = currentArray.map((item: any) => ({ ...item }));
    newArray[index] = { ...newArray[index], [itemKey]: value };
    if (itemKey === 'url' || itemKey === 'buttonUrl') {
      newArray[index].url = value;
      newArray[index].buttonUrl = value;
      newArray[index].link = value;
    }
    if (arrayKey === 'inputs' && itemKey === 'label' && (!newArray[index].name || newArray[index].name.startsWith('input_'))) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
      if (slug) newArray[index].name = slug;
    }
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

  const renderUrlInputWithStyle = (label: string, key: string) => {
    const val = block[key] || '';
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
          <FieldStylePicker block={block} fieldKey={key} onChange={handleStyleChange} />
        </div>
        <div className="flex gap-2 w-full">
          <select
            value={val === '/' || pagesList?.find(p => p.path === val) ? val : 'custom'}
            onChange={(e) => {
              if (e.target.value !== 'custom') {
                handleChange(key, e.target.value);
                if (key === 'buttonUrl') handleChange('url', e.target.value);
                if (key === 'url') handleChange('buttonUrl', e.target.value);
              }
            }}
            className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="custom">Sayfa Seç</option>
            <option value="/">Ana Sayfa (/)</option>
            {pagesList?.filter(p => p.id !== 'home').map(p => (
              <option key={p.id} value={p.path}>{p.title} ({p.path})</option>
            ))}
          </select>
          <input
            type="text"
            value={val}
            onChange={(e) => {
              handleChange(key, e.target.value);
              if (key === 'buttonUrl') handleChange('url', e.target.value);
              if (key === 'url') handleChange('buttonUrl', e.target.value);
            }}
            placeholder="Özel URL Girin (Örn: /on-kayit)"
            className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

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
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={block[key] || ''} onChange={e => handleChange(key, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white" placeholder="https://..." />
        <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url || '') })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap shadow-sm transition-colors">Seç</button>
      </div>
      {block[key] && (
        <div className="grid grid-cols-1 gap-3 mt-2 pt-3 border-t border-slate-200">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Sol/Sağ (X)</label>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{block[`${key}_posX`] ?? 50}%</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={block[`${key}_posX`] ?? 50} onChange={(e) => handleChange(`${key}_posX`, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Üst/Alt (Y)</label>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{block[`${key}_posY`] ?? 50}%</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={block[`${key}_posY`] ?? 50} onChange={(e) => handleChange(`${key}_posY`, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Yakınlaştır</label>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{block[`${key}_scale`] ?? 100}%</span>
            </div>
            <input type="range" min="10" max="500" step="1" value={block[`${key}_scale`] ?? 100} onChange={(e) => handleChange(`${key}_scale`, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </div>
      )}
    </div>
  );

  const renderArrayEditor = (arrayKey: string, itemFields: {key: string, label: string, type: 'text' | 'textarea' | 'icon' | 'image' | 'checkbox' | 'url' | 'color' | 'select', options?: {value: string, label: string}[]}[], title: string = "Öğeler", hasStyles: boolean = true, arrayStyleKey?: string) => {
    const currentArray = getEffectiveArray(arrayKey);

    const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', index.toString());
    };
    const handleDrop = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (fromIndex === index) return;
      
      const newArray = currentArray.map((item: any) => ({ ...item }));
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
            <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">Buton Stili:</span>
            <FieldStylePicker block={block} fieldKey="itemButton" onChange={handleStyleChange} />
          </div>
        )}
      </div>
      {currentArray.map((item: any, idx: number) => (
        <details 
          key={idx} 
          ref={(el) => { arrayItemRefs.current[`${arrayKey}-${idx}`] = el; }}
          className="group/item bg-slate-50 rounded-lg border border-slate-200 mb-2"
        >
          <summary className="flex gap-2 items-center p-3 cursor-pointer list-none select-none">
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-open/item:rotate-90 transition-transform">chevron_right</span>
            <div className="flex-1 font-bold text-xs text-slate-600 truncate">
              {typeof item === 'string' ? item : (
                arrayKey === 'inputs' ? (
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase shrink-0">
                      {item.type === 'section_title' ? '📌 Bölüm' : item.type === 'select' ? '🔽 Açılır Liste' : item.type === 'radio' ? '🔘 Radio' : item.type === 'checkbox' ? '☑️ Checkbox' : item.type === 'date' ? '📅 Tarih' : item.type === 'tel' ? '📞 Telefon' : item.type === 'email' ? '✉️ E-Posta' : item.type === 'textarea' ? '📄 Textarea' : '📝 Metin'}
                    </span>
                    <span className="font-semibold text-slate-800">{item.label || item.name || `Alan ${idx + 1}`}</span>
                    {item.required && <span className="text-red-500 font-bold" title="Zorunlu Alan">*</span>}
                    {item.fullWidth && <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-normal">Tam Genişlik</span>}
                  </span>
                ) : (item.title || item.label || item.day || item.name || item.text || `Öğe ${idx + 1}`)
              )}
            </div>
            <span draggable onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, idx)} onClick={(e) => e.preventDefault()} className="cursor-move"><GripVertical className="w-4 h-4 text-slate-300" /></span>
          </summary>
          <div className="p-3 pt-0 border-t border-slate-200 flex gap-2 items-start mt-2">
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
                const val = item[field.key] || item.url || item.buttonUrl || '';
                return (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <div className="flex gap-2 w-full mt-1">
                      <select
                        value={val === '/' || pagesList?.find(p => p.path === val) ? val : 'custom'}
                        onChange={(e) => {
                          if (e.target.value !== 'custom') {
                            handleArrayChange(arrayKey, idx, field.key, e.target.value);
                            if (field.key === 'buttonUrl') handleArrayChange(arrayKey, idx, 'url', e.target.value);
                            if (field.key === 'url') handleArrayChange(arrayKey, idx, 'buttonUrl', e.target.value);
                          }
                        }}
                        className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="custom">Sayfa Seç</option>
                        <option value="/">Ana Sayfa (/)</option>
                        {pagesList?.filter(p => p.id !== 'home').map(p => (
                          <option key={p.id} value={p.path}>{p.title} ({p.path})</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          handleArrayChange(arrayKey, idx, field.key, e.target.value);
                          if (field.key === 'buttonUrl') handleArrayChange(arrayKey, idx, 'url', e.target.value);
                          if (field.key === 'url') handleArrayChange(arrayKey, idx, 'buttonUrl', e.target.value);
                        }}
                        placeholder="Özel URL Girin (Örn: /on-kayit)"
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
                  <div key={field.key} className="flex flex-col gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                    <div className="flex gap-2">
                      <input type="text" value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} className="flex-1 text-sm border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-blue-500 bg-white" placeholder="https://..." />
                      <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, idx, field.key, url || '') })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[11px] font-bold shadow-sm transition-colors">Seç</button>
                    </div>
                    {item[field.key] && (
                      <div className="grid grid-cols-1 gap-3 mt-3 pt-3 border-t border-slate-200">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Sol/Sağ (X)</label>
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{item[`${field.key}_posX`] ?? 50}%</span>
                          </div>
                          <input type="range" min="0" max="100" step="1" value={item[`${field.key}_posX`] ?? 50} onChange={(e) => handleArrayChange(arrayKey, idx, `${field.key}_posX`, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Üst/Alt (Y)</label>
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{item[`${field.key}_posY`] ?? 50}%</span>
                          </div>
                          <input type="range" min="0" max="100" step="1" value={item[`${field.key}_posY`] ?? 50} onChange={(e) => handleArrayChange(arrayKey, idx, `${field.key}_posY`, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Yakınlaştır</label>
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{item[`${field.key}_scale`] ?? 100}%</span>
                          </div>
                          <input type="range" min="10" max="500" step="1" value={item[`${field.key}_scale`] ?? 100} onChange={(e) => handleArrayChange(arrayKey, idx, `${field.key}_scale`, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                      </div>
                    )}
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
            })}
            
            {hasStyles && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <details className="group">
                  <summary className="text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 list-none flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] group-open:rotate-90 transition-transform">chevron_right</span>
                    İleri Düzey Stiller
                  </summary>
                  <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pl-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Kart Zemin Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.cardBgColor === 'currentColor' || !item.cardBgColor ? '#ffffff' : item.cardBgColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBgColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.cardBgColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBgColor', e.target.value)} placeholder="Şeffaf" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Kenarlık Rengi & Kalınlığı</label>
                      <div className="flex gap-1 items-center">
                        <input type="color" value={item.cardBorderColor === 'currentColor' || !item.cardBorderColor ? '#e2e8f0' : item.cardBorderColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.cardBorderColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderColor', e.target.value)} placeholder="Renk" className="w-1/2 text-xs border-slate-300 rounded p-1.5" />
                        <input type="text" value={item.cardBorderWidth || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderWidth', e.target.value)} placeholder="1px" className="w-1/3 text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Köşe Yuvarlama (Radius)</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="0" max="64" value={parseInt(item.cardBorderRadius) || 0} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderRadius', e.target.value + 'px')} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <input type="text" value={item.cardBorderRadius || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderRadius', e.target.value)} placeholder="12px" className="w-16 text-xs border-slate-300 rounded p-1.5 text-center" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">İç Boşluk (Padding)</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="0" max="64" value={parseInt(item.cardPadding) || 0} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardPadding', e.target.value + 'px')} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <input type="text" value={item.cardPadding || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardPadding', e.target.value)} placeholder="24px" className="w-16 text-xs border-slate-300 rounded p-1.5 text-center" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Gölge Efekti (Shadow)</label>
                      <select value={item.cardShadow || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardShadow', e.target.value)} className="w-full text-xs border-slate-300 rounded p-1.5 bg-white">
                        <option value="">Varsayılan</option>
                        <option value="none">Yok (none)</option>
                        <option value="sm">Küçük (sm)</option>
                        <option value="md">Orta (md)</option>
                        <option value="lg">Büyük (lg)</option>
                        <option value="xl">Çok Büyük (xl)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Başlık Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.itemTitleColor === 'currentColor' || !item.itemTitleColor ? '#000000' : item.itemTitleColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemTitleColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.itemTitleColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemTitleColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Açıklama Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.itemDescColor === 'currentColor' || !item.itemDescColor ? '#000000' : item.itemDescColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemDescColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.itemDescColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemDescColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Buton Yazı Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.buttonTextColor === 'currentColor' || !item.buttonTextColor ? '#0f172a' : item.buttonTextColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonTextColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.buttonTextColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonTextColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Buton Zemin Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.buttonBgColor === 'currentColor' || !item.buttonBgColor ? '#5eead4' : item.buttonBgColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonBgColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.buttonBgColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonBgColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <input type="checkbox" checked={!!item.hoverEffect} onChange={(e) => handleArrayChange(arrayKey, idx, 'hoverEffect', e.target.checked)} className="rounded text-blue-600" />
                        Hover Efekti (Büyüme/Yükselme)
                      </label>
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
         <button onClick={() => {
            const newItems = currentArray.map((i: any) => ({ ...i }));
            newItems.splice(idx, 1);
            handleChange(arrayKey, newItems);
          }} className="text-red-500 hover:text-red-700 p-1 text-xs font-bold mt-2">Sil</button>
          </div>
        </details>
      ))}
      <div className="flex gap-2 mt-2">
        <button 
          type="button"
          onClick={() => {
            const newItem = arrayKey === 'inputs' 
              ? { type: 'text', name: 'input_' + Date.now(), label: 'Yeni Form Alanı', placeholder: '', required: false }
              : {};
            handleChange(arrayKey, [...currentArray, newItem]);
          }} 
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1 shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Yeni {arrayKey === 'inputs' ? 'Form Alanı (İnput)' : 'Öğe'} Ekle
        </button>

        {arrayKey === 'inputs' && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Form alanlarını orijinal varsayılan şablona sıfırlamak istediğinize emin misiniz? Yapılan özelleştirmeler sıfırlanacaktır.")) {
                const defaults = block.type === 'pre_registration_form' ? DEFAULT_PRE_REGISTRATION_INPUTS : (block.type === 'bursluluk_exam_form' ? DEFAULT_SCHOLARSHIP_INPUTS : block.type === 'career_application' ? DEFAULT_CAREER_INPUTS : DEFAULT_CLUB_INPUTS);
                handleChange(arrayKey, defaults);
              }
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded transition-colors flex items-center gap-1 border border-slate-200"
            title="Varsayılan Şablona Sıfırla"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span> Sıfırla
          </button>
        )}
      </div>
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
        <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Genel Modül Ayarları</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Zemin Rengi</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={block.styles?.backgroundColor || '#ffffff'} 
                  onChange={(e) => {
                    const newStyles = { ...(block.styles || {}), backgroundColor: e.target.value };
                    handleChange('styles', newStyles);
                  }}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input 
                  type="text" 
                  value={block.styles?.backgroundColor || ''}
                  onChange={(e) => {
                    const newStyles = { ...(block.styles || {}), backgroundColor: e.target.value };
                    handleChange('styles', newStyles);
                  }}
                  placeholder="Varsayılan (Boş bırakılabilir)"
                  className="flex-1 text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Metin Rengi</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={block.styles?.color || '#000000'} 
                  onChange={(e) => {
                    const newStyles = { ...(block.styles || {}), color: e.target.value };
                    handleChange('styles', newStyles);
                  }}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input 
                  type="text" 
                  value={block.styles?.color || ''}
                  onChange={(e) => {
                    const newStyles = { ...(block.styles || {}), color: e.target.value };
                    handleChange('styles', newStyles);
                  }}
                  placeholder="Varsayılan (Boş bırakılabilir)"
                  className="flex-1 text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded border border-slate-200 w-full">
                <input 
                  type="checkbox" 
                  checked={!!block.styles?.fullWidth}
                  onChange={(e) => {
                    const newStyles = { ...(block.styles || {}), fullWidth: e.target.checked };
                    handleChange('styles', newStyles);
                  }}
                  className="rounded text-blue-600 w-4 h-4 border-slate-300"
                />
                Tam Genişlik (Sağ-Sol Yasla)
              </label>
            </div>
          </div>
        </div>

        {block.type === 'hero' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Görünüm Düzeni</label>
              <select 
                value={block.layoutOrder || 'text_images_buttons'} 
                onChange={(e) => handleChange('layoutOrder', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 font-medium"
              >
                <option value="text_images_buttons">Yazı - Resimler - Butonlar</option>
                <option value="images_text_buttons">Resimler - Yazı - Butonlar</option>
                <option value="text_buttons_images">Yazı - Butonlar - Resimler</option>
              </select>
            </div>

            {renderInputWithStyle('Badge (İsteğe Bağlı)', 'badge')}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Başlık Ayarları & Yerleşimi</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Başlık Durumu (Metin Yerleşimi)</label>
                <select 
                  value={block.titleLayout || block.styles?.titleLayout || 'inline'} 
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({
                      ...block,
                      titleLayout: val,
                      styles: { ...(block.styles || {}), titleLayout: val }
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 font-medium bg-white"
                >
                  <option value="inline">Yan Yana (Aynı Hizada)</option>
                  <option value="stacked">Alt Alta (Üst Üste Düzen)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Başlık Parçası (Metin 1)</label>
                  <FieldStylePicker block={block} fieldKey="titlePart1" onChange={handleStyleChange} />
                </div>
                <input 
                  type="text" 
                  value={block.titlePart1 || ''} 
                  onChange={e => {
                    const p1 = e.target.value;
                    const p2 = block.titlePart2 || '';
                    onChange({
                      ...block,
                      titlePart1: p1,
                      title: `${p1} ${p2}`.trim()
                    });
                  }} 
                  placeholder="örn: Eğitimde Dostluk"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white font-bold" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Başlık Parçası (Metin 2)</label>
                  <FieldStylePicker block={block} fieldKey="titlePart2" onChange={handleStyleChange} />
                </div>
                <input 
                  type="text" 
                  value={block.titlePart2 || ''} 
                  onChange={e => {
                    const p2 = e.target.value;
                    const p1 = block.titlePart1 || '';
                    onChange({
                      ...block,
                      titlePart1: p1,
                      titlePart2: p2,
                      title: `${p1} ${p2}`.trim()
                    });
                  }} 
                  placeholder="örn: Gelecekte Başarı"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white font-bold" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Birleşik / Genel Ana Başlık</label>
                  <FieldStylePicker block={block} fieldKey="title" onChange={handleStyleChange} />
                </div>
                <textarea 
                  value={block.title || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    let p1 = '';
                    let p2 = '';
                    
                    if (val.includes(',')) {
                      const parts = val.split(',');
                      p1 = parts[0].trim();
                      p2 = parts.slice(1).join(',').trim();
                    } else if (val.includes('\n')) {
                      const parts = val.split('\n');
                      p1 = parts[0].trim();
                      p2 = parts.slice(1).join(' ').trim();
                    } else if (val.includes(' ')) {
                      const words = val.trim().split(' ');
                      if (words.length >= 2) {
                        const mid = Math.ceil(words.length / 2);
                        p1 = words.slice(0, mid).join(' ');
                        p2 = words.slice(mid).join(' ');
                      } else {
                        p1 = val;
                        p2 = '';
                      }
                    } else {
                      p1 = val;
                      p2 = '';
                    }

                    onChange({
                      ...block,
                      title: val,
                      titlePart1: p1,
                      titlePart2: p2
                    });
                  }} 
                  placeholder="örn: Eğitimde Dostluk, Gelecekte Başarı"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white min-h-[70px]" 
                />
              </div>
            </div>

            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Yazısı (Örn: Detaylı Bilgi)', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'}
            ], "Görseller")}
                        {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
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
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'},
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
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
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
              {key: 'url', label: 'Profil Linki', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'}
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
              {key: 'url', label: 'Fakülte Linki', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'}
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
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
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
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Yazısı (Örn: Detaylı Bilgi)', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'}
            ], "Öğeler", true)}
          </div>
        )}


        {block.type === 'kindergarten_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Üst Başlık (Rozet)', 'badge')}
            {renderTextareaWithStyle('Açıklama Metni', 'subtitle')}
            {renderImageUpload('Görsel (Sağ Kısım)', 'image')}
            {renderInputWithStyle('Görsel Alt Rozet (Örn: Oyun Temelli Eğitim)', 'imageBadgeTitle')}
            {renderInputWithStyle('Görsel Alt Açıklama (Örn: Aktif Öğrenme)', 'imageBadgeDesc')}
            <div className="flex flex-col gap-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Görsel Alt İkon</label><IconField value={block.imageBadgeIcon || ''} onChange={(val) => handleChange('imageBadgeIcon', val)} /></div>
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'kindergarten_bento' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Alt Açıklama', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'rowSpan', label: 'Geniş Kart', type: 'checkbox'},
              {key: 'highlight', label: 'Mavi Temalı (Primary)', type: 'checkbox'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'}
            ], "Bento Kartları")}
          </div>
        )}

        {block.type === 'kindergarten_branches' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Alt Açıklama', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'}
            ], "Branş Kartları")}
          </div>
        )}

        {block.type === 'primary_school_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Üst Başlık (Rozet)', 'badge')}
            {renderTextareaWithStyle('Açıklama Metni', 'subtitle')}
            {renderImageUpload('Görsel (Arkaplan)', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'primary_school_bento' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Alt Açıklama', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'rowSpan', label: 'Geniş Kart', type: 'checkbox'},
              {key: 'styleType', label: 'Stil Tipi', type: 'select', options: [{value: 'primary', label: 'Primary (Mavi)'}, {value: 'secondary', label: 'Secondary (Turkuaz)'}]}
            ], "Bento Kartları")}
          </div>
        )}

        {block.type === 'middle_school_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Üst Başlık (Rozet)', 'badge')}
            {renderTextareaWithStyle('Açıklama Metni', 'subtitle')}
            {renderImageUpload('Görsel (Arkaplan)', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'middle_school_pedagogy' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderImageUpload('Görsel (Sol Kısım)', 'image')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'styleType', label: 'Stil Tipi', type: 'select', options: [{value: 'primary', label: 'Primary (Mavi)'}, {value: 'secondary', label: 'Secondary (Turkuaz)'}]}
            ], "Pedagoji Kartları")}
          </div>
        )}

        {block.type === 'middle_school_lgs' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'badge', label: 'Rozet (Örn: Ana Odak)', type: 'text'},
              {key: 'rowSpan', label: 'Geniş Kart', type: 'checkbox'},
              {key: 'styleType', label: 'Stil Tipi (İkon Arkaplanı)', type: 'select', options: [{value: 'primary', label: 'Primary (Mavi)'}, {value: 'secondary', label: 'Secondary (Turkuaz)'}, {value: 'tertiary', label: 'Tertiary (Gri)'}]}
            ], "LGS Kartları")}
          </div>
        )}

        
        
        
        {block.type === 'campus_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arkaplan Görseli', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'campus_bento' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Kart Başlığı', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'colSpan', label: 'Sütun Genişliği (örn: col-span-12 md:col-span-6 lg:col-span-4)', type: 'text'}
            ], "Eğitim Kademeleri Kartları")}
          </div>
        )}

        {block.type === 'campus_gallery' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Kart Başlığı', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Görsel', type: 'image'}
            ], "Galeri Kartları")}
          </div>
        )}

        {block.type === 'campus_life' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Rozet (Örn: Kampüs Yaşamı)', 'badge')}
            {renderInputWithStyle('Başlık (1. Kısım)', 'titlePart1')}
            {renderInputWithStyle('Başlık (2. Kısım)', 'titlePart2')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            <div className="grid grid-cols-2 gap-4">
              {renderImageUpload('Görsel 1 (Sol Üst)', 'image1')}
              {renderImageUpload('Görsel 2 (Sol Alt)', 'image2')}
              {renderImageUpload('Görsel 3 (Sağ Üst)', 'image3')}
              {renderImageUpload('Görsel 4 (Sağ Alt)', 'image4')}
            </div>
            {renderArrayEditor('items', [
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'title', label: 'Madde Metni', type: 'text'}
            ], "Özellik Listesi")}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'URL', type: 'url'},
              {key: 'style', label: 'Stil (primary veya outline)', type: 'text'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'campus_contact' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'title', label: 'Başlık (Adres/Telefon vb.)', type: 'text'},
              {key: 'desc', label: 'İçerik', type: 'textarea'}
            ], "İletişim Bilgileri")}
            <h3 className="font-semibold text-sm">Harita Alanı</h3>
            {renderTextareaWithStyle('Harita iframe Kodu (Eğer varsa alttakiler geçersiz olur)', 'mapCode')}
            {renderImageUpload('Harita Yedek Görseli', 'image')}
            {renderInputWithStyle('Harita İçi Kart Başlığı', 'cardTitle')}
            {renderInputWithStyle('Harita İçi Kart Alt Metni', 'cardDesc')}
            {renderArrayEditor('buttons', [
              {key: 'url', label: 'Yol Tarifi Linki', type: 'url'},
              {key: 'icon', label: 'İkon (örn: directions)', type: 'icon'}
            ], "Harita Butonu (Maks 1)")}
          </div>
        )}

        {block.type === 'contact_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
          </div>
        )}

        {block.type === 'contact_campuses' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Kampüs Adı', type: 'text'},
              {key: 'badge', label: 'Rozet (Örn: ERYAMAN)', type: 'text'},
              {key: 'address', label: 'Adres', type: 'textarea'},
              {key: 'phone', label: 'Telefon', type: 'text'},
              {key: 'image', label: 'Harita Görseli (Yedek)', type: 'image'},
              {key: 'mapCode', label: 'Harita Kodu (iframe, Google Maps vs.)', type: 'textarea'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'},
              {key: 'url', label: 'Yol Tarifi Linki', type: 'url'}
            ], "Kampüs Kartları")}
          </div>
        )}

        {block.type === 'contact_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
          </div>
        )}

        {block.type === 'club_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Form Başlığı', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-2">Form Görünüm & CSS Renk Ayarları</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Başlık Bölümü Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.headerBgColor || '#002147'} onChange={(e) => handleStyleChange('headerBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.headerBgColor || ''} onChange={(e) => handleStyleChange('headerBgColor', e.target.value)} placeholder="#002147" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Form Kartı Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.cardBgColor || '#ffffff'} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.cardBgColor || ''} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} placeholder="#ffffff" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {renderArrayEditor('clubs', [
              { key: 'id', label: 'Kulüp ID (boşluksuz)', type: 'text' },
              { key: 'label', label: 'Kulüp Adı', type: 'text' },
              { key: 'icon', label: 'İkon', type: 'icon' },
            ], "Kulüpler")}

            {renderArrayEditor('inputs', [
              { key: 'type', label: 'Alan Tipi (Görev Seçimi)', type: 'select', options: [
                { value: 'text', label: 'Kısa Metin (Tek Satır Metin)' },
                { value: 'select', label: 'Açılır Liste / Seçim Kutusu (Dropdown)' },
                { value: 'radio', label: 'Çoktan Seçmeli (Radyo Butonları)' },
                { value: 'checkbox', label: 'Onay Kutusu (Checkbox)' },
                { value: 'date', label: 'Tarih Seçici (Date)' },
                { value: 'tel', label: 'Telefon Numarası (Phone)' },
                { value: 'email', label: 'E-Posta Adresi (Email)' },
                { value: 'textarea', label: 'Uzun Metin Kutusu (Textarea)' },
                { value: 'section_title', label: 'Bölüm / Kısım Başlığı (Section Header)' }
              ] },
              { key: 'label', label: 'Görünen Etiket / Metin (Örn: Kampüs Seçimi)', type: 'text' },
              { key: 'name', label: 'Alan Kimliği / Key (İngilizce/Boşluksuz)', type: 'text' },
              { key: 'placeholder', label: 'Yer Tutucu Metin (Örn: Kampüs Seçiniz)', type: 'text' },
              { key: 'options', label: 'Seçenekler (Açılır liste veya radio için virgülle ayırın: Örn: Eryaman Kampüsü, Oran Kampüsü)', type: 'textarea' },
              { key: 'required', label: 'Zorunlu Alan Mı?', type: 'checkbox' },
              { key: 'fullWidth', label: 'Tam Genişlik (2 Sütun Kaplasın Mı?)', type: 'checkbox' },
              { key: 'icon', label: 'İkon', type: 'icon' },
            ], "Form Alanları (İnputlar)")}
          </div>
        )}
        
        {block.type === 'pre_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Form Başlığı (Örn: ÖĞRENCİ ÖN KAYIT FORMU)', 'title')}
            {renderInputWithStyle('Alt Başlık (Örn: Lütfen Formu Eksiksiz Doldurunuz.)', 'subtitle')}
            {renderInputWithStyle('Webhook URL (Opsiyonel: Form gönderilince verilerin iletileceği URL)', 'webhookUrl')}
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-2">Form Görünüm & CSS Renk Ayarları</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Başlık Bölümü Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.headerBgColor || '#002147'} onChange={(e) => handleStyleChange('headerBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.headerBgColor || ''} onChange={(e) => handleStyleChange('headerBgColor', e.target.value)} placeholder="#002147" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Form Kartı Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.cardBgColor || '#ffffff'} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.cardBgColor || ''} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} placeholder="#ffffff" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {renderArrayEditor('inputs', [
              { key: 'type', label: 'Alan Tipi (Görev Seçimi)', type: 'select', options: [
                { value: 'text', label: 'Kısa Metin (Tek Satır Metin)' },
                { value: 'select', label: 'Açılır Liste / Seçim Kutusu (Dropdown)' },
                { value: 'radio', label: 'Çoktan Seçmeli (Radyo Butonları)' },
                { value: 'checkbox', label: 'Onay Kutusu (Checkbox)' },
                { value: 'date', label: 'Tarih Seçici (Date)' },
                { value: 'tel', label: 'Telefon Numarası (Phone)' },
                { value: 'email', label: 'E-Posta Adresi (Email)' },
                { value: 'textarea', label: 'Uzun Metin Kutusu (Textarea)' },
                { value: 'section_title', label: 'Bölüm / Kısım Başlığı (Section Header)' }
              ] },
              { key: 'label', label: 'Görünen Etiket / Metin (Örn: Kampüs Seçimi)', type: 'text' },
              { key: 'name', label: 'Alan Kimliği / Key (İngilizce/Boşluksuz)', type: 'text' },
              { key: 'placeholder', label: 'Yer Tutucu Metin (Örn: Kampüs Seçiniz)', type: 'text' },
              { key: 'options', label: 'Seçenekler (Açılır liste veya radio için virgülle ayırın: Örn: Eryaman Kampüsü, Oran Kampüsü)', type: 'textarea' },
              { key: 'required', label: 'Zorunlu Alan Mı?', type: 'checkbox' },
              { key: 'fullWidth', label: 'Tam Genişlik (2 Sütun Kaplasın Mı?)', type: 'checkbox' },
              { key: 'icon', label: 'İkon', type: 'icon' },
            ], "Form Alanları (İnputlar)")}
          </div>
        )}

                {block.type === 'edu_system_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
          </div>
        )}

        {block.type === 'edu_system_levels' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' },
              { key: 'url', label: 'Link URL', type: 'url' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox' }
            ], 'Kademeler (Items)')}
          </div>
        )}

        {block.type === 'edu_system_yadep' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' }
            ], 'YADEP Kartları (Items)')}
          </div>
        )}

        {block.type === 'edu_system_philosophy' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık (Açıklama)', 'subtitle')}
            {renderImageUpload('Görsel URL', 'image')}
            {renderInputWithStyle('Kayan Kart İkonu', 'cardIcon')}
            {renderInputWithStyle('Kayan Kart Başlığı', 'cardTitle')}
            {renderInputWithStyle('Kayan Kart Açıklaması', 'cardDesc')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' }
            ], 'Özellikler (Items)')}
          </div>
        )}

        {block.type === 'edu_system_cta' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('buttons', [
              { key: 'label', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Link URL', type: 'url' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' }
            ], 'Butonlar')}
          </div>
        )}

        {block.type === 'career_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Hero Başlığı', 'title')}
            {renderInputWithStyle('Hero Alt Başlığı', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli URL', 'image')}
            {renderInputWithStyle('Buton Metni', 'buttonText')}
          </div>
        )}
        
        {block.type === 'career_benefits' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' },
              { key: 'iconColor', label: 'İkon Rengi (Sınıf)', type: 'text' },
              { key: 'iconBg', label: 'İkon Arka Plan (Sınıf)', type: 'text' }
            ], 'Avantajlar (Items)')}
          </div>
        )}

        {block.type === 'career_application' && (
          <div className="space-y-4">
            {renderInputWithStyle('Pozisyonlar Başlığı', 'title')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Pozisyon Başlığı', type: 'text' },
              { key: 'type', label: 'Çalışma Tipi (örn: TAM ZAMANLI)', type: 'text' },
              { key: 'dept', label: 'Bölüm (örn: Lise Bölümü)', type: 'text' },
              { key: 'val', label: 'Değer / ID', type: 'text' }
            ], 'Açık Pozisyonlar (Items)')}
            
            <div className="border-t border-slate-200 my-6"></div>
            
            <h4 className="text-sm font-bold text-slate-800 mb-4">Form Alanları (Inputs)</h4>
            
{renderArrayEditor('inputs', [
              { key: 'type', label: 'Veri Tipi (Giriş Türü)', type: 'select', options: [
                { value: 'text', label: 'Kısa Metin (Text)' },
                { value: 'select', label: 'Açılır Liste Seçimi (Select/Dropdown)' },
                { value: 'radio', label: 'Tekli Seçim (Radio)' },
                { value: 'checkbox', label: 'Onay Kutusu (Checkbox)' },
                { value: 'date', label: 'Tarih Seçici (Date)' },
                { value: 'tel', label: 'Telefon Numarası (Phone)' },
                { value: 'email', label: 'E-Posta Adresi (Email)' },
                { value: 'textarea', label: 'Uzun Metin Kutusu (Textarea)' },
                { value: 'file', label: 'Dosya Yükleme (Örn: CV)' },
                { value: 'section_title', label: 'Bölüm / Kısım Başlığı (Section Header)' }
              ] },
              { key: 'label', label: 'Görünen Etiket / Metin', type: 'text' },
              { key: 'name', label: 'Alan Kimliği / Key (İngilizce/Boşluksuz)', type: 'text' },
              { key: 'placeholder', label: 'Yer Tutucu Metin', type: 'text' },
              { key: 'options', label: 'Seçenekler (Açılır liste veya radio için virgülle ayırın)', type: 'textarea' },
              { key: 'required', label: 'Zorunlu Alan Mı?', type: 'checkbox' },
              { key: 'fullWidth', label: 'Tam Genişlik (2 Sütun Kaplasın Mı?)', type: 'checkbox' },
              { key: 'icon', label: 'İkon', type: 'icon' },
            ], "Form Alanları (İnputlar)")}
          </div>
        )}

        {block.type === 'bursluluk_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Rozet / Etiket (Örn: 2026-2027 EĞİTİM YILI)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderArrayEditor('stats', [
              { key: 'value', label: 'Değer (Örn: 16-17 Mart)', type: 'text' },
              { key: 'label', label: 'Etiket (Örn: Sınav Tarihi)', type: 'text' }
            ], "Öne Çıkan Bilgiler / İstatistikler")}
          </div>
        )}

        {block.type === 'bursluluk_exam_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Form Başlığı (Örn: Bursluluk Sınavı Başvuru Formu)', 'title')}
            {renderInputWithStyle('Alt Başlık (Örn: Lütfen bilgilerinizi eksiksiz doldurunuz.)', 'subtitle')}
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-2">Form Görünüm & CSS Renk Ayarları</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Başlık Bölümü Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.headerBgColor || '#002147'} onChange={(e) => handleStyleChange('headerBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.headerBgColor || ''} onChange={(e) => handleStyleChange('headerBgColor', e.target.value)} placeholder="#002147" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Form Kartı Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.cardBgColor || '#ffffff'} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.cardBgColor || ''} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} placeholder="#ffffff" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {renderArrayEditor('inputs', [
              { key: 'type', label: 'Alan Tipi (Görev Seçimi)', type: 'select', options: [
                { value: 'text', label: 'Kısa Metin (Tek Satır Metin)' },
                { value: 'select', label: 'Açılır Liste / Seçim Kutusu (Dropdown)' },
                { value: 'radio', label: 'Çoktan Seçmeli (Radyo Butonları)' },
                { value: 'checkbox', label: 'Onay Kutusu (Checkbox)' },
                { value: 'date', label: 'Tarih Seçici (Date)' },
                { value: 'tel', label: 'Telefon Numarası (Phone)' },
                { value: 'email', label: 'E-Posta Adresi (Email)' },
                { value: 'textarea', label: 'Uzun Metin Kutusu (Textarea)' },
                { value: 'section_title', label: 'Bölüm / Kısım Başlığı (Section Header)' }
              ] },
              { key: 'label', label: 'Görünen Etiket / Metin (Örn: Sınıf Seviyesi)', type: 'text' },
              { key: 'name', label: 'Alan Kimliği / Key (İngilizce/Boşluksuz)', type: 'text' },
              { key: 'placeholder', label: 'Yer Tutucu Metin', type: 'text' },
              { key: 'options', label: 'Seçenekler (Virgülle ayırın: Örn: 4. Sınıf, 5. Sınıf)', type: 'textarea' },
              { key: 'required', label: 'Zorunlu Alan Mı?', type: 'checkbox' },
              { key: 'fullWidth', label: 'Tam Genişlik (2 Sütun Kaplasın Mı?)', type: 'checkbox' },
              { key: 'icon', label: 'İkon', type: 'icon' },
            ], "Form Alanları (İnputlar)")}
          </div>
        )}

        {block.type === 'bursluluk_confirmation' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başarı Başlığı (Örn: Başvurunuz Başarıyla Alındı!)', 'title')}
            {renderTextareaWithStyle('Açıklama Metni (Örn: Sınav giriş belgeniz aşağıda oluşturulmuştur...)', 'subtitle')}
            {renderInputWithStyle('Belge Başlığı (Örn: Bursluluk Sınavı Giriş Belgesi)', 'documentTitle')}
            {renderImageUpload('Belge Logosu', 'documentLogo')}
            {renderInputWithStyle('Belge No Öneki (Örn: BELGE NO: )', 'documentNoPrefix')}
            {renderInputWithStyle('Sınav Tarihi (Örn: 16 Mart 2026)', 'examDate')}
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-2">Belge Kartı Görünüm Ayarları</span>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Arka Plan Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardBgColor || '#ffffff'} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                  <input type="text" value={block.styles?.cardBgColor || ''} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} placeholder="#ffffff" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                </div>
              </div>
            </div>

            {renderArrayEditor('rules', [
              { key: 'rule', label: 'Sınav Kuralı Metni', type: 'text' }
            ], "Sınav Kuralları Listesi")}

            {renderArrayEditor('requiredDocuments', [
              { key: 'docName', label: 'Gerekli Belge Adı', type: 'text' }
            ], "Gerekli Belgeler Listesi")}
          </div>
        )}

        {block.type === 'bursluluk_info_cards' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon', type: 'icon' },
              { key: 'title', label: 'Kart Başlığı', type: 'text' },
              { key: 'rules', label: 'Maddeler / Kurallar (Her satıra veya virgülle ayırın)', type: 'textarea' }
            ], "Bilgilendirme Kartları")}
          </div>
        )}

        {block.type === 'bursluluk_result_query' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderInputWithStyle('Buton Metni', 'buttonText')}
            {renderImageUpload('Görsel', 'image')}
          </div>
        )}

        {block.type === 'social_media' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'icon', label: 'İkon (SVG Kodu)', type: 'icon'},
              {key: 'url', label: 'Profil Linki', type: 'url'}
            ], "Sosyal Medya Linkleri")}
          </div>
        )}

        {block.type === 'clubs_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2', 'titlePart2')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arkaplan Görseli', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'clubs_grid' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Filtre Kategorileri (Virgülle ayrılmış)', 'categories')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'category', label: 'Kategori', type: 'text'},
              {key: 'badge', label: 'Rozet (Örn: Kontenjan: 5 Kişi)', type: 'text'},
              {key: 'badgeColor', label: 'Rozet Rengi Tipi', type: 'select', options: [{value: 'secondary', label: 'Turkuaz'}, {value: 'error', label: 'Kırmızı'}]},
              {key: 'icon', label: 'Kategori İkonu', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'url', label: 'Detay Linki', type: 'url'}
            ], "Kulüp Kartları")}
          </div>
        )}

        {block.type === 'clubs_benefits' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'}
            ], "Avantaj Kartları")}
          </div>
        )}

        {block.type === 'clubs_cta' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'high_school_hero' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Üst Başlık (Rozet)', 'badge')}
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2 (Renkli)', 'titlePart2')}
            {renderInputWithStyle('Başlık Bölüm 2 Rengi', 'titlePart2Color')}
            {renderTextareaWithStyle('Açıklama Metni', 'subtitle')}
            {renderImageUpload('Görsel (Sağ Kısım)', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'high_school_programs' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderTextareaWithStyle('Alt Açıklama', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'features', label: 'Özellikler (Her satıra bir tane)', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'styleType', label: 'Stil Tipi', type: 'select', options: [{value: 'primary', label: 'Primary (Mavi)'}, {value: 'secondary', label: 'Secondary (Turkuaz)'}]}
            ], "Program Kartları")}
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
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (Varsayılan)', type: 'select', options: [{value: 'primary', label: 'Birincil'}, {value: 'secondary', label: 'İkincil'}, {value: 'outline', label: 'Çizgili'}, {value: 'ghost', label: 'Saydam'}]},
              {key: 'bgColor', label: 'Özel Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Özel Yazı Rengi', type: 'color'},
              {key: 'borderColor', label: 'Özel Kenarlık Rengi', type: 'color'},
              {key: 'borderRadius', label: 'Özel Köşe Yuvarlama (Örn: 8px)', type: 'text'},
              {key: 'primary', label: 'Birincil Buton (Eski)', type: 'checkbox'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'bento_academic' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'stat', label: 'İstatistik (Kart 1)', type: 'text'},
              {key: 'statLabel', label: 'İstatistik Etiketi (Kart 1)', type: 'text'},
              {key: 'tag', label: 'Rozet/Etiket (Kart 1)', type: 'text'},
              {key: 'buttonText', label: 'Buton Metni (Kart 2)', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'},
              {key: 'url', label: 'Buton URL (Kart 2)', type: 'url'}
            ], "Öğeler (Max 3, Özel Tasarım)")}
          </div>
        )}

        {block.type === 'achievements_grid' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'subtitle', label: 'Alt Başlık', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'hoverText', label: 'Hover Üzeri Yazı', type: 'text'}
            ], "Kültür / Sanat Başarı Öğeleri")}
          </div>
        )}

        {block.type === 'achievements_science' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Görsel Üzeri Rozet', 'highlightTag')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'}
            ], "Bilim Projeleri")}
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
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'},
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
        {block.type === 'menu_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Badge (Etiket)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arkaplan Resmi', 'image')}
          </div>
        )}
        {block.type === 'menu_calendar' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderInputWithStyle('Ay (örn: Ekim 2023)', 'month')}
            {renderArrayEditor('days', [
              {key: 'date', label: 'Tarih (örn: 1 Paz)', type: 'text'},
              {key: 'kcal', label: 'Kalori (örn: 850 kcal)', type: 'text'},
              {key: 'meals', label: 'Yemekler (Virgülle Ayırın)', type: 'textarea'},
              {key: 'isCurrentMonth', label: 'Geçerli Ay Mı? (İşaretlenmezse silik görünür)', type: 'checkbox'},
              {key: 'isClosed', label: 'Tatil / Kapalı Mı?', type: 'checkbox'},
              {key: 'isToday', label: 'Bugün Mü?', type: 'checkbox'}
            ], "Takvim Günleri")}
          </div>
        )}
        {block.type === 'menu_features' && (
          <div className="space-y-4">
            {renderArrayEditor('items', [
              {key: 'icon', label: 'İkon (örn: nutrition)', type: 'icon'},
              {key: 'iconColor', label: 'Özel İkon Rengi', type: 'color'},
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'itemTitleColor', label: 'Özel Başlık Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Özel Açıklama Rengi', type: 'color'}
            ], "Özellikler")}
          </div>
        )}
        {block.type === 'academic_calendar_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arkaplan Resmi', 'image')}
          </div>
        )}
        {block.type === 'academic_calendar' && (
          <div className="space-y-4">
            {renderInputWithStyle('Ay (örn: Ekim 2023)', 'month')}
            {renderInputWithStyle('PDF URL', 'pdfUrl')}
            {renderInputWithStyle('PDF Buton Metni', 'pdfButtonText')}
            
            {renderArrayEditor('days', [
              {key: 'date', label: 'Tarih (Sadece sayı, örn: 1)', type: 'text'},
              {key: 'isCurrentMonth', label: 'Geçerli Ay Mı? (İşaretlenmezse silik görünür)', type: 'checkbox'},
              {key: 'isWeekend', label: 'Hafta Sonu Mu?', type: 'checkbox'},
              {key: 'isToday', label: 'Bugün Mü?', type: 'checkbox'},
              {key: 'bgColor', label: 'Hücre Arkaplan Rengi (örn: bg-green-50)', type: 'text'},
              {key: 'eventTitle', label: 'Etkinlik Başlığı', type: 'text'},
              {key: 'eventSubtitle', label: 'Etkinlik Alt Açıklaması', type: 'text'},
              {key: 'eventColorClass', label: 'Etkinlik Sınıfları (örn: bg-secondary-fixed text-on-secondary-fixed-variant border-secondary/20)', type: 'textarea'}
            ], "Takvim Günleri")}

            {renderArrayEditor('legends', [
              {key: 'icon', label: 'İkon (örn: edit_document)', type: 'icon'},
              {key: 'iconBgClass', label: 'İkon Arkaplan Sınıfı (örn: bg-error-container)', type: 'text'},
              {key: 'iconColorClass', label: 'İkon Renk Sınıfı (örn: text-on-error-container)', type: 'text'},
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Link Metni (İncele)', type: 'text'}, {key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox'},
              {key: 'itemTitleColor', label: 'Özel Başlık Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Özel Açıklama Rengi', type: 'color'}
            ], "Lejant (Açıklama) Kartları")}
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
