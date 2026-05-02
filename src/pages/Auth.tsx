import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../api'
import { useAuthStore } from '../store/auth'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '../components/ui/Logo'

type Tab = 'login' | 'register'
type LoginMode = 'password' | 'otp'
type OtpStep = 'send' | 'verify'

export default function AuthPage() {
  const { set } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [tab,      setTab]      = useState<Tab>((location.state as any)?.tab ?? 'login')
  const [mode,     setMode]     = useState<LoginMode>('password')
  const [otpStep,  setOtpStep]  = useState<OtpStep>('send')
  const [loading,  setLoading]  = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  // login fields
  const [mobile,   setMobile]   = useState('')
  const [password, setPassword] = useState('')
  const [otp,      setOtp]      = useState('')

  // register fields
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [regMobile, setRegMobile] = useState('')
  const [email,     setEmail]     = useState('')
  const [regPw,     setRegPw]     = useState('')
  const [regPwC,    setRegPwC]    = useState('')

  const afterAuth = (d: any) => {
    set(d.access_token, d.user, d.acl)
    toast.success(`Welcome, ${d.user.first_name}!`)
    navigate('/dashboard')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'password') {
        const r = await authApi.login(mobile, password)
        afterAuth(r.data.data)
      } else if (otpStep === 'send') {
        await authApi.sendOtp(mobile)
        toast.success('OTP sent')
        setOtpStep('verify')
      } else {
        const r = await authApi.verifyOtp(mobile, otp)
        afterAuth(r.data.data)
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regPw !== regPwC) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      const r = await authApi.register({
        first_name: firstName, last_name: lastName,
        mobile: regMobile, email: email || undefined,
        password: regPw, password_confirmation: regPwC,
      })
      afterAuth(r.data.data)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Bg orbs */}
      <div className="orb w-96 h-96 -top-20 -right-20 opacity-10" style={{ background: 'var(--r)' }} />
      <div className="orb w-64 h-64 bottom-10 -left-10 opacity-5" style={{ background: '#3b82f6' }} />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          {(['login','register'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
              style={{
                background: tab === t ? 'var(--r)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--muted)',
              }}>
              {t === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <div className="card" style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 20, padding: 28 }}>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <>
              <h1 className="text-xl font-bold mb-1">Welcome back</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Sign in to your IXP account</p>

              {/* Mode toggle */}
              <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'var(--bg3)' }}>
                {(['password','otp'] as LoginMode[]).map(m => (
                  <button key={m} type="button" onClick={() => { setMode(m); setOtpStep('send'); setOtp('') }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: mode === m ? 'var(--bg2)' : 'transparent', color: mode === m ? 'var(--text)' : 'var(--muted)', border: mode === m ? '1px solid var(--border2)' : '1px solid transparent' }}>
                    {m === 'password' ? 'Password' : 'OTP code'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Mobile number</label>
                  <input className="inp" type="tel" placeholder="09xxxxxxxxx"
                    value={mobile} onChange={e => setMobile(e.target.value)} required />
                </div>

                {mode === 'password' && (
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Password</label>
                    <div className="relative">
                      <input className="inp pr-10" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)} required />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--muted)' }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'otp' && otpStep === 'verify' && (
                  <div>
                    <div className="rounded-xl px-4 py-3 mb-3 text-xs"
                      style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: '#60a5fa' }}>
                      Code sent to <strong>{mobile}</strong>
                    </div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>6-digit code</label>
                    <input className="inp mono text-center text-2xl tracking-widest"
                      maxLength={6} placeholder="— — — — — —"
                      value={otp} onChange={e => setOtp(e.target.value)} required />
                  </div>
                )}

                <button className="btn btn-r w-full justify-center mt-1" disabled={loading}>
                  {loading ? <span className="spin" /> : <ArrowRight size={15} />}
                  {mode === 'password' && 'Sign in'}
                  {mode === 'otp' && otpStep === 'send' && 'Send code'}
                  {mode === 'otp' && otpStep === 'verify' && 'Verify & sign in'}
                </button>

                {mode === 'otp' && otpStep === 'verify' && (
                  <button type="button" className="btn btn-ghost w-full justify-center"
                    onClick={() => setOtpStep('send')}>
                    Resend code
                  </button>
                )}
              </form>
            </>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <>
              <h1 className="text-xl font-bold mb-1">Create account</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Join IXP Network Platform</p>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>First name</label>
                    <input className="inp" placeholder="Ali"
                      value={firstName} onChange={e => setFirstName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Last name</label>
                    <input className="inp" placeholder="Rezaei"
                      value={lastName} onChange={e => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Mobile <span style={{ color: 'var(--r)' }}>*</span></label>
                  <input className="inp" type="tel" placeholder="09xxxxxxxxx"
                    value={regMobile} onChange={e => setRegMobile(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Email <span className="opacity-50">(optional)</span></label>
                  <input className="inp" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Password <span style={{ color: 'var(--r)' }}>*</span></label>
                  <div className="relative">
                    <input className="inp pr-10" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                      value={regPw} onChange={e => setRegPw(e.target.value)} required minLength={8} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Confirm password <span style={{ color: 'var(--r)' }}>*</span></label>
                  <input className="inp" type="password" placeholder="Repeat password"
                    value={regPwC} onChange={e => setRegPwC(e.target.value)} required />
                </div>
                <button className="btn btn-r w-full justify-center mt-1" disabled={loading}>
                  {loading ? <span className="spin" /> : <ArrowRight size={15} />}
                  Create account
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}