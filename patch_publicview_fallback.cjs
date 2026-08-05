const fs = require('fs');
let file = fs.readFileSync('./src/pages/PublicView.tsx', 'utf8');

const targetFallbackStr = `      if (docSnap.exists()) {
        let data = docSnap.data();
        
        // Resolve /api/media/ URLs to their actual Firestore URLs
        data = await resolveMediaUrls(data);
        
        if (data.isDeleted || data.isHidden) {`;

const newFallbackStr = `      if (docSnap.exists() && docSnap.data().blocks && docSnap.data().blocks.length > 0) {
        let data = docSnap.data();
        
        // Resolve /api/media/ URLs to their actual Firestore URLs
        data = await resolveMediaUrls(data);
        
        if (data.isDeleted || data.isHidden) {`;

file = file.replace(targetFallbackStr, newFallbackStr);

fs.writeFileSync('./src/pages/PublicView.tsx', file);
