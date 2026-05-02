import { useQuery } from '@tanstack/react-query';import { getMyIp } from '../../api/tools';
export default ()=>{const {data}=useQuery({queryKey:['ip'],queryFn:getMyIp});return <div>Your IP: {data?.data?.ip || '-'}</div>}
