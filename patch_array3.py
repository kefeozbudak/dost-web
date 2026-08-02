import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

# Fix getDefaultItemsForBlock
old_default = """const getDefaultItemsForBlock = (type: string) => {
  if (type === 'hero') {
    return [
      { title: 'Eryaman Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' },
      { title: 'Oran Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
      { title: 'Ümitköy Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK' }
    ];
  }
  if (type === 'features') {
    return [
      { title: 'Anaokulu', icon: 'child_care', desc: 'Oyun temelli öğrenme ile çocukların hayal dünyasını ve yaratıcılığını destekliyoruz.' },
      { title: 'İlkokul', icon: 'school', desc: 'Akademik temellerin atıldığı, merak ve keşfetme duygusunun beslendiği ilkokul eğitimi.' },
      { title: 'Ortaokul', icon: 'menu_book', desc: 'Geleceğe hazırlayan, eleştirel düşünme ve proje tabanlı öğrenme odaklı ortaokul programı.' }
    ];
  }
  if (type === 'grid') {
    return [
      { title: 'Kampüs 1', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
      { title: 'Kampüs 2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' }
    ];
  }
  if (type === 'cards') {
    return [
      { title: 'Haber 1', desc: 'Açıklama 1' },
      { title: 'Haber 2', desc: 'Açıklama 2' }
    ];
  }
  if (type === 'stats') {
    return [
      { value: '%100', label: 'Başarı' }
    ];
  }
  return [];
};"""

new_default = """const getDefaultItemsForBlock = (type: string) => {
  if (type === 'hero') {
    return [
      { title: 'Eryaman Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' },
      { title: 'Oran Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
      { title: 'Ümitköy Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK' }
    ];
  }
  if (type === 'education_levels') {
    return [
      { title: 'Anaokulu', icon: 'child_care', desc: 'Oyun temelli öğrenme ile çocukların hayal dünyasını ve yaratıcılığını destekliyoruz.' },
      { title: 'İlkokul', icon: 'school', desc: 'Akademik temellerin atıldığı, merak ve keşfetme duygusunun beslendiği ilkokul eğitimi.' },
      { title: 'Ortaokul', icon: 'menu_book', desc: 'Geleceğe hazırlayan, eleştirel düşünme ve proje tabanlı öğrenme odaklı ortaokul programı.' }
    ];
  }
  if (type === 'features') {
    return [
      { title: 'Akademik Mükemmellik', icon: 'verified_user', desc: 'Uluslararası standartlarda müfredat.' },
      { title: 'Çift Dilli Eğitim', icon: 'translate', desc: 'İngilizceyi ana dil yetkinliğinde öğrenen bireyler.' }
    ];
  }
  if (type === 'campuses') {
    return [
      { title: 'Kampüs 1', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
      { title: 'Kampüs 2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' }
    ];
  }
  if (type === 'news') {
    return [
      { title: 'Haber 1', desc: 'Açıklama 1', tag: 'Duyuru', tagColor: 'bg-primary' },
      { title: 'Haber 2', desc: 'Açıklama 2', tag: 'Etkinlik', tagColor: 'bg-secondary' }
    ];
  }
  if (type === 'stats') {
    return [
      { value: '%100', label: 'Başarı' }
    ];
  }
  return [];
};"""

content = content.replace(old_default, new_default)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)

