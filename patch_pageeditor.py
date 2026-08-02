with open("src/admin/PageEditor.tsx", "r") as f:
    content = f.read()

import re

old_save = """  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      console.log("Saving pageData:", pageData);
      await setDoc(doc(db, 'pages', pageId), pageData);
      alert('Sayfa başarıyla kaydedildi!');
    } catch (e: any) {
      console.error("Save error:", e);
      alert('Kaydedilirken hata oluştu: ' + (e.message || 'Bilinmeyen hata'));
    } finally {
      setSaving(false);
    }
  };"""

new_save = """  const handleSave = async () => {
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
  };"""

content = content.replace(old_save, new_save)

with open("src/admin/PageEditor.tsx", "w") as f:
    f.write(content)
