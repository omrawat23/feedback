
'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { auth } from '@/firebase';
import { userAtom, loadingAtom, User } from '@/store/userAtoms';
import { onAuthStateChanged } from 'firebase/auth';

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [, setUser] = useAtom(userAtom);
  const [, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      
      if (user) {
        const userData: User = {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || ''
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
};

export default UserProvider;