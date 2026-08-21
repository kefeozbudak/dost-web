with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

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
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Fixed target!")
else:
    print("Not found target!")

