import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Specifically find ALL \{[^}]*key:\s*'(?:url|buttonUrl)'[^}]*\} and change type: 'text' to type: 'url' in them
def repl(m):
    original = m.group(0)
    replaced = re.sub(r"type:\s*'text'", "type: 'url'", original)
    replaced = re.sub(r'type:\s*"text"', 'type: "url"', replaced)
    return replaced

code = re.sub(r"\{[^\}]*key:\s*'(?:url|buttonUrl)'[^\}]*\}", repl, code)
code = re.sub(r'\{[^\}]*key:\s*"(?:url|buttonUrl)"[^\}]*\}', repl, code)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)
print("Strictly patched url fields")
