import type { HydratedDocument } from "mongoose";
import { requireAdmin } from "@/lib/require-admin";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import Category, { type ICategory } from "@/modules/products/models/category.model";
import { AdminProductCreateForm } from "@/modules/products/components/AdminProductCreateForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  let categories: HydratedDocument<ICategory>[] = [];
  try {
    await connectToDatabase();
    categories = await Category.find({ isActive: true });
  } catch (err) {
    console.error("Failed to load categories for new product page:", err);
  }

  const plainCategories = JSON.parse(JSON.stringify(categories));

  return (
    <div className="max-w-4xl space-y-8 select-none font-sans">
      {/* Top Header */}
      <div className="flex items-center gap-4 border-b border-[#E8DFD3] pb-6">
        <Link
          href="/admin/products"
          className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] hover:bg-[#F4EEE5] text-[#9A6B3C] transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#9A6B3C]">
            Catalog Creator
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#2D2621] mt-0.5">
            Add New Product
          </h1>
        </div>
      </div>

      <AdminProductCreateForm categories={plainCategories} />
    </div>
  );
}

