import "./globals.css";
import { Inter } from "next/font/google";
import ClientProvider from "../components/ClientProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crazy Cargo",
  description: "Crazy Cargo Admin Site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientProvider>{children}</ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
