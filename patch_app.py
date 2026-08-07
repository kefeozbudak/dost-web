import re

with open("src/App.tsx", "r") as f:
    c = f.read()

c = re.sub(
    r"import ReportCenter from './admin/hubs/ReportCenter';",
    "import ReportCenter from './admin/hubs/ReportCenter';\nimport LgsCenter from './admin/hubs/LgsCenter';",
    c, count=1
)

c = re.sub(
    r'<Route path="reports" element=\{<ReportCenter />\} />',
    '<Route path="reports" element={<ReportCenter />} />\n          <Route path="lgs-center" element={<LgsCenter />} />',
    c, count=1
)

with open("src/App.tsx", "w") as f:
    f.write(c)

