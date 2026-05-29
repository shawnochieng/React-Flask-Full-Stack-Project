import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { username, email, password, role });
            alert('Registration complete.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Execution stopped.');
        }
    };

    return (
        <div style={{ padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', background: '#151824', border: '1px solid #242936', padding: '2.5rem', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '1.5rem' }}>Create Account</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
                        style={{ width: '100%', padding: '12px', background: '#1c2030', border: '1px solid #242936', borderRadius: '6px', color: '#fff', outline: 'none' }} />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                        style={{ width: '100%', padding: '12px', background: '#1c2030', border: '1px solid #242936', borderRadius: '6px', color: '#fff', outline: 'none' }} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                        style={{ width: '100%', padding: '12px', background: '#1c2030', border: '1px solid #242936', borderRadius: '6px', color: '#fff', outline: 'none' }} />

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#1c2030', padding: '12px', borderRadius: '6px', border: '1px solid #242936' }}>
                        <span style={{ fontSize: '0.9rem', color: '#a0a5b5' }}>Role:</span>
                        <label style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} /> Student
                        </label>
                        <label style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="radio" name="role" value="instructor" checked={role === 'instructor'} onChange={() => setRole('instructor')} /> Instructor
                        </label>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#0f111a', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
                        Sign Up
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#a0a5b5' }}>
                    Registered? <Link to="/login" style={{ color: '#4dadff', textDecoration: 'none' }}>Sign in here</Link>
                </p>
            </div>
        </div>
    );
};
