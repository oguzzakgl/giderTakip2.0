import os
import requests
import json

def test_gemini_key():
    # .env dosyasından anahtarı oku (manuel)
    api_key = ""
    try:
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    api_key = line.split('=')[1].strip()
                    break
    except Exception as e:
        print(f"Hata: .env okunamadı - {e}")
        return

    if not api_key:
        print("Hata: GEMINI_API_KEY bulunamadı.")
        return

    print(f"Test ediliyor (Key başlangıcı: {api_key[:5]}...)")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    payload = {
        "contents": [{"parts": [{"text": "Merhaba, nasılsın?"}]}]
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        print(f"Durum Kodu: {response.status_code}")
        if response.status_code == 200:
            print("BAŞARILI! Gemini yanıt verdi.")
            print(f"Yanıt: {response.json()['candidates'][0]['content']['parts'][0]['text'][:50]}...")
        else:
            print(f"HATA! Yanıt içeriği: {response.text}")
    except Exception as e:
        print(f"İstek Hatası: {e}")

if __name__ == "__main__":
    test_gemini_key()
