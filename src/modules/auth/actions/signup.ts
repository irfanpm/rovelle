"use server";
import { connectToDatabase } from "@/lib/db";
import User from "@/modules/auth/models/user.model";
import { registerSchema, type RegisterInput } from "../schemas";
import bcrypt from "bcryptjs";
export async function signUpAction(input:RegisterInput){
 const data=registerSchema.safeParse(input);if(!data.success)return {success:false,message:data.error.issues[0]?.message||"Check your details."};
 try{await connectToDatabase();const email=data.data.email.trim().toLowerCase();if(await User.exists({email}))return {success:false,message:"An account could not be created. Try signing in."};
 await User.create({name:data.data.name,email,password:await bcrypt.hash(data.data.password,12),role:"customer",status:"active",isVerified:false});
 return {success:true,message:"Your account is ready. Please sign in.",email};
 }catch{return {success:false,message:"Account creation is unavailable. Please try again."};}
}
