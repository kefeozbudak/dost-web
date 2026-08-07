import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

# Add ids to inputs
c = c.replace(
    'type="number"\n          min="0"\n          max={data.total}\n          placeholder="0"\n          value={data.correct}',
    'id={`${subjectKey}-correct`}\n          name={`${subjectKey}-correct`}\n          type="number"\n          min="0"\n          max={data.total}\n          placeholder="0"\n          value={data.correct}'
)

c = c.replace(
    'type="number"\n          min="0"\n          max={data.total}\n          placeholder="0"\n          value={data.wrong}',
    'id={`${subjectKey}-wrong`}\n          name={`${subjectKey}-wrong`}\n          type="number"\n          min="0"\n          max={data.total}\n          placeholder="0"\n          value={data.wrong}'
)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

