
"use client"
import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'
import { Button } from './ui/button'
import { useAtom } from 'jotai'
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
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { FaGoogle } from "react-icons/fa"
import { auth } from '../firebase'
import { userAtom, loadingAtom } from '@/store/userAtoms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation';
import Link from 'next/link'

const Header = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [user] = useAtom(userAtom)
  const [loading] = useAtom(loadingAtom)
  const userId = user?.uid;

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Sign in successful:', result.user)
      setIsDialogOpen(false)
     
    } catch (error) {
      console.error('Error signing in with Google', error)
   
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Successfully signed out!')
    } catch (error) {
      console.error('Error signing out', error)
      toast.error('Failed to sign out. Please try again.')
    }
  }

  const handleProject = () => {
    router.push(`/dashboard?userId=${userId}`);
  }

  return (
    <div className="border-b">
      <MaxWidthWrapper>
        <div className='flex flex-row justify-between items-center m-4'>
          <Link href='/' >
       
          <Image 
            src='/log.svg' 
            alt='Logo'
            width={150}
            height={200}
            className="object-contain"
          />

          </Link>
       
          <div className='flex flex-row gap-4 items-center'>
            <ThemeSwitch />
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Image
                        src={user.photoURL || '/default-avatar.png'}
                        alt="Profile"
                        className="rounded-full"
                        fill
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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

export default Header