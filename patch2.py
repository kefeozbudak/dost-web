import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

# student info title
c = re.sub(
    r'<h2 className="font-headline-md text-headline-md text-primary">\s*Öğrenci ve Veli Bilgileri\s*</h2>',
    '<h2 className="font-headline-md text-headline-md text-primary print:text-black">{block.studentInfoTitle || "Öğrenci ve Veli Bilgileri"}</h2>',
    c, count=1
)

# labels
c = re.sub(
    r'<label className="font-label-md text-label-md text-on-surface-variant">\s*Öğrenci Adı Soyadı\s*</label>',
    '<label className="font-label-md text-label-md text-on-surface-variant print:text-black">{block.studentNamePlaceholder || "Öğrenci Adı Soyadı"}</label>',
    c, count=1
)

c = re.sub(
    r'<label className="font-label-md text-label-md text-on-surface-variant">\s*Veli Adı Soyadı\s*</label>',
    '<label className="font-label-md text-label-md text-on-surface-variant print:text-black">{block.parentNamePlaceholder || "Veli Adı Soyadı"}</label>',
    c, count=1
)

c = re.sub(
    r'<label className="font-label-md text-label-md text-on-surface-variant">\s*Veli Telefon\s*</label>',
    '<label className="font-label-md text-label-md text-on-surface-variant print:text-black">{block.phonePlaceholder || "Veli Telefon"}</label>',
    c, count=1
)

c = re.sub(
    r'<label className="font-label-md text-label-md text-on-surface-variant">\s*Mevcut Okulu\s*</label>',
    '<label className="font-label-md text-label-md text-on-surface-variant print:text-black">{block.schoolPlaceholder || "Mevcut Okulu"}</label>',
    c, count=1
)

# placeholders
c = re.sub(
    r'placeholder="Ad Soyad giriniz"',
    'placeholder={block.studentNamePlaceholder || "Ad Soyad giriniz"}',
    c, count=1
)
c = re.sub(
    r'placeholder="Ad Soyad giriniz"',
    'placeholder={block.parentNamePlaceholder || "Ad Soyad giriniz"}',
    c, count=1
)

# Print specific CSS for input fields (don't show borders, just a bottom line)
c = re.sub(
    r'className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md"',
    'className="w-full border border-border-subtle rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1"',
    c
)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

