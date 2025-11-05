import "./globals.css";
import type { Metadata } from "next";
import QueryProvider from "../components/QueryProvider";

export const metadata: Metadata = {
  title: "SimpleMoney",
  description: "Aplicativo financeiro educativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#F4F4F5] text-slate-900 min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
