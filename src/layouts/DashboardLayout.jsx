import { LayoutDashboard, Activity, Radio, Globe, MessageSquare, Shield, Users, UserCircle, Network } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const links=[['/dashboard',LayoutDashboard,'Home'],['/dashboard/check',Activity,'Check'],['/dashboard/ping',Radio,'Ping'],['/dashboard/dns',Globe,'DNS'],['/dashboard/messages',MessageSquare,'Messages'],['/dashboard/proxy',Network,'Proxy'],['/dashboard/users',Users,'Users'],['/dashboard/acl',Shield,'ACL'],['/dashboard/profile',UserCircle,'Profile']]

export default function DashboardLayout(){
  return <div className='min-h-screen bg-primary text-white'>
    <header className='h-16 fixed top-0 inset-x-0 z-30 bg-primary border-b border-border flex items-center px-4 md:px-6'><Link to='/dashboard' className='text-accent font-bold text-2xl'>IXP</Link></header>
    <div className='pt-16 md:flex'>
      <aside className='hidden md:block w-60 shrink-0 border-r border-border bg-secondary min-h-[calc(100vh-64px)] p-3 space-y-1'>{links.map(([to,Icon,label])=><NavLink key={to} to={to} className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-tertiary text-sm uppercase tracking-wider'><Icon size={16}/>{label}</NavLink>)}</aside>
      <main className='flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 md:pb-6'><Outlet/></main>
    </div>
    <nav className='md:hidden fixed bottom-0 inset-x-0 h-16 bg-secondary border-t border-border flex justify-around items-center'>{links.slice(0,5).map(([to,Icon,label])=><NavLink key={to} to={to} className='text-xs text-center text-muted'><Icon size={18} className='mx-auto mb-1'/>{label}</NavLink>)}</nav>
  </div>
}
