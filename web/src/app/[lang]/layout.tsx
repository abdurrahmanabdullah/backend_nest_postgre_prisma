// src/app/[lang]/layout.tsx
import "@/app/globals.css";
import { authOptions } from "@/lib/auth";
import { getMessages } from "@/lib/get-messages";
import { ClientProviders } from "@/providers/ClientProviders";
import { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "KTTravel",
  description:
    "KTTravel is pioneering the future of application development by making full-stack development accessible to everyone.",
  metadataBase: new URL("https://kttravel.com"), // Replace with your domain
  applicationName: "KTTravel",
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/favicon.svg",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "KTTravel",
    "apple-mobile-web-app-status-bar-style": "default",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KTTravel",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "KTTravel",
    title: "KTTravel",
    description:
      "KTTravel is pioneering the future of application development by making full-stack development accessible to everyone.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KTTravel",
    description:
      "KTTravel is pioneering the future of application development by making full-stack development accessible to everyone.",
  },
};

interface RootLayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Await the params to access lang
  const { lang } = await params;

  const messages = await getMessages(lang);
  const session = await getServerSession(authOptions);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>{/* Remove the Script component entirely */}</head>
      <body suppressHydrationWarning>
        {/* Add the client component here */}
        <ClientProviders session={session}>
          <NextIntlClientProvider locale={lang} messages={messages}>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover={false}
              limit={1}
            />
          </NextIntlClientProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
