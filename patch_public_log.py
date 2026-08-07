with open('src/pages/PublicView.tsx', 'r') as f:
    c = f.read()

target = '<ErrorBoundary><DynamicBlockRenderer blocks={pageData.blocks || []} /></ErrorBoundary>'
replacement = '''{console.log("Rendering DynamicBlockRenderer with blocks:", pageData.blocks?.length)}
            <ErrorBoundary><DynamicBlockRenderer blocks={pageData.blocks || []} /></ErrorBoundary>'''

if target in c:
    c = c.replace(target, replacement)
    with open('src/pages/PublicView.tsx', 'w') as f:
        f.write(c)
    print("Patched PublicView.tsx")
else:
    print("Target not found")
