import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

c = c.replace('type="number"', 'type="text" inputMode="numeric" pattern="[0-9]*"')

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

