import re

with open("firestore.rules", "r") as f:
    content = f.read()

target = r"    match /users/\{userId\} \{"
replacement = r"""    match /media/{mediaId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /users/{userId} {"""

content = re.sub(target, replacement, content)

with open("firestore.rules", "w") as f:
    f.write(content)
