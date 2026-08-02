import re

with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_get_image = """  const getImageStyle = (obj: any, key: string, fallbackIndex = 0) => {
    let url = obj[key];
    if (!url || url.includes('lh3.googleusercontent.com/aida-public/')) {
      url = fallbackImages[fallbackIndex % fallbackImages.length];
    }
    const posX = obj[`${key}_posX`] ?? 50;
    const posY = obj[`${key}_posY`] ?? 50;
    const scale = obj[`${key}_scale`] ?? 100;
    return {
      backgroundImage: `url('${url}')`,
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundSize: scale !== 100 ? `${scale}%` : 'cover',
      backgroundRepeat: 'no-repeat'
    };
  };"""

new_get_image = """  const getImageStyle = (obj: any, key: string, fallbackIndex = 0) => {
    let url = obj[key];
    if (!url || url.includes('lh3.googleusercontent.com/aida-public/')) {
      url = fallbackImages[fallbackIndex % fallbackImages.length];
    }
    const posX = obj[`${key}_posX`] ?? 50;
    const posY = obj[`${key}_posY`] ?? 50;
    const scale = obj[`${key}_scale`] ?? 100;
    return {
      backgroundImage: `url('${url}')`,
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      scale: scale !== 100 ? `${scale / 100}` : undefined
    };
  };"""

content = content.replace(old_get_image, new_get_image)

with open('src/components/PageBlocks.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
