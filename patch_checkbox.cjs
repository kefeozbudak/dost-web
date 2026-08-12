const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const checkboxFunc = `  const renderCheckbox = (label: string, key: string) => (
    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <input
        type="checkbox"
        checked={block[key] === true}
        onChange={(e) => handleChange(key, e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded border-gray-300"
      />
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>
    </div>
  );

  const renderImageUpload`;

content = content.replace(/  const renderImageUpload/g, checkboxFunc);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
