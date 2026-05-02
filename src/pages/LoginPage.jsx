import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { login, sendOtp, verifyOtp } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import OtpInput from '../components/auth/OtpInput'
import Button from '../components/ui/Button'

const schema = z.object({ mobile:z.string().regex(/^09\d{9}$/), password:z.string().min(8) })
export default function LoginPage(){
 const [tab,setTab]=useState('pwd');const [otp,setOtp]=useState('');const [step,setStep]=useState(1);const [count,setCount]=useState(0)
 const nav=useNavigate(); const setAuth=useAuthStore(s=>s.setAuth)
 const {register,handleSubmit,formState:{errors},getValues,watch}=useForm({resolver:zodResolver(schema.partial({password:true})),defaultValues:{mobile:'',password:''}})
 const mobile=watch('mobile')
 useEffect(()=>{setStep(1);setCount(0);setOtp('')},[mobile])
 const onAuth=(r)=>{setAuth(r.data);nav('/dashboard')}
 const loginM=useMutation({mutationFn:login,onSuccess:onAuth})
 const sendM=useMutation({mutationFn:sendOtp,onSuccess:()=>{setStep(2);setCount(120)}})
 const verifyM=useMutation({mutationFn:verifyOtp,onSuccess:onAuth})
 useEffect(()=>{if(!count)return;const i=setInterval(()=>setCount(v=>v-1),1000);return()=>clearInterval(i)},[count])
 return <div className='min-h-[75vh] grid place-items-center'>
  <div className='w-full max-w-md bg-secondary border border-border rounded-2xl p-6'>
   <h1 className='text-3xl font-bold text-center'>Welcome to IXP</h1>
   <div className='grid grid-cols-2 gap-2 my-5 bg-tertiary p-1 rounded-lg'><button onClick={()=>setTab('pwd')} className={`rounded-md py-2 ${tab==='pwd'?'bg-accent':''}`}>Password</button><button onClick={()=>setTab('otp')} className={`rounded-md py-2 ${tab==='otp'?'bg-accent':''}`}>OTP</button></div>
   <form className='space-y-3' onSubmit={handleSubmit(v=>loginM.mutate(v))}><input {...register('mobile')} placeholder='09xxxxxxxxx' className='w-full bg-tertiary border border-border rounded-lg p-3'/>{errors.mobile&&<p className='text-red-400 text-sm'>Valid Persian mobile required</p>}
   {tab==='pwd'?<><input type='password' {...register('password')} placeholder='Password' className='w-full bg-tertiary border border-border rounded-lg p-3'/><Button className='w-full'>Login</Button></>:step===1?<Button type='button' className='w-full' disabled={sendM.isPending||!/^09\d{9}$/.test(getValues('mobile'))} onClick={()=>sendM.mutate({mobile:getValues('mobile')})}>Send OTP</Button>:<><p className='text-sm text-muted'>Code sent to {mobile}. <button type='button' className='text-accentLight' onClick={()=>setStep(1)}>Change number</button></p><OtpInput value={otp} onChange={setOtp}/><Button type='button' className='w-full' onClick={()=>verifyM.mutate({mobile:getValues('mobile'),otp})}>Verify OTP</Button><Button type='button' variant='secondary' className='w-full' disabled={count>0} onClick={()=>sendM.mutate({mobile:getValues('mobile')})}>{count>0?`Resend in ${count}s`:'Resend code'}</Button></>}
   </form>
   <p className='text-center text-muted mt-4'>No account? <Link to='/register' className='text-accentLight'>Register</Link></p>
  </div>
 </div>
}
