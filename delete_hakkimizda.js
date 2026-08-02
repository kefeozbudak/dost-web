const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(search, replacement);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
}

// 1. PagesCenter.tsx
replaceInFile('src/admin/hubs/PagesCenter.tsx', 
  /,\s*\{\s*id:\s*'hakkimizda',\s*title:\s*'Hakkımızda',\s*path:\s*'\/hakkimizda'\s*\}/g, 
  ''
);

// 2. AppearanceCenter.tsx
replaceInFile('src/admin/hubs/AppearanceCenter.tsx', 
  /,\s*\{\s*id:\s*'hakkimizda',\s*title:\s*'Hakkımızda',\s*path:\s*'\/hakkimizda'\s*\}/g, 
  ''
);

// 3. AdminDashboard.tsx
replaceInFile('src/admin/AdminDashboard.tsx', 
  /,\s*\{\s*id:\s*'hakkimizda',\s*title:\s*'Hakkımızda',\s*path:\s*'\/hakkimizda',\s*updatedAt:\s*Date\.now\(\)\s*\}/g, 
  ''
);

// 4. AdminLayout.tsx
replaceInFile('src/admin/AdminLayout.tsx', 
  /,\s*\{\s*id:\s*'hakkimizda',\s*title:\s*'Hakkımızda',\s*path:\s*'\/hakkimizda'\s*\}/g, 
  ''
);

// 5. PageEditor.tsx (array)
replaceInFile('src/admin/PageEditor.tsx', 
  /,\s*\{\s*id:\s*'hakkimizda',\s*title:\s*'Hakkımızda',\s*path:\s*'\/hakkimizda'\s*\}/g, 
  ''
);

// 6. PageEditor.tsx (fetchData logic)
replaceInFile('src/admin/PageEditor.tsx', 
  /\} else if \(pageId === 'hakkimizda'\) \{\s*import\('\.\.\/lib\/defaultData'\)\.then\(\(\{ defaultHakkimizdaData \}\) => \{\s*const defaultData = \{ title: 'Hakkımızda', path: '\/hakkimizda', blocks: defaultHakkimizdaData \};\s*setPageData\(defaultData\);\s*\}\);\s*/g,
  ''
);

// 7. PublicView.tsx (onSnapshot logic)
replaceInFile('src/pages/PublicView.tsx',
  /\} else if \(location\.pathname === '\/hakkimizda'\) \{\s*import\('\.\.\/lib\/defaultData'\)\.then\(\(\{ defaultHakkimizdaData \}\) => \{\s*setPageData\(\{\s*title: 'Hakkımızda',\s*blocks: defaultHakkimizdaData\s*\}\);\s*\}\);\s*/g,
  ''
);

// 8. defaultData.ts (header link)
replaceInFile('src/lib/defaultData.ts',
  /\s*\{\s*label:\s*'Kurumsal',\s*url:\s*'\/hakkimizda'\s*\},\n/g,
  '\n'
);

// 9. defaultData.ts (defaultHakkimizdaData)
let defaultDataContent = fs.readFileSync('src/lib/defaultData.ts', 'utf8');
const hakkimizdaStart = defaultDataContent.indexOf('export const defaultHakkimizdaData');
if (hakkimizdaStart !== -1) {
    defaultDataContent = defaultDataContent.substring(0, hakkimizdaStart);
    fs.writeFileSync('src/lib/defaultData.ts', defaultDataContent);
    console.log(`Removed defaultHakkimizdaData from src/lib/defaultData.ts`);
}

