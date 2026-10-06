"use client";

import React from "react";
import { Printer, Share2 } from "lucide-react";
import { useToast } from "@/modules/shared/components/Toast";

interface PrintInvoiceButtonProps {
  orderNumber: string;
}

export function PrintInvoiceButton({ orderNumber }: PrintInvoiceButtonProps) {
  const toast = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Order tracking link copied to clipboard!");
    } else {
      toast.info(`Order #${orderNumber}`);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={handlePrint}
        className="px-5 py-2.5 rounded-xl bg-white border border-[#E5EAF0] hover:bg-[#e6eeff] text-[#006492] font-bold text-xs flex items-center gap-2 shadow-xs transition-colors uppercase tracking-wider"
      >
        <Printer className="h-4 w-4" />
        Print Official Invoice
      </button>

      <button
        onClick={handleShare}
        className="px-5 py-2.5 rounded-xl bg-white border border-[#E5EAF0] hover:bg-[#e6eeff] text-[#3e4851] font-bold text-xs flex items-center gap-2 shadow-xs transition-colors uppercase tracking-wider"
      >
        <Share2 className="h-4 w-4 text-[#006492]" />
        Share Tracking Link
      </button>
    </div>
  );
}
