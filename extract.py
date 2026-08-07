import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

# Find the start of SubjectRow
start = c.find("  const SubjectRow = ({")
end = c.find("  return (\n    <section")

subject_row = c[start:end]
c = c[:start] + c[end:]

# Now modify subject_row to be a standalone component at the top
subject_row_modified = subject_row.replace("  const SubjectRow = ({", "const SubjectRow = ({")
subject_row_modified = subject_row_modified.replace(
    "  }: {",
    "  subjects,\n  handleInputChange,\n}: {"
)
subject_row_modified = subject_row_modified.replace(
    "    isPrimary?: boolean;\n  }) => {",
    "    isPrimary?: boolean;\n    subjects: any;\n    handleInputChange: (subjectKey: any, field: string, value: string) => void;\n  }) => {"
)
# Add bg-transparent
subject_row_modified = subject_row_modified.replace(
    "className={`w-full border",
    "className={`w-full bg-transparent border"
)

# Insert subject_row_modified before export default function LgsCalculator
export_start = c.find("export default function LgsCalculator")
c = c[:export_start] + subject_row_modified + "\n" + c[export_start:]

# Modify the usages of SubjectRow inside LgsCalculator
c = c.replace(
    '<SubjectRow\n                  subjectKey="turkce"',
    '<SubjectRow\n                  subjects={subjects}\n                  handleInputChange={handleInputChange}\n                  subjectKey="turkce"'
)
c = c.replace(
    '<SubjectRow\n                  subjectKey="tarih"',
    '<SubjectRow\n                  subjects={subjects}\n                  handleInputChange={handleInputChange}\n                  subjectKey="tarih"'
)
c = c.replace(
    '<SubjectRow\n                  subjectKey="din"',
    '<SubjectRow\n                  subjects={subjects}\n                  handleInputChange={handleInputChange}\n                  subjectKey="din"'
)
c = c.replace(
    '<SubjectRow\n                  subjectKey="ingilizce"',
    '<SubjectRow\n                  subjects={subjects}\n                  handleInputChange={handleInputChange}\n                  subjectKey="ingilizce"'
)
c = c.replace(
    '<SubjectRow\n                  subjectKey="matematik"',
    '<SubjectRow\n                  subjects={subjects}\n                  handleInputChange={handleInputChange}\n                  subjectKey="matematik"'
)
c = c.replace(
    '<SubjectRow\n                  subjectKey="fen"',
    '<SubjectRow\n                  subjects={subjects}\n                  handleInputChange={handleInputChange}\n                  subjectKey="fen"'
)

# Let's also check if any SubjectRow usages are in one line
c = c.replace(
    '<SubjectRow subjectKey="turkce"',
    '<SubjectRow subjects={subjects} handleInputChange={handleInputChange} subjectKey="turkce"'
)
# etc. Wait, we can just regex replace:
c = re.sub(
    r'<SubjectRow\s*subjectKey=',
    r'<SubjectRow subjects={subjects} handleInputChange={handleInputChange} subjectKey=',
    c
)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

