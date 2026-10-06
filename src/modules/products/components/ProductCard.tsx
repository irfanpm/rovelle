"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { useToast } from "@/modules/shared/components/Toast";
import { money } from "@/lib/brand";
interface CardProduct { id:string;title:string;slug:string;price:number;compareAtPrice?:number;images:string[];stockStatus?:string;categoryName?:string;featured?:boolean;newArrival?:boolean;variants?:string[] }
export default function ProductCard({product:p}:{product:CardProduct}) {
  const [failed,setFailed]=useState(false);
  const wish=useCartStore(s=>s.wishlist), toggle=useCartStore(s=>s.toggleWishlist), add=useCartStore(s=>s.addToCart);
  const toast=useToast(), available=p.stockStatus==="in_stock";
  const compare=p.compareAtPrice && p.compareAtPrice>p.price ? p.compareAtPrice : 0;
  return <article className="product-card"><div className="product-photo"><Link href={"/products/"+p.slug} className="product-image-link">{p.images[0]&&!failed ? <Image src={p.images[0]} alt={p.title} onError={()=>setFailed(true)} fill sizes="(max-width:700px) 45vw, (max-width:1200px) 28vw, 23vw"/> : <span className="photo-pending">Image unavailable</span>}</Link><button className="wishlist-button" aria-label={(wish.some(x=>x.productId===p.id)?"Remove ":"Save ")+p.title} aria-pressed={wish.some(x=>x.productId===p.id)} onClick={()=>toggle({productId:p.id,title:p.title,slug:p.slug,price:p.price,image:p.images[0]||"",stockStatus:p.stockStatus||"out_of_stock"})}><Heart size={17}/></button>{p.newArrival&&<span className="product-label">NEW ARRIVAL</span>}</div><small>{p.categoryName||"Saved for you"}</small><Link href={"/products/"+p.slug}><h3>{p.title}</h3></Link><div className="product-bottom"><strong>{money(p.price)}</strong>{compare>0&&<><span className="compare-price">{money(compare)}</span><span className="sale-badge">{Math.round((1-p.price/compare)*100)}% OFF</span></>}</div>{!p.variants || p.variants.length>0 ? <Link className="quick-add" href={"/products/"+p.slug}><ShoppingBag size={13}/>{available?"Choose Options":"View Details"}</Link> : <button className="quick-add" disabled={!available} onClick={()=>{add({productId:p.id,title:p.title,slug:p.slug,price:p.price,image:p.images[0]||""});toast.success("Added to your bag.");}}><ShoppingBag size={13}/>{available?"Add to Bag":"Currently Unavailable"}</button>}</article>;
}
