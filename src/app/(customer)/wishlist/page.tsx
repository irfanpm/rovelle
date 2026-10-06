"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import ProductCard from "@/modules/products/components/ProductCard";
export default function Wishlist(){const items=useCartStore(s=>s.wishlist);return <section className="wrap section"><span className="eyebrow">SAVED WITH LOVE</span><h1>Your Wishlist</h1>{items.length?<div className="product-grid">{items.map(i=><ProductCard key={i.productId} product={{id:i.productId,title:i.title,slug:i.slug,price:i.price,images:i.image?[i.image]:[],stockStatus:i.stockStatus}}/>)}</div>:<div className="empty-state"><span><Heart size={45} strokeWidth={1}/></span><h2>Your Wishlist Is Waiting<br/>for Something Beautiful.</h2><p>Tap the heart on a piece you love to keep it close.</p><Link className="primary" href="/products">Explore Jewellery <ArrowRight size={15}/></Link></div>}</section>;}
