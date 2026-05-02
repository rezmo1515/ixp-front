// src/pages/Login.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { Lock, User as UserIcon, Phone, CheckCircle, Eye, EyeOff } from 'lucide-react'

type AuthMode = 'login-password' | 'login-otp' | 'verify-otp' | 'register'

export default function Login() {
  const { login, register, sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<AuthMode>('login-password')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  // Login fields
  const [loginMobile, setLoginMobile] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  // Register fields
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regMobile, setRegMobile] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordConf, setRegPasswordConf] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  useEffect(() => {
    if (mode !== 'verify-otp') return
    if (timeLeft <= 0) return

    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(t)
  }, [mode, timeLeft])

  const startOtpTimer = () => {
    setTimeLeft(300) // 5 min
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'login-password') {
        await login(loginMobile, password)
        navigate('/ping')
      } else if (mode === 'login-otp') {
        await sendOtp(loginMobile)
        setMode('verify-otp')
        setOtp('')
        startOtpTimer()
      } else if (mode === 'verify-otp') {
        await verifyOtp(loginMobile, otp)
        navigate('/ping')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error signing in')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (regPassword !== regPasswordConf) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await register({
        first_name: regFirstName,
        last_name: regLastName,
        mobile: regMobile,
        email: regEmail || undefined,
        password: regPassword,
        password_confirmation: regPasswordConf,
      })
      navigate('/ping')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">IXP TRACKER</span>
          </div>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-white leading-tight mb-4">
                Monitor Your Infrastructure
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Real-time monitoring and management of your network infrastructure with advanced diagnostics and comprehensive analytics.
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                'Real-time ping & DNS monitoring',
                'Advanced WHOIS lookups',
                'Role-based access control',
                'Message broadcasting system'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-400 text-sm">© 2024 IXP Tracker. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">IXP TRACKER</span>
          </div>

          {/* AUTH TABS */}
          <div className="flex gap-2 mb-8 p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => {
                setMode('login-password')
                setLoginMobile('')
                setPassword('')
                setOtp('')
              }}
              className={`flex-1 py-2.5 px-3 rounded-md text-sm font-semibold transition-all ${
                (mode === 'login-password' || mode === 'verify-otp' || mode === 'login-otp')
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register')
                setRegFirstName('')
                setRegLastName('')
                setRegMobile('')
                setRegEmail('')
                setRegPassword('')
                setRegPasswordConf('')
              }}
              className={`flex-1 py-2.5 px-3 rounded-md text-sm font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* PASSWORD LOGIN */}
          {mode === 'login-password' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      placeholder="+98 9123456789"
                      value={loginMobile}
                      onChange={e => setLoginMobile(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /></>
                  ) : null}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition"
                  onClick={() => setMode('login-otp')}
                >
                  Sign In with OTP
                </button>
              </form>
            </div>
          )}

          {/* OTP SEND */}
          {mode === 'login-otp' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Sign In with OTP</h2>
                <p className="text-slate-400 text-sm">We'll send a code to your phone</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      placeholder="+98 9123456789"
                      value={loginMobile}
                      onChange={e => setLoginMobile(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <button 
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /></>
                  ) : null}
                  {loading ? 'Sending...' : 'Send Code'}
                </button>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition"
                  onClick={() => setMode('login-password')}
                >
                  Back
                </button>
              </form>
            </div>
          )}

          {/* OTP VERIFY */}
          {mode === 'verify-otp' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Verify Code</h2>
                <p className="text-slate-400 text-sm">Enter the code sent to {loginMobile}</p>
              </div>

              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs text-center">
                Code sent successfully
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Verification Code</label>
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-center text-2xl font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                    maxLength={6}
                    placeholder="------"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    dir="ltr"
                  />
                </div>

                <div className={`text-center text-sm font-mono font-bold ${timeLeft > 60 ? 'text-green-400' : timeLeft > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired'}
                </div>

                <button 
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /></>
                  ) : null}
                  {loading ? 'Verifying...' : 'Verify'}
                </button>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={timeLeft > 0}
                  onClick={async () => {
                    await sendOtp(loginMobile)
                    startOtpTimer()
                    toast.success('Code sent again')
                  }}
                >
                  Resend Code
                </button>
              </form>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
                <p className="text-slate-400 text-sm">Join us to monitor your infrastructure</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 block">First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                        placeholder="John"
                        value={regFirstName}
                        onChange={e => setRegFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 block">Last Name</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      placeholder="Doe"
                      value={regLastName}
                      onChange={e => setRegLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      placeholder="+98 9123456789"
                      value={regMobile}
                      onChange={e => setRegMobile(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Email (Optional)</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                    type="email"
                    placeholder="your@email.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                      type="password"
                      placeholder="••••••••"
                      value={regPasswordConf}
                      onChange={e => setRegPasswordConf(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /></>
                  ) : null}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}