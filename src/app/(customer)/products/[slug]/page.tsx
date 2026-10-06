import { notFound } from "next/navigation";
import { getCatalog } from "@/modules/products/catalog";
import { ProductDetailClient } from "@/modules/products/components/ProductDetailClient";
import { getPublicReviews } from "@/modules/reviews/public-reviews";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;const p=(await getCatalog()).find(p=>p.slug===slug);return {title:p?.seoTitle||p?.title||"Product not found",description:p?.metaDescription||p?.description.slice(0,150),keywords:p?.searchKeywords};}
export default async function Detail({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;const all=await getCatalog();const p=all.find(p=>p.slug===slug);if(!p)notFound();const reviews=await getPublicReviews(p.id);return <ProductDetailClient product={p} reviews={reviews} relatedProducts={all.filter(x=>x.id!==p.id&&x.categorySlug===p.categorySlug).slice(0,4)}/>;}
