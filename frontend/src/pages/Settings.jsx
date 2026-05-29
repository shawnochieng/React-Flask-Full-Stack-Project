import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

export const Settings = () => {
    const { user, login, logout } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await authService.updateProfile({ username, password });
            login(token, res.user);
            setMessage('Account updated successfully!');
            setPassword('');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Modification update failed.');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("WARNING: Are you absolutely sure you want to delete your entire account? This will cancel all course assignments permanently.")) {
            try {
                await authService.deleteAccount();
                logout();
                window.location.href = '/login';
            } catch (err) {
                alert("Account deletion failed. Instructors cannot delete accounts using this gateway.");
            }
        }
    };

    return (
        <div style={{ padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Profile Modification Card */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '2.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Profile Data Settings</h2>
                    {message && <p style={{ marginBottom: '1rem', fontWeight: '600', color: 'var(--text-h)' }}>{message}</p>}

                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', textAlign: 'left' }}>Change Nickname:</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', textAlign: 'left' }}>New Password (Leave blank to keep old):</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" style={{ background: 'var(--accent)', color: 'var(--bg)', width: '100%' }}>
                            Update Profile Data
                        </button>
                    </form>
                </div>

                {/* Delete account (Currently, it Only applies for Student profiles) */}
                {user?.role === 'student' && (
                    <div style={{ background: 'var(--bg)', border: '1px solid #ff4d4d', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ color: '#ff4d4d', marginBottom: '0.5rem', textAlign: 'left' }}>Danger Zone</h3>
                        <p style={{ color: 'var(--text)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                            Permanently purge your account data records and detach yourself from all linked learning courses.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            style={{ background: '#ff4d4d', color: '#fff', width: '100%', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                            Delete My Entire Account
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
