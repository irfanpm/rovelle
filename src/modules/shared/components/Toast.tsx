"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const toast = {
    success: (msg: string) => addToast("success", msg),
    error: (msg: string) => addToast("error", msg),
    info: (msg: string) => addToast("info", msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item ${
              t.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900"
                : t.type === "error"
                ? "bg-red-50/95 border-red-200 text-red-900"
                : "bg-[#f4eee5] border-[#e8dfd3] text-[#2d2621]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {t.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              )}
              {t.type === "error" && (
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              )}
              {t.type === "info" && (
                <Info className="h-5 w-5 text-[#9a6b3c] shrink-0" />
              )}
              <p className="text-xs">{t.message}</p>
            </div>

            <button
              aria-label="Dismiss notification"
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-700 p-0.5 rounded-lg shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
