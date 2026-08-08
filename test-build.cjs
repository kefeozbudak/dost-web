const ts = require('typescript');
const fs = require('fs');

const code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');
const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React }
});

if (result.diagnostics && result.diagnostics.length > 0) {
    console.error("TypeScript errors found.");
    process.exit(1);
}
console.log("TypeScript parsing successful.");
