import re

with open('src/admin/hubs/ScholarshipCenter.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add downloadCSV function
insert_func_idx = content.find('  return (\n    <div className="flex-1 overflow-y-auto')

download_func = """  const downloadCSV = () => {
    const campusName = selectedCampusTab === 'all' ? 'Tum-Kampusler' : selectedCampusTab;
    const gradeName = selectedGradeFilter === 'all' ? 'Tum-Kademeler' : `${selectedGradeFilter}-Sinif`;
    const fileName = `Bursluluk-Basvurulari_${campusName}_${gradeName}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    
    const headers = [
      "Öğrenci Adı Soyadı",
      "TC Kimlik",
      "Sınıf Seviyesi",
      "Kampüs Tercihi",
      "Veli Adı Soyadı",
      "Telefon",
      "E-Posta",
      "Başvuru Tarihi"
    ];
    
    const rows = filteredReports.map(report => {
      const sender = extractSenderInfo(report.data);
      const studentName = report.data?.student_fullname || report.data?.studentName || '';
      const tc = report.data?.student_tc || report.data?.studentTc || '';
      const grade = sender.kademe || report.data?.grade || report.data?.studentGrade || '';
      const campus = sender.kampus || report.data?.campus || report.data?.campus_preference || '';
      const parentName = report.data?.parent_fullname || report.data?.parentName || '';
      const phone = sender.phone || '';
      const email = sender.email || '';
      const date = format(report.createdAt, 'dd.MM.yyyy HH:mm');
      
      return [
        `"${studentName}"`,
        `"${tc}"`,
        `"${grade}"`,
        `"${campus}"`,
        `"${parentName}"`,
        `"${phone}"`,
        `"${email}"`,
        `"${date}"`
      ].join(',');
    });
    
    const csvContent = "\uFEFF" + headers.join(',') + '\\n' + rows.join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

"""

if insert_func_idx != -1:
    content = content[:insert_func_idx] + download_func + content[insert_func_idx:]
else:
    print("Could not find function insertion point")

# Add Download button next to search box
# Look for <Search className="..." /> and the </div> wrapper
search_container_end = content.find('            </div>\n          </div>\n\n          {/* Sub Bar: Sınıf Kademeleri Filter Chips */}')

button_code = """
            <button onClick={downloadCSV} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap">
              <Download className="w-4 h-4" />
              CSV İndir
            </button>"""

# We can insert it inside the flex container, maybe next to the search box div
# Let's see the structure again:
"""
            {/* Search Box */}
            <div className="relative w-full md:w-72">
              ...
            </div>
            <button ...>CSV İndir</button>
          </div>
"""

insert_button_idx = content.find('            </div>\n          </div>\n\n          {/* Sub Bar: Sınıf Kademeleri Filter Chips */}')
if insert_button_idx != -1:
    content = content[:insert_button_idx] + '            </div>' + button_code + '\n          </div>\n\n          {/* Sub Bar: Sınıf Kademeleri Filter Chips */}' + content[insert_button_idx + len('            </div>\n          </div>\n\n          {/* Sub Bar: Sınıf Kademeleri Filter Chips */}'):]
else:
    print("Could not find button insertion point")

with open('src/admin/hubs/ScholarshipCenter.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ScholarshipCenter")

