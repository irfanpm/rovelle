"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/modules/products/actions/admin-products";
import { useToast } from "@/modules/shared/components/Toast";

interface AdminProductDeleteButtonProps {
  productId: string;
  productTitle: string;
}

export function AdminProductDeleteButton({
  productId,
  productTitle,
}: AdminProductDeleteButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    setIsDeleting(true);
    const formData = new FormData();
    formData.append("productId", productId);

    try {
      await deleteProduct(formData);
      toast.success(`"${productTitle}" deleted successfully!`);
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleDelete} className="inline-block">
      <button
        type="submit"
        disabled={isDeleting}
        title="Delete Product"
        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </form>
  );
}
