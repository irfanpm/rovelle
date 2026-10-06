import Link from "next/link";
import { auth } from "@/lib/auth";
import { notFound,redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Order from "@/modules/orders/models/order.model";
import { money } from "@/lib/brand";
export const dynamic="force-dynamic";
export default async function OrderPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const session=await auth();if(!session?.user?.id)redirect("/login?callbackUrl="+encodeURIComponent("/orders/"+id));if(!/^[a-f0-9]{24}$/i.test(id))notFound();
 await connectToDatabase();const o=await Order.findOne({_id:id,customer:session.user.id}).select("orderNumber items.title items.price items.quantity items.variant shippingAddress totals orderStatus paymentStatus paymentMethod trackingDetails.trackingNumber");
 if(!o)notFound();const status=o.orderStatus==="supplier_ordered"?"Processing":o.orderStatus;
 return <section className="wrap section policy"><span className="eyebrow">THANK YOU FOR SHOPPING WITH ROVELLE</span><h1>Order Received</h1><p className="eyebrow">Order #{o.orderNumber}</p><p>Your order has been received. You can return here for updates.</p><div className="panel"><h2>Order Status: {status}</h2><p>Payment: {o.paymentStatus} · {o.paymentMethod==="COD"?"Cash on delivery":"Online"}</p>{o.items.map((i,n)=><div className="bag-row" key={n}><span>{i.title} {i.variant} × {i.quantity}</span><strong>{money(i.price*i.quantity)}</strong></div>)}<div className="totals"><div><span>Shipping</span><span>{money(o.totals.shippingFee)}</span></div><div><span>COD fee</span><span>{money(o.totals.codFee||0)}</span></div><div><span>Discount</span><span>{money(o.totals.discount)}</span></div><div><strong>Total</strong><strong>{money(o.totals.total)}</strong></div></div><h2>Delivery address</h2><p>{o.shippingAddress.name}<br/>{o.shippingAddress.addressLine1}<br/>{o.shippingAddress.addressLine2}<br/>{o.shippingAddress.city}, {o.shippingAddress.district}, {o.shippingAddress.state} {o.shippingAddress.postalCode}<br/>India</p>{o.trackingDetails?.trackingNumber&&<p>Tracking number: {o.trackingDetails.trackingNumber}</p>}</div><p><Link className="text-link" href="/support">Get help with this order →</Link></p><Link className="primary" href="/products">Continue shopping</Link></section>;
}

