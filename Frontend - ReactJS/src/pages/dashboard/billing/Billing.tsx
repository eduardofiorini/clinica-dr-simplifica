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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Search,
  Plus,
  Filter,
  MoreVertical,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Receipt,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import CreateInvoiceModal from "@/components/modals/CreateInvoiceModal";
import ViewInvoiceModal from "@/components/modals/ViewInvoiceModal";
import EditInvoiceModal from "@/components/modals/EditInvoiceModal";
import DeleteInvoiceModal from "@/components/modals/DeleteInvoiceModal";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { toast } from "@/hooks/use-toast";
import { apiService, type Invoice, type Payment, type PaymentStats } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTab, setSelectedTab] = useState("invoices");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadData();
  }, [currentPage, selectedStatus, searchTerm, selectedTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadInvoices(),
        loadPayments(),
        loadPaymentStats(),
      ]);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };
      
      if (selectedStatus !== "all" && selectedTab === "invoices") {
        params.status = selectedStatus;
      }
      if (searchTerm) params.search = searchTerm;

      const response = await apiService.getInvoices(params);
      setInvoices(response.data.invoices || []);
      setTotalPages(response.data.pagination.pages || 1);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    }
  };

  const loadPayments = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };
      
      if (selectedStatus !== "all" && selectedTab === "payments") {
        params.status = selectedStatus;
      }
      if (searchTerm) params.search = searchTerm;

      const response = await apiService.getPayments(params);
      setPayments(response.data.items || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      setPayments([]);
    }
  };

  const loadPaymentStats = async () => {
    try {
      const stats = await apiService.getPaymentStats();
      setPaymentStats(stats);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };

  const filteredInvoices = (invoices || []).filter((invoice) => {
    if (!invoice) return false;
    
    let patientSearchString = '';
    if (invoice.patient_id) {
      if (typeof invoice.patient_id === 'string') {
        patientSearchString = invoice.patient_id;
      } else {
        patientSearchString = `${invoice.patient_id.first_name || ''} ${invoice.patient_id.last_name || ''} ${invoice.patient_id.email || ''}`.trim();
      }
    }
    
    const matchesSearch =
      (invoice._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.invoice_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientSearchString.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || invoice.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredPayments = (payments || []).filter((payment) => {
    if (!payment) return false;
    
    const invoiceSearchString = typeof payment.invoice_id === 'string' 
      ? payment.invoice_id 
      : (payment.invoice_id && payment.invoice_id.invoice_number) || '';
    
    const patientSearchString = typeof payment.patient_id === 'string' 
      ? payment.patient_id 
      : (payment.patient_id ? `${payment.patient_id.first_name} ${payment.patient_id.last_name} ${payment.patient_id.email || ''}` : '');
    
    const matchesSearch =
      (payment._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoiceSearchString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientSearchString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || payment.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "cancelled":
      case "refunded":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "overdue":
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case "cash":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case "bank_transfer":
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case "upi":
        return <CreditCard className="h-4 w-4 text-orange-600" />;
      case "insurance":
        return <FileText className="h-4 w-4 text-indigo-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPatientDisplay = (patient: string | { _id: string; first_name: string; last_name: string; phone?: string; email?: string } | null) => {
    if (!patient) {
      return 'Unknown Patient';
    }
    if (typeof patient === 'string') {
      return patient;
    }
    return `${patient.first_name} ${patient.last_name}`;
  };

  const getPatientEmail = (patient: string | { _id: string; first_name: string; last_name: string; phone?: string; email?: string } | null) => {
    if (!patient) {
      return '';
    }
    if (typeof patient === 'string') {
      return patient;
    }
    return patient.email || '';
  };

  const getInvoiceDisplay = (invoice: string | { _id: string; invoice_number: string; total_amount: number } | null) => {
    if (!invoice) {
      return 'N/A';
    }
    if (typeof invoice === 'string') {
      return invoice;
    }
    return invoice.invoice_number || invoice._id;
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await apiService.updateInvoice(invoiceId, { status: "paid" });
      toast({
        title: "Payment Recorded",
        description: `Invoice ${invoiceId} has been marked as paid.`,
      });
      loadInvoices(); // Reload invoices
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status.",
        variant: "destructive",
      });
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setViewModalOpen(true);
  };

  const handleEditInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setEditModalOpen(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedInvoiceId(null);
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  const handleModalSuccess = () => {
    loadData(); // Reload all data after successful operations
    handleModalClose();
  };

  const handleRefundPayment = async (paymentId: string) => {
    try {
      await apiService.initiateRefund(paymentId, 0, "Customer requested refund");
      toast({
        title: "Refund Initiated",
        description: `Refund for payment ${paymentId} has been initiated.`,
      });
      loadPayments(); // Reload payments
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate refund.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats from API data or fallback to local calculations
  const totalRevenue = paymentStats?.overview?.total_revenue || 
    (invoices || []).filter(i => i?.status === "paid").reduce((sum, invoice) => sum + (invoice?.total_amount || 0), 0);
  
  const paidAmount = paymentStats?.overview?.total_revenue || 
    (invoices || []).filter(i => i?.status === "paid").reduce((sum, invoice) => sum + (invoice?.total_amount || 0), 0);
  
  const pendingAmount = (invoices || []).filter(i => i?.status === "pending").reduce((sum, invoice) => sum + (invoice?.total_amount || 0), 0);
  
  const overdueAmount = (invoices || []).filter(i => i?.status === "overdue").reduce((sum, invoice) => sum + (invoice?.total_amount || 0), 0);

  const totalPayments = paymentStats?.overview?.total_payments || payments.length;
  const completedPayments = paymentStats?.overview?.completed_payments || payments.filter(p => p?.status === "completed").length;
  const failedPayments = paymentStats?.overview?.failed_payments || payments.filter(p => p?.status === "failed").length;

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">
            Billing & Payments
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1">
            Manage invoices, payments, and financial records
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <CreateInvoiceModal onSuccess={handleModalSuccess} />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-xl xs:text-2xl font-bold text-green-600 mt-1">
                  <CurrencyDisplay 
                    amount={paymentStats?.overview?.total_revenue || 0} 
                    className="text-xl xs:text-2xl font-bold"
                  />
                </p>
              </div>
              <TrendingUp className="h-6 w-6 xs:h-8 xs:w-8 text-green-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pending Payments
                </p>
                <p className="text-xl xs:text-2xl font-bold text-orange-600 mt-1">
                  <CurrencyDisplay 
                    amount={pendingAmount} 
                    className="text-xl xs:text-2xl font-bold"
                  />
                </p>
              </div>
              <Clock className="h-6 w-6 xs:h-8 xs:w-8 text-orange-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Invoices
                </p>
                <p className="text-xl xs:text-2xl font-bold text-gray-900 mt-1">
                  {loading ? "..." : invoices.length}
                </p>
              </div>
              <FileText className="h-6 w-6 xs:h-8 xs:w-8 text-blue-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Processing Payments
                </p>
                <p className="text-xl xs:text-2xl font-bold text-purple-600 mt-1">
                  {paymentStats?.overview?.processing_payments || 0}
                </p>
              </div>
              <DollarSign className="h-6 w-6 xs:h-8 xs:w-8 text-purple-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-3 xs:p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices or payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full xs:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Invoices and Payments */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices" className="text-xs xs:text-sm">
            Invoices ({invoices.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs xs:text-sm">
            Payments ({payments.length})
          </TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-3 xs:space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base xs:text-lg sm:text-xl">Invoice Management</CardTitle>
              <CardDescription className="text-xs xs:text-sm">
                Track and manage all patient invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-gray-500">
                            <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No invoices found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice._id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">
                                {invoice.invoice_number}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {invoice._id.slice(-8)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-gray-900">
                              {getPatientDisplay(invoice.patient_id)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getPatientEmail(invoice.patient_id)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <CurrencyDisplay amount={invoice.total_amount} />
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(invoice.status)}`}>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1 capitalize">{invoice.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">
                              {formatDate(invoice.created_at)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                  <MoreVertical className="h-4 w-4 mr-1" />
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewInvoice(invoice._id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditInvoice(invoice._id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {invoice.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice._id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteInvoice(invoice._id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </Card>
                  ))
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">No invoices found</p>
                  </div>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <Card key={invoice._id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 text-sm">
                              {invoice.invoice_number}
                            </p>
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(invoice.status)}`}>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1 hidden xs:inline capitalize">{invoice.status}</span>
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                              {getPatientDisplay(invoice.patient_id)}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatDate(invoice.created_at)}</span>
                              <CurrencyDisplay 
                                amount={invoice.total_amount} 
                                className="font-medium text-gray-900"
                              />
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 flex-shrink-0 ml-2">
                              <MoreVertical className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice._id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditInvoice(invoice._id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {invoice.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice._id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeleteInvoice(invoice._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-3 xs:space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base xs:text-lg sm:text-xl">Payment History</CardTitle>
              <CardDescription className="text-xs xs:text-sm">
                Track all payment transactions and refunds
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-gray-500">
                            <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No payments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment._id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.transaction_id || payment._id.slice(-8)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(payment.created_at)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-gray-900">
                              {getPatientDisplay(payment.patient_id)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {getInvoiceDisplay(payment.invoice_id)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <CurrencyDisplay amount={payment.amount} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getPaymentMethodIcon(payment.method)}
                              <span className="text-sm capitalize">
                                {payment.method}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              <span className="ml-1 capitalize">{payment.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                  <MoreVertical className="h-4 w-4 mr-1" />
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {payment.status === "completed" && (
                                  <DropdownMenuItem 
                                    onClick={() => handleRefundPayment(payment._id)}
                                    className="text-red-600"
                                  >
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </Card>
                  ))
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">No payments found</p>
                  </div>
                ) : (
                  filteredPayments.map((payment) => (
                    <Card key={payment._id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {payment.transaction_id || `PAY-${payment._id.slice(-8)}`}
                            </p>
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              <span className="ml-1 hidden xs:inline capitalize">{payment.status}</span>
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                              {getPatientDisplay(payment.patient_id)}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-2">
                                {getPaymentMethodIcon(payment.method)}
                                <span className="capitalize">{payment.method}</span>
                              </div>
                              <CurrencyDisplay 
                                amount={payment.amount} 
                                className="font-medium text-gray-900"
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDate(payment.created_at)}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 flex-shrink-0 ml-2">
                              <MoreVertical className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {payment.status === "completed" && (
                              <DropdownMenuItem 
                                onClick={() => handleRefundPayment(payment._id)}
                                className="text-red-600"
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Process Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewInvoiceModal
        invoiceId={selectedInvoiceId}
        isOpen={viewModalOpen}
        onClose={handleModalClose}
      />

      <EditInvoiceModal
        invoiceId={selectedInvoiceId}
        isOpen={editModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <DeleteInvoiceModal
        invoiceId={selectedInvoiceId}
        isOpen={deleteModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Billing;
