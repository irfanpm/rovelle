import fs from 'node:fs/promises';
import mongoose from 'mongoose';
const {candidates}=JSON.parse(await fs.readFile('private/catalog-release.json','utf8'));
const names={'baby-toddler':'Baby & Toddler','toys-learning':'Toys & Learning','kids-fashion':'Kids Fashion','school-essentials':'School Essentials','nursery-care':'Nursery & Care'};
const fields=['title','slug','description','shortDescription','seoTitle','metaDescription','searchKeywords','featured','newArrival','merchandisingRank','images','features','specifications','included','variants','ageGroups','safety'];
const ids=candidates.map(r=>new mongoose.Types.ObjectId(r.productId));
if(new Set(candidates.map(r=>r.slug)).size!==candidates.length)throw Error('Duplicate slug');
for(const r of candidates){
 if(!names[r.category]||!r.publicationApproved||!Object.values(r.checks).every(Boolean))throw Error('Incomplete review');
 const text=JSON.stringify(Object.fromEntries(fields.map(k=>[k,r[k]])));
 if(/meesho|supplier|dropship|resell|https?:|BPA|non-toxic|certif|FDA|organic/i.test(text))throw Error('Public copy requires review: '+r.researchId);
 if(!(r.retailPrice>r.supplier.supplierPrice))throw Error('Invalid retail');
 for(const img of r.images){if(!/^\/images\/catalog\/kiddio-[a-z-]+\.webp$/.test(img))throw Error('Unsafe image');await fs.access('public'+img);}
}
await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:15000});
try{
 const db=mongoose.connection.db;const settings=await db.collection('settings').findOne({key:'global_settings'});const threshold=settings?.minimumContributionMargin??20;
 for(const r of candidates){if(r.estimatedMargin<threshold)throw Error('Margin review required');const existing=await db.collection('products').findOne({slug:r.slug});if(existing&&!existing._id.equals(new mongoose.Types.ObjectId(r.productId)))throw Error('Slug collision');}
 const backup={products:await db.collection('products').find({_id:{$in:ids}}).toArray(),sourcings:await db.collection('sourcings').find({researchId:{$in:candidates.map(r=>r.researchId)}}).toArray()};
 await fs.writeFile('private/pre-release-backup-'+Date.now()+'.json',JSON.stringify(backup));
 const session=await mongoose.startSession();
 try{await session.withTransaction(async()=>{
 for(const r of candidates){
 const category=await db.collection('categories').findOneAndUpdate({slug:r.category},{$setOnInsert:{name:names[r.category],slug:r.category,isActive:true}},{upsert:true,returnDocument:'after',session});
 const pub=Object.fromEntries(fields.map(k=>[k,r[k]]));
 await db.collection('products').updateOne({_id:new mongoose.Types.ObjectId(r.productId)},{$set:{...pub,price:r.retailPrice,category:category._id,status:'active',publicationApproved:true,stockStatus:'in_stock',isCodAvailable:true,updatedAt:new Date()},$setOnInsert:{costPrice:0,averageRating:0,numReviews:0,createdAt:new Date()},$unset:{supplier:'',supplierPrice:'',supplierUrl:'',compareAtPrice:''}},{upsert:true,session});
 await db.collection('sourcings').updateOne({researchId:r.researchId},{$set:{...r,reviewedAt:new Date(),updatedAt:new Date()},$setOnInsert:{createdAt:new Date()}},{upsert:true,session});
 }
 });}finally{await session.endSession();}
 console.log(JSON.stringify({published:candidates.length,categories:await db.collection('products').aggregate([{$match:{status:'active',publicationApproved:true}},{$lookup:{from:'categories',localField:'category',foreignField:'_id',as:'cat'}},{$group:{_id:{$arrayElemAt:['$cat.name',0]},count:{$sum:1}}}]).toArray()}));
}finally{await mongoose.disconnect();}
