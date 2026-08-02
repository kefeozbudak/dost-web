import re

with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find `case '...': return ( <section ... >` and make sure it has style={getStyle(block, '')}

def add_style(match):
    tag = match.group(0)
    if "style=" in tag:
        # If it already has style, we might need to merge, or it might already have getStyle(block, '')
        if "getStyle(block, '')" not in tag:
             # Just a safety check, if it has a style but not getStyle, we will just leave it or replace it.
             # Actually, most cases have no style or style={getStyle(block, '')}
             pass
        return tag
    else:
        # insert style before closing >
        return tag[:-1] + " style={getStyle(block, '')}>"

# This regex matches the first <section ... > or <div ... > after a case statement, up to the closing >
# But we have to be careful. Let's just do it for <section key={index} ...> and <div key={index} ...>
content = re.sub(r'<section\s+key=\{index\}[^>]*>', add_style, content)
content = re.sub(r'<div\s+key=\{index\}[^>]*>', add_style, content)
content = re.sub(r'<section\s+key=\{block\.id\}[^>]*>', add_style, content)


with open('src/components/PageBlocks.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
