import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DynamicBlockRenderer } from '../components/PageBlocks';
import { defaultHomePageData } from '../lib/defaultData';
import { X, Settings, GripHorizontal } from 'lucide-react';
import BlockFormEditor from './BlockFormEditor';
import Draggable from 'react-draggable';

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pages'), (snapshot) => {
      let fetchedPages = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      const defaultPages = [
                { id: 'duyurular', title: 'Duyurular', path: '/duyurular' },
{ id: 'home', title: 'Ana Sayfa', path: '/' },
        { id: 'hakkimizda', title: 'Hakkımızda', path: '/hakkimizda' }
      ];
      defaultPages.forEach(dp => {
        if (!fetchedPages.find(p => p.id === dp.id)) {
          if (dp.id === 'home') fetchedPages.unshift(dp);
          else fetchedPages.push(dp);
        }
      });
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
        
        if (docSnap.exists()) {
          const data = docSnap.data(); data.blocks = data.blocks?.filter((b: any) => b.type !== "header" && b.type !== "footer"); setPageData(data);
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
} else if (pageId === 'yonetim-kadrosu') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Yönetim Kadrosu', path: '/yonetim-kadrosu', blocks: module.defaultYonetimKadrosuData };
            setPageData(defaultData);
          });
} else if (pageId === 'akademik-kadro') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Akademik Kadro', path: '/akademik-kadro', blocks: module.defaultAkademikKadroData };
            setPageData(defaultData);
          });
} else if (pageId === 'hakkimizda') {
          import('../lib/defaultData').then(({ defaultHakkimizdaData }) => {
            const defaultData = { title: 'Hakkımızda', path: '/hakkimizda', blocks: defaultHakkimizdaData };
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
    if (e) {
      let x = e.clientX + 20;
      let y = e.clientY - 50;
      // Keep it within screen bounds
      if (x + 380 > window.innerWidth) x = window.innerWidth - 400;
      if (y + 600 > window.innerHeight) y = window.innerHeight - 620;
      if (x < 20) x = 20;
      if (y < 20) y = 20;
      setEditorPos({ x, y });
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

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const dataToSave = {
        ...pageData,
        path: pageData.path || (pageId === 'home' ? '/' : `/${pageId}`),
        title: pageData.title || (pageId === 'home' ? 'Ana Sayfa' : pageId)
      };
      console.log("Saving dataToSave:", dataToSave);
      await setDoc(doc(db, 'pages', pageId), dataToSave);
      setPageData(dataToSave);
      alert('Sayfa başarıyla kaydedildi!');
    } catch (e: any) {
      console.error("Save error:", e);
      alert('Kaydedilirken hata oluştu: ' + (e.message || 'Bilinmeyen hata'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Yükleniyor...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative font-sans text-slate-800">
      <div className="h-auto sm:h-14 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center py-3 sm:py-0 px-4 sm:px-6 justify-between bg-white z-10 shrink-0 gap-3 sm:gap-0">
        <h1 className="font-bold text-sm text-slate-800 flex items-center flex-wrap gap-2">
          Sayfa Düzenleyici: <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">{pageId}</span>
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <a href={pageData?.path || '/'} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 bg-slate-800 text-white border border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center justify-center gap-1">
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
                  <BlockFormEditor 
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
                          { type: 'achievements_hero', label: 'Başarılar Hero' },
                          { type: 'achievements_academic_bento', label: 'Başarılar Akademik Bento' },
                          { type: 'achievements_social_gallery', label: 'Başarılar Sosyal Galeri' },
                          { type: 'achievements_science_projects', label: 'Başarılar Bilim Projeleri' },
                          { type: 'mission_vision', label: 'Misyon & Vizyon' },
                          { type: 'timeline', label: 'Tarihçe' },
                          { type: 'values', label: 'Değerler' },
                          { type: 'quote_image', label: 'Alıntı' }
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
