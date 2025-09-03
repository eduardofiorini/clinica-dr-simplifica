import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ClinicProvider } from "@/contexts/ClinicContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RequireRole from "@/components/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ClinicSelection from "./pages/ClinicSelection";
import Dashboard from "./pages/dashboard/Dashboard";
import XrayAnalysis from "./pages/dashboard/xray-analysis/XrayAnalysis";
import Patients from "./pages/dashboard/patients/Patients";
import Appointments from "./pages/dashboard/appointments/Appointments";
import Billing from "./pages/dashboard/billing/Billing";
import Leads from "./pages/dashboard/leads/Leads";
import Services from "./pages/dashboard/services/Services";
import Inventory from "./pages/dashboard/inventory/Inventory";
import Staff from "./pages/dashboard/staff/Staff";
import Invoices from "./pages/dashboard/invoices/Invoices";
import Payments from "./pages/dashboard/payments/Payments";
import Payroll from "./pages/dashboard/payroll/Payroll";
import Prescriptions from "./pages/dashboard/prescriptions/Prescriptions";
import Odontograms from "./pages/dashboard/odontograms/Odontograms";
import Analytics from "./pages/dashboard/analytics/Analytics";
import TestReports from "./pages/dashboard/test-reports/TestReports";
import Tests from "./pages/dashboard/tests/Tests";
import LabVendors from "./pages/dashboard/lab-vendors/LabVendors";
import Methodology from "./pages/dashboard/test-modules/methodology/Methodology";
import TurnaroundTime from "./pages/dashboard/test-modules/turnaround-time/TurnaroundTime";
import SampleType from "./pages/dashboard/test-modules/sample-type/SampleType";
import Category from "./pages/dashboard/test-modules/category/Category";
import Calendar from "./pages/dashboard/calendar/Calendar";

