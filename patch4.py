import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

c = re.sub(
    r'Tahmini LGS Puanı\s*</p>',
    '{block.estimatedScoreLabel || "Tahmini LGS Puanı"}\n                </p>',
    c, count=1
)
c = re.sub(
    r'Max: 500 Puan\s*</p>',
    '{block.maxScoreLabel || "Max: 500 Puan"}\n                </p>',
    c, count=1
)
c = re.sub(
    r'Toplam Net\s*</p>',
    '{block.totalNetLabel || "Toplam Net"}\n                  </p>',
    c, count=1
)
c = re.sub(
    r'Tahmini Yüzdelik\s*</p>',
    '{block.estimatedPercentileLabel || "Tahmini Yüzdelik"}\n                  </p>',
    c, count=1
)
c = re.sub(
    r'2023 Verilerine Göre\s*</p>',
    '{block.dataYearLabel || "2023 Verilerine Göre"}\n                  </p>',
    c, count=1
)
c = re.sub(
    r'Oturum Bazlı Net Dağılımı\s*</p>',
    '{block.netDistributionLabel || "Oturum Bazlı Net Dağılımı"}\n                </p>',
    c, count=1
)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

