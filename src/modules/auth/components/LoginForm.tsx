"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
export function LoginForm() {
 const [error,setError]=useState("");const [busy,setBusy]=useState(false);const router=useRouter();const params=useSearchParams();
 return <form suppressHydrationWarning className="panel auth-form" onSubmit={async e=>{e.preventDefault();setBusy(true);setError("");const d=new FormData(e.currentTarget);try{const r=await signIn("credentials",{email:d.get("email"),password:d.get("password"),redirect:false});if(r?.error)setError("Please check your email and password.");else{const target=params.get("callbackUrl");router.push(target?.startsWith("/")&&!target.startsWith("//")?target:"/account");router.refresh();}}catch{setError("Sign in is unavailable. Please try again.");}finally{setBusy(false);}}}><span className="eyebrow">YOUR ROVELLE ACCOUNT</span><h1>Welcome back.</h1><p>Your favourites, beautifully kept in one place.</p><label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type="password" required autoComplete="current-password"/></label>{error&&<p role="alert">{error}</p>}<button className="primary" disabled={busy}>{busy?"Signing in…":"Sign in"}</button><Link href="/register">Create an account</Link><Link href="/forgot-password">Forgot password?</Link></form>;
}

export default LoginForm;


