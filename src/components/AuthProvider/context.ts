import { createContext } from 'react';
import { User } from '../ViewComponents/Landing/SignUp/SignUpForm';

export type AuthUser = (firebase.User & User) | null;

export const AuthUserContext = createContext<AuthUser>(null);
