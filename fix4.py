with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# 1. Remove the opening ternary
idx = code.find('{type === "quick_contact_form" ? (')
end_idx = code.find('          ) : (<div className="pt-6 whitespace-normal md:whitespace-pre-line">', idx)

if idx != -1 and end_idx != -1:
    code = code[:idx] + code[end_idx + 15:]
    print("Removed opening ternary")

# 2. Remove the `)}` at the end
# The string to find is exactly `          )}` around line 2348.
# Let's find it in the context of `SINAV SONUCUNU ÖĞREN`
target = """                {block.buttonText || "SINAV SONUCUNU ÖĞREN"}
              </button>
            </div>
          )}
          </div>
          <div className="w-full md:w-1/3 h-[280px] md:h-[360px] relative shrink-0 whitespace-normal md:whitespace-pre-line">"""

new_target = """                {block.buttonText || "SINAV SONUCUNU ÖĞREN"}
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 h-[280px] md:h-[360px] relative shrink-0 whitespace-normal md:whitespace-pre-line">"""

if target in code:
    code = code.replace(target, new_target)
    print("Removed closing ternary")
else:
    print("Could not find closing ternary")

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

