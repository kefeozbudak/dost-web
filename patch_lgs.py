import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

# Add imports
c = re.sub(
    r'import \{ IconPreview \} from "./IconField";',
    'import { IconPreview } from "./IconField";\nimport { collection, addDoc, serverTimestamp } from "firebase/firestore";\nimport { db } from "../lib/firebase";',
    c, count=1
)

# Add state
c = re.sub(
    r'const \[subjects, setSubjects\] = useState\(\{',
    'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");\n\n  const [subjects, setSubjects] = useState({',
    c, count=1
)

# Add handleSubmit
c = re.sub(
    r'const handleReset = \(\) => \{',
    '''const handleSubmit = async () => {
    if (!studentInfo.studentName || !studentInfo.phone) {
      alert("Lütfen öğrenci adı ve veli telefon numarasını doldurun.");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      await addDoc(collection(db, "reports"), {
        type: "lgs_calculator",
        studentName: studentInfo.studentName,
        parentName: studentInfo.parentName,
        phone: studentInfo.phone,
        school: studentInfo.school,
        results: results,
        subjects: subjects,
        createdAt: Date.now(),
        read: false
      });
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Error submitting LGS data:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {''',
    c, count=1
)

# Update submit button
c = re.sub(
    r'<button className="px-6 py-2\.5 rounded-lg bg-primary text-white font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2">\s*<IconPreview data="send" className="text-\[20px\]" />\{" "\}\s*\{block\.submitButtonLabel \|\| "Gönder"\}\s*</button>',
    '''<button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <IconPreview data={isSubmitting ? "hourglass_empty" : submitStatus === "success" ? "check_circle" : "send"} className="text-[20px]" />{" "}
              {submitStatus === "success" ? "Gönderildi!" : (block.submitButtonLabel || "Gönder")}
            </button>''',
    c, count=1
)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

