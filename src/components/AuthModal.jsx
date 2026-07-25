import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { X, UserCheck, Shield, Store, MapPin, Mail, Lock, Sparkles, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup, pendingOtp, verifyOtpCode, cancelOtpSession } = useStore();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('Yangon');

  // 6-digit OTP Pin state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(), useRef(), useRef(), useRef(), useRef(), useRef()
  ];

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      if (res.requiresOtp) {
        setSuccessMsg(res.message || 'Security code required.');
      } else {
        onClose();
      }
    } else {
      setError(res.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (role === 'seller' && (!storeName.trim() || !city.trim())) {
      setError('Sellers must provide a Store Name and City.');
      return;
    }

    const res = await signup({ name, email, password, role, storeName, city });
    if (res.success) {
      if (res.requiresOtp) {
        setSuccessMsg('Account created! Please enter the verification code sent to your email.');
      } else {
        onClose();
      }
    } else {
      setError(res.message);
    }
  };

  const quickLogin = async (userEmail, userPassword) => {
    setError('');
    setSuccessMsg('');
    const res = await login(userEmail, userPassword);
    if (res.success && !res.requiresOtp) {
      onClose();
    }
  };

  const handleDigitChange = (index, value) => {
    const cleanValue = value.trim();

    if (cleanValue.length > 1) {
      // Handle paste of 6-digit code
      const pasted = cleanValue.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(5, pasted.length - 1);
      inputRefs[nextFocus].current?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue;
    setOtpDigits(newDigits);

    if (cleanValue && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fullCode = otpDigits.join('').trim();
    if (fullCode.length < 6) {
      setError('Please enter your verification code.');
      return;
    }

    const res = await verifyOtpCode(fullCode);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Invalid code. Please check your email inbox.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 className="modal-title">
              {pendingOtp
                ? pendingOtp.type === 'signup'
                  ? 'Verify Email Address'
                  : 'Security Code Verification'
                : isSignup
                ? 'Create Account'
                : 'Sign In'}
            </h3>
          </div>
          <button
            onClick={() => {
              cancelOtpSession();
              onClose();
            }}
            className="btn btn-secondary btn-icon"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 8-DIGIT OTP VERIFICATION SCREEN */}
        {pendingOtp ? (
          <form onSubmit={handleVerifyOtpSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}
              >
                <KeyRound size={26} />
              </div>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 800 }}>
                Enter Verification Code
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                A verification security code has been sent to <strong>{pendingOtp.email}</strong>.
              </p>
              
              <div style={{
                margin: '12px auto 0',
                padding: '8px 14px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: '#38bdf8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>✉️ Sent by <strong>noreply@showemyanmar.shop</strong> (Local SMTP)</span>
              </div>
            </div>

            {pendingOtp.demoCode && (
              <div style={{
                marginBottom: '16px',
                padding: '10px 14px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Code: <strong style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem' }}>{pendingOtp.demoCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const digits = pendingOtp.demoCode.split('');
                    setOtpDigits(digits);
                    inputRefs[Math.min(5, digits.length - 1)].current?.focus();
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  ⚡ Auto-fill Code
                </button>
              </div>
            )}

            {/* 6 PIN DIGIT INPUTS */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: '42px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '14px' }}>
              Verify & Complete Sign-Up
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  cancelOtpSession();
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.825rem', cursor: 'pointer' }}
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        ) : !isSignup ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
              Sign In
            </button>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                ⚡ QUICK DEMO ACCOUNTS:
              </div>
              <div className="demo-accounts-grid">
                <button
                  type="button"
                  onClick={() => quickLogin('admin@marketplace.com', 'password123')}
                  className="demo-account-btn"
                  style={{ borderColor: 'rgba(236, 72, 153, 0.4)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: '#ec4899' }}>
                    <Shield size={14} /> Admin Account
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Full Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickLogin('tech@marketplace.com', 'password123')}
                  className="demo-account-btn"
                  style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: '#10b981' }}>
                    <Store size={14} /> TechVault Seller
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>City: New York</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickLogin('urban@marketplace.com', 'password123')}
                  className="demo-account-btn"
                  style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: '#10b981' }}>
                    <Store size={14} /> Urban Craft Seller
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>City: Chicago</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickLogin('buyer@marketplace.com', 'password123')}
                  className="demo-account-btn"
                  style={{ borderColor: 'rgba(37, 99, 235, 0.4)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: '#2563eb' }}>
                    <UserCheck size={14} /> Alex Buyer
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>City: Austin</span>
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign Up Now
              </button>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn ${role === 'buyer' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setRole('buyer')}
                >
                  🛍️ Buyer Profile
                </button>
                <button
                  type="button"
                  className={`btn ${role === 'seller' ? 'btn-primary' : 'btn-secondary'}`}
                  style={role === 'seller' ? { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' } : {}}
                  onClick={() => setRole('seller')}
                >
                  🏪 Seller Profile
                </button>
              </div>
            </div>

            {role === 'seller' && (
              <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '10px' }}>
                  🏪 Seller Store Setup
                </div>

                <div className="form-group">
                  <label className="form-label">Store / Shop Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Apex Tech Store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City Location (Used for Buyer Filtering)</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Yangon, Mandalay, San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
              Send Verification Code
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
