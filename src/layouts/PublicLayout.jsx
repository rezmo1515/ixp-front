import { Bell, LogIn } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const nav = [['/check','Check'],['/ping','Ping'],['/dns','DNS'],['/whois','WHOIS'],['/my-ip','My IP']]

export default function PublicLayout() {
  return <div className='min-h-screen'>
    <header className='fixed top-0 inset-x-0 h-16 z-40 border-b border-border bg-primary/95 backdrop-blur'>
      <div className='max-w-7xl mx-auto h-full px-4 flex items-center justify-between'>
        <Link to='/' className='text-2xl font-extrabold tracking-wider text-accent'>IXP</Link>
        <nav className='hidden md:flex gap-6 text-sm'>
          {nav.map(([to,label])=><NavLink key={to} to={to} className='text-muted hover:text-white transition'>{label}</NavLink>)}
        </nav>
        <div className='flex gap-2'>
          <button className='w-9 h-9 rounded-lg bg-secondary border border-border grid place-items-center'><Bell size={16}/></button>
          <Link to='/login' className='h-9 px-3 rounded-lg bg-accent hover:bg-accentLight inline-flex items-center gap-2'><LogIn size={15}/>Login</Link>
        </div>
      </div>
    </header>
    <main className='pt-20 max-w-7xl mx-auto px-4 pb-20'><Outlet /></main>
  </div>
}
