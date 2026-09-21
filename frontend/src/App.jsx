import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { PlannerProvider } from "./context/PlannerContext";
import { OfflineVaultProvider } from "./context/OfflineVaultContext";
import { RewardsProvider } from "./context/RewardsContext";

import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { MobileDock } from "./components/common/MobileDock";
import { Toast } from "./components/common/Toast";
import { AuthModal } from "./components/auth/AuthModal";
import { IndianHeritageBackdrop } from "./components/common/IndianHeritageBackdrop";
import { OfflineNetworkBanner } from "./components/vault/OfflineNetworkBanner";
import { OfflineDownloadModal } from "./components/vault/OfflineDownloadModal";

import { HeroSection } from "./components/home/HeroSection";
import { DestinationExplorer } from "./components/explorer/DestinationExplorer";
import { DestinationDetailModal } from "./components/explorer/DestinationDetailModal";
import { HotelSearch } from "./components/hotels/HotelSearch";
import { TransportHub } from "./components/transport/TransportHub";
import { CabBookingPage } from "./components/cabs/CabBookingPage";
import { SmartPlanner } from "./components/planner/SmartPlanner";
import { RewardsDashboard } from "./components/rewards/RewardsDashboard";
import { BookingHistoryView } from "./components/booking/BookingHistoryView";
import { UPIPaymentsPage } from "./components/payments/UPIPaymentsPage";
import { YatriLocalGuide } from "./components/guide/YatriLocalGuide";
import { GPSNavigation } from "./components/maps/GPSNavigation";
import { GovTourismHub } from "./components/govTourism/GovTourismHub";
import { WhereCanITravel } from "./components/budget/WhereCanITravel";
import { MapExplorer } from "./components/map/MapExplorer";
import { TravelCompanions } from "./components/companions/TravelCompanions";
import { TravelPassport } from "./components/history/TravelPassport";
import { SOSCenter } from "./components/safety/SOSCenter";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { UserProfile } from "./components/profile/UserProfile";
import { TravelVaultHub } from "./components/vault/TravelVaultHub";
import { AboutPage } from "./components/common/AboutPage";
import { AppFeedbackView } from "./components/feedback/AppFeedbackView";
import { PageBackButton } from "./components/common/PageBackButton";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

