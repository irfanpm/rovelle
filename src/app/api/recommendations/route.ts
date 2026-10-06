import { getCatalog } from "@/modules/products/catalog";
export async function GET(request:Request){const slug=new URL(request.url).searchParams.get("slug");const all=await getCatalog();const item=all.find(p=>p.slug===slug);return Response.json({products:item?all.filter(p=>p.id!==item.id&&p.categorySlug===item.categorySlug).slice(0,4):[]});}
