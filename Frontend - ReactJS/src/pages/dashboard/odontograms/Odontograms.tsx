import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Zap,
  User,
  Calendar,
  Eye,
  Edit,
  History,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Odontogram, OdontogramStats } from "@/types";
import odontogramApi from "@/services/api/odontogramApi";
import OdontogramDetailModal from "@/components/modals/OdontogramDetailModal";
import NewOdontogramModal from "@/components/modals/NewOdontogramModal";
import OdontogramHistoryModal from "@/components/modals/OdontogramHistoryModal";

const Odontograms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOnly, setActiveOnly] = useState(false);
  
  // Data states
  const [rawOdontograms, setRawOdontograms] = useState<Odontogram[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OdontogramStats | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });
  
  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [newOdontogramModalOpen, setNewOdontogramModalOpen] = useState(false);
  const [selectedOdontogramId, setSelectedOdontogramId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");

  // Compute sorted odontograms using useMemo for performance
  const odontograms = useMemo(() => {
    return [...rawOdontograms].sort((a, b) => {
      const dateA = new Date(a.examination_date).getTime();
      const dateB = new Date(b.examination_date).getTime();
      
      if (sortOrder === "newest") {
        return dateB - dateA; // Newest first (descending)
      } else {
        return dateA - dateB; // Oldest first (ascending)
      }
    });
  }, [rawOdontograms, sortOrder]);

  // Fetch odontograms
  const fetchOdontograms = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
        active_only: activeOnly,
      };

      if (searchTerm) {
        // Search by patient name - we'll need to modify the API to support this
        params.search = searchTerm;
      }
      if (selectedDoctor !== "all") {
        params.doctor_id = selectedDoctor;
      }
      if (selectedPatient !== "all") {
        params.patient_id = selectedPatient;
      }

      // Add date filtering
      if (selectedDateRange !== "all") {
        const now = new Date();
        const startDate = new Date();
        
        switch (selectedDateRange) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            now.setHours(23, 59, 59, 999);
            break;
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "quarter":
            startDate.setMonth(now.getMonth() - 3);
            break;
        }
        
        params.start_date = startDate.toISOString();
        params.end_date = now.toISOString();
      }

      const response = await odontogramApi.getOdontograms(params);
      setRawOdontograms(response.odontograms);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching odontograms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch odontograms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await odontogramApi.getTreatmentSummary();
      setStats(response);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Recalculate treatment summaries
  const handleRecalculateStats = async () => {
    try {
      setLoading(true);
      const result = await odontogramApi.recalculateTreatmentSummaries();
      
      toast({
        title: "Success",
        description: result.message,
      });

      // Refresh stats and data
      await Promise.all([fetchStats(), fetchOdontograms()]);
    } catch (error) {
      console.error("Error recalculating stats:", error);
      toast({
        title: "Error",
        description: "Failed to recalculate treatment summaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOdontograms();
  }, [currentPage, selectedPatient, selectedDoctor, selectedDateRange, activeOnly]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        fetchOdontograms();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleViewDetails = (odontogramId: string) => {
    setSelectedOdontogramId(odontogramId);
    setDetailModalOpen(true);
  };

  const handleViewHistory = (patientId: string) => {
    const odontogram = odontograms.find(o => o.patient_id._id === patientId);
    setSelectedPatientId(patientId);
    setSelectedPatientName(odontogram ? getPatientFullName(odontogram.patient_id) : "");
    setHistoryModalOpen(true);
  };

  const handleSetActive = async (odontogramId: string) => {
    try {
      await odontogramApi.setActiveOdontogram(odontogramId);
      toast({
        title: "Success",
        description: "Odontogram set as active",
      });
      fetchOdontograms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set odontogram as active",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (odontogram: Odontogram) => {
    if (odontogram.is_active) return "default";
    return "secondary";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPatientFullName = (patient: any) => {
    return `${patient.first_name} ${patient.last_name}`;
  };

  const calculateAge = (dateOfBirth: string | Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Odontograms</h1>
          <p className="text-muted-foreground">
            Manage dental charts and treatment plans
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRecalculateStats}
            disabled={loading}
            title="Recalculate treatment statistics"
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">Refresh Stats</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => setNewOdontogramModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Odontogram</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_patients}</div>
              <p className="text-xs text-muted-foreground">
                with dental records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completion_rate}%</div>
              <p className="text-xs text-muted-foreground">
                treatment completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_in_progress_treatments}</div>
              <p className="text-xs text-muted-foreground">
                in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total_estimated_cost)}</div>
              <p className="text-xs text-muted-foreground">
                estimated value
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search - Full width on mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls - Stack on mobile, row on desktop */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {/* Add doctor options dynamically */}
                </SelectContent>
              </Select>

              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={activeOnly ? "default" : "outline"}
                onClick={() => setActiveOnly(!activeOnly)}
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Active Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Odontograms List */}
      <Card>
        <CardHeader>
          <CardTitle>Dental Records</CardTitle>
          <CardDescription>
            View and manage patient dental charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Examination Date / Time</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Treatments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {odontograms.map((odontogram) => (
                      <TableRow key={odontogram._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{getPatientFullName(odontogram.patient_id)}</div>
                              <div className="text-sm text-gray-500">
                                Age: {calculateAge(odontogram.patient_id.date_of_birth)}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <div className="font-medium">
                              Dr. {odontogram.doctor_id.first_name} {odontogram.doctor_id.last_name}
                            </div>
                            {odontogram.doctor_id.specialization && (
                              <div className="text-sm text-gray-500">
                                {odontogram.doctor_id.specialization}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            {formatDateTime(odontogram.examination_date)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            v{odontogram.version}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(odontogram)}>
                            {odontogram.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`text-sm font-medium ${getProgressColor(odontogram.treatment_progress || 0)}`}>
                              {odontogram.treatment_progress || 0}%
                            </div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 transition-all"
                                style={{ width: `${odontogram.treatment_progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            <div>{odontogram.treatment_summary?.completed_treatments || 0} / {odontogram.treatment_summary?.total_planned_treatments || 0}</div>
                            <div className="text-gray-500">treatments</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* Primary Action Buttons */}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(odontogram._id)}
                              className="h-8 px-2 text-xs"
                              title="View Chart"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewHistory(odontogram.patient_id._id)}
                              className="h-8 px-2 text-xs"
                              title="View History"
                            >
                              <History className="h-3 w-3 mr-1" />
                              History
                            </Button>

                            {/* More Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                                  title="More actions"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewDetails(odontogram._id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Chart
                                </DropdownMenuItem>
                                {!odontogram.is_active && (
                                  <DropdownMenuItem onClick={() => handleSetActive(odontogram._id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Set as Active
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards View */}
              <div className="lg:hidden space-y-4">
                {odontograms.map((odontogram) => (
                  <motion.div
                    key={odontogram._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-4 bg-card"
                  >
                    {/* Patient and Status Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-base">{getPatientFullName(odontogram.patient_id)}</div>
                          <div className="text-sm text-muted-foreground">Age: {calculateAge(odontogram.patient_id.date_of_birth)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusBadgeVariant(odontogram)}>
                          {odontogram.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          v{odontogram.version}
                        </Badge>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">
                          Dr. {odontogram.doctor_id.first_name} {odontogram.doctor_id.last_name}
                        </span>
                        {odontogram.doctor_id.specialization && (
                          <div className="text-muted-foreground text-xs">
                            {odontogram.doctor_id.specialization}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Examination: {formatDateTime(odontogram.examination_date)}</span>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Treatment Progress</span>
                        <span className={`font-semibold ${getProgressColor(odontogram.treatment_progress || 0)}`}>
                          {odontogram.treatment_progress || 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${odontogram.treatment_progress || 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {odontogram.treatment_summary?.completed_treatments || 0} of {odontogram.treatment_summary?.total_planned_treatments || 0} treatments completed
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(odontogram._id)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Chart
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewHistory(odontogram.patient_id._id)}
                          className="flex-1"
                        >
                          <History className="h-4 w-4 mr-2" />
                          History
                        </Button>
                      </div>

                      {/* Additional Actions */}
                      <div className="flex space-x-2">
                        {!odontogram.is_active && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetActive(odontogram._id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Set Active
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="px-3"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleViewDetails(odontogram._id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Chart
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No Data State */}
              {odontograms.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No dental records found</div>
                  <Button 
                    className="mt-4"
                    onClick={() => setNewOdontogramModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Odontogram
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {((currentPage - 1) * pagination.items_per_page) + 1} to{" "}
                    {Math.min(currentPage * pagination.items_per_page, pagination.total_items)} of{" "}
                    {pagination.total_items} results
                  </div>
                  <div className="flex space-x-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.total_pages}
                      className="px-3"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <NewOdontogramModal
        open={newOdontogramModalOpen}
        onOpenChange={setNewOdontogramModalOpen}
        onSuccess={() => {
          fetchOdontograms();
          fetchStats();
        }}
      />

      <OdontogramDetailModal 
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        odontogramId={selectedOdontogramId}
        editable={true}
      />
      
      <OdontogramHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        patientId={selectedPatientId}
        patientName={selectedPatientName}
      />
    </div>
  );
};

export default Odontograms;
