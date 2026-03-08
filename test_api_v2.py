import urllib.request
import json
import os

def test_gemini_native():
    api_key = ""
    if os.path.exists('.env'):
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    api_key = line.split('=')[1].strip()
                    break
    
    if not api_key:
        print("Hata: GEMINI_API_KEY bulunamadı.")
        return

    print(f"Test ediliyor (Key: {api_key[:5]}...)")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    header = {'Content-Type': 'application/json'}
    data = {
        "contents": [{"parts": [{"text": "Merhaba"}]}]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=header, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            print("BAŞARILI! Gemini yanıt verdi.")
            print(f"Yanıt: {res_data['candidates'][0]['content']['parts'][0]['text'][:50]}...")
    except Exception as e:
        print(f"HATA! İstek başarısız: {e}")
        if hasattr(e, 'read'):
            print(f"Hata Detayı: {e.read().decode('utf-8')}")

if __name__ == "__main__":
    test_gemini_native()
