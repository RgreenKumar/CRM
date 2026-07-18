import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login logic
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to Scale CRM</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary">
            Sign In <LogIn size={18} />
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/verify-email');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join Scale CRM today</p>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          </div>
          <button type="submit" className="btn-primary">
            Continue <ArrowRight size={18} />
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Email</h2>
        <p>We've sent a code to your email address.</p>
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Verification Code</label>
            <input type="text" required className="form-control" value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" />
          </div>
          <button type="submit" className="btn-primary">
            Verify <Mail size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export const CreatePasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if(password === confirmPassword) {
      navigate('/login');
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Secure Account</h2>
        <p>Create a strong password</p>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" required className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary">
            Set Password <Lock size={18} />
          </button>
        </form>
        <div className="auth-link">
          <Link to="/login">Go back to login</Link>
        </div>
      </div>
    </div>
  );
};
