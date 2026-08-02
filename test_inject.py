import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    content = f.read()

# Pattern: .map((VAR1, VAR2) => ( <TAG
# Example: .map((item: any, i: number) => ( <div
# Or: .map((btn: any, btnIdx: number) => ( <a

def replacer(match):
    prefix = match.group(1) # e.g. "block.items?.map((item: any, i: number) => ("
    tag_start = match.group(2) # e.g. "<div"
    return f'{prefix}\n{tag_start} data-editor-item="true" '

# This regex is a bit complex. Let's find a simpler way.
