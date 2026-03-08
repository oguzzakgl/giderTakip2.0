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

        // Liste içerisindeki kesin isimleri deniyoruz (v1beta için en kararlı olanlar)
        let modelId = 'gemini-1.5-flash';
        let response = await callGemini(modelId, apiKey, prompt);

        // Eğer 404 dönerse listedeki kesin ismi (gemini-flash-latest) dene
        if (response.status === 404) {
            modelId = 'gemini-flash-latest';
            response = await callGemini(modelId, apiKey, prompt);
        }

        // Eğer kota (429) veya hala 404 ise pro sürümüne geç
        if (response.status === 429 || response.status === 404) {
            modelId = 'gemini-pro-latest';
            response = await callGemini(modelId, apiKey, prompt);
        }

        if (!response.ok) {
            const errText = await response.text();
            let errorData;
            try { errorData = JSON.parse(errText); } catch (e) { errorData = errText; }

            const msg = errorData.error?.message || JSON.stringify(errorData);

            const turkceHata = response.status === 429
                ? "Biliyorum çok heyecanlısın ama Gemini'nin ücretsiz kullanım limitine takıldık. 😅 Birkaç dakika bekleyip tekrar sorar mısın?"
                : `Üzgünüm, şu an (404/500) yanıt alamıyorum. (${modelId})`;

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({
                    cevap: `⚠️ **${turkceHata}**\n\n**Teknik Detay:** ${msg}`
                }),
            };
        }

        const data = await response.json();
        const cevap = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!cevap) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ cevap: '⚠️ Gemini sessiz kaldı. Lütfen sorunu farklı şekilde sor.' }),
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
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ cevap: '⚠️ Sunucu hatası oluştu.', detay: err.message }),
        };
    }
};

async function callGemini(modelId, apiKey, prompt) {
    return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        }
    );
}

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
