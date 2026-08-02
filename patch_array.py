import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

# 1. Define getDefaultItemsForBlock before BlockFormEditor
default_helper = """
const getDefaultItemsForBlock = (type: string) => {
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
};
"""

content = content.replace("export default function BlockFormEditor", default_helper + "\nexport default function BlockFormEditor")

# 2. Update handleArrayChange
old_handle_array = """  const handleArrayChange = (key: string, index: number, itemKey: string, value: any) => {
    let newArray = [...(block[key] || [])];
    
    // If the array is empty and it's the hero block's items, seed it with the defaults first
    if (newArray.length === 0 && block.type === 'hero' && key === 'items') {
      newArray = [
        { title: 'Eryaman Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' },
        { title: 'Oran Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
        { title: 'Ümitköy Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK' }
      ];
    }
    
    newArray[index] = { ...newArray[index], [itemKey]: value };
    handleChange(key, newArray);
  };"""

new_handle_array = """  const handleArrayChange = (key: string, index: number, itemKey: string, value: any) => {
    let newArray = [...(block[key] || [])];
    
    // Seed with default items if empty
    if (newArray.length === 0 && key === 'items') {
      newArray = [...getDefaultItemsForBlock(block.type)];
    }
    
    if (!newArray[index]) {
      newArray[index] = {};
    }
    newArray[index] = { ...newArray[index], [itemKey]: value };
    handleChange(key, newArray);
  };"""

content = content.replace(old_handle_array, new_handle_array)

# 3. Update the inline ternaries in JSX to use getDefaultItemsForBlock
bad_ternary = """{((block.items && block.items.length > 0) ? block.items : [
              { title: 'Eryaman Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-' },
              { title: 'Oran Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr' },
              { title: 'Ümitköy Kampüsü', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK' }
            ]).map((item: any, i: number) => ("""

good_ternary = """{((block.items && block.items.length > 0) ? block.items : getDefaultItemsForBlock(block.type)).map((item: any, i: number) => ("""

content = content.replace(bad_ternary, good_ternary)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)

