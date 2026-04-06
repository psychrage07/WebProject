import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import gsap from 'gsap';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    // GSAP Animations
    const ctx = gsap.context(() => {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo('.anim-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
      );
    }, panelRef);

    return () => ctx.revert();
  }, []);

  const evaluateStrength = (pass) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(evaluateStrength(val));
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'transparent';
    if (passwordStrength <= 2) return 'var(--danger)';
    if (passwordStrength <= 4) return 'var(--warning)';
    return 'var(--success)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'user');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div ref={panelRef} className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div className="anim-item" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join <span className="gradient-text" style={{ fontWeight: '600' }}>TaskFlow</span> today</p>
        </div>

        {error && <div className="anim-item" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group anim-item">
            <label className="input-label">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="input-group anim-item">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group anim-item" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required 
            />
            {password.length > 0 && (
              <div style={{ marginTop: '0.8rem' }}>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(passwordStrength / 5) * 100}%`, 
                    background: getStrengthColor(), 
                    transition: 'all 0.3s' 
                  }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: getStrengthColor(), marginTop: '0.4rem', textAlign: 'right' }}>
                  {passwordStrength === 5 ? 'Strong' : passwordStrength >= 3 ? 'Medium' : 'Weak'}
                </p>
              </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary anim-item" style={{ width: '100%' }}>
            <UserPlus size={20} />
            Sign Up
          </button>
        </form>

        <p className="anim-item" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
