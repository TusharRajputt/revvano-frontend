import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: settingsService.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes — this rarely changes
  });
}
