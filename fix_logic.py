import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

old_logic = """      let newCorrect = field === "correct" ? value : subject.correct;
      let newWrong = field === "wrong" ? value : subject.wrong;

      let c = parseInt(newCorrect as string) || 0;
      let w = parseInt(newWrong as string) || 0;

      if (c + w > subject.total) {
        if (field === "correct") {
          w = subject.total - c;
          newWrong = w.toString();
        } else {
          c = subject.total - w;
          newCorrect = c.toString();
        }
      }"""
      
new_logic = """      let newCorrect = field === "correct" ? value : subject.correct;
      let newWrong = field === "wrong" ? value : subject.wrong;

      let c = parseInt(newCorrect as string) || 0;
      let w = parseInt(newWrong as string) || 0;

      if (c > subject.total) {
        c = subject.total;
        newCorrect = c.toString();
      }
      if (w > subject.total) {
        w = subject.total;
        newWrong = w.toString();
      }
      
      if (c + w > subject.total) {
        if (field === "correct") {
          w = subject.total - c;
          newWrong = w.toString();
        } else {
          c = subject.total - w;
          newCorrect = c.toString();
        }
      }"""

c = c.replace(old_logic, new_logic)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

