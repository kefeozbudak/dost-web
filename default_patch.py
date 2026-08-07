import re

with open("src/lib/defaultData.ts", "r") as f:
    c = f.read()

new_export = """
export const defaultLgsCalculatorData = [
  {
    type: "lgs_calculator",
    title: "LGS Puan Hesaplama Modülü",
    subtitle: "2026 güncel katsayılarına göre tahmini LGS puanınızı ve yüzdelik diliminizi hesaplayın.",
    styles: {
      backgroundColor: "#faf8ff"
    }
  }
];
"""

c += new_export

with open("src/lib/defaultData.ts", "w") as f:
    f.write(c)
