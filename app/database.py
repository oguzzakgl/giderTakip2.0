import pymysql

class DatabaseManager:
    def __init__(self, host="db", user="myuser", password="mypassword", database="gider_takip_db"):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
        self.connect()

    def connect(self):
        try:
            self.connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8mb4'
            )
            print("Veritabanı bağlantısı başarılı!")
        except pymysql.MySQLError as err:
            print(f"Hata: {err}")

    def add_expense(self, tarih, kategori, miktar, aciklama):
        if not self.connection:
            print("Bağlantı yok!")
            return
            
        cursor = self.connection.cursor()
        query = "INSERT INTO harcamalar (tarih, kategori, miktar, aciklama) VALUES (%s, %s, %s, %s)"
        values = (tarih, kategori, miktar, aciklama)
        
        try:
            cursor.execute(query, values)
            self.connection.commit()
            print("Gider başarıyla eklendi.")
        except pymysql.MySQLError as err:
            print(f"Veri ekleme hatası: {err}")
        finally:
            cursor.close()

    def get_all_expenses(self):
        if not self.connection:
            print("Bağlantı yok!")
            return []
            
        cursor = self.connection.cursor(pymysql.cursors.DictCursor) # Sözlük (dict) formatında almak için değiştirildi
        query = "SELECT * FROM harcamalar"
        
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        except pymysql.MySQLError as err:
            print(f"Veri çekme hatası: {err}")
            return []
        finally:
            cursor.close()
            
    def close(self):
        if self.connection and self.connection.open:
            self.connection.close()
            print("Veritabanı bağlantısı kapatıldı.")
