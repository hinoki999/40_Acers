import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: 1,
    staleTime: Infinity, // Never refetch automatically
    gcTime: Infinity, // Keep in cache forever
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  });

  return {
    user,
    isLoading: isLoading && !isError,
    isAuthenticated: !!user && !isError,
  };
}
