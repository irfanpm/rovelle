import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISpecification {
  name: string;
  value: string;
}

export interface IProduct extends Document {
  publicationApproved: boolean;
  featured: boolean;
  newArrival: boolean;
  merchandisingRank: number;
  shortDescription: string;
  seoTitle: string;
  metaDescription: string;
  searchKeywords: string[];
  variants: string[];
  ageGroups: string[];
  included: string;
  safety: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number; // Hidden from general client queries
  images: string[];
  category: mongoose.Types.ObjectId;
  status: "draft" | "active";
  specifications: ISpecification[];
  features: string[];
  supplierUrl?: string; // Hidden from general client queries
  supplierPrice?: number; // Hidden from general client queries
  averageRating: number;
  numReviews: number;
  isCodAvailable: boolean;
  stockStatus: "in_stock" | "out_of_stock";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    merchandisingRank: { type: Number, default: 100 },
    shortDescription: String,
    seoTitle: String,
    metaDescription: String,
    searchKeywords: { type: [String], default: [] },
    publicationApproved: { type: Boolean, default: false },
    variants: { type: [String], default: [] },
    ageGroups: { type: [String], default: [] },
    included: { type: String, default: "" },
    safety: { type: String, default: "" },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
      select: false, // Prevents leakage in standard queries
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
      index: true,
    },
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    features: {
      type: [String],
      default: [],
    },
    supplierUrl: {
      type: String,
      select: false, // Internal supplier link
    },
    supplierPrice: {
      type: Number,
      min: 0,
      select: false, // Internal cost calculation
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isCodAvailable: {
      type: Boolean,
      default: true,
    },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock"],
      default: "in_stock",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to speed up category filtering for active products
ProductSchema.index({ category: 1, status: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
export { Product };
