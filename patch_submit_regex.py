import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

pattern = re.compile(
    r'<div className="pt-6 whitespace-normal md:whitespace-pre-line">\s*<button\s*type="submit"\s*disabled={submitting}.*?</button>\s*</div>',
    re.DOTALL
)

def replace_func(match):
    original = match.group(0)
    return """          {type === "quick_contact_form" ? (
            <div className="pt-6 whitespace-normal md:whitespace-pre-line flex flex-row gap-4">
              <button
                type="button"
                onClick={() => setFormData({})}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-1/2 bg-[#004899] hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          ) : (
""" + original + """
          )}"""

new_code = pattern.sub(replace_func, code, count=1)

if code != new_code:
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(new_code)
    print("Patched via regex")
else:
    print("Regex failed")
