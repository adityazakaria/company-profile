import { createContext, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => authApi.me().then((r) => r.data).catch(() => null),
    staleTime: 5 * 60_000,
    retry: false,
  });

  const value = useMemo(
    () => ({
      admin: data ?? null,
      loading: isLoading,
      login: async (body) => {
        const res = await authApi.login(body);
        qc.setQueryData(['auth-me'], res.data);
        return res.data;
      },
      logout: async () => {
        try { await authApi.logout(); } finally {
          qc.setQueryData(['auth-me'], null);
          qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'auth-me' && String(q.queryKey[0]).startsWith('admin') });
        }
      },
    }),
    [data, isLoading, qc],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
