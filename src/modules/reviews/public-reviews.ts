import "server-only";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Review from "./models/review.model";
import "@/modules/auth/models/user.model";
export interface ReviewData { count:number;average:number;entries:{id:string;name:string;rating:number;comment:string}[] }
export async function getPublicReviews(productId:string):Promise<ReviewData> {
  await connectToDatabase();
  const match={product:new mongoose.Types.ObjectId(productId),isApproved:true};
  const [stats,entries]=await Promise.all([Review.aggregate([{$match:match},{$group:{_id:null,count:{$sum:1},average:{$avg:"$rating"}}}]),Review.find(match).select("rating comment user").populate("user","name").sort({createdAt:-1}).limit(8).lean()]);
  return {count:stats[0]?.count||0,average:stats[0]?.average||0,entries:entries.map(e=>({id:String(e._id),name:e.user&&typeof e.user==="object"&&"name" in e.user?String(e.user.name):"Customer",rating:e.rating,comment:e.comment}))};
}
