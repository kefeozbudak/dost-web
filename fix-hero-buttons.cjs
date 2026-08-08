const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The line is: className={`flex flex-col sm:flex-row gap-4 justify-center items-center w-full ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto relative z-10`}
// We should replace `justify-center items-center` with dynamic classes based on block.styles?.textAlign

const searchStr = 'className={`flex flex-col sm:flex-row gap-4 justify-center items-center w-full ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto relative z-10`}';

const replaceStr = 'className={`flex flex-col sm:flex-row gap-4 ${block.styles?.textAlign === "left" ? "justify-start items-start" : block.styles?.textAlign === "right" ? "justify-end items-end" : "justify-center items-center"} w-full ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto relative z-10`}'

if (code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  fs.writeFileSync('src/components/PageBlocks.tsx', code);
  console.log("Fixed standard hero buttons");
} else {
  console.log("Could not find standard hero buttons string");
}

