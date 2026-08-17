const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

const overlaySetting = `
  const renderHeroOverlaySetting = () => (
    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg mt-4 mb-2">
      <input
        type="checkbox"
        checked={block.styles?.enableDarkOverlay || false}
        onChange={(e) => handleStyleChange("enableDarkOverlay", e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
      />
      <label className="text-sm font-medium text-slate-700">
        Karanlık Katman Uygula (Görsellerin üzerine yarı saydam siyah katman ekler. Üzerine gelindiğinde kaybolur.)
      </label>
    </div>
  );
`;

if (!content.includes('renderHeroOverlaySetting')) {
  content = content.replace('const renderCommonFields = () => (', overlaySetting + '\n  const renderCommonFields = () => (');
}

// Add to all hero types. Let's find all {block.type === "something_hero" && (
const lines = content.split('\n');
const newLines = [];
let insideHero = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  newLines.push(line);
  
  if (line.match(/\{block\.type === ['"][a-z_]*hero['"] && \(/) || 
      line.match(/\{\(block\.type === ['"][a-z_]*hero['"] \|\|/)) {
    // wait, we need to insert after <div className="space-y-4">
    // let's do it on the next line if it is <div className="space-y-4">
  }
}

// Easier way using regex to replace '<div className="space-y-4">' with '<div className="space-y-4">\n{renderHeroOverlaySetting()}' ONLY for heroes?
// Actually, renderCommonFields is used in many places. Let's just put it in renderCommonFields?
// No, not all blocks are heroes. But if we put it in renderCommonFields, it will show for all blocks. Is that bad?
// Maybe just add it to heroes.

