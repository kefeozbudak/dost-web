const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/<EduSystemLevelsBlock\n\s*key=\{index\}\n\s*block=\{block\}\n\s*index=\{index\}\n\s*getStyle=\{getStyle\}\n\s*getTitleStyle=\{getTitleStyle\}\n\s*getSubtitleStyle=\{getSubtitleStyle\}\n\s*\/>/g, `<EduSystemLevelsBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
            />`);

code = code.replace(/<EduSystemYadepBlock\n\s*key=\{index\}\n\s*block=\{block\}\n\s*index=\{index\}\n\s*getStyle=\{getStyle\}\n\s*getTitleStyle=\{getTitleStyle\}\n\s*getSubtitleStyle=\{getSubtitleStyle\}\n\s*\/>/g, `<EduSystemYadepBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
            />`);

code = code.replace(/<EduSystemPhilosophyBlock\n\s*key=\{index\}\n\s*block=\{block\}\n\s*index=\{index\}\n\s*getStyle=\{getStyle\}\n\s*getTitleStyle=\{getTitleStyle\}\n\s*getSubtitleStyle=\{getSubtitleStyle\}\n\s*\/>/g, `<EduSystemPhilosophyBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
            />`);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
