import { CartHydration } from "@/modules/shared/components/CartHydration";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { SessionProvider } from "next-auth/react";
import { getStoreConfig } from "@/lib/store-config";
export default async function CustomerLayout({children}:{children:React.ReactNode}) {
  const config = await getStoreConfig();
  return <SessionProvider><CartHydration/><div className="customer-shell"><a className="skip-link" href="#main-content">Skip to content</a><Navbar codEnabled={config.codEnabled && config.checkoutEnabled}/><main id="main-content" className="customer-main">{children}</main><Footer/></div></SessionProvider>;
}
