export interface PublicProduct {
 featured: boolean; newArrival: boolean; shortDescription: string; seoTitle: string; metaDescription: string; searchKeywords: string[];
 id: string; title: string; slug: string; description: string; price: number; compareAtPrice?: number; images: string[];
 categoryName: string; categorySlug: string; features: string[]; specifications: {name:string;value:string}[];
 stockStatus: string; isCodAvailable: boolean; variants: string[]; ageGroups: string[]; included: string; safety: string;
}
export const PUBLIC_PROJECTION = "featured newArrival shortDescription seoTitle metaDescription searchKeywords title slug description price compareAtPrice images category features specifications stockStatus isCodAvailable variants ageGroups included safety";
const text = (v: unknown) => typeof v === "string" ? v : "";
const list = (v: unknown) => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
export function toPublicProduct(p: Record<string, unknown>): PublicProduct {
 const c = p.category && typeof p.category === "object" ? p.category as Record<string,unknown> : {};
 return { featured:p.featured===true,newArrival:p.newArrival===true,shortDescription:text(p.shortDescription),seoTitle:text(p.seoTitle),metaDescription:text(p.metaDescription),searchKeywords:list(p.searchKeywords), id: String(p._id || p.id || ""), title:text(p.title), slug:text(p.slug), description:text(p.description),
 price:typeof p.price==="number"?p.price:0, compareAtPrice: typeof p.compareAtPrice==="number" && Number.isFinite(p.compareAtPrice) && typeof p.price==="number" && p.compareAtPrice>p.price ? p.compareAtPrice : undefined, images:list(p.images).filter(x=>/^\/images\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|jpeg|avif)$/.test(x)),
 categoryName:text(c.name),categorySlug:text(c.slug),features:list(p.features),
 specifications:Array.isArray(p.specifications)?p.specifications.filter(x=>x && typeof x === "object").map(x=>({name:text(x.name),value:text(x.value)})):[],
 stockStatus:text(p.stockStatus),isCodAvailable:p.isCodAvailable===true,variants:list(p.variants),ageGroups:list(p.ageGroups),included:text(p.included),safety:text(p.safety) };
}
