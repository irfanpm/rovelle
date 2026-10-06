"use server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import Sourcing from "../models/sourcing.model";
import Settings from "@/modules/admin/models/settings.model";
import Product from "../models/product.model";
import Category from "../models/category.model";
import { economics } from "../profit";
import { sourcingCategories as categories } from "@/lib/brand";
import { z } from "zod";
export async function importResearch(){await requireAdmin();const data=JSON.parse(await readFile(path.join(process.cwd(),"private/research-candidates.json"),"utf8"));for(const item of data.candidates){await Sourcing.updateOne({researchId:item.researchId},{$setOnInsert:item},{upsert:true,runValidators:true});}revalidatePath("/admin/sourcing");}
export async function reviewSource(form:FormData){
 const session=await requireAdmin();const id=z.string().regex(/^KD-R\d{3}$/).parse(form.get("researchId"));const record=await Sourcing.findOne({researchId:id});if(!record)throw new Error("Record not found");
 const number=(name:string)=>z.coerce.number().finite().min(0).parse(form.get(name));
 const previous=record.supplier?.supplierPrice;
 const supplierPrice=number("supplierPrice"),retailPrice=number("retailPrice");
 const costs={shipping:number("shipping"),cod:number("cod"),rto:number("rto"),payment:number("payment"),marketing:number("marketing")};
 economics(supplierPrice,retailPrice,costs);
 const checkedAt=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(form.get("priceCheckedAt"));
 if(checkedAt>new Date().toISOString().slice(0,10))throw new Error("Price check cannot be in the future");
 if(previous!==supplierPrice){record.history.push({price:previous,checkedAt:record.supplier?.priceCheckedAt,note:"Previous price"});record.marginReviewRequired=true;record.checks={...record.checks,pricing:false};}
 if(record.supplier){record.supplier.supplierPrice=supplierPrice;record.supplier.priceCheckedAt=checkedAt;record.supplier.notes=z.string().max(5000).parse(form.get("notes"));record.supplier.availability=z.string().max(150).parse(form.get("availability"));}
 record.costs=costs;record.retailPrice=retailPrice;
 record.title=z.string().min(5).max(180).parse(form.get("title"));record.description=z.string().min(20).max(3000).parse(form.get("description"));
 record.images=String(form.get("images")||"").split("\n").map(s=>s.trim()).filter(Boolean);
 record.variants=String(form.get("variants")||"").split("\n").map(s=>s.trim()).filter(Boolean);
 record.included=String(form.get("included")||"");record.features=String(form.get("features")||"").split("\n").map(s=>s.trim()).filter(Boolean);
 record.checks={supplier:form.get("supplierChecked")==="on",safety:form.get("safetyChecked")==="on",images:form.get("imagesChecked")==="on",copy:form.get("copyChecked")==="on",pricing:previous===supplierPrice&&form.get("pricingChecked")==="on"};
 if(record.checks.pricing)record.marginReviewRequired=false;
 record.reviewedBy=session.user.id;record.reviewedAt=new Date();await record.save();revalidatePath("/admin/sourcing");
}
export async function publishSource(form:FormData){
 await requireAdmin();const r=await Sourcing.findOne({researchId:String(form.get("researchId"))});if(!r)throw new Error("Not found");
 if(r.decision==="rejected"||r.marginReviewRequired||!r.checks?.supplier||!r.checks?.safety||!r.checks?.images||!r.checks?.copy||!r.checks?.pricing)throw new Error("Complete all verification checks before publication.");
 const settings=await Settings.findOne({key:"global_settings"});const margin=economics(r.supplier?.supplierPrice||0,r.retailPrice||1,{shipping:r.costs?.shipping||0,cod:r.costs?.cod||0,rto:r.costs?.rto||0,payment:r.costs?.payment||0,marketing:r.costs?.marketing||0}).margin;
 if(margin<(settings?.minimumContributionMargin??20))throw new Error("Margin Review Required: contribution is below the configured minimum.");
 if(!r.images.length||r.images.some(i=>!/^\/images\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|jpeg|avif)$/.test(i)))throw new Error("Use only reviewed store-hosted product photographs.");
 for(const image of r.images){await readFile(path.join(process.cwd(),"public",image));}
 const publicText=[r.title,r.description,r.included,...r.features,...r.variants,...r.specifications.flatMap(s=>[s.name,s.value])].join(" ");
 if(/meesho|supplier|dropship|resell|aliexpress|\bBPA\b|non-toxic|certif|FDA|organic|manufactured by kiddio/i.test(publicText))throw new Error("Remove sourcing references or unsupported claims from public copy.");
 const c=categories.find(c=>c.slug===r.category);if(!c)throw new Error("Choose a supported catalog category");
 const category=await Category.findOneAndUpdate({slug:c.slug},{$setOnInsert:{name:c.name,description:c.caption,isActive:true}},{upsert:true,new:true});
 await Product.findOneAndUpdate({_id:r.productId},{$set:{title:r.title,slug:r.slug,description:r.description,shortDescription:r.shortDescription,seoTitle:r.seoTitle,metaDescription:r.metaDescription,searchKeywords:r.searchKeywords,featured:r.featured,newArrival:r.newArrival,merchandisingRank:r.merchandisingRank,price:r.retailPrice,images:r.images,category:category._id,
 features:r.features,specifications:r.specifications.map(s=>({name:s.name,value:s.value})),included:r.included,variants:r.variants,ageGroups:r.ageGroups,
 safety:r.safety||"Use as directed on the product packaging. Adult supervision is required for children.",status:"active",publicationApproved:true,stockStatus:"in_stock",isCodAvailable:true},
 $setOnInsert:{costPrice:0}},{upsert:true,runValidators:true});
 r.decision="approved";r.publicationApproved=true;await r.save();revalidatePath("/");revalidatePath("/products");revalidatePath("/admin/sourcing");
}
export async function unpublishSource(form:FormData){await requireAdmin();const r=await Sourcing.findOne({researchId:String(form.get("researchId"))});if(!r)throw new Error("Not found");await Product.updateOne({_id:r.productId},{$set:{status:"draft",publicationApproved:false}});r.publicationApproved=false;await r.save();revalidatePath("/");revalidatePath("/products");revalidatePath("/admin/sourcing");}

