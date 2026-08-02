import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# Let's find the proper block of `basarilarimiz_blocks`
# It starts with "if (block.type === 'achievements_hero') {"
# and ends with "    }" before `return null;\n  const getStyle` (Wait, I used the wrong end marker?)

# I will just extract the real code, which is everything EXCEPT the injected parts, and then insert ONE copy of the injected part at the end of renderContent.

# We know the injected part starts with `      if (block.type === 'achievements_hero') {`
# Let's extract exactly ONE copy of it.
marker = "      if (block.type === 'achievements_hero') {"
idx1 = code.find(marker)
# Find the end of this block
end_marker = "            </div>\n          </section>\n        );\n      }"
idx_end = code.find(end_marker, idx1) + len(end_marker)

extracted_block = code[idx1:idx_end]
print(f"Extracted length: {len(extracted_block)}")

# Now let's remove ALL occurrences of this extracted block.
code = code.replace(extracted_block, "")

# Now let's insert it at the end of `renderContent`.
# `renderContent` ends with:
#       }
#       return null;
#     };
# 
#     return (
#       <div
insert_marker = "      }\n      return null;\n    };\n\n    return ("
if insert_marker in code:
    print("Found insert marker!")
    code = code.replace(insert_marker, "      }\n" + extracted_block + "\n      return null;\n    };\n\n    return (")
else:
    print("Insert marker not found!")
    # Maybe missing a newline?
    insert_marker_2 = "      }\n\n      return null;\n    };\n\n    return ("
    if insert_marker_2 in code:
        print("Found insert marker 2!")
        code = code.replace(insert_marker_2, "      }\n" + extracted_block + "\n      return null;\n    };\n\n    return (")

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

