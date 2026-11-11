import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MenorPreço | Compare. Economize. Escolha.",
  description: "Encontre ofertas, compare preços e descubra onde seu dinheiro vale mais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
