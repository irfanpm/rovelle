"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { connectToDatabase } from "@/lib/db";
import Product from "@/modules/products/models/product.model";

// 1. Create Product Action
export async function createProduct(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    await connectToDatabase();

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const compareAtPrice = formData.get("compareAtPrice")
      ? parseFloat(formData.get("compareAtPrice") as string)
      : undefined;
    const costPrice = parseFloat(formData.get("costPrice") as string) || 0;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const supplierUrl = (formData.get("supplierUrl") as string) || "";
    const supplierPrice = parseFloat(formData.get("supplierPrice") as string) || 0;
    const stockStatus = (formData.get("stockStatus") as string) || "in_stock";
    const imageUrl = (formData.get("imageUrl") as string) || "";

    if (!title || !price || !category || !description) {
      return;
    }

    // Auto-generate URL slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProduct = new Product({
      title,
      slug,
      description,
      price,
      compareAtPrice,
      costPrice,
      category,
      images: imageUrl
        ? [imageUrl]
        : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"],
      supplierUrl,
      supplierPrice,
      stockStatus,
      status: "draft",
      publicationApproved: false,
    });

    await newProduct.save();

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create product:", error);
  }
}

// 2. Update Product Action
export async function updateProduct(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    await connectToDatabase();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const compareAtPrice = formData.get("compareAtPrice")
      ? parseFloat(formData.get("compareAtPrice") as string)
      : undefined;
    const costPrice = parseFloat(formData.get("costPrice") as string) || 0;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const supplierUrl = (formData.get("supplierUrl") as string) || "";
    const stockStatus = (formData.get("stockStatus") as string) || "in_stock";
    const imageUrl = (formData.get("imageUrl") as string) || "";

    if (!id || !title || !price) {
      return;
    }

    const updateData: Record<string, unknown> = {
      status: "draft", publicationApproved: false,
      title,
      description,
      price,
      compareAtPrice,
      costPrice,
      category,
      supplierUrl,
      stockStatus,
    };

    if (imageUrl) {
      updateData.images = [imageUrl];
    }

    await Product.findByIdAndUpdate(id, updateData);

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to update product:", error);
  }
}

// 3. Delete Product Action
export async function deleteProduct(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    const productId = formData.get("productId") as string;
    if (!productId) return;

    await connectToDatabase();
    await Product.findByIdAndDelete(productId);

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}

// 4. Toggle Product Status Action
export async function toggleProductStatus(productId: string, currentStatus: string) {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized." };
    }

    await connectToDatabase();
    const nextStatus = currentStatus === "active" ? "draft" : "active";
    await Product.findByIdAndUpdate(productId, { status: nextStatus, publicationApproved: false });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    return { success: false, error: (error instanceof Error ? error.message : "Request failed") };
  }
}
