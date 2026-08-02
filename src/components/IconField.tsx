import { useState } from 'react';
import { Type, Palette, MoveHorizontal, Maximize } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import IconPickerModal from './IconPickerModal';

export function IconPreview({ data, className }: { data?: any; className?: string }) {
  if (!data) return null;
  const name = typeof data === 'string' ? data : data.name;
  if (!name) return null;
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return null;

  const color = data.color && data.color !== 'currentColor' ? data.color : undefined;
  const size = data.size || undefined;

  return <Icon className={className} color={color} size={size} />;
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

  const handleUpdate = (updates: any) => {
    if (typeof value === 'string') {
      onChange({ name: value, ...updates });
    } else {
      onChange({ ...value, ...updates });
    }
  };

  return (
    <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <span className="text-slate-600 flex items-center gap-2">
            {iconName ? (
              <>
                <IconPreview data={value} className="w-5 h-5 text-blue-600" />
                <span className="font-mono text-xs">{iconName}</span>
              </>
            ) : (
              'İkon Seç...'
            )}
          </span>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">Değiştir</span>
        </button>
        {iconName && (
          <button
            type="button"
            onClick={() => typeof value === 'string' ? onChange('') : onChange({ ...value, name: '' })}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="İkonu Kaldır"
          >
            <LucideIcons.Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {showAdvanced && iconName && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
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
              <span className="text-xs font-medium text-slate-700">Sadece İkon Göster (Metni Gizle)</span>
            </label>
          </div>
        </div>
      )}

      <IconPickerModal 
        isOpen={pickerOpen} 
        onClose={() => setPickerOpen(false)} 
        onSelect={(name) => handleUpdate({ name })}
      />
    </div>
  );
}
