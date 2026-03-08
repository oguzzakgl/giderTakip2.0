import { useState } from 'react';
import './GiderEkle.css';
import { Calendar, Tag, CreditCard, AlignLeft, Save, Plus } from 'lucide-react';

const KATEGORİLER = ['Benzin', 'Fatura', 'Market', 'Eğlence', 'Ulaşım', 'Giyim', 'Kira', 'Diğer'];

export default function GiderEkle({ onGiderEkle }) {
    const [form, setForm] = useState({ tarih: new Date().toISOString().split('T')[0], kategori: '', miktar: '', aciklama: '' });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const yeniKayit = {
            ...form,
            id: Date.now(),
            miktar: parseFloat(form.miktar)
        };

        if (onGiderEkle) onGiderEkle(yeniKayit);

        setSuccess(true);
        setForm({ tarih: new Date().toISOString().split('T')[0], kategori: '', miktar: '', aciklama: '' });
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
        <div className="page animate-in">
            <header className="page-header">
                <h1 className="text-gradient">Harcama Ekle</h1>
                <div className="card" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <Plus size={24} color="var(--accent-primary)" />
                </div>
            </header>

            {success && (
                <div className="card" style={{ background: 'var(--accent-success)', color: 'white', marginBottom: '1rem', textAlign: 'center', padding: '1rem' }}>
                    ✅ Harcama başarıyla kaydedildi!
                </div>
            )}

            <form className="card animate-in" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                <div className="input-group">
                    <label className="input-label"><Calendar size={14} /> Tarih</label>
                    <input type="date" name="tarih" value={form.tarih} onChange={handleChange} className="input-field" required />
                </div>

                <div className="input-group">
                    <label className="input-label"><Tag size={14} /> Kategori</label>
                    <select name="kategori" value={form.kategori} onChange={handleChange} className="input-field" required>
                        <option value="">Kategori Seç...</option>
                        {KATEGORİLER.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label"><CreditCard size={14} /> Miktar (TL)</label>
                    <input type="number" name="miktar" value={form.miktar} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="input-field" required />
                </div>

                <div className="input-group">
                    <label className="input-label"><AlignLeft size={14} /> Açıklama</label>
                    <input type="text" name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Nereye harcadın?" className="input-field" />
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
                    <Save size={20} /> Kaydet
                </button>
            </form>
        </div>
    );
}
