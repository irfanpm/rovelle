import type { HydratedDocument } from "mongoose";
import { requireAdmin } from "@/lib/require-admin";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import Product, { type IProduct } from "@/modules/products/models/product.model";
import Category, { type ICategory } from "@/modules/products/models/category.model";
import { AdminProductEditForm } from "@/modules/products/components/AdminProductEditForm";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;

  let product: HydratedDocument<IProduct> | null = null;
  let categories: HydratedDocument<ICategory>[] = [];

  try {
    await connectToDatabase();
    product = await Product.findById(id).select("+costPrice +supplierUrl");
    categories = await Category.find({ isActive: true });
  } catch (err) {
    console.error("Failed to load product for editing:", err);
  }

  if (!product) {
    notFound();
  }

  const plainProduct = JSON.parse(JSON.stringify(product));
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
            Catalog Editor
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#2D2621] mt-0.5">
            Edit Product Details
          </h1>
        </div>
      </div>

      <AdminProductEditForm product={plainProduct} categories={plainCategories} />
    </div>
  );
}

