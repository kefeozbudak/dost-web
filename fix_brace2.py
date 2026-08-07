import re
with open("src/components/PageBlocks.tsx", "r") as f:
    c = f.read()

c = re.sub(r'\);\s*if \(block\.type === "tuition_fees"\)', ');\n      }\n      if (block.type === "tuition_fees")', c)
with open("src/components/PageBlocks.tsx", "w") as f:
    f.write(c)
print("Replaced with regex")
