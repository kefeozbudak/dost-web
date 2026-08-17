const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(/renderArray\(/g, 'renderArrayEditor(');

const buttonsTarget1 = `{renderButtonsArray('Butonlar')}`;
const buttonsReplacement1 = `{renderArrayEditor('buttons', [{key: 'label', label: 'Metin', type: 'text'}, {key: 'url', label: 'URL', type: 'url'}, {key: 'icon', label: 'İkon', type: 'icon'}, {key: 'style', label: 'Stil (solid/outline vs)', type: 'text'}], 'Butonlar')}`;
code = code.replace(new RegExp(buttonsTarget1.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), buttonsReplacement1);

const buttonsTarget2 = `{renderButtonsArray('Yönlendirme Butonu (Sadece 1. buton görünür)')}`;
const buttonsReplacement2 = `{renderArrayEditor('buttons', [{key: 'label', label: 'Metin', type: 'text'}, {key: 'url', label: 'URL', type: 'url'}, {key: 'icon', label: 'İkon', type: 'icon'}], 'Yönlendirme Butonu (Sadece 1. buton görünür)')}`;
code = code.replace(new RegExp(buttonsTarget2.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), buttonsReplacement2);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
console.log("Fixed");
