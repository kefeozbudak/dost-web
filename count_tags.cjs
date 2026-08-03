const fs = require('fs');
const ts = require('typescript');
const code = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');

const sourceFile = ts.createSourceFile(
  'ReportCenter.tsx',
  code,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

function traverse(node) {
  if (node.kind === ts.SyntaxKind.JsxOpeningElement || node.kind === ts.SyntaxKind.JsxSelfClosingElement || node.kind === ts.SyntaxKind.JsxOpeningFragment) {
    // console.log("JSX", ts.SyntaxKind[node.kind], node.tagName ? node.tagName.getText() : "Fragment", node.getStart());
  }
  ts.forEachChild(node, traverse);
}

// traverse(sourceFile);
// If it fails to parse, TS parser creates error nodes
let errors = [];
function findErrors(node) {
  if (node.kind === ts.SyntaxKind.JsxElement) {
    if (node.openingElement.tagName.getText() !== node.closingElement.tagName.getText()) {
      errors.push(`Mismatched tags: <${node.openingElement.tagName.getText()}> at ${node.openingElement.getStart()} and </${node.closingElement.tagName.getText()}>`);
    }
  }
  ts.forEachChild(node, findErrors);
}
findErrors(sourceFile);
console.log("Errors:", errors.length > 0 ? errors : "No mismatch found by simple check");
