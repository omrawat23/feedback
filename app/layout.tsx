import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/providers";
import AuthProvider from "./providers"
import { getSession } from "@/auth"
import { bric } from "@/utils/font";
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header";
import FeedbacifyWidget from '@/components/feedback';


export const metadata: Metadata = {
  title: "Feedbackify",
  description: "Easily integrate Feedbackify and start collecting feedbacks today.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bric} antialiased`}
      >
        <Providers>
        <AuthProvider session={session}>
            <Header />
            <main>{children}
            <FeedbacifyWidget projectId="4" />
            </main>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
