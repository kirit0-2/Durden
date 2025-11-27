import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dual-Persona Chat",
  description: "A mobile-first dual-persona chat application.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground antialiased")}>
        {children}
      </body>
    </html>
  );
}
