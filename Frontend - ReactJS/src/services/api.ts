import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Lead, 
  Prescription, 
  CreatePrescriptionRequest, 
  PrescriptionStats,
  TestCategory,
  SampleType,
  SampleTypeStats,
  TestMethodology,
  TurnaroundTime,
  Test,
  TestReport,
  CreateTestCategoryRequest,
  CreateSampleTypeRequest,
  CreateTestMethodologyRequest,
  CreateTurnaroundTimeRequest,
  CreateTestRequest,
  CreateTestReportRequest
} from '@/types';

// X-ray Analysis Types
export interface XrayAnalysis {
  _id: string;
  patient_id: {
    _id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  doctor_id: {
    _id: string;
    first_name: string;
    last_name: string;
    specialization?: string;
  };
  image_url: string;
  image_filename: string;
  custom_prompt?: string;
  analysis_result: string;
  analysis_date: string;
  status: 'pending' | 'completed' | 'failed';
  confidence_score?: number;
  findings: {
    cavities?: boolean;
    wisdom_teeth?: string;
    bone_density?: string;
    infections?: boolean;
    abnormalities?: string[];
  };
  recommendations?: string;
  created_at: string;
  updated_at: string;
}

// Work Schedule Types
export interface DaySchedule {
  start: string;
  end: string;
  isWorking: boolean;
}

export interface WorkSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface XrayAnalysisStats {
  total_analyses: number;
  completed_analyses: number;
  pending_analyses: number;
  failed_analyses: number;
  recent_analyses: number;
  findings_stats: {
    totalCavities: number;
    totalInfections: number;
    totalAbnormalities: number;
  };
}

export interface CreateXrayAnalysisRequest {
  patient_id: string;
  custom_prompt?: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access, but only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password';
      
      if (!isAuthPage) {
        localStorage.removeItem('clinic_token');
        localStorage.removeItem('clinic_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface PatientsResponse {
  success: boolean;
  data: {
    patients: Patient[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface InvoicesResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// User/Auth Types
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'staff';
  phone?: string;
  is_active: boolean;
  base_currency: string;
  avatar?: string;
  address?: string;
  bio?: string;
  date_of_birth?: string;
  specialization?: string;
  license_number?: string;
  department?: string;
  schedule?: WorkSchedule;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'staff';
  phone?: string;
}

// Currency Types
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  position: 'before' | 'after';
  decimals: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Patient Types
export interface Patient {
  _id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance_info?: {
    provider: string;
    policy_number: string;
    group_number?: string;
  };
  created_at: string;
  updated_at: string;
}

// Appointment Types
export interface Appointment {
  _id: string;
  patient_id: string;
  doctor_id: string;
  nurse_id?: string;
  appointment_date: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Medical Record Types
export interface MedicalRecord {
  _id: string;
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  chief_complaint: string;
  diagnosis: string[];
  treatment: string;
  medications: string[];
  allergies: string[];
  vital_signs?: {
    temperature?: number;
    blood_pressure?: {
      systolic: number;
      diastolic: number;
    };
    heart_rate?: number;
    respiratory_rate?: number;
    oxygen_saturation?: number;
    weight?: number;
    height?: number;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Invoice Types
export interface Invoice {
  _id: string;
  invoice_number: string;
  patient_id: string | {
    _id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  };
  services: {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
    type: string;
  }[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  discount?: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'sent';
  issue_date: string;
  due_date: string;
  payment_date?: string;
  paid_at?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  _id: string;
  invoice_id: string | {
    _id: string;
    invoice_number: string;
    total_amount: number;
  };
  patient_id: string | {
    _id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  amount: number;
  method: 'credit_card' | 'cash' | 'bank_transfer' | 'upi' | 'insurance';
  status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';
  transaction_id?: string;
  card_last4?: string;
  insurance_provider?: string;
  processing_fee: number;
  net_amount: number;
  payment_date: string;
  failure_reason?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStats {
  overview: {
    total_payments: number;
    total_revenue: number;
    completed_payments: number;
    failed_payments: number;
    pending_payments: number;
    processing_payments: number;
    monthly_revenue: number;
    monthly_payments_count: number;
  };
  by_method: Array<{
    _id: string;
    count: number;
    total_amount: number;
  }>;
}

export interface InvoiceStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  averageInvoice: number;
  monthlyRevenue: number;
  monthlyInvoicesCount: number;
  historicalMonthlyRevenue: Array<{
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
    count: number;
  }>;
}

// Payroll Types
export interface Payroll {
  _id: string;
  employee_id: string | {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone?: string;
  };
  month: string;
  year: number;
  base_salary: number;
  overtime: number;
  bonus: number;
  allowances: number;
  deductions: number;
  tax: number;
  net_salary: number;
  status: 'draft' | 'pending' | 'processed' | 'paid';
  pay_date?: string;
  working_days: number;
  total_days: number;
  leaves: number;
  created_at: string;
  updated_at: string;
}

export interface PayrollStats {
  overview: {
    total_employees: number;
    total_payroll: number;
    paid_entries: number;
    pending_entries: number;
    draft_entries: number;
    processed_entries: number;
    average_salary: number;
    total_overtime: number;
    total_bonus: number;
    total_deductions: number;
    total_tax: number;
  };
  by_department: Array<{
    _id: string;
    count: number;
    total_salary: number;
    average_salary: number;
  }>;
}

// Inventory Types
export interface InventoryItem {
  _id: string;
  name: string;
  category: 'medications' | 'medical-devices' | 'consumables' | 'equipment' | 'laboratory' | 'office-supplies' | 'other';
  sku: string;
  current_stock: number;
  minimum_stock: number;
  unit_price: number;
  supplier: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

// Department Types
export interface Department {
  _id: string;
  code: string;
  name: string;
  description: string;
  head: string;
  location: string;
  phone: string;
  email: string;
  staffCount: number;
  budget: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DepartmentStats {
  overview: {
    totalDepartments: number;
    activeDepartments: number;
    inactiveDepartments: number;
  };
  staff: {
    totalStaff: number;
    avgStaffPerDept: number;
    maxStaff: number;
    minStaff: number;
  };
  budget: {
    totalBudget: number;
    avgBudget: number;
    maxBudget: number;
    minBudget: number;
  };
  statusDistribution: Array<{
    _id: string;
    count: number;
  }>;
  topByStaff: Array<{
    _id: string;
    name: string;
    code: string;
    staffCount: number;
  }>;
  topByBudget: Array<{
    _id: string;
    name: string;
    code: string;
    budget: number;
  }>;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description: string;
  head: string;
  location: string;
  phone: string;
  email: string;
  staffCount: number;
  budget: number;
  status?: 'active' | 'inactive';
}

// API Methods
class ApiService {
  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', userData);
    return response.data.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/users/profile');
    return response.data.data!.user;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>('/users/profile', userData);
    return response.data.data!.user;
  }

  // Patients
  async getPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<PatientsResponse> {
    const response = await apiClient.get<PatientsResponse>('/patients', { params });
    return response.data;
  }

  async getPatient(id: string): Promise<Patient> {
    const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data!;
  }

  async createPatient(patientData: Omit<Patient, '_id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>('/patients', patientData);
    return response.data.data!;
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, patientData);
    return response.data.data!;
  }

  async deletePatient(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  }

  // Users
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    is_active?: boolean;
  }): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/users', { params });
    return response.data;
  }

  async getDoctors(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/users/doctors', { params });
    return response.data;
  }

  async getNurses(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/users/nurses', { params });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data.data!.user;
  }

  async createUser(userData: RegisterRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/register', userData);
    return response.data.data!.user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(`/users/${id}`, userData);
    return response.data.data!.user;
  }

  async updateUserSchedule(id: string, schedule: WorkSchedule): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(`/users/${id}/schedule`, { schedule });
    return response.data.data!.user;
  }

  async activateUser(id: string): Promise<User> {
    const response = await apiClient.patch<ApiResponse<{ user: User }>>(`/users/${id}/activate`);
    return response.data.data!.user;
  }

  async deactivateUser(id: string): Promise<User> {
    const response = await apiClient.patch<ApiResponse<{ user: User }>>(`/users/${id}/deactivate`);
    return response.data.data!.user;
  }

  async adminChangeUserPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.put(`/users/${id}/password`, { new_password: newPassword });
  }

  // Avatar management
  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post<ApiResponse<{ avatar: string }>>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  }

  async removeAvatar(): Promise<void> {
    await apiClient.delete('/users/avatar');
  }

  // Password management
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  // Appointments
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    patient_id?: string;
    doctor_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  }): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get<PaginatedResponse<Appointment>>('/appointments', { params });
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data!;
  }

