'use client'

import React from 'react'
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useSession, signIn } from "next-auth/react"

import AnimatedShinyText from "@/components/ui/animated-shiny-text"
import { Button } from "@/components/ui/button"
import { BorderBeam } from "@/components/ui/border-beam"

export default function HeroSection() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  const handleDashboard = () => {
    if (session?.user) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-background text-foreground text-center">
      {/* Introduction Section */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 mb-8 text-xs sm:text-sm font-medium text-muted-foreground bg-muted rounded-full">
          <AnimatedShinyText className="flex items-center">
            <span>✨ Introducing Feedbackify</span>
            <ArrowRightIcon className="ml-1 h-3 w-3 transition-transform duration-300 ease-in-out" />
          </AnimatedShinyText>
        </div>

        <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Collect your feedbacks seamlessly
        </h1>

        <p className="mb-10 text-lg sm:text-xl text-muted-foreground">
          Easily integrate Feedbackify and start collecting feedbacks today.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          {session?.user ? (
            <>
              <Button onClick={handleDashboard} size="lg" className="w-full sm:w-auto">
                Dashboard
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/home">Learn more →</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={handleSignIn} className="w-full sm:w-auto">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/learn-more">Learn more →</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Divider Section */}
      <div className="mt-16 w-full max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-card mt-8 md:shadow-xl">
          <div className="bg-muted rounded-lg shadow-lg overflow-hidden w-full max-w-[890px] mx-auto">
            <div className="flex items-center justify-start p-2 bg-background/80 backdrop-blur-sm">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <video 
              src="/feedfy.mp4" 
              className="w-full h-auto" 
              autoPlay 
              loop 
              muted 
              controls 
            />
            <BorderBeam size={650} duration={10} delay={9} />
          </div>
        </div>
      </div>
    </div>
  )
}