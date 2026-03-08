import pandas as pd
import matplotlib.pyplot as plt

class DataAnalyzer:
    def __init__(self):
        pass

    def calculate_category_expenses(self, data):
        if not data:
            print("Analiz edilecek veri yok!")
            return None
            
        # 1. Gelen veriyi DataFrame'e çevir
        df = pd.DataFrame(data)
        
        # 2. 'kategori' sütununa göre grupla, 'miktar' sütununu topla
        grouped_data = df.groupby('kategori')['miktar'].sum().reset_index()
        
        print("\n--- Kategori Bazlı Toplam Harcamalar ---")
        print(grouped_data)
        
        return grouped_data

    def plot_expenses(self, grouped_data):
        if grouped_data is None or grouped_data.empty:
            print("Görselleştirilecek veri yok!")
            return
            
        # Pasta grafiği (Pie Chart) çizdirme
        plt.figure(figsize=(8, 6))
        plt.pie(grouped_data['miktar'], labels=grouped_data['kategori'], autopct='%1.1f%%', startangle=140)
        plt.title('Kategori Bazlı Harcama Dağılımı')
        plt.axis('equal') # Tam yuvarlak olması için
        plt.show()

    def genel_ozet(self, data):
        """
        Gelen ham SQL verisini Pandas ile AI'ın anlayabileceği temiz bir metne dönüştürür.
        """
        if not data:
            return "Kullanıcının henüz hiçbir harcama verisi bulunmamaktadır."
            
        df = pd.DataFrame(data)
        toplam_harcama = df['miktar'].sum()
        islem_sayisi = len(df)
        
        # Kategori bazlı toplam
        grup = df.groupby('kategori')['miktar'].sum()
        kategori_ozeti = ", ".join([f"{k}: {v} TL" for k, v in grup.items()])
        
        # En yüksek işlemi bul. idxmax hata verirse diye try catch ile korunur:
        try:
            en_yuksek_index = df['miktar'].idxmax()
            en_yuksek_islem = df.loc[en_yuksek_index]
            en_yuksek_metin = f"{en_yuksek_islem['kategori']} kalemi için ({en_yuksek_islem['aciklama']}) {en_yuksek_islem['miktar']} TL"
        except:
            en_yuksek_metin = "Bilinmiyor"
            
        ozet_metni = (
            f"Toplam Harcama: {toplam_harcama} TL.\n"
            f"Toplam İşlem Sayısı: {islem_sayisi} adet.\n"
            f"Kategorilere Göre Harcamalar: {kategori_ozeti}.\n"
            f"Tek Seferde Yapılan En Büyük Harcama: {en_yuksek_metin}.\n"
        )
        return ozet_metni
