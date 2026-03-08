import { useState, useRef, useEffect } from 'react';
import './AIChat.css';
import { Bot, Send, User, Sparkles } from 'lucide-react';

const NETLIFY_CHAT_URL = '/api/chat';

const HOSGELDIN_MESAJI = `Merhaba! Ben senin **AI Finans Asistanın** 🤖

Harcamalarına bakarak sana kişisel tavsiyeler verebilirim. Например:

• _"Bu ay en çok nereye harcamışım?"_
• _"Fatura giderlerimi nasıl azaltabilirim?"_
• _"Harcama alışkanlıklarım nasıl?"_

Sormak istediğin şeyi yaz!`;

export default function AIChat({ apiUrl = 'http://localhost:8000', giderler = [] }) {
    const [mesajlar, setMesajlar] = useState([
        { rol: 'ai', metin: HOSGELDIN_MESAJI, zaman: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mesajlar, yukleniyor]);

    const gonder = async (e) => {
        e.preventDefault();
        if (!input.trim() || yukleniyor) return;

        const kullanicimesaj = { rol: 'kullanici', metin: input, zaman: new Date() };
        setMesajlar(prev => [...prev, kullanicimesaj]);
        const soruydu = input;
        setInput('');
        setYukleniyor(true);

        try {
            const chatUrl = window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.')
                ? `${apiUrl}/api/chat`
                : '/.netlify/functions/chat';

            const res = await fetch(chatUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soru: soruydu, giderler }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.cevap || `Sunucu Hatası: ${res.status}`);
            }

            const data = await res.json();
            const aiYanit = { rol: 'ai', metin: data.cevap, zaman: new Date() };
            setMesajlar(prev => [...prev, aiYanit]);
        } catch (error) {
            console.error('Chatbot Hatası:', error);
            const hataMsg = {
                rol: 'ai',
                metin: `⚠️ Hata: ${error.message}`,
                zaman: new Date()
            };
            setMesajlar(prev => [...prev, hataMsg]);
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <div className="page animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 'calc(var(--nav-height) + 1.5rem)' }}>
            <header className="page-header" style={{ marginBottom: '1rem' }}>
                <div>
                    <h1 className="text-gradient">AI Asistan</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--accent-success)', borderRadius: '50%', display: 'inline-block' }} />
                        Gemini 2.0 Aktif
                    </p>
                </div>
                <div className="card" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <Bot size={24} color="var(--accent-primary)" />
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem' }}>
                {mesajlar.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.rol === 'ai' ? 'flex-start' : 'flex-end',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: m.rol === 'ai' ? 'flex-start' : 'flex-end'
                    }}>
                        <div className="card" style={{
                            padding: '0.8rem 1.2rem',
                            background: m.rol === 'ai' ? 'var(--bg-card)' : 'var(--gradient-premium)',
                            border: m.rol === 'ai' ? '1px solid var(--glass-border)' : 'none',
                            color: m.rol === 'ai' ? 'var(--text-primary)' : 'white',
                            borderRadius: m.rol === 'ai' ? '4px 20px 20px 20px' : '20px 20px 4px 20px'
                        }}>
                            <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                {m.metin.split('**').map((part, index) =>
                                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                                )}
                            </div>
                            <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.4rem', textAlign: 'right' }}>
                                {m.zaman.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {yukleniyor && (
                    <div className="card" style={{ alignSelf: 'flex-start', padding: '1rem', borderRadius: '4px 20px 20px 20px' }}>
                        <Sparkles size={16} className="animate-pulse" color="var(--accent-primary)" />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={gonder} style={{
                marginTop: '1rem',
                display: 'flex',
                gap: '0.5rem',
                background: 'var(--bg-card)',
                padding: '0.5rem',
                borderRadius: '50px',
                border: '1px solid var(--glass-border)'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Asistana bir şey sor..."
                    style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        outline: 'none'
                    }}
                    disabled={yukleniyor}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0 }}
                    disabled={!input.trim() || yukleniyor}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
