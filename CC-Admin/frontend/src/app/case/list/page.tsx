"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import CaseList from "@/components/case/list";

const CaseListPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <CaseList />
    </ProtectedRoute>
  );
};

export default CaseListPage;
