import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { checkSite } from '../api/tools'
import Button from '../components/ui/Button'

export default function CheckPage({ publicMode }) {
  const [url, setUrl] = useState('https://')
  const [rows, setRows] = useState([])
  const [done, setDone] = useState(false)

  const m = useMutation({
    mutationFn: checkSite,
    onMutate: () => { setRows([]); setDone(false) },
    onSuccess: () => {
      const es = new EventSource(`http://localhost:8000/api/crawl/stream-check?url=${encodeURIComponent(url)}`)
      es.onmessage = (e) => setRows((p) => [...p, JSON.parse(e.data)])
      es.addEventListener('done', () => { setDone(true); es.close() })
      es.onerror = () => { setDone(true); es.close() }
    }
  })

  return <div className='space-y-6'>
    <div className='bg-secondary border border-border rounded-2xl p-6'>
      <h2 className='text-2xl font-bold mb-4'>Global Site Checker</h2>
      {publicMode && <div className='mb-4 text-sm bg-tertiary border border-border p-3 rounded-lg'>Login to save results & access advanced features.</div>}
      <div className='flex flex-col md:flex-row gap-3'>
        <input className='bg-tertiary border border-border rounded-lg p-3 flex-1' value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button onClick={() => m.mutate({ url })}>Check Now</Button>
      </div>
    </div>

    <div className='bg-secondary border border-border rounded-2xl p-0 overflow-hidden'>
      <div className='p-4 border-b border-border flex justify-between'><span>Node Results</span><span className='text-sm text-muted'>{done ? 'DONE' : 'STREAMING'}</span></div>
      <div className='overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-tertiary sticky top-0'><tr><th className='p-3 text-left'>Node</th><th className='p-3'>Status</th><th className='p-3'>HTTP</th><th className='p-3'>Response</th><th className='p-3'>IP</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className='odd:bg-secondary even:bg-tertiary/50 animate-pulse'><td className='p-3'>{r.node || r.node_name}</td><td className='p-3'>{r.status}</td><td className='p-3'>{r.http_code ?? '-'}</td><td className='p-3'>{r.response_time ?? '-'} ms</td><td className='p-3'>{r.ip ?? '-'}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  </div>
}
