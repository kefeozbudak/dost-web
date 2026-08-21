import React, { useState, useRef, useEffect } from "react";
import { Plus, GripVertical, Trash2, ArrowUp, ArrowDown, Copy, Trash } from "lucide-react";
import IconField from "../components/IconField";
import MediaPickerModal from "../components/MediaPickerModal";
import FieldStylePicker from "./components/FieldStylePicker";
import {
  DEFAULT_PRE_REGISTRATION_INPUTS,
  DEFAULT_CLUB_INPUTS,
  DEFAULT_SCHOLARSHIP_INPUTS,
  DEFAULT_CAREER_INPUTS,
  DEFAULT_CONTACT_INPUTS, DEFAULT_QUICK_CONTACT_INPUTS,
} from "../lib/defaultFormInputs";

import CalendarGridEditor from "./CalendarGridEditor";
interface BlockFormEditorProps {
  activeArrayItem?: { arrayKey: string; index: number } | null;
  block: any;
  onChange: (block: any) => void;
  pagesList?: any[];
  onSave?: () => Promise<void> | void;
  saving?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export default function BlockFormEditor({
  block,
  onChange,
  pagesList,
  onSave,
  saving,
  activeArrayItem,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete
}: BlockFormEditorProps) {
  const arrayItemRefs = useRef<{ [key: string]: HTMLDetailsElement | null }>(
    {},
  );
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
  }, [activeArrayItem]);

  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  }>({ isOpen: false, onSelect: () => {} });

  if (!block)
    return (
      <div className="text-sm text-slate-500 text-center py-8">
        Lütfen düzenlemek için bir modül seçin.
      </div>
    );

  const handleChange = (key: string, value: any) => {
    const updated = { ...block, [key]: value };
    if (key === "url" || key === "buttonUrl") {
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
    if (arrayKey === "items" && (!current || current.length === 0)) {
      if (block.type === "career_benefits")
        return [
          {
            title: "Sürekli Gelişim",
            desc: "Eğitim sektöründe sürekli eğitim...",
            icon: "psychology",
            iconColor: "text-primary",
            iconBg: "bg-primary/10",
          },
          {
            title: "Kurumsal Güven",
            desc: "Dürüstlük ve istikrar temeli...",
            icon: "verified_user",
            iconColor: "text-[#D4AF37]",
            iconBg: "bg-yellow-100",
          },
          {
            title: "Huzurlu Ortam",
            desc: "Kampüslerimiz hem öğrenciler...",
            icon: "spa",
            iconColor: "text-emerald-700",
            iconBg: "bg-emerald-100",
          },
        ];
      if (block.type === "career_application") return [];
    }
    if (arrayKey === "inputs" && (!current || current.length === 0)) {
      if (block.type === "pre_registration_form")
        return DEFAULT_PRE_REGISTRATION_INPUTS;
      if (block.type === "contact_form") return DEFAULT_CONTACT_INPUTS;
      if (block.type === "quick_contact_form") return DEFAULT_QUICK_CONTACT_INPUTS;
      if (block.type === "club_registration_form") return DEFAULT_CLUB_INPUTS;
      if (block.type === "career_application") return DEFAULT_CAREER_INPUTS;
      if (block.type === "bursluluk_exam_form")
        return DEFAULT_SCHOLARSHIP_INPUTS;
      return [];
    }
    return current || [];
  };

  const handleArrayChange = (
    arrayKey: string,
    index: number,
    itemKey: string,
    value: any,
  ) => {
    const currentArray = getEffectiveArray(arrayKey);
    const newArray = currentArray.map((item: any) => ({ ...item }));
    newArray[index] = { ...newArray[index], [itemKey]: value };
    if (itemKey === "url" || itemKey === "buttonUrl") {
      newArray[index].url = value;
      newArray[index].buttonUrl = value;
      newArray[index].link = value;
    }
    if (
      arrayKey === "inputs" &&
      itemKey === "label" &&
      (!newArray[index].name || newArray[index].name.startsWith("input_"))
    ) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .substring(0, 20);
      if (slug) newArray[index].name = slug;
    }
    handleChange(arrayKey, newArray);
  };

  const renderInputWithStyle = (label: string, key: string) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        <FieldStylePicker
          block={block}
          fieldKey={key}
          onChange={handleStyleChange}
        />
      </div>
      <input
        type="text"
        value={block[key] || ""}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
      />
    </div>
  );

  const renderUrlInputWithStyle = (label: string, key: string) => {
    const val = block[key] || "";
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
          <FieldStylePicker
            block={block}
            fieldKey={key}
            onChange={handleStyleChange}
          />
        </div>
        <div className="flex gap-2 w-full">
          <select
            value={
              val === "/" || pagesList?.find((p) => p.path === val)
                ? val
                : "custom"
            }
            onChange={(e) => {
              if (e.target.value !== "custom") {
                handleChange(key, e.target.value);
                if (key === "buttonUrl") handleChange("url", e.target.value);
                if (key === "url") handleChange("buttonUrl", e.target.value);
              }
            }}
            className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="custom">Sayfa Seç</option>
            <option value="/">Ana Sayfa (/)</option>
            {pagesList
              ?.filter((p) => p.id !== "home")
              .map((p) => (
                <option key={p.id} value={p.path}>
                  {p.title} ({p.path})
                </option>
              ))}
          </select>
          <input
            type="text"
            value={val}
            onChange={(e) => {
              handleChange(key, e.target.value);
              if (key === "buttonUrl") handleChange("url", e.target.value);
              if (key === "url") handleChange("buttonUrl", e.target.value);
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
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        <FieldStylePicker
          block={block}
          fieldKey={key}
          onChange={handleStyleChange}
        />
      </div>
      <textarea
        value={block[key] || ""}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 min-h-[100px]"
      />
    </div>
  );

  const renderCheckbox = (label: string, key: string) => (
    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <input
        type="checkbox"
        checked={block[key] === true}
        onChange={(e) => handleChange(key, e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded border-gray-300"
      />
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>
    </div>
  );

  const renderImageUpload = (label: string, key: string) => (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={block[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          placeholder="https://..."
        />
        <button
          type="button"
          onClick={() =>
            setMediaPickerConfig({
              isOpen: true,
              onSelect: (url) => handleChange(key, url || ""),
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap shadow-sm transition-colors"
        >
          Seç
        </button>
      </div>
      {block[key] && (
        <div className="grid grid-cols-1 gap-3 mt-2 pt-3 border-t border-slate-200">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Sol/Sağ (X)
              </label>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                {block[`${key}_posX`] ?? 50}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={block[`${key}_posX`] ?? 50}
              onChange={(e) =>
                handleChange(`${key}_posX`, Number(e.target.value))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Üst/Alt (Y)
              </label>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                {block[`${key}_posY`] ?? 50}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={block[`${key}_posY`] ?? 50}
              onChange={(e) =>
                handleChange(`${key}_posY`, Number(e.target.value))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Yakınlaştır
              </label>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                {block[`${key}_scale`] ?? 100}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="1"
              value={block[`${key}_scale`] ?? 100}
              onChange={(e) =>
                handleChange(`${key}_scale`, Number(e.target.value))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderArrayEditor = (
    arrayKey: string,
    itemFields: {
      key: string;
      label: string;
      type:
        | "text"
        | "textarea"
        | "icon"
        | "image"
        | "checkbox"
        | "url"
        | "color"
        | "select";
      options?: { value: string; label: string }[];
    }[],
    title: string = "Öğeler",
    hasStyles: boolean = true,
    arrayStyleKey?: string,
  ) => {
    const currentArray = getEffectiveArray(arrayKey);

    const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData("text/plain", index.toString());
    };
    const handleDrop = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (fromIndex === index) return;

      const newArray = currentArray.map((item: any) => ({ ...item }));
      const [movedItem] = newArray.splice(fromIndex, 1);
      newArray.splice(index, 0, movedItem);
      handleChange(arrayKey, newArray);
    };
    const moveItemUp = (index: number) => {
      if (index === 0) return;
      const newArray = [...currentArray];
      const temp = newArray[index - 1];
      newArray[index - 1] = newArray[index];
      newArray[index] = temp;
      handleChange(arrayKey, newArray);
    };

    const moveItemDown = (index: number) => {
      if (index === currentArray.length - 1) return;
      const newArray = [...currentArray];
      const temp = newArray[index + 1];
      newArray[index + 1] = newArray[index];
      newArray[index] = temp;
      handleChange(arrayKey, newArray);
    };

    const duplicateItem = (index: number) => {
      const newArray = [...currentArray];
      const itemToDuplicate = JSON.parse(JSON.stringify(newArray[index]));
      newArray.splice(index + 1, 0, itemToDuplicate);
      handleChange(arrayKey, newArray);
    };

    return (
      <div className="border-t border-slate-200 pt-4 mt-4">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              {title}
            </label>
            {arrayStyleKey && (
              <FieldStylePicker
                block={block}
                fieldKey={arrayStyleKey}
                onChange={handleStyleChange}
              />
            )}
          </div>
          {hasStyles && (
            <div className="flex flex-wrap gap-2 items-center bg-slate-100 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase">
                Başlık Stili:
              </span>
              <FieldStylePicker
                block={block}
                fieldKey="itemTitle"
                onChange={handleStyleChange}
              />
              <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">
                Açıklama Stili:
              </span>
              <FieldStylePicker
                block={block}
                fieldKey="itemDesc"
                onChange={handleStyleChange}
              />
              <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">
                Buton Stili:
              </span>
              <FieldStylePicker
                block={block}
                fieldKey="itemButton"
                onChange={handleStyleChange}
              />
              <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">
                İkon Stili:
              </span>
              <FieldStylePicker
                block={block}
                fieldKey="icon"
                onChange={handleStyleChange}
              />
            </div>
          )}
        </div>
        {currentArray.map((item: any, idx: number) => (
          <details
            key={idx}
            ref={(el) => {
              arrayItemRefs.current[`${arrayKey}-${idx}`] = el;
            }}
            className="group/item bg-slate-50 rounded-lg border border-slate-200 mb-2"
          >
            <summary className="flex gap-2 items-center p-3 cursor-pointer list-none select-none">
              <span className="material-symbols-outlined text-[16px] text-slate-400 group-open/item:rotate-90 transition-transform">
                chevron_right
              </span>
              <div className="flex-1 font-bold text-xs text-slate-600 truncate">
                {typeof item === "string" ? (
                  item
                ) : arrayKey === "inputs" ? (
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase shrink-0">
                      {item.type === "section_title"
                        ? "📌 Bölüm"
                        : item.type === "select"
                          ? "🔽 Açılır Liste"
                          : item.type === "radio"
                            ? "🔘 Radio"
                            : item.type === "checkbox"
                              ? "☑️ Checkbox"
                              : item.type === "date"
                                ? "📅 Tarih"
                                : item.type === "tel"
                                  ? "📞 Telefon"
                                  : item.type === "email"
                                    ? "✉️ E-Posta"
                                    : item.type === "textarea"
                                      ? "📄 Textarea"
                                      : "📝 Metin"}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {item.label || item.name || `Alan ${idx + 1}`}
                    </span>
                    {item.required && (
                      <span
                        className="text-red-500 font-bold"
                        title="Zorunlu Alan"
                      >
                        *
                      </span>
                    )}
                    {item.fullWidth && (
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-normal">
                        Tam Genişlik
                      </span>
                    )}
                  </span>
                ) : (
                  item.title ||
                  item.label ||
                  item.day ||
                  item.name ||
                  item.text ||
                  `Öğe ${idx + 1}`
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (confirm("Bu öğeyi silmek istediğinize emin misiniz?")) {
                    const newItems = currentArray.map((i: any) => ({ ...i }));
                    newItems.splice(idx, 1);
                    handleChange(arrayKey, newItems);
                  }
                }}
                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                title="Öğeyi Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <span
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={(e) => e.preventDefault()}
                className="cursor-move"
              >
                <GripVertical className="w-4 h-4 text-slate-300" />
              </span>
            </summary>
            <div className="p-3 pt-0 border-t border-slate-200 flex gap-2 items-start mt-2">
              <div className="flex-1 space-y-2">
                {itemFields.map((field) => {
                  if (field.type === "select") {
                    return (
                      <div key={field.key} className="flex flex-col gap-1 mt-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <select
                          value={item[field.key] || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              arrayKey,
                              idx,
                              field.key,
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Seçiniz...</option>
                          {(field.options || []).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field.type === "text") {
                    let val = item[field.key];
                    if (val === undefined) {
                      if (field.key === 'stat1Label' && item.stats && item.stats[0]) val = item.stats[0].label || "";
                      else if (field.key === 'stat1Value' && item.stats && item.stats[0]) val = item.stats[0].value || "";
                      else if (field.key === 'stat2Label' && item.stats && item.stats[1]) val = item.stats[1].label || "";
                      else if (field.key === 'stat2Value' && item.stats && item.stats[1]) val = item.stats[1].value || "";
                      else if (field.key === 'stat' && item.statValue) val = item.statValue || "";
                      else if (field.key === 'tag' && item.badge) val = item.badge || "";
                      else val = "";
                    }
                    return (
                      <input
                        key={field.key}
                        type="text"
                        value={val}
                        onChange={(e) =>
                          handleArrayChange(
                            arrayKey,
                            idx,
                            field.key,
                            e.target.value,
                          )
                        }
                        placeholder={field.label}
                        className="w-full text-sm border-slate-300 rounded p-1.5 font-bold"
                      />
                    );
                  }
                  if (field.type === "url") {
                    const val =
                      item[field.key] || item.url || item.buttonUrl || "";
                    return (
                      <div key={field.key} className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <div className="flex gap-2 w-full mt-1">
                          <select
                            value={
                              val === "/" ||
                              pagesList?.find((p) => p.path === val)
                                ? val
                                : "custom"
                            }
                            onChange={(e) => {
                              if (e.target.value !== "custom") {
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  field.key,
                                  e.target.value,
                                );
                                if (field.key === "buttonUrl")
                                  handleArrayChange(
                                    arrayKey,
                                    idx,
                                    "url",
                                    e.target.value,
                                  );
                                if (field.key === "url")
                                  handleArrayChange(
                                    arrayKey,
                                    idx,
                                    "buttonUrl",
                                    e.target.value,
                                  );
                              }
                            }}
                            className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="custom">Sayfa Seç</option>
                            <option value="/">Ana Sayfa (/)</option>
                            {pagesList
                              ?.filter((p) => p.id !== "home")
                              .map((p) => (
                                <option key={p.id} value={p.path}>
                                  {p.title} ({p.path})
                                </option>
                              ))}
                          </select>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              handleArrayChange(
                                arrayKey,
                                idx,
                                field.key,
                                e.target.value,
                              );
                              if (field.key === "buttonUrl")
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "url",
                                  e.target.value,
                                );
                              if (field.key === "url")
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonUrl",
                                  e.target.value,
                                );
                            }}
                            placeholder="Özel URL Girin (Örn: /on-kayit)"
                            className="w-1/2 px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    );
                  }
                  if (field.type === "textarea") {
                    let val = item[field.key];
                    if (val === undefined) {
                      if (field.key === 'listString' && item.listItems) {
                        val = item.listItems.join('\n');
                      } else if (field.key === 'listString' && item.list) {
                        val = item.list.join('\n');
                      } else {
                        val = "";
                      }
                    }
                    if (Array.isArray(val)) {
                      if (field.key === "stats") {
                        val = val.map(x => `${x.value || ''}|${x.label || ''}`).join('\n');
                      } else {
                        val = val.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join('\n');
                      }
                    } else if (typeof val === "object") {
                       val = JSON.stringify(val);
                    }
                    return (
                      <div key={field.key}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {field.label}
                        </label>
                        <textarea
                          value={val}
                          onChange={(e) =>
                            handleArrayChange(
                              arrayKey,
                              idx,
                              field.key,
                              e.target.value,
                            )
                          }
                          placeholder={field.label}
                          className="w-full text-sm border-slate-300 rounded p-1.5 min-h-[80px]"
                        />
                      </div>
                    );
                  }
                  if (field.type === "icon") {
                    return (
                      <div key={field.key}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {field.label}
                        </label>
                        <IconField
                          value={item[field.key] || ""}
                          onChange={(val) =>
                            handleArrayChange(arrayKey, idx, field.key, val)
                          }
                        />
                      </div>
                    );
                  }
                  if (field.type === "image") {
                    return (
                      <div
                        key={field.key}
                        className="flex flex-col gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item[field.key] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                field.key,
                                e.target.value,
                              )
                            }
                            className="flex-1 text-sm border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-blue-500 bg-white"
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                isOpen: true,
                                onSelect: (url) =>
                                  handleArrayChange(
                                    arrayKey,
                                    idx,
                                    field.key,
                                    url || "",
                                  ),
                              })
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[11px] font-bold shadow-sm transition-colors"
                          >
                            Seç
                          </button>
                        </div>
                        {item[field.key] && (
                          <div className="grid grid-cols-1 gap-3 mt-3 pt-3 border-t border-slate-200">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">
                                  Sol/Sağ (X)
                                </label>
                                <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                                  {item[`${field.key}_posX`] ?? 50}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={item[`${field.key}_posX`] ?? 50}
                                onChange={(e) =>
                                  handleArrayChange(
                                    arrayKey,
                                    idx,
                                    `${field.key}_posX`,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">
                                  Üst/Alt (Y)
                                </label>
                                <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                                  {item[`${field.key}_posY`] ?? 50}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={item[`${field.key}_posY`] ?? 50}
                                onChange={(e) =>
                                  handleArrayChange(
                                    arrayKey,
                                    idx,
                                    `${field.key}_posY`,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">
                                  Yakınlaştır
                                </label>
                                <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                                  {item[`${field.key}_scale`] ?? 100}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="500"
                                step="1"
                                value={item[`${field.key}_scale`] ?? 100}
                                onChange={(e) =>
                                  handleArrayChange(
                                    arrayKey,
                                    idx,
                                    `${field.key}_scale`,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  if (field.type === "color") {
                    return (
                      <div key={field.key} className="flex flex-col gap-1 mt-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={item[field.key] || "#000000"}
                            onChange={(e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                field.key,
                                e.target.value,
                              )
                            }
                            className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={item[field.key] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                field.key,
                                e.target.value,
                              )
                            }
                            placeholder="örn: #FFFFFF"
                            className="flex-1 text-sm border-slate-300 rounded p-1.5"
                          />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                field.key,
                                e.target.value,
                              )
                            ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                      </div>
                    );
                  }
                  if (field.type === "checkbox") {
                    return (
                      <label
                        key={field.key}
                        className="flex items-center gap-2 text-sm font-bold text-slate-600 mt-2"
                      >
                        <input
                          type="checkbox"
                          checked={!!item[field.key]}
                          onChange={(e) =>
                            handleArrayChange(
                              arrayKey,
                              idx,
                              field.key,
                              e.target.checked,
                            )
                          }
                          className="rounded text-blue-600"
                        />
                        {field.label}
                      </label>
                    );
                  }
                })}

                {hasStyles && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <details className="group">
                      <summary className="text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 list-none flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] group-open:rotate-90 transition-transform">
                          chevron_right
                        </span>
                        İleri Düzey Stiller
                      </summary>
                      <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pl-5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Kart Zemin Rengi
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={
                                item.cardBgColor === "currentColor" ||
                                !item.cardBgColor
                                  ? "#ffffff"
                                  : item.cardBgColor}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBgColor",
                                  e.target.value,
                                )
                              }
                              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={item.cardBgColor || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBgColor",
                                  e.target.value,
                                )
                              }
                              placeholder="Şeffaf"
                              className="w-full text-xs border-slate-300 rounded p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBgColor",
                                  e.target.value,
                                )
                              ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Kart Arka Plan Görseli
                          </label>
                          <input
                            type="text"
                            value={item.cardBgImage || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                "cardBgImage",
                                e.target.value,
                              )
                            }
                            placeholder="Görsel URL'si"
                            className="w-full text-xs border-slate-300 rounded p-1.5"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Kenarlık Rengi & Kalınlığı
                          </label>
                          <div className="flex gap-1 items-center">
                            <input
                              type="color"
                              value={
                                item.cardBorderColor === "currentColor" ||
                                !item.cardBorderColor
                                  ? "#e2e8f0"
                                  : item.cardBorderColor}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBorderColor",
                                  e.target.value,
                                )
                              }
                              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={item.cardBorderColor || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBorderColor",
                                  e.target.value,
                                )
                              }
                              placeholder="Renk"
                              className="w-1/2 text-xs border-slate-300 rounded p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBorderColor",
                                  e.target.value,
                                )
                              ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                            <input
                              type="text"
                              value={item.cardBorderWidth || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBorderWidth",
                                  e.target.value,
                                )
                              }
                              placeholder="1px"
                              className="w-1/3 text-xs border-slate-300 rounded p-1.5"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Köşe Yuvarlama (Radius)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="64"
                              value={parseInt(item.cardBorderRadius) || 0}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBorderRadius",
                                  e.target.value + "px",
                                )
                              }
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                              type="text"
                              value={item.cardBorderRadius || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardBorderRadius",
                                  e.target.value,
                                )
                              }
                              placeholder="12px"
                              className="w-16 text-xs border-slate-300 rounded p-1.5 text-center"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            İç Boşluk (Padding)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="64"
                              value={parseInt(item.cardPadding) || 0}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardPadding",
                                  e.target.value + "px",
                                )
                              }
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                              type="text"
                              value={item.cardPadding || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "cardPadding",
                                  e.target.value,
                                )
                              }
                              placeholder="24px"
                              className="w-16 text-xs border-slate-300 rounded p-1.5 text-center"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Gölge Efekti (Shadow)
                          </label>
                          <select
                            value={item.cardShadow || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                "cardShadow",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs border-slate-300 rounded p-1.5 bg-white"
                          >
                            <option value="">Varsayılan</option>
                            <option value="none">Yok (none)</option>
                            <option value="sm">Küçük (sm)</option>
                            <option value="md">Orta (md)</option>
                            <option value="lg">Büyük (lg)</option>
                            <option value="xl">Çok Büyük (xl)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Başlık Rengi
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={
                                item.itemTitleColor === "currentColor" ||
                                !item.itemTitleColor
                                  ? "#000000"
                                  : item.itemTitleColor}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "itemTitleColor",
                                  e.target.value,
                                )
                              }
                              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={item.itemTitleColor || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "itemTitleColor",
                                  e.target.value,
                                )
                              }
                              placeholder="Varsayılan"
                              className="w-full text-xs border-slate-300 rounded p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "itemTitleColor",
                                  e.target.value,
                                )
                              ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Açıklama Rengi
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={
                                item.itemDescColor === "currentColor" ||
                                !item.itemDescColor
                                  ? "#000000"
                                  : item.itemDescColor}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "itemDescColor",
                                  e.target.value,
                                )
                              }
                              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={item.itemDescColor || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "itemDescColor",
                                  e.target.value,
                                )
                              }
                              placeholder="Varsayılan"
                              className="w-full text-xs border-slate-300 rounded p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "itemDescColor",
                                  e.target.value,
                                )
                              ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Buton Yazı Rengi
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={
                                item.buttonTextColor === "currentColor" ||
                                !item.buttonTextColor
                                  ? "#0f172a"
                                  : item.buttonTextColor}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonTextColor",
                                  e.target.value,
                                )
                              }
                              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={item.buttonTextColor || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonTextColor",
                                  e.target.value,
                                )
                              }
                              placeholder="Varsayılan"
                              className="w-full text-xs border-slate-300 rounded p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonTextColor",
                                  e.target.value,
                                )
                              ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Buton Zemin Rengi
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={
                                item.buttonBgColor === "currentColor" ||
                                !item.buttonBgColor
                                  ? "#5eead4"
                                  : item.buttonBgColor}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonBgColor",
                                  e.target.value,
                                )
                              }
                              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={item.buttonBgColor || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonBgColor",
                                  e.target.value,
                                )
                              }
                              placeholder="Varsayılan"
                              className="w-full text-xs border-slate-300 rounded p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "buttonBgColor",
                                  e.target.value,
                                )
                              ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <input
                              type="checkbox"
                              checked={!!item.hoverEffect}
                              onChange={(e) =>
                                handleArrayChange(
                                  arrayKey,
                                  idx,
                                  "hoverEffect",
                                  e.target.checked,
                                )
                              }
                              className="rounded text-blue-600"
                            />
                            Hover Efekti (Büyüme/Yükselme)
                          </label>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  const newItems = currentArray.map((i: any) => ({ ...i }));
                  newItems.splice(idx, 1);
                  handleChange(arrayKey, newItems);
                }}
                className="text-red-500 hover:text-red-700 p-1 text-xs font-bold mt-2"
              >
                Sil
              </button>
            </div>
          </details>
        ))}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => {
              const newItem =
                arrayKey === "inputs"
                  ? {
                      type: "text",
                      name: "input_" + Date.now(),
                      label: "Yeni Form Alanı",
                      placeholder: "",
                      required: false,
                    }
                  : {};
              handleChange(arrayKey, arrayKey === "inputs" ? [...currentArray, newItem] : [newItem, ...currentArray]);
            }}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Yeni{" "}
            {arrayKey === "inputs" ? "Form Alanı (İnput)" : "Öğe"} Ekle
          </button>

          {arrayKey === "inputs" && (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Form alanlarını orijinal varsayılan şablona sıfırlamak istediğinize emin misiniz? Yapılan özelleştirmeler sıfırlanacaktır.",
                  )
                ) {
                  const defaults =
                    block.type === "pre_registration_form"
                      ? DEFAULT_PRE_REGISTRATION_INPUTS
                      : block.type === "bursluluk_exam_form"
                        ? DEFAULT_SCHOLARSHIP_INPUTS
                        : block.type === "career_application"
                          ? DEFAULT_CAREER_INPUTS
                          : DEFAULT_CLUB_INPUTS;
                  handleChange(arrayKey, defaults);
                }
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded transition-colors flex items-center gap-1 border border-slate-200"
              title="Varsayılan Şablona Sıfırla"
            >
              <span className="material-symbols-outlined text-[15px]">
                restart_alt
              </span>{" "}
              Sıfırla
            </button>
          )}
        </div>
      </div>
    );
  };

  
  const renderHeroOverlaySetting = () => {
    if (!block.type?.includes('hero')) return null;
    return (
      <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={block.styles?.enableDarkOverlay || false}
            onChange={(e) => handleStyleChange("enableDarkOverlay", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-bold text-slate-700">
            Karanlık Katman Uygula (Görsellerin üzerine yarı saydam karanlık filtre ekler)
          </span>
        </label>
        {block.styles?.enableDarkOverlay && (
          <div className="mt-2 pl-6 space-y-4">
            
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Karanlık Derecesi (Görünürlük)</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{block.styles?.overlayOpacity ?? 100}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={block.styles?.overlayOpacity ?? 100}
                onChange={(e) => handleStyleChange("overlayOpacity", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>Şeffaf (0%)</span>
                <span>Tamamen Kapalı (100%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
               <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Katman Rengi</label>
               <input
                 type="color"
                 value={block.styles?.overlayColor || "#000000"}
                 onChange={(e) => handleStyleChange("overlayColor", e.target.value)}
                 className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0"
               />
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={block.styles?.overlayHoverReveal !== false} // default true
                onChange={(e) => handleStyleChange("overlayHoverReveal", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-600">
                Üzerine gelince (Hover) katmanı gizle ve orijinal resmi göster
              </span>
            </label>
          </div>
        )}
      </div>
    );
  };

  const renderCommonFields = () => (
    <div className="space-y-4">
      {renderTextareaWithStyle("Başlık", "title")}
      {renderTextareaWithStyle("Alt Başlık", "subtitle")}
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 rounded-t-xl">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          Modül Düzenleyici
        </h3>
        <div className="flex items-center gap-2">
          {onMoveUp && (
            <button onClick={onMoveUp} className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded" title="Yukarı Taşı">
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded" title="Aşağı Taşı">
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
          {onDuplicate && (
            <button onClick={onDuplicate} className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded" title="Modülü Kopyala">
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded" title="Modülü Sil">
              <Trash className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="w-px h-5 bg-slate-300 mx-1"></div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={!block.isHidden}
              onChange={(e) => handleChange("isHidden", !e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className={block.isHidden ? "text-slate-400" : "text-blue-600"}>
              {block.isHidden ? "Gizli" : "Görünür"}
            </span>
          </label>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
            Genel Modül Ayarları
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Zemin Rengi
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.styles?.backgroundColor || "#ffffff"}
                  onChange={(e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      backgroundColor: e.target.value,
                    };
                    handleChange("styles", newStyles);
                  }}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={block.styles?.backgroundColor || ""}
                  onChange={(e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      backgroundColor: e.target.value,
                    };
                    handleChange("styles", newStyles);
                  }}
                  placeholder="Varsayılan (Boş bırakılabilir)"
                  className="flex-1 text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      backgroundColor: e.target.value,
                    };
                    handleChange("styles", newStyles);
                  };
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Metin Rengi
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.styles?.color || "#000000"}
                  onChange={(e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      color: e.target.value,
                    };
                    handleChange("styles", newStyles);
                  }}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={block.styles?.color || ""}
                  onChange={(e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      color: e.target.value,
                    };
                    handleChange("styles", newStyles);
                  }}
                  placeholder="Varsayılan (Boş bırakılabilir)"
                  className="flex-1 text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      color: e.target.value,
                    };
                    handleChange("styles", newStyles);
                  };
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Arkaplan Görseli
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={block.styles?.backgroundImage || ""}
                  onChange={(e) =>
                    handleChange("styles", {
                      ...block.styles,
                      backgroundImage: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() =>
                    setMediaPickerConfig({
                      isOpen: true,
                      onSelect: (url) =>
                        handleChange("styles", {
                          ...block.styles,
                          backgroundImage: url || "",
                        }),
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap shadow-sm transition-colors"
                >
                  Seç
                </button>
              </div>
            </div>

            <div>
              {(block.type.includes("hero") || block.type === "about_hero" || block.type === "academic_hero" || block.type === "bursluluk_hero") && (
                <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 mt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Hero İçerik Yatay Konumu
                    </label>
                    <select
                      value={block.styles?.heroAlignX || ""}
                      onChange={(e) => {
                        const newStyles = {
                          ...(block.styles || {}),
                          heroAlignX: e.target.value,
                        };
                        handleChange("styles", newStyles);
                      }}
                      className="w-full text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Varsayılan (Sola Dayalı)</option>
                      <option value="left">Sola Dayalı</option>
                      <option value="center">Ortala</option>
                      <option value="right">Sağa Dayalı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Hero İçerik Dikey Konumu
                    </label>
                    <select
                      value={block.styles?.heroAlignY || ""}
                      onChange={(e) => {
                        const newStyles = {
                          ...(block.styles || {}),
                          heroAlignY: e.target.value,
                        };
                        handleChange("styles", newStyles);
                      }}
                      className="w-full text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Varsayılan (Ortala)</option>
                      <option value="top">Üste Yakın</option>
                      <option value="center">Ortala</option>
                      <option value="bottom">Alta Yakın</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Genel Metin Hizalaması (Masaüstü)
                  </label>
                  <select
                    value={block.styles?.textAlign || ""}
                    onChange={(e) => {
                      const newStyles = {
                        ...(block.styles || {}),
                        textAlign: e.target.value,
                      };
                      handleChange("styles", newStyles);
                    }}
                    className="w-full text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="">Varsayılan</option>
                    <option value="left">Sola Hizala</option>
                    <option value="center">Ortaya Hizala</option>
                    <option value="right">Sağa Hizala</option>
                    <option value="justify">İki Yana Yasla</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Genel Metin Hizalaması (Mobil)
                  </label>
                  <select
                    value={block.styles?.mobileTextAlign || ""}
                    onChange={(e) => {
                      const newStyles = {
                        ...(block.styles || {}),
                        mobileTextAlign: e.target.value,
                      };
                      handleChange("styles", newStyles);
                    }}
                    className="w-full text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="">Varsayılan</option>
                    <option value="left">Sola Hizala</option>
                    <option value="center">Ortaya Hizala</option>
                    <option value="right">Sağa Hizala</option>
                    <option value="justify">İki Yana Yasla</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded border border-slate-200 w-full">
                <input
                  type="checkbox"
                  checked={!!block.styles?.fullWidth}
                  onChange={(e) => {
                    const newStyles = {
                      ...(block.styles || {}),
                      fullWidth: e.target.checked,
                    };
                    handleChange("styles", newStyles);
                  }}
                  className="rounded text-blue-600 w-4 h-4 border-slate-300"
                />
                Tam Genişlik (Sağ-Sol Yasla)
              </label>
            </div>
          </div>
        </div>

        {block.type === "hero" && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Görünüm Düzeni
              </label>
              <select
                value={block.layoutOrder || "text_images_buttons"}
                onChange={(e) => handleChange("layoutOrder", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 font-medium"
              >
                <option value="text_images_buttons">
                  Yazı - Resimler - Butonlar
                </option>
                <option value="images_text_buttons">
                  Resimler - Yazı - Butonlar
                </option>
                <option value="text_buttons_images">
                  Yazı - Butonlar - Resimler
                </option>
              </select>
            </div>

            {renderInputWithStyle("Badge (İsteğe Bağlı)", "badge")}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Başlık Ayarları & Yerleşimi
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Başlık Durumu (Metin Yerleşimi)
                </label>
                <select
                  value={
                    block.titleLayout || block.styles?.titleLayout || "inline"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({
                      ...block,
                      titleLayout: val,
                      styles: { ...(block.styles || {}), titleLayout: val },
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    1. Başlık Parçası (Metin 1)
                  </label>
                  <FieldStylePicker
                    block={block}
                    fieldKey="titlePart1"
                    onChange={handleStyleChange}
                  />
                </div>
                <input
                  type="text"
                  value={block.titlePart1 || ""}
                  onChange={(e) => {
                    const p1 = e.target.value;
                    const p2 = block.titlePart2 || "";
                    onChange({
                      ...block,
                      titlePart1: p1,
                      title: `${p1} ${p2}`.trim(),
                    });
                  }}
                  placeholder="örn: Eğitimde Dostluk"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    2. Başlık Parçası (Metin 2)
                  </label>
                  <FieldStylePicker
                    block={block}
                    fieldKey="titlePart2"
                    onChange={handleStyleChange}
                  />
                </div>
                <input
                  type="text"
                  value={block.titlePart2 || ""}
                  onChange={(e) => {
                    const p2 = e.target.value;
                    const p1 = block.titlePart1 || "";
                    onChange({
                      ...block,
                      titlePart1: p1,
                      titlePart2: p2,
                      title: `${p1} ${p2}`.trim(),
                    });
                  }}
                  placeholder="örn: Gelecekte Başarı"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Birleşik / Genel Ana Başlık
                  </label>
                  <FieldStylePicker
                    block={block}
                    fieldKey="title"
                    onChange={handleStyleChange}
                  />
                </div>
                <textarea
                  value={block.title || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    let p1 = "";
                    let p2 = "";

                    if (val.includes(",")) {
                      const parts = val.split(",");
                      p1 = parts[0].trim();
                      p2 = parts.slice(1).join(",").trim();
                    } else if (val.includes("\n")) {
                      const parts = val.split("\n");
                      p1 = parts[0].trim();
                      p2 = parts.slice(1).join(" ").trim();
                    } else if (val.includes(" ")) {
                      const words = val.trim().split(" ");
                      if (words.length >= 2) {
                        const mid = Math.ceil(words.length / 2);
                        p1 = words.slice(0, mid).join(" ");
                        p2 = words.slice(mid).join(" ");
                      } else {
                        p1 = val;
                        p2 = "";
                      }
                    } else {
                      p1 = val;
                      p2 = "";
                    }

                    onChange({
                      ...block,
                      title: val,
                      titlePart1: p1,
                      titlePart2: p2,
                    });
                  }}
                  placeholder="örn: Eğitimde Dostluk, Gelecekte Başarı"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white min-h-[70px]"
                />
              </div>
            </div>

            {renderTextareaWithStyle("Alt Başlık", "subtitle")}
<CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />
          </div>
        )}
        {block.type === "menu_features" && (
          <div className="space-y-4">

            {renderArrayEditor(
              "legends",
              [
                {
                  key: "icon",
                  label: "İkon (örn: edit_document)",
                  type: "icon",
                },
                {
                  key: "iconBgClass",
                  label: "İkon Arkaplan Sınıfı (örn: bg-error-container)",
                  type: "text",
                },
                {
                  key: "iconColorClass",
                  label: "İkon Renk Sınıfı (örn: text-on-error-container)",
                  type: "text",
                },
                { key: "title", label: "Başlık", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "url", label: "Link URL", type: "url" },
                {
                  key: "buttonText",
                  label: "Link Metni (İncele)",
                  type: "text",
                },
                { key: "hideButton", label: "Butonu Gizle", type: "checkbox" },
                {
                  key: "itemTitleColor",
                  label: "Özel Başlık Rengi",
                  type: "color",
                },
                {
                  key: "itemDescColor",
                  label: "Özel Açıklama Rengi",
                  type: "color",
                },
              ],
              "Lejant (Açıklama) Kartları",
            )}
          </div>
        )}

        {block.type === "menu_hero" && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderInputWithStyle("Badge (Etiket)", "badge")}
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Açıklama", "subtitle")}
            {renderImageUpload("Arkaplan Resmi", "image")}
          </div>
        )}

        {block.type === "menu_calendar" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Açıklama", "subtitle")}
            {renderInputWithStyle("Ay (örn: Ekim 2023)", "month")}
            <CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} activeArrayItem={activeArrayItem} />
          </div>
        )}

        {block.type === "academic_calendar_hero" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Açıklama", "subtitle")}
            {renderImageUpload("Arkaplan Resmi", "image")}
          </div>
        )}

        {block.type === "academic_calendar" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Ay/Başlık", "month")}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-700">PDF Buton Ayarları</span>
            </div>
            {renderInputWithStyle("PDF Butonunu Gizle", "hidePdfButton", "checkbox")}
            {!block.hidePdfButton && (
              <>
                {renderInputWithStyle("PDF URL", "pdfUrl")}
                {renderInputWithStyle("PDF Buton Metni", "pdfButtonText")}
              </>
            )}
            <CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} activeArrayItem={activeArrayItem} />
          </div>
        )}
      </div>

      {block.type === "lgs_calculator" && (
        <div className="space-y-4">
          {renderTextareaWithStyle("Başlık", "title")}
          {renderTextareaWithStyle("Alt Başlık / Açıklama", "subtitle")}

          <div className="border-t border-slate-200 pt-4 mt-4">
            <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">
              Başlıklar
            </h4>
            {renderInputWithStyle(
              "Öğrenci ve Veli Bilgileri Başlığı",
              "studentInfoTitle",
            )}
            {renderInputWithStyle("Sözel Oturum Başlığı", "sozelTitle")}
            {renderInputWithStyle("Sayısal Oturum Başlığı", "sayisalTitle")}
            {renderInputWithStyle("Sınav Sonucu Başlığı", "resultTitle")}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mt-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-2">
              Form Görünüm & CSS Renk Ayarları
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Arka Plan Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.backgroundColor || "#faf8ff"}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.backgroundColor || ""}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    placeholder="#faf8ff"
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"
                  />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                </div>
                
                <label className="text-[10px] font-bold text-slate-400 block mb-1 mt-3">
                  Kart Arka Plan Görseli
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={block.styles?.cardBgImage || ""}
                    onChange={(e) =>
                      handleStyleChange("cardBgImage", e.target.value)
                    }
                    placeholder="Görsel URL'si (http... veya /img.jpg)"
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"
                  />
                </div>

              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Başlık Yazı Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.titlePart1Color || "#002147"}
                    onChange={(e) =>
                      handleStyleChange("titlePart1Color", e.target.value)
                    }
                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.titlePart1Color || ""}
                    onChange={(e) =>
                      handleStyleChange("titlePart1Color", e.target.value)
                    }
                    placeholder="#002147"
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"
                  />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) =>
                      handleStyleChange("titlePart1Color", e.target.value)
                    ;
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                </div>
                
                <label className="text-[10px] font-bold text-slate-400 block mb-1 mt-3">
                  Kart Arka Plan Görseli
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={block.styles?.cardBgImage || ""}
                    onChange={(e) =>
                      handleStyleChange("cardBgImage", e.target.value)
                    }
                    placeholder="Görsel URL'si (http... veya /img.jpg)"
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"
                  />
                </div>

              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Alt Başlık Yazı Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.color || "#333333"}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.color || ""}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    placeholder="#333333"
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"
                  />
                            <button
                              type="button"
                              onClick={() => {
                                const handler = (e) => handleStyleChange("color", e.target.value);
                                handler({ target: { value: "transparent" } } as any);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                              title="Rengi Temizle (Şeffaf)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                </div>
                
                <label className="text-[10px] font-bold text-slate-400 block mb-1 mt-3">
                  Kart Arka Plan Görseli
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={block.styles?.cardBgImage || ""}
                    onChange={(e) =>
                      handleStyleChange("cardBgImage", e.target.value)
                    }
                    placeholder="Görsel URL'si (http... veya /img.jpg)"
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"
                  />
                </div>

              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-4">
            <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">
              Tablo ve Sonuç Metinleri
            </h4>
            {renderInputWithStyle(
              "Tahmini LGS Puanı Metni",
              "estimatedScoreLabel",
            )}
            {renderInputWithStyle("Max 500 Puan Metni", "maxScoreLabel")}
            {renderInputWithStyle("Toplam Net Metni", "totalNetLabel")}
            {renderInputWithStyle(
              "Tahmini Yüzdelik Metni",
              "estimatedPercentileLabel",
            )}
            {renderInputWithStyle("Veri Yılı Metni", "dataYearLabel")}
            {renderInputWithStyle("Net Dağılımı Metni", "netDistributionLabel")}
          </div>

          <div className="border-t border-slate-200 pt-4 mt-4">
            <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">
              Form Placeholder Metinleri
            </h4>
            {renderInputWithStyle(
              "Öğrenci Adı Soyadı Placeholder",
              "studentNamePlaceholder",
            )}
            {renderInputWithStyle(
              "Veli Adı Soyadı Placeholder",
              "parentNamePlaceholder",
            )}
            {renderInputWithStyle(
              "Veli Telefon Placeholder",
              "phonePlaceholder",
            )}
            {renderInputWithStyle(
              "Mevcut Okulu Placeholder",
              "schoolPlaceholder",
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 mt-4">
            <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">
              Buton Metinleri
            </h4>
            {renderInputWithStyle("Sıfırla Butonu", "resetButtonLabel")}
            {renderInputWithStyle("Gönder Butonu", "submitButtonLabel")}
            {renderInputWithStyle(
              "PDF İndir/Yazdır Butonu",
              "downloadButtonLabel",
            )}
          </div>
        </div>
      )}

      
      
      {block.type === "bursluluk_hero" && (
        <div className="space-y-4">
            {renderHeroOverlaySetting()}
          {renderCommonFields()}
          {renderInputWithStyle("Rozet (Badge)", "badge")}
          {renderImageUpload("Arka Plan Görseli", "image")}
          {renderArrayEditor("stats", [
            { key: "value", label: "Değer (Örn: 16-17 Mart)", type: "text" },
            { key: "label", label: "Etiket (Örn: Sınav Tarihi)", type: "text" }
          ], "İstatistikler")}
        </div>
      )}

      {block.type === "bursluluk_exam_form" && (
        <div className="space-y-4">
          {renderCommonFields()}
        </div>
      )}

      {block.type === "bursluluk_info_cards" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderArrayEditor("items", [
            { key: "title", label: "Kart Başlığı", type: "text" },
            { key: "icon", label: "İkon (Material)", type: "icon" },
            { key: "rules", label: "Kurallar/Maddeler (Satır başı yaparak giriniz)", type: "textarea" }
          ], "Bilgi Kartları")}
        </div>
      )}

      {block.type === "bursluluk_result_query" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderInputWithStyle("Buton Metni", "buttonText")}
          {renderImageUpload("Görsel", "image")}
        </div>
      )}

      {block.type === "career_hero" && (
        <div className="space-y-4">
            {renderHeroOverlaySetting()}
          {renderCommonFields()}
          {renderImageUpload("Arka Plan Görseli", "image")}
        </div>
      )}

      {block.type === "career_benefits" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderArrayEditor("items", [
            { key: "title", label: "Başlık", type: "text" },
            { key: "desc", label: "Açıklama", type: "textarea" },
            { key: "icon", label: "İkon (Material)", type: "icon" }
          ], "Avantajlar / Haklar")}
        </div>
      )}

      {block.type === "career_application" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderArrayEditor("items", [
            { key: "title", label: "Pozisyon Başlığı", type: "text" },
            { key: "type", label: "Çalışma Tipi (Örn: Tam Zamanlı)", type: "text" },
            { key: "dept", label: "Departman (Örn: İlkokul)", type: "text" }
          ], "Açık Pozisyonlar")}
        </div>
      )}
