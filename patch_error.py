import os

with open('src/main.tsx', 'r') as f:
    content = f.read()

if 'window.addEventListener("error"' not in content:
    content = content.replace(
        "import App from './App.tsx'",
        "import App from './App.tsx'\n\nwindow.addEventListener('error', (e) => {\n  document.body.innerHTML += `<div style=\"position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:20px;\">${e.message}</div>`;\n});\nwindow.addEventListener('unhandledrejection', (e) => {\n  document.body.innerHTML += `<div style=\"position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:20px;\">${e.reason}</div>`;\n});"
    )
    with open('src/main.tsx', 'w') as f:
        f.write(content)
