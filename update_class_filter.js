import fs from 'fs';

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // We need to change:
  // if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('eğitim') || lowerKey.includes('grade')) {
  // To include 'class'
  
  const searchPattern = /if\s*\(\s*lowerKey\.includes\('kademe'\)\s*\|\|\s*lowerKey\.includes\('sınıf'\)\s*\|\|\s*lowerKey\.includes\('eğitim'\)\s*\|\|\s*lowerKey\.includes\('grade'\)\s*\)\s*\{/g;
  
  const replaceStr = "if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('eğitim') || lowerKey.includes('grade') || lowerKey.includes('class')) {";
  
  if (searchPattern.test(content)) {
    content = content.replace(searchPattern, replaceStr);
    fs.writeFileSync(filePath, content);
    console.log("Updated class condition in " + filePath);
  } else {
    console.log("Pattern not found in " + filePath);
  }
}

updateFile('src/admin/hubs/ClubCenter.tsx');
updateFile('src/admin/hubs/ReportCenter.tsx');
