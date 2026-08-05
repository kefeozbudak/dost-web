const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const newCases = `        case "career_hero":
          return <CareerHeroBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "career_benefits":
          return <CareerBenefitsBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "career_application":
          return <CareerApplicationBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} />;
`;

file = file.replace(
  `        case "contact_form":`,
  newCases + `        case "contact_form":`
);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
