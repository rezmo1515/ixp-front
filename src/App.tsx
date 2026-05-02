import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Ping from './pages/Ping'
import Dns from './pages/Dns'
import Whois from './pages/Whois'
import Messages from './pages/Messages'
import Roles from './pages/Roles'
import Layout from './components/layout/Layout'

// ProtectedRoute: redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          <span style={{ color: 'var(--muted)' }} className="text-sm">درحال بارگزاری…</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/ping" element={<Ping />} />
        <Route path="/dns" element={<Dns />} />
        <Route path="/whois" element={<Whois />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/roles" element={<Roles />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="/" element={<Navigate to="/ping" replace />} />
      <Route path="*" element={<Navigate to="/ping" replace />} />
    </Routes>
  )
}