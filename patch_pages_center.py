with open("src/admin/hubs/PagesCenter.tsx", "r") as f:
    c = f.read()

c = c.replace('defaultCareerPageData', 'defaultCareerPageData,\n        defaultTuitionFeesData')

new_map = """
        'kayit-fiyatlari': {
          title: 'Kayıt Fiyatları',
          path: '/kayit-fiyatlari',
          blocks: defaultTuitionFeesData
        },
        'kulup-kayit-formu': {
"""

c = c.replace("'kulup-kayit-formu': {", new_map)

with open("src/admin/hubs/PagesCenter.tsx", "w") as f:
    f.write(c)
