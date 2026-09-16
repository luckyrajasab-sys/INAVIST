import React, { useState } from "react";
import {
  Wifi,
  WifiOff,
  Radio,
  RefreshCw,
  FolderDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X
} from "lucide-react";
import { useOfflineVault } from "../../context/OfflineVaultContext";

export const OfflineNetworkBanner = ({ onOpenVault }) => {
  const {
    isOnline,
    isOffline,
    isLimited,
    networkMode,
    setNetworkMode,
    activeOfflinePack,
    hasPendingUpdates,
    updateOfflinePack
  } = useOfflineVault();

  const [isDismissed, setIsDismissed] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);

  const packName = activeOfflinePack ? activeOfflinePack.name : "Trip";

  return (
    <div
      style={{
        position: "sticky",
        top: "60px",
        zIndex: 95,
        width: "100%",
        transition: "all var(--transition-smooth)"
      }}
    >
      {/* 1. Offline Mode Active Notification Banner */}
      {isOffline && !isDismissed && (
        <div
          style={{
            background: "linear-gradient(90deg, #991B1B 0%, #B91C1C 100%)",
            color: "#FFFFFF",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.86rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(153, 27, 27, 0.35)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <WifiOff size={14} />
            </div>
            <span>
              <strong>You are offline</strong> — Your <strong>{packName} Trip Pack</strong> is active with saved maps, itinerary & emergency numbers.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={onOpenVault}
              style={{
                background: "#FFFFFF",
                color: "#991B1B",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "4px 14px",
                fontSize: "0.78rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <FolderDown size={13} />
              <span>Open Vault</span>
            </button>

            {/* Network Sim Quick Toggle */}
            <button
              onClick={() => setNetworkMode("online")}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "var(--radius-full)",
                padding: "4px 10px",
                fontSize: "0.74rem",
                cursor: "pointer"
              }}
              title="Click to simulate Online connection"
            >
              Simulate Online 📶
            </button>
          </div>
        </div>
      )}

      {/* 2. Limited Connectivity Banner */}
      {isLimited && (
        <div
          style={{
            background: "linear-gradient(90deg, #D97706 0%, #B45309 100%)",
            color: "#FFFFFF",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            fontWeight: 600
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={16} />
            <span>Limited 2G/3G Connection — Serving low-bandwidth cached assets for {packName}.</span>
          </div>

          <button
            onClick={() => setNetworkMode("online")}
            style={{
              background: "#FFFFFF",
              color: "#B45309",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Switch to Online
          </button>
        </div>
      )}

      {/* 3. Online Return & Update Recommendation Banner */}
      {isOnline && hasPendingUpdates && (
        <div
          style={{
            background: "linear-gradient(90deg, #15803D 0%, #166534 100%)",
            color: "#FFFFFF",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            fontWeight: 600,
            animation: "fadeIn 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={16} />
            <span>You're back online! Would you like to update your {packName} offline pack with latest weather and timings?</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => {
                if (activeOfflinePack) updateOfflinePack(activeOfflinePack.id);
              }}
              style={{
                background: "#FFFFFF",
                color: "#166534",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "4px 14px",
                fontSize: "0.78rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <RefreshCw size={13} />
              <span>Update Trip Info</span>
            </button>

            <button
              onClick={() => setHasPendingUpdates(false)}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