\n      {block.type === "tuition_fees_hero" && (
        <div className="space-y-4">
            {renderHeroOverlaySetting()}
          {renderCommonFields()}
          {renderInputWithStyle("Rozet / Etiket", "badge")}
          {renderImageUpload("Arka Plan Görseli", "image")}
        </div>
      )}

      {block.type === "tuition_fees" && (
        <div className="space-y-4">
          {renderInputWithStyle("Tablo Başlığı", "tableTitle")}

          <div className="border-t border-slate-200 pt-4 mt-6">
            <h4 className="font-bold text-slate-700 mb-2">
              Eğitim Ücretleri (Kartlar)
            </h4>
            {renderArrayEditor(
              "items",
              [
                { key: "title", label: "Başlık (örn: Anaokulu)", type: "text" },
                { key: "icon", label: "İkon", type: "icon" },
                {
                  key: "tuitionFee",
                  label: "Eğitim Ücreti (örn: ₺120,000)",
                  type: "text",
                },
                {
                  key: "foodFee",
                  label: "Yemek Ücreti (örn: ₺35,000)",
                  type: "text",
                },
                { key: "totalFee", label: "Toplam", type: "text" },
                {
                  key: "vatText",
                  label: "Ek Metin (örn: *KDV Dahildir)",
                  type: "text",
                },
              ],
              "Ücret Kartları",
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 mt-6">
            {renderInputWithStyle("İndirimler Başlığı", "discountsTitle")}
            {renderArrayEditor(
              "discounts",
              [
                { key: "title", label: "Başlık", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon", type: "icon" },
              ],
              "İndirimler",
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 mt-6">
            {renderInputWithStyle("Ödeme Seçenekleri Başlığı", "paymentsTitle")}
            {renderArrayEditor(
              "payments",
              [
                { key: "title", label: "Başlık", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon", type: "icon" },
                {
                  key: "banks",
                  label: "Anlaşmalı Kurumlar (Virgülle Ayırın)",
                  type: "text",
                },
              ],
              "Ödeme Seçenekleri",
            )}
          </div>
        </div>
      )}
      
        {block.type === 'achievements_hero' && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Badge (Rozet)', 'badge')}
              {renderImageUpload('Görsel URL', 'image')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kutu Zemin Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.innerBgColor || "#0f172a"}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.innerBgColor || ""}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    placeholder="#0f172a"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newStyles = { ...(block.styles || {}) };
                      delete newStyles.innerBgColor;
                      handleChange("styles", newStyles);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kutu Şeffaflığı (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={block.styles?.innerBgOpacity ?? 100}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : 100;
                    const newStyles = { ...(block.styles || {}), innerBgOpacity: val };
                    handleChange("styles", newStyles);
                  }}
                  placeholder="100"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kutu Zemin Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.innerBgColor || "#0f172a"}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.innerBgColor || ""}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    placeholder="#0f172a"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newStyles = { ...(block.styles || {}) };
                      delete newStyles.innerBgColor;
                      handleChange("styles", newStyles);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kutu Şeffaflığı (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={block.styles?.innerBgOpacity ?? 100}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : 100;
                    const newStyles = { ...(block.styles || {}), innerBgOpacity: val };
                    handleChange("styles", newStyles);
                  }}
                  placeholder="100"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kutu Zemin Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.innerBgColor || "#0f172a"}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.innerBgColor || ""}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    placeholder="#0f172a"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newStyles = { ...(block.styles || {}) };
                      delete newStyles.innerBgColor;
                      handleChange("styles", newStyles);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kutu Şeffaflığı (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={block.styles?.innerBgOpacity ?? 100}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : 100;
                    const newStyles = { ...(block.styles || {}), innerBgOpacity: val };
                    handleChange("styles", newStyles);
                  }}
                  placeholder="100"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
              {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
              {renderInputWithStyle('Başlık Bölüm 2', 'titlePart2')}
            </div>
            {renderTextareaWithStyle('Alt Başlık / Açıklama', 'subtitle')}
            {renderArrayEditor(
              'buttons',
              [
                {key: 'label', label: 'Metin', type: 'text'},
                {key: 'url', label: 'URL', type: 'url'},
                {key: 'icon', label: 'İkon', type: 'icon'},
                {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
                {key: 'textColor', label: 'Metin Rengi', type: 'color'}
              ],
              'Butonlar'
            )}
          </div>
        )}

        {block.type === 'achievements_academic_bento' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderArrayEditor(
              'items',
              [
                {key: 'title', label: 'Başlık', type: 'text'},
                {key: 'desc', label: 'Açıklama', type: 'textarea'},
                {key: 'icon', label: 'İkon', type: 'icon'},
                {key: 'style', label: 'Stil Tipi (light, primary, list)', type: 'text'},
                {key: 'badge', label: 'Rozet (Opsiyonel)', type: 'text'},
                {key: 'statValue', label: 'Ana İstatistik', type: 'text'},
                {key: 'statLabel', label: 'Ana İstatistik Etiketi', type: 'text'},
                {key: 'buttonText', label: 'Buton Metni', type: 'text'},
                {key: 'url', label: 'Buton URL', type: 'url'}
              ],
              'Kartlar'
            )}
          </div>
        )}

        {block.type === 'achievements_social_gallery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Başlık', 'title')}
              {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            </div>
            {renderArrayEditor(
              'items',
              [
                {key: 'title', label: 'Kart Başlığı', type: 'text'},
                {key: 'desc', label: 'Açıklama', type: 'text'},
                {key: 'hoverText', label: 'Vurgu/Hover Metni', type: 'textarea'},
                {key: 'image', label: 'Görsel', type: 'image'}
              ],
              'Galeri Kartları'
            )}
          </div>
        )}

        {block.type === 'achievements_science_projects' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Bölüm Rozeti', 'badge')}
              {renderInputWithStyle('Başlık', 'title')}
              {renderImageUpload('Görsel URL', 'image')}
              {renderInputWithStyle('Görsel Üzeri Rozet', 'imageBadge')}
            </div>
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                {key: 'title', label: 'Başlık', type: 'text'},
                {key: 'desc', label: 'Açıklama', type: 'textarea'},
                {key: 'icon', label: 'İkon', type: 'icon'}
              ],
              'Öğeler'
            )}
          </div>
        )}

        {block.type === 'bento_academic' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Başlık', 'title')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' },
                { key: 'stat', label: 'İstatistik (Kart 1)', type: 'text' },
                { key: 'statLabel', label: 'İstatistik Etiketi (Kart 1)', type: 'text' },
                { key: 'tag', label: 'Rozet/Etiket (Kart 1)', type: 'text' },
                { key: 'buttonText', label: 'Buton Metni (Kart 2)', type: 'text' },
                { key: 'url', label: 'Buton URL (Kart 2)', type: 'url' },
                { key: 'stat1Label', label: 'İstatistik 1 Etiketi (Kart 2)', type: 'text' },
                { key: 'stat1Value', label: 'İstatistik 1 Değeri (Kart 2)', type: 'text' },
                { key: 'stat2Label', label: 'İstatistik 2 Etiketi (Kart 2)', type: 'text' },
                { key: 'stat2Value', label: 'İstatistik 2 Değeri (Kart 2)', type: 'text' },
                { key: 'listString', label: 'Özellik Listesi (Kart 3 - Her satıra bir tane)', type: 'textarea' }
              ],
              'Öğeler (Max 3, Özel Tasarım)'
            )}
          </div>
        )}

        {block.type === 'high_school_programs' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Program Adı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'image', label: 'Program Görseli', type: 'image' },
                { key: 'buttonText', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Buton URL', type: 'url' },
                { key: 'listString', label: 'Özellikler (Her satıra bir tane)', type: 'textarea' }
              ],
              'Lise Programları'
            )}
          </div>
        )}

        {block.type === 'career_benefits' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'iconColor', label: 'İkon Rengi (Tailwind Class)', type: 'text' },
                { key: 'iconBg', label: 'İkon Arka Planı (Tailwind Class)', type: 'text' },
                { key: 'borderTop', label: 'Üst Çizgi (Tailwind Class)', type: 'text' }
              ],
              'Avantajlar (Items)'
            )}
          </div>
        )}

        {block.type === 'mission_vision' && (
          <div className="space-y-4">
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' }
              ],
              'Misyon & Vizyon Kartları'
            )}
          </div>
        )}

        {block.type === 'timeline' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'year', label: 'Yıl', type: 'text' },
                { key: 'title', label: 'Olay Başlığı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' }
              ],
              'Tarihçe Öğeleri'
            )}
          </div>
        )}

        {block.type === 'values' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Değer Başlığı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' }
              ],
              'Değerlerimiz Öğeleri'
            )}
          </div>
        )}

        {block.type === 'quote_image' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Alıntı Metni', 'quote')}
            {renderInputWithStyle('Yazar', 'author')}
            {renderInputWithStyle('Ünvan/Açıklama', 'authorTitle')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Alıntı Arka Plan Rengi', 'bgColor')}
            {renderInputWithStyle('Alıntı Metin Rengi', 'textColor')}
          </div>
        )}

        {block.type === 'features' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Rozeti (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderInputWithStyle('Alt Başlık Metin Rengi', 'subtitleColor')}
            {renderArrayEditor(
              'items',
              [
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' }
              ],
              'Özellikler'
            )}
          </div>
        )}

        {block.type === 'stats' && (
          <div className="space-y-4">
            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderArrayEditor(
              'items',
              [
                { key: 'value', label: 'İstatistik Değeri', type: 'text' },
                { key: 'label', label: 'Etiket', type: 'text' }
              ],
              'İstatistikler'
            )}
          </div>
        )}

        {block.type === 'grid' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'image', label: 'Görsel', type: 'image' },
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'url', label: 'Tıklama Bağlantısı', type: 'url' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' }
              ],
              'Grid Öğeleri'
            )}
          </div>
        )}

        {block.type === 'text_image' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Rozeti (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama (HTML destekli)', 'content')}
            {renderImageUpload('Görsel', 'image')}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Görsel Yönü</label>
              <select
                value={block.imagePosition || 'right'}
                onChange={(e) => onChange({ ...block, imagePosition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none"
              >
                <option value="right">Sağda</option>
                <option value="left">Solda</option>
              </select>
            </div>
          </div>
        )}

      
        
        {block.type === 'campuses' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'image', label: 'Kampüs Görseli', type: 'image' },
              { key: 'title', label: 'Kampüs Adı', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' },
            ], 'Kampüsler')}
          </div>
        )}

        {block.type === 'education_levels' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Kategori Adı', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' }
            ], 'Kademeler')}
          </div>
        )}

        {block.type === 'edu_system_hero' && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Görsel', 'image')}
          </div>
        )}

        {block.type === 'edu_system_levels' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Kategori Adı', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' }
            ], 'Kademeler')}
          </div>
        )}

        {block.type === 'edu_system_yadep' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Madde Başlığı', type: 'text' },
              { key: 'desc', label: 'Madde Açıklaması', type: 'textarea' }
            ], 'YADEP Maddeleri')}
          </div>
        )}

        {block.type === 'edu_system_philosophy' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Ana Açıklama', 'desc')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Kart İkonu', 'cardIcon')}
            {renderInputWithStyle('Kart Başlığı', 'cardTitle')}
            {renderTextareaWithStyle('Kart Açıklaması', 'cardDesc')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Madde Başlığı', type: 'text' },
              { key: 'desc', label: 'Madde Açıklaması', type: 'textarea' }
            ], 'Felsefe Maddeleri')}
          </div>
        )}

        {block.type === 'edu_system_cta' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'desc')}
            {renderArrayEditor('buttons', [
              { key: 'label', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' },
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
            ], 'Butonlar')}
          </div>
        )}

        {(block.type === 'kindergarten_hero' || block.type === 'primary_school_hero' || block.type === 'middle_school_hero' || block.type === 'high_school_hero') && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderInputWithStyle('Etiket (Rozet)', 'badge')}
            {renderInputWithStyle('Başlık (1. Satır - İçinde HTML olabilir)', 'title')}
            {renderInputWithStyle('İkinci Başlık (2. Satır - Mavi Renkli)', 'title2')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderArrayEditor(
              'buttons',
              [
                { key: 'label', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Link', type: 'url' },
                { key: 'primary', label: 'Birincil Stil (Mavi Arka Plan - İşaretlenmezse saydam olur)', type: 'checkbox' }
              ],
              'Butonlar'
            )}
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mt-6">
              <h4 className="font-bold text-sm text-slate-700">Resim Üzeri Bilgi Kartı (Overlay Card)</h4>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="overlayEnabled"
                  checked={block.overlayCard?.enabled !== false}
                  onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), enabled: e.target.checked })}
                />
                <label htmlFor="overlayEnabled" className="text-sm font-bold text-slate-700 cursor-pointer">Bu kartı göster</label>
              </div>
              
              {(block.overlayCard?.enabled !== false) && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">İkon (Material)</label>
                    <input 
                      type="text" 
                      value={block.overlayCard?.icon || ""} 
                      placeholder="extension"
                      onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), icon: e.target.value })} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kart Başlığı</label>
                    <input 
                      type="text" 
                      value={block.overlayCard?.title || ""} 
                      placeholder="Oyun Temelli Eğitim"
                      onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), title: e.target.value })} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kart Alt Başlığı</label>
                    <input 
                      type="text" 
                      value={block.overlayCard?.subtitle || ""} 
                      placeholder="Aktif Öğrenme Yaklaşımı"
                      onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), subtitle: e.target.value })} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Zemin Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.bgColor || "#faf8ff"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), bgColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kenarlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.borderColor || "#e2e8f0"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), borderColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">İkon Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.iconColor || "#006a62"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), iconColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Başlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.titleColor || "#1a1b23"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), titleColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Alt Başlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.subtitleColor || "#64748b"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), subtitleColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(block.type === 'kindergarten_bento' || block.type === 'primary_school_bento') && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Madde Başlığı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'buttonText', label: 'Buton Metni (Mavi kart için)', type: 'text' },
                { key: 'url', label: 'Buton Linki (Mavi kart için)', type: 'url' },
              ],
              'Bento Öğeleri'
            )}
          </div>
        )}

        {block.type === 'kindergarten_branches' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderTextareaWithStyle('Bölüm Açıklaması', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Branş Adı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'image', label: 'Görsel', type: 'image' },
              ],
              'Branşlar'
            )}
          </div>
        )}

        {block.type === 'middle_school_pedagogy' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama (HTML destekli)', 'subtitle')}
            {renderImageUpload('Görsel', 'image')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Madde Başlığı', type: 'text' },
                { key: 'desc', label: 'Madde Açıklaması', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
              ],
              'Pedagoji Maddeleri'
            )}
          </div>
        )}

        {block.type === 'middle_school_lgs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  İç Zemin Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.styles?.innerBgColor || "#0f172a"}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={block.styles?.innerBgColor || ""}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), innerBgColor: e.target.value };
                      handleChange("styles", newStyles);
                    }}
                    placeholder="#0f172a"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newStyles = { ...(block.styles || {}) };
                      delete newStyles.innerBgColor;
                      handleChange("styles", newStyles);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  İç Zemin Şeffaflığı (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={block.styles?.innerBgOpacity ?? 100}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : 100;
                    const newStyles = { ...(block.styles || {}), innerBgOpacity: val };
                    handleChange("styles", newStyles);
                  }}
                  placeholder="100"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Özellik Başlığı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
              ],
              'LGS Özellikleri'
            )}
          </div>
        )}

        
        {block.type === 'campus_hero' && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderArrayEditor('buttons', [{key: 'label', label: 'Metin', type: 'text'}, {key: 'url', label: 'URL', type: 'url'}, {key: 'icon', label: 'İkon', type: 'icon'}, {key: 'style', label: 'Stil (solid/outline vs)', type: 'text'}], 'Butonlar')}
          </div>
        )}

        {block.type === 'campus_bento' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Kart Başlığı', type: 'text' },
              { key: 'subtitle', label: 'Kart Açıklaması', type: 'textarea' },
              { key: 'image', label: 'Görsel', type: 'image' },
              { key: 'colSpan', label: 'Tailwind Sütun Sınıfı (örn: col-span-12 md:col-span-6 lg:col-span-4)', type: 'text' },
              { key: 'url', label: 'Yönlendirme Linki (Opsiyonel)', type: 'url' }
            ], 'Bento Kartları')}
          </div>
        )}

        {block.type === 'campus_gallery' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'title', label: 'Görsel Başlığı (Opsiyonel)', type: 'text' },
              { key: 'desc', label: 'Açıklama (Opsiyonel)', type: 'textarea' },
              { key: 'image', label: 'Görsel', type: 'image' }
            ], 'Galeri Görselleri')}
          </div>
        )}

        {block.type === 'campus_life' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2', 'titlePart2')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            
            <div className="grid grid-cols-2 gap-4">
              {renderImageUpload('Görsel 1', 'image1')}
              {renderImageUpload('Görsel 2', 'image2')}
              {renderImageUpload('Görsel 3', 'image3')}
              {renderImageUpload('Görsel 4', 'image4')}
            </div>

            {renderArrayEditor('items', [
              { key: 'title', label: 'Özellik Başlığı', type: 'text' },
              { key: 'icon', label: 'İkon', type: 'icon' }
            ], 'Özellik Listesi')}
            
            {renderArrayEditor('buttons', [{key: 'label', label: 'Metin', type: 'text'}, {key: 'url', label: 'URL', type: 'url'}, {key: 'icon', label: 'İkon', type: 'icon'}, {key: 'style', label: 'Stil (solid/outline vs)', type: 'text'}], 'Butonlar')}
          </div>
        )}

        {block.type === 'campus_contact' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            
            {renderArrayEditor('items', [
              { key: 'title', label: 'Bilgi Başlığı', type: 'text' },
              { key: 'desc', label: 'Detay/Adres/Telefon', type: 'textarea' },
              { key: 'icon', label: 'İkon', type: 'icon' }
            ], 'İletişim Bilgileri')}

            <div className="bg-slate-100 p-4 rounded-xl space-y-4 mt-6">
              <h4 className="font-bold text-sm text-slate-700">Harita Alanı</h4>
              {renderTextareaWithStyle('Harita Kodu (iframe)', 'mapCode')}
              <p className="text-xs text-slate-500">
                Harita kodu eklendiğinde görsel ve kart bölümü gizlenir. Sadece görsel ve kart göstermek istiyorsanız bu alanı boş bırakın.
              </p>
            </div>
            
            {!block.mapCode && (
              <div className="bg-slate-50 p-4 rounded-xl space-y-4 mt-4 border border-slate-200">
                <h4 className="font-bold text-sm text-slate-700">Görsel ve Yönlendirme Kartı (Harita yoksa görünür)</h4>
                {renderImageUpload('Harita/Kampüs Görseli', 'image')}
                {renderInputWithStyle('Kart Başlığı', 'cardTitle')}
                {renderInputWithStyle('Kart Açıklaması', 'cardDesc')}
                {renderArrayEditor('buttons', [{key: 'label', label: 'Metin', type: 'text'}, {key: 'url', label: 'URL', type: 'url'}, {key: 'icon', label: 'İkon', type: 'icon'}], 'Yönlendirme Butonu (Sadece 1. buton görünür)')}
              </div>
            )}
          </div>
        )}

        {block.type === 'management_hero' && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
          </div>
        )}

        {block.type === 'management_rector' && (
          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-xl space-y-4 mb-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Bölüm Üst Bilgisi</h4>
               {renderCheckbox('Üst Bilgiyi (Rektör yazısını) Gizle', 'hideHeader')}
               {renderInputWithStyle('Bölüm Başlığı', 'sectionTitle')}
               {renderInputWithStyle('Bölüm İkonu (Material)', 'sectionIcon')}
               {renderCheckbox('Rozeti (Rektörlük Makamı) Gizle', 'hideBadge')}
               {renderInputWithStyle('Rozet Metni', 'badge')}
            </div>
            {renderInputWithStyle('İsim', 'title')}
            {renderInputWithStyle('Unvan', 'subtitle')}
            {renderTextareaWithStyle('Özgeçmiş / Açıklama (HTML)', 'desc')}
            {renderImageUpload('Fotoğraf', 'image')}
            {renderArrayEditor('buttons', [
              { key: 'label', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' },
              { key: 'style', label: 'Stil (primary/outline)', type: 'text' }
            ], 'Butonlar')}
          </div>
        )}

        {(block.type === 'management_vice_rectors' || block.type === 'management_deans') && (
          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-xl space-y-4 mb-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Bölüm Üst Bilgisi</h4>
               {renderCheckbox('Bölüm Başlığını Gizle', 'hideHeader')}
               {renderInputWithStyle('Bölüm Başlığı', 'title')}
               {renderInputWithStyle('Bölüm İkonu (Material)', 'sectionIcon')}
               {renderTextareaWithStyle('Bölüm Açıklaması', 'subtitle')}
            </div>
            {renderArrayEditor(
              'items',
              [
                { key: 'name', label: 'İsim', type: 'text' },
                { key: 'role', label: 'Unvan/Görev', type: 'text' },
                { key: 'image', label: 'Fotoğraf', type: 'image' },
                { key: 'desc', label: 'Kısa Bilgi', type: 'textarea' },
                { key: 'buttonText', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Buton URL', type: 'url' },
                { key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox' },
              ],
              block.type === 'management_vice_rectors' ? 'Rektör Yardımcıları' : 'Dekanlar/Yöneticiler'
            )}
          </div>
        )}

        {block.type === 'clubs_hero' && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                İçerik Hizalaması
              </label>
              <select
                value={block.styles?.textAlign || ""}
                onChange={(e) => {
                  const newStyles = {
                    ...(block.styles || {}),
                    textAlign: e.target.value,
                  };
                  handleChange("styles", newStyles);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="">Varsayılan (Ortada)</option>
                <option value="left">Sola Yasla</option>
                <option value="center">Ortala</option>
                <option value="right">Sağa Yasla</option>
              </select>
            </div>
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2', 'titlePart2')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderArrayEditor(
              'buttons',
              [
                { key: 'label', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Buton Linki', type: 'url' },
                { key: 'style', label: 'Stil (primary/outline)', type: 'text' }
              ],
              'Butonlar'
            )}
          </div>
        )}

        {block.type === 'clubs_grid' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Kategoriler (Virgülle Ayırın)', 'categories')}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.hideCategories || false}
                onChange={(e) =>
                  handleChange("hideCategories", e.target.checked)
                }
                id="hideCategories"
              />
              <label htmlFor="hideCategories" className="text-sm">
                Kategorileri / Etiketleri Gizle
              </label>
            </div>
            {renderArrayEditor(
              'items',
              [
                { key: 'category', label: 'Kategori', type: 'text' },
                { key: 'title', label: 'Kulüp Adı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' },
                { key: 'badge', label: 'Rozet Metni', type: 'text' },
                { key: 'badgeColor', label: 'Rozet Rengi (error/normal vb.)', type: 'text' },
                { key: 'hideBadge', label: 'Rozeti Gizle', type: 'checkbox' },
                { key: 'image', label: 'Görsel', type: 'image' },
                { key: 'buttonText', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Buton Linki', type: 'url' },
                { key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox' }
              ],
              'Kulüpler'
            )}
          </div>
        )}

        {block.type === 'clubs_benefits' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' }
              ],
              'Avantajlar'
            )}
          </div>
        )}

        {block.type === 'clubs_cta' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'buttons',
              [
                { key: 'label', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Buton Linki', type: 'url' }
              ],
              'Butonlar'
            )}
          </div>
        )}

