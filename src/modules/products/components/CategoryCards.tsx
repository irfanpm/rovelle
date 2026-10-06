import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories, categoryHref } from "@/lib/brand";
import type { PublicProduct } from "../public-product";
export default function CategoryCards({ products = [] }: { products?: PublicProduct[] }) {
  return <div className="category-grid">{categories.map((c,i) => {
    const product = products.find(p => c.slug === "new-arrivals" ? p.newArrival : p.categorySlug === c.slug);
    const src = product?.images[0] || (i===3 || i===4 ? "/images/rovelle/campaign.webp" : "/images/rovelle/floral-editorial.webp");
    return <Link key={c.slug} href={categoryHref(c.slug)} className="category-card"><div className="category-art"><Image src={src} alt={product ? product.title : ""} fill sizes="(max-width:700px) 30vw, (max-width:1000px) 30vw, 16vw" style={{objectPosition: ["32% 70%","82% 34%","52% 52%","84% 82%","80% 30%","40% 50%"][i]}}/></div><div><h3>{c.name}</h3><ArrowUpRight size={16}/></div><p>{c.caption}</p></Link>;
  })}</div>;
}
