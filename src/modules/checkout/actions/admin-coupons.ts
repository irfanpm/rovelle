"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { connectToDatabase } from "@/lib/db";
import Coupon from "@/modules/checkout/models/coupon.model";

export async function createCoupon(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    await connectToDatabase();

    const code = (formData.get("code") as string)?.toUpperCase();
    const discountType = (formData.get("discountType") as string) || "percentage";
    const discountValue = parseFloat(formData.get("discountValue") as string);
    const minOrderValue = parseFloat(formData.get("minOrderValue") as string) || 0;

    if (!code || !discountValue) {
      return;
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderValue,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    await newCoupon.save();

    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Failed to create coupon:", error);
  }
}

export async function deleteCoupon(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    const couponId = formData.get("couponId") as string;
    if (!couponId) return;

    await connectToDatabase();
    await Coupon.findByIdAndDelete(couponId);

    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Failed to delete coupon:", error);
  }
}
