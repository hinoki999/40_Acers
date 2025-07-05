import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    // This prevents multiple requests
    networkMode: "always"
  });

  // If we get a 401, that means we're not authenticated, not loading
  const is401Error = error && (error as any).status === 401;
  
  return {
    user: is401Error ? null : user,
    isLoading: isLoading && !is401Error,
    isAuthenticated: !!user && !is401Error,
  };
}
