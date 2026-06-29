import type { Metadata } from "next";
import "./globals.css";
import { initDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "OptiTask Resource Orchestrator",
  description: "Sustainable Resource Allocation and Constraint Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  initDb();  // ← SANS async/await
  
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}