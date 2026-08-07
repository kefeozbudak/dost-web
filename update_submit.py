import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");',
    'const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");\n  const [message, setMessage] = useState("");'
)

c = c.replace(
    '''    if (!studentInfo.studentName || !studentInfo.phone) {
      alert("Lütfen öğrenci adı ve veli telefon numarasını doldurun.");
      return;
    }''',
    '''    if (!studentInfo.studentName || !studentInfo.phone) {
      setSubmitStatus("error");
      setMessage("Lütfen öğrenci adı ve veli telefon numarasını doldurunuz.");
      setTimeout(() => setSubmitStatus("idle"), 5000);
      return;
    }'''
)

c = c.replace(
    'setSubmitStatus("success");',
    'setSubmitStatus("success");\n      setMessage("Hesaplama sonucunuz başarıyla iletilmiştir. Teşekkür ederiz.");'
)

submit_buttons_html = '''
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 print:hidden">
            {submitStatus !== "idle" && (
              <div className={`text-sm flex items-center px-4 py-2 rounded-lg ${submitStatus === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                <IconPreview data={submitStatus === "success" ? "check_circle" : "error"} className="mr-2 text-lg" />
                {message}
              </div>
            )}
'''

c = c.replace(
    '<div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 print:hidden">',
    submit_buttons_html
)


with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

