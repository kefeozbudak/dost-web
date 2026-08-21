with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """          )}
          
          {type === "quick_contact_form" ? (
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
          ) : (<div className="pt-6 whitespace-normal md:whitespace-pre-line">"""

new_target = """          )}
          <div className="pt-6 whitespace-normal md:whitespace-pre-line">"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Fixed!")
else:
    print("Could not find exact match")

