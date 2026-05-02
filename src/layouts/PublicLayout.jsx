import { Link, Outlet } from 'react-router-dom'
export default function PublicLayout() {
  return <div className='min-h-screen bg-primary text-white'><header className='h-16 border-b border-border px-6 flex items-center justify-between'><Link to='/' className='text-accent font-bold'>IXP</Link><nav className='flex gap-4 text-sm'><Link to='/check'>Check</Link><Link to='/ping'>Ping</Link><Link to='/dns'>DNS</Link><Link to='/whois'>WHOIS</Link><Link to='/my-ip'>My IP</Link></nav></header><main className='max-w-7xl mx-auto p-6'><Outlet /></main></div>
}
