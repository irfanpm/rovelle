import CategoryCards from "@/modules/products/components/CategoryCards";
import { getCatalog } from "@/modules/products/catalog";
import { isJewelleryCategory } from "@/lib/brand";
export const dynamic="force-dynamic";
export const metadata={title:"Our collections"};
export default async function Categories(){const products=(await getCatalog()).filter(p=>isJewelleryCategory(p.categorySlug));return <section className="wrap section"><span className="eyebrow">A LITTLE SOMETHING FOR EVERY MOMENT</span><h1>Our Collections</h1><p>Find your everyday elegance. Explore styles for the moments that matter.</p><CategoryCards products={products}/>{!products.length&&<p className="small" style={{marginTop:30}}>Our jewellery collections are being curated. Campaign imagery offers a glimpse into the Rovelle mood; available pieces will appear as they arrive.</p>}</section>;}
