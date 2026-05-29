import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await authService.submitNewPassword(token, password);
            alert('Password successfully modified! Please sign in.');
            navigate('/login');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Invalid reset submission.');
        }
    };

    return (
        <div style={{ padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2.5rem', borderRadius: '12px' }}>
                <h2>Configure Password</h2>
                {message && <p style={{ color: '#ff4d4d', fontWeight: '600', marginBottom: '1rem' }}>{message}</p>}
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="password" placeholder="Enter new secret password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Confirm Password Change</button>
                </form>
            </div>
        </div>
    );
};
