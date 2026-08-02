import sys

with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "{ type: 'hero', label: 'Ana Başlık' },",
    "{ type: 'hero', label: 'Ana Başlık' },\n                          { type: 'video', label: 'Video Alanı' },"
)
with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(code)

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code2 = f.read()

marker = "{['features', 'stats', 'education_levels', 'campuses', 'news'].includes(block.type) && ("
new_block = """        {block.type === 'video' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Açıklama (Metin)', 'desc')}
            {renderImageUpload('Video URL (MP4 veya YouTube vb. Destekleniyorsa, yoksa link)', 'videoUrl')}
            <p className="text-xs text-slate-500 italic mt-1">Not: Medya kütüphanesinden video yükleyebilir veya doğrudan link yapıştırabilirsiniz.</p>
            {renderImageUpload('Video Kapak Görseli', 'thumbnailUrl')}
          </div>
        )}
        """

if marker in code2:
    code2 = code2.replace(marker, new_block + marker)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code2)
    print("Updated BlockFormEditor")
else:
    print("Marker not found in BlockFormEditor")

