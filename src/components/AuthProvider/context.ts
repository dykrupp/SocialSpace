import { createContext } from 'react';

export type AuthUser = firebase.User | null;

export const AuthUserContext = createContext<AuthUser>(null);
