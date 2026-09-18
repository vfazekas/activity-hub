import type { Metadata } from "next";

import "../globals.css";

import { AppLayout } from "@/components/layout/app-layout";

export const metadata: Metadata = {
  title: "Gerenciador",
  description: "Gerenciador de atividades e projetos",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
