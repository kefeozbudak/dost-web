with open("src/components/MediaPickerModal.tsx", "r") as f:
    lines = f.readlines()

# Remove lines 109, 110, 111 (0-indexed: 108, 109, 110)
del lines[108:111]

with open("src/components/MediaPickerModal.tsx", "w") as f:
    f.writelines(lines)
