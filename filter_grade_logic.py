import re

with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('if (input.type === \'select\') {')
end_idx = content.find('return (', start_idx)

new_logic = """if (input.type === 'select') {
                  let opts = (input.options || "").split(',').map((o: string) => o.trim());
                  
                  // Auto-populate career form positions if available
                  if (type === 'career_application' && input.name === 'position' && block.items && block.items.length > 0) {
                     opts = block.items.map((pos: any) => pos.title || pos.val || "Pozisyon");
                     opts.push("Diğer / Genel Başvuru");
                  }

                  // Bursluluk Sınavı 8. Sınıf Filtresi (Ümitköy ve Oran kampüslerinde 8. sınıf gizlenir)
                  if ((type === 'bursluluk_sinavi' || type === 'scholarship_form') && 
                      (input.name === 'grade' || input.name === 'studentClass' || input.name === 'grade_level')) {
                      const selectedCampus = String(formData.campus || formData.campus_preference || formData.campus_select || "").toLowerCase();
                      if (selectedCampus.includes('ümitköy') || selectedCampus.includes('umitkoy') || selectedCampus.includes('oran')) {
                          opts = opts.filter((opt: string) => !opt.includes('8.'));
                          
                          // Eğer şu anda seçili olan değer '8. Sınıf' ise, değeri sıfırla
                          if (String(formData[input.name]).includes('8.')) {
                              setTimeout(() => handleChange(input.name, ''), 0);
                          }
                      }
                  }

                  """

if start_idx != -1:
    new_content = content[:start_idx] + new_logic + content[end_idx:]
    with open('src/components/PageBlocks.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated PageBlocks successfully")
else:
    print("Could not find select block")
