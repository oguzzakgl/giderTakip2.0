import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';

const COLORS = ['#e63946', '#800000', '#10b981', '#f59e0b', '#3b82f6', '#ff4d4d', '#06b6d4'];

const ExpenseCharts = ({ giderler }) => {
    if (!giderler || giderler.length === 0) {
        return (
            <div className="page animate-in">
                <h1 className="text-gradient">Analiz</h1>
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p>Henüz harcama verisi yok. Grafiklerin oluşması için biraz harcama ekle!</p>
                </div>
            </div>
        );
    }

    // Kategori Bazlı Hazırlık
    const kategoriDataMap = giderler.reduce((acc, curr) => {
        acc[curr.kategori] = (acc[curr.kategori] || 0) + Number(curr.miktar);
        return acc;
    }, {});

    const kategoriData = Object.keys(kategoriDataMap).map(name => ({
        name,
        value: kategoriDataMap[name]
    })).sort((a, b) => b.value - a.value);

    // Günlük Akış Hazırlık (Son 7 Gün)
    const sonYediGun = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const gunlukData = sonYediGun.map(date => {
        const toplam = giderler
            .filter(g => g.tarih === date)
            .reduce((acc, curr) => acc + Number(curr.miktar), 0);
        return {
            name: date.split('-')[2] + '/' + date.split('-')[1],
            miktar: toplam
        };
    });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="card" style={{ padding: '0.5rem 1rem', background: 'rgba(15, 15, 25, 0.9)', border: '1px solid var(--accent-primary)' }}>
                    <p style={{ color: 'white', fontWeight: '600' }}>{`${payload[0].name}: ${payload[0].value} TL`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="page animate-in">
            <div className="page-header">
                <h1 className="text-gradient">Analiz</h1>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', height: '350px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Kategori Dağılımı</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie
                            data={kategoriData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {kategoriData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', height: '300px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Haftalık Seyir</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={gunlukData}>
                        <defs>
                            <linearGradient id="colorMiktar" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="miktar" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorMiktar)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Hızlı Özet</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <p style={{ fontSize: '0.8rem' }}>En Çok Harcanan</p>
                        <h4 style={{ color: COLORS[0] }}>{kategoriData[0]?.name || '-'}</h4>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.8rem' }}>Toplam Kalem</p>
                        <h4>{giderler.length} Adet</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCharts;
