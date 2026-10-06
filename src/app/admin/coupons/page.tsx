import type { HydratedDocument } from "mongoose";
import { requireAdmin } from "@/lib/require-admin";
import React from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import Coupon, { type ICoupon } from "@/modules/checkout/models/coupon.model";
import { createCoupon, deleteCoupon } from "@/modules/checkout/actions/admin-coupons";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await requireAdmin();
  let coupons: HydratedDocument<ICoupon>[] = [];
  let dbConnected = true;

  try {
    await connectToDatabase();
    coupons = await Coupon.find().sort({ createdAt: -1 });
  } catch (err) {
    console.error("Admin coupons fetch error:", err);
    dbConnected = false;
  }

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Header */}
      <div className="border-b border-[#E8DFD3] pb-6">
        <span className="text-xs uppercase font-medium tracking-widest text-[#9A6B3C]">
          Marketing &amp; Promotions
        </span>
        <h1 className="text-3xl font-medium tracking-tight text-[#2D2621] mt-0.5">
          Coupons &amp; Promo Codes ({coupons.length})
        </h1>
      </div>

      {!dbConnected && (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          ⚠️ Database connection offline.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Create Coupon Form */}
        <div className="lg:col-span-1">
          <form
            action={createCoupon}
            className="p-6 rounded-md bg-white border border-[#E8DFD3] shadow-xs space-y-4"
          >
            <h3 className="text-sm font-medium text-[#2D2621] flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#9A6B3C]" />
              Create Promo Coupon
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2621]">
                Coupon Code *
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="e.g. ROVELLE10"
                className="w-full px-4 py-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-medium text-[#2D2621] uppercase placeholder-[#A49788] focus:outline-none focus:border-[#9A6B3C] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2621]">
                Discount Type *
              </label>
              <select
                name="discountType"
                defaultValue="percentage"
                className="w-full px-4 py-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-bold text-[#2D2621] focus:outline-none focus:border-[#9A6B3C] transition-colors"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed Amount Off (₹ INR)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2621]">
                Discount Value *
              </label>
              <input
                type="number"
                name="discountValue"
                step="0.01"
                required
                placeholder="10"
                className="w-full px-4 py-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-medium text-[#2D2621] placeholder-[#A49788] focus:outline-none focus:border-[#9A6B3C] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2621]">
                Min. Order Amount (₹ INR)
              </label>
              <input
                type="number"
                name="minOrderValue"
                step="0.01"
                placeholder="20"
                className="w-full px-4 py-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-medium text-[#2D2621] placeholder-[#A49788] focus:outline-none focus:border-[#9A6B3C] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-sm bg-[#9A6B3C] hover:bg-[#80532D] text-white font-bold text-xs transition-colors shadow-md shadow-[#9A6B3C]/20 uppercase tracking-wider"
            >
              Save Promo Coupon
            </button>
          </form>
        </div>

        {/* Right: Active Coupons Table */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E8DFD3] shadow-xs space-y-4">
            <h3 className="text-sm font-medium text-[#2D2621]">Active Store Coupons</h3>

            {coupons.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#E8DFD3] rounded-md bg-[#FAF7F2]">
                <Tag className="h-10 w-10 text-[#A49788] mx-auto mb-2" />
                <p className="text-xs text-[#7D746B]">No active promo coupons.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DFD3] bg-[#FAF7F2] text-[#2D2621] text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Min. Order</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD3]">
                    {coupons.map((c) => {
                      const couponId = c._id.toString();
                      return (
                        <tr key={couponId} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#9A6B3C]">
                            {c.code}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#2D2621]">
                            {c.discountType === "percentage"
                              ? `${c.discountValue}% OFF`
                              : `$${c.discountValue.toFixed(2)} OFF`}
                          </td>
                          <td className="py-3.5 px-4 text-[#7D746B] font-bold">
                            ${(c.minOrderValue || 0).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <form action={deleteCoupon} className="inline-block">
                              <input type="hidden" name="couponId" value={couponId} />
                              <button
                                type="submit"
                                title="Delete Coupon"
                                className="p-1.5 rounded-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

