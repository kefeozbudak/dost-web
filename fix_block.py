with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

old_code = """  const renderInputWithStyle = (label: string, key: string) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        <FieldStylePicker
          block={block}
          fieldKey={key}
          onChange={handleStyleChange}
        />
      </div>
      <input
        type="text"
        value={block[key] || ""}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
      />
    </div>
  );"""

new_code = """  const renderInputWithStyle = (label: string, key: string, inputType: "text" | "checkbox" | "icon" = "text") => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        <FieldStylePicker
          block={block}
          fieldKey={key}
          onChange={handleStyleChange}
        />
      </div>
      {inputType === "checkbox" ? (
        <input
          type="checkbox"
          checked={!!block[key]}
          onChange={(e) => handleChange(key, e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
      ) : (
        <input
          type="text"
          value={block[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
        />
      )}
    </div>
  );"""

if old_code in code:
    code = code.replace(old_code, new_code)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code)
    print("Fixed BlockFormEditor.tsx")
else:
    print("Could not find code to replace")