  async createAppointment(appointmentData: Omit<Appointment, '_id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const response = await apiClient.post<ApiResponse<Appointment>>('/appointments', appointmentData);
    return response.data.data!;
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointmentData);
    return response.data.data!;
  }

  async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }

  // Medical Records
  async getMedicalRecords(params?: {
    page?: number;
    limit?: number;
    patient_id?: string;
    doctor_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<MedicalRecord>> {
    const response = await apiClient.get<PaginatedResponse<MedicalRecord>>('/medical-records', { params });
    return response.data;
  }

  async getMedicalRecord(id: string): Promise<MedicalRecord> {
    const response = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    return response.data.data!;
  }

  async createMedicalRecord(recordData: Omit<MedicalRecord, '_id' | 'created_at' | 'updated_at'>): Promise<MedicalRecord> {
    const response = await apiClient.post<ApiResponse<MedicalRecord>>('/medical-records', recordData);
    return response.data.data!;
  }

  async updateMedicalRecord(id: string, recordData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const response = await apiClient.put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, recordData);
    return response.data.data!;
  }

  async deleteMedicalRecord(id: string): Promise<void> {
    await apiClient.delete(`/medical-records/${id}`);
  }

  // Invoices
  async getInvoices(params?: {
    page?: number;
    limit?: number;
    patient_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<InvoicesResponse> {
    const response = await apiClient.get<InvoicesResponse>('/invoices', { params });
    return response.data;
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<{ invoice: Invoice }>>(`/invoices/${id}`);
    return response.data.data!.invoice;
  }

  async createInvoice(invoiceData: Omit<Invoice, '_id' | 'invoice_number' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const response = await apiClient.post<ApiResponse<{ invoice: Invoice }>>('/invoices', invoiceData);
    return response.data.data!.invoice;
  }

  async updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
    const response = await apiClient.put<ApiResponse<{ invoice: Invoice }>>(`/invoices/${id}`, invoiceData);
    return response.data.data!.invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  }

  async getInvoiceStats(): Promise<InvoiceStats> {
    const response = await apiClient.get<{ success: boolean; data: InvoiceStats }>('/invoices/stats');
    return response.data.data;
  }

  // Inventory
  async getInventory(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    low_stock?: boolean;
  }): Promise<PaginatedResponse<InventoryItem>> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        inventoryItems: InventoryItem[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/inventory', { params });
    
    // Transform the backend response to match the expected PaginatedResponse format
    return {
      success: response.data.success,
      data: {
        items: response.data.data.inventoryItems,
        pagination: response.data.data.pagination
      }
    };
  }

  async getInventoryItem(id: string): Promise<InventoryItem> {
    const response = await apiClient.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
    return response.data.data!;
  }

  async createInventoryItem(itemData: Omit<InventoryItem, '_id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    const response = await apiClient.post<ApiResponse<InventoryItem>>('/inventory', itemData);
    return response.data.data!;
  }

  async updateInventoryItem(id: string, itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await apiClient.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, itemData);
    return response.data.data!;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    await apiClient.delete(`/inventory/${id}`);
  }

  async getInventoryStats(): Promise<{
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiredItems: number;
    totalValue: number;
    categoryStats: Array<{
      _id: string;
      count: number;
      totalValue: number;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalItems: number;
      lowStockItems: number;
      outOfStockItems: number;
      expiredItems: number;
      totalValue: number;
      categoryStats: Array<{
        _id: string;
        count: number;
        totalValue: number;
      }>;
    }>>('/inventory/stats');
    return response.data.data!;
  }

  async updateInventoryStock(id: string, stockData: { quantity: number; operation: 'add' | 'subtract' }): Promise<InventoryItem> {
    const response = await apiClient.patch<ApiResponse<{ inventoryItem: InventoryItem }>>(`/inventory/${id}/stock`, stockData);
    return response.data.data!.inventoryItem;
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const response = await apiClient.get<ApiResponse<{ inventoryItems: InventoryItem[] }>>('/inventory/low-stock');
    return response.data.data!.inventoryItems;
  }

  async getExpiredItems(): Promise<InventoryItem[]> {
    const response = await apiClient.get<ApiResponse<{ inventoryItems: InventoryItem[] }>>('/inventory/expired');
    return response.data.data!.inventoryItems;
  }

  async getExpiringItems(days: number = 30): Promise<InventoryItem[]> {
    const response = await apiClient.get<ApiResponse<{ inventoryItems: InventoryItem[] }>>(`/inventory/expiring?days=${days}`);
    return response.data.data!.inventoryItems;
  }

  // Leads
  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Lead>> {
    const response = await apiClient.get<PaginatedResponse<Lead>>('/leads', { params });
    return response.data;
  }

  async getLead(id: string): Promise<Lead> {
    const response = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data!;
  }

  async createLead(leadData: Omit<Lead, '_id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const response = await apiClient.post<ApiResponse<Lead>>('/leads', leadData);
    return response.data.data!;
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, leadData);
    return response.data.data!;
  }

  async deleteLead(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`);
  }

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    const response = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}/status`, { status });
    return response.data.data!;
  }

  async convertLeadToPatient(id: string, patientData: Omit<Patient, '_id' | 'created_at' | 'updated_at'>): Promise<{ lead: Lead; patient: Patient }> {
    const response = await apiClient.post<ApiResponse<{ lead: Lead; patient: Patient }>>(`/leads/${id}/convert`, patientData);
    return response.data.data!;
  }

  // Currency
  async getCurrencies(): Promise<CurrencyInfo[]> {
    const response = await apiClient.get<ApiResponse<{ currencies: CurrencyInfo[] }>>('/users/currencies');
    return response.data.data!.currencies;
  }

  // Prescriptions
  async getPrescriptions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    doctor_id?: string;
    patient_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<{ prescriptions: Prescription[]; pagination: { page: number; limit: number; total: number; pages: number; } }>> {
    const response = await apiClient.get<ApiResponse<{ prescriptions: Prescription[]; pagination: { page: number; limit: number; total: number; pages: number; } }>>('/prescriptions', { params });
    return response.data;
  }

  async getPrescription(id: string): Promise<Prescription> {
    const response = await apiClient.get<ApiResponse<{ prescription: Prescription }>>(`/prescriptions/${id}`);
    return response.data.data!.prescription;
  }

  async createPrescription(prescriptionData: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await apiClient.post<ApiResponse<{ prescription: Prescription }>>('/prescriptions', prescriptionData);
    return response.data.data!.prescription;
  }

  async updatePrescription(id: string, prescriptionData: Partial<CreatePrescriptionRequest>): Promise<Prescription> {
    const response = await apiClient.put<ApiResponse<{ prescription: Prescription }>>(`/prescriptions/${id}`, prescriptionData);
    return response.data.data!.prescription;
  }

  async deletePrescription(id: string): Promise<void> {
    await apiClient.delete(`/prescriptions/${id}`);
  }

  async updatePrescriptionStatus(id: string, status: string): Promise<Prescription> {
    const response = await apiClient.patch<ApiResponse<{ prescription: Prescription }>>(`/prescriptions/${id}/status`, { status });
    return response.data.data!.prescription;
  }

  async sendToPharmacy(id: string): Promise<Prescription> {
    const response = await apiClient.patch<ApiResponse<{ prescription: Prescription }>>(`/prescriptions/${id}/send-to-pharmacy`);
    return response.data.data!.prescription;
  }

  async getPrescriptionStats(): Promise<PrescriptionStats> {
    const response = await apiClient.get<ApiResponse<PrescriptionStats>>('/prescriptions/stats');
    return response.data.data!;
  }

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    const response = await apiClient.get<ApiResponse<{ prescriptions: Prescription[] }>>(`/prescriptions/patient/${patientId}`);
    return response.data.data!.prescriptions;
  }

  async getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]> {
    const response = await apiClient.get<ApiResponse<{ prescriptions: Prescription[] }>>(`/prescriptions/doctor/${doctorId}`);
    return response.data.data!.prescriptions;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get('/health');
      
      // Handle different response formats
      if (response.data?.data) {
        // Standard ApiResponse format
        return response.data.data;
      } else if (response.data?.status && response.data?.timestamp) {
        // Direct response format
        return response.data;
      } else {
        // Fallback if no proper response structure
        return {
          status: 'ok',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      // Return a default response instead of throwing
      return {
        status: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Test Categories
  async getTestCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      categories: TestCategory[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        categories: TestCategory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/test-categories', { params });
    return response.data;
  }

  async getTestCategory(id: string): Promise<TestCategory> {
    const response = await apiClient.get<ApiResponse<{ category: TestCategory }>>(`/test-categories/${id}`);
    return response.data.data!.category;
  }

  async createTestCategory(categoryData: CreateTestCategoryRequest): Promise<TestCategory> {
    const response = await apiClient.post<ApiResponse<{ category: TestCategory }>>('/test-categories', categoryData);
    return response.data.data!.category;
  }

  async updateTestCategory(id: string, categoryData: Partial<CreateTestCategoryRequest>): Promise<TestCategory> {
    const response = await apiClient.put<ApiResponse<{ category: TestCategory }>>(`/test-categories/${id}`, categoryData);
    return response.data.data!.category;
  }

  async deleteTestCategory(id: string): Promise<void> {
    await apiClient.delete(`/test-categories/${id}`);
  }

  async toggleTestCategoryStatus(id: string): Promise<TestCategory> {
    const response = await apiClient.patch<ApiResponse<{ category: TestCategory }>>(`/test-categories/${id}/toggle`);
    return response.data.data!.category;
  }

  async getTestCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    totalTests: number;
    departmentsCount: number;
    departmentStats: Array<{
      _id: string;
      count: number;
      activeCount: number;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalCategories: number;
      activeCategories: number;
      inactiveCategories: number;
      totalTests: number;
      departmentsCount: number;
      departmentStats: Array<{
        _id: string;
        count: number;
        activeCount: number;
      }>;
    }>>('/test-categories/stats');
    return response.data.data!;
  }

  // Sample Types
  async getSampleTypes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      sampleTypes: SampleType[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        sampleTypes: SampleType[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/sample-types', { params });
    return response.data;
  }

  async getSampleType(id: string): Promise<SampleType> {
    const response = await apiClient.get<ApiResponse<{ sampleType: SampleType }>>(`/sample-types/${id}`);
    return response.data.data!.sampleType;
  }

  async createSampleType(sampleTypeData: CreateSampleTypeRequest): Promise<SampleType> {
    const response = await apiClient.post<ApiResponse<{ sampleType: SampleType }>>('/sample-types', sampleTypeData);
    return response.data.data!.sampleType;
  }

  async updateSampleType(id: string, sampleTypeData: Partial<CreateSampleTypeRequest>): Promise<SampleType> {
    const response = await apiClient.put<ApiResponse<{ sampleType: SampleType }>>(`/sample-types/${id}`, sampleTypeData);
    return response.data.data!.sampleType;
  }

  async deleteSampleType(id: string): Promise<void> {
    await apiClient.delete(`/sample-types/${id}`);
  }

  async toggleSampleTypeStatus(id: string): Promise<SampleType> {
    const response = await apiClient.patch<ApiResponse<{ sampleType: SampleType }>>(`/sample-types/${id}/toggle`);
    return response.data.data!.sampleType;
  }

  async getSampleTypeStats(): Promise<SampleTypeStats> {
    const response = await apiClient.get<ApiResponse<SampleTypeStats>>('/sample-types/stats');
    return response.data.data!;
  }

  // Test Methodologies
  async getTestMethodologies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      methodologies: TestMethodology[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        methodologies: TestMethodology[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/test-methodologies', { params });
    return response.data;
  }

  async getTestMethodology(id: string): Promise<TestMethodology> {
    const response = await apiClient.get<ApiResponse<{ methodology: TestMethodology } | TestMethodology>>(`/test-methodologies/${id}`);
    const data = response.data.data!;
    // Handle both response formats for compatibility
    return 'methodology' in data ? data.methodology : data;
  }

  async createTestMethodology(methodologyData: CreateTestMethodologyRequest): Promise<TestMethodology> {
    const response = await apiClient.post<ApiResponse<TestMethodology>>('/test-methodologies', methodologyData);
    return response.data.data!;
  }

  async updateTestMethodology(id: string, methodologyData: Partial<CreateTestMethodologyRequest>): Promise<TestMethodology> {
    const response = await apiClient.put<ApiResponse<TestMethodology>>(`/test-methodologies/${id}`, methodologyData);
    return response.data.data!;
  }

  async deleteTestMethodology(id: string): Promise<void> {
    await apiClient.delete(`/test-methodologies/${id}`);
  }

  async toggleTestMethodologyStatus(id: string): Promise<TestMethodology> {
    const response = await apiClient.patch<ApiResponse<{ methodology: TestMethodology }>>(`/test-methodologies/${id}/toggle`);
    return response.data.data!.methodology;
  }

  async duplicateTestMethodology(id: string): Promise<TestMethodology> {
    // Since the backend doesn't have a duplicate endpoint yet, we'll implement it on the frontend
    try {
      // First, get the original methodology
      const original = await this.getTestMethodology(id);
      
      // Create a new methodology with modified name and code
      const duplicatedData: CreateTestMethodologyRequest = {
        name: `${original.name} (Copy)`,
        code: `${original.code}_COPY_${Date.now().toString().slice(-4)}`,
        description: original.description || "",
        category: original.category || "",
        equipment: original.equipment || "",
        principles: original.principles || "",
        applications: original.applications || [],
        advantages: original.advantages || "",
        limitations: original.limitations || "",
        isActive: false, // Start as inactive for safety
      };
      
      // Create the new methodology
      return await this.createTestMethodology(duplicatedData);
    } catch (error) {
      console.error('Error duplicating methodology:', error);
      throw error;
    }
  }

  async getTestMethodologyStats(): Promise<{
    totalMethodologies: number;
    activeMethodologies: number;
    inactiveMethodologies: number;
    categoriesCount: number;
    categoryStats: Array<{
      _id: string;
      count: number;
      activeCount: number;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalMethodologies: number;
      activeMethodologies: number;
      inactiveMethodologies: number;
      categoriesCount: number;
      categoryStats: Array<{
        _id: string;
        count: number;
        activeCount: number;
      }>;
    }>>('/test-methodologies/stats');
    return response.data.data!;
  }

  // Turnaround Times
  async getTurnaroundTimes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      turnaroundTimes: TurnaroundTime[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        turnaroundTimes: TurnaroundTime[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/turnaround-times', { params });
    return response.data;
  }

  async getTurnaroundTime(id: string): Promise<TurnaroundTime> {
    const response = await apiClient.get<ApiResponse<{ turnaroundTime: TurnaroundTime }>>(`/turnaround-times/${id}`);
    return response.data.data!.turnaroundTime;
  }

  async createTurnaroundTime(turnaroundData: CreateTurnaroundTimeRequest): Promise<TurnaroundTime> {
    const response = await apiClient.post<ApiResponse<{ turnaroundTime: TurnaroundTime }>>('/turnaround-times', turnaroundData);
    return response.data.data!.turnaroundTime;
  }

  async updateTurnaroundTime(id: string, turnaroundData: Partial<CreateTurnaroundTimeRequest>): Promise<TurnaroundTime> {
    const response = await apiClient.put<ApiResponse<{ turnaroundTime: TurnaroundTime }>>(`/turnaround-times/${id}`, turnaroundData);
    return response.data.data!.turnaroundTime;
  }

  async deleteTurnaroundTime(id: string): Promise<void> {
    await apiClient.delete(`/turnaround-times/${id}`);
  }

  async toggleTurnaroundTimeStatus(id: string): Promise<TurnaroundTime> {
    const response = await apiClient.patch<ApiResponse<{ turnaroundTime: TurnaroundTime }>>(`/turnaround-times/${id}/toggle`);
    return response.data.data!.turnaroundTime;
  }

  async getTurnaroundTimeStats(): Promise<{
    totalTimes: number;
    activeTimes: number;
    inactiveTimes: number;
    statTimes: number;
    averageMinutes: number;
    priorityStats: Array<{
      _id: string;
      count: number;
      activeCount: number;
      avgDuration: number;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalTimes: number;
      activeTimes: number;
      inactiveTimes: number;
      statTimes: number;
      averageMinutes: number;
      priorityStats: Array<{
        _id: string;
        count: number;
        activeCount: number;
        avgDuration: number;
      }>;
    }>>('/turnaround-times/stats');
    return response.data.data!;
  }

  // Tests
  async getTests(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_active?: boolean;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      items: Test[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    // Transform frontend params to backend format
    const backendParams: any = { ...params };
    if (params?.is_active !== undefined) {
      backendParams.status = params.is_active ? 'active' : 'inactive';
      delete backendParams.is_active;
    }

    const response = await apiClient.get<{
      success: boolean;
      data: {
        tests: Test[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/tests', { params: backendParams });

    // Transform response to match expected format
    return {
      success: response.data.success,
      data: {
        items: response.data.data.tests,
        pagination: response.data.data.pagination
      }
    };
  }

  async getTest(id: string): Promise<Test> {
    const response = await apiClient.get<ApiResponse<{ test: Test }>>(`/tests/${id}`);
    return response.data.data!.test;
  }

  async createTest(testData: CreateTestRequest): Promise<Test> {
    const response = await apiClient.post<ApiResponse<{ test: Test }>>('/tests', testData);
    return response.data.data!.test;
  }

  async updateTest(id: string, testData: Partial<CreateTestRequest>): Promise<Test> {
    const response = await apiClient.put<ApiResponse<{ test: Test }>>(`/tests/${id}`, testData);
    return response.data.data!.test;
  }

  async deleteTest(id: string): Promise<void> {
    await apiClient.delete(`/tests/${id}`);
  }

  async toggleTestStatus(id: string): Promise<Test> {
    const response = await apiClient.patch<ApiResponse<{ test: Test }>>(`/tests/${id}/toggle`);
    return response.data.data!.test;
  }

  async getTestStats(): Promise<{
    totalTests: number;
    activeTests: number;
    inactiveTests: number;
    categoriesCount: number;
    categoryStats: Array<{
      _id: string;
      count: number;
      activeCount: number;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalTests: number;
      activeTests: number;
      inactiveTests: number;
      categoriesCount: number;
      categoryStats: Array<{
        _id: string;
        count: number;
        activeCount: number;
      }>;
    }>>('/tests/stats');
    return response.data.data!;
  }

  // Test Reports
  async getTestReports(params?: {
    page?: number;
    limit?: number;
    search?: string;
    patient_id?: string;
    test_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    vendor?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    data: {
      items: TestReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        reports: TestReport[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/test-reports', { params });
    
    // Transform response to match expected format
    return {
      success: response.data.success,
      data: {
        items: response.data.data.reports,
        pagination: response.data.data.pagination
      }
    };
  }

  async getTestReport(id: string): Promise<TestReport> {
    const response = await apiClient.get<ApiResponse<{ report: TestReport }>>(`/test-reports/${id}`);
    return response.data.data!.report;
  }

  async createTestReport(reportData: CreateTestReportRequest): Promise<TestReport> {
    const response = await apiClient.post<ApiResponse<{ report: TestReport }>>('/test-reports', reportData);
    return response.data.data!.report;
  }

  async updateTestReport(id: string, reportData: Partial<CreateTestReportRequest>): Promise<TestReport> {
    const response = await apiClient.put<ApiResponse<{ report: TestReport }>>(`/test-reports/${id}`, reportData);
    return response.data.data!.report;
  }

  async deleteTestReport(id: string): Promise<void> {
    await apiClient.delete(`/test-reports/${id}`);
  }

  async uploadTestReportAttachment(id: string, file: File): Promise<TestReport> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<{ report: TestReport }>>(`/test-reports/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!.report;
  }

  async removeTestReportAttachment(id: string, attachmentId: string): Promise<void> {
    await apiClient.delete(`/test-reports/${id}/attachments/${attachmentId}`);
  }

  async updateTestReportStatus(id: string, status: string, verifiedBy?: string): Promise<TestReport> {
    const response = await apiClient.patch<ApiResponse<{ report: TestReport }>>(`/test-reports/${id}/status`, {
      status,
      verifiedBy
    });
    return response.data.data!.report;
  }

  async verifyTestReport(id: string, verifiedBy?: string): Promise<TestReport> {
    return this.updateTestReportStatus(id, 'verified', verifiedBy);
  }

  async deliverTestReport(id: string): Promise<TestReport> {
    return this.updateTestReportStatus(id, 'delivered');
  }

  async getTestReportStats(): Promise<{
    totalReports: number;
    pendingReports: number;
    recordedReports: number;
    verifiedReports: number;
    deliveredReports: number;
    categoryStats: Array<{ _id: string; count: number }>;
    vendorStats: Array<{ _id: string; count: number }>;
    monthlyStats: Array<{ _id: { year: number; month: number }; count: number }>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalReports: number;
      pendingReports: number;
      recordedReports: number;
      verifiedReports: number;
      deliveredReports: number;
      categoryStats: Array<{ _id: string; count: number }>;
      vendorStats: Array<{ _id: string; count: number }>;
      monthlyStats: Array<{ _id: { year: number; month: number }; count: number }>;
    }>>('/test-reports/stats');
    return response.data.data!;
  }

  async getPatientTestReports(patientId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TestReport>> {
    const response = await apiClient.get<PaginatedResponse<TestReport>>(`/test-reports/patient/${patientId}`, { params });
    return response.data;
  }

  // Departments
  async getDepartments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      departments: Department[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        departments: Department[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/departments', { params });
    return response.data;
  }

  async getDepartment(id: string): Promise<Department> {
    const response = await apiClient.get<ApiResponse<{ department: Department }>>(`/departments/${id}`);
    return response.data.data!.department;
  }

  async createDepartment(departmentData: CreateDepartmentRequest): Promise<Department> {
    const response = await apiClient.post<ApiResponse<{ department: Department }>>('/departments', departmentData);
    return response.data.data!.department;
  }

  async updateDepartment(id: string, departmentData: Partial<CreateDepartmentRequest>): Promise<Department> {
    const response = await apiClient.put<ApiResponse<{ department: Department }>>(`/departments/${id}`, departmentData);
    return response.data.data!.department;
  }

  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete(`/departments/${id}`);
  }

  async updateDepartmentStatus(id: string, status: 'active' | 'inactive'): Promise<Department> {
    const response = await apiClient.patch<ApiResponse<{ department: Department }>>(`/departments/${id}/status`, { status });
    return response.data.data!.department;
  }

  async getDepartmentStats(): Promise<DepartmentStats> {
    const response = await apiClient.get<ApiResponse<DepartmentStats>>('/departments/stats');
    return response.data.data!;
  }

  // Payments
  async getPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
    patient_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Payment>> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        items: Payment[];
        pagination: {
          page: number;
          pages: number;
          total: number;
          limit: number;
        };
      };
    }>('/payments', { params });
    
    // Defensive checks for response structure
    if (!response.data) {
      throw new Error('Invalid API response: missing data');
    }
    
    const data = response.data.data;
    
    // Handle missing data object with defaults
    if (!data) {
      return {
        success: response.data.success || false,
        data: {
          items: [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: 0,
            pages: 1
          }
        }
      };
    }
    
    const payments = data.items || [];
    const pagination = data.pagination;
    
    // Handle missing pagination data with defaults
    if (!pagination) {
      return {
        success: response.data.success || false,
        data: {
          items: payments,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: payments.length,
            pages: 1
          }
        }
      };
    }
    
    // Transform response to match expected format (backend already returns correct format)
    return {
      success: response.data.success,
      data: {
        items: payments,
        pagination: {
          page: pagination.page || params?.page || 1,
          limit: pagination.limit || params?.limit || 10,
          total: pagination.total || payments.length,
          pages: pagination.pages || 1
        }
      }
    };
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await apiClient.get<{ success: boolean; data: Payment }>(`/payments/${id}`);
    return response.data.data;
  }

  async createPayment(paymentData: Omit<Payment, '_id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const response = await apiClient.post<{ success: boolean; data: Payment }>('/payments', paymentData);
    return response.data.data;
  }

  async updatePayment(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    const response = await apiClient.put<{ success: boolean; data: Payment }>(`/payments/${id}`, paymentData);
    return response.data.data;
  }

  async updatePaymentStatus(id: string, status: string, failure_reason?: string): Promise<Payment> {
    const response = await apiClient.patch<{ success: boolean; data: Payment }>(`/payments/${id}/status`, {
      status,
      failure_reason
    });
    return response.data.data;
  }

  async initiateRefund(id: string, refund_amount: number, reason: string): Promise<Payment> {
    const response = await apiClient.post<{ success: boolean; data: Payment }>(`/payments/${id}/refund`, {
      refund_amount,
      reason
    });
    return response.data.data;
  }

  async getPaymentStats(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<PaymentStats> {
    const response = await apiClient.get<{ success: boolean; data: PaymentStats }>('/payments/stats', { params });
    return response.data.data;
  }

  // Payroll
  async getPayrolls(params?: {
    page?: number;
    limit?: number;
    status?: string;
    month?: string;
    year?: number;
    employee_id?: string;
    department?: string;
  }): Promise<PaginatedResponse<Payroll>> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        items: Payroll[];
        pagination: {
          page: number;
          pages: number;
          total: number;
          limit: number;
        };
      };
    }>('/payroll', { params });
    
    // Defensive checks for response structure
    if (!response.data) {
      throw new Error('Invalid API response: missing data');
    }
    
    const data = response.data.data;
    
    // Handle missing data object with defaults
    if (!data) {
      return {
        success: response.data.success || false,
        data: {
          items: [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: 0,
            pages: 1
          }
        }
      };
    }
    
    const payrolls = data.items || [];
    const pagination = data.pagination;
    
    // Handle missing pagination data with defaults
    if (!pagination) {
      return {
        success: response.data.success || false,
        data: {
          items: payrolls,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: payrolls.length,
            pages: 1
          }
        }
      };
    }
    
    // Transform response to match expected format (backend already returns correct format)
    return {
      success: response.data.success,
      data: {
        items: payrolls,
        pagination: {
          page: pagination.page || params?.page || 1,
          limit: pagination.limit || params?.limit || 10,
          total: pagination.total || payrolls.length,
          pages: pagination.pages || 1
        }
      }
    };
  }

  async getPayroll(id: string): Promise<Payroll> {
    const response = await apiClient.get<{ success: boolean; data: Payroll }>(`/payroll/${id}`);
    return response.data.data;
  }

  async createPayroll(payrollData: Omit<Payroll, '_id' | 'created_at' | 'updated_at'>): Promise<Payroll> {
    const response = await apiClient.post<{ success: boolean; data: Payroll }>('/payroll', payrollData);
    return response.data.data;
  }

  async updatePayroll(id: string, payrollData: Partial<Payroll>): Promise<Payroll> {
    const response = await apiClient.put<{ success: boolean; data: Payroll }>(`/payroll/${id}`, payrollData);
    return response.data.data;
  }

  async updatePayrollStatus(id: string, status: string): Promise<Payroll> {
    const response = await apiClient.patch<{ success: boolean; data: Payroll }>(`/payroll/${id}/status`, { status });
    return response.data.data;
  }

  async generatePayroll(data: {
    month: string;
    year: number;
    employee_ids?: string[];
  }): Promise<{ generated: Payroll[]; errors: string[] }> {
    const response = await apiClient.post<{
      success: boolean;
      data: { generated: Payroll[]; errors: string[] };
    }>('/payroll/generate', data);
    return response.data.data;
  }

  async deletePayroll(id: string): Promise<void> {
    await apiClient.delete(`/payroll/${id}`);
  }

  async getPayrollStats(params?: {
    month?: string;
    year?: number;
  }): Promise<PayrollStats> {
    const response = await apiClient.get<{ success: boolean; data: PayrollStats }>('/payroll/stats', { params });
    return response.data.data;
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<{
    overview: {
      totalPatients: number;
      todayAppointments: number;
      monthlyRevenue: number;
      lowStockCount: number;
      totalDoctors: number;
      totalStaff: number;
    };
    appointmentStats: Array<{ _id: string; count: number }>;
    revenueData: Array<{
      _id: { year: number; month: number };
      revenue: number;
      count: number;
    }>;
    lowStockItems: InventoryItem[];
    recentAppointments: Appointment[];
    recentLeads: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone: string;
      source: string;
      serviceInterest: string;
      status: string;
      created_at: string;
    }>;
    percentageChanges: {
      revenue: string;
      patients: string;
      appointments: string;
    };
    systemHealth: {
      totalUsers: number;
      activeUsers: number;
      systemUptime: string;
      lastBackup: Date;
      apiResponseTime: string;
    };
    lastUpdated: Date;
  }> {
    const response = await apiClient.get('/dashboard/admin');
    return response.data.data;
  }

  async getRevenueAnalytics(period: string = '6months'): Promise<{
    revenueData: Array<{
      _id: { year: number; month: number };
      revenue: number;
      count: number;
    }>;
    expenseData: Array<{
      _id: { year: number; month: number };
      expenses: number;
    }>;
    period: string;
  }> {
    const response = await apiClient.get('/dashboard/revenue', {
      params: { period }
    });
    return response.data.data;
  }

  // Analytics API Methods
  async getAnalyticsOverview(period: string = '6months'): Promise<{
    revenueExpenseData: Array<{
      month: string;
      revenue: number;
      expenses: number;
      patients: number;
      year: number;
      monthNumber: number;
    }>;
    period: string;
  }> {
    const response = await apiClient.get('/analytics/overview', {
      params: { period }
    });
    return response.data.data;
  }

  async getDepartmentAnalytics(): Promise<Array<{
    name: string;
    revenue: number;
    patients: number;
    color: string;
  }>> {
    const response = await apiClient.get('/analytics/departments');
    return response.data.data;
  }

  async getAppointmentAnalytics(): Promise<Array<{
    name: string;
    value: number;
    count: number;
    color: string;
  }>> {
    const response = await apiClient.get('/analytics/appointments');
    return response.data.data;
  }

  async getPatientDemographics(): Promise<Array<{
    ageGroup: string;
    male: number;
    female: number;
    total: number;
  }>> {
    const response = await apiClient.get('/analytics/demographics');
    return response.data.data;
  }

  async getTopServices(): Promise<Array<{
    service: string;
    count: number;
    revenue: number;
  }>> {
    const response = await apiClient.get('/analytics/services');
    return response.data.data;
  }

  async getPaymentMethodAnalytics(): Promise<Array<{
    method: string;
    percentage: number;
    amount: number;
    count: number;
  }>> {
    const response = await apiClient.get('/analytics/payments');
    return response.data.data;
  }

  async getAnalyticsStats(): Promise<{
    currentMonth: {
      revenue: number;
      patients: number;
      appointments: number;
      completionRate: number;
    };
    growth: {
      revenue: number;
      patients: number;
      appointments: number;
    };
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/stats');
    return response.data.data!;
  }

  async getOperationalMetrics(): Promise<{
    appointments: {
      today: number;
      thisWeek: number;
      thisMonth: number;
      byStatus: Array<{ _id: string; count: number }>;
    };
    patients: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    inventoryAlerts: InventoryItem[];
    timestamp: Date;
  }> {
    const response = await apiClient.get('/dashboard/operations');
    return response.data.data;
  }

  async getSystemHealth(): Promise<{
    healthChecks: Array<{
      service: string;
      status: string;
      responseTime?: string;
      usage?: string;
    }>;
    systemAlerts: Array<{
      type: string;
      title: string;
      description: string;
      timestamp: Date;
      severity: string;
    }>;
    performanceMetrics: {
      uptime: string;
      averageResponseTime: string;
      requestsToday: number;
      errorsToday: number;
      lastBackup: Date;
    };
    overallStatus: string;
    timestamp: Date;
  }> {
    const response = await apiClient.get('/dashboard/system-health');
    return response.data.data;
  }

  // Settings endpoints
  async getSettings(): Promise<{
    success: boolean;
    data: {
      id: string;
      clinic: {
        name: string;
        address: string;
        phone: string;
        email: string;
        website?: string;
        description?: string;
        logo?: string;
      };
      workingHours: {
        [key: string]: {
          isOpen: boolean;
          start: string;
          end: string;
        };
      };
      financial: {
        currency: string;
        taxRate: number;
        invoicePrefix: string;
        paymentTerms: number;
        defaultDiscount: number;
      };
      notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        appointmentReminders: boolean;
        paymentReminders: boolean;
        lowStockAlerts: boolean;
        systemAlerts: boolean;
      };
      security: {
        twoFactorAuth: boolean;
        sessionTimeout: number;
        passwordExpiry: number;
        backupFrequency: string;
      };
      createdAt: string;
      updatedAt: string;
    };
  }> {
    const response = await apiClient.get('/settings');
    return response.data;
  }

  async updateSettings(data: {
    clinic?: {
      name: string;
      address: string;
      phone: string;
      email: string;
      website?: string;
      description?: string;
      logo?: string;
    };
    workingHours?: {
      [key: string]: {
        isOpen: boolean;
        start: string;
        end: string;
      };
    };
    financial?: {
      currency: string;
      taxRate: number;
      invoicePrefix: string;
      paymentTerms: number;
      defaultDiscount: number;
    };
    notifications?: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      appointmentReminders: boolean;
      paymentReminders: boolean;
      lowStockAlerts: boolean;
      systemAlerts: boolean;
    };
    security?: {
      twoFactorAuth: boolean;
      sessionTimeout: number;
      passwordExpiry: number;
      backupFrequency: string;
    };
  }): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const response = await apiClient.put('/settings', data);
    return response.data;
  }

  // Receptionist APIs
  async getReceptionistDashboard(): Promise<{
    stats: {
      todayAppointments: number;
      todayWalkIns: number;
      pendingCheckIns: number;
      callsToday: number;
    };
    upcomingAppointments: Array<{
      id: string;
      patient: string;
      phone: string;
      time: string;
      doctor: string;
      type: string;
      status: string;
      duration: number;
    }>;
    currentPatients: Array<{
      id: string;
      name: string;
      checkedIn: string;
      doctor: string;
      status: string;
      waitTime: number;
    }>;
    pendingTasks: Array<{
      id: string;
      task: string;
      patient: string;
      priority: string;
      time: string;
      phone?: string;
      source?: string;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/receptionist/dashboard');
    return response.data.data!;
  }

  async checkInPatient(appointmentId: string): Promise<Appointment> {
    const response = await apiClient.post<ApiResponse<{ appointment: Appointment }>>(`/receptionist/checkin/${appointmentId}`);
    return response.data.data!.appointment;
  }

  async getTodayWalkIns(): Promise<Array<{
    _id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    notes?: string;
    status: string;
    created_at: string;
  }>> {
    const response = await apiClient.get<ApiResponse<{ walkIns: any[] }>>('/receptionist/walkins');
    return response.data.data!.walkIns;
  }

  async createWalkIn(walkInData: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    notes?: string;
  }): Promise<{
    _id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    notes?: string;
    status: string;
    source: string;
    created_at: string;
  }> {
    const response = await apiClient.post<ApiResponse<{ walkIn: any }>>('/receptionist/walkins', walkInData);
    return response.data.data!.walkIn;
  }

  async getAppointmentQueue(): Promise<{
    waiting: Appointment[];
    inProgress: Appointment[];
    completed: Appointment[];
    cancelled: Appointment[];
    noShow: Appointment[];
  }> {
    const response = await apiClient.get<ApiResponse<{ queue: any }>>('/receptionist/queue');
    return response.data.data!.queue;
  }

  async updateAppointmentStatus(appointmentId: string, status: string): Promise<Appointment> {
    const response = await apiClient.put<ApiResponse<{ appointment: Appointment }>>(`/receptionist/appointments/${appointmentId}/status`, { status });
    return response.data.data!.appointment;
  }

  // X-ray Analysis API Methods
  async analyzeXray(formData: FormData): Promise<XrayAnalysis> {
    // X-ray analysis requires longer timeout due to AI processing
    const response = await apiClient.post<ApiResponse<XrayAnalysis>>('/xray-analysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10 * 60 * 1000, // 10 minutes timeout for X-ray analysis
    });
    return response.data.data!;
  }

  async getXrayAnalyses(params: { 
    page?: number; 
    limit?: number; 
    status?: string;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<{
    analyses: XrayAnalysis[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: XrayAnalysis[];
      pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
      };
    }>('/xray-analysis', { params });
    return {
      analyses: response.data.data,
      pagination: response.data.pagination
    };
  }

  async getXrayAnalysisById(id: string): Promise<XrayAnalysis> {
    const response = await apiClient.get<ApiResponse<XrayAnalysis>>(`/xray-analysis/${id}`);
    return response.data.data!;
  }

  async getPatientXrayAnalyses(patientId: string, params: { 
    page?: number; 
    limit?: number; 
  } = {}): Promise<{
    analyses: XrayAnalysis[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: XrayAnalysis[];
      pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
      };
    }>(`/xray-analysis/patient/${patientId}`, { params });
    return {
      analyses: response.data.data,
      pagination: response.data.pagination
    };
  }

  async getXrayAnalysisStats(): Promise<XrayAnalysisStats> {
    const response = await apiClient.get<ApiResponse<XrayAnalysisStats>>('/xray-analysis/stats');
    return response.data.data!;
  }

  async deleteXrayAnalysis(id: string): Promise<void> {
    await apiClient.delete(`/xray-analysis/${id}`);
  }

  async checkXrayAnalysisHealth(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
    geminiApiKeyConfigured: boolean;
  }> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      timestamp: string;
      geminiApiKeyConfigured: boolean;
    }>('/xray-analysis/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 