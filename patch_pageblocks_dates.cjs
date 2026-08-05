const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const targetStr = `            setBurslulukActive(data.burslulukActive);
            setBurslulukInactiveMessage(data.burslulukInactiveMessage || '');
          }
        }
      } catch (e) {`;

const newStr = `            let isActive = data.burslulukActive;
            
            if (isActive) {
               const now = new Date();
               if (data.burslulukStartDate && new Date(data.burslulukStartDate) > now) {
                  isActive = false;
               }
               if (data.burslulukEndDate && new Date(data.burslulukEndDate) < now) {
                  isActive = false;
               }
            }
            
            setBurslulukActive(isActive);
            setBurslulukInactiveMessage(data.burslulukInactiveMessage || '');
          }
        }
      } catch (e) {`;

file = file.replace(targetStr, newStr);
fs.writeFileSync('./src/components/PageBlocks.tsx', file);
