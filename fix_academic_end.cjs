const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const target = `                  );
                })}
              </div>
            </div>
            {block.legends && block.legends.length > 0 && (`;

const replace = `                  );
                })}
              </div>
              </div>
            </div>
            {block.legends && block.legends.length > 0 && (`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/PageBlocks.tsx', content);
