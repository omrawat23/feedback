
import { atom } from 'jotai';

export interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
}

export const userAtom = atom<User | null>(null);
export const loadingAtom = atom(true);

