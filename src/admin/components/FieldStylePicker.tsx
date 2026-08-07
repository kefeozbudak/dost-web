import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Settings, Palette, Type, AlignLeft, MoveVertical, Box, Square } from 'lucide-react';

const SliderInput = ({ label, value, onChange, min = 0, max = 100 }: any) => {
  return (
    <div>
      <span className="text-[9px] text-slate-400 block mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value || 0}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <input 
          type="number" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 text-xs p-1 border border-slate-200 rounded text-center"
        />
      </div>
    </div>
  );
};


export default function FieldStylePicker({ 
  block, 
  fieldKey, 
  onChange 
}: { 
  block: any; 
  fieldKey: string; 
  onChange: (key: string, value: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, placement: 'left' });

  const styles = block.styles || {};

  const handleChange = (key: string, value: any) => {
    onChange(key, value);
  };

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popupWidth = 288; // w-72
      
      // Calculate horizontal position
      let left = rect.left - popupWidth;
      let placement = 'left';
      
      // If it doesn't fit on the left, try right
      if (left < 10) {
        left = rect.right + 10;
        placement = 'right';
      }
      
      // Calculate vertical position
      let top = rect.top;
      // Prevent it from going off the bottom of the screen
      const maxTop = window.innerHeight - 400 - 20; // 400 is max-h
      if (top > maxTop) {
        top = maxTop;
      }
      // Prevent it from going off the top
      if (top < 10) {
        top = 10;
      }

      setDropdownPos({ top, left, placement });
    }
  }, [isOpen]);

  const color = styles[`${fieldKey}Color`] || '';
  const bgColor = styles[`${fieldKey}BackgroundColor`] || '';
  const size = styles[`${fieldKey}Size`] || '';
  const weight = styles[`${fieldKey}Weight`] || '';

  const mobileSize = styles[`${fieldKey}MobileSize`] || '';
  const mobileAlign = styles[`${fieldKey}MobileAlign`] || '';
  const mobileMarginTop = styles[`${fieldKey}MobileMarginTop`] || '';
  const mobileMarginBottom = styles[`${fieldKey}MobileMarginBottom`] || '';
  const mobilePaddingTop = styles[`${fieldKey}MobilePaddingTop`] || '';
  const mobilePaddingBottom = styles[`${fieldKey}MobilePaddingBottom`] || '';
  const mobilePaddingLeft = styles[`${fieldKey}MobilePaddingLeft`] || '';
  const mobilePaddingRight = styles[`${fieldKey}MobilePaddingRight`] || '';

  const align = styles[`${fieldKey}Align`] || '';
  const marginTop = styles[`${fieldKey}MarginTop`] || '';
  const marginBottom = styles[`${fieldKey}MarginBottom`] || '';
  const paddingTop = styles[`${fieldKey}PaddingTop`] || '';
  const paddingBottom = styles[`${fieldKey}PaddingBottom`] || '';
  const paddingLeft = styles[`${fieldKey}PaddingLeft`] || '';
  const paddingRight = styles[`${fieldKey}PaddingRight`] || '';
  const borderRadius = styles[`${fieldKey}BorderRadius`] || '';

  return (
    <div className="relative">
      <button 
        ref={buttonRef}
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
        title="Yazı ve Kutu Stilini Düzenle"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>

      {isOpen && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[90]" 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="fixed bg-white border border-slate-200 shadow-2xl rounded-xl p-4 z-[100] w-72 max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{
              top: `${dropdownPos.top}px`,
              left: `${dropdownPos.left}px`,
            }}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3 sticky top-0 bg-white z-10">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Görünüm Ayarları</span>
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                    <Palette className="w-3 h-3" /> Metin
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={color === 'currentColor' || !color ? '#000000' : color}
                      onChange={e => handleChange(`${fieldKey}Color`, e.target.value)}
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                    />
                    <input 
                      type="text" 
                      value={color}
                      onChange={e => handleChange(`${fieldKey}Color`, e.target.value)}
                      className="w-full text-xs p-1 border border-slate-200 rounded"
                      placeholder="Varsayılan"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                    <Palette className="w-3 h-3" /> Arka Plan
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={bgColor === 'currentColor' || !bgColor ? '#ffffff' : bgColor}
                      onChange={e => handleChange(`${fieldKey}BackgroundColor`, e.target.value)}
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                    />
                    <input 
                      type="text" 
                      value={bgColor}
                      onChange={e => handleChange(`${fieldKey}BackgroundColor`, e.target.value)}
                      className="w-full text-xs p-1 border border-slate-200 rounded"
                      placeholder="Şeffaf"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                  <Type className="w-3 h-3" /> Yazı Tipi
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                  <SliderInput 
                    label="Boyut (Masaüstü, px)" 
                    value={size ? parseInt(size as string) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}Size`, val ? val + 'px' : '')} 
                    min={10} max={72} 
                  />
                  <SliderInput 
                    label="Boyut (Mobil, px)" 
                    value={mobileSize ? parseInt(mobileSize as string) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobileSize`, val ? val + 'px' : '')} 
                    min={10} max={72} 
                  />
                </div>
                
                <div className="mb-3">
                  <span className="text-[9px] text-slate-400 block mb-1">Kalınlık</span>
                  <select 
                    value={weight}
                    onChange={e => handleChange(`${fieldKey}Weight`, e.target.value)}
                    className="w-full text-xs p-1 border border-slate-200 rounded bg-white"
                  >
                      <option value="">Varsayılan</option>
                      <option value="normal">Normal (400)</option>
                      <option value="medium">Orta (500)</option>
                      <option value="semibold">Yarı Kalın (600)</option>
                      <option value="bold">Kalın (700)</option>
                      <option value="extrabold">Çok Kalın (800)</option>
                      <option value="black">Siyah (900)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block mb-1">Hizalama (Masaüstü)</span>
                  <select 
                    value={align}
                    onChange={e => handleChange(`${fieldKey}Align`, e.target.value)}
                    className="w-full text-xs p-1 border border-slate-200 rounded bg-white"
                  >
                    <option value="">Varsayılan</option>
                    <option value="left">Sola</option>
                    <option value="center">Ortaya</option>
                    <option value="right">Sağa</option>
                    <option value="justify">Yasla</option>
                  </select>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block mb-1">Hizalama (Mobil)</span>
                  <select 
                    value={mobileAlign}
                    onChange={e => handleChange(`${fieldKey}MobileAlign`, e.target.value)}
                    className="w-full text-xs p-1 border border-slate-200 rounded bg-white"
                  >
                    <option value="">Varsayılan</option>
                    <option value="left">Sola</option>
                    <option value="center">Ortaya</option>
                    <option value="right">Sağa</option>
                    <option value="justify">Yasla</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                  <Square className="w-3 h-3" /> Kenar Yumuşatma
                </label>
                <SliderInput 
                  label="Radius (px)" 
                  value={borderRadius ? parseInt(borderRadius as string, 10) || 0 : ''} 
                  onChange={(val: any) => handleChange(`${fieldKey}BorderRadius`, val)} 
                  min={0} max={100} 
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                  <MoveVertical className="w-3 h-3" /> Dış Boşluklar (Margin)
                </label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <SliderInput 
                    label="Üst (Masaüstü, px)" 
                    value={marginTop ? parseInt(marginTop as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MarginTop`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Alt (Masaüstü, px)" 
                    value={marginBottom ? parseInt(marginBottom as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MarginBottom`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Üst (Mobil, px)" 
                    value={mobileMarginTop ? parseInt(mobileMarginTop as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobileMarginTop`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Alt (Mobil, px)" 
                    value={mobileMarginBottom ? parseInt(mobileMarginBottom as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobileMarginBottom`, val)} 
                    min={0} max={120} 
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                  <Box className="w-3 h-3" /> İç Boşluklar (Padding)
                </label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <SliderInput 
                    label="Üst (Masaüstü, px)" 
                    value={paddingTop ? parseInt(paddingTop as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}PaddingTop`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Üst (Mobil, px)" 
                    value={mobilePaddingTop ? parseInt(mobilePaddingTop as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobilePaddingTop`, val)} 
                    min={0} max={120} 
                  />
                  
                  <SliderInput 
                    label="Alt (Masaüstü, px)" 
                    value={paddingBottom ? parseInt(paddingBottom as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}PaddingBottom`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Alt (Mobil, px)" 
                    value={mobilePaddingBottom ? parseInt(mobilePaddingBottom as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobilePaddingBottom`, val)} 
                    min={0} max={120} 
                  />
                  
                  <SliderInput 
                    label="Sol (Masaüstü, px)" 
                    value={paddingLeft ? parseInt(paddingLeft as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}PaddingLeft`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Sol (Mobil, px)" 
                    value={mobilePaddingLeft ? parseInt(mobilePaddingLeft as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobilePaddingLeft`, val)} 
                    min={0} max={120} 
                  />
                  
                  <SliderInput 
                    label="Sağ (Masaüstü, px)" 
                    value={paddingRight ? parseInt(paddingRight as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}PaddingRight`, val)} 
                    min={0} max={120} 
                  />
                  <SliderInput 
                    label="Sağ (Mobil, px)" 
                    value={mobilePaddingRight ? parseInt(mobilePaddingRight as string, 10) || 0 : ''} 
                    onChange={(val: any) => handleChange(`${fieldKey}MobilePaddingRight`, val)} 
                    min={0} max={120} 
                  />
                </div>
              </div>
            </div>
          </div>
        </>, document.body
      )}
    </div>
  );
}
