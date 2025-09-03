import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Briefcase,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Send,
  Calculator,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { apiService, type Payroll, type PayrollStats } from "@/services/api";

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [payrollEntries, setPayrollEntries] = useState<Payroll[]>([]);
  const [stats, setStats] = useState<PayrollStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { formatAmount } = useCurrency();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [editForm, setEditForm] = useState<Partial<Payroll>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load payroll data
  useEffect(() => {
    loadPayrolls();
    loadStats();
  }, [currentPage, selectedStatus, selectedMonth, searchTerm]);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };
      
      if (selectedStatus !== "all") params.status = selectedStatus;
      if (selectedMonth !== "current") params.month = selectedMonth;
      if (searchTerm) params.search = searchTerm;

      const response = await apiService.getPayrolls(params);
      
      // Ensure we have a valid array of payroll objects
      const payrollData = response.data.items || [];
      
      setPayrollEntries(payrollData);
      setTotalPages(response.data.pagination.pages || 1);
    } catch (error) {
      console.error('Error loading payrolls:', error);
      toast({
        title: "Error",
        description: "Failed to load payroll data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await apiService.getPayrollStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading payroll stats:', error);
    }
  };

  // Mock payroll data for fallback (keep reduced for initial development)
  const mockPayrollEntries = [
    {
      id: "PAY-001",
      employeeId: "EMP-001",
      employeeName: "Dr. John Smith",
      department: "General Medicine",
      role: "Doctor",
      month: "January 2024",
      baseSalary: 15000,
      overtime: 500,
      bonus: 1000,
      allowances: 300,
      deductions: 800,
      tax: 2400,
      netSalary: 13600,
      status: "paid",
      payDate: "2024-01-31",
      workingDays: 22,
      totalDays: 31,
      leaves: 2,
    },
    {
      id: "PAY-002",
      employeeId: "EMP-002",
      employeeName: "Dr. Sarah Johnson",
      department: "Cardiology",
      role: "Doctor",
      month: "January 2024",
      baseSalary: 18000,
      overtime: 750,
      bonus: 1500,
      allowances: 400,
      deductions: 600,
      tax: 3015,
      netSalary: 17035,
      status: "paid",
      payDate: "2024-01-31",
      workingDays: 23,
      totalDays: 31,
      leaves: 1,
    },
    {
      id: "PAY-003",
      employeeId: "EMP-003",
      employeeName: "Emily Davis",
      department: "Nursing",
      role: "Nurse",
      month: "January 2024",
      baseSalary: 6500,
      overtime: 300,
      bonus: 200,
      allowances: 150,
      deductions: 100,
      tax: 915,
      netSalary: 6135,
      status: "pending",
      payDate: null,
      workingDays: 24,
      totalDays: 31,
      leaves: 0,
    },
    {
      id: "PAY-004",
      employeeId: "EMP-004",
      employeeName: "Michael Brown",
      department: "Administration",
      role: "Receptionist",
      month: "January 2024",
      baseSalary: 4500,
      overtime: 150,
      bonus: 100,
      allowances: 100,
      deductions: 50,
      tax: 630,
      netSalary: 4170,
      status: "processed",
      payDate: null,
      workingDays: 22,
      totalDays: 31,
      leaves: 1,
    },
    {
      id: "PAY-005",
      employeeId: "EMP-005",
      employeeName: "Lisa Wilson",
      department: "Finance",
      role: "Accountant",
      month: "January 2024",
      baseSalary: 8000,
      overtime: 200,
      bonus: 400,
      allowances: 200,
      deductions: 150,
      tax: 1290,
      netSalary: 7360,
      status: "pending",
      payDate: null,
      workingDays: 23,
      totalDays: 31,
      leaves: 1,
    },
  ];

  const getEmployeeDisplay = (employee: string | { _id: string; email: string; first_name: string; last_name: string; role: string; phone?: string }) => {
    if (typeof employee === 'string') {
      return employee;
    }
    return `${employee.first_name} ${employee.last_name}`;
  };

  const getEmployeeEmail = (employee: string | { _id: string; email: string; first_name: string; last_name: string; role: string; phone?: string }) => {
    if (typeof employee === 'string') {
      return employee;
    }
    return employee.email || '';
  };

  const getEmployeeRole = (employee: string | { _id: string; email: string; first_name: string; last_name: string; role: string; phone?: string }) => {
    if (typeof employee === 'string') {
      return 'Staff Member';
    }
    return employee.role || 'Staff Member';
  };

  const filteredPayroll = payrollEntries.filter((entry) => {
    // Safety check for employee_id - handle both string and object cases
    const employeeSearchString = typeof entry.employee_id === 'string' 
      ? entry.employee_id 
      : `${entry.employee_id.first_name} ${entry.employee_id.last_name} ${entry.employee_id.email || ''}`;
    
    const matchesSearch =
      employeeSearchString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry._id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || entry.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processed":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "processed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Using the currency context for dynamic currency formatting
  const formatCurrency = (amount: number) => {
    return formatAmount(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewPayslip = async (payrollId: string) => {
    try {
      setIsLoading(true);
      const payrollData = await apiService.getPayroll(payrollId);
      setSelectedPayroll(payrollData);
      setModalMode('view');
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPayroll = async (payrollId: string) => {
    try {
      setIsLoading(true);
      const payrollData = await apiService.getPayroll(payrollId);
      setSelectedPayroll(payrollData);
      setEditForm(payrollData);
      setModalMode('edit');
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll details for editing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePayroll = async () => {
    if (!selectedPayroll || !editForm) return;

    try {
      setIsLoading(true);
      const updatedPayroll = await apiService.updatePayroll(selectedPayroll._id, editForm);
      
      // Update the payroll in the list
      setPayrollEntries(prev => 
        prev.map(entry => 
          entry._id === updatedPayroll._id ? updatedPayroll : entry
        )
      );

      toast({
        title: "Success",
        description: "Payroll details updated successfully.",
      });

      setIsModalOpen(false);
      setSelectedPayroll(null);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payroll details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPayment = async (payrollId: string) => {
    try {
      await apiService.updatePayrollStatus(payrollId, 'paid');
      
      // Update the payroll in the list
      setPayrollEntries(prev => 
        prev.map(entry => 
          entry._id === payrollId 
            ? { ...entry, status: 'paid' as const, pay_date: new Date().toISOString() }
            : entry
        )
      );

      toast({
        title: "Payment Processed",
        description: "Payment has been processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment.",
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayroll(null);
    setEditForm({});
    setModalMode('view');
  };



  // Use stats from API or calculate from current data
  const totalEmployees = stats?.overview?.total_employees || payrollEntries.length;
  const totalPayroll = stats?.overview?.total_payroll || payrollEntries.reduce(
    (sum, entry) => sum + entry.net_salary,
    0,
  );
  const paidEntries = stats?.overview?.paid_entries || payrollEntries.filter((e) => e.status === "paid").length;
  const pendingEntries = stats?.overview?.pending_entries || payrollEntries.filter(
    (e) => e.status === "pending",
  ).length;

  const departments = ["all"]; // Department filtering disabled for now since API doesn't include department info

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Payroll Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage staff salaries, payslips, and payroll processing
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalEmployees}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Payroll
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    <CurrencyDisplay amount={totalPayroll} variant="large" />
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-3xl font-bold text-green-600">
                    {paidEntries}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {pendingEntries}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0 sm:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Payroll Records</CardTitle>
            <CardDescription>
              Monthly payroll processing and salary management for all staff
              members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">Employee</TableHead>
                    <TableHead className="min-w-[140px]">Department</TableHead>
                    <TableHead className="min-w-[120px]">Base Salary</TableHead>
                    <TableHead className="min-w-[120px]">Additions</TableHead>
                    <TableHead className="min-w-[120px]">Deductions</TableHead>
                    <TableHead className="min-w-[120px]">Net Salary</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Pay Date</TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {getEmployeeDisplay(entry.employee_id)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getEmployeeEmail(entry.employee_id)} • {getEmployeeRole(entry.employee_id)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Department N/A</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(entry.base_salary)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.working_days}/{entry.total_days} days
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Overtime: {formatCurrency(entry.overtime)}</div>
                          <div>Bonus: {formatCurrency(entry.bonus)}</div>
                          <div>
                            Allowances: {formatCurrency(entry.allowances)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Tax: {formatCurrency(entry.tax)}</div>
                          <div>Other: {formatCurrency(entry.deductions)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-lg text-green-600">
                          <CurrencyDisplay amount={entry.net_salary} variant="large" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(entry.status)}
                          <Badge
                            className={`text-xs ${getStatusColor(entry.status)}`}
                          >
                            {entry.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(entry.pay_date)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              <MoreVertical className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewPayslip(entry._id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {entry.status !== "paid" && (
                              <DropdownMenuItem
                                onClick={() => handleEditPayroll(entry._id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                            )}
                            {entry.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleProcessPayment(entry._id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Process Payment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredPayroll.map((entry) => (
                <div
                  key={entry._id}
                  className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                >
                  {/* Header with Employee Info and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-lg">
                          {getEmployeeDisplay(entry.employee_id)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getEmployeeEmail(entry.employee_id)} • {getEmployeeRole(entry.employee_id)}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        entry.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : entry.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : entry.status === "processed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </div>

                  {/* Department and Period */}
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium text-gray-900">
                        N/A
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pay Period:</span>
                      <span className="font-medium text-gray-900">
                        {entry.month} {entry.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Working Days:</span>
                      <span className="font-medium text-gray-900">
                        {entry.working_days}/{entry.total_days} days
                      </span>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Base Salary
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(entry.base_salary)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Net Salary
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        <CurrencyDisplay amount={entry.net_salary} variant="large" />
                      </div>
                    </div>
                  </div>

                  {/* Additions and Deductions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Additions
                      </div>
                      <div className="text-sm">
                        <div className="text-green-600">
                          Overtime: {formatCurrency(entry.overtime)}
                        </div>
                        <div className="text-green-600">
                          Bonus: {formatCurrency(entry.bonus)}
                        </div>
                        <div className="text-green-600">
                          Allowances: {formatCurrency(entry.allowances)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Deductions
                      </div>
                      <div className="text-sm">
                        <div className="text-red-600">
                          Tax: {formatCurrency(entry.tax)}
                        </div>
                        <div className="text-red-600">
                          Other: {formatCurrency(entry.deductions)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pay Date */}
                  {entry.pay_date && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Pay Date
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(entry.pay_date)}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Employee ID: {typeof entry.employee_id === 'string' ? entry.employee_id : entry.employee_id._id}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4 mr-1" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewPayslip(entry._id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {entry.status !== "paid" && (
                          <DropdownMenuItem
                            onClick={() => handleEditPayroll(entry._id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                        )}
                        {entry.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleProcessPayment(entry._id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Process Payment
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payroll Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'view' ? 'Payroll Details' : 'Edit Payroll Details'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'view'
                ? 'View complete payroll information and salary breakdown.'
                : 'Edit payroll information. Only non-paid entries can be modified.'}
            </DialogDescription>
          </DialogHeader>

          {selectedPayroll && (
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Employee Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-sm font-semibold">
                      {getEmployeeDisplay(selectedPayroll.employee_id)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm">
                      {getEmployeeEmail(selectedPayroll.employee_id)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Role</Label>
                    <p className="text-sm">
                      {getEmployeeRole(selectedPayroll.employee_id)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                    <p className="text-sm">
                      {typeof selectedPayroll.employee_id === 'string' 
                        ? selectedPayroll.employee_id 
                        : selectedPayroll.employee_id._id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Period Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Pay Period Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Month & Year</Label>
                    <p className="text-sm font-semibold">
                      {selectedPayroll.month} {selectedPayroll.year}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Working Days</Label>
                    {modalMode === 'edit' ? (
                      <Input
                        type="number"
                        value={editForm.working_days || selectedPayroll.working_days}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          working_days: parseInt(e.target.value) || 0
                        })}
                        className="mt-1"
                        min="0"
                        max="31"
                      />
                    ) : (
                      <p className="text-sm font-semibold">
                        {selectedPayroll.working_days}/{selectedPayroll.total_days} days
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Leaves Taken</Label>
                    {modalMode === 'edit' ? (
                      <Input
                        type="number"
                        value={editForm.leaves || selectedPayroll.leaves}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          leaves: parseInt(e.target.value) || 0
                        })}
                        className="mt-1"
                        min="0"
                      />
                    ) : (
                      <p className="text-sm font-semibold">{selectedPayroll.leaves} days</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Salary Breakdown
                </h3>
                
                {/* Base Salary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Base Salary</Label>
                      {modalMode === 'edit' ? (
                        <Input
                          type="number"
                          value={editForm.base_salary || selectedPayroll.base_salary}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            base_salary: parseFloat(e.target.value) || 0
                          })}
                          className="mt-1"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-lg font-bold text-gray-900">
                          <CurrencyDisplay amount={selectedPayroll.base_salary} variant="large" />
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(selectedPayroll.status)}
                        <Badge className={getStatusColor(selectedPayroll.status)}>
                          {selectedPayroll.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additions */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">Additions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Overtime</Label>
                      {modalMode === 'edit' ? (
                        <Input
                          type="number"
                          value={editForm.overtime || selectedPayroll.overtime}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            overtime: parseFloat(e.target.value) || 0
                          })}
                          className="mt-1"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-green-700">
                          {formatCurrency(selectedPayroll.overtime)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Bonus</Label>
                      {modalMode === 'edit' ? (
                        <Input
                          type="number"
                          value={editForm.bonus || selectedPayroll.bonus}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            bonus: parseFloat(e.target.value) || 0
                          })}
                          className="mt-1"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-green-700">
                          {formatCurrency(selectedPayroll.bonus)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Allowances</Label>
                      {modalMode === 'edit' ? (
                        <Input
                          type="number"
                          value={editForm.allowances || selectedPayroll.allowances}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            allowances: parseFloat(e.target.value) || 0
                          })}
                          className="mt-1"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-green-700">
                          {formatCurrency(selectedPayroll.allowances)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3">Deductions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tax</Label>
                      {modalMode === 'edit' ? (
                        <Input
                          type="number"
                          value={editForm.tax || selectedPayroll.tax}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            tax: parseFloat(e.target.value) || 0
                          })}
                          className="mt-1"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-red-700">
                          {formatCurrency(selectedPayroll.tax)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Other Deductions</Label>
                      {modalMode === 'edit' ? (
                        <Input
                          type="number"
                          value={editForm.deductions || selectedPayroll.deductions}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            deductions: parseFloat(e.target.value) || 0
                          })}
                          className="mt-1"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-red-700">
                          {formatCurrency(selectedPayroll.deductions)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Net Salary</Label>
                      <p className="text-2xl font-bold text-blue-700">
                        <CurrencyDisplay amount={selectedPayroll.net_salary} variant="large" />
                      </p>
                    </div>
                    {selectedPayroll.pay_date && (
                      <div className="text-right">
                        <Label className="text-sm font-medium text-gray-600">Pay Date</Label>
                        <p className="text-sm font-semibold">{formatDate(selectedPayroll.pay_date)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Record Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Created At</Label>
                    <p className="text-sm">
                      {new Date(selectedPayroll.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                    <p className="text-sm">
                      {new Date(selectedPayroll.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={closeModal} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              {modalMode === 'edit' ? 'Cancel' : 'Close'}
            </Button>
            {modalMode === 'edit' && (
              <Button onClick={handleSavePayroll} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;
