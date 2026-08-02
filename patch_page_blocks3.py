import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# Make sure IconPreview is imported
if 'IconPreview' not in code:
    code = code.replace("import { DynamicBlockRenderer } from '../components/PageBlocks';", "import { DynamicBlockRenderer } from '../components/PageBlocks';\nimport { IconPreview } from './IconField';")
    code = code.replace("import IconField, { IconPreview } from './IconField';", "import IconField, { IconPreview } from './IconField';")
    if 'import IconField, { IconPreview } from \'./IconField\';' not in code and 'import { IconPreview }' not in code:
        code = code.replace("import { db } from '../lib/firebase';", "import { db } from '../lib/firebase';\nimport { IconPreview } from './IconField';")

# Find all btn.icon material symbol usages and replace them with IconPreview
# Old 1: {btn.icon && <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span>}
code = code.replace('{btn.icon && <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span>}', '{btn.icon && (typeof btn.icon === "string" && btn.icon === btn.icon.toLowerCase() ? <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span> : <IconPreview data={btn.icon} className="w-[1.1em] h-[1.1em]" />)}')

# Old 2: {btn.icon && <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>}
code = code.replace('{btn.icon && <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>}', '{btn.icon && (typeof btn.icon === "string" && btn.icon === btn.icon.toLowerCase() ? <span className="material-symbols-outlined text-[18px]">{btn.icon}</span> : <IconPreview data={btn.icon} className="w-[18px] h-[18px]" />)}')

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

print("Patched PageBlocks for button icons")
