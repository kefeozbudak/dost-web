with open('src/components/PageBlocks.tsx', 'r') as f:
    lines = f.readlines()

def fix_line(line):
    if 'material-symbols-outlined' not in line: return line
    if '.icon' not in line: return line
    if 'IconPreview' in line: return line # already handled btn.icon

    if "text-[#5eead4]\"" in line and "{item.icon || 'school'}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-[#5eead4]\">{item.icon || 'school'}</span>",
                            "{(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className=\"text-[#5eead4] w-6 h-6\" /> : <span className=\"material-symbols-outlined text-[#5eead4]\">{item.icon || 'school'}</span>}")

    if "text-2xl\"" in line and "{item.icon}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-2xl\">{item.icon}</span>",
                            "{(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className=\"w-6 h-6\" /> : <span className=\"material-symbols-outlined text-2xl\">{item.icon}</span>}")

    if "text-4xl\"" in line and "{item.icon || (isSecondary ? 'visibility' : 'flag')}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-4xl\">{item.icon || (isSecondary ? 'visibility' : 'flag')}</span>",
                            "{(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className=\"w-10 h-10\" /> : <span className=\"material-symbols-outlined text-4xl\">{item.icon || (isSecondary ? 'visibility' : 'flag')}</span>}")

    if "text-3xl mb-4`}" in line and "{item.icon || 'verified_user'}" in line:
        return line.replace("<span className={`material-symbols-outlined ${color} text-3xl mb-4`}>{item.icon || 'verified_user'}</span>",
                            "{(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className={`${color} w-8 h-8 mb-4`} /> : <span className={`material-symbols-outlined ${color} text-3xl mb-4`}>{item.icon || 'verified_user'}</span>}")

    if "text-[20px]\" style={{ color: 'inherit' }}>{item.icon || 'school'}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-[20px]\" style={{ color: 'inherit' }}>{item.icon || 'school'}</span>",
                            "{(typeof item.icon === 'object' || (typeof item.icon === 'string' && item.icon !== item.icon.toLowerCase())) ? <IconPreview data={item.icon} className=\"w-[20px] h-[20px]\" /> : <span className=\"material-symbols-outlined text-[20px]\" style={{ color: 'inherit' }}>{item.icon || 'school'}</span>}")

    if "text-primary\">{block.icon || 'school'}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-primary\">{block.icon || 'school'}</span>",
                            "{(typeof block.icon === 'object' || (typeof block.icon === 'string' && block.icon !== block.icon.toLowerCase())) ? <IconPreview data={block.icon} className=\"text-primary w-6 h-6\" /> : <span className=\"material-symbols-outlined text-primary\">{block.icon || 'school'}</span>}")

    if "text-primary\">{block.icon || 'groups'}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-primary\">{block.icon || 'groups'}</span>",
                            "{(typeof block.icon === 'object' || (typeof block.icon === 'string' && block.icon !== block.icon.toLowerCase())) ? <IconPreview data={block.icon} className=\"text-primary w-6 h-6\" /> : <span className=\"material-symbols-outlined text-primary\">{block.icon || 'groups'}</span>}")

    if "text-primary\">{block.icon || 'account_balance'}" in line:
        return line.replace("<span className=\"material-symbols-outlined text-primary\">{block.icon || 'account_balance'}</span>",
                            "{(typeof block.icon === 'object' || (typeof block.icon === 'string' && block.icon !== block.icon.toLowerCase())) ? <IconPreview data={block.icon} className=\"text-primary w-6 h-6\" /> : <span className=\"material-symbols-outlined text-primary\">{block.icon || 'account_balance'}</span>}")

    return line

with open('src/components/PageBlocks.tsx', 'w') as f:
    for line in lines:
        f.write(fix_line(line))

print("Patched all remaining icons")
