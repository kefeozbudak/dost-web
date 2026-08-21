with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

start_idx = code.find('case "campus_bento":')
end_idx = code.find('</section>', start_idx) + 10
print(code[start_idx:end_idx])
