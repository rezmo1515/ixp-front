import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { Landing, CheckPage, PingPage, DnsPage, WhoisPage, MyIpPage, LoginPage, RegisterPage, DashboardHome, MessagesPage, MessageDetailPage, ProxyPage, UsersPage, AclPage, ProfilePage } from '../pages';

const ProtectedRoute=({children})=>useAuthStore(s=>s.token)?children:<Navigate to='/login'/>;
const PermissionRoute=({permission,children})=>{const acl=useAuthStore(s=>s.acl);return acl?.permissions?.includes(permission)?children:<div>403</div>}

export default function AppRouter(){return <Routes>
<Route element={<PublicLayout/>}><Route path='/' element={<Landing/>}/><Route path='/check' element={<CheckPage publicMode/>}/><Route path='/ping' element={<PingPage publicMode/>}/><Route path='/dns' element={<DnsPage publicMode/>}/><Route path='/whois' element={<WhoisPage publicMode/>}/><Route path='/my-ip' element={<MyIpPage/>}/><Route path='/login' element={<LoginPage/>}/><Route path='/register' element={<RegisterPage/>}/></Route>
<Route path='/dashboard' element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}><Route index element={<DashboardHome/>}/><Route path='check' element={<CheckPage/>}/><Route path='ping' element={<PingPage/>}/><Route path='dns' element={<DnsPage/>}/><Route path='whois' element={<WhoisPage/>}/><Route path='messages' element={<PermissionRoute permission='messages.view'><MessagesPage/></PermissionRoute>}/><Route path='messages/:id' element={<PermissionRoute permission='messages.view'><MessageDetailPage/></PermissionRoute>}/><Route path='proxy' element={<PermissionRoute permission='proxy.view'><ProxyPage/></PermissionRoute>}/><Route path='users' element={<PermissionRoute permission='users.view'><UsersPage/></PermissionRoute>}/><Route path='acl' element={<PermissionRoute permission='acl.manage'><AclPage/></PermissionRoute>}/><Route path='profile' element={<ProfilePage/>}/></Route>
</Routes>}
