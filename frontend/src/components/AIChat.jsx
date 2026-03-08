import { useState } from 'react';
import './AIChat.css';

// Netlify'da /api/chat → serverless function'a gider (GEMINI_API_KEY sunucuda güvenli)
// Lokalde apiUrl prop'undan gelir → Docker FastAPI'ye gider
const NETLIFY_CHAT_URL = '/api/chat';


// setCevap(data.cevap);

const HOSGELDIN_MESAJI = `Merhaba! Ben senin **AI Finans Asistanın** 🤖

Harcamalarına bakarak sana kişisel tavsiyeler verebilirim. Örneğin:

• _"Bu ay en çok nereye harcamışım?"_
• _"Fatura giderlerimi nasıl azaltabilirim?"_
• _"Aylık bütçe önerisi verir misin?"_

Sormak istediğin şeyi yaz!`;

export default function AIChat({ apiUrl = 'http://localhost:8000', giderler = [] }) {
    const [mesajlar, setMesajlar] = useState([
        { rol: 'ai', metin: HOSGELDIN_MESAJI, zaman: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);

    const gonder = async (e) => {
        e.preventDefault();
        if (!input.trim() || yukleniyor) return;

        const kullanicimesaj = { rol: 'kullanici', metin: input, zaman: new Date() };
        setMesajlar(prev => [...prev, kullanicimesaj]);
        const soruydu = input;
        setInput('');
        setYukleniyor(true);

        try {
            // Netlify'da: /api/chat → netlify/functions/chat.js (GEMINI_API_KEY sunucuda)
            // Lokalde: apiUrl/api/chat → Docker FastAPI (GEMINI_API_KEY .env'de)
            const chatUrl = window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.')
                ? `${apiUrl}/api/chat`
                : NETLIFY_CHAT_URL;

            const res = await fetch(chatUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soru: soruydu, giderler }),
            });
            const data = await res.json();
            const aiYanit = { rol: 'ai', metin: data.cevap, zaman: new Date() };
            setMesajlar(prev => [...prev, aiYanit]);
        } catch {
            const hataMsg = { rol: 'ai', metin: '⚠️ AI şu an yanıt veremiyor. Lütfen tekrar dene.', zaman: new Date() };
            setMesajlar(prev => [...prev, hataMsg]);
        } finally {
            setYukleniyor(false);
        }
    };


    return (
        <div className="page ai-chat-page">
            <header className="page-header animate-in">
                <div>
                    <h2 className="page-title">AI Asistan</h2>
                    <p className="ai-chat-status">
                        <span className="status-dot" /> Çevrimiçi
                    </p>
                </div>
                <div className="ai-chat-avatar">🤖</div>
            </header>

            <div className="messages-container">
                {mesajlar.map((m, i) => (
                    <div key={i} className={`message message--${m.rol} animate-in`}>
                        {m.rol === 'ai' && <div className="message-avatar">🤖</div>}
                        <div className="message-bubble">
                            <p>{m.metin}</p>
                            <span className="message-time">
                                {m.zaman.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {yukleniyor && (
                    <div className="message message--ai animate-in">
                        <div className="message-avatar">🤖</div>
                        <div className="message-bubble typing-bubble">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
            </div>

            <form className="chat-input-bar" onSubmit={gonder}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Sorunuzu yazın..."
                    className="input-field chat-input"
                    disabled={yukleniyor}
                />
                <button
                    type="submit"
                    className="btn btn-primary chat-send-btn"
                    disabled={!input.trim() || yukleniyor}
                >
                    ➤
                </button>
            </form>
        </div>
    );
}
