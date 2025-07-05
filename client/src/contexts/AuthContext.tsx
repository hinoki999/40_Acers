import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthState {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

let authPromise: Promise<any> | null = null;
let authCache: AuthState | null = null;

async function fetchAuthState(): Promise<AuthState> {
  if (authPromise) return authPromise;
  
  if (authCache) return authCache;
  
  authPromise = fetch('/api/auth/user', { credentials: 'include' })
    .then(async (res) => {
      if (res.ok) {
        const user = await res.json();
        authCache = {
          user,
          isLoading: false,
          isAuthenticated: true,
        };
      } else {
        authCache = {
          user: null,
          isLoading: false,
          isAuthenticated: false,
        };
      }
      return authCache;
    })
    .catch(() => {
      authCache = {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };
      return authCache;
    });
    
  return authPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (authCache) {
      setAuthState(authCache);
    } else {
      fetchAuthState().then(setAuthState);
    }
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}