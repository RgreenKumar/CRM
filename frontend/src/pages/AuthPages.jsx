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

const SocialButtons = () => (
  <>
    <div className="auth-divider">
      <span>or continue with</span>
    </div>
    <div className="social-btns">
      <button type="button" className="social-btn">Bē</button>
      <button type="button" className="social-btn google">G</button>
      <button type="button" className="social-btn facebook">f</button>
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
