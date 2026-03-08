import { useState } from 'react';
import './GiderEkle.css';

// Form verisi gönderildiğinde App.jsx'e onEkle() callback ile bildirilir.
// API bağlandığında burayı fetch POST'a dönüştüreceğiz:
// fetch('http://localhost:8000/api/gider-ekle', { method: 'POST', body: JSON.stringify(form) })


const KATEGORİLER = ['Benzin', 'Fatura', 'Market', 'Eğlence', 'Ulaşım', 'Giyim', 'Kira', 'Diğer'];

export default function GiderEkle({ onEkle }) {
    const [form, setForm] = useState({ tarih: '', kategori: '', miktar: '', aciklama: '' });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Yeni gideri App.jsx'e bildir (state güncelleme orada yapılır)
        if (onEkle) {
            onEkle({ ...form, miktar: parseFloat(form.miktar) });
        }
        setSuccess(true);
        setForm({ tarih: '', kategori: '', miktar: '', aciklama: '' });
        setTimeout(() => setSuccess(false), 2000);
    };


    return (
        <div className="page gider-ekle">
            <header className="page-header animate-in">
                <h2 className="page-title">Yeni Gider Ekle</h2>
                <span className="badge badge-red">➕</span>
            </header>

            {success && (
                <div className="success-banner animate-in">
                    ✅ Gider başarıyla eklendi!
                </div>
            )}

            <form className="gider-form card animate-in" onSubmit={handleSubmit}>

                <div className="input-group">
                    <label className="input-label">Tarih</label>
                    <input
                        type="date"
                        name="tarih"
                        value={form.tarih}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Kategori</label>
                    <select
                        name="kategori"
                        value={form.kategori}
                        onChange={handleChange}
                        className="input-field input-select"
                        required
                    >
                        <option value="">Seçiniz...</option>
                        {KATEGORİLER.map(k => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label">Miktar (TL)</label>
                    <input
                        type="number"
                        name="miktar"
                        value={form.miktar}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="input-field"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Açıklama</label>
                    <input
                        type="text"
                        name="aciklama"
                        value={form.aciklama}
                        onChange={handleChange}
                        placeholder="Kısa bir açıklama..."
                        className="input-field"
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                    💾 Gideri Kaydet
                </button>

            </form>
        </div>
    );
}
