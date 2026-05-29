import type { Metadata } from "next";
import "./globals.css";
import { AuthLayout } from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "Hospital Casa de Saude Santana - Dashboard",
  description: "Painel de gestao do bot de triagem WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50" suppressHydrationWarning>
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
