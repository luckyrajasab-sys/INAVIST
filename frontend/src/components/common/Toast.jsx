import React from "react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";

export const Toast = () => {
  const { toast } = usePlanner();

  if (!toast) return null;

  const getIcon = () => {
    if (toast.type === "error") return <AlertTriangle size={18} color="#ef4444" />;
    if (toast.type === "info") return <Info size={18} color="#0ea5e9" />;
    return <CheckCircle2 size={18} color="#10b981" />;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "85px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "var(--bg-glass-strong)",
        backdropFilter: "var(--blur-strong)",
        WebkitBackdropFilter: "var(--blur-strong)",
        color: "var(--text-primary)",
        padding: "12px 24px",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--border-glass)",
        boxShadow: "var(--shadow-xl)",
        fontSize: "0.92rem",
        fontWeight: 600,
        animation: "fadeIn 0.25s ease-out"
      }}
    >
      {getIcon()}
      <span>{toast.message}</span>
    </div>
  );
};
