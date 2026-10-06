import Link from "next/link";
import { UserRound, ShoppingBag, Heart, LogOut, LayoutDashboard } from "lucide-react";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/modules/auth/actions/logout";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Order from "@/modules/orders/models/order.model";
import { money } from "@/lib/brand";
export const dynamic="force-dynamic";
export default async function Account(){
  const session=await auth();if(!session?.user?.id)redirect("/login?callbackUrl=/account");
  await connectToDatabase();
  const orders=await Order.find({customer:session.user.id}).select("orderNumber totals.total createdAt items.quantity orderStatus paymentStatus paymentMethod").sort({createdAt:-1}).limit(50);
  return <section className="wrap section"><span className="eyebrow">YOUR ROVELLE ACCOUNT</span><h1>Hello, {session.user.name||"there"}.</h1><div className="account-layout"><nav className="account-nav" aria-label="Account navigation"><Link href="/account" aria-current="page"><LayoutDashboard/>My Account</Link><Link href="#orders"><ShoppingBag/>My Orders</Link><Link href="/wishlist"><Heart/>Wishlist</Link><form action={logoutAction}><button><LogOut/>Sign Out</button></form></nav><div><div className="panel"><h2 style={{fontSize:26}}>Your Account Details</h2><p className="small"><UserRound size={15} style={{display:"inline",marginRight:8}}/>{session.user.name}<br/>{session.user.email}</p>{session.user.role==="admin"&&<Link className="text-link" href="/admin">Open Rovelle Admin →</Link>}</div><div id="orders" style={{marginTop:35}}><div className="section-title"><h2 style={{fontSize:29}}>My Orders</h2><span className="small muted">Most recent {orders.length>0?orders.length:""} orders</span></div>{orders.length?orders.map(o=><div key={String(o._id)} className="order-card"><div><h3>Order #{o.orderNumber}</h3><p>Placed on {o.createdAt.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"})} · {o.items.reduce((n,i)=>n+i.quantity,0)} items</p><div className="order-meta"><span className="badge">{o.orderStatus==="supplier_ordered"?"Processing":o.orderStatus}</span><span>{o.paymentMethod==="COD"?"Cash on Delivery":o.paymentMethod} · {o.paymentStatus}</span><strong>{money(o.totals.total)}</strong></div></div><Link className="primary" href={"/orders/"+o._id}>View Details →</Link></div>):<div className="panel empty-state"><span><ShoppingBag size={35} strokeWidth={1}/></span><h3>Your Story Starts Here.</h3><p>Your orders will appear here as soon as you find a favourite.</p><Link className="primary" href="/products">Explore the Collection</Link></div>}</div></div></div></section>;
}
