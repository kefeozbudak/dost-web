import re

with open("src/admin/PageEditor.tsx", "r") as f:
    content = f.read()

old_code = """  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', pageId), pageData);
      alert('Sayfa başarıyla kaydedildi!');"""

new_code = """  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      console.log("Saving pageData:", pageData);
      await setDoc(doc(db, 'pages', pageId), pageData);
      alert('Sayfa başarıyla kaydedildi!');"""

content = content.replace(old_code, new_code)

with open("src/admin/PageEditor.tsx", "w") as f:
    f.write(content)