const AppContent = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [tabHistory, setTabHistory] = useState(["home"]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [plannerDestination, setPlannerDestination] = useState(null);
  const [activeBackdropImg, setActiveBackdropImg] = useState(null);

  const [hiddenGemsParams, setHiddenGemsParams] = useState(null);
  const [cabBookingParams, setCabBookingParams] = useState(null);

  // Global browser back handling
  React.useEffect(() => {
    const onPopState = () => {
      if (tabHistory.length > 1) {
        handleGoBack();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [tabHistory]);

  const handleSelectDestination = (dest) => {
    setSelectedDestination(dest);
    if (dest?.images?.[0]) {
      setActiveBackdropImg(dest.images[0]);
    }
  };

  const handleTabChange = (tab, params = null) => {
    if (params) {
      setHiddenGemsParams(params);
    } else if (tab !== "hiddenGems") {
      setHiddenGemsParams(null);
    }
    if (tab !== activeTab) {
      setTabHistory((prev) => [...prev, tab]);
      window.history.pushState({ tab }, "");
    }
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    setActiveBackdropImg(null); // Reset to section default unless customized
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // Pop current active tab
      const previousTab = newHistory[newHistory.length - 1] || "home";
      setTabHistory(newHistory);
      setActiveTab(previousTab);
    } else {
      setActiveTab("home");
      setTabHistory(["home"]);
    }
    setIsMobileSidebarOpen(false);
    setActiveBackdropImg(null);
  };

  const handlePlanTripForDestination = (dest) => {
    setPlannerDestination(dest);
    handleTabChange("planner");
    if (dest?.images?.[0]) {
      setActiveBackdropImg(dest.images[0]);
    }
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarCollapsed((prev) => !prev);
    } else {
      setIsMobileSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Dynamic Page-Aware Indian Nature & Heritage Backdrop */}
      <IndianHeritageBackdrop activeTab={activeTab} customBackdropImg={activeBackdropImg} />

      {/* Full-Width Extended Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onGoBack={handleGoBack}
        canGoBack={tabHistory.length > 1 || activeTab !== "home"}
        onOpenSOS={() => handleTabChange("safety")}
        onSearchClick={() => handleTabChange("explore")}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Global Offline Network Status Banner */}
      <OfflineNetworkBanner onOpenVault={() => handleTabChange("vault")} />

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Desktop & Mobile Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className={`main-content ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          {/* Universal Sticky Last-Page Back Button Banner */}
          <PageBackButton
            activeTab={activeTab}
            tabHistory={tabHistory}
            onGoBack={handleGoBack}
            onGoHome={() => handleTabChange("home")}
          />

          <main style={{ flex: 1 }}>
          {activeTab === "home" && (
            <HeroSection
              onNavigateTab={(tab, params) => handleTabChange(tab, params)}
              onSelectDestination={handleSelectDestination}
              onStartPlan={() => handleTabChange("planner")}
            />
          )}

          {activeTab === "vault" && (
            <TravelVaultHub />
          )}

          {activeTab === "explore" && (
            <DestinationExplorer
              onSelectDestination={handleSelectDestination}
              onPlanTrip={handlePlanTripForDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === "hotels" && (
            <HotelSearch
              onSelectDestination={handleSelectDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "transport" && (
            <TransportHub
              initialDestination={plannerDestination || selectedDestination}
              onSelectDestination={handleSelectDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "cabs" && (
            <CabBookingPage
              initialFromCity={cabBookingParams?.from || ""}
              initialToCity={cabBookingParams?.to || (plannerDestination?.name || "")}
              onNavigateTransport={() => handleTabChange("transport")}
            />
          )}

          {activeTab === "planner" && (
            <SmartPlanner
              preselectedDestination={plannerDestination}
              onSelectDestination={handleSelectDestination}
              onOpenVault={() => handleTabChange("vault")}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
              onBookCab={(startCity, destName) => {
                setCabBookingParams({ from: startCity, to: destName });
                handleTabChange("cabs");
              }}
            />
          )}

          {activeTab === "rewards" && (
            <RewardsDashboard
              onNavigateTab={(tab) => handleTabChange(tab)}
            />
          )}

          {activeTab === "booking-history" && (
            <BookingHistoryView
              onSelectDestination={handleSelectDestination}
              onStartNewSearch={() => handleTabChange("home")}
            />
          )}

          {activeTab === "upi-payments" && (
            <UPIPaymentsPage
              onStartSearch={() => handleTabChange("home")}
            />
          )}

          {activeTab === "localGuide" && (
            <YatriLocalGuide
              onSelectDestination={handleSelectDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "gps" && (
            <GPSNavigation />
          )}

          {activeTab === "govTourism" && (
            <GovTourismHub
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "budget" && (
            <WhereCanITravel
              onSelectDestination={handleSelectDestination}
              onPlanTrip={handlePlanTripForDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "map" && (
            <MapExplorer
              onSelectDestination={handleSelectDestination}
              onPlanTrip={handlePlanTripForDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "companions" && (
            <TravelCompanions />
          )}

          {activeTab === "history" && (
            <TravelPassport
              onSelectDestination={handleSelectDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "safety" && (
            <SOSCenter />
          )}

          {activeTab === "admin" && (
            <AdminDashboard />
          )}

          {activeTab === "profile" && (
            <UserProfile
              initialTab="idcard"
              onNavigateTab={setActiveTab}
              onSelectDestination={handleSelectDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "settings" && (
            <UserProfile
              initialTab="settings"
              onNavigateTab={setActiveTab}
              onSelectDestination={handleSelectDestination}
              onBackdropChange={(img) => setActiveBackdropImg(img)}
            />
          )}

          {activeTab === "feedback" && (
            <AppFeedbackView />
          )}

          {activeTab === "about" && (
            <AboutPage
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </main>
        </div>
      </div>

      {/* Mobile Floating Bottom Dock */}
      <MobileDock
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSOS={() => setActiveTab("safety")}
      />

      {/* Global Modals & Notifications */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onPlanTrip={handlePlanTripForDestination}
        onNavigateHotels={() => setActiveTab("hotels")}
        onNavigateTransport={() => setActiveTab("transport")}
      />

      <OfflineDownloadModal />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <PlannerProvider>
              <RewardsProvider>
                <OfflineVaultProvider>
                  <AppContent />
                </OfflineVaultProvider>
              </RewardsProvider>
            </PlannerProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
