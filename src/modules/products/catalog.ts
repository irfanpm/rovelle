import "server-only";
import { cache } from "react";
import { connectToDatabase } from "@/lib/db";
import Product from "./models/product.model";
import "./models/category.model";
import { PUBLIC_PROJECTION, toPublicProduct } from "./public-product";
export const getCatalog = cache(async () => {
 await connectToDatabase();
 const products=await Product.find({status:"active",publicationApproved:true}).sort({merchandisingRank:1,createdAt:-1}).select(PUBLIC_PROJECTION).populate("category","name slug").lean();
 return products.map(p=>toPublicProduct(p as unknown as Record<string,unknown>));
});
