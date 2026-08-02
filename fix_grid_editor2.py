with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# We need to find the items definition in news_grid
marker = "], \"Haber / Duyuru Öğeleri\")"
if marker in code:
    code = code.replace(
        marker,
        """,
              {key: 'cardBgColor', label: 'Kart Arka Plan Rengi', type: 'color'},
              {key: 'cardBorderColor', label: 'Kart Kenarlık Rengi', type: 'color'},
              {key: 'cardBorderRadius', label: 'Kart Oval (Örn: 12px)', type: 'text'},
              {key: 'cardPadding', label: 'Kart İç Boşluk (Örn: 24px)', type: 'text'},
              {key: 'itemTitleColor', label: 'Özel Başlık Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Özel Açıklama Rengi', type: 'color'}
            ], "Haber / Duyuru Öğeleri")"""
    )
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code)
    print("Added card level styles")
