import re

with open("vite.config.ts", "r") as f:
    c = f.read()

c = re.sub(
    r"hmr: process\.env\.DISABLE_HMR !== 'true',",
    "hmr: process.env.DISABLE_HMR === 'true' ? false : { overlay: false },",
    c
)

with open("vite.config.ts", "w") as f:
    f.write(c)
