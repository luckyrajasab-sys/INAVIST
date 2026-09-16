import React, { createContext, useContext, useState, useEffect } from "react";
import { OFFLINE_DESTINATIONS } from "../data/offlineSamplePacks";

const OfflineVaultContext = createContext(null);

const STORAGE_KEY_PACKS = "yatri_offline_packs";
const STORAGE_KEY_ACTIVE = "yatri_active_offline_trip";
const STORAGE_KEY_SIMULATE = "yatri_simulate_network";

export const OfflineVaultProvider = ({ children }) => {
  // Real browser network status
  const [browserOnline, setBrowserOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // Network Simulation Mode: 'online' | 'limited' | 'offline'
  const [networkMode, setNetworkMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SIMULATE) || "online";
  });

  // Downloaded packs repository (seeded with Kodaikanal as active example pack)
  const [downloadedPacks, setDownloadedPacks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PACKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [OFFLINE_DESTINATIONS[0]];
      }
    }
    // Default pre-cached Kodaikanal pack for seamless instant demonstration
    return [OFFLINE_DESTINATIONS[0]];
  });

  // Currently opened offline trip in Vault
  const [activeTripId, setActiveTripId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) || "kodaikanal-vault";
  });

  // Download Modal & Progress State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadTargetDestination, setDownloadTargetDestination] = useState(null);

  // Download Task Manager state: { isDownloading, progress, currentStep, isPaused, targetId }
  const [downloadTask, setDownloadTask] = useState(null);

  // Online Recovery update notification
  const [hasPendingUpdates, setHasPendingUpdates] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PACKS, JSON.stringify(downloadedPacks));
  }, [downloadedPacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE, activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SIMULATE, networkMode);
  }, [networkMode]);

  // Real Network Listeners
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      setHasPendingUpdates(true);
    };
    const handleOffline = () => {
      setBrowserOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Effective network status considers both hardware state & user-selected simulation
  const isEffectivelyOnline = networkMode === "online" && browserOnline;
  const isEffectivelyOffline = networkMode === "offline" || !browserOnline;
  const isLimitedConnection = networkMode === "limited";

  // Active Offline Pack Object
  const activeOfflinePack =
    downloadedPacks.find((p) => p.id === activeTripId) || downloadedPacks[0] || null;

  // Trigger Apple-inspired Smart Download Modal for any destination
  const openDownloadModalForDestination = (destination) => {
    setDownloadTargetDestination(destination);
    setIsDownloadModalOpen(true);
  };

  // Start animated multi-stage download simulation
  const startDownloadPack = (destination, options = { quality: "standard", customOptions: {} }) => {
    const matchingPack =
      OFFLINE_DESTINATIONS.find(
        (p) =>
          p.name.toLowerCase().includes(destination.name.toLowerCase()) ||
          p.id.includes(destination.id || "")
      ) || {
        ...OFFLINE_DESTINATIONS[0],
        id: `pack-${destination.id || Date.now()}`,
        name: destination.name || "Custom Destination",
        state: destination.state || "India",
        district: destination.district || "District",
        downloadSizeMB: options.quality === "detailed" ? 480 : options.quality === "essential" ? 95 : 245,
        lastCached: "Cached just now"
      };

    const targetPack = {
      ...matchingPack,
      downloadQuality: options.quality,
      downloadedAt: new Date().toISOString(),
      lastUpdated: "Just now"
    };

    // Initialize download task
    setDownloadTask({
      targetPack,
      progress: 0,
      currentStep: "Preparing Destination Guide...",
      isPaused: false,
      completedSteps: []
    });

    let currentProgress = 0;
    const interval = setInterval(() => {
      setDownloadTask((prev) => {
        if (!prev || prev.isPaused) return prev;

        currentProgress += 10;
        let step = "Downloading Destination Guide...";
        const completed = [...prev.completedSteps];

        if (currentProgress >= 25 && !completed.includes("guide")) {
          completed.push("guide");
          step = "Caching Vector Map & POI Coordinates (68%)...";
        }
        if (currentProgress >= 60 && !completed.includes("map")) {
          completed.push("map");
          step = "Saving Itinerary & Offline Food Directory...";
        }
        if (currentProgress >= 85 && !completed.includes("emergency")) {
          completed.push("emergency");
          step = "Finalizing Emergency Guide & Offline Documents...";
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          // Add to downloaded packs
          setDownloadedPacks((packs) => {
            const exists = packs.some((p) => p.id === targetPack.id);
            if (exists) {
              return packs.map((p) => (p.id === targetPack.id ? targetPack : p));
            }
            return [...packs, targetPack];
          });
          setActiveTripId(targetPack.id);
          setTimeout(() => {
            setDownloadTask(null);
            setIsDownloadModalOpen(false);
          }, 1200);

          return {
            ...prev,
            progress: 100,
            currentStep: "Trip Pack Download Complete! ✓",
            completedSteps: ["guide", "map", "places", "emergency", "docs"]
          };
        }

        return {
          ...prev,
          progress: currentProgress,
          currentStep: step,
          completedSteps: completed
        };
      });
    }, 400);
  };

  const pauseDownload = () => {
    setDownloadTask((prev) => (prev ? { ...prev, isPaused: true } : null));
  };

  const resumeDownload = () => {
    setDownloadTask((prev) => (prev ? { ...prev, isPaused: false } : null));
  };

  const cancelDownload = () => {
    setDownloadTask(null);
  };

  const deleteOfflinePack = (packId) => {
    setDownloadedPacks((prev) => {
      const filtered = prev.filter((p) => p.id !== packId);
      if (activeTripId === packId && filtered.length > 0) {
        setActiveTripId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateOfflinePack = (packId) => {
    setDownloadedPacks((prev) =>
      prev.map((p) => (p.id === packId ? { ...p, lastUpdated: "Updated 1 min ago" } : p))
    );
    setHasPendingUpdates(false);
  };

  // Toggle itinerary item checkbox in active offline pack
  const toggleItineraryActivity = (dayNumber, activityId) => {
    if (!activeOfflinePack) return;
    const updatedItinerary = activeOfflinePack.itinerary.map((dayObj) => {
      if (dayObj.day !== dayNumber) return dayObj;
      return {
        ...dayObj,
        activities: dayObj.activities.map((act) =>
          act.id === activityId ? { ...act, checked: !act.checked } : act
        )
      };
    });

    const updatedPack = { ...activeOfflinePack, itinerary: updatedItinerary };
    setDownloadedPacks((prev) =>
      prev.map((p) => (p.id === activeOfflinePack.id ? updatedPack : p))
    );
  };

  // Add custom offline note to itinerary activity
  const addActivityNote = (dayNumber, activityId, newNote) => {
    if (!activeOfflinePack) return;
    const updatedItinerary = activeOfflinePack.itinerary.map((dayObj) => {
      if (dayObj.day !== dayNumber) return dayObj;
      return {
        ...dayObj,
        activities: dayObj.activities.map((act) =>
          act.id === activityId ? { ...act, note: newNote } : act
        )
      };
    });

    const updatedPack = { ...activeOfflinePack, itinerary: updatedItinerary };
    setDownloadedPacks((prev) =>
      prev.map((p) => (p.id === activeOfflinePack.id ? updatedPack : p))
    );
  };

  // Total offline storage utilized calculation
  const totalStorageMB = downloadedPacks.reduce(
    (acc, p) => acc + (p.downloadSizeMB || 200),
    0
  );

  return (
    <OfflineVaultContext.Provider
      value={{
        isOnline: isEffectivelyOnline,
        isOffline: isEffectivelyOffline,
        isLimited: isLimitedConnection,
        networkMode,
        setNetworkMode,
        downloadedPacks,
        activeTripId,
        setActiveTripId,
        activeOfflinePack,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        downloadTargetDestination,
        openDownloadModalForDestination,
        startDownloadPack,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        downloadTask,
        deleteOfflinePack,
        updateOfflinePack,
        toggleItineraryActivity,
        addActivityNote,
        totalStorageMB,
        hasPendingUpdates,
        setHasPendingUpdates
      }}
    >
      {children}
    </OfflineVaultContext.Provider>
  );
};

export const useOfflineVault = () => {
  const context = useContext(OfflineVaultContext);
  if (!context) {
    throw new Error("useOfflineVault must be used within an OfflineVaultProvider");
  }
  return context;
};
