const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const target = `                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === 'menu_features') {`;

const replace = `                  ))}
                </div>
              </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === 'menu_features') {`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/PageBlocks.tsx', content);