import Profile from "./pages/dashboard/profile/Profile";
import Departments from "./pages/dashboard/departments/Departments";
import Clinics from "./pages/dashboard/clinics/Clinics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Global error handler for Google Translate DOM conflicts
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error && 
          (event.error.message?.includes('removeChild') || 
           event.error.message?.includes('Node') ||
           event.error.message?.includes('translate'))) {
        
        console.warn('Google Translate DOM conflict caught globally:', event.error.message);
        
        // Prevent the error from propagating and crashing the app
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // Global unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && 
          (event.reason.message?.includes('removeChild') || 
           event.reason.message?.includes('Node') ||
           event.reason.message?.includes('translate'))) {
        
        console.warn('Google Translate DOM conflict caught (promise rejection):', event.reason.message);
        
        // Prevent the error from propagating
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ClinicProvider>
              <CurrencyProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Clinic selection - requires auth but no clinic context */}
            <Route
              path="/select-clinic"
              element={
                <ProtectedRoute requireClinic={false}>
                  <ClinicSelection />
                </ProtectedRoute>
              }
            />

            {/* Protected dashboard routes with role-based access */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard - accessible to all authenticated users */}
              <Route index element={<Dashboard />} />

              {/* AI X-ray Analysis - accessible to admin, doctor, nurse */}
              <Route
                path="xray-analysis"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <XrayAnalysis />
                  </RequireRole>
                }
              />

              {/* Patients - accessible to admin, doctor, receptionist, nurse */}
              <Route
                path="patients"
                element={
                  <RequireRole
                    roles={["admin", "doctor", "receptionist", "nurse"]}
                  >
                    <Patients />
                  </RequireRole>
                }
              />

              {/* Appointments - accessible to admin, doctor, receptionist */}
              <Route
                path="appointments"
                element={
                  <RequireRole roles={["admin", "doctor", "receptionist"]}>
                    <Appointments />
                  </RequireRole>
                }
              />

              {/* Leads - accessible to admin, receptionist */}
              <Route
                path="leads"
                element={
                  <RequireRole roles={["admin", "receptionist"]}>
                    <Leads />
                  </RequireRole>
                }
              />

              {/* Billing - accessible to admin, accountant, receptionist */}
              <Route
                path="billing"
                element={
                  <RequireRole roles={["admin", "accountant", "receptionist"]}>
                    <Billing />
                  </RequireRole>
                }
              />

              {/* Financial Management - admin and accountant only */}
              <Route
                path="invoices"
                element={
                  <RequireRole roles={["admin", "accountant"]}>
                    <Invoices />
                  </RequireRole>
                }
              />

              <Route
                path="payments"
                element={
                  <RequireRole roles={["admin", "accountant"]}>
                    <Payments />
                  </RequireRole>
                }
              />

              <Route
                path="payroll"
                element={
                  <RequireRole roles={["admin", "accountant"]}>
                    <Payroll />
                  </RequireRole>
                }
              />

              {/* Services - accessible to admin, doctor */}
              <Route
                path="services"
                element={
                  <RequireRole roles={["admin", "doctor"]}>
                    <Services />
                  </RequireRole>
                }
              />

              {/* Departments - admin only */}
              <Route
                path="departments"
                element={
                  <RequireRole roles={["admin"]}>
                    <Departments />
                  </RequireRole>
                }
              />

              {/* Clinics - admin only */}
              <Route
                path="clinics"
                element={
                  <RequireRole roles={["admin"]}>
                    <Clinics />
                  </RequireRole>
                }
              />

              {/* Inventory - accessible to admin, nurse */}
              <Route
                path="inventory"
                element={
                  <RequireRole roles={["admin", "nurse"]}>
                    <Inventory />
                  </RequireRole>
                }
              />

              {/* Staff Management - admin only */}
              <Route
                path="staff"
                element={
                  <RequireRole roles={["admin"]}>
                    <Staff />
                  </RequireRole>
                }
              />

              {/* Prescriptions - accessible to admin, doctor */}
              <Route
                path="prescriptions"
                element={
                  <RequireRole roles={["admin", "doctor"]}>
                    <Prescriptions />
                  </RequireRole>
                }
              />

              {/* Odontograms - accessible to admin, doctor */}
              <Route
                path="odontograms"
                element={
                  <RequireRole roles={["admin", "doctor"]}>
                    <Odontograms />
                  </RequireRole>
                }
              />

              {/* Tests - accessible to admin, doctor, nurse */}
              <Route
                path="tests"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <Tests />
                  </RequireRole>
                }
              />

              {/* Test Reports - accessible to admin, doctor, nurse */}
              <Route
                path="test-reports"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <TestReports />
                  </RequireRole>
                }
              />

              {/* Lab Vendors - accessible to admin, accountant */}
              <Route
                path="lab-vendors"
                element={
                  <RequireRole roles={["admin", "accountant"]}>
                    <LabVendors />
                  </RequireRole>
                }
              />

              {/* Test Modules - accessible to admin, doctor, nurse */}
              <Route
                path="test-modules/methodology"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <Methodology />
                  </RequireRole>
                }
              />
              <Route
                path="test-modules/turnaround-time"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <TurnaroundTime />
                  </RequireRole>
                }
              />
              <Route
                path="test-modules/sample-type"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <SampleType />
                  </RequireRole>
                }
              />
              <Route
                path="test-modules/category"
                element={
                  <RequireRole roles={["admin", "doctor", "nurse"]}>
                    <Category />
                  </RequireRole>
                }
              />

              {/* Calendar - accessible to admin, doctor, receptionist */}
              <Route
                path="calendar"
                element={
                  <RequireRole roles={["admin", "doctor", "receptionist"]}>
                    <Calendar />
                  </RequireRole>
                }
              />

              {/* Reports - accessible to admin, accountant */}
              <Route
                path="reports"
                element={
                  <RequireRole roles={["admin", "accountant"]}>
                    <Analytics />
                  </RequireRole>
                }
              />





              {/* Profile - accessible to all authenticated users */}
              <Route
                path="profile"
                element={
                  <RequireRole
                    roles={[
                      "admin",
                      "doctor",
                      "receptionist",
                      "nurse",
                      "accountant",
                    ]}
                  >
                    <Profile />
                  </RequireRole>
                }
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CurrencyProvider>
      </ClinicProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
