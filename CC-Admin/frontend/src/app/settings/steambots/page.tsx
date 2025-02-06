"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import SteamBots from "@/components/settings/steamBot";

const SteamBot: React.FC = () => {
  return (
    <ProtectedRoute>
      <SteamBots />
    </ProtectedRoute>
  );
};

export default SteamBot;
