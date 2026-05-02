export default function Logo({ size = 'md' }: { size?: 'sm'|'md'|'lg' }) {
  const h = size === 'sm' ? 16 : size === 'lg' ? 28 : 20
  const gap = size === 'sm' ? 6 : 10

  return (
    <div className="flex items-center" style={{ gap }}>
      <div className="flex items-end gap-0.5">
        <span className="rounded-sm block" style={{ width: 4, height: h, background: 'var(--r)' }} />
        <span className="rounded-sm block" style={{ width: 4, height: h * .65, background: 'var(--r)' }} />
        <span className="rounded-sm block" style={{ width: 4, height: h, background: 'var(--r)' }} />
      </div>
      <span style={{
        fontFamily: 'Bebas Neue',
        fontSize: size === 'sm' ? 18 : size === 'lg' ? 30 : 22,
        letterSpacing: 3,
        color: '#fff',
        lineHeight: 1,
      }}>IXP</span>
    </div>
  )
}