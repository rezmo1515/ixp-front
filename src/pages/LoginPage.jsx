import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login, sendOtp, verifyOtp } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import OtpInput from '../components/auth/OtpInput'
import Button from '../components/ui/Button'

const schema = z.object({ mobile:z.string().regex(/^09\d{9}$/), password:z.string().min(8) })
export default function LoginPage(){
 const [tab,setTab]=useState('pwd'); const [otp,setOtp]=useState('');const [count,setCount]=useState(0)
 const nav=useNavigate(); const setAuth=useAuthStore(s=>s.setAuth)
 const {register,handleSubmit,formState:{errors},getValues}=useForm({resolver:zodResolver(schema),defaultValues:{mobile:'',password:''}})
 const loginM=useMutation({mutationFn:login,onSuccess:(r)=>{setAuth(r.data);nav('/dashboard')}})
 const sendM=useMutation({mutationFn:sendOtp,onSuccess:()=>{setCount(300);const i=setInterval(()=>setCount(v=>{if(v<=1){clearInterval(i);return 0}return v-1}),1000)}})
 const verifyM=useMutation({mutationFn:verifyOtp,onSuccess:(r)=>{setAuth(r.data);nav('/dashboard')}})
 return <div className='min-h-[75vh] grid place-items-center'>
  <div className='w-full max-w-md bg-secondary border border-border rounded-2xl p-6'>
   <h1 className='text-3xl font-bold text-center'>Welcome to IXP</h1>
   <div className='grid grid-cols-2 gap-2 my-5 bg-tertiary p-1 rounded-lg'><button onClick={()=>setTab('pwd')} className={`rounded-md py-2 ${tab==='pwd'?'bg-accent':''}`}>Password Login</button><button onClick={()=>setTab('otp')} className={`rounded-md py-2 ${tab==='otp'?'bg-accent':''}`}>OTP Login</button></div>
   <form className='space-y-3' onSubmit={handleSubmit(v=>loginM.mutate(v))}><input {...register('mobile')} placeholder='09xxxxxxxxx' className='w-full bg-tertiary border border-border rounded-lg p-3'/>{errors.mobile&&<p className='text-red-400 text-sm'>Valid Persian mobile required</p>}
   {tab==='pwd'?<><input type='password' {...register('password')} placeholder='Password' className='w-full bg-tertiary border border-border rounded-lg p-3'/><Button className='w-full'>Login</Button></>:<><Button type='button' className='w-full' onClick={()=>sendM.mutate({mobile:getValues('mobile')})}>Send OTP {count>0&&`(${Math.floor(count/60)}:${String(count%60).padStart(2,'0')})`}</Button><OtpInput value={otp} onChange={setOtp}/><Button type='button' className='w-full' onClick={()=>verifyM.mutate({mobile:getValues('mobile'),otp})}>Verify OTP</Button></>}
   </form>
   <p className='text-center text-muted mt-4'>No account? <Link to='/register' className='text-accentLight'>Register</Link></p>
  </div>
 </div>
}
