import re

with open("src/admin/hubs/ReportCenter.tsx", "r") as f:
    content = f.read()

target = r"""    // Expand deletion to include duplicates in local memory \(similar to handleDelete\)
    const expandedIdsToDelete = new Set<string>\(\);
    filteredReports\.forEach\(targetReport => \{"""
    
replacement = r"""    // Expand deletion to include duplicates in local memory (similar to handleDelete)
    const expandedIdsToDelete = new Set<string>();
    const reportsToProcess = isSelectionMode ? filteredReports.filter(r => idsToDelete.includes(r.id)) : filteredReports;
    reportsToProcess.forEach(targetReport => {"""

content = re.sub(target, replacement, content)

with open("src/admin/hubs/ReportCenter.tsx", "w") as f:
    f.write(content)
