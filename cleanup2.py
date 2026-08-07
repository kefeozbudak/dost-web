with open("src/pages/PublicView.tsx", "r") as f:
    c = f.read()

import re
c = re.sub(r'\{console\.log\("Rendering DynamicBlockRenderer with blocks:", pageData\.blocks\?\.length\)\}\n\s*', '', c)

with open("src/pages/PublicView.tsx", "w") as f:
    f.write(c)
