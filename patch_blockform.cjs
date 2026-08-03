const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const contactFormStr = `        {block.type === 'contact_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
          </div>
        )}`;

const newBlock = `        {block.type === 'club_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
          </div>
        )}`;

if (code.indexOf("block.type === 'club_registration_form'") === -1) {
    code = code.replace(contactFormStr, contactFormStr + '\\n\\n' + newBlock);
    fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
    console.log('Added to BlockFormEditor');
} else {
    console.log('Already exists');
}
