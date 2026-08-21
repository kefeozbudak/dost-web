import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Only replace `type: 'text'` if it comes immediately after `key: 'url'` without any other `key:` in between
code = re.sub(r"(\{.*?key:\s*'url'.*?type:\s*)'text'", r"\g<1>'url'", code)
code = re.sub(r'(\{.*?key:\s*"url".*?type:\s*)"text"', r'\g<1>"url"', code)
code = re.sub(r"(\{.*?key:\s*'buttonUrl'.*?type:\s*)'text'", r"\g<1>'url'", code)
code = re.sub(r'(\{.*?key:\s*"buttonUrl".*?type:\s*)"text"', r'\g<1>"url"', code)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)
print("Safely patched url fields")
