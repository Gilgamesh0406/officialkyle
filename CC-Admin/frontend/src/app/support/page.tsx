"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import SupportPage from "@/components/support";

const Support: React.FC = () => {
  return (
    <ProtectedRoute>
      <SupportPage />
    </ProtectedRoute>
  );
};

export default Support;
