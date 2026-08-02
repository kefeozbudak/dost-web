import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

export default function IconPickerModal({ isOpen, onClose, onSelect }: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter valid icons
  const iconNames = Object.keys(LucideIcons).filter(
    (name) => name !== 'createLucideIcon' && name !== 'default' && !name.endsWith('Icon')
  );

  const filteredIcons = iconNames.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 200); // Limit to 200 to avoid performance issues

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">İkon Seç</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="İkon ara (İngilizce isimler)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {filteredIcons.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              İkon bulunamadı. Lütfen İngilizce kelimelerle arama yapın (ör: "home", "user", "star").
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {filteredIcons.map((name) => {
                const Icon = (LucideIcons as any)[name];
                if (!Icon) return null;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onSelect(name);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:shadow-sm transition-all text-slate-600"
                    title={name}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-[9px] truncate w-full text-center">{name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
