import React from "react";
import { Sparkles, Eye, Users, CheckCircle, AlertCircle, Clock } from "lucide-react";

export const ViewpointBadge = ({ status }) => {
  const normalized = (status || "").toUpperCase();
  if (normalized === "OPEN") {
    return (
      <span className="badge badge-open">
        <CheckCircle size={12} /> OPEN
      </span>
    );
  }
  if (normalized === "CLOSED") {
    return (
      <span className="badge badge-closed">
        <AlertCircle size={12} /> CLOSED
      </span>
    );
  }
  if (normalized === "BUSY") {
    return (
      <span className="badge badge-busy">
        <Clock size={12} /> BUSY
      </span>
    );
  }
  return (
    <span className="badge badge-open" style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
      <Eye size={12} /> LOW CROWD
    </span>
  );
};

export const CrowdBadge = ({ level }) => {
  const norm = (level || "").toLowerCase();
  if (norm.includes("very high")) {
    return (
      <span className="badge badge-crowd-very-high">
        <Users size={12} /> Very High Crowd
      </span>
    );
  }
  if (norm.includes("high")) {
    return (
      <span className="badge badge-crowd-high">
        <Users size={12} /> High Crowd
      </span>
    );
  }
  if (norm.includes("moderate") || norm.includes("medium")) {
    return (
      <span className="badge badge-crowd-mod">
        <Users size={12} /> Moderate Crowd
      </span>
    );
  }
  return (
    <span className="badge badge-crowd-low">
      <Users size={12} /> Low Crowd
    </span>
  );
};

export const HiddenGemBadge = () => (
  <span className="badge badge-gem">
    <Sparkles size={12} /> Hidden Gem
  </span>
);
