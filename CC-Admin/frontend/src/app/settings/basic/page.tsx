"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import BasicSetting from "@/components/settings/basic";

const BasicSettingPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <BasicSetting />
    </ProtectedRoute>
  );
};

export default BasicSettingPage;
