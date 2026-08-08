import { useState } from 'react';
import { Type, Palette, MoveHorizontal, Maximize, LayoutGrid, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import IconPickerModal from './IconPickerModal';

export function IconPreview({ data, className, style }: { data?: any; className?: string; style?: any }) {
  if (!data) return null;
  const name = typeof data === 'string' ? data : data.name;
  if (!name) return null;

  const cleanName = name.replace(/^lucide:/i, '');

  const dAlign = style?.['--desktop-text-align'];
  const mAlign = style?.['--mobile-text-align'];
  const customDataProps: any = {};
  if (dAlign) customDataProps['data-desktop-align'] = dAlign.replace('px', '').trim();
  if (mAlign) customDataProps['data-mobile-align'] = mAlign.replace('px', '').trim();

  
  if (cleanName.trim().toLowerCase().includes('<svg')) {
    return <span {...customDataProps} className={`inline-flex items-center justify-center ${className || ''}`} style={style} dangerouslySetInnerHTML={{ __html: cleanName }} />;
  }

  const Icon = (LucideIcons as any)[cleanName];
  if (Icon) {
    const color = data.color && data.color !== 'currentColor' ? data.color : undefined;
    const size = data.size || undefined;
    return <Icon {...customDataProps} className={className} color={color} size={size} style={style} />;
  }

  // Fallback to Google Material Symbols
  return <span {...customDataProps} className={`material-symbols-outlined ${className || ''}`} style={style} translate="no" aria-hidden="true">{cleanName}</span>;
}

export default function IconField({ 
  value, 
  onChange,
  showAdvanced = false
}: { 
  value: any; 
  onChange: (val: any) => void;
  showAdvanced?: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const iconName = typeof value === 'string' ? value : value?.name || '';
  const color = value?.color || 'currentColor';
  const size = value?.size || 24;
  const position = value?.position || 'left';
  const iconOnly = value?.iconOnly || false;

  const handleNameChange = (newName: string) => {
    if (typeof value === 'object' && value !== null) {
      onChange({ ...value, name: newName });
    } else {
      onChange(newName);
    }
  };

  const handleUpdate = (updates: any) => {
    if (typeof value === 'string') {
      onChange({ name: value, ...updates });
    } else {
      onChange({ ...value, ...updates });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Live Icon Preview Box */}
        <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
          {iconName ? (
            <IconPreview data={value} className="w-5 h-5" />
          ) : (
            <span className="text-slate-300 text-[10px] uppercase font-bold">Yok</span>
          )}
        </div>

        {/* Input Text Box */}
        <input 
          type="text" 
          value={iconName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="İkon adı (Örn: palette, Music...)"
          className="flex-1 px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Visual Icon Picker Button */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
          title="İkon Kütüphanesinden Görerek Seç"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>İkon Seç</span>
        </button>

        {iconName && (
          <button
            type="button"
            onClick={() => handleNameChange('')}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="İkonu Temizle"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showAdvanced && iconName && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg pt-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
              <Palette className="w-3 h-3" /> Renk
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={color === 'currentColor' ? '#000000' : color}
                onChange={e => handleUpdate({ color: e.target.value })}
                className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
              />
              <input 
                type="text" 
                value={color}
                onChange={e => handleUpdate({ color: e.target.value })}
                className="w-full text-xs p-1 border border-slate-200 rounded"
                placeholder="currentColor"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
              <Maximize className="w-3 h-3" /> Boyut (px)
            </label>
            <input 
              type="number" 
              value={size}
              onChange={e => handleUpdate({ size: Number(e.target.value) })}
              className="w-full text-xs p-1.5 border border-slate-200 rounded"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
              <MoveHorizontal className="w-3 h-3" /> Konum
            </label>
            <select 
              value={position}
              onChange={e => handleUpdate({ position: e.target.value })}
              className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white"
            >
              <option value="left">Solda</option>
              <option value="right">Sağda</option>
              <option value="top">Üstte</option>
            </select>
          </div>
          <div className="flex items-center mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={iconOnly}
                onChange={e => handleUpdate({ iconOnly: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Sadece İkon Göster</span>
            </label>
          </div>
        </div>
      )}

      <IconPickerModal 
        isOpen={pickerOpen} 
        onClose={() => setPickerOpen(false)} 
        onSelect={(selectedName) => handleNameChange(selectedName)}
      />
    </div>
  );
}

