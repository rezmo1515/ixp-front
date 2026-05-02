import { useAuthStore } from '../store/authStore'
export default ()=> {const u=useAuthStore(s=>s.user); return <div>Profile: {u?.first_name} {u?.last_name}</div>}
