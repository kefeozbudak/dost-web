const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    const initData: any = {};
    if (defaultInputs.length > 0) {
      defaultInputs.forEach((inp: any) => {
        if (inp.type !== 'section_title') {
           initData[inp.name] = inp.type === 'checkbox' ? false : "";
        }
      });
      if (type === 'club_registration_form' && block.clubs?.length > 0) {
        initData['club'] = "";
      }
    }
    setFormData(initData);
  }, [block, defaultInputs, type]);`;

const newEffect = `  useEffect(() => {
    setFormData((prev: any) => {
      const initData: any = { ...prev };
      let changed = false;
      const inputsToProcess = block.inputs || [];
      if (inputsToProcess.length > 0) {
        inputsToProcess.forEach((inp: any) => {
          if (inp.type !== 'section_title' && initData[inp.name] === undefined) {
             initData[inp.name] = inp.type === 'checkbox' ? false : "";
             changed = true;
          }
        });
        if (type === 'club_registration_form' && block.clubs?.length > 0 && initData['club'] === undefined) {
          initData['club'] = "";
          changed = true;
        }
      }
      return changed ? initData : prev;
    });
  }, [block.inputs, block.clubs, type]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
