import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opus Chat",
  description: "Chat with Claude 3 Opus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
