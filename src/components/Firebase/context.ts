import { createContext } from 'react';
import Firebase from '.';

export const FirebaseContext = createContext<Firebase | null>(null);
