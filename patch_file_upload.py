import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """    setSubmitting(true);
    try {
      // Clean up files to base64 or drop them if too large
      const processedData = { ...formData };
      for (const key of Object.keys(processedData)) {
        if (processedData[key] instanceof File) {
          // Just store file name and size for demo purposes as we don't have Storage setup
          // Or read as DataURL if it's small, but to prevent firestore size limits, just metadata
          processedData[key] = {
            name: processedData[key].name,
            size: processedData[key].size,
            type: processedData[key].type,
            isUploaded: true,
          };
        }
      }"""

new_logic = """    setSubmitting(true);
    try {
      // Clean up files to base64 or drop them if too large
      const processedData = { ...formData };
      for (const key of Object.keys(processedData)) {
        if (processedData[key] instanceof File) {
          const file = processedData[key];
          // We must convert file to base64 string to store in Firestore without Firebase Storage
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
          };
        }
      }"""

if target in code:
    code = code.replace(target, new_logic)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched DynamicFormBuilder upload logic")
else:
    print("Could not find target logic")
