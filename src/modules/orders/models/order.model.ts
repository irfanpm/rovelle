import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  supplierPrice?: number; // Internal supplier cost snapshot
}

export interface IShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  district?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrder extends Document {
  requestKey?: string;
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "supplier_ordered"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded";
  totals: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    codFee?: number;
    total: number;
  };
  couponApplied?: mongoose.Types.ObjectId;
  trackingDetails?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    updatedAt?: Date;
  };
  supplierDetails?: {
    supplierOrderId?: string;
    supplierOrderedAt?: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    requestKey: { type: String, unique: true, sparse: true },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: { type: String },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        supplierPrice: { type: Number, min: 0, select: false }, // Internal cost reference
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      district: { type: String },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "supplier_ordered",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
      index: true,
    },
    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, required: true, min: 0, default: 0 },
      codFee: { type: Number, min: 0, default: 0 },
      shippingFee: { type: Number, required: true, min: 0, default: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    couponApplied: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    trackingDetails: {
      carrier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      updatedAt: { type: Date },
    },
    supplierDetails: {
      supplierOrderId: { type: String },
      supplierOrderedAt: { type: Date },
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize query path for orders lookup
OrderSchema.index({ customer: 1, createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
export { Order };
