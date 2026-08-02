import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

start_marker = "if (!blocks || !Array.isArray(blocks)) \n      if (block.type === 'achievements_hero') {"
# The injected block ends at `return null;` before `const getStyle`
end_marker = "      return null;\n  const getStyle"

# Find start and end indices
start_idx = code.find(start_marker)
end_idx = code.find(end_marker, start_idx) + len("      return null;\n")

injected_code = code[start_idx + len("if (!blocks || !Array.isArray(blocks)) \n"):end_idx - len("      return null;\n")]

# Clean the original code by removing the injected code
new_code = code[:start_idx] + "if (!blocks || !Array.isArray(blocks)) return null;\n" + code[end_idx:]

# Now find where to insert it! It should be just before the final `return null;` of `renderContent`.
# `renderContent` ends with:
#       }
#       return null;
#     }
#     
#     return (
#       <div ...

insert_marker = "      }\n\n      return null;\n    };\n\n    return ("
if insert_marker not in new_code:
    # Try another marker
    insert_marker = "      }\n      return null;\n    };\n\n    return ("

if insert_marker in new_code:
    new_code = new_code.replace(insert_marker, "      }\n" + injected_code + "\n      return null;\n    };\n\n    return (")
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(new_code)
    print("Fixed the injected code location!")
else:
    print("Could not find insert marker")
    
