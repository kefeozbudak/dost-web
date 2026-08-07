with open("src/admin/hubs/PagesCenter.tsx", "r") as f:
    c = f.read()

bad = """        'is-basvurusu': {
          title: 'İş Başvurusu',
          path: '/is-basvurusu',
          blocks: defaultCareerPageData,
        defaultTuitionFeesData
        },"""

good = """        'is-basvurusu': {
          title: 'İş Başvurusu',
          path: '/is-basvurusu',
          blocks: defaultCareerPageData
        },"""

c = c.replace(bad, good)
with open("src/admin/hubs/PagesCenter.tsx", "w") as f:
    f.write(c)
