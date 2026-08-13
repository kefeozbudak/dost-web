import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DynamicBlockRenderer } from '../components/PageBlocks';
import { defaultHomePageData } from '../lib/defaultData';
import { extractAndSaveBase64Images } from '../lib/imageCompressor';
import { X, Settings, GripHorizontal } from 'lucide-react';
import BlockFormEditor from './BlockFormEditor';
import Draggable from 'react-draggable';

import { resolveMediaUrls } from '../lib/resolveMedia';

export default function PageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const nodeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [editorPos, setEditorPos] = useState({ x: window.innerWidth - 420 > 0 ? window.innerWidth - 420 : 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, select, option')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: editorPos.x,
      posY: editorPos.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setEditorPos({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [activeArrayItem, setActiveArrayItem] = useState<{ arrayKey: string, index: number } | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pages'), (snapshot) => {
      let fetchedPages = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        setPagesList(fetchedPages.filter((p: any) => !p.isDeleted));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pageId) return;
        
        // Fetch pages list
        // pagesList is now populated via a separate effect

        // Fetch current page
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().blocks && docSnap.data().blocks.length > 0) {
          const data = docSnap.data(); 
          data.blocks = data.blocks?.filter((b: any) => b.type !== "header" && b.type !== "footer");

          // Patch for tuition_fees
          const newBlocks = [];
          data.blocks.forEach(block => {
            if (block.type === 'tuition_fees' && block.title) {
              newBlocks.push({
                type: 'tuition_fees_hero',
                id: block.id ? block.id + '_hero' : 'tf_hero_' + Date.now() + Math.random(),
                title: block.title,
                subtitle: block.subtitle,
                badge: block.badge,
                image: block.image,
                styles: block.styles
              });
              newBlocks.push({
                ...block,
                title: undefined,
                subtitle: undefined,
                badge: undefined,
                image: undefined
              });
            } else {
              newBlocks.push(block);
            }
          });
          data.blocks = newBlocks;
 
          resolveMediaUrls(data).then(resolved => setPageData(resolved));
                } else if (pageId === 'egitim-sistemimiz') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz', blocks: module.defaultEgitimSistemiData };
            setPageData(defaultData);
          });
        } else if (pageId === 'is-basvuru-formu' || pageId === 'is-basvurusu') {
          import('../lib/defaultData').then(({ defaultCareerPageData }) => {
            const defaultData = {
              title: 'İş Başvurusu',
              path: '/is-basvurusu',
              blocks: defaultCareerPageData
            };
            setPageData(defaultData);
          });
        } else if (pageId === 'home') {
          const defaultData = { title: 'Ana Sayfa', path: '/', blocks: defaultHomePageData.filter(b => b.type !== "header" && b.type !== "footer") };
          setPageData(defaultData);
                                } else if (pageId === 'duyurular') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Duyurular', path: '/duyurular', blocks: module.defaultDuyurularData };
            setPageData(defaultData);
          });
} else if (pageId === 'basarilarimiz') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Başarılarımız', path: '/basarilarimiz', blocks: module.defaultBasarilarimizData };
            setPageData(defaultData);
          });
} else if (pageId === 'hakkimizda') {
          import('../lib/defaultData').then(({ defaultHakkimizdaData }) => {
            const defaultData = { title: 'Hakkımızda', path: '/hakkimizda', blocks: defaultHakkimizdaData };
            setPageData(defaultData);
          });
        } else if (pageId === 'on-kayit') {
          import('../lib/defaultData').then(({ defaultPreRegistrationData }) => {
            const defaultData = { title: 'Öğrenci Ön Kayıt Formu', path: '/on-kayit', blocks: defaultPreRegistrationData };
            setPageData(defaultData);
          });
        } else if (pageId === 'bursluluk-basvuru-formu') {
          import('../lib/defaultData').then(({ defaultScholarshipPageData }) => {
            const defaultData = { title: 'Bursluluk Sınav Başvurusu', path: '/bursluluk-basvuru-formu', blocks: defaultScholarshipPageData };
            setPageData(defaultData);
          });
        } else if (pageId === 'bursluluk-basvuru-onay') {
          import('../lib/defaultData').then(({ defaultScholarshipConfirmationPageData }) => {
            const defaultData = { title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay', blocks: defaultScholarshipConfirmationPageData };
            setPageData(defaultData);
          });
        } else if (pageId === 'lgs-puan-hesaplama') {
          import('../lib/defaultData').then(({ defaultLgsCalculatorData }) => {
            const defaultData = { title: 'LGS Puan Hesaplama Modülü', path: '/lgs-puan-hesaplama', blocks: defaultLgsCalculatorData };
            setPageData(defaultData);
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageId]);

  const handleBlockClick = (index: number, e?: React.MouseEvent) => {
    setSelectedBlockIndex(index);
    setEditorVisible(true);
    setActiveArrayItem(null);

    if (e) {
      let x = e.clientX + 20;
      let y = e.clientY - 50;
      // Keep it within screen bounds
      if (x + 380 > window.innerWidth) x = window.innerWidth - 400;
      if (y + 600 > window.innerHeight) y = window.innerHeight - 620;
      if (x < 20) x = 20;
      if (y < 20) y = 20;
      setEditorPos({ x, y });

      const block = pageData?.blocks?.[index];
      if (block && e.target) {
        let currentTarget: HTMLElement | null = e.target as HTMLElement;
        let textContent = '';
        let imageSrc = '';
        let originalTarget = e.target as HTMLElement;
        
        let depth = 0;
        while (currentTarget && depth < 5) {
            if (currentTarget.textContent) {
                const txt = currentTarget.textContent.trim();
                if (txt && !textContent) textContent = txt;
            }
            if (currentTarget.tagName === 'IMG' && !imageSrc) {
                imageSrc = (currentTarget as HTMLImageElement).src;
            } else if (currentTarget.style && currentTarget.style.backgroundImage && !imageSrc) {
                imageSrc = currentTarget.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            }
            currentTarget = currentTarget.parentElement;
            depth++;
        }

        const arrays = ['items', 'days', 'buttons', 'categories', 'legends', 'sidebarItems'];
        
        let blockContainer = originalTarget.closest('.group\\/block') || originalTarget.closest('section');
        let matchingDOMIndex = -1;
        let explicitArrayIndex = -1;
        
        // Look for data-editor-item-index in ancestors
        let currentItem = originalTarget;
        while(currentItem && currentItem !== blockContainer) {
            if (currentItem.hasAttribute('data-editor-item-index')) {
                explicitArrayIndex = parseInt(currentItem.getAttribute('data-editor-item-index') || '-1', 10);
                break;
            }
            currentItem = currentItem.parentElement as HTMLElement;
        }

        if (explicitArrayIndex === -1 && blockContainer && textContent) {
            const walker = document.createTreeWalker(blockContainer, NodeFilter.SHOW_ELEMENT, null);
            let matchCount = 0;
            let currentNode = walker.nextNode();
            while(currentNode) {
                const el = currentNode as HTMLElement;
                if (el.children.length === 0 && el.textContent?.trim() === textContent) {
                    if (el === originalTarget || el.contains(originalTarget) || originalTarget.contains(el)) {
                        matchingDOMIndex = matchCount;
                        break;
                    }
                    matchCount++;
                }
                currentNode = walker.nextNode();
            }
        }

        let bestMatch: { arrayKey: string, index: number } | null = null;
        let found = false;

        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            if (explicitArrayIndex !== -1 && explicitArrayIndex < block[arrKey].length) {
                // If it's a known array key that we added explicit indexes for, use it.
                // Assuming explicit array indexes are mostly for 'items'.
                bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                found = true;
                break;
            }
            let stringMatches = [];
            
            for (let i = 0; i < block[arrKey].length; i++) {
              const item = block[arrKey][i];
              if (!item) continue;
              
              if (typeof item === 'string') {
                if (textContent && textContent.includes(item)) {
                  stringMatches.push({ arrayKey: arrKey, index: i });
                }
                continue;
              }

              if (imageSrc) {
                const itemImg = item.image || item.icon || item.logo || item.url || item.thumbnail;
                if (itemImg && typeof itemImg === 'string' && imageSrc.includes(itemImg)) {
                  bestMatch = { arrayKey: arrKey, index: i };
                  found = true; break;
                }
              }

              if (textContent && textContent.length > 0) {
                 const match = Object.values(item).some(val => {
                    if (typeof val === 'string' && val.length > 1) {
                        return textContent.includes(val) || val.includes(textContent);
                    }
                    return false;
                 });
                 if (match) {
                    stringMatches.push({ arrayKey: arrKey, index: i });
                 }
              }
            }
            
            if (found) break;
            
            if (stringMatches.length > 0) {
                if (explicitArrayIndex !== -1 && explicitArrayIndex < stringMatches.length) {
                    bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                } else if (matchingDOMIndex !== -1 && matchingDOMIndex < stringMatches.length) {
                    bestMatch = stringMatches[matchingDOMIndex];
                } else {
                    bestMatch = stringMatches[0];
                }
                break;
            }
          }
        }
        
        if (bestMatch) {
            setActiveArrayItem(bestMatch);
        }
      }
    }
  };

  const handleBlockChange = (updatedBlock: any) => {
    if (selectedBlockIndex === null) return;
    setPageData((prev: any) => {
      if (!prev) return prev;
      const newBlocks = [...(prev.blocks || [])];
      newBlocks[selectedBlockIndex] = updatedBlock;
      return { ...prev, blocks: newBlocks };
    });
  };

  const getPagePath = () => {
    if (pageData?.path && pageData.path.trim()) {
      return pageData.path.startsWith('/') ? pageData.path : `/${pageData.path}`;
    }
    if (pageId === 'home') return '/';
    return pageId ? (pageId.startsWith('/') ? pageId : `/${pageId}`) : '/';
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const previewUrl = getPagePath();
    window.open(previewUrl, '_blank');
  };

  const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Zaman aşımı: İşlem çok uzun sürdü. Günlük Firebase kotanız dolmuş olabilir.")), ms);
      promise.then(res => {
        clearTimeout(timer);
        resolve(res);
      }).catch(err => {
        clearTimeout(timer);
        reject(err);
      });
    });
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const pathToSave = getPagePath();
      let dataToSave = {
        ...pageData,
        path: pathToSave,
        title: pageData?.title || (pageId === 'home' ? 'Ana Sayfa' : pageId),
        updatedAt: Date.now()
      };
      
      dataToSave = await withTimeout(extractAndSaveBase64Images(dataToSave, db), 15000);

      console.log("Saving dataToSave:", dataToSave);
      await withTimeout(setDoc(doc(db, 'pages', pageId), dataToSave, { merge: true }), 10000);
      resolveMediaUrls(dataToSave).then(resolved => setPageData(resolved));
      alert('Sayfa başarıyla kaydedildi!');
    } catch (e: any) {
      console.error("Save error during setDoc or extractAndSaveBase64Images:", e);
      alert('Kaydedilirken hata oluştu: ' + (e.message || 'Bilinmeyen hata'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Yükleniyor...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative font-sans text-slate-800" translate="no">
      <div className="h-auto sm:h-14 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center py-3 sm:py-0 px-4 sm:px-6 justify-between bg-white z-10 shrink-0 gap-3 sm:gap-0">
        <h1 className="font-bold text-sm text-slate-800 flex items-center flex-wrap gap-2">
          Sayfa Düzenleyici: <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">{pageId}</span>
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <a 
            href={getPagePath()} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={handlePreviewClick}
            className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 bg-slate-800 text-white border border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Bu Sayfayı Ön İzle"
          >
            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            Ön İzleme
          </a>
          <button onClick={() => setEditorVisible(!editorVisible)} className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">
            {editorVisible ? 'Paneli Gizle' : 'Paneli Göster'}
          </button>
          <button onClick={() => navigate('/admin/pages')} className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">İptal</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Live Preview Area - Full Width */}
        <div className="flex-1 bg-slate-200/50 overflow-y-auto relative flex items-start justify-center">
          <div className="bg-surface-background w-full min-h-[500px] lg:min-h-[800px] overflow-hidden relative transition-all">
             <div className="w-full h-full overflow-y-auto overflow-x-hidden text-on-background pb-32">
               {pageData?.blocks && <DynamicBlockRenderer blocks={pageData.blocks} onBlockClick={handleBlockClick} />}
             </div>
          </div>
        </div>

        {/* Floating Form Editor */}
        {editorVisible && (

            <div 
              ref={nodeRef}
              className="fixed z-50 flex flex-col bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 rounded-xl transition-shadow focus-within:shadow-[0_10px_50px_-10px_rgba(0,0,0,0.4)] w-[380px] h-[600px]"
              style={{ top: `${editorPos.y}px`, left: `${editorPos.x}px`, resize: 'both', minWidth: '300px', minHeight: '300px', overflow: 'hidden' }}
            >
              <div 
                className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center cursor-move select-none shrink-0 rounded-t-xl"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <h2 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <GripHorizontal className="w-4 h-4 text-slate-400" />
                  Görsel Düzenleyici
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className={`px-3 py-1 ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1`}
                  >
                    {saving ? (
                      <span className="material-symbols-outlined text-[12px] animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-[12px]">save</span>
                    )}
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button onClick={() => setEditorVisible(false)} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[10px] font-bold uppercase transition-colors">
                    Gizle
                  </button>
                  {selectedBlockIndex !== null && (
                    <button onClick={() => setSelectedBlockIndex(null)} className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-700" title="Seçimi Temizle">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white rounded-b-xl">
                {selectedBlockIndex !== null && pageData?.blocks ? (
                  <BlockFormEditor activeArrayItem={activeArrayItem} 
                    block={pageData.blocks[selectedBlockIndex]} 
                    onChange={handleBlockChange}
                    pagesList={pagesList}
                    onSave={handleSave}
                    saving={saving}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <Settings className="w-8 h-8 text-slate-400" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-bold text-slate-700">Modül Seçilmedi</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">Arka plandaki önizlemeden düzenlemek istediğiniz bir bölüme tıklayın.</p>
                    </div>
                    
                    <div className="w-full border-t border-slate-200 mt-6 pt-6">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Yeni Bölüm Ekle</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { type: 'hero', label: 'Ana Başlık' },
                          { type: 'video', label: 'Video Alanı' },
                          { type: 'features', label: 'Özellikler' },
                          { type: 'campuses', label: 'Kampüsler' },
                          { type: 'education_levels', label: 'Eğitim Kademeleri' },
                          { type: 'stats', label: 'İstatistikler' },
                          { type: 'news', label: 'Haberler' },
                          { type: 'about_hero', label: 'Hakkımızda Hero' },
                          { type: 'academic_hero', label: 'Akademik Hero' },
                          { type: 'akademik_kadro', label: 'Akademik Kadro' },
                          { type: 'management_hero', label: 'Yönetim Kadrosu Hero' },
                          { type: 'management_rector', label: 'Rektör Bölümü' },
                          { type: 'management_vice_rectors', label: 'Rektör Yardımcıları' },
                          { type: 'management_deans', label: 'Dekanlar' },
                          { type: 'kindergarten_hero', label: 'Anaokulu Hero' },
                          { type: 'kindergarten_bento', label: 'Anaokulu Bento' },
                          { type: 'kindergarten_branches', label: 'Anaokulu Branşlar' },
                          { type: 'primary_school_hero', label: 'İlkokul Hero' },
                          { type: 'primary_school_bento', label: 'İlkokul Bento' },
                          { type: 'middle_school_hero', label: 'Ortaokul Hero' },
                          { type: 'middle_school_pedagogy', label: 'Ortaokul Pedagoji' },
                          { type: 'middle_school_lgs', label: 'Ortaokul LGS Bento' },
                          
                          
                          
                          { type: 'campus_hero', label: 'Kampüs Hero' },
                          { type: 'campus_bento', label: 'Kampüs Kademe (Bento)' },
                          { type: 'campus_gallery', label: 'Kampüs Tesisleri' },
                          { type: 'campus_life', label: 'Kampüs Yaşamı' },
                          { type: 'campus_contact', label: 'Kampüs İletişim' },

                          { type: 'contact_hero', label: 'İletişim Hero' },
                          { type: 'contact_campuses', label: 'Kampüs Kartları' },
                          { type: 'contact_form', label: 'İletişim Formu' },
                          { type: 'social_media', label: 'Sosyal Medya Linkleri' },

                          { type: 'tuition_fees_hero', label: 'Kayıt Ücretleri Hero' },
                          { type: 'tuition_fees', label: 'Kayıt Ücretleri (Tablolar)' },
                          { type: 'clubs_hero', label: 'Kulüp Hero' },
                          { type: 'clubs_grid', label: 'Kulüp Grid (Kartlar)' },
                          { type: 'clubs_benefits', label: 'Kulüp Avantajlar' },
                          { type: 'clubs_cta', label: 'Kulüp CTA' },

                          { type: 'high_school_hero', label: 'Lise Hero' },
                          { type: 'high_school_programs', label: 'Lise Programlar' },
                          { type: 'achievements_hero', label: 'Başarılar Hero' },
                          { type: 'achievements_academic_bento', label: 'Başarılar Akademik Bento' },
                          { type: 'achievements_social_gallery', label: 'Başarılar Sosyal Galeri' },
                          { type: 'achievements_science_projects', label: 'Başarılar Bilim Projeleri' },
                          { type: 'mission_vision', label: 'Misyon & Vizyon' },
                          { type: 'timeline', label: 'Tarihçe' },
                          { type: 'values', label: 'Değerler' },
                          { type: 'quote_image', label: 'Alıntı' },
                          { type: 'menu_hero', label: 'Yemek Menüsü Hero' },
                          { type: 'menu_calendar', label: 'Yemek Menüsü Takvim' },
                          { type: 'menu_features', label: 'Yemek Menüsü Özellikler' },
                          { type: 'academic_calendar_hero', label: 'Akademik Takvim Hero' },
                          { type: 'academic_calendar', label: 'Akademik Takvim Modülü' },
                          { type: 'pre_registration_form', label: 'Ön Kayıt Formu' },
                          { type: 'club_registration_form', label: 'Kulüp Kayıt Formu' },
                          { type: 'bursluluk_hero', label: 'Bursluluk Hero' },
                          { type: 'career_hero', label: 'Kariyer Hero' },
                          { type: 'career_benefits', label: 'Kariyer Avantajları' },
                          { type: 'career_application', label: 'İş Başvuru Formu' },
                          { type: 'edu_system_hero', label: 'Eğitim Sistemi Hero' },
                          { type: 'edu_system_levels', label: 'Eğitim Kademeleri' },
                          { type: 'edu_system_yadep', label: 'YADEP Modülü' },
                          { type: 'edu_system_philosophy', label: 'Pedagojik Felsefe' },
                          { type: 'edu_system_cta', label: 'Eğitim CTA' },
                          { type: 'bursluluk_exam_form', label: 'Bursluluk Sınav Başvuru Formu' },
                          { type: 'bursluluk_confirmation', label: 'Bursluluk Sınav Başvuru Onayı ve Giriş Belgesi' },
                          { type: 'bursluluk_info_cards', label: 'Bursluluk Bilgilendirme Kartları' },
                          { type: 'bursluluk_result_query', label: 'Bursluluk Sonuç Sorgulama' },
                          { type: 'lgs_calculator', label: 'LGS Puan Hesaplama Modülü' },
                        ].map((b, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const newBlock = { type: b.type, title: b.label + ' Başlığı' };
                              const newBlocks = [...(pageData.blocks || []), newBlock];
                              setPageData({ ...pageData, blocks: newBlocks });
                              setSelectedBlockIndex(newBlocks.length - 1);
                            }}
                            className="p-2 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-colors text-left"
                          >
                            + {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

        )}

        {!editorVisible && (
          <button 
            onClick={() => setEditorVisible(true)}
            className="absolute bottom-6 right-6 z-50 bg-slate-900 text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all group flex items-center gap-2"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow group-hover:animate-none" />
            <span className="text-xs md:text-sm font-bold pr-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              Düzenleyiciyi Aç
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
