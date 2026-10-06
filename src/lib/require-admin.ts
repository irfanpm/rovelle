import "server-only";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/modules/auth/models/user.model";
export async function requireAdmin() {
 const session = await auth();
 if (!session?.user?.id || session.user.role !== "admin") throw new Error("Unauthorized");
 if (!mongoose.Types.ObjectId.isValid(session.user.id)) throw new Error("Unauthorized");
 await connectToDatabase();
 if (!await User.findOne({ _id: session.user.id, role: "admin", status: "active" })) throw new Error("Unauthorized");
 return session;
}
