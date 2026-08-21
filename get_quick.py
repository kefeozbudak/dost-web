with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

start_idx = code.find('const QuickContactFormBlock = ({')
end_idx = code.find('};', start_idx)
print(code[start_idx:end_idx+2])
