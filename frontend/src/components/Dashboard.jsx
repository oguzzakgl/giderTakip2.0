import './Dashboard.css';

// Renkler - kategori başına sabit renk paleti
const KAT_RENK = {
    Benzin: '#e63946', Fatura: '#c1121f', Market: '#780000',
    Eğlence: '#9d0208', Ulaşım: '#a50000', Giyim: '#b5000a', Kira: '#d62828', Diğer: '#3d0000',
};

// Kategorileri topla ve sıralı döndür
function hesaplaKategoriler(giderler) {
    if (!giderler.length) return [];
    const grup = {};
    giderler.forEach(g => {
        grup[g.kategori] = (grup[g.kategori] || 0) + Number(g.miktar);
    });
    const toplam = Object.values(grup).reduce((s, v) => s + v, 0);
    return Object.entries(grup)
        .map(([kategori, miktar]) => ({
            kategori,
            miktar,
            renk: KAT_RENK[kategori] ?? '#6b0000',
            yuzde: Math.round((miktar / toplam) * 100),
        }))
        .sort((a, b) => b.miktar - a.miktar);
}

export default function Dashboard({ giderler = [] }) {
    const kategoriler = hesaplaKategoriler(giderler);
    const toplam = giderler.reduce((s, g) => s + Number(g.miktar), 0);
    const enCok = kategoriler[0];

    return (
        <div className="page dashboard-page">
            {/* ---- Başlık ---- */}
            <header className="dashboard-header animate-in">
                <div>
                    <p className="dashboard-greeting">Merhaba 👋</p>
                    <h1 className="dashboard-title">Gider Takip</h1>
                </div>
                <div className="dashboard-avatar">
                    <span>💸</span>
                </div>
            </header>

            {/* ---- Toplam Harcama Kartı ---- */}
            <div className="total-card animate-in">
                <div className="total-card__label">Toplam Harcama</div>
                <div className="total-card__amount">
                    {toplam.toLocaleString('tr-TR')} <span>TL</span>
                </div>
                <div className="total-card__sub">
                    <span className="badge badge-red">🔴 {giderler.length} İşlem</span>
                    <span className="total-card__sub-text">{kategoriler.length} kategori</span>
                </div>
                <div className="total-card__bg-circle total-card__bg-circle--1" />
                <div className="total-card__bg-circle total-card__bg-circle--2" />
            </div>

            {/* ---- Harcama Dağılımı ---- */}
            <section className="animate-in">
                <h3 className="section-title">Kategori Dağılımı</h3>

                {kategoriler.length === 0 ? (
                    <div className="empty-state">
                        <p>📂 Henüz hiç gider eklenmedi.</p>
                    </div>
                ) : (
                    <div className="bar-chart">
                        {kategoriler.map((item) => (
                            <div key={item.kategori} className="bar-row">
                                <div className="bar-row__header">
                                    <span className="bar-row__name">{item.kategori}</span>
                                    <span className="bar-row__amount">{item.miktar.toLocaleString('tr-TR')} TL</span>
                                </div>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${item.yuzde}%`,
                                            background: `linear-gradient(90deg, ${item.renk}, ${item.renk}aa)`,
                                        }}
                                    />
                                </div>
                                <span className="bar-row__pct">%{item.yuzde}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ---- AI Hızlı Öneri Banner ---- */}
            {enCok && (
                <div className="ai-hint-card animate-in">
                    <div className="ai-hint-card__icon">🤖</div>
                    <div className="ai-hint-card__text">
                        <p className="ai-hint-card__title">AI Asistanın Önerisi</p>
                        <p className="ai-hint-card__sub">
                            Bu dönem en çok <strong>{enCok.kategori}</strong> harcaması var ({enCok.miktar.toLocaleString('tr-TR')} TL · %{enCok.yuzde})
                        </p>
                    </div>
                    <span className="ai-hint-card__arrow">›</span>
                </div>
            )}
        </div>
    );
}
