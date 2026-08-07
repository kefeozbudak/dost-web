import re

with open("src/components/PageBlocks.tsx", "r") as f:
    c = f.read()

c = c.replace(
    "import NewsList from './NewsList';",
    "import NewsList from './NewsList';\nimport LgsCalculator from './LgsCalculator';"
)

c = c.replace(
    "case 'contact_form':\n      return <ContactForm block={block} />;",
    "case 'contact_form':\n      return <ContactForm block={block} />;\n    case 'lgs_calculator':\n      return <LgsCalculator block={block} />;"
)

with open("src/components/PageBlocks.tsx", "w") as f:
    f.write(c)
