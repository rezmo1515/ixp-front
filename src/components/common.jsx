import clsx from 'clsx';
export const Card = ({className='',...p}) => <div className={clsx('bg-bgSecondary border border-border rounded-xl p-6',className)} {...p}/>;
export const Button = ({className='',...p}) => <button className={clsx('px-4 py-2 rounded-lg bg-accentRed hover:bg-accentRedLight transition hover:scale-[1.02]',className)} {...p}/>;
export const Badge = ({tone='gray',children}) => <span className={clsx('px-2 py-1 text-xs rounded',tone==='green'&&'bg-green-500/20 text-green-400',tone==='red'&&'bg-red-500/20 text-red-400',tone==='yellow'&&'bg-yellow-500/20 text-yellow-400',tone==='gray'&&'bg-zinc-500/20 text-zinc-300')}>{children}</span>;
