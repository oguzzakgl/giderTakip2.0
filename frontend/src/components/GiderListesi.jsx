import './GiderListesi.css';

// Gerçek veri App.jsx'den props olarak geliyor.
// API bağlandığında App.jsx içinde fetch ile çekilecek:
// fetch('http://localhost:8000/api/giderler') ...

const KAT_EMOJI = {
    Benzin: '⛽', Fatura: '💡', Market: '🛒',
    Eğlence: '🎉', Ulaşım: '🚌', Giyim: '👗', Kira: '🏠',
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function GiderListesi({ giderler = [] }) {
    return (
        <div className="page gider-listesi">
            <header className="page-header animate-in">
                <h2 className="page-title">Tüm Giderler</h2>
                <span className="badge badge-red">{giderler.length} kayıt</span>
            </header>

            {giderler.length === 0 ? (
                <div className="empty-state">
                    <p>📂 Henüz hiç gider eklenmedi.</p>
                </div>
            ) : (
                <div className="gider-list">
                    {giderler.map((g, i) => (
                        <div
                            key={g.id}
                            className="gider-item animate-in"
                            style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                        >
                            <div className="gider-item__emoji">
                                {KAT_EMOJI[g.kategori] ?? '💰'}
                            </div>
                            <div className="gider-item__info">
                                <p className="gider-item__aciklama">{g.aciklama || '(Açıklama yok)'}</p>
                                <div className="gider-item__meta">
                                    <span className="badge badge-dark">{g.kategori}</span>
                                    <span className="gider-item__tarih">{formatDate(g.tarih)}</span>
                                </div>
                            </div>
                            <div className="gider-item__miktar">
                                -{Number(g.miktar).toLocaleString('tr-TR')} TL
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
