import re

with open("src/admin/hubs/LgsCenter.tsx", "r") as f:
    lgs_content = f.read()

with open("src/admin/hubs/ReportCenter.tsx", "r") as f:
    report_content = f.read()

# I will just write a new LgsCenter.tsx based on the structure of ReportCenter.tsx
# and the fields of LGS reports.
# But it's easier to just use LgsCenter.tsx and replace the table with the expandable list.
