"use client";
import React from "react";
import { CssBaseline } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  return pathname !== "/login" ? (
    <div className="flex flex-col min-h-screen">
      <CssBaseline />
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 overflow-auto text-gray-900 dark:text-gray-100">
          {children}
        </main>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  ) : (
    children
  );
};

export default Layout;
