import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charan Mobiles",
  description: "Smart Choice. Smart Life."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
