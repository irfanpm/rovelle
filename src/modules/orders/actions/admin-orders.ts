"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { connectToDatabase } from "@/lib/db";
import Order from "@/modules/orders/models/order.model";

export async function updateOrderStatus(formData: FormData): Promise<void> {
  try {
    const session = await requireAdmin();
    if (!session || !session.user || session.user.role !== "admin") {
      return;
    }

    await connectToDatabase();

    const orderId = formData.get("orderId") as string;
    const orderStatus = formData.get("orderStatus") as string;
    const supplierOrderId = formData.get("supplierOrderId") as string;
    const trackingNumber = formData.get("trackingNumber") as string;

    if (!orderId) {
      return;
    }

    const allowedStatuses = ["pending", "confirmed", "supplier_ordered", "packed", "shipped", "delivered", "cancelled", "returned", "refunded"];
    if (!/^[a-f0-9]{24}$/i.test(orderId) || (orderStatus && !allowedStatuses.includes(orderStatus))) throw new Error("Invalid order update");
    const updateFields: Record<string, string | Date> = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (supplierOrderId) {
      updateFields["supplierDetails.supplierOrderId"] = supplierOrderId;
      updateFields["supplierDetails.supplierOrderedAt"] = new Date();
    }
    if (trackingNumber) {
      updateFields["trackingDetails.trackingNumber"] = trackingNumber;
      updateFields["trackingDetails.updatedAt"] = new Date();
    }

    await Order.findByIdAndUpdate(orderId, updateFields, { runValidators: true });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  } catch (error) {
    console.error("Order fulfillment update error:", error);
    throw new Error("Unable to update this order. Check the details and try again.");
  }
}
