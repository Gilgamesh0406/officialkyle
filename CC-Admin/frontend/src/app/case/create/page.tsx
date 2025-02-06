"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import CaseBuilder from "@/components/case/creator";

const CaseCreator: React.FC = () => {
  return (
    <ProtectedRoute>
      <CaseBuilder />
    </ProtectedRoute>
  );
};

export default CaseCreator;
