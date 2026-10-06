import "server-only";
import mongoose, { Schema, type InferSchemaType } from "mongoose";
const SourcingSchema=new Schema({
 researchId:{type:String,required:true,unique:true},productId:{type:String,required:true},title:{type:String,required:true},slug:String,category:String,
 overallScore:Number,commercialScores:{type:Map,of:Number},minimumMargin:Number,shortDescription:String,seoTitle:String,metaDescription:String,searchKeywords:[String],featured:Boolean,newArrival:Boolean,merchandisingRank:Number,safety:String,
 description:String,features:[String],specifications:[{name:String,value:String}],included:String,ageGroups:[String],variants:[String],images:[String],
 supplier:{platform:String,supplierUrl:String,supplierProductCode:String,supplierPrice:Number,priceCheckedAt:String,priceBasis:String,availability:String,notes:String},
 costs:{shipping:Number,cod:Number,rto:Number,payment:Number,marketing:Number},retailPrice:Number,
 classification:{type:String,enum:["hero","high-potential","catalog","test"]},decision:{type:String,enum:["needs-verification","approved","rejected"],default:"needs-verification"},
 scores:{type:Map,of:Number},scoreBasis:String,ad:{type:Schema.Types.Mixed},
 checks:{supplier:Boolean,safety:Boolean,images:Boolean,copy:Boolean,pricing:Boolean},
 publicationApproved:{type:Boolean,default:false},marginReviewRequired:{type:Boolean,default:false},
 history:[{price:Number,checkedAt:String,note:String}],reviewedBy:String,reviewedAt:Date
},{timestamps:true});
export type SourcingRecord=InferSchemaType<typeof SourcingSchema>;
const Sourcing=mongoose.models.Sourcing as mongoose.Model<SourcingRecord> || mongoose.model("Sourcing",SourcingSchema);
export default Sourcing;
