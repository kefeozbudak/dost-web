import sys

with open('src/lib/defaultData.ts', 'r') as f:
    code = f.read()

video_data = """  {
    type: 'video',
    title: 'Eğitimde Geleceğe Bakış: <span class="text-primary">Dost Koleji</span> Tanıtım Filmi',
    subtitle: 'Akademik başarılarımızdan kampüs yaşamına kadar bizi biz yapan değerleri keşfedin. Nitelikli eğitim anlayışımızla tanışın.',
    desc: '<p>Alanında uzman kadromuz, modern eğitim teknolojilerimiz ve öğrenci merkezli yaklaşımımız ile çocuklarımızı sadece akademik başarıya değil, hayata hazırlıyoruz.</p><p>Dost Koleji, sadece bir okul değil, büyük bir ailedir.</p>',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqVmB8KLK4pRZRjP6vzqspGrWKyGSWYLz1ZNziR8J2Cz9lFZaWWD9UvShTlolYOXhJ2R1rBz6huoou3DgLSBfCUzFC3gB2MC_iMkd-L2KISyTkkEWMjTIKgb4oKXQbH0SpLom65dcVrNg7LSIRWVzhN6rHs6Q39Z4xCQBtwA11NqXbsjwQ_OVoVrclw_fqC_FY9NyrYuV7PqgshTtyBayH1tDFf7oY266_arpniDAGNBxTpWIYDK4yZV42K_1ThOBlMSbhIj5kSGA'
  },
"""

marker = "  {\n    type: 'stats',\n    title: 'Başarı Bir Gelenektir',"

if marker in code:
    code = code.replace(marker, video_data + marker)
    with open('src/lib/defaultData.ts', 'w') as f:
        f.write(code)
    print("Added video to default data")
else:
    print("Marker not found in defaultData.ts")

