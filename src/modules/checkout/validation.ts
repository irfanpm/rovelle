import { z } from "zod";
export const indianStates=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"] as const;
const line=z.string().trim().min(2).max(180);
export const addressSchema=z.object({fullName:line,phone:z.string().regex(/^[6-9]\d{9}$/),house:line,street:line,landmark:z.string().trim().max(180).optional(),city:line,district:line,state:z.enum(indianStates),pincode:z.string().regex(/^[1-9]\d{5}$/)});
export const itemsSchema=z.array(z.object({productId:z.string().regex(/^[a-f0-9]{24}$/i),quantity:z.number().int().min(1).max(10),variant:z.string().max(100).optional()})).min(1).max(30);
export const orderSchema=z.object({shippingAddress:addressSchema,items:itemsSchema,paymentMethod:z.literal("cod"),requestKey:z.string().uuid(),expectedTotal:z.number().finite().positive(),acceptedTerms:z.literal(true)});

