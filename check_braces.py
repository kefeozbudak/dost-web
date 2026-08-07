with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

count = 0
for char in text:
    if char == '{': count += 1
    elif char == '}': count -= 1
print(f"Final brace balance: {count}")
