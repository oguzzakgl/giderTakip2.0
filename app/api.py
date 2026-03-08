from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys, os

# Mevcut app/ dizinini import pathine ekle
sys.path.insert(0, os.path.dirname(__file__))

from database import DatabaseManager
from analyzer import DataAnalyzer
from chatbot import FinansalAsistan

app = FastAPI(title="GiderTakip API")

# React frontend'in farklı portan istek atabilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prod'da localhost:5173 ile kısıtla
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servis nesneleri (lazy init için her istek öncesi bağlanır)
def get_db():
    return DatabaseManager()

analyzer = DataAnalyzer()
asistan = FinansalAsistan()


# ── Gider Request modeli ────────────────────────────────────────────────────
class GiderEkleRequest(BaseModel):
    tarih: str
    kategori: str
    miktar: float
    aciklama: str = ""


class ChatRequest(BaseModel):
    soru: str
    giderler: list = []  # Frontend'den cihazın kendi giderleri gelir


# ── Endpoint'ler ────────────────────────────────────────────────────────────

@app.get("/api/giderler")
def giderleri_getir():
    """Veritabanındaki tüm harcamaları JSON olarak döner."""
    db = get_db()
    giderler = db.get_all_expenses()
    db.close()
    # tarih objesini stringe çevir (JSON serileştirme için)
    for g in giderler:
        if hasattr(g.get("tarih"), "isoformat"):
            g["tarih"] = g["tarih"].isoformat()
    return giderler


@app.post("/api/gider-ekle")
def gider_ekle(body: GiderEkleRequest):
    """Yeni harcama kaydını veritabanına ekler."""
    db = get_db()
    db.add_expense(body.tarih, body.kategori, body.miktar, body.aciklama)
    db.close()
    return {"durum": "ok", "mesaj": "Gider başarıyla eklendi."}


@app.get("/api/analiz")
def analiz_yap():
    """Kategori bazlı toplam harcamaları döner."""
    db = get_db()
    giderler = db.get_all_expenses()
    db.close()
    # DataFrame özeti metin yerine dict döner
    ozet = analyzer.genel_ozet(giderler)
    return {"ozet": ozet}


@app.post("/api/chat")
def ai_chat(body: ChatRequest):
    """Kullanıcının cihazındaki giderleri + soruyu Gemini'ye gönderir."""
    # Giderler artık MySQL'den değil, kullanıcının cihazından (localStorage) geliyor
    finansal_ozet = analyzer.genel_ozet(body.giderler)
    cevap = asistan.tavsiye_al(finansal_ozet, body.soru)
    return {"cevap": cevap}


@app.get("/")
def root():
    return {"mesaj": "GiderTakip API çalışıyor 🚀"}
