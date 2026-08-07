import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

# SubjectRow inputs
c = re.sub(
    r'className={`w-full border border-border-subtle rounded-lg px-3 py-2 text-center focus:ring-2 outline-none transition-shadow \$\{ringColor\} font-body-md`}',
    'className={`w-full border border-border-subtle rounded-lg px-3 py-2 text-center focus:ring-2 outline-none transition-shadow ${ringColor} font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1`}',
    c
)

c = re.sub(
    r'<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">',
    '<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary print:hidden">',
    c
)

c = re.sub(
    r'<div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">',
    '<div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary print:hidden">',
    c
)

c = re.sub(
    r'<div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mb-gutter">',
    '<div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mb-gutter print:shadow-none print:border-black">',
    c
)
c = re.sub(
    r'<div className="bg-primary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3">',
    '<div className="bg-primary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3 print:bg-white print:border-black">',
    c
)
c = re.sub(
    r'<div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm">',
    '<div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm print:shadow-none print:border-black">',
    c
)
c = re.sub(
    r'<div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mt-4">',
    '<div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mt-4 print:shadow-none print:border-black">',
    c
)
c = re.sub(
    r'<div className="bg-secondary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3">',
    '<div className="bg-secondary/5 border-b border-border-subtle px-6 py-4 flex items-center gap-3 print:bg-white print:border-black">',
    c
)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)
