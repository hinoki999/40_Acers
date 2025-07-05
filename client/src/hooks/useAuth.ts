import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["/api/auth/user"],
    // Use the global query client settings
    // Don't override anything - let the global settings handle caching
  });

  // If we get a 401, that means we're not authenticated, not loading
  const is401Error = error && (error as any).status === 401;
  
  return {
    user: is401Error ? null : user,
    isLoading: isLoading && !is401Error,
    isAuthenticated: !!user && !is401Error,
  };
}
