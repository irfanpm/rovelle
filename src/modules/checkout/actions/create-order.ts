"use server";
import crypto from "node:crypto";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getStoreConfig } from "@/lib/store-config";
import Product from "@/modules/products/models/product.model";
import Order from "@/modules/orders/models/order.model";
import { orderSchema, itemsSchema } from "../validation";
import { toPublicProduct } from "@/modules/products/public-product";
async function validatedItems(input:unknown){
 const items=itemsSchema.parse(input);
 const products=await Product.find({_id:{$in:items.map(i=>i.productId)},status:"active",publicationApproved:true,stockStatus:"in_stock"}).lean();
 const quantities=new Map<string,number>();
 return items.map(i=>{const p=products.find(p=>String(p._id)===i.productId);if(!p||!p.isCodAvailable)throw new Error("An item is unavailable for this order.");
 const total=(quantities.get(i.productId)||0)+i.quantity;quantities.set(i.productId,total);if(total>10)throw new Error("Maximum 10 units per product.");
 if(p.variants.length?!i.variant||!p.variants.includes(i.variant):!!i.variant)throw new Error("Please check your selected options.");
 const dto=toPublicProduct(p as unknown as Record<string,unknown>);
 return {product:p._id,title:dto.title,price:dto.price,quantity:i.quantity,image:dto.images[0]||"",variant:i.variant||""};
 });
}
export async function quoteOrder(items:unknown,pincode:string){
 try{const session=await auth();if(!session?.user?.id)return {success:false as const,error:"Please sign in to checkout."};await connectToDatabase();const config=await getStoreConfig();
 if(!config.checkoutEnabled||!config.codEnabled)throw new Error("Checkout is not open yet.");
 if(!/^[1-9]\d{5}$/.test(pincode)||!config.serviceablePincodes.includes(pincode))throw new Error("Delivery is not currently available for this pincode.");
 const lines=await validatedItems(items);const subtotal=lines.reduce((sum,i)=>sum+i.price*i.quantity,0);
 return {success:true as const,subtotal,shippingFee:config.shippingFee,codFee:config.codFee,discount:0,total:subtotal+config.shippingFee+config.codFee};
 }catch(error){return {success:false as const,error:error instanceof Error?(error instanceof Error ? error.message : "Request failed"):"Unable to confirm your order."};}
}
export async function createOrder(input:unknown){
 try{const session=await auth();if(!session?.user?.id)return {success:false as const,error:"Please sign in to place your order."};
 const data=orderSchema.parse(input);await connectToDatabase();
 const existing=await Order.findOne({requestKey:data.requestKey,customer:session.user.id});
 if(existing)return {success:true as const,orderId:String(existing._id),orderNumber:existing.orderNumber};
 const quote=await quoteOrder(data.items,data.shippingAddress.pincode);if(!quote.success)return quote;
 if(quote.total!==data.expectedTotal)return {success:false as const,error:"Prices changed. Please confirm your total again."};
 const items=await validatedItems(data.items);if(items.reduce((n,i)=>n+i.price*i.quantity,0)!==quote.subtotal)throw new Error("Prices changed");const a=data.shippingAddress;
 const order=await Order.create({requestKey:data.requestKey,orderNumber:"KD-"+crypto.randomBytes(6).toString("hex").toUpperCase(),customer:session.user.id,items,
 shippingAddress:{name:a.fullName,phone:a.phone,addressLine1:a.house,addressLine2:a.street,landmark:a.landmark,city:a.city,district:a.district,state:a.state,postalCode:a.pincode,country:"India"},
 paymentMethod:"COD",paymentStatus:"pending",orderStatus:"pending",totals:{subtotal:quote.subtotal,shippingFee:quote.shippingFee,codFee:quote.codFee,discount:0,total:quote.total}});
 return {success:true as const,orderId:String(order._id),orderNumber:order.orderNumber};
 }catch{return {success:false as const,error:"We could not place your order. Check your details and try again."};}
}
