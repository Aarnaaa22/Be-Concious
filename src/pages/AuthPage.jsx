import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ScanLine, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Flame, 
  Layers, 
  HeartHandshake,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const AuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    resetPassword,
    isConfigured 
  } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Destination after login
  const from = location.state?.from?.pathname || '/dashboard';

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Handle Email & Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Incorrect email or password. Please verify your credentials or use Forgot Password.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please verify your email address before signing in. Check your inbox for the confirmation link.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (data?.user) {
        setSuccessMessage('Login successful! Redirecting...');
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email & Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpWithEmail({ email, password, fullName });
      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMessage('An account with this email already exists. Please log in instead.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (data?.user) {
        // If email confirmation is required by Supabase project
        if (data.session) {
          setSuccessMessage('Account created successfully! Welcome to Be Conscious.');
          navigate(from, { replace: true });
        } else {
          setSuccessMessage(
            'Verification email sent! Please check your inbox and click the verification link to complete activation.'
          );
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address to receive password reset instructions.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password reset link sent! Please check your email inbox.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in could not be completed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-soft/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-warm/20 blur-3xl" />
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        
        {/* Split Screen Container */}
        <div className="bg-white rounded-3xl shadow-[0_20px_70px_rgba(146,0,58,0.08)] border border-[#EFE4EB] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* =================================================================
              LEFT PANEL: AUTHENTICATION FORMS
              ================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between">
            
            <div>
              {/* Header Wordmark */}
              <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                <div className="w-10 h-10 rounded-2xl bg-berry text-white flex items-center justify-center font-heading font-black text-xl shadow-soft group-hover:scale-105 transition-transform">
                  <span className="text-warm">B</span>
                  <span className="text-soft -ml-0.5">C</span>
                </div>
                <span className="font-heading font-black text-2xl text-berry tracking-tight">
                  Be Conscious
                </span>
              </Link>

              {/* Main Heading */}
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-berry tracking-tight leading-tight">
                Welcome to a more conscious way of eating.
              </h1>
              
              <p className="mt-2 text-sm sm:text-base font-medium text-brand-muted">
                {mode === 'login' && 'Sign in to access your persistent scan history, saved favourites and food preferences.'}
                {mode === 'signup' && 'Create your free account to track ingredients, scan barcodes and personalize dietary flags.'}
                {mode === 'forgot' && 'Enter your registered email and we will send you a secure password reset link.'}
              </p>

              {/* Notice if Supabase keys not set */}
              {!isConfigured && (
                <div className="mt-4 p-4 rounded-2xl bg-warm/30 border border-warm/80 text-xs text-berry font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-vibrant mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block">Developer Notice: Supabase Configuration</span>
                    Set your <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">VITE_SUPABASE_URL</code> and <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">VITE_SUPABASE_ANON_KEY</code> in <code className="font-bold">.env</code> to activate live cloud authentication.
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 font-medium flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Success Message Alert */}
              {successMessage && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-medium flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>{successMessage}</div>
                </div>
              )}

              {/* Toggle Switch between Login and Signup (Hidden in forgot password mode) */}
              {mode !== 'forgot' && (
                <div className="mt-6 p-1 rounded-2xl bg-[#FFFAFC] border border-[#EFE4EB] flex items-center">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`w-1/2 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all ${
                      mode === 'login'
                        ? 'bg-berry text-white shadow-soft'
                        : 'text-brand-muted hover:text-berry'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`w-1/2 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all ${
                      mode === 'signup'
                        ? 'bg-berry text-white shadow-soft'
                        : 'text-brand-muted hover:text-berry'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* 1. Continue with Google Button */}
              {mode !== 'forgot' && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-[#EAE0E6] bg-white text-brand-text font-heading font-bold text-sm hover:bg-[#FFFAFC] hover:border-berry transition-all shadow-xs active:scale-[0.99] disabled:opacity-50"
                  >
                    {/* Official Google SVG Monogram */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#EAE0E6]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wider font-extrabold text-brand-muted">
                      <span className="bg-white px-4">Or continue with Email</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Form Submissions */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
                        className="text-xs font-bold text-vibrant hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-berry p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-4 rounded-2xl bg-berry text-white font-heading font-bold text-sm sm:text-base hover:bg-berry/95 active:scale-[0.99] transition-all shadow-soft flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin text-warm" />
                        <span>Signing In...</span>
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {mode === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 chars"
                          required
                          className="w-full px-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          required
                          className="w-full px-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-4 rounded-2xl bg-vibrant text-white font-heading font-bold text-sm sm:text-base hover:bg-vibrant/95 active:scale-[0.99] transition-all shadow-[0_8px_25px_rgba(246,36,119,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin text-warm" />
                        <span>Creating Account...</span>
                      </span>
                    ) : (
                      <>
                        <span>Create Conscious Account</span>
                        <ArrowRight className="w-4 h-4 text-warm" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                      Your Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry focus:bg-white text-brand-text text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-berry text-white font-heading font-bold text-sm sm:text-base hover:bg-berry/95 active:scale-[0.99] transition-all shadow-soft flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Sending Instructions...' : 'Send Password Reset Link'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                      className="text-xs font-bold text-berry hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>← Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-8 pt-6 border-t border-[#EFE4EB] flex items-center justify-between text-xs text-brand-muted">
              <span>Anonymous scanning always supported.</span>
              <Link to="/scan" className="text-berry font-bold hover:underline">
                Continue as Guest →
              </Link>
            </div>

          </div>

          {/* =================================================================
              RIGHT PANEL: BRAND VISUAL COMPOSITION (Desktop Only)
              ================================================================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#92003A] via-[#B30046] to-[#F62477] p-12 text-white flex-col justify-between relative overflow-hidden">
            
            {/* Background Light Patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-warm/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-black/30 blur-3xl pointer-events-none" />

            {/* Top Brand Quote */}
            <div className="relative z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-warm font-heading font-black text-xs uppercase tracking-wider inline-flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-warm" />
                <span>Zero Ads • 100% Free</span>
              </span>

              <h2 className="font-heading font-black text-3xl xl:text-4xl uppercase tracking-tight text-white mt-8 leading-snug">
                Know what you eat.<br />
                <span className="text-warm">Choose what matters.</span>
              </h2>

              <p className="mt-4 text-white/90 text-sm leading-relaxed">
                Connect your account to sync your grocery scans, configure personal allergen shields, and access laboratory nutrition intelligence from any device.
              </p>
            </div>

            {/* Center Decorative Visual Badges */}
            <div className="my-8 space-y-3.5 relative z-10">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3.5 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-warm text-berry flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5 text-berry" />
                </div>
                <div>
                  <div className="text-xs font-bold text-warm uppercase">Personalized Safeguards</div>
                  <div className="text-sm font-extrabold text-white">Instant Allergen Detection</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3.5 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-white text-vibrant flex items-center justify-center font-black">
                  <Flame className="w-5 h-5 text-vibrant" />
                </div>
                <div>
                  <div className="text-xs font-bold text-warm uppercase">Transparent Analytics</div>
                  <div className="text-sm font-extrabold text-white">Nutri-Score & NOVA Group 4</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3.5 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-berry text-white flex items-center justify-center font-black border border-warm/40">
                  <Layers className="w-5 h-5 text-warm" />
                </div>
                <div>
                  <div className="text-xs font-bold text-warm uppercase">Multi-Device Sync</div>
                  <div className="text-sm font-extrabold text-white">Persistent Scan History & Favourites</div>
                </div>
              </div>
            </div>

            {/* Bottom Citation */}
            <div className="relative z-10 pt-6 border-t border-white/20 text-xs text-white/70">
              Powered by Open Food Facts global collaborative database under the ODbL license.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
