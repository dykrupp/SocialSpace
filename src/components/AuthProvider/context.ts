import { createContext } from 'react';
import { AuthUser } from '../../customExports/types';

export const AuthUserContext = createContext<AuthUser>(null);
