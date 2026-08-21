import re
with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

start_idx = code.find('{type === "quick_contact_form" ? (')
end_idx = code.find('          ) : (<div className="pt-6 whitespace-normal md:whitespace-pre-line">', start_idx)

if start_idx != -1 and end_idx != -1:
    # Remove the inserted `type === quick_contact_form ? ... : (`
    code = code[:start_idx] + code[end_idx + 15:]
    
    # Also I need to remove the `)}` that was appended wherever it was appended.
    # Where was it appended?
    # It was appended at the end of the match.
    # Let's find the `)}` that was incorrectly added.
    # Actually, if I just git checkout src/components/PageBlocks.tsx... I can't.
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Reverted start")
