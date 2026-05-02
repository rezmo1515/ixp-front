import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuthStore } from '../store/authStore'
import * as P from '../pages'
import usePermission from '../hooks/usePermission'

const ProtectedRoute = ({ children }) => useAuthStore.getState().token ? children : <Navigate to='/login' replace />
const PermissionRoute = ({ permission, children }) => usePermission(permission) ? children : <div className='bg-secondary border border-border rounded-xl p-8'>403 Access Denied</div>

export default function RouterProvider(){return <Routes>
<Route element={<PublicLayout/>}><Route path='/' element={<P.LandingPage/>}/><Route path='/check' element={<P.CheckPage publicMode/>}/><Route path='/ping' element={<P.PingPage publicMode/>}/><Route path='/dns' element={<P.DnsPage publicMode/>}/><Route path='/whois' element={<P.WhoisPage publicMode/>}/><Route path='/my-ip' element={<P.MyIpPage publicMode/>}/><Route path='/login' element={<P.LoginPage/>}/><Route path='/register' element={<P.RegisterPage/>}/></Route>
<Route path='/dashboard' element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}><Route index element={<P.DashboardPage/>}/><Route path='check' element={<P.CheckPage/>}/><Route path='ping' element={<P.PingPage/>}/><Route path='dns' element={<P.DnsPage/>}/><Route path='whois' element={<P.WhoisPage/>}/><Route path='messages' element={<PermissionRoute permission='messages.view'><P.MessagesPage/></PermissionRoute>}/><Route path='messages/:id' element={<PermissionRoute permission='messages.view'><P.MessageDetailPage/></PermissionRoute>}/><Route path='proxy' element={<PermissionRoute permission='proxy.view'><P.ProxyPage/></PermissionRoute>}/><Route path='users' element={<PermissionRoute permission='users.view'><P.UsersPage/></PermissionRoute>}/><Route path='acl' element={<PermissionRoute permission='acl.manage'><P.AclPage/></PermissionRoute>}/><Route path='profile' element={<P.ProfilePage/>}/></Route>
</Routes>}
