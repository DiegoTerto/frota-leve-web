
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frota Leve Admin",
  description: "Gerencie sua frota levemente",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body >
        <AuthProvider className={`${inter.className} w-full h-screen`}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
