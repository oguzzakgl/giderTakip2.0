# Docker ve Staj Hazırlık - Kullanım Kılavuzu

Bu belge, staj hazırlık sürecinde Docker kullanımı ve diğer teknik gereksinimler konusunda size rehberlik etmek için oluşturulmuştur.

## İçerik ve Klasör Yapısı
Bu klasör içerisinde staj başvurusu yaparken portfolyonuzu güçlendirmek için gerekli bilgiler ve görev listeleri yer almaktadır.

*   `tasklst.md`: Staj sürecinde tamamlanması gereken, teknik ve beceri bazlı görevlerin yer aldığı liste dosyasıdır.
*   `Kullanim_Klavuzu.md`: Okumakta olduğunuz bu belgedir; hedef ve genel işleyişi özetler.

## Docker Temelleri (Özet)
Staj projelerinde sıkça karşınıza çıkacak olan Docker komutlarının temel kullanımı aşağıdadır:
1. `docker build -t proje_adi .` : Klasördeki Dockerfile kullanılarak yeni bir imaj oluşturulur.
2. `docker run -d -p 8080:80 proje_adi` : Oluşturulan imajdan yeni bir konteyner ayağa kaldırılır.
3. `docker ps` : Çalışan tüm konteynerleri listeler.
4. `docker stop <container_id>` : Çalışan bir konteyneri durdurur.

Detaylı görevler için `tasklst.md` dosyasına göz atabilirsiniz.
