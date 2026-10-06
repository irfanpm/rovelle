import "server-only";
import { connectToDatabase } from "./db";
import Settings from "@/modules/admin/models/settings.model";
export async function getStoreConfig(){
 try{await connectToDatabase(); const s=await Settings.findOne({key:"global_settings"}).lean();
 return { checkoutEnabled:s?.checkoutEnabled===true, codEnabled:s?.isCodEnabled===true, shippingFee:s?.shippingFee??0, codFee:s?.codFee??0,
 supportEmail:s?.storeEmail||"",supportPhone:s?.supportPhone||"",businessName:s?.businessName||"",businessAddress:s?.businessAddress||"",
 shippingPolicy:s?.shippingPolicy||"",returnsPolicy:s?.returnsPolicy||"",serviceablePincodes:s?.serviceablePincodes||[] };
 }catch{return {checkoutEnabled:false,codEnabled:false,shippingFee:0,codFee:0,supportEmail:"",supportPhone:"",businessName:"",businessAddress:"",shippingPolicy:"",returnsPolicy:"",serviceablePincodes:[] as string[]};}
}
