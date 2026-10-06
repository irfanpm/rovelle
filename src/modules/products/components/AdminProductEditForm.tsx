"use client";
import AdminProductForm,{type EditableProduct} from "./AdminProductForm";
export function AdminProductEditForm({product,categories}:{product:EditableProduct;categories:{_id:string;name:string}[]}) {return <AdminProductForm product={product} categories={categories}/>;}
