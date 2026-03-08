// Netlify Serverless Function: /api/chat
// Bu fonksiyon Netlify sunucusunda çalışır — API anahtarı güvenli saklanır
// Kullanıcının cihazındaki gider listesini ve soruyu alıp Gemini'ye iletir

exports.handler = async (event) => {
    // Sadece POST isteklerini kabul et
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ hata: 'Yalnızca POST' }) };
    }

    try {
        const { soru, giderler = [] } = JSON.parse(event.body);

        // Giderlerden finansal özet metni oluştur
        const finansalOzet = giderlerdenOzetYap(giderler);

        // Google Generative AI SDK
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Sen bir kişisel finans asistanısın. Kullanıcının harcama verileri:

${finansalOzet}

Kullanıcının sorusu: ${soru}

Türkçe, kısa ve öz, samimi bir dille cevap ver. Gerekirse somut rakamlar kullan.
`;

        const result = await model.generateContent(prompt);
        const cevap = result.response.text();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ cevap }),
        };
    } catch (err) {
        console.error('Gemini hatası:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ cevap: '⚠️ AI şu an yanıt veremiyor. Lütfen tekrar dene.' }),
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
