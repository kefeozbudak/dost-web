import re

with open("firestore.rules", "r") as f:
    c = f.read()

rules = """
    match /reports/{reportId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
"""

c = re.sub(
    r'match /forms/\{formId\} \{',
    rules + '\n    match /forms/{formId} {',
    c, count=1
)

with open("firestore.rules", "w") as f:
    f.write(c)

