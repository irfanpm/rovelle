import fs from "node:fs/promises";
import mongoose from "mongoose";
const uri=process.env.MONGODB_URI;
if(!uri)throw new Error("Set MONGODB_URI in the environment");
const {candidates}=JSON.parse(await fs.readFile(new URL("../private/research-candidates.json",import.meta.url),"utf8"));
await mongoose.connect(uri,{serverSelectionTimeoutMS:10000});
try{
const db=mongoose.connection.db;
await db.collection("sourcings").createIndex({researchId:1},{unique:true});
const names={"baby-toddler":"Baby & Toddler","toys-learning":"Toys & Learning","kids-fashion":"Kids Fashion","school-essentials":"School Essentials","nursery-care":"Nursery & Care"};
for(const r of candidates){
 await db.collection("sourcings").updateOne({researchId:r.researchId},{$setOnInsert:{...r,marginReviewRequired:r.supplier.supplierProductCode==="54149d",createdAt:new Date(),updatedAt:new Date()}},{upsert:true});
 const category=await db.collection("categories").findOneAndUpdate({slug:r.category},{$setOnInsert:{slug:r.category,name:names[r.category],isActive:true}},{upsert:true,returnDocument:"after"});
 await db.collection("products").updateOne({_id:new mongoose.Types.ObjectId(r.productId)},{$setOnInsert:{title:r.title,slug:r.slug,description:r.description,price:r.retailPrice,costPrice:0,category:category._id,images:[],features:r.features,specifications:r.specifications,included:r.included,variants:r.variants,ageGroups:r.ageGroups,status:"draft",publicationApproved:false,stockStatus:"out_of_stock",isCodAvailable:false,averageRating:0,numReviews:0,createdAt:new Date(),updatedAt:new Date()}},{upsert:true});
}
console.log("Imported "+candidates.length+" private research records and draft products. Existing records preserved; nothing published.");
}finally{await mongoose.disconnect();}

