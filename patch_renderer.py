with open('src/components/PageBlocks.tsx', 'r') as f:
    c = f.read()

target = '        {renderContent()}\n      </div>'
replacement = '        <ErrorBoundary>{renderContent()}</ErrorBoundary>\n      </div>'
if target in c:
    c = c.replace(target, replacement)
    
    # Need to import ErrorBoundary if not already imported
    if 'ErrorBoundary' not in c[:1000]:
        c = 'import ErrorBoundary from "./ErrorBoundary";\n' + c
        
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(c)
    print("Patched PageBlocks.tsx to use ErrorBoundary per block")
else:
    print("Target not found")
