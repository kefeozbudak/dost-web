import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """          // We must convert file to base64 string to store in Firestore without Firebase Storage
          const base64String = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          
          processedData[key] = {
            name: file.name,
            size: file.size,
            type: file.type,
            isUploaded: true,
            dataUrl: base64String // Store actual base64 content
          };"""

new_logic = """          // We must convert file to base64 string to store in Firestore without Firebase Storage
          // Max size around 700KB to fit within 1MB Firestore limit after base64 encoding
          if (file.size > 700 * 1024) {
            alert("Dosya boyutu çok büyük. Lütfen 700KB'dan küçük bir dosya yükleyiniz.");
            setSubmitting(false);
            return;
          }

          const base64String = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          
          processedData[key] = {
            name: file.name,
            size: file.size,
            type: file.type,
            isUploaded: true,
            dataUrl: base64String // Store actual base64 content
          };"""

if target in code:
    code = code.replace(target, new_logic)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched DynamicFormBuilder upload limit")
else:
    print("Could not find target logic")
