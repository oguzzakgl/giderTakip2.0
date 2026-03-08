import { useState } from 'react';
import { Download, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const DataManagement = ({ onDataChange }) => {
    const [status, setStatus] = useState(null);

    const exportData = () => {
        const data = {
            giderler: JSON.parse(localStorage.getItem('giderler') || '[]'),
            butce: JSON.parse(localStorage.getItem('butce') || '0'),
            lastUpdate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gider-takip-yedek-${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus('Veriler başarıyla bilgisayarına indirildi!', 'success');
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.giderler || !Array.isArray(data.giderler)) {
                    throw new Error('Geçersiz dosya formatı!');
                }

                localStorage.setItem('giderler', JSON.stringify(data.giderler));
                if (data.butce) localStorage.setItem('butce', JSON.stringify(data.butce));

                showStatus('Veriler başarıyla geri yüklendi!', 'success');
                if (onDataChange) onDataChange();
            } catch (err) {
                showStatus('Hata: Dosya okunurken bir sorun oluştu.', 'error');
            }
        };
        reader.readAsText(file);
    };

    const clearAll = () => {
        if (window.confirm('Tüm verilerini silmek istediğinden emin misin? Bu işlem geri alınamaz!')) {
            localStorage.clear();
            showStatus('Tüm veriler temizlendi.', 'success');
            if (onDataChange) onDataChange();
        }
    };

    const showStatus = (msg, type) => {
        setStatus({ msg, type });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="page animate-in">
            <div className="page-header">
                <h1 className="text-gradient">Veri Yönetimi</h1>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Yedekle ve Dışa Aktar</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                    Tüm harcamalarını ve bütçeni bir JSON dosyası olarak bilgisayarına veya telefonuna indirebilirsin.
                </p>
                <button className="btn btn-primary btn-full" onClick={exportData}>
                    <Download size={20} /> Verileri İndir (JSON)
                </button>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Verileri Geri Yükle</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                    Daha önce aldığın bir yedek dosyasını buraya yükleyerek verilerini geri getirebilirsin.
                </p>
                <label className="btn btn-ghost btn-full" style={{ cursor: 'pointer' }}>
                    <Upload size={20} /> Dosya Seç ve Yükle
                    <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
                </label>
            </div>

            <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-danger)' }}>Tehlikeli Bölge</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                    Tüm harcamalarını ve ayarlarını kalıcı olarak siler.
                </p>
                <button className="btn btn-ghost btn-full" onClick={clearAll} style={{ color: 'var(--accent-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <Trash2 size={20} /> Tüm Verileri Sıfırla
                </button>
            </div>

            {status && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '1rem 1.5rem',
                    borderRadius: '50px',
                    background: status.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    whiteSpace: 'nowrap'
                }}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {status.msg}
                </div>
            )}
        </div>
    );
};

export default DataManagement;
