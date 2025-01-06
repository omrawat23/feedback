import type { Metadata } from "next";
import { siteConfig } from "@/config/site"
import "./globals.css";
import { Providers } from "../providers/providers";
import AuthProvider from "./providers";
import { getSession } from "@/auth";
import { bric } from "@/utils/font";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import dynamic from 'next/dynamic';

// Dynamically import the widget with no SSR
const FeedbackWidget = dynamic(
  () => import('@/components/FeedbackWidget'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  // icons: {
  //   icon: "/icon.svg",
  // },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bric} antialiased`}>
        <Providers>
          <AuthProvider session={session}>
            <Header />
            <main>{children}</main>
            <Toaster />
            <FeedbackWidget projectId={21} />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}