import sys

with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

old_code = """    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        if (data.isDeleted || data.isHidden) {"""

new_code = """    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        let data = snapshot.docs[0].data();
        
        // Auto-insert video block for homepage if missing
        if (location.pathname === '/' && data.blocks) {
           const hasVideo = data.blocks.some((b: any) => b.type === 'video');
           if (!hasVideo) {
              const statsIndex = data.blocks.findIndex((b: any) => b.type === 'stats');
              const videoBlock = defaultHomePageData.find(b => b.type === 'video');
              if (videoBlock) {
                  let newBlocks = [...data.blocks];
                  if (statsIndex !== -1) {
                      newBlocks.splice(statsIndex, 0, videoBlock);
                  } else {
                      newBlocks.push(videoBlock);
                  }
                  import('firebase/firestore').then(({ setDoc }) => {
                      setDoc(docRef, { blocks: newBlocks }, { merge: true });
                  });
                  data.blocks = newBlocks;
              }
           }
        }

        if (data.isDeleted || data.isHidden) {"""

if old_code in code:
    code = code.replace(old_code, new_code)
    with open('src/pages/PublicView.tsx', 'w') as f:
        f.write(code)
    print("Updated PublicView.tsx")
else:
    print("Could not find marker")
