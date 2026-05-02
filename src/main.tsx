// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import './index.css'

import Landing   from './pages/Landing'
import Auth     from './pages/Auth'
import Layout    from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Ping      from './pages/Ping'
import Dns       from './pages/Dns'
import Whois     from './pages/Whois'
import Messages  from './pages/Messages'

// ── ACL-aware guard ──────────────────────────────────────────────
function PrivateRoute({
  children,
  permission,
}: {
  children: React.ReactNode
  permission?: string
}) {
  const { user, token, acl, isLoading } = useAuth()

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#0d0d0f]">
      <span className="loader" />
    </div>
  )

  if (!token || !user) return <Navigate to="/Auth" replace />

  // If a required permission is set, check ACL
  if (permission && acl?.permissions && !acl.permissions.includes(permission)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/"      element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/ping"  element={<Ping />} />
          <Route path="/dns"   element={<Dns />} />
          <Route path="/whois" element={<Whois />} />

          {/* Protected app */}
          <Route element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Messages still protected with ACL */}
            <Route path="/messages" element={
              <PrivateRoute permission="messages.send">
                <Messages />
              </PrivateRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1f',
            color: '#f1f1f1',
            border: '1px solid #2a2a2f',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#e63946', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)