import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/providers";
import UserProvider from "@/providers/UserProvider";
import { bric } from "@/utils/font";
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header";
import FeedbacifyWidget from '@/components/feedback';


export const metadata: Metadata = {
  title: "Feedbackify",
  description: "Easily integrate Feedbackify and start collecting feedbacks today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bric} antialiased`}
      >
        <Providers>
          <UserProvider>
            <Header />
            <main>{children}
            <FeedbacifyWidget projectId="4" />
            </main>
            <Toaster />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
