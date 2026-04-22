import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Mail, Lock, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userJson = urlParams.get('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        login(user, token);
      } catch (err) {
        console.error('Failed to parse user from OAuth callback', err);
      }
    }
  }, [login]);

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const res = await api.post(endpoint, payload);
      login(res.data.user, res.data.token);
    } catch (err: any) {
      console.error('Auth error:', err);
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Military-grade End-to-End Encryption",
    "Smart Document Organization",
    "Secure Asset & Life Admin Tracking",
    "Encrypted Sharing with Loved Ones"
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex bg-[var(--bg-main)] overflow-hidden">
      {/* Left Panel: Marketing/Brand (Hidden on Mobile) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-16 text-white"
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-400/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] -right-[20%] w-[50%] h-[50%] bg-purple-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-700/50 to-transparent" />
        </div>

        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="text-white" size={28} />
          </div>
          <span className="text-2xl font-bold tracking-tight">DocuVault</span>
        </div>

        {/* Content Section */}
        <div className="relative z-10 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-text' : 'signup-text'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold leading-tight mb-6">
                {isLogin ? (
                  <>Secure Your Life,<br /><span className="text-blue-200">Organize Your World.</span></>
                ) : (
                  <>Start Your Journey<br /><span className="text-blue-200">With Us Today.</span></>
                )}
              </h1>
              <p className="text-lg text-blue-100/80 mb-10 leading-relaxed">
                The world's most trusted platform for personal life admin. Secure your documents, track your assets, and protect your legacy.
              </p>

              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30">
                      <CheckCircle2 size={14} className="text-blue-200" />
                    </div>
                    <span className="text-blue-100 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <div className="relative z-10 flex gap-12 pt-12 border-t border-white/10">
          <div>
            <p className="text-3xl font-bold">100k+</p>
            <p className="text-sm text-blue-200">Documents Secured</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50k+</p>
            <p className="text-sm text-blue-200">Active Families</p>
          </div>
        </div>
      </motion.div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">DocuVault</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-[var(--text-sub)]">
              {isLogin ? 'Choose your login method and access your account' : 'Get started by creating your secure account below'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-medium text-[var(--text-sub)] ml-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      className="w-full bg-[var(--input-bg)] border border-[var(--border-sub)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text-sub)] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-sub)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-[var(--text-sub)]">Password</label>
                {isLogin && <button type="button" className="text-xs text-blue-500 hover:text-blue-400 font-medium">Forgot password?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-sub)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-sub)]"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[var(--bg-main)] px-4 text-[var(--text-muted)] font-medium tracking-widest">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 py-3 border border-[var(--border-sub)] rounded-xl hover:bg-[var(--input-bg)] transition-colors text-sm font-medium text-[var(--text-main)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button 
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-2 py-3 border border-[var(--border-sub)] rounded-xl hover:bg-[var(--input-bg)] transition-colors text-sm font-medium text-[var(--text-main)]"
            >
              <Shield size={20} />
              GitHub
            </button>
          </div>

          <p className="text-center text-[var(--text-sub)]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-400 font-bold underline-offset-4 hover:underline"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
