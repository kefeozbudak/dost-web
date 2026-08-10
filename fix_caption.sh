#!/bin/bash
sed -i 's/><TextWithKvkkLink text={block.caption} \/}/><TextWithKvkkLink text={block.caption} \/><\/p>/g' src/components/PageBlocks.tsx
sed -i 's/{false && <p className="mt-4 text-xs md:text-caption text-text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.caption }}//g' src/components/PageBlocks.tsx
sed -i 's/^                  }//g' src/components/PageBlocks.tsx
