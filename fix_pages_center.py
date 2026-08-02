import sys

with open('src/admin/hubs/PagesCenter.tsx', 'r') as f:
    code = f.read()

# Add Eye and EyeOff icons if not present
if "Eye," not in code and "EyeOff," not in code:
    code = code.replace("Trash2,", "Trash2, Eye, EyeOff,")

# Update handleDelete to soft delete
old_delete = """  const handleDelete = async (id: string) => {
    if (confirm('Bu sayfayı silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'pages', id));
        fetchPages();
      } catch (err) {
        alert('Silinemedi.');
      }
    }
  };"""

new_delete = """  const handleDelete = async (id: string) => {
    if (confirm('Bu sayfayı silmek istediğinize emin misiniz?')) {
      try {
        await setDoc(doc(db, 'pages', id), { isDeleted: true }, { merge: true });
        fetchPages();
      } catch (err) {
        alert('Silinemedi.');
      }
    }
  };

  const handleToggleVisibility = async (id: string, isHidden: boolean) => {
    try {
      await setDoc(doc(db, 'pages', id), { isHidden: !isHidden }, { merge: true });
      fetchPages();
    } catch (err) {
      alert('Durum güncellenemedi.');
    }
  };"""

code = code.replace(old_delete, new_delete)

# Update fetchPages to filter out isDeleted
old_fetch_pages = """      defaultPages.forEach(dp => {
        if (!fetchedPages.find(p => p.id === dp.id)) {
          if (dp.id === 'home') fetchedPages.unshift(dp);
          else fetchedPages.push(dp);
        }
      });
      setPages(fetchedPages);"""

new_fetch_pages = """      defaultPages.forEach(dp => {
        if (!fetchedPages.find(p => p.id === dp.id)) {
          if (dp.id === 'home') fetchedPages.unshift(dp);
          else fetchedPages.push(dp);
        }
      });
      setPages(fetchedPages.filter(p => !p.isDeleted));"""

code = code.replace(old_fetch_pages, new_fetch_pages)

# Update status rendering
old_status = """                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                          <CheckCircle className="w-3 h-3" />
                          Yayında
                        </span>
                      </td>"""

new_status = """                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${page.isHidden ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'}`}>
                          {page.isHidden ? <EyeOff className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {page.isHidden ? 'Gizli' : 'Yayında'}
                        </span>
                      </td>"""

code = code.replace(old_status, new_status)

# Update buttons rendering
old_buttons = """                        <Link 
                          to={`/admin/editor/${page.id}`}
                          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {page.id !== 'home' && (
                          <button 
                            onClick={() => handleDelete(page.id)}"""

new_buttons = """                        <button
                          onClick={() => handleToggleVisibility(page.id, !!page.isHidden)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${page.isHidden ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                          title={page.isHidden ? 'Yayına Al' : 'Gizle'}
                        >
                          {page.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <Link 
                          to={`/admin/editor/${page.id}`}
                          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {page.id !== 'home' && (
                          <button 
                            onClick={() => handleDelete(page.id)}"""

code = code.replace(old_buttons, new_buttons)

with open('src/admin/hubs/PagesCenter.tsx', 'w') as f:
    f.write(code)

print("Updated PagesCenter.tsx")
