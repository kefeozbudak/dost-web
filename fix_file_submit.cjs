const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const oldSubmit = `    setSubmitting(true);
    try {
      if (submitForm) {`;

const newSubmit = `    setSubmitting(true);
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
            isUploaded: true
          };
        }
      }

      if (submitForm) {
        const resId = await submitForm(processedData);
        if (resId) setSubmittedDocId(resId);
      } else {
        const docRef = await addDoc(collection(db, "forms"), {
          type: type,
          createdAt: Date.now(),
          data: processedData
        });
        if (docRef?.id) setSubmittedDocId(docRef.id);
      }`;

file = file.replace(
  `    setSubmitting(true);
    try {
      if (submitForm) {
        const resId = await submitForm(formData);
        if (resId) setSubmittedDocId(resId);
      } else {
        const docRef = await addDoc(collection(db, "forms"), {
          type: type,
          createdAt: Date.now(),
          data: formData
        });
        if (docRef?.id) setSubmittedDocId(docRef.id);
      }`,
  newSubmit
);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
