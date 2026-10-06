import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAnalytics extends Document {
  event: string;
  user?: mongoose.Types.ObjectId;
  sessionId: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  event: {
    type: String,
    required: true,
    index: true, // Speeds up search by event name
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  payload: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Configure TTL (Time-to-Live) index to automatically prune records older than 90 days
// 90 days = 90 * 24 * 60 * 60 = 7,776,000 seconds
AnalyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

export default Analytics;
export { Analytics };
