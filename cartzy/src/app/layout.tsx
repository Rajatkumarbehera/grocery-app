import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import UserProvider from "@/providers/UserProvider";
import type { Metadata } from "next";
import InitUser from "../InitUser";
import SessionProvider from "../providers/SessionProvider";
import "./globals.css";
import Footer from "@/components/layout/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Home | Cartzy",
  description:
    "Craving food? Order from your favorite restaurants with fast delivery via Cartzy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="w-full min-h-screen"
        // className="w-full min-h-screen bg-linear-to-r from-green-100 to-white"
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <UserProvider>
            {/* <Navbar /> */}
            <InitUser />
            <Toaster richColors />
            {children}
            {/* <Footer /> */}
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
