import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Replace all occurrences of `{ key: 'url', ..., type: 'text' }` or similar with `type: 'url'`
def repl(m):
    return m.group(0).replace("type: 'text'", "type: 'url'").replace('type: "text"', 'type: "url"')

code = re.sub(r"\{\s*key:\s*'url'.*?type:\s*'text'\s*\}", repl, code)
code = re.sub(r"\{\s*key:\s*'buttonUrl'.*?type:\s*'text'\s*\}", repl, code)
code = re.sub(r'\{\s*key:\s*"url".*?type:\s*"text"\s*\}', repl, code)
code = re.sub(r'\{\s*key:\s*"buttonUrl".*?type:\s*"text"\s*\}', repl, code)


with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)
print("Patched all url fields to type: 'url'")
