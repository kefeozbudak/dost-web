with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

idx1 = code.find('{type === "quick_contact_form" ? (')
idx2 = code.find(') : (\n<div className="pt-6 whitespace-normal md:whitespace-pre-line">', idx1)

if idx1 != -1 and idx2 != -1:
    code = code[:idx1] + '<div className="pt-6 whitespace-normal md:whitespace-pre-line">' + code[idx2 + 70:]
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Fixed target!")
else:
    print("Not found target!")