{['pre_registration_form', 'club_registration_form', 'bursluluk_exam_form', 'career_application', 'contact_form', 'quick_contact_form'].includes(block.type) && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            
            {block.type === 'bursluluk_exam_form' && renderImageUpload('Yan Görsel', 'image')}
            {block.type === 'career_application' && renderTextareaWithStyle('Açıklama (HTML)', 'content')}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-bold text-sm text-slate-700">Form Alanları (Inputs)</h4>
              {renderArrayEditor(
                'inputs',
                [
                  { key: 'name', label: 'Alan Adı (name)', type: 'text' },
                  { key: 'label', label: 'Etiket (Label)', type: 'text' },
                  { key: 'type', label: 'Tipi (text, email, tel, select, file)', type: 'text' },
                  { key: 'placeholder', label: 'Yer Tutucu', type: 'text' },
                  { key: 'options', label: 'Seçenekler (select için virgülle ayır)', type: 'text' },
                  { key: 'required', label: 'Zorunlu Mu?', type: 'checkbox' }
                ],
                'Form Alanları'
              )}
            </div>
            
            {(block.type === 'pre_registration_form' || block.type === 'bursluluk_exam_form' || block.type === 'career_application') && (
               <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <h4 className="font-bold text-sm text-slate-700">Özel Seçenekler</h4>
                {block.type === 'pre_registration_form' && (
                   <>
                     {renderInputWithStyle('Kampüs Başlığı', 'campusTitle')}
                     {renderTextareaWithStyle('Kampüs Açıklaması', 'campusDesc')}
                   </>
                )}
                {block.type === 'career_application' && (
                  renderArrayEditor(
                    'items',
                    [
                      { key: 'val', label: 'Pozisyon Değeri', type: 'text' },
                      { key: 'title', label: 'Pozisyon Adı', type: 'text' },
                      { key: 'desc', label: 'Açıklama', type: 'text' }
                    ],
                    'Pozisyonlar'
                  )
                )}
               </div>
            )}
          </div>
        )}

      {block.type === 'about_hero' && (
        <div className="space-y-4">
          {renderHeroOverlaySetting()}
          {renderCommonFields()}
          {renderInputWithStyle("Rozet (Badge)", "badge")}
          {renderImageUpload("Arka Plan Görseli", "image")}
          {renderArrayEditor('buttons', [
            {key: 'label', label: 'Metin', type: 'text'}, 
            {key: 'url', label: 'URL', type: 'url'}, 
            {key: 'primary', label: 'Birincil Mi? (Boş veya true)', type: 'text'}
          ], 'Butonlar')}
        </div>
      )}
      
      {block.type === 'academic_hero' && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderImageUpload("Görsel", "image")}
        </div>
      )}

      {block.type === 'contact_hero' && (
        <div className="space-y-4">
          {renderCommonFields()}
        </div>
      )}

      {block.type === 'news_hero' && (
        <div className="space-y-4">
          {renderHeroOverlaySetting()}
          {renderTextareaWithStyle("Başlık", "title")}
          {renderTextareaWithStyle("Alt Başlık", "subtitle")}
          {renderImageUpload("Arkaplan Görseli", "image")}
        </div>
      )}

      {block.type === 'news_grid' && (
        <div className="space-y-4">
          <div className="font-bold text-sm text-slate-700 mb-2">Haberler / Duyurular</div>
          {renderArrayEditor(
            "categories",
            [
              { key: "label", label: "Kategori Adı", type: "text" }
            ],
            "Kategoriler"
          )}
          {renderArrayEditor(
            "items",
            [
              { key: "image", label: "Haber Görseli", type: "image" },
              { key: "tag", label: "Kategori Etiketi", type: "text" },
              { key: "tagColor", label: "Etiket Renk Sınıfı (örn: bg-primary)", type: "text" },
              { key: "date", label: "Tarih", type: "text" },
              { key: "title", label: "Haber Başlığı", type: "text" },
              { key: "desc", label: "Haber Özeti", type: "textarea" },
              { key: "url", label: "Haber Linki", type: "url" },
              { key: "buttonText", label: "Buton Metni (örn: Devamını Oku)", type: "text" },
              { key: "hideButton", label: "Butonu Gizle", type: "checkbox" }
            ],
            "Haber İçerikleri"
          )}
        </div>
      )}

      {block.type === 'newsletter' && (
        <div className="space-y-4">
          {renderInputWithStyle("İkon (örn: mail)", "icon", "icon")}
          {renderTextareaWithStyle("Başlık", "title")}
          {renderTextareaWithStyle("Açıklama", "desc")}
          {renderInputWithStyle("Giriş Alanı Metni (Placeholder)", "placeholder")}
          {renderInputWithStyle("Buton Metni", "buttonText")}
          {renderTextareaWithStyle("Alt Bilgi (Disclaimer)", "disclaimer")}
        </div>
      )}
      
            <MediaPickerModal
        isOpen={mediaPickerConfig.isOpen}
        onClose={() =>
          setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }))
        }
        onSelect={(url) => {
          mediaPickerConfig.onSelect(url);
          setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
}
