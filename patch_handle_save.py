import re

with open("src/admin/PageEditor.tsx", "r") as f:
    content = f.read()

old_code = """    } catch (e) {
      alert('Kaydedilirken hata oluştu.');
    } finally {"""

new_code = """    } catch (e: any) {
      console.error("Save error:", e);
      alert('Kaydedilirken hata oluştu: ' + (e.message || 'Bilinmeyen hata'));
    } finally {"""

content = content.replace(old_code, new_code)

with open("src/admin/PageEditor.tsx", "w") as f:
    f.write(content)
