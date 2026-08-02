import sys

with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

old_code = """    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setPageData(snapshot.docs[0].data());
      } else if (location.pathname === '/') {"""

new_code = """    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        if (data.isDeleted || data.isHidden) {
          setPageData(null); // Pretend it doesn't exist if deleted or hidden
        } else {
          setPageData(data);
        }
      } else if (location.pathname === '/') {"""

if old_code in code:
    code = code.replace(old_code, new_code)
    with open('src/pages/PublicView.tsx', 'w') as f:
        f.write(code)
    print("Updated PublicView.tsx")
else:
    print("Could not find code block in PublicView.tsx")
