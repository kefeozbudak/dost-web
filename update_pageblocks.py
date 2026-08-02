import re

with open("src/components/PageBlocks.tsx", "r") as f:
    content = f.read()

# Fix the hero style and cursor-pointer
target_hero_card = r'<div key=\{i\} className="group relative rounded-\[32px\] overflow-hidden cursor-pointer h-\[350px\] md:h-full flex-1 hover:flex-\[1\.5\] md:hover:flex-\[2\] lg:hover:flex-\[3\] transition-all duration-700 ease-in-out">'
replacement_hero_card = r'<div key={i} className="group relative rounded-[32px] overflow-hidden h-[350px] md:h-full flex-1 hover:flex-[1.5] md:hover:flex-[2] lg:hover:flex-[3] transition-all duration-700 ease-in-out">'
content = re.sub(target_hero_card, replacement_hero_card, content)

target_style = r'style=\{item\.image \? \(item\.image\.includes\(\'http\'\) \? \{ backgroundImage: `url\(\'\$\{item\.image\}\'\)` \} : getImageStyle\(item, \'image\'\)\) : \{\}\}'
replacement_style = r'style={getImageStyle(item, \'image\')}'
content = re.sub(target_style, replacement_style, content)

target_span = r'<span style=\{getItemTitleStyle\(block\)\} className="bg-white text-primary font-bold text-\[14px\] md:text-\[15px\] px-6 md:px-8 py-2\.5 md:py-3 rounded-full shadow-lg whitespace-nowrap block text-center transition-transform group-hover:-translate-y-1 duration-300">\{item\.title\}</span>'
replacement_span = r"""{item.url ? (
                              <a href={item.url} style={getItemTitleStyle(block)} className="bg-white text-primary font-bold text-[14px] md:text-[15px] px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg whitespace-nowrap block text-center transition-transform group-hover:-translate-y-1 duration-300 hover:bg-primary hover:text-white cursor-pointer">{item.title}</a>
                            ) : (
                              <span style={getItemTitleStyle(block)} className="bg-white text-primary font-bold text-[14px] md:text-[15px] px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg whitespace-nowrap block text-center transition-transform group-hover:-translate-y-1 duration-300">{item.title}</span>
                            )}"""
content = re.sub(target_span, replacement_span, content)

with open("src/components/PageBlocks.tsx", "w") as f:
    f.write(content)
