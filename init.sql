-- mysql_data_project/init.sql

-- Bu SQL scripti, MySQL konteyneri ilk kez başlatıldığında otomatik çalışır.

-- 1. Veritabanını oluşturuyoruz.
CREATE DATABASE IF NOT EXISTS gider_takip_db;

-- 2. Oluşturduğumuz veritabanını kullanmak için seçiyoruz.
USE gider_takip_db;

-- 3. Giderler tablomuzu oluşturuyoruz.
CREATE TABLE IF NOT EXISTS harcamalar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aciklama VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    miktar DECIMAL(10, 2) NOT NULL,
    tarih DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Örnek başlangıç verileri (isteğe bağlı)
INSERT INTO harcamalar (aciklama, kategori, miktar) VALUES 
('Market Alışverişi', 'Gıda', 450.50),
('Elektrik Faturası', 'Faturalar', 210.00),
('Otobüs Bileti', 'Ulaşım', 50.00);
