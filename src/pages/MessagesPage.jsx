import { useQuery } from '@tanstack/react-query'
import { getMessages } from '../api/messages'
import { Skeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function(){
 const {data,isLoading}=useQuery({queryKey:['messages'],queryFn:getMessages})
 const rows=data?.data?.data||data?.data||[]
 if(isLoading) return <div className='space-y-3'><Skeleton className='h-10 w-full'/><Skeleton className='h-24 w-full'/></div>
 if(!rows.length) return <EmptyState title='No messages yet' subtitle='Send your first broadcast message.'/>
 return <div className='space-y-3'>
  <h2 className='text-2xl font-bold'>Messages</h2>
  <div className='hidden md:block overflow-auto border border-border rounded-xl'><table className='w-full text-sm'><thead className='bg-tertiary'><tr><th className='p-3 text-left'>ID</th><th className='p-3 text-left'>Subject</th><th>Status</th><th>Recipients</th><th>Sent At</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className='odd:bg-secondary even:bg-tertiary/50'><td className='p-3'>{r.id}</td><td>{r.subject}</td><td>{r.status}</td><td>{r.recipients_count||'-'}</td><td>{r.sent_at||'-'}</td></tr>)}</tbody></table></div>
  <div className='md:hidden space-y-2'>{rows.map(r=><div key={r.id} className='bg-secondary border border-border rounded-xl p-3'><p className='font-semibold'>{r.subject}</p><p className='text-xs text-muted'>#{r.id} • {r.sent_at||'--'}</p><p className='mt-2 text-sm'>Status: {r.status}</p></div>)}</div>
 </div>
}
