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
