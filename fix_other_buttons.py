import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# Replace button mapping in about_hero
about_hero_buttons = """                    {block.buttons.map((btn: any, i: number) => (
                      <a key={i} href={btn.url || '#'} style={getButtonStyle(block)} className={btn.primary ? "bg-white text-primary px-8 py-3 rounded-xl font-label-md hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" : "border-2 border-white text-white px-8 py-3 rounded-xl font-label-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2"}>
                        {btn.label}
                        {btn.icon && <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span>}
                      </a>
                    ))}"""

new_about_hero_buttons = """                    {block.buttons.map((btn: any, i: number) => {
                       const isCustomColors = btn.bgColor || btn.textColor;
                       return (
                      <a key={i} href={btn.url || '#'} 
                         style={{
                           ...getButtonStyle(block),
                           ...(isCustomColors ? {
                             backgroundColor: btn.bgColor || undefined,
                             color: btn.textColor || undefined,
                             borderColor: !btn.primary && btn.bgColor ? btn.bgColor : undefined,
                             borderWidth: !btn.primary ? '2px' : undefined,
                             borderStyle: !btn.primary ? 'solid' : undefined,
                           } : {})
                         }} 
                         className={!isCustomColors ? (btn.primary ? "bg-white text-primary px-8 py-3 rounded-xl font-label-md hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" : "border-2 border-white text-white px-8 py-3 rounded-xl font-label-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2") : "px-8 py-3 rounded-xl font-label-md transition-colors flex items-center justify-center gap-2 hover:opacity-90"}>
                        {btn.label}
                        {btn.icon && <span className="material-symbols-outlined text-[1.1em]">{btn.icon}</span>}
                      </a>
                    )})}"""

code = code.replace(about_hero_buttons, new_about_hero_buttons)

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)
    
print("Updated about_hero buttons")
