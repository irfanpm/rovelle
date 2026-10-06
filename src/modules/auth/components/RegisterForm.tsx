"use client";
import { useState } from "react";
import Link from "next/link";
import { signUpAction } from "../actions/signup";
export function RegisterForm(){const [message,setMessage]=useState(""),[busy,setBusy]=useState(false);return <form className="panel auth-form" onSubmit={async e=>{e.preventDefault();setBusy(true);const d=new FormData(e.currentTarget);try{const r=await signUpAction({name:String(d.get("name")),email:String(d.get("email")),password:String(d.get("password")),confirmPassword:String(d.get("confirmPassword"))});setMessage(r.message);}finally{setBusy(false);}}}><span className="eyebrow">YOUR ROVELLE ACCOUNT</span><h1>A little hello.</h1><label>Your name<input name="name" autoComplete="name" required/></label><label>Email<input name="email" type="email" autoComplete="email" required/></label><label>Password<input name="password" type="password" minLength={8} autoComplete="new-password" required/></label><label>Confirm password<input name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required/></label><p role="status">{message}</p><button className="primary" disabled={busy}>{busy?"Creating…":"Create account"}</button><Link href="/login">Sign in →</Link><Link href="/privacy">Read our privacy policy</Link></form>;}
export default RegisterForm;


