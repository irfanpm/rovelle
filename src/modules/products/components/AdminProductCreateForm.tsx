"use client";
import AdminProductForm from "./AdminProductForm";
export function AdminProductCreateForm({categories}:{categories:{_id:string;name:string}[]}) {return <AdminProductForm categories={categories}/>;}
