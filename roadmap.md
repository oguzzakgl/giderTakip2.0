# Proje Yol Haritası (Roadmap)

Bu proje, MySQL + Python (Pandas) + Docker Compose yeteneklerini pekiştirmek için tasarlanmış bir "Veri Analizi" projesidir. Adımları sırasıyla takip ederek projeni tamamlayabilirsin.

## Aşama 1: Docker ve Veritabanı Hazırlığı (Temeller)
*   **Amaç:** Verilerin güvenli tutulacağı ortamı izole etmek.
*   **Adımlar:**
    1.  [x] `init.sql` dosyasını açıp tablo yaratma komutlarını (SQL) yaz.
    2.  [x] `docker-compose.yml` dosyasındaki `db` servisi (MySQL) için gerekli ayarları yap (Portlar, şifre).
    3.  [x] Terminalde `docker-compose up -d db` diyerek sadece veritabanını test et. Başarılıysa durdur (`docker-compose down`).

## Aşama 2: Python Dosyalarının Geliştirilmesi (Kodlama)
*   **Amaç:** Ana mantığı ve veritabanı işlemlerini kurgulamak.
*   **Adımlar:**
    1.  [x] `requirements.txt` dosyasını doldur (`mysql-connector-python`, `pandas`).
    2.  [x] `app/database.py` içine girerek veritabanına bağlanma (`connect`) ve veri ekleme/çekme komutlarını yaz.
    3.  [x] `app/analyzer.py` içerisine Pandas kullanarak çekilen kayıtların istatistiksel analizini yapacak fonksiyonları yaz.
    4.  [x] `app/main.py` dosyasını açarak `database` ve `analyzer` sınıflarını burada bir menü yardımıyla çağır.

## Aşama 3: Konteynerizasyon ve Son Test
*   **Amaç:** Projeyi her bilgisayarda aynı şekilde çalışır bir Docker uygulaması haline getirmek.
*   **Adımlar:**
    1.  [x] `Dockerfile` içerisine Python uygulamasının kurulum aşamalarını (FROM, COPY, RUN) yaz.
    2.  [x] `docker-compose.yml` dosyasındaki `app` servisini (Python kodunun) aktif et ve `db` ye bağlı (depends_on) numarası çek.
    3.  [x] Terminalde ana klasörde (`mysql_data_project/`) `docker-compose up --build` komutunu çalıştırarak her şeyin tam çalıştığını gör.

*- Not: Takıldığın her adımda `app/` içindeki dosyaların yorum satırlarına ve eski projelerindeki `Klavuz` belgelerine bakabilirsin!*
