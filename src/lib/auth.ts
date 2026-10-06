import type {} from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import User from "@/modules/auth/models/user.model";
import bcrypt from "bcryptjs";

// Extend Auth.js types to recognize custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "customer" | "admin";
    isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "customer" | "admin";
    isVerified?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials");
          }

          if (typeof credentials.email !== "string" || typeof credentials.password !== "string") return null;
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email.toLowerCase().trim(), status: "active" }).select("+password");
          if (!user) return null;
          if (!user.password) {
            return null;
          }
          const match = await bcrypt.compare(credentials.password, user.password);
          if (!match) return null;
          return { id: String(user._id), name: user.name, email: user.email, role: user.role, isVerified: user.isVerified };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "customer" | "admin") || "customer";
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
