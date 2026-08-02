import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Add logoHeight logic
target_logo_h = r"  const hoverColor = data\?\.hoverColor \|\| '#f97316';"
replacement_logo_h = r"""  const hoverColor = data?.hoverColor || '#f97316';
  const logoHeight = data?.logoHeight ? `${data.logoHeight}px` : '48px';"""
content = re.sub(target_logo_h, replacement_logo_h, content)

# Modify desktop logo height
target_desktop_logo = r'<img alt="Dost Koleji Logo" className="h-10 md:h-12 w-auto object-contain" src=\{logoSrc\} />'
replacement_desktop_logo = r'<img alt="Dost Koleji Logo" className="w-auto object-contain" style={{ height: logoHeight }} src={logoSrc} />'
content = re.sub(target_desktop_logo, replacement_desktop_logo, content)

# Modify mobile logo height
target_mobile_logo = r'<img alt="Logo" className="h-8 w-auto object-contain" src=\{logoSrc\} />'
replacement_mobile_logo = r'<img alt="Logo" className="w-auto object-contain" style={{ height: `calc(${logoHeight} * 0.7)` }} src={logoSrc} />'
content = re.sub(target_mobile_logo, replacement_mobile_logo, content)


with open("src/components/Header.tsx", "w") as f:
    f.write(content)
