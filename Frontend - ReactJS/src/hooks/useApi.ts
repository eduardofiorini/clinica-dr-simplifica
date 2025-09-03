import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiService, 
  Patient, 
  Appointment, 
  MedicalRecord, 
  Invoice, 
  InventoryItem,
  User 
} from '@/services/api';
import { Lead, TestCategory, CreateTestCategoryRequest, CreateTurnaroundTimeRequest } from '@/types';

// Query Keys
export const queryKeys = {
  patients: ['patients'] as const,
  patient: (id: string) => ['patients', id] as const,
  appointments: ['appointments'] as const,
  appointment: (id: string) => ['appointments', id] as const,
  medicalRecords: ['medical-records'] as const,
  medicalRecord: (id: string) => ['medical-records', id] as const,
  invoices: ['invoices'] as const,
  invoice: (id: string) => ['invoices', id] as const,
  inventory: ['inventory'] as const,
  inventoryItem: (id: string) => ['inventory', id] as const,
  leads: ['leads'] as const,
  lead: (id: string) => ['leads', id] as const,
  currentUser: ['current-user'] as const,
  testCategories: ['test-categories'] as const,
  testCategory: (id: string) => ['test-categories', id] as const,
  testCategoryStats: ['test-category-stats'] as const,
  turnaroundTimes: ['turnaround-times'] as const,
  turnaroundTime: (id: string) => ['turnaround-times', id] as const,
  turnaroundTimeStats: ['turnaround-time-stats'] as const,
};

// Patient Hooks
export const usePatients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: [...queryKeys.patients, params],
    queryFn: () => apiService.getPatients(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: queryKeys.patient(id),
    queryFn: () => apiService.getPatient(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Omit<Patient, '_id' | 'created_at' | 'updated_at'>) => 
      apiService.createPatient(patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.patients,
        exact: false 
      });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) => {
      // Convert id to _id if needed for the backend API
      if (id.includes('undefined')) {
        console.error('Invalid patient ID provided for update:', id);
        throw new Error('Invalid patient ID');
      }
      return apiService.updatePatient(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.patients,
        exact: false 
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.patient(id) });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.patients,
        exact: false 
      });
    },
  });
};

// Doctor/User Hooks
export const useDoctors = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => apiService.getDoctors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Appointment Hooks
export const useAppointments = (params?: {
  page?: number;
  limit?: number;
  patient_id?: string;
  doctor_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.appointments, params],
    queryFn: () => apiService.getAppointments(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: queryKeys.appointment(id),
    queryFn: () => apiService.getAppointment(id),
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointmentData: Omit<Appointment, '_id' | 'created_at' | 'updated_at'>) => 
      apiService.createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
      apiService.updateAppointment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment(id) });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
    },
  });
};

// Medical Records Hooks
export const useMedicalRecords = (params?: {
  page?: number;
  limit?: number;
  patient_id?: string;
  doctor_id?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.medicalRecords, params],
    queryFn: () => apiService.getMedicalRecords(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: queryKeys.medicalRecord(id),
    queryFn: () => apiService.getMedicalRecord(id),
    enabled: !!id,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recordData: Omit<MedicalRecord, '_id' | 'created_at' | 'updated_at'>) => 
      apiService.createMedicalRecord(recordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medicalRecords });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MedicalRecord> }) => 
      apiService.updateMedicalRecord(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medicalRecords });
      queryClient.invalidateQueries({ queryKey: queryKeys.medicalRecord(id) });
    },
  });
};

export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteMedicalRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medicalRecords });
    },
  });
};

// Invoice Hooks
export const useInvoices = (params?: {
  page?: number;
  limit?: number;
  patient_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.invoices, params],
    queryFn: () => apiService.getInvoices(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: queryKeys.invoice(id),
    queryFn: () => apiService.getInvoice(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoiceData: Omit<Invoice, '_id' | 'invoice_number' | 'created_at' | 'updated_at'>) => 
      apiService.createInvoice(invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invoice> }) => 
      apiService.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoice(id) });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
    },
  });
};

// Inventory Hooks
export const useInventory = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  low_stock?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.inventory, params],
    queryFn: () => apiService.getInventory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.inventoryItem(id),
    queryFn: () => apiService.getInventoryItem(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemData: Omit<InventoryItem, '_id' | 'created_at' | 'updated_at'>) => 
      apiService.createInventoryItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InventoryItem> }) => 
      apiService.updateInventoryItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventoryItem(id) });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
    },
  });
};

// User Profile Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => apiService.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Partial<User>) => apiService.updateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
};

// Lead Hooks
export const useLeads = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: [...queryKeys.leads, params],
    queryFn: () => apiService.getLeads(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: queryKeys.lead(id),
    queryFn: () => apiService.getLead(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiService.createLead(leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => 
      apiService.updateLead(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.lead(id) });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead['status'] }) => 
      apiService.updateLeadStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.lead(id) });
    },
  });
};

export const useConvertLeadToPatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patientData }: { 
      id: string; 
      patientData: Omit<Patient, '_id' | 'created_at' | 'updated_at'> 
    }) => apiService.convertLeadToPatient(id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.patients });
    },
  });
};

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const result = await apiService.healthCheck();
      // Ensure we never return undefined
      return result || {
        status: 'unknown',
        timestamp: new Date().toISOString()
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// Test Category Hooks
export const useTestCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.testCategories, params],
    queryFn: () => apiService.getTestCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTestCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.testCategory(id),
    queryFn: () => apiService.getTestCategory(id),
    enabled: !!id,
  });
};

export const useTestCategoryStats = () => {
  return useQuery({
    queryKey: queryKeys.testCategoryStats,
    queryFn: () => apiService.getTestCategoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTestCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryData: CreateTestCategoryRequest) => 
      apiService.createTestCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategoryStats });
    },
  });
};

export const useUpdateTestCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTestCategoryRequest> }) => 
      apiService.updateTestCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategory(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategoryStats });
    },
  });
};

export const useDeleteTestCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteTestCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategoryStats });
    },
  });
};

export const useToggleTestCategoryStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.toggleTestCategoryStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategory(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.testCategoryStats });
    },
  });
};

// Turnaround Time Hooks
export const useTurnaroundTimes = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  priority?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.turnaroundTimes, params],
    queryFn: () => apiService.getTurnaroundTimes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTurnaroundTime = (id: string) => {
  return useQuery({
    queryKey: queryKeys.turnaroundTime(id),
    queryFn: () => apiService.getTurnaroundTime(id),
    enabled: !!id,
  });
};

export const useTurnaroundTimeStats = () => {
  return useQuery({
    queryKey: queryKeys.turnaroundTimeStats,
    queryFn: () => apiService.getTurnaroundTimeStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTurnaroundTime = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (turnaroundData: CreateTurnaroundTimeRequest) => 
      apiService.createTurnaroundTime(turnaroundData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimes });
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimeStats });
    },
  });
};

export const useUpdateTurnaroundTime = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTurnaroundTimeRequest> }) => 
      apiService.updateTurnaroundTime(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimes });
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTime(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimeStats });
    },
  });
};

export const useDeleteTurnaroundTime = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteTurnaroundTime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimes });
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimeStats });
    },
  });
};

export const useToggleTurnaroundTimeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.toggleTurnaroundTimeStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimes });
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTime(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.turnaroundTimeStats });
    },
  });
}; 