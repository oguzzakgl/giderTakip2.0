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

        // 1. Deneme: gemini-1.5-flash
        let modelId = 'gemini-1.5-flash';
        let response = await callGemini(modelId, apiKey, prompt);

        // 2. Deneme: Eğer 404 ise flash-latest dene
        if (response.status === 404) {
            console.warn('gemini-1.5-flash bulunamadı, flash-latest deneniyor...');
            modelId = 'gemini-1.5-flash-latest';
            response = await callGemini(modelId, apiKey, prompt);
        }

        // 3. Deneme: Eğer hala 404 ise gemini-1.5-pro dene
        if (response.status === 404) {
            modelId = 'gemini-1.5-pro';
            response = await callGemini(modelId, apiKey, prompt);
        }

        if (!response.ok) {
            const errText = await response.text();
            let errorData;
            try { errorData = JSON.parse(errText); } catch (e) { errorData = errText; }

            // TEŞHİS: Bu anahtarın hangi modellere erişimi var?
            let availableModels = 'Bilinmiyor';
            try {
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const listData = await listRes.json();
                availableModels = listData.models?.map(m => m.name.replace('models/', '')).join(', ') || 'Hiç model bulunamadı';
            } catch (e) {
                availableModels = 'Hata: ' + e.message;
            }

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({
                    cevap: `❌ **API Hatası (${response.status})**\n\n**Hata Mesajı:** ${errorData.error?.message || 'Model bulunamadı'}\n\n**Erişebildiğin Modeller:** ${availableModels}\n\n**Öneri:** Eğer liste boşsa API Key hatalıdır. Liste doluysa listeden bir modeli seçmemiz gerekir.`
                }),
            };
        }

        const data = await response.json();
        const cevap = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!cevap) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ cevap: '⚠️ Gemini boş yanıt döndü. Lütfen farklı bir soru sor.' }),
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
            body: JSON.stringify({ cevap: '⚠️ Netlify tarafında sistemsel bir hata oluştu.', detay: err.message }),
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
