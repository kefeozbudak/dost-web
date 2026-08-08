const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The block.quote element:
// <p
//   style={getSubtitleStyle(block)}
//   className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"
// >
//   {block.quote}
// </p>
//
// Should become:
// <p
//   style={{...getStyle(block, "quote"), whiteSpace: "pre-line"}}
//   className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line w-full md:w-auto"
// >
//   {block.quote}
// </p>

code = code.replace(
  /<p\s*style=\{getSubtitleStyle\(block\)\}\s*className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line">\s*\{block\.quote\}\s*<\/p>/g,
  `<p
                        style={{...getStyle(block, "quote"), whiteSpace: "pre-line"}}
                        className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line w-full md:w-auto"
                      >
                        {block.quote}
                      </p>`
);

// The block.authorName element:
// <h4 className="font-headline-md text-headline-md text-primary whitespace-pre-line w-full md:w-auto">
//   {block.authorName}
// </h4>
//
// Should become:
// <h4 style={getStyle(block, "authorName")} className="font-headline-md text-headline-md text-primary whitespace-pre-line w-full md:w-auto">
//   {block.authorName}
// </h4>

code = code.replace(
  /<h4 className="font-headline-md text-headline-md text-primary whitespace-pre-line w-full md:w-auto">\s*\{block\.authorName\}\s*<\/h4>/g,
  `<h4 style={getStyle(block, "authorName")} className="font-headline-md text-headline-md text-primary whitespace-pre-line w-full md:w-auto">
                          {block.authorName}
                        </h4>`
);

// The block.authorTitle element:
// <p className="text-text-muted whitespace-pre-line">
//   {block.authorTitle}
// </p>
//
// Should become:
// <p style={getStyle(block, "authorTitle")} className="text-text-muted whitespace-pre-line w-full md:w-auto">
//   {block.authorTitle}
// </p>

code = code.replace(
  /<p className="text-text-muted whitespace-pre-line">\s*\{block\.authorTitle\}\s*<\/p>/g,
  `<p style={getStyle(block, "authorTitle")} className="text-text-muted whitespace-pre-line w-full md:w-auto">
                          {block.authorTitle}
                        </p>`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
