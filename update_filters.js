import fs from 'fs';

const isKademeMatchFunc = `
  const checkKademeMatch = (senderKademe: string, filterValue: string) => {
    if (!filterValue) return true;
    const k = senderKademe.toLowerCase();
    const f = filterValue.toLowerCase();

    if (f === 'anaokulu') {
      return k.includes('okul öncesi') || k.includes('anaokul') || k.includes('yaş');
    }
    if (f === 'ilkokul') {
      return k.includes('1. sınıf') || k.includes('2. sınıf') || k.includes('3. sınıf') || k.includes('4. sınıf') || k.includes('ilkokul');
    }
    if (f === 'ortaokul') {
      return k.includes('5. sınıf') || k.includes('6. sınıf') || k.includes('7. sınıf') || k.includes('8. sınıf') || k.includes('ortaokul');
    }
    if (f === 'lise') {
      return k.includes('9. sınıf') || k.includes('10. sınıf') || k.includes('11. sınıf') || k.includes('12. sınıf') || k.includes('hazırlık') || k.includes('lise');
    }
    
    return k.includes(f);
  };
`;

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the filter logic
  const searchPattern = `    if (filterKademe && !sender.kademe.toLowerCase().includes(filterKademe.toLowerCase())) {
      return false;
    }`;
    
  if (content.includes(searchPattern)) {
    content = content.replace(searchPattern, `    if (filterKademe && !checkKademeMatch(sender.kademe, filterKademe)) {
      return false;
    }`);
    
    // Inject the helper function right before the filter block
    content = content.replace('  // Filter forms based on tab & search term', isKademeMatchFunc + '\n  // Filter forms based on tab & search term');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  } else {
    // If exact pattern failed, let's try a regex
    console.log('Exact pattern not found in ' + file + ', trying regex');
    
    const regexPattern = /if\s*\(filterKademe\s*&&\s*!sender\.kademe\.toLowerCase\(\)\.includes\(filterKademe\.toLowerCase\(\)\)\)\s*{\s*return\s*false;\s*}/g;
    
    if (regexPattern.test(content)) {
       content = content.replace(regexPattern, `if (filterKademe && !checkKademeMatch(sender.kademe, filterKademe)) {
      return false;
    }`);
       content = content.replace('  // Filter forms based on tab & search term', isKademeMatchFunc + '\n  // Filter forms based on tab & search term');
       fs.writeFileSync(file, content);
       console.log('Updated ' + file);
    } else {
      // ClubCenter doesn't have the "tab" comment... let's find filteredReports
      console.log('Regex also failed, trying generic hook');
    }
  }
}

processFile('src/admin/hubs/ClubCenter.tsx');
processFile('src/admin/hubs/ReportCenter.tsx');
