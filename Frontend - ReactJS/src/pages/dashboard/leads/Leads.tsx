import React, { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  UserPlus,
  Phone,
  Mail,
  Globe,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Lead } from "@/types";
import { useLeads, useUpdateLeadStatus, useDeleteLead } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import AddLeadModal from "@/components/modals/AddLeadModal";
import EditLeadModal from "@/components/modals/EditLeadModal";
import ViewLeadModal from "@/components/modals/ViewLeadModal";
import ConvertLeadModal from "@/components/modals/ConvertLeadModal";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  // API queries and mutations
  const { 
    data: leadsResponse, 
    isLoading, 
    error,
    refetch
  } = useLeads({
    page: 1,
    limit: 100,
    search: searchTerm || undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    source: selectedSource !== "all" ? selectedSource : undefined,
  });

  const updateStatusMutation = useUpdateLeadStatus();
  const deleteLeadMutation = useDeleteLead();

  const leads = leadsResponse?.data.items || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "contacted":
        return <Phone className="h-4 w-4 text-orange-600" />;
      case "converted":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case "lost":
        return <UserX className="h-4 w-4 text-red-600" />;
      default:
        return <UserPlus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "lost":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "website":
        return <Globe className="h-4 w-4" />;
      case "referral":
        return <Users className="h-4 w-4" />;
      case "social":
        return <UserPlus className="h-4 w-4" />;
      case "advertisement":
        return <TrendingUp className="h-4 w-4" />;
      case "walk-in":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) {
      return "N/A";
    }
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }
      
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await updateStatusMutation.mutateAsync({ id: leadId, status: newStatus });
      toast({
        title: "Status updated",
        description: "Lead status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteLeadMutation.mutateAsync(leadId);
      toast({
        title: "Lead deleted",
        description: "Lead has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead.",
        variant: "destructive",
      });
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditModalOpen(true);
  };

  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead);
    setConvertModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Calculate stats
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading leads: {error.message}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            Leads & CRM
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage potential patients and track conversions
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <AddLeadModal 
            trigger={
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Lead</span>
                <span className="sm:hidden">Add</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalLeads}
            </div>
            <p className="text-xs text-muted-foreground">
              All potential patients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : newLeads}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting contact</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Converted</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : convertedLeads}
            </div>
            <p className="text-xs text-muted-foreground">Now patients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${conversionRate}%`}
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 sm:h-10"
                />
              </div>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full xs:w-[120px] sm:w-[140px] h-9 sm:h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-full xs:w-[120px] sm:w-[140px] h-9 sm:h-10">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Lead Management ({totalLeads})</CardTitle>
          <CardDescription className="text-sm">
            Track and manage potential patients through the conversion funnel
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedStatus !== "all" || selectedSource !== "all" 
                  ? "No leads found matching your filters." 
                  : "No leads found. Add your first lead to get started."}
              </p>
              <AddLeadModal 
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Lead
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[200px]">Lead Details</TableHead>
                      <TableHead className="min-w-[180px]">Contact Info</TableHead>
                      <TableHead className="min-w-[120px] hidden lg:table-cell">Source</TableHead>
                      <TableHead className="min-w-[140px] hidden lg:table-cell">Service Interest</TableHead>
                      <TableHead className="min-w-[120px] hidden xl:table-cell">Assigned To</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px] hidden xl:table-cell">Created</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead._id || lead.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {lead.firstName.charAt(0)}
                                {lead.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">
                                {lead.firstName} {lead.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                Lead #{(lead._id || lead.id).slice(-6)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {lead.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center space-x-2">
                            {getSourceIcon(lead.source)}
                            <span className="capitalize text-sm">{lead.source}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {lead.serviceInterest}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <span className="text-sm">
                            {lead.assignedTo || (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(lead.status)}
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(lead.status)}`}
                            >
                              <span className="capitalize">{lead.status}</span>
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <span className="text-sm">{formatDate(lead.created_at || lead.createdAt)}</span>
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
                              <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Lead
                              </DropdownMenuItem>
                              {lead.status === "new" && (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusUpdate(lead._id || lead.id, "contacted")}
                                >
                                  <Phone className="mr-2 h-4 w-4" />
                                  Mark as Contacted
                                </DropdownMenuItem>
                              )}
                              {lead.status !== "converted" && (
                                <DropdownMenuItem onClick={() => handleConvertLead(lead)}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Convert to Patient
                                </DropdownMenuItem>
                              )}
                              {lead.status !== "lost" && (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleStatusUpdate(lead._id || lead.id, "lost")}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Mark as Lost
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteLead(lead._id || lead.id)}
                              >
                                Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {leads.map((lead) => (
                  <div
                    key={lead._id || lead.id}
                    className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                  >
                    {/* Header with Lead and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="text-sm">
                            {lead.firstName.charAt(0)}
                            {lead.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Lead #{(lead._id || lead.id).slice(-6)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(lead.status)}
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(lead.status)}`}
                        >
                          <span className="capitalize">{lead.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      {lead.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-900 truncate">{lead.email}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900">{lead.phone}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Source
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSourceIcon(lead.source)}
                          <span className="capitalize text-sm text-gray-900">
                            {lead.source}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Service Interest
                        </div>
                        <Badge variant="outline" className="text-xs w-fit">
                          {lead.serviceInterest}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Assigned To
                        </div>
                        <div className="text-sm">
                          {lead.assignedTo || (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Created
                        </div>
                        <div className="text-sm text-gray-900">
                          {formatDate(lead.created_at || lead.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Notes and Actions */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        Notes: {lead.notes || "No notes available"}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          ID: {(lead._id || lead.id).slice(-8)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Call Lead
                            </DropdownMenuItem>
                            {lead.email && (
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                            )}
                            {lead.status === "new" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(lead._id || lead.id, "contacted")}
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Mark as Contacted
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "converted" && (
                              <DropdownMenuItem onClick={() => handleConvertLead(lead)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Convert to Patient
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "lost" && (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleStatusUpdate(lead._id || lead.id, "lost")}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Mark as Lost
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteLead(lead._id || lead.id)}
                            >
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewLeadModal 
        lead={selectedLead}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
      
      <EditLeadModal 
        lead={selectedLead!}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      
      <ConvertLeadModal 
        lead={selectedLead}
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
      />
    </div>
  );
};

export default Leads;
