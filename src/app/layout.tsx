import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/modules/shared/components/Toast";
export const metadata: Metadata = { title: {default:"Rovelle Jewels — Jewellery That Feels Like You",template:"%s | Rovelle Jewels"}, description:"Discover Rovelle Jewels. Elegant, carefully curated fashion jewellery for everyday moments and special occasions." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en-IN"><body><ToastProvider>{children}</ToastProvider></body></html>; }
