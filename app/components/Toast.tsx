"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "neutral";
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 3s
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${
        toast.type === "success"
          ? "bg-[#E3350D]"
          : "bg-gray-700 border border-gray-600"
      }`}
    >
      {toast.text}
    </div>
  );
}

// Hook to manage toasts
let _toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
}
