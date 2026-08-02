import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# Replace the corrupted top section
correct_top = """import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import IconField, { IconPreview } from './IconField';

export const DynamicBlockRenderer = ({ blocks, onBlockClick }: { blocks: any[], onBlockClick?: (index: number, e?: React.MouseEvent) => void }) => {
  if (!blocks || !Array.isArray(blocks)) return null;
"""

# Let's find where the real code starts, after all the duplication.
# It seems `      if (block.type === 'achievements_hero') {` is there. But wait, I already MOVED `achievements_hero` to the bottom!
# So if it's still at the top, I didn't clean it up properly!
# Let's find `  const renderBlock = (block: any, index: number) => {`
start_of_real_stuff = code.find("  const renderBlock = (block: any, index: number) => {")
if start_of_real_stuff != -1:
    code = correct_top + code[start_of_real_stuff:]
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Fixed top of PageBlocks")
else:
    print("Could not find renderBlock")
