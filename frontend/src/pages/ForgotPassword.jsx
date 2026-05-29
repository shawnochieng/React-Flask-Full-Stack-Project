import { useState } from 'react';
import { authService } from '../services/authService';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authService.requestResetLink(email);
            setMessage(`${res.message}`);
        } catch {
            setMessage('Transmission pipeline failed.');
        }
    };

    return (
        <div style={{ padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2.5rem', borderRadius: '12px' }}>
                <h2>Reset Access</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: '10px 0 20px 0' }}>Enter your email to receive a recovery link.</p>
                {message && <p style={{ fontWeight: '600', marginBottom: '1rem' }}>{message}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                    <button type="submit" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Send Recovery Email</button>
                </form>
            </div>
        </div>
    );
};
