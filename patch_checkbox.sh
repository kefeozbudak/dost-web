#!/bin/bash
sed -i 's/<span className="font-bold text-primary whitespace-pre-line">/<TextWithKvkkLink text={input.label} \/>\n{false \&\& <span className="font-bold text-primary whitespace-pre-line">/g' src/components/PageBlocks.tsx
sed -i 's/{input.label.substring(input.label.indexOf(" ") + 1)}/{input.label.substring(input.label.indexOf(" ") + 1)}\n}<\/span>/g' src/components/PageBlocks.tsx
