import { createContext } from 'react';
import { User } from '../../../utils/constants/interfaces';

export type AuthUser = (firebase.User & User) | null;

export const AuthUserContext = createContext<AuthUser>(null);
