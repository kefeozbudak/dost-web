const fs = require('fs');

let block_editor = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

if (!block_editor.includes('activeArrayItem')) {
    block_editor = block_editor.replace(
        'interface BlockFormEditorProps {',
        'interface BlockFormEditorProps {\n  activeArrayItem?: { arrayKey: string, index: number } | null;'
    );
    
    block_editor = block_editor.replace(
        'export default function BlockFormEditor({ block, onChange, pagesList, onSave, saving }: BlockFormEditorProps) {',
        `export default function BlockFormEditor({ block, onChange, pagesList, onSave, saving, activeArrayItem }: BlockFormEditorProps) {
  const arrayItemRefs = useRef<{[key: string]: HTMLDetailsElement | null}>({});
  useEffect(() => {
    if (activeArrayItem) {
      const key = \`\${activeArrayItem.arrayKey}-\${activeArrayItem.index}\`;
      const el = arrayItemRefs.current[key];
      if (el) {
        el.open = true;
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  }, [activeArrayItem, block]);
`
    );
    
    fs.writeFileSync('src/admin/BlockFormEditor.tsx', block_editor);
    console.log("Patched activeArrayItem successfully.");
} else {
    console.log("Already patched.");
}
