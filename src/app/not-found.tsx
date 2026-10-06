import Link from "next/link";
import { Gem } from "lucide-react";
export default function NotFound(){return <section className="wrap section empty-state"><span><Gem size={50} strokeWidth={1}/></span><span className="eyebrow">404 · A LITTLE LOST</span><h1>This Jewel Seems to Be Missing.</h1><p>The page may have moved, or this piece may no longer be available.</p><Link className="primary" href="/">Return Home →</Link></section>;}
