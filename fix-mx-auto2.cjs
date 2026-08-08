const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

function replaceMxAuto(blockStartPattern, blockEndPattern, searchStr) {
  let startIndex = 0;
  while ((startIndex = code.indexOf(blockStartPattern, startIndex)) !== -1) {
    let endIndex = code.indexOf(blockEndPattern, startIndex);
    if (endIndex === -1) endIndex = code.length;
    
    let chunk = code.substring(startIndex, endIndex);
    chunk = chunk.replace(new RegExp(searchStr, 'g'), '${getAlignClass(block)}');
    
    code = code.substring(0, startIndex) + chunk + code.substring(endIndex);
    startIndex = endIndex;
  }
}

// EduSystemHeroBlock
const eduSysIdx = code.indexOf('const EduSystemHeroBlock = (');
if (eduSysIdx !== -1) {
  const endIdx = code.indexOf('};', eduSysIdx);
  let chunk = code.substring(eduSysIdx, endIdx);
  chunk = chunk.replace('max-w-3xl mx-auto', 'max-w-3xl ${getAlignClass(block)}');
  code = code.substring(0, eduSysIdx) + chunk + code.substring(endIdx);
}

// CareerHeroBlock
const careerIdx = code.indexOf('const CareerHeroBlock = (');
if (careerIdx !== -1) {
  const endIdx = code.indexOf('};', careerIdx);
  let chunk = code.substring(careerIdx, endIdx);
  chunk = chunk.replace('max-w-2xl mx-auto', 'max-w-2xl ${getAlignClass(block)}');
  code = code.substring(0, careerIdx) + chunk + code.substring(endIdx);
}

// BurslulukHeroBlock
const burslulukIdx = code.indexOf('const BurslulukHeroBlock = (');
if (burslulukIdx !== -1) {
  const endIdx = code.indexOf('};', burslulukIdx);
  let chunk = code.substring(burslulukIdx, endIdx);
  // Let's see what's in BurslulukHeroBlock
  chunk = chunk.replace('max-w-2xl mx-auto', 'max-w-2xl ${getAlignClass(block)}');
  chunk = chunk.replace('max-w-3xl mx-auto', 'max-w-3xl ${getAlignClass(block)}');
  chunk = chunk.replace('max-w-4xl mx-auto', 'max-w-4xl ${getAlignClass(block)}');
  code = code.substring(0, burslulukIdx) + chunk + code.substring(endIdx);
}

// Standard hero block
const heroIdx = code.indexOf('case "hero":');
if (heroIdx !== -1) {
  const endIdx = code.indexOf('case "services":', heroIdx);
  let chunk = code.substring(heroIdx, endIdx);
  chunk = chunk.replace('max-w-4xl mx-auto', 'max-w-4xl ${getAlignClass(block)}');
  chunk = chunk.replace('max-w-3xl mx-auto', 'max-w-3xl ${getAlignClass(block)}');
  code = code.substring(0, heroIdx) + chunk + code.substring(endIdx);
}

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Fixed heroes!");
