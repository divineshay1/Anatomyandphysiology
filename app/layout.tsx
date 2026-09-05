import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "A&P Quest", description: "A playful Anatomy & Physiology I study adventure" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
