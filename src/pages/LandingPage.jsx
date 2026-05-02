import { Link } from 'react-router-dom'
const tools=[['/check','Site Checker'],['/ping','Ping Test'],['/dns','DNS Check'],['/whois','WHOIS'],['/my-ip','My IP']]
export default function(){return <div className='space-y-8'>
<section className='glass border border-border rounded-2xl p-8 md:p-12'>
  <p className='text-accentLight text-sm uppercase tracking-widest'>Monitoring platform</p>
  <h1 className='text-4xl md:text-6xl font-extrabold mt-3 leading-tight'>Beautiful uptime tools for teams that move fast.</h1>
  <p className='text-muted mt-4 max-w-2xl'>Run checks instantly as guest, then sign in to unlock dashboard analytics, messages, proxy routing and ACL.</p>
  <div className='flex flex-wrap gap-3 mt-6'>{tools.map(t=><Link key={t[0]} to={t[0]} className='bg-secondary border border-border px-4 py-2 rounded-lg hover:border-accent'>{t[1]}</Link>)}</div>
</section></div>}
