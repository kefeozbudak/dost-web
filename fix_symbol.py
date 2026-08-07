import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

c = c.replace('`${subjectKey}-correct`', '`${String(subjectKey)}-correct`')
c = c.replace('`${subjectKey}-wrong`', '`${String(subjectKey)}-wrong`')

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

