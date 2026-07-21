import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const FigmaLogoSVG = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stand legs */}
    <path d="M16 34L14 42" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 34L34 42" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 34V38" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
    
    {/* Board background with gradient */}
    <rect x="8" y="10" width="32" height="24" rx="2" fill="url(#board-gradient)" />
    
    {/* Chart line */}
    <path d="M14 26L20 20L25 24L32 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Arrow head */}
    <path d="M29 16H33V20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    <defs>
      <linearGradient id="board-gradient" x1="8" y1="10" x2="40" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States for errors as requested in flowchart
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [bannerError, setBannerError] = useState(''); // Network/Server error banner

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setBannerError('');
    
    // [ Form Validation (Client-Side) ]
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    if (!isValid) return; // Show inline errors

    try {
      // [ Submit API Request (POST /login) ]
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      // [ Server Authenticates & Returns Response ]
      if (response.ok) {
        // [ Store Session Token (JWT / Cookie) ]
        localStorage.setItem('token', data.token);
        
        // [ Fetch User Profile / Permissions ]
        try {
          const profileRes = await fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            localStorage.setItem('user', JSON.stringify(profileData));
          }
        } catch (e) {
          console.error("Failed to fetch profile/permissions", e);
        }

        // [ Navigate / Redirect to Dashboard ]
        navigate('/dashboard');
      } else {
        // [ Authentication Failed ]
        setBannerError('Invalid credentials');
      }
    } catch (err) {
      // [ Network/Server Error ]
      setBannerError('Network error. Please try again later.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-centered-card">
        <div className="auth-header">
          <FigmaLogoSVG />
          <h1>Sales CRM</h1>
          <h2 className="welcome-text">Welcome Back!</h2>
          <p className="subtitle">Enter your credentials to access your account</p>
        </div>
        
        {bannerError && <div className="auth-error">{bannerError}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-form-group">
            <label>Email</label>
            <input 
              type="email" 
              className={`auth-input ${emailError ? 'auth-input-error' : ''}`}
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} 
              placeholder="admin@salescrm.com" 
            />
            {emailError && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{emailError}</span>}
          </div>
          
          <div className="auth-form-group">
            <label>Password</label>
            <input 
              type="password" 
              className={`auth-input ${passwordError ? 'auth-input-error' : ''}`}
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }} 
              placeholder="••••••••" 
            />
            {passwordError && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{passwordError}</span>}
          </div>
          
          <div className="auth-form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/verify-email" className="forgot-password">Forgot password?</Link>
          </div>
          
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an Account ? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-centered-card" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#111827' }}
          aria-label="Go back"
        >
          &#8592;
        </button>
        
        <div className="auth-header">
          <FigmaLogoSVG />
          <h1>Sales CRM</h1>
          <h2 className="welcome-text">Welcome Back!</h2>
          <p className="subtitle">Enter your credentials to access your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="auth-form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              className="auth-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@salescrm.com" 
            />
          </div>
          
          <div className="auth-form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              className="auth-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <div className="auth-form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              required 
              className="auth-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="auth-btn">
            Sign in
          </button>
        </form>
        
        <div className="auth-footer" style={{ marginTop: '24px' }}>
          Already have an Account ? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('resetEmail', email);
        navigate('/otp', { state: { email } });
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-centered-card" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#111827' }}
          aria-label="Go back"
        >
          &#8592;
        </button>

        <div className="auth-header">
          <FigmaLogoSVG />
          <h1>Sales CRM</h1>
          <h2 className="welcome-text">Welcome Back!</h2>
          <p className="subtitle">Enter your credentials to access your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleVerify} className="auth-form">
          <div className="auth-form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              className="auth-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@salescrm.com" 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem('resetEmail');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError("Please enter a 4-digit OTP");
      return;
    }
    
    // Hardcoded bypass for testing
    if (enteredOtp === '0000') {
      const fallbackEmail = email || 'admin@salescrm.com';
      sessionStorage.setItem('resetOtp', '0000');
      sessionStorage.setItem('resetEmail', fallbackEmail);
      navigate('/create-password', { state: { email: fallbackEmail, otp: '0000' } });
      return;
    }

    if (!email) {
      setError("Session expired. Please start over.");
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp })
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('resetOtp', enteredOtp);
        navigate('/create-password', { state: { email, otp: enteredOtp } });
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-centered-card" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#111827' }}
          aria-label="Go back"
        >
          &#8592;
        </button>

        <div className="auth-header">
          <FigmaLogoSVG />
          <h1>Sales CRM</h1>
          <h2 className="welcome-text">Welcome !</h2>
          <p className="subtitle">Enter your OTP to access your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleVerify} className="auth-form">
          <div className="auth-form-group">
            <label>Enter OTP</label>
            <div className="otp-inputs">
              {otp.map((data, index) => (
                <input
                  className="otp-input"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const CreatePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem('resetEmail');
  const otp = location.state?.otp || sessionStorage.getItem('resetOtp');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !otp) {
      setError('Session expired. Please restart the forgot password process.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-centered-card" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#111827' }}
          aria-label="Go back"
        >
          &#8592;
        </button>
        <div className="auth-header">
          <FigmaLogoSVG />
          <h1>Sales CRM</h1>
          <h2 className="welcome-text">Welcome Back!</h2>
          <p className="subtitle">Enter your Password again for Verifying your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleCreate} className="auth-form">
          <div className="auth-form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              className="auth-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className="auth-form-group">
            <label>Retype your Password</label>
            <input 
              type="password" 
              required 
              className="auth-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Go to Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
