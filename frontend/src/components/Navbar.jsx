import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
    const { token, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper utility to highlight the active menu selection
    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        color: isActive(path) ? 'var(--accent)' : 'var(--text)',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '0.95rem',
        transition: 'color 0.2s ease',
        borderBottom: isActive(path) ? '2px solid var(--accent)' : '2px solid transparent',
        paddingBottom: '4px'
    });

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 2rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: 'var(--shadow)'
        }}>
            {/* Platform Branding Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '1.35rem',
                    letterSpacing: '-0.5px'
                }}>
                    SkillForge
                </Link>
            </div>

            {/* Functional Navigation Elements Wrapper Container */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={linkStyle('/')}>Home</Link>

                {token ? (
                    <>
                        <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
                        <Link to="/settings" style={linkStyle('/settings')}>Settings</Link>

                        {/* Identity Badge Badge Element Container */}
                        <div style={{
                            fontSize: '0.85rem',
                            background: 'var(--accent-bg)',
                            color: 'var(--accent)',
                            padding: '6px 14px',
                            borderRadius: '50px',
                            border: '1px solid var(--accent-border)',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{ opacity: 0.7 }}>{user?.role}:</span>
                            <strong style={{ color: 'var(--text-h)' }}>{user?.username}</strong>
                        </div>

                        {/* Structured Termination CTA Button */}
                        <button
                            onClick={handleLogout}
                            style={{
                                background: '#ff4d4d',
                                color: '#fff',
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                borderRadius: '6px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                boxShadow: '0 2px 4px rgba(255, 77, 77, 0.2)'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#e04343'}
                            onMouseLeave={(e) => e.target.style.background = '#ff4d4d'}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/login">
                            <button style={{
                                background: 'transparent',
                                color: 'var(--accent)',
                                border: '1px solid var(--accent)',
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                borderRadius: '6px'
                            }}>
                                Sign In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button style={{
                                background: 'var(--accent)',
                                color: 'var(--bg)',
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                borderRadius: '6px'
                            }}>
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
