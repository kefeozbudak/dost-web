import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

compress_func = """
const compressImage = (file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

"""

# Insert compressImage before BlockFormEditorProps
content = content.replace("interface BlockFormEditorProps {", compress_func + "interface BlockFormEditorProps {")

# Update renderImageUpload
old_renderImageUpload = """  const renderImageUpload = (label: string, key: string) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          handleChange(key, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };"""

new_renderImageUpload = """  const renderImageUpload = (label: string, key: string) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const compressed = await compressImage(file);
          handleChange(key, compressed);
        } catch (err) {
          console.error("Resim yüklenemedi", err);
          alert("Resim yüklenirken bir hata oluştu.");
        }
      }
    };"""

content = content.replace(old_renderImageUpload, new_renderImageUpload)

# Update renderImageUploadArray
old_renderImageUploadArray = """  const renderImageUploadArray = (label: string, arrayKey: string, index: number, itemKey: string) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          handleArrayChange(arrayKey, index, itemKey, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };"""

new_renderImageUploadArray = """  const renderImageUploadArray = (label: string, arrayKey: string, index: number, itemKey: string) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const compressed = await compressImage(file);
          handleArrayChange(arrayKey, index, itemKey, compressed);
        } catch (err) {
          console.error("Resim yüklenemedi", err);
          alert("Resim yüklenirken bir hata oluştu.");
        }
      }
    };"""

content = content.replace(old_renderImageUploadArray, new_renderImageUploadArray)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
