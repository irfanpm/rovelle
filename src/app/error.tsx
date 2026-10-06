"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="wrap section empty-state"><h1>A little hiccup.</h1><p>We couldn’t complete that request. Please check your details and try again.</p><button className="primary" onClick={reset}>Try again</button></section>;}
