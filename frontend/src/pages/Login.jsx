import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert('Authentication error: Check connection or variables.');
    }
  };

  return (
    <div style={{ padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#151824', border: '1px solid #242936', padding: '2.5rem', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '1.5rem' }}>Access Gateway</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '12px', background: '#1c2030', border: '1px solid #242936', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '12px', background: '#1c2030', border: '1px solid #242936', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#4dadff', color: '#0f111a', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
            Sign In
          </button>
        </form>
        <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: '0.85rem', textDecoration: 'none', display: 'block', textAlign: 'right', marginTop: '5px' }}>
          Forgot Password?
        </Link>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#a0a5b5' }}>
          New to the track? <Link to="/register" style={{ color: '#4dadff', textDecoration: 'none' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};
