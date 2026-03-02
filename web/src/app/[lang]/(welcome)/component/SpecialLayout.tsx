import "@/app/globals.css";
import { authOptions } from "@/lib/auth";
import { getMessages } from "@/lib/get-messages";
import { ClientProviders } from "@/providers/ClientProviders";
import { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import Footer from "@/components/Footer/Footer"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#654321", // Unique theme color for this page
};

export const metadata: Metadata = {
  title: "Special Page - KTTravel",
  description: "This is a special page with a unique layout on KTTravel.",
  metadataBase: new URL("https://kttravel.com"),
  applicationName: "KTTravel",
  icons: {
    icon: [{ url: "/favicon/favicon.ico" }],
  },
  twitter: {
    card: "summary",
    title: "Special Page - KTTravel",
    description: "Check out this special page on KTTravel.",
  },
};

interface SpecialLayoutProps {
  children: ReactNode;
}

export default async function SpecialLayout({ children }: SpecialLayoutProps) {
  return (
    <div
      className="sticky top-0 z-50 text-white "
      // style={{
      //   background: `
      //         radial-gradient(circle at bottom left, rgba(0, 196, 255, 0.4), transparent 40%),
      //         radial-gradient(circle at top right, rgba(0, 255, 200, 0.3), transparent 50%),
      //         radial-gradient(circle at top right, #2C2B58, #13132F, #0A0A23)`,
      // }}
    >
      <div className="flex flex-col w-full  mx-auto">{children}</div>
      <Footer />
    </div>
  );
}
