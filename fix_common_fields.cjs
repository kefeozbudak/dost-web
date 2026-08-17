const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

content = content.replace(
  '  const renderCommonFields = () => (\n    <div className="space-y-4">\n      {renderHeroOverlaySetting()}\n    <div className="space-y-4">\n      {renderTextareaWithStyle("Başlık", "title")}',
  '  const renderCommonFields = () => (\n    <div className="space-y-4">\n      {renderTextareaWithStyle("Başlık", "title")}'
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Fixed renderCommonFields");
