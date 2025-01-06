'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"
import { FaGoogle } from "react-icons/fa"

import MaxWidthWrapper from './MaxWidthWrapper'
import ThemeSwitch from './ThemeSwitch'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { data: session, status } = useSession()
  const [, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const handleProject = () => {
    router.push(`/dashboard?userId=${session?.user?.id}`)
  }

  return (
    <div className="border-b">
      <MaxWidthWrapper>
        <div className='flex flex-row justify-between items-center m-4'>
          <Link href='/' className="flex items-center space-x-2 text-foreground">
           <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <rect width="24" height="24" rx="4" fill="currentColor" />
              <path
                d="M6 6H18V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V6Z"
                className="fill-background dark:fill-primary-foreground"
              />
              <rect x="8" y="8" width="8" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="8" y="11" width="8" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="8" y="14" width="5" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
            <span className="text-lg font-semibold">
              feedbackify
            </span>
          </Link>

          <div className='flex flex-row gap-4 items-center'>
            <ThemeSwitch />
            {status !== 'loading' && (
              session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Image
                        src={session.user?.image || '/default-avatar.png'}
                        alt="Profile"
                        className="rounded-full"
                        fill
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleProject}
                      className="cursor-pointer"
                    >
                     Projects
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600 cursor-pointer"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="transition duration-300 ease-in-out hover:scale-105"
                    >
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold">Welcome Back</DialogTitle>
                      <DialogDescription>
                        Connect your Google account to access your personalized experience.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <Button
                        onClick={handleSignIn}
                        className="transition duration-300 ease-in-out hover:scale-105"
                      >
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Sign in with Google
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        By connecting, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}