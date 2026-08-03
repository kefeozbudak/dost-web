import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X, Sparkles } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

const POPULAR_CLUB_ICONS = [
  { name: 'Palette', label: 'Resim / Sanat', icon: LucideIcons.Palette },
  { name: 'Music', label: 'Müzik', icon: LucideIcons.Music },
  { name: 'BookOpen', label: 'Okuma / Kitap', icon: LucideIcons.BookOpen },
  { name: 'School', label: 'Eğitim / Okul', icon: LucideIcons.School },
  { name: 'GraduationCap', label: 'Mezuniyet', icon: LucideIcons.GraduationCap },
  { name: 'Trophy', label: 'Yarışma / Ödül', icon: LucideIcons.Trophy },
  { name: 'Dumbbell', label: 'Spor / Egzersiz', icon: LucideIcons.Dumbbell },
  { name: 'Code', label: 'Yazılım / Kodlama', icon: LucideIcons.Code },
  { name: 'Camera', label: 'Fotoğrafçılık', icon: LucideIcons.Camera },
  { name: 'Compass', label: 'Keşif / Doğa', icon: LucideIcons.Compass },
  { name: 'Users', label: 'Topluluk / Kulüp', icon: LucideIcons.Users },
  { name: 'Award', label: 'Başarı / Madalya', icon: LucideIcons.Award },
  { name: 'Sparkles', label: 'Yaratıcılık', icon: LucideIcons.Sparkles },
  { name: 'Smile', label: 'Oyun / Eğlence', icon: LucideIcons.Smile },
  { name: 'Globe', label: 'Yabancı Dil', icon: LucideIcons.Globe },
  { name: 'Flame', label: 'Etkinlik / Dans', icon: LucideIcons.Flame },
];

const MATERIAL_ICONS = [
  { name: 'child_care', label: 'Anaokulu' },
  { name: 'school', label: 'Okul' },
  { name: 'palette', label: 'Sanat' },
  { name: 'music_note', label: 'Müzik' },
  { name: 'sports_soccer', label: 'Futbol' },
  { name: 'code', label: 'Robotik' },
  { name: 'science', label: 'Bilim' },
  { name: 'explore', label: 'Keşif' },
  { name: 'group', label: 'Kulüp' },
  { name: 'theater_comedy', label: 'Tiyatro' },
];

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              İkon Kütüphanesinden İkon Seç
            </h3>
            <p className="text-xs text-slate-500">Listeden bir ikona tıklayarak hemen seçebilirsiniz.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="İkon ara (Örn: palette, music, school, book, code)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {!searchTerm && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Popüler Kulüp & Okul İkonları</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {POPULAR_CLUB_ICONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        onSelect(item.name);
                        onClose();
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/60 hover:text-blue-700 hover:shadow-xs transition-all text-slate-700 cursor-pointer group"
                    >
                      <Icon className="w-6 h-6 mb-1 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[10px] font-bold truncate w-full text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-5 mb-2">Google Material İkonları</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                {MATERIAL_ICONS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onSelect(item.name);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/60 hover:text-blue-700 transition-all text-slate-700 cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-2xl mb-1 text-slate-600 group-hover:text-blue-600">{item.name}</span>
                    <span className="text-[9px] font-medium truncate w-full text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {searchTerm ? 'Arama Sonuçları' : 'Tüm İkonlar (Lucide Library)'}
            </h4>
            {filteredIcons.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm bg-white rounded-xl border border-dashed border-slate-200">
                İkon bulunamadı. Lütfen "palette", "school", "music", "book" gibi bir kelime arayın.
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 bg-white p-3 rounded-xl border border-slate-200">
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
                      className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all text-slate-600 cursor-pointer"
                      title={name}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-mono truncate w-full text-center text-slate-500">{name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

