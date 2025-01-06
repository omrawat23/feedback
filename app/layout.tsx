import type { Metadata } from "next";
import { siteConfig } from "@/config/site"
import "./globals.css";
import { Providers } from "../providers/providers";
import AuthProvider from "./providers";
import { getSession } from "@/auth";
import { bric } from "@/utils/font";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react"
import FeedbackWidget from "@/components/FeedbackWidget";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
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
            <Analytics />
            <Toaster />
            <FeedbackWidget projectId={21} />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}