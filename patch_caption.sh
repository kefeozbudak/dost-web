#!/bin/bash
sed -i 's/dangerouslySetInnerHTML={{ __html: block.caption }}/><TextWithKvkkLink text={block.caption} \/><\/p>\n{false \&\& <p className="mt-4 text-xs md:text-caption text-text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.caption }}/g' src/components/PageBlocks.tsx
sed -i 's/><\/p>/}/g' src/components/PageBlocks.tsx
