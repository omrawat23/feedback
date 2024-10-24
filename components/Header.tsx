'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"
import { useTheme } from 'next-themes'
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
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

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
          <Link href='/'>
            <Image 
              src={mounted && theme === 'light' ? '/log.svg' : '/lodoo.svg'}
              alt={mounted && theme === 'light' ? 'Light Logo' : 'Dark Logo'}
              width={150}
              height={200}
              className="object-contain"
            />
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