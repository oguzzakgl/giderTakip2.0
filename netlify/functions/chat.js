// Netlify Serverless Function: /api/chat
// Gemini REST API — SDK bağımlılığı yok, sadece fetch kullanır

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ hata: 'Yalnızca POST' }) };
    }

    try {
        const { soru, giderler = [] } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY bulunamadı!');
            return {
                statusCode: 500,
                body: JSON.stringify({ cevap: '⚠️ API anahtarı yapılandırılmamış.' }),
            };
        }

        const finansalOzet = giderlerdenOzetYap(giderler);

        const prompt = `Sen bir kişisel finans asistanısın. Kullanıcının harcama verileri:

${finansalOzet}

Kullanıcının sorusu: ${soru}

Türkçe, kısa ve öz, samimi bir dille cevap ver. Gerekirse somut rakamlar kullan.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            let errorData;
            try { errorData = JSON.parse(errText); } catch (e) { errorData = errText; }

            console.error('Gemini API Hatası:', response.status, errorData);
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({
                    cevap: `⚠️ Gemini API Hatası (${response.status})`,
                    detay: errorData
                }),
            };
        }

        const data = await response.json();
        const cevap = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!cevap) {
            console.error('Gemini Boş Yanıt Döndü:', data);
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ cevap: '⚠️ Gemini boş yanıt döndü.', ham_veri: data }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ cevap }),
        };
    } catch (err) {
        console.error('Netlify Fonksiyonu Kritik Hata:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                cevap: '⚠️ Netlify Fonksiyon Hatası',
                hata_mesaji: err.message
            }),
        };
    }
};

function giderlerdenOzetYap(giderler) {
    if (!giderler.length) return 'Kullanıcının henüz hiç harcama kaydı yok.';

    const toplam = giderler.reduce((s, g) => s + Number(g.miktar), 0);
    const gruplar = {};
    giderler.forEach(g => {
        gruplar[g.kategori] = (gruplar[g.kategori] || 0) + Number(g.miktar);
    });
    const kategoriOzeti = Object.entries(gruplar)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}: ${v.toLocaleString('tr-TR')} TL`)
        .join(', ');

    return `Toplam harcama: ${toplam.toLocaleString('tr-TR')} TL | ${giderler.length} işlem\nKategoriler: ${kategoriOzeti}`;
}
