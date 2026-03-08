import { useState, useEffect } from 'react';
import './Dashboard.css';
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';

const KAT_RENK = {
    Benzin: '#8b5cf6', Fatura: '#ec4899', Market: '#10b981',
    Eğlence: '#f59e0b', Ulaşım: '#3b82f6', Giyim: '#6366f1', Kira: '#ef4444', Diğer: '#64748b',
};

function hesaplaKategoriler(giderler) {
    if (!giderler.length) return [];
    const grup = {};
    giderler.forEach(g => { grup[g.kategori] = (grup[g.kategori] || 0) + Number(g.miktar); });
    const toplam = Object.values(grup).reduce((s, v) => s + v, 0);
    return Object.entries(grup).map(([kategori, miktar]) => ({
        kategori, miktar, renk: KAT_RENK[kategori] ?? '#94a3b8', yuzde: Math.round((miktar / toplam) * 100),
    })).sort((a, b) => b.miktar - a.miktar);
}

export default function Dashboard({ giderler = [], onDataChange }) {
    const [butce, setButce] = useState(() => Number(localStorage.getItem('butce') || '5000'));
    const [yeniButce, setYeniButce] = useState('');
    const kategoriler = hesaplaKategoriler(giderler);
    const toplamGider = giderler.reduce((s, g) => s + Number(g.miktar), 0);
    const kalanButce = butce - toplamGider;
    const enCok = kategoriler[0];

    useEffect(() => {
        localStorage.setItem('butce', butce.toString());
    }, [butce]);

    const handleButceGuncelle = () => {
        if (!yeniButce || isNaN(yeniButce)) return;
        setButce(Number(yeniButce));
        setYeniButce('');
    };

    return (
        <div className="page animate-in">
            <div className="page-header">
                <h1 className="text-gradient">Hoş Geldin!</h1>
            </div>

            {/* Premium Bakiye Kartı */}
            <div className="card" style={{ background: 'var(--gradient-premium)', border: 'none', marginBottom: '1.5rem', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>Toplam Bakiyen</p>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.4rem 0' }}>{kalanButce.toLocaleString()} <span style={{ fontSize: '1.2rem' }}>TL</span></h1>
                    </div>
                    <Wallet size={32} style={{ opacity: 0.5 }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.8, fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                            <ArrowUpCircle size={14} /> BÜTÇE
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{butce.toLocaleString()} TL</p>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', opacity: 0.8, fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                            GİDER <ArrowDownCircle size={14} />
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{toplamGider.toLocaleString()} TL</p>
                    </div>
                </div>
            </div>

            {/* Bütçe Düzenleme */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="number"
                        className="input-field"
                        style={{ flex: 1, padding: '0.6rem 1rem' }}
                        value={yeniButce}
                        onChange={(e) => setYeniButce(e.target.value)}
                        placeholder="Aylık bütçeni belirle..."
                    />
                    <button className="btn btn-primary" style={{ padding: '0 1.25rem' }} onClick={handleButceGuncelle}>
                        Güncelle
                    </button>
                </div>
            </div>

            {/* Kategori Dağılımı */}
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} className="text-gradient" /> Kategori Dağılımı
            </h3>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                {kategoriler.length === 0 ? (
                    <p style={{ textAlign: 'center', py: '1rem', opacity: 0.6 }}>Henüz harcama yok.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {kategoriler.map((item) => (
                            <div key={item.kategori}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                    <span style={{ fontWeight: '600' }}>{item.kategori}</span>
                                    <span style={{ opacity: 0.8 }}>%{item.yuzde} • {item.miktar} TL</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${item.yuzde}%`, background: item.renk, borderRadius: '10px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Hint */}
            {enCok && (
                <div className="card" style={{ border: '1px solid rgba(139, 92, 246, 0.2)', background: 'rgba(139, 92, 246, 0.05)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>🤖</div>
                        <div>
                            <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>AI İpucu</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                Bu ay en çok <strong>{enCok.kategori}</strong> ({enCok.miktar} TL) harcaması yaptın.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
