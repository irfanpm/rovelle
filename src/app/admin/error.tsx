"use client";
export default function AdminError({reset}:{reset:()=>void}){return <div className="panel"><h1>Review could not be saved.</h1><p>Check required fields and publication checks. If a source cost changed, save it first and review pricing again. Publication requires reviewed local images and complete product checks.</p><button className="primary" onClick={reset}>Return to review</button></div>;}

