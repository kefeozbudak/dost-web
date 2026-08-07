import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");\n  const [message, setMessage] = useState("");',
    'const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");\n  const [message, setMessage] = useState("");'
)

if 'const [message, setMessage] = useState("");' not in c:
    c = c.replace(
        'const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");',
        'const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");\n  const [message, setMessage] = useState("");'
    )
    
if 'const [message, setMessage] = useState("");' not in c:
    c = c.replace(
        'const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");',
        'const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");\n  const [message, setMessage] = useState("");'
    )

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

