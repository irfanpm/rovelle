"use server";
import type { ForgotPasswordInput } from "../schemas";
export async function forgotPasswordAction(_data:ForgotPasswordInput){return {success:false,message:"Password reset email is not available yet. Please contact Rovelle support."};}
