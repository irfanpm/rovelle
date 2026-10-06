"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { connectToDatabase } from "@/lib/db";
import Category from "@/modules/products/models/category.model";

export async function createCategory(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    await connectToDatabase();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCategory = new Category({
      name,
      slug,
      description,
      isActive: true,
    });

    await newCategory.save();

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create category:", error);
  }
}

export async function deleteCategory(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    const categoryId = formData.get("categoryId") as string;
    if (!categoryId) return;

    await connectToDatabase();
    await Category.findByIdAndDelete(categoryId);

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete category:", error);
  }
}
