import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const AuthLeftPane = () => (
  <div className="auth-left">
    <div className="auth-left-content">
      <div className="auth-logo">*</div>
    </div>
    <div className="auth-left-content auth-left-text">
      <div className="subtext">You can easily</div>
      <h2>Get access your personal<br/>hub for clarity and<br/>productivity</h2>
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" fill="#1877F2"/>
    <path d="M13.898 24v-9.294h3.12l.467-3.622h-3.587v-2.313c0-1.048.291-1.763 1.795-1.763l1.918-.001v-3.24c-.332-.044-1.47-.143-2.795-.143-2.766 0-4.659 1.688-4.659 4.788v2.671h-3.128v3.622h3.128v9.294h3.741z" fill="#fff"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f35325" d="M1 1h9v9H1z"/>
    <path fill="#81bc06" d="M11 1h9v9h-9z"/>
    <path fill="#05a6f0" d="M1 11h9v9H1z"/>
    <path fill="#ffba08" d="M11 11h9v9h-9z"/>
  </svg>
);

const SocialButtons = () => (
  <>
    <div className="auth-divider">
      <span>or continue with</span>
    </div>
    <div className="social-btns">
      <button type="button" className="social-btn">
        <GoogleIcon /> Continue with Google
      </button>
      <button type="button" className="social-btn">
        <FacebookIcon /> Continue with Facebook
      </button>
      <button type="button" className="social-btn">
        <MicrosoftIcon /> Continue with Microsoft
      </button>
    </div>
  </>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card">
        <AuthLeftPane />
        <div className="auth-right">
          <div className="auth-logo">*</div>
          <h2>Welcome back</h2>
          <p className="desc">Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.</p>
          
          <form onSubmit={handleLogin}>
            <div className="auth-form-group">
              <label>Your email</label>
              <div className="auth-input-wrapper">
                <input type="email" required className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
              </div>
            </div>
            <div className="auth-form-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <input type={showPassword ? "text" : "password"} required className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <button type="submit" className="auth-btn">
              Get Started
            </button>
          </form>
          
          <SocialButtons />
          
          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/verify-email');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card">
        <AuthLeftPane />
        <div className="auth-right">
          <div className="auth-logo">*</div>
          <h2>Create an account</h2>
          <p className="desc">Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.</p>
          
          <form onSubmit={handleSignup}>
            <div className="auth-form-group">
              <label>Your email</label>
              <div className="auth-input-wrapper">
                <input type="email" required className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
              </div>
            </div>
            <div className="auth-form-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <input type={showPassword ? "text" : "password"} required className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <button type="submit" className="auth-btn">
              Get Started
            </button>
          </form>
          
          <SocialButtons />
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/create-password');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card" style={{ maxWidth: '500px' }}>
        <div className="auth-right" style={{ padding: '4rem' }}>
          <div className="auth-logo" style={{ textAlign: 'center', display: 'block' }}>*</div>
          <h2 style={{ textAlign: 'center' }}>Verify Email</h2>
          <p className="desc" style={{ textAlign: 'center' }}>We've sent a code to your email address.</p>
          
          <form onSubmit={handleVerify}>
            <div className="auth-form-group">
              <label>Verification Code</label>
              <div className="auth-input-wrapper">
                <input type="text" required className="auth-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="000 000" style={{ textAlign: 'center', letterSpacing: '0.2em' }} />
              </div>
            </div>
            <button type="submit" className="auth-btn">
              Verify Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const CreatePasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if(password === confirmPassword) {
      navigate('/login');
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card" style={{ maxWidth: '500px' }}>
        <div className="auth-right" style={{ padding: '4rem' }}>
          <div className="auth-logo" style={{ textAlign: 'center', display: 'block' }}>*</div>
          <h2 style={{ textAlign: 'center' }}>Secure Account</h2>
          <p className="desc" style={{ textAlign: 'center' }}>Create a strong password for your new account.</p>
          
          <form onSubmit={handleCreate}>
            <div className="auth-form-group">
              <label>New Password</label>
              <div className="auth-input-wrapper">
                <input type={showPassword ? "text" : "password"} required className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <div className="auth-form-group">
              <label>Confirm Password</label>
              <div className="auth-input-wrapper">
                <input type={showPassword ? "text" : "password"} required className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="auth-btn">
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
