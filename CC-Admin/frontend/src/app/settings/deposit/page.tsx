"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import DepositSettings from "@/components/settings/deposit";

const DepositSetting: React.FC = () => {
  return (
    <ProtectedRoute>
      <DepositSettings />
    </ProtectedRoute>
  );
};

export default DepositSetting;
