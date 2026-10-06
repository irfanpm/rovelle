"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { createProduct,updateProduct } from "@/modules/products/actions/admin-products";
import { useToast } from "@/modules/shared/components/Toast";
export interface EditableProduct {_id:string;title:string;description:string;price:number;compareAtPrice?:number;costPrice?:number;supplierUrl?:string;images:string[];stockStatus?:string;category:string|{_id:string}}
export default function AdminProductForm({product,categories}:{product?:EditableProduct;categories:{_id:string;name:string}[]}) {
  const router=useRouter(),toast=useToast(),[busy,setBusy]=useState(false);
  return <form className="admin-product-form" onSubmit={async e=>{e.preventDefault();setBusy(true);const data=new FormData(e.currentTarget);try{await (product?updateProduct:createProduct)(data);toast.success("Product saved as a draft. Publication review is required.");router.push("/admin/products");router.refresh();}catch{toast.error("Unable to save this product. Please try again.");}finally{setBusy(false);}}}>
    {product&&<input type="hidden" name="id" value={product._id}/>}
    <fieldset><legend>Basic Information</legend><div><label className="full-width">Product Name<input name="title" required maxLength={180} defaultValue={product?.title} placeholder="e.g. Floral Pearl Necklace"/></label><label>Category<select name="category" required defaultValue={typeof product?.category==="string"?product.category:product?.category?._id||""}><option value="">Select a category</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></label><label>Availability<select name="stockStatus" defaultValue={product?.stockStatus||"in_stock"}><option value="in_stock">In Stock</option><option value="out_of_stock">Out of Stock</option></select></label><label className="full-width">Description<textarea name="description" required rows={5} defaultValue={product?.description} placeholder="Describe the product, its materials, confirmed details and care instructions."/></label></div></fieldset>
    <fieldset><legend>Media</legend><div><label className="full-width">Product Image Path<input name="imageUrl" defaultValue={product?.images[0]||""} placeholder="/images/catalog/product-photo.webp"/><span className="small muted">Use an approved image stored under /images/. Additional images and verified variants remain in the sourcing review workflow.</span></label></div></fieldset>
    <fieldset><legend>Pricing</legend><div><label>Selling Price (₹)<input name="price" type="number" step="0.01" min="0.01" required defaultValue={product?.price}/></label><label>Compare-at Price (₹)<input name="compareAtPrice" type="number" step="0.01" min="0" defaultValue={product?.compareAtPrice}/></label></div></fieldset>
    <fieldset><legend>Internal Sourcing · Private</legend><div><label>Cost Price (₹)<input name="costPrice" type="number" step="0.01" min="0" defaultValue={product?.costPrice||0}/></label><label>Supplier Link<input type="url" name="supplierUrl" defaultValue={product?.supplierUrl||""} placeholder="https://"/></label>{!product&&<label>Supplier Price (₹)<input name="supplierPrice" type="number" step="0.01" min="0" defaultValue="0"/></label>}</div><p className="small">Supplier details stay private. Saving creates a draft; review sourcing, imagery and pricing before publication.</p></fieldset>
    <div className="admin-form-actions"><Link className="text-link" href="/admin/products">Cancel</Link><button className="primary" disabled={busy}>{busy?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {busy?"Saving…":"Save Draft"}</button></div>
  </form>;
}
