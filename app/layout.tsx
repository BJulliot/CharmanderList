import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salamèche Tracker — Collection TCG",
  description: "Gestionnaire de collection Salamèche Pokémon TCG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
