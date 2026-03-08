import google.generativeai as genai
import os

class FinansalAsistan:
    def __init__(self):
        # .env'den gelen API_KEY'i çevre değişkenlerinden okuruz
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "BURAYA_API_KEY_GELECEK":
            print("\n[HATA] GEMINI_API_KEY bulunamadı! Lütfen .env dosyasına anahtarınızı ekleyin.")
            self.model = None
            return
            
        # Gemini'yi ayarlarız
        genai.configure(api_key=api_key)
        # Gemininin hangi beynini kullanacağımızı (flash modeli hızlı ve ucuzdur) seçeriz
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def tavsiye_al(self, finansal_ozet, kullanici_sorusu):
        """
        analyzer.py'den gelen harcama özetini alır ve kullanıcının özel sorusuna göre yanıtlar.
        """
        if not self.model:
            return "AI Asistan başlatılamadı. API anahtarınızı kontrol edin."

        prompt = f"""
        Sen uzman, profesyonel ama aynı zamanda samimi bir finansal danışmansın.
        Müşterinin bu ayki harcama dökümü şu şekildedir:
        {finansal_ozet}
        
        Müşteri sana dökümle ve kendi mali durumuyla ilgili şu soruyu soruyor:
        "{kullanici_sorusu}"
        
        Lütfen sadece bu soruya odaklanarak, yukarıdaki verilerden yola çıkarak ona Türkçe, 
        cesaretlendirici ve gerektiğinde markdown/madde imleri kullanarak yapıcı bir tavsiye ver.
        """
        
        try:
            cevap = self.model.generate_content(prompt)
            return cevap.text
        except Exception as e:
            return f"Yapay zeka ile iletişim kurulurken bir hata oluştu: {str(e)}"
