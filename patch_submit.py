import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """          <div className="pt-6 whitespace-normal md:whitespace-pre-line">
            <button
              type="submit"
              disabled={submitting}
              className={
                isStyledForm
                  ? "w-full bg-primary hover:bg-[#002147] text-white font-label-md text-label-md py-4 rounded-lg shadow-sm transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                  : "w-full py-4 bg-primary text-white font-bold text-label-md rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              }
            >
              {submitting
                ? isStyledForm
                  ? "Gönderiliyor..."
                  : "İşleniyor..."
                : isStyledForm
                  ? "Başvuruyu Tamamla"
                  : "Kaydı Tamamla"}
              {!submitting && (
                <span
                  className="material-symbols-outlined whitespace-normal md:whitespace-pre-line"
                  translate="no"
                  aria-hidden="true"
                >
                  send
                </span>
              )}
            </button>
          </div>"""

new_target = """          {type === "quick_contact_form" ? (
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
            <div className="pt-6 whitespace-normal md:whitespace-pre-line">
              <button
                type="submit"
                disabled={submitting}
                className={
                  isStyledForm
                    ? "w-full bg-primary hover:bg-[#002147] text-white font-label-md text-label-md py-4 rounded-lg shadow-sm transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                    : "w-full py-4 bg-primary text-white font-bold text-label-md rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                }
              >
                {submitting
                  ? isStyledForm
                    ? "Gönderiliyor..."
                    : "İşleniyor..."
                  : isStyledForm
                    ? "Başvuruyu Tamamla"
                    : "Kaydı Tamamla"}
                {!submitting && (
                  <span
                    className="material-symbols-outlined whitespace-normal md:whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    send
                  </span>
                )}
              </button>
            </div>
          )}"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched submit buttons")
else:
    print("Submit button target not found")
