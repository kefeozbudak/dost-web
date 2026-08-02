const fs = require('fs');

let page_editor = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

if (!page_editor.includes('activeArrayItem={activeArrayItem}')) {
    page_editor = page_editor.replace(
        '<BlockFormEditor \\n                    block={pageData.blocks[selectedBlockIndex]}',
        '<BlockFormEditor \\n                    activeArrayItem={activeArrayItem}\\n                    block={pageData.blocks[selectedBlockIndex]}'
    );
    // Might not work due to regex/newlines, let's use a simpler replace
}

fs.writeFileSync('src/admin/PageEditor.tsx', page_editor);
