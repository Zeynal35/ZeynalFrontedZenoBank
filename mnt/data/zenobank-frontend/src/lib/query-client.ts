import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Request failed';
        toast.error(message);
      },
    },
  },
});
