"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import Settings from "../models/settings.model";
export async function updateStoreSettings(form:FormData){
 await requireAdmin();const str=(key:string)=>String(form.get(key)||"").trim();
 const data={minimumContributionMargin:z.coerce.number().min(0).max(100).parse(form.get("minimumContributionMargin")??20),storeName:"Rovelle Jewels",currency:"INR",businessName:str("businessName"),businessAddress:str("businessAddress"),storeEmail:str("storeEmail"),supportPhone:str("supportPhone"),shippingPolicy:str("shippingPolicy"),returnsPolicy:str("returnsPolicy"),shippingFee:z.coerce.number().min(0).max(5000).parse(form.get("shippingFee")),codFee:z.coerce.number().min(0).max(500).parse(form.get("codFee")),isCodEnabled:form.get("isCodEnabled")==="on",checkoutEnabled:form.get("checkoutEnabled")==="on",serviceablePincodes:str("serviceablePincodes").split(",").map(s=>s.trim()).filter(Boolean)};
 if(data.storeEmail)z.string().email().parse(data.storeEmail);
 if(data.supportPhone)z.string().regex(/^91[6-9]\d{9}$/).parse(data.supportPhone);
 if(data.serviceablePincodes.some(p=>!/^[1-9]\d{5}$/.test(p)))throw new Error("Use valid six-digit pincodes");
 if(data.checkoutEnabled&&(!data.businessName||!data.businessAddress||!data.storeEmail||!data.supportPhone||!data.shippingPolicy||!data.returnsPolicy||!data.serviceablePincodes.length||!data.isCodEnabled))throw new Error("Complete business, support, delivery and policy details before opening checkout");
 await Settings.findOneAndUpdate({key:"global_settings"},{$set:data},{upsert:true,runValidators:true});revalidatePath("/admin/settings");revalidatePath("/support");revalidatePath("/shipping");revalidatePath("/returns");
}
