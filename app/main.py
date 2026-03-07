from database import DatabaseManager
from analyzer import DataAnalyzer

from database import DatabaseManager
from analyzer import DataAnalyzer

def main():
    db = DatabaseManager()
    analyzer = DataAnalyzer()
    
    while True:
        print("\n--- Gider Takip Sistemi ---")
        print("1. Yeni Gider Ekle")
        print("2. Tüm Giderleri Listele")
        print("3. Veri Analizi Yap")
        print("4. Çıkış")
        
        secim = input("Seçiminizi yapın: ")
        
        if secim == "1":
            print("\n*UYARI: Tarihi mutlaka aralara TİRE (-) koyarak giriniz (Örn: 2026-03-05)*")
            tarih = input("Tarih (YYYY-AA-GG): ")
            kategori = input("Kategori: ")
            miktar = float(input("Miktar: "))
            aciklama = input("Açıklama: ")
            db.add_expense(tarih, kategori, miktar, aciklama)
        elif secim == "2":
            expenses = db.get_all_expenses()
            print("\n--- Tüm Giderler ---")
            for exp in expenses:
                tarih_str = exp['tarih'].strftime('%Y-%m-%d') if hasattr(exp['tarih'], 'strftime') else exp['tarih']
                print(f"ID: {exp['id']} | Tarih: {tarih_str} | Kategori: {exp['kategori']} | Miktar: {exp['miktar']} TL | Açıklama: {exp['aciklama']}")
        elif secim == "3":
            expenses = db.get_all_expenses()
            grouped = analyzer.calculate_category_expenses(expenses)
            analyzer.plot_expenses(grouped)
        elif secim == "4":
            db.close()
            break
        else:
            print("Geçersiz seçim!")

if __name__ == "__main__":
    main()
