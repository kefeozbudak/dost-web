const fs = require('fs');
let content = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const replacement = `  const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
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
  };`;

content = content.replace(/  const handleSave = async \(\) => \{[\s\S]+?setSaving\(false\);\n    \}\n  \};/, replacement);

fs.writeFileSync('src/admin/PageEditor.tsx', content);
