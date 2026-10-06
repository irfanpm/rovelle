"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, UserRound, Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { money } from "@/lib/brand";
import BrandLogo from "./BrandLogo";
type SearchProduct = { id: string; slug: string; title: string; price: number; images: string[] };
const links = [{ name: "Home", href: "/" }, { name: "Shop", href: "/products" }, { name: "Necklaces", href: "/products?category=necklaces" }, { name: "Earrings", href: "/products?category=earrings" }, { name: "Jewellery Sets", href: "/products?category=jewellery-sets" }, { name: "New Arrivals", href: "/products?new=1&edit=jewellery" }, { name: "Our Story", href: "/about" }];
export default function Navbar({ announcement = "A little elegance. Every day.", codEnabled = false }: { announcement?: string; codEnabled?: boolean }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null), search = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState(""), [results, setResults] = useState<SearchProduct[]>([]), [loading, setLoading] = useState(false), [failed, setFailed] = useState(false);
  const count = useCartStore(s => s.cart.reduce((n, i) => n + i.quantity, 0));
  useEffect(() => {
    if (!query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setFailed(false);
      try { const response = await fetch("/api/search?search=" + encodeURIComponent(query.trim()), { signal: controller.signal }); if (!response.ok) throw new Error("Search unavailable"); const data = await response.json(); setResults(data.products.slice(0, 6)); }
      catch { if (!controller.signal.aborted) { setResults([]); setFailed(true); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  const close = () => { menu.current?.close(); search.current?.close(); };
  return <>
    <div className="announcement"><span>{announcement}</span><span className="announcement-right">{codEnabled ? "Cash on delivery available" : "Thoughtfully curated. Beautifully you."}</span></div>
    <header className="site-header"><div className="header-main wrap">
      <Link href="/" aria-label="Rovelle Jewels home"><BrandLogo/></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link href={link.href} key={link.name} aria-current={pathname === link.href ? "page" : undefined}>{link.name}</Link>)}</nav>
      <div className="header-actions"><button className="icon-button" aria-label="Search jewellery" onClick={() => search.current?.showModal()}><Search/></button><Link className="icon-button account-icon" href="/account" aria-label="My account"><UserRound/></Link><Link className="icon-button" href="/wishlist" aria-label="Wishlist"><Heart/></Link><Link className="icon-button cart-icon" href="/cart" aria-label={"Shopping bag, " + count + " items"}><ShoppingBag/>{count > 0 && <span className="cart-count">{count > 99 ? "99+" : count}</span>}</Link><button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => menu.current?.showModal()}><Menu/></button></div>
    </div></header>
    <dialog ref={menu} className="navigation-dialog" aria-label="Main navigation" onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="drawer-heading"><BrandLogo compact/><button className="icon-button" aria-label="Close navigation" onClick={close}><X/></button></div><nav>{links.map(link => <Link onClick={close} key={link.name} href={link.href}>{link.name}<ArrowRight size={18}/></Link>)}<Link href="/account" onClick={close}>My account<UserRound size={18}/></Link><Link href="/support" onClick={close}>Customer care<Heart size={18}/></Link></nav><p className="drawer-note">Small details. Beautiful moments.</p></dialog>
    <dialog ref={search} className="search-dialog" aria-labelledby="search-title"><div className="drawer-heading"><h2 id="search-title">Find something beautiful.</h2><button className="icon-button" aria-label="Close search" onClick={close}><X/></button></div><form action="/products" onSubmit={close} className="search"><Search size={20}/><input name="search" autoFocus type="search" aria-label="Search the collection" placeholder="Necklaces, earrings, a little inspiration…" value={query} onChange={e => { setQuery(e.target.value); setResults([]); setLoading(!!e.target.value.trim()); }}/><button className="icon-button" aria-label="Submit search"><ArrowRight size={20}/></button></form><div className="search-results" aria-live="polite">{query.trim() ? loading ? <p>Finding your favourites…</p> : failed ? <p>Search is unavailable at the moment. Please try again.</p> : results.length ? results.map(p => <Link key={p.id} href={"/products/" + p.slug} onClick={close}>{p.images[0] && <Image src={p.images[0]} alt="" width={64} height={64}/>}<span>{p.title}<small>{money(p.price)}</small></span><ArrowRight size={17}/></Link>) : <p>No matches just yet. Try another word or <Link href="/products" onClick={close}>explore the collection</Link>.</p> : <p>Discover the details that feel like you.</p>}</div></dialog>
  </>;
}

