import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/api';

// Dashboard Query Keys
export const dashboardQueryKeys = {
  adminStats: ['dashboard', 'admin'] as const,
  revenueAnalytics: ['dashboard', 'revenue'] as const,
  operationalMetrics: ['dashboard', 'operations'] as const,
  systemHealth: ['dashboard', 'system-health'] as const,
};

// Dashboard Statistics Hook
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: dashboardQueryKeys.adminStats,
    queryFn: async () => {
      const response = await apiService.getDashboardStats();
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Revenue Analytics Hook
export const useRevenueAnalytics = (period: string = '6months') => {
  return useQuery({
    queryKey: [...dashboardQueryKeys.revenueAnalytics, period],
    queryFn: async () => {
      const response = await apiService.getRevenueAnalytics(period);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Operational Metrics Hook
export const useOperationalMetrics = () => {
  return useQuery({
    queryKey: dashboardQueryKeys.operationalMetrics,
    queryFn: async () => {
      const response = await apiService.getOperationalMetrics();
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes
  });
};

// System Health Hook
export const useSystemHealth = () => {
  return useQuery({
    queryKey: dashboardQueryKeys.systemHealth,
    queryFn: async () => {
      const response = await apiService.getSystemHealth();
      return response;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Combined Dashboard Data Hook
export const useDashboardData = () => {
  const adminStats = useAdminDashboardStats();
  const revenueAnalytics = useRevenueAnalytics();
  const operationalMetrics = useOperationalMetrics();
  const systemHealth = useSystemHealth();

  return {
    adminStats,
    revenueAnalytics, 
    operationalMetrics,
    systemHealth,
    isLoading: adminStats.isLoading || revenueAnalytics.isLoading || operationalMetrics.isLoading || systemHealth.isLoading,
    hasError: adminStats.isError || revenueAnalytics.isError || operationalMetrics.isError || systemHealth.isError,
    error: adminStats.error || revenueAnalytics.error || operationalMetrics.error || systemHealth.error,
  };
};

// Analytics Query Keys
export const analyticsQueryKeys = {
  overview: ['analytics', 'overview'] as const,
  departments: ['analytics', 'departments'] as const,
  appointments: ['analytics', 'appointments'] as const,
  demographics: ['analytics', 'demographics'] as const,
  services: ['analytics', 'services'] as const,
  payments: ['analytics', 'payments'] as const,
  stats: ['analytics', 'stats'] as const,
};

// Analytics Overview Hook
export const useAnalyticsOverview = (period: string = '6months') => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.overview, period],
    queryFn: async () => {
      const response = await apiService.getAnalyticsOverview(period);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Department Analytics Hook  
export const useDepartmentAnalytics = () => {
  return useQuery({
    queryKey: analyticsQueryKeys.departments,
    queryFn: async () => {
      const response = await apiService.getDepartmentAnalytics();
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Appointment Analytics Hook
export const useAppointmentAnalytics = () => {
  return useQuery({
    queryKey: analyticsQueryKeys.appointments,
    queryFn: async () => {
      const response = await apiService.getAppointmentAnalytics();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Patient Demographics Hook
export const usePatientDemographics = () => {
  return useQuery({
    queryKey: analyticsQueryKeys.demographics,
    queryFn: async () => {
      const response = await apiService.getPatientDemographics();
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Top Services Hook
export const useTopServices = () => {
  return useQuery({
    queryKey: analyticsQueryKeys.services,
    queryFn: async () => {
      const response = await apiService.getTopServices();
      return response;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Payment Methods Analytics Hook
export const usePaymentMethodAnalytics = () => {
  return useQuery({
    queryKey: analyticsQueryKeys.payments,
    queryFn: async () => {
      const response = await apiService.getPaymentMethodAnalytics();
      return response;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Analytics Stats Hook
export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: analyticsQueryKeys.stats,
    queryFn: async () => {
      const response = await apiService.getAnalyticsStats();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 