import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  Eye,
  Award,
  BarChart3,
  User,
  Stethoscope,
  Heart,
  DollarSign,
  Shield,
  RefreshCw,
  Loader2,
  Filter,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TrainingProgressData {
  _id: string;
  user_id: User;
  training_id: {
    _id: string;
    name: string;
    role: string;
  };
  role: string;
  overall_progress: number;
  modules_progress: Array<{
    module_title: string;
    completed: boolean;
    progress_percentage: number;
    lessons_completed: string[];
  }>;
  started_at: string;
  last_accessed: string;
  completed_at?: string;
  is_completed: boolean;
  certificate_issued: boolean;
}

interface TrainingAnalytics {
  total_users: number;
  total_trainings_started: number;
  completed_trainings: number;
  in_progress: number;
  certificates_issued: number;
  completion_rate: number;
  avg_progress: number;
  role_statistics: Array<{
    role: string;
    total_users: number;
    completed: number;
    in_progress: number;
    completion_rate: number;
  }>;
}

const TrainingProgress: React.FC = () => {
  const { user } = useAuth();
  const [trainingProgressData, setTrainingProgressData] = useState<TrainingProgressData[]>([]);
  const [analytics, setAnalytics] = useState<TrainingAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<TrainingProgressData | null>(null);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('clinic_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch training progress data
  const fetchTrainingProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('clinic_token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/training/admin/progress`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch training progress (${response.status})`);
        }
      }

      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data.analytics);
        setTrainingProgressData(data.data.progress || []);
      } else {
        throw new Error(data.message || 'Failed to fetch training progress');
      }
    } catch (err: any) {
      console.error('Fetch training progress error:', err);
      setError(err.message || 'Failed to fetch training progress');
      toast.error(err.message || 'Failed to fetch training progress');
      
      // If authentication error, redirect to login
      if (err.message.includes('Authentication failed') || err.message.includes('No authentication token')) {
        localStorage.removeItem('clinic_token');
        localStorage.removeItem('clinic_user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingProgress();
  }, []);

  // Filter training progress data
  const filteredData = trainingProgressData.filter((item) => {
    const matchesSearch = 
      item.user_id?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_id?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "completed" && item.is_completed) ||
      (statusFilter === "in-progress" && !item.is_completed && item.overall_progress > 0) ||
      (statusFilter === "not-started" && item.overall_progress === 0);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Shield;
      case "doctor": return Stethoscope;
      case "nurse": return Heart;
      case "receptionist": return Users;
      case "accountant": return DollarSign;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 border-purple-200";
      case "doctor": return "bg-blue-100 text-blue-800 border-blue-200";
      case "nurse": return "bg-red-100 text-red-800 border-red-200";
      case "receptionist": return "bg-green-100 text-green-800 border-green-200";
      case "accountant": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (item: TrainingProgressData) => {
    if (item.is_completed) {
      return (
        <Badge 
          variant="outline" 
          className="bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (item.overall_progress > 0) {
      return (
        <Badge 
          variant="outline" 
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleIssueCertificate = async (progressId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/training/admin/progress/${progressId}/certificate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('Training progress not found.');
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to issue certificate (${response.status})`);
        }
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Certificate issued successfully!');
        fetchTrainingProgress(); // Refresh data
      } else {
        throw new Error(data.message || 'Failed to issue certificate');
      }
    } catch (err: any) {
      console.error('Issue certificate error:', err);
      toast.error(err.message || 'Failed to issue certificate');
      
      // If authentication error, redirect to login
      if (err.message.includes('Authentication failed')) {
        localStorage.removeItem('clinic_token');
        localStorage.removeItem('clinic_user');
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            Training Progress Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor and manage training progress across all staff members
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && analytics.total_users > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.total_users}
              </div>
              <p className="text-xs text-muted-foreground">
                All staff members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.completed_trainings}
              </div>
              <p className="text-xs text-muted-foreground">Finished training</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.in_progress}
              </div>
              <p className="text-xs text-muted-foreground">Active learners</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Certificates</CardTitle>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.certificates_issued}
              </div>
              <p className="text-xs text-muted-foreground">Certificates issued</p>
            </CardContent>
          </Card>
        </div>
      ) : analytics && analytics.total_users === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <GraduationCap className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Training Data Yet</h3>
                <p className="text-gray-600 mb-4">
                  No users have started their training programs yet. Training progress will appear here once users begin their training.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Users can start training from the Training page</p>
                  <p>• Progress will be tracked automatically</p>
                  <p>• Certificates can be issued upon completion</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Overall Progress */}
      {analytics && analytics.total_users > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Overall Training Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-gray-500">{analytics.completion_rate}%</span>
                </div>
                <Progress value={analytics.completion_rate} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Average Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(analytics.avg_progress)}%</span>
                </div>
                <Progress value={analytics.avg_progress} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 sm:h-10"
                />
              </div>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full xs:w-[120px] sm:w-[140px] h-9 sm:h-10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full xs:w-[120px] sm:w-[140px] h-9 sm:h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">User Training Progress ({filteredData.length})</CardTitle>
          <CardDescription className="text-sm">
            Detailed view of each user's training progress and completion status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading training progress...</span>
            </div>
          ) : error ? (
            <div className="m-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {trainingProgressData.length === 0 
                  ? "No training progress data available. Users need to start their training programs first."
                  : "No training progress found matching your filters."
                }
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[200px]">User Details</TableHead>
                      <TableHead className="min-w-[100px]">Role</TableHead>
                      <TableHead className="min-w-[150px]">Training</TableHead>
                      <TableHead className="min-w-[120px]">Progress</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Last Accessed</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => {
                      const RoleIcon = getRoleIcon(item.role);
                      return (
                        <TableRow key={item._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-gray-600">
                                  {item.user_id?.firstName?.charAt(0)}{item.user_id?.lastName?.charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {item.user_id?.firstName} {item.user_id?.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {item.user_id?.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleColor(item.role)}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              <span className="capitalize">{item.role}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-sm truncate">{item.training_id?.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="w-24">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">{item.overall_progress}%</span>
                              </div>
                              <Progress value={item.overall_progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(item)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(item.last_accessed)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUser(item)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] overflow-hidden p-0">
                                  <DialogHeader className="p-6 pb-4">
                                    <DialogTitle>Training Progress Details</DialogTitle>
                                    <DialogDescription>
                                      Detailed view of {item.user_id?.firstName} {item.user_id?.lastName}'s training progress
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedUser && (
                                    <div className="px-6 pb-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-gray-600">Overall Progress</label>
                                          <div className="mt-1">
                                            <Progress value={selectedUser.overall_progress} className="h-3" />
                                            <span className="text-sm text-gray-500 mt-1">{selectedUser.overall_progress}%</span>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-600">Status</label>
                                          <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 mb-3 block">Module Progress</label>
                                        <div className="space-y-3">
                                          {selectedUser.modules_progress.map((module, index) => (
                                            <div key={index} className="border rounded-lg p-3">
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">{module.module_title}</span>
                                                <Badge 
                                                  variant="outline" 
                                                  className={module.completed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                                                >
                                                  {module.progress_percentage}%
                                                </Badge>
                                              </div>
                                              <Progress value={module.progress_percentage} className="h-2" />
                                              <div className="text-sm text-gray-500 mt-1">
                                                {module.lessons_completed.length} lessons completed
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              {item.is_completed && !item.certificate_issued && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleIssueCertificate(item._id)}
                                >
                                  <Award className="h-4 w-4 mr-1" />
                                  Certificate
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredData.map((item) => {
                  const RoleIcon = getRoleIcon(item.role);
                  return (
                    <div
                      key={item._id}
                      className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                    >
                      {/* Header with User Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">
                            {item.user_id?.firstName?.charAt(0)}{item.user_id?.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm truncate">
                            {item.user_id?.firstName} {item.user_id?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.user_id?.email}
                          </div>
                        </div>
                      </div>

                      {/* Role, Training, and Status */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Role
                            </div>
                            <Badge variant="outline" className={getRoleColor(item.role)}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              <span className="capitalize">{item.role}</span>
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Status
                            </div>
                            {getStatusBadge(item)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            Training
                          </div>
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {item.training_id?.name}
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Progress</span>
                          <span className="text-sm text-gray-500">{item.overall_progress}%</span>
                        </div>
                        <Progress value={item.overall_progress} className="h-3" />
                      </div>

                      {/* Last Accessed */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        <span>Last accessed: {formatDate(item.last_accessed)}</span>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(item)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] overflow-hidden p-0">
                              <DialogHeader className="p-4 pb-2">
                                <DialogTitle className="text-base">Training Progress Details</DialogTitle>
                                <DialogDescription className="text-sm">
                                  Detailed view of {item.user_id?.firstName} {item.user_id?.lastName}'s training progress
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Overall Progress</label>
                                      <div className="mt-1">
                                        <Progress value={selectedUser.overall_progress} className="h-3" />
                                        <span className="text-sm text-gray-500 mt-1">{selectedUser.overall_progress}%</span>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Status</label>
                                      <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-600 mb-3 block">Module Progress</label>
                                    <div className="space-y-3">
                                      {selectedUser.modules_progress.map((module, index) => (
                                        <div key={index} className="border rounded-lg p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">{module.module_title}</span>
                                            <Badge 
                                              variant="outline" 
                                              className={module.completed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                                            >
                                              {module.progress_percentage}%
                                            </Badge>
                                          </div>
                                          <Progress value={module.progress_percentage} className="h-2" />
                                          <div className="text-sm text-gray-500 mt-1">
                                            {module.lessons_completed.length} lessons completed
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {item.is_completed && !item.certificate_issued && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIssueCertificate(item._id)}
                            >
                              <Award className="h-4 w-4 mr-1" />
                              Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingProgress; 