# Proje Kuralları ve Geliştirme Standartları

Sistem artık tüm sayfaları Firestore veritabanından dinamik olarak çekmektedir. 
YENİ BİR SAYFA oluşturulduğunda artık hiçbir dosyada `defaultPages` dizilerini güncellemenize GEREK YOKTUR.
Kullanıcı `PagesCenter` üzerinden sayfa eklediğinde bu zaten otomatik olarak her yerde görünür olacaktır.

Not: Silinen sayfalar Firestore'da `isDeleted: true` olarak işaretlenir (soft-delete).
Sayfaların gizlenip gösterilmesi `isHidden: true/false` ile kontrol edilir.
