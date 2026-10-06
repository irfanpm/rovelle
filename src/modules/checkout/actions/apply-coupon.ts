"use server";

import { connectToDatabase } from "@/lib/db";
import Coupon from "@/modules/checkout/models/coupon.model";

export async function applyCoupon(code: string, cartSubtotal: number) {
  try {
    if (!code) {
      return { success: false, error: "Please enter a coupon code." };
    }

    await connectToDatabase();

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return { success: false, error: "Invalid or expired promo code." };
    }

    if (coupon.minOrderValue && cartSubtotal < coupon.minOrderValue) {
      return {
        success: false,
        error: `This coupon requires a minimum order of ₹${coupon.minOrderValue.toLocaleString("en-IN")}.`,
      };
    }

    let discountValue = 0;
    if (coupon.discountType === "percentage") {
      discountValue = (cartSubtotal * coupon.discountValue) / 100;
    } else {
      discountValue = coupon.discountValue;
    }

    discountValue = Math.min(discountValue, cartSubtotal);

    return {
      success: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      calculatedDiscount: discountValue,
      message: "Coupon applied successfully!",
    };
  } catch (error) {
    console.error("Apply coupon error:", error);
    return { success: false, error: "Failed to validate coupon code." };
  }
}
