import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

target = r"            \{\(block\.items \|\| \[\]\)\.map\(\(item: any, i: number\) => \("
replacement = r"""            {((block.items && block.items.length > 0) ? block.items : [
              { title: 'Eryaman Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' },
              { title: 'Oran Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
              { title: 'Ümitköy Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK' }
            ]).map((item: any, i: number) => ("""

content = re.sub(target, replacement, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
