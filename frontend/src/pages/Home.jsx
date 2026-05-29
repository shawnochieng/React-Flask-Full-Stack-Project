import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Home = () => {
  const { token, user } = useContext(AuthContext);

  // Helper logic to customize text based on who is viewing the landing page
  const getButtonText = () => {
    if (!token) return 'Enter Gateway Portal';
    if (user?.role === 'instructor') return 'Access Instructor Desk';
    return 'Go to Student Dashboard';
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '6rem 2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        color: 'var(--text-h)',
        marginBottom: '1.5rem',
        letterSpacing: '-1px'
      }}>
        Unlock Practical Programming Mastery
      </h1>

      <p style={{
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
        color: 'var(--text)',
        marginBottom: '2.5rem',
        fontWeight: '400'
      }}>
        {token
          ? `Welcome back, ${user?.username}! Ready to pick up where you left off?`
          : 'Engage with world-class tracks engineered to construct real runtime architectural systems.'
        }
      </p>

      <Link to={token ? "/dashboard" : "/login"}>
        <button style={{
          background: 'var(--accent)',
          color: 'var(--bg)',
          border: 'none',
          padding: '14px 32px',
          fontSize: '1.1rem',
          borderRadius: '8px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          transition: 'transform 0.2s ease'
        }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {getButtonText()}
        </button>
      </Link>
    </div>
  );
};
