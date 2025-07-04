import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  });

  // If we get a 401, that means we're not authenticated, not loading
  const is401Error = error && (error as any).status === 401;
  const actuallyLoading = isLoading && !is401Error;

  return {
    user: is401Error ? null : user,
    isLoading: actuallyLoading,
    isAuthenticated: !!user && !is401Error,
  };
}
