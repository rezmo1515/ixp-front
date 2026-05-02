export default function Button({className='',...props}){return <button {...props} className={`bg-accent hover:bg-accentLight transition hover:scale-[1.02] px-4 py-2 rounded-lg ${className}`}/>} 
