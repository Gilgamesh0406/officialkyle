"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import BlockSkins from "@/components/settings/blockSkin";

const BlockSkin: React.FC = () => {
  return (
    <ProtectedRoute>
      <BlockSkins />
    </ProtectedRoute>
  );
};

export default BlockSkin;
