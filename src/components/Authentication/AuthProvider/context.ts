import { createContext } from 'react';
import { User } from '../../../constants/interfaces';

export type AuthUser = (firebase.User & User) | null;

export const AuthUserContext = createContext<AuthUser>(null);
