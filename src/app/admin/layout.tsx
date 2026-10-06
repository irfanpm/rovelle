import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";
import AdminSidebar from "@/modules/admin/components/AdminSidebar";
export const metadata = { title:"Commerce Admin | Rovelle Jewels",description:"Private Rovelle commerce management",robots:{index:false,follow:false} };
export default async function AdminLayout({children}:{children:React.ReactNode}) {
  const session=await requireAdmin().catch(()=>null);
  if(!session?.user||session.user.role!=="admin")redirect("/login?callbackUrl=/admin");
  return <div className="admin-shell"><AdminSidebar user={session.user}/><main className="admin-main"><div className="admin-topbar"><span>ROVELLE JEWELS <span> / </span> COMMERCE ADMIN</span><span><ShieldCheck size={14}/>Private Workspace</span></div>{children}</main></div>;
}

