"use client";
import { useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
export default function CatalogFilters({children}:{children:React.ReactNode}) {
  const dialog=useRef<HTMLDialogElement>(null);
  return <div className="mobile-filter-control"><button className="secondary" onClick={()=>dialog.current?.showModal()}><SlidersHorizontal size={15}/>Filters</button><dialog className="filter-dialog" ref={dialog} aria-label="Collection filters"><div className="drawer-heading"><h2>Refine Your Collection</h2><button className="icon-button" aria-label="Close filters" onClick={()=>dialog.current?.close()}><X/></button></div>{children}</dialog></div>;
}
