export default function Button({ variant='primary', className='', ...props }) {
  const styles = variant === 'secondary'
    ? 'bg-tertiary border border-border hover:border-accentLight'
    : 'bg-accent hover:bg-accentLight'
  return <button {...props} className={`h-11 px-4 rounded-lg font-medium transition hover:scale-[1.02] disabled:opacity-50 ${styles} ${className}`} />
}
