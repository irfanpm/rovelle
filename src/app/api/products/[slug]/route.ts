import { getCatalog } from "@/modules/products/catalog";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=(await getCatalog()).find(p=>p.slug===slug);return p?Response.json({product:p}):Response.json({error:"Not found"},{status:404});}
