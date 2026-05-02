import { Inbox } from 'lucide-react'
export default function EmptyState({ title='No data yet', subtitle='Try adjusting filters or create a new item.', action }) {
  return <div className='border border-border rounded-2xl p-8 text-center bg-secondary'>
    <div className='mx-auto w-14 h-14 rounded-full grid place-items-center bg-tertiary mb-4'><Inbox /></div>
    <h3 className='font-semibold text-lg'>{title}</h3><p className='text-muted text-sm mt-1'>{subtitle}</p>{action}
  </div>
}
