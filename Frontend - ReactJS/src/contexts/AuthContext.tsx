import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService, User as ApiUser, LoginRequest, RegisterRequest } from "@/services/api";

export type UserRole =
  | "admin"
  | "doctor"
  | "receptionist"
  | "nurse"
  | "accountant"
  | "staff";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  permissions: string[];
  baseCurrency: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "view_dashboard",
    "manage_users",
    "manage_staff",
    "manage_patients",
    "manage_appointments",
    "manage_billing",
    "manage_inventory",
    "manage_payroll",
    "view_reports",
    "manage_settings",
    "manage_leads",
  ],
  doctor: [
    "view_dashboard",
    "view_patients",
    "manage_appointments",
    "manage_prescriptions",
    "view_medical_records",
    "update_patient_status",
  ],
  receptionist: [
    "view_dashboard",
    "manage_leads",
    "book_appointments",
    "patient_intake",
    "view_patients",
    "basic_billing",
  ],
  nurse: [
    "view_dashboard",
    "view_assigned_patients",
    "update_patient_status",
    "manage_inventory",
    "view_medical_records",
  ],
  accountant: [
    "view_dashboard",
    "manage_billing",
    "manage_invoices",
    "manage_payments",
    "manage_payroll",
    "view_financial_reports",
  ],
};

// Helper function to convert API user to context user
const convertApiUserToContextUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser._id,
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    role: apiUser.role,
    phone: apiUser.phone,
    avatar: apiUser.avatar,
    address: apiUser.address,
    bio: apiUser.bio,
    dateOfBirth: apiUser.date_of_birth,
    specialization: apiUser.specialization,
    licenseNumber: apiUser.license_number,
    department: apiUser.department,
    permissions: ROLE_PERMISSIONS[apiUser.role] || [],
    baseCurrency: apiUser.base_currency || 'USD',
    createdAt: new Date(apiUser.created_at),
    updatedAt: new Date(apiUser.updated_at),
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async (): Promise<void> => {
    try {
      const apiUser = await apiService.getCurrentUser();
      const contextUser = convertApiUserToContextUser(apiUser);
      setUser(contextUser);
      // Update stored user data
      localStorage.setItem("clinic_user", JSON.stringify(contextUser));
    } catch (error) {
      console.error("Error refreshing user data:", error);
      // If refresh fails due to invalid token, clear session
      localStorage.removeItem("clinic_token");
      localStorage.removeItem("clinic_user");
      setUser(null);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      const token = localStorage.getItem("clinic_token");
      const storedUser = localStorage.getItem("clinic_user");
      
      if (token && storedUser) {
        try {
          // Try to get current user from API to ensure token is still valid
          await refreshUser();
        } catch (error) {
          console.error("Error validating stored session:", error);
          // Clear invalid session
          localStorage.removeItem("clinic_token");
          localStorage.removeItem("clinic_user");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const credentials: LoginRequest = { email, password };
      const response = await apiService.login(credentials);
      
      // Store token and user data
      localStorage.setItem("clinic_token", response.token);
      
      const contextUser = convertApiUserToContextUser(response.user);
      setUser(contextUser);
      localStorage.setItem("clinic_user", JSON.stringify(contextUser));
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phone: userData.phone,
      };
      
      // Just call the register API without storing token or setting user
      // User will need to login after registration
      await apiService.register(registerData);
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("clinic_token");
    localStorage.removeItem("clinic_user");
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("clinic_user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    loading,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
