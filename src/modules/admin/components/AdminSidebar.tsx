"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { signOut } from "next-auth/react";
import { LayoutDashboard,Package,ShoppingBag,FolderTree,Ticket,Settings,Store,LogOut,Menu,X,Search } from "lucide-react";
import BrandLogo from "@/modules/shared/components/BrandLogo";
interface Props {user:{name?:string|null;email?:string|null;role?:string|null}}
export default function AdminSidebar({user}:Props) {
  const pathname=usePathname(),dialog=useRef<HTMLDialogElement>(null);
  const groups=[{name:"WORKSPACE",items:[{label:"Dashboard",href:"/admin",Icon:LayoutDashboard}]},{name:"CATALOG",items:[{label:"Products",href:"/admin/products",Icon:Package},{label:"Categories",href:"/admin/categories",Icon:FolderTree},{label:"Research & Sourcing",href:"/admin/sourcing",Icon:Search}]},{name:"SALES",items:[{label:"Orders",href:"/admin/orders",Icon:ShoppingBag},{label:"Coupons",href:"/admin/coupons",Icon:Ticket}]},{name:"SETTINGS",items:[{label:"Store Settings",href:"/admin/settings",Icon:Settings}]}];
  const close=()=>dialog.current?.close();
  const content=<><Link className="brand-link" href="/admin" onClick={close} aria-label="Rovelle admin"><BrandLogo compact/></Link><nav aria-label="Admin navigation">{groups.map(g=><div key={g.name}><small className="admin-nav-label">{g.name}</small>{g.items.map(({label,href,Icon})=><Link key={href} href={href} onClick={close} aria-current={(pathname===href||(href!=="/admin"&&pathname.startsWith(href)))?"page":undefined}><Icon/>{label}</Link>)}</div>)}</nav><div className="admin-sidebar-bottom"><Link href="/" target="_blank" rel="noreferrer"><Store size={15}/>View Storefront ↗</Link><div className="admin-user"><div><strong>{user.name||"Administrator"}</strong><small>{user.email||""}</small></div><button className="icon-button" aria-label="Sign out of admin" onClick={()=>signOut({callbackUrl:"/login"})}><LogOut size={17}/></button></div></div></>;
  return <><div className="admin-mobile-bar"><Link href="/admin" aria-label="Rovelle admin"><BrandLogo compact/></Link><button className="icon-button" aria-label="Open admin navigation" onClick={()=>dialog.current?.showModal()}><Menu/></button></div><aside className="admin-sidebar desktop-admin-sidebar">{content}</aside><dialog className="admin-navigation-dialog" ref={dialog} aria-label="Admin navigation"><button className="admin-dialog-close icon-button" aria-label="Close admin navigation" onClick={close}><X/></button><aside className="admin-sidebar">{content}</aside></dialog></>;
}
