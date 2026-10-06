import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  paymentMethod: "COD" | "RAZORPAY";
  paymentGateway?: string;
  transactionId?: string; // Razorpay payment ID or order ID
  signature?: string; // Razorpay signature verification
  amount: number;
  currency: string;
  status: "pending" | "captured" | "failed" | "refunded";
  rawDetails?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },
    paymentGateway: {
      type: String,
      default: "razorpay",
    },
    transactionId: {
      type: String,
      index: true,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "captured", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    rawDetails: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
export { Payment };
