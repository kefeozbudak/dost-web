const fs = require('fs');

let page_editor = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

if (!page_editor.includes('activeArrayItem={activeArrayItem}')) {
    page_editor = page_editor.replace(
        '<BlockFormEditor',
        '<BlockFormEditor activeArrayItem={activeArrayItem}'
    );
}

fs.writeFileSync('src/admin/PageEditor.tsx', page_editor);
