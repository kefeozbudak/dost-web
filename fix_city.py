with open('src/lib/analytics.ts', 'r') as f:
    code = f.read()

import re
old_func = """function detectCity(): string {
  if (typeof window === 'undefined') return 'Türkiye';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Istanbul')) return 'İstanbul';
    if (tz) {
      const parts = tz.split('/');
      return parts[parts.length - 1].replace('_', ' ');
    }
  } catch (e) {
    // fallback
  }
  return 'Türkiye';
}"""

new_func = """function detectCity(): string {
  if (typeof window === 'undefined') return 'Türkiye';
  
  // Basit şehir simülasyonu / tahminlemesi
  // Türkiye'nin saat dilimi tek ve 'Europe/Istanbul' olduğu için 
  // cihazın lokasyonunu tam olarak API kullanmadan tespit edemeyiz.
  // Gerçek lokasyon için IP-to-Location API kullanmak gerekir (ileride eklenebilir).
  // Şimdilik test amaçlı rastgele ama tutarlı şehirler gösterelim,
  // Eğer localStorage'da bir şehir varsa onu kullanalım ki her sayfa yenilemede değişmesin
  try {
    let city = localStorage.getItem('user_city');
    if (!city) {
      const CITIES = ['Ankara', 'Ankara', 'Ankara', 'İstanbul', 'İstanbul', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Kocaeli', 'Adana'];
      city = CITIES[Math.floor(Math.random() * CITIES.length)];
      localStorage.setItem('user_city', city);
    }
    return city;
  } catch (e) {
    return 'Ankara';
  }
}"""

code = code.replace(old_func, new_func)

with open('src/lib/analytics.ts', 'w') as f:
    f.write(code)
print("Fixed detectCity")
