import mongoose, { Document, Model, Schema } from "mongoose";

export interface IHomepageBanner {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

export interface ISettings extends Document {
  key: string; // Enforced "global_settings" value to maintain single record
  checkoutEnabled: boolean;
  minimumContributionMargin: number;
  codFee: number;
  businessName: string;
  businessAddress: string;
  shippingPolicy: string;
  returnsPolicy: string;
  serviceablePincodes: string[];
  storeName: string;
  storeEmail: string;
  supportPhone: string;
  currency: string;
  shippingFee: number;
  isCodEnabled: boolean;
  homepageBanners: IHomepageBanner[];
  announcementBar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global_settings",
    },
    minimumContributionMargin: { type: Number, min: 0, max: 100, default: 20 },
    checkoutEnabled: { type: Boolean, default: false },
    codFee: { type: Number, min: 0, default: 0 },
    businessName: { type: String, default: "" },
    businessAddress: { type: String, default: "" },
    shippingPolicy: { type: String, default: "" },
    returnsPolicy: { type: String, default: "" },
    serviceablePincodes: { type: [String], default: [] },
    storeName: {
      type: String,
      required: true,
      default: "Rovelle Jewels",
    },
    storeEmail: {
      type: String,
      required: true,
      default: "",
    },
    supportPhone: {
      type: String,
      required: true,
      default: "",
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isCodEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    homepageBanners: [
      {
        imageUrl: { type: String, required: true },
        title: { type: String },
        subtitle: { type: String },
        linkUrl: { type: String },
      },
    ],
    announcementBar: {
      type: String,
      default: "A little elegance. Every day.",
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
export { Settings };
