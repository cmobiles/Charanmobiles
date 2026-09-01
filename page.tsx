"use client";
import { useState } from "react";

export default function OwnerPage(){
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20}}>
      <section className="glass card" style={{width:"min(460px,100%)"}}>
        <p className="brand">PRIVATE AREA</p>
        <h1 style={{fontSize:48,letterSpacing:-2}}>Owner Corner 🔒</h1>
        <p className="section-sub">Secure Supabase authentication is required. The owner password is intentionally not stored in this public source code.</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Owner email" style={{width:"100%",padding:16,borderRadius:12,border:"1px solid #333",background:"#111",color:"#fff",marginTop:18}} />
        <button className="btn btn-light" style={{width:"100%",marginTop:12}} onClick={()=>setMessage("Connect Supabase Auth using the setup guide, then this login can authenticate the owner securely.")}>Continue</button>
        {message && <p className="small" style={{marginTop:14}}>{message}</p>}
      </section>
    </main>
  )
}
