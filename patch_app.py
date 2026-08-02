import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target_import = r"import AnalyticsCenter from '\./admin/hubs/AnalyticsCenter';"
replacement_import = r"import AnalyticsCenter from './admin/hubs/AnalyticsCenter';\nimport MediaCenter from './admin/hubs/MediaCenter';"
content = re.sub(target_import, replacement_import, content)

target_route = r'<Route path="analytics" element=\{<AnalyticsCenter />\} />'
replacement_route = r'<Route path="analytics" element={<AnalyticsCenter />} />\n          <Route path="media" element={<MediaCenter />} />'
content = re.sub(target_route, replacement_route, content)

with open("src/App.tsx", "w") as f:
    f.write(content)
