import type { HydratedDocument } from "mongoose";
import { requireAdmin } from "@/lib/require-admin";
import React from "react";
import { FolderTree, Plus, Trash2 } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import Category, { type ICategory } from "@/modules/products/models/category.model";
import Product from "@/modules/products/models/product.model";
import { createCategory, deleteCategory } from "@/modules/products/actions/admin-categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  let categories: HydratedDocument<ICategory>[] = [];
  const categoryCounts: Record<string, number> = {};
  let dbConnected = true;

  try {
    await connectToDatabase();
    categories = await Category.find().sort({ createdAt: -1 });
    
    // Count products per category
    const products = await Product.find({}, "category");
    products.forEach((p) => {
      if (p.category) {
        const catId = p.category.toString();
        categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
      }
    });
  } catch (err) {
    console.error("Admin categories fetch error:", err);
    dbConnected = false;
  }

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Header */}
      <div className="border-b border-[#E8DFD3] pb-6">
        <span className="text-xs uppercase font-medium tracking-widest text-[#9A6B3C]">
          Store Architecture
        </span>
        <h1 className="text-3xl font-medium tracking-tight text-[#2D2621] mt-0.5">
          Categories &amp; Collections ({categories.length})
        </h1>
      </div>

      {!dbConnected && (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          ⚠️ Database connection offline.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Create Category Form */}
        <div className="lg:col-span-1">
          <form
            action={createCategory}
            className="p-6 rounded-md bg-white border border-[#E8DFD3] shadow-xs space-y-4"
          >
            <h3 className="text-sm font-medium text-[#2D2621] flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#9A6B3C]" />
              Create Collection Category
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2621]">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Necklaces"
                className="w-full px-4 py-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-medium text-[#2D2621] placeholder-[#A49788] focus:outline-none focus:border-[#9A6B3C] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2621]">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Short collection tagline..."
                className="w-full px-4 py-2.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-medium text-[#2D2621] placeholder-[#A49788] focus:outline-none focus:border-[#9A6B3C] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-sm bg-[#9A6B3C] hover:bg-[#80532D] text-white font-bold text-xs transition-colors shadow-md shadow-[#9A6B3C]/20 uppercase tracking-wider"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Right: Categories Table */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E8DFD3] shadow-xs space-y-4">
            <h3 className="text-sm font-medium text-[#2D2621]">Active Categories</h3>

            {categories.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#E8DFD3] rounded-md bg-[#FAF7F2]">
                <FolderTree className="h-10 w-10 text-[#A49788] mx-auto mb-2" />
                <p className="text-xs text-[#7D746B]">No categories created yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DFD3] bg-[#FAF7F2] text-[#2D2621] text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Slug</th>
                      <th className="py-3 px-4">Assigned Products</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD3]">
                    {categories.map((cat) => {
                      const catId = cat._id.toString();
                      return (
                        <tr key={catId} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#2D2621]">
                            {cat.name}
                          </td>
                          <td className="py-3.5 px-4 text-[#7D746B] font-mono">
                            /{cat.slug}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#9A6B3C]">
                            {categoryCounts[catId] || 0} items
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <form action={deleteCategory} className="inline-block">
                              <input type="hidden" name="categoryId" value={catId} />
                              <button
                                type="submit"
                                title="Delete Category"
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

