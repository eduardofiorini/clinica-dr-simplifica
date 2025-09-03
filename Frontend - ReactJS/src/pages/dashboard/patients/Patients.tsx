import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Patient as ApiPatient } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable, MobileActionDropdown } from "@/components/ui/table";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveHeader,
  ResponsiveStatsCard,
  ResponsiveButtonGroup,
} from "@/components/ui/responsive-container";
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
  Edit,
  Eye,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";
import { Patient } from "@/types";
import AddPatientModal from "@/components/modals/AddPatientModal";
import ViewDetailsModal from "@/components/modals/ViewDetailsModal";
import EditItemModal from "@/components/modals/EditItemModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import NewAppointmentModal from "@/components/modals/NewAppointmentModal";

const Patients = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // API hooks
  const { 
    data: patientsData, 
    isLoading, 
    error,
    refetch 
  } = usePatients({ 
    page: currentPage, 
    limit: pageSize, 
    search: searchTerm || undefined 
  });
  
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeletePatient();

  // Modal states
  
  const [viewDetailsModal, setViewDetailsModal] = useState<{
    open: boolean;
    item: Patient | null;
  }>({ open: false, item: null });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    item: Patient | null;
  }>({ open: false, item: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: Patient | null;
  }>({ open: false, item: null });

  const [appointmentModal, setAppointmentModal] = useState<{
    open: boolean;
    patientId: string | null;
  }>({ open: false, patientId: null });

  // Action handlers
  const handleViewDetails = (patient: Patient) => {
    setViewDetailsModal({ open: true, item: patient });
  };

  const handleEdit = (patient: Patient) => {
    setEditModal({ open: true, item: patient });
  };

  const handleDelete = (patient: Patient) => {
    setDeleteModal({ open: true, item: patient });
  };

  const handleScheduleAppointment = (patient: Patient) => {
    setAppointmentModal({ open: true, patientId: patient.id });
  };

  const handleSaveEdit = async (updatedData: Record<string, any>) => {
    if (!editModal.item) return;
    
    try {
      // Prepare patient data for API (only fields supported by the API)
      const patientUpdateData: any = {
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        email: updatedData.email,
        phone: updatedData.phone,
        address: updatedData.address,
        gender: updatedData.gender,
        date_of_birth: typeof updatedData.dateOfBirth === 'string' 
          ? updatedData.dateOfBirth 
          : updatedData.dateOfBirth?.toISOString().split('T')[0],
      };

      // Add emergency contact if provided
      if (updatedData.emergencyContactName) {
        patientUpdateData.emergency_contact = {
          name: updatedData.emergencyContactName,
          phone: updatedData.emergencyContactPhone,
          relationship: updatedData.emergencyContactRelationship,
        };
      }

      // Add insurance info if provided
      if (updatedData.insuranceProvider) {
        patientUpdateData.insurance_info = {
          provider: updatedData.insuranceProvider,
          policy_number: updatedData.insurancePolicyNumber,
        };
      }

      // Make sure we have a valid ID
      const patientId = editModal.item.id;
      if (!patientId) {
        throw new Error('Invalid patient ID');
      }

      await updatePatientMutation.mutateAsync({
        id: patientId,
        data: patientUpdateData
      });
      
      setEditModal({ open: false, item: null });
      toast({
        title: "Patient updated",
        description: `${updatedData.firstName} ${updatedData.lastName} has been updated successfully.`,
      });
      
      // Refetch the patients list to get updated data
      refetch();

      // Note: Medical fields (height, weight, allergies, medicalHistory, bloodGroup) 
      // would typically be stored in medical records, not patient profile
      if (updatedData.height || updatedData.weight || updatedData.allergies || updatedData.medicalHistory || updatedData.bloodGroup) {
        toast({
          title: "Note",
          description: "Medical information (height, weight, allergies, medical history, blood group) should be updated through medical records.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    
    try {
      await deletePatientMutation.mutateAsync(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      toast({
        title: "Patient deleted",
        description: "Patient has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Convert API patients to local Patient type with additional edit fields
  type ExtendedPatient = Patient & { 
    avatar?: string; 
    lastVisit?: Date; 
    totalVisits?: number; 
    status?: string; 
  };

  const convertApiPatientToLocal = (apiPatient: ApiPatient): ExtendedPatient => {
    const patient: ExtendedPatient = {
      id: apiPatient._id || String(apiPatient.id || ''),
      firstName: apiPatient.first_name,
      lastName: apiPatient.last_name,
      email: apiPatient.email,
      phone: apiPatient.phone,
      address: apiPatient.address,
      dateOfBirth: new Date(apiPatient.date_of_birth),
      gender: apiPatient.gender,
      emergencyContact: {
        name: apiPatient.emergency_contact?.name || '',
        phone: apiPatient.emergency_contact?.phone || '',
        relationship: apiPatient.emergency_contact?.relationship || '',
      },
      bloodGroup: '', // This would come from medical records
      allergies: [], // Array as per Patient interface
      medicalHistory: [], // Array as per Patient interface
      height: undefined, // Number or undefined as per Patient interface
      weight: undefined, // Number or undefined as per Patient interface
      createdAt: new Date(apiPatient.created_at || Date.now()),
      updatedAt: new Date(apiPatient.updated_at || Date.now()),
      // Additional fields for UI
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${apiPatient.first_name} ${apiPatient.last_name}`,
      lastVisit: new Date(), // This would come from appointments
      totalVisits: 0, // This would come from appointments count
      status: 'active',
    };
    return patient;
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Process data for display
  const patients = patientsData?.data?.patients?.map(convertApiPatientToLocal) || [];
  const totalPatients = patientsData?.data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalPatients / pageSize);

  // Filter patients based on search and gender
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !searchTerm || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    
    const matchesGender = selectedGender === "all" || patient.gender === selectedGender;
    
    return matchesSearch && matchesGender;
  });

  // Table columns configuration
  const tableColumns = [
    {
      key: 'patient',
      label: 'Patient',
      render: (patient: Patient) => (
        <div className="flex items-center space-x-3">
          <Avatar className="avatar-responsive">
            <AvatarImage src={patient.avatar} alt={patient.firstName} />
            <AvatarFallback>{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm xs:text-base">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="text-xs xs:text-sm text-muted-foreground">
              {patient.gender} • {calculateAge(patient.dateOfBirth)} years
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (patient: Patient) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className="icon-sm text-muted-foreground" />
            <span className="text-xs xs:text-sm">{patient.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="icon-sm text-muted-foreground" />
            <span className="text-xs xs:text-sm truncate max-w-32">{patient.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'age',
      label: 'Age',
      render: (patient: Patient) => (
        <span className="text-sm font-medium">{calculateAge(patient.dateOfBirth)} years</span>
      ),
    },
    {
      key: 'bloodGroup',
      label: 'Blood Group',
      render: (patient: Patient) => (
        <Badge variant="outline" className="badge-responsive">
          {patient.bloodGroup || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'lastVisit',
      label: 'Last Visit',
      render: (patient: Patient) => (
        <span className="text-xs xs:text-sm text-muted-foreground">
          {patient.lastVisit?.toLocaleDateString() || 'Never'}
        </span>
      ),
    },
  ];

  // Mobile card configuration
  const mobileCardConfig = {
    title: (patient: Patient) => (
      <div className="flex items-center space-x-3">
        <Avatar className="avatar-responsive">
          <AvatarImage src={patient.avatar} alt={patient.firstName} />
          <AvatarFallback>{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm xs:text-base">
            {patient.firstName} {patient.lastName}
          </div>
          <div className="text-xs xs:text-sm text-muted-foreground">
            {patient.gender} • {calculateAge(patient.dateOfBirth)} years
          </div>
        </div>
      </div>
    ),
    content: (patient: Patient) => (
      <div className="space-y-3">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Phone className="icon-sm text-muted-foreground" />
            <span className="text-xs xs:text-sm">{patient.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="icon-sm text-muted-foreground" />
            <span className="text-xs xs:text-sm truncate">{patient.email}</span>
          </div>
        </div>
        {patient.address && (
          <div className="flex items-start space-x-2">
            <MapPin className="icon-sm text-muted-foreground mt-0.5" />
            <span className="text-xs xs:text-sm text-muted-foreground">{patient.address}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {patient.bloodGroup && (
            <Badge variant="outline" className="badge-responsive">
              Blood: {patient.bloodGroup}
            </Badge>
          )}
          <Badge variant="secondary" className="badge-responsive">
            Last visit: {patient.lastVisit?.toLocaleDateString() || 'Never'}
          </Badge>
        </div>
      </div>
    ),
    actions: (patient: Patient) => (
      <MobileActionDropdown
        actions={[
          {
            label: "View Details",
            icon: Eye,
            onClick: () => handleViewDetails(patient),
          },
          {
            label: "Edit Patient",
            icon: Edit,
            onClick: () => handleEdit(patient),
          },
          {
            label: "Schedule Appointment",
            icon: Calendar,
            onClick: () => handleScheduleAppointment(patient),
          },
          {
            label: "Delete Patient",
            icon: Trash2,
            onClick: () => handleDelete(patient),
            variant: "destructive",
          },
        ]}
      />
    ),
  };

  // Action buttons for table
  const tableActions = (patient: Patient) => (
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreVertical className="h-4 w-4 mr-1" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(patient)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(patient)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScheduleAppointment(patient)}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(patient)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Patient
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  );

  // Handle create patient
  const handleCreatePatient = async (data: Record<string, any>) => {
    try {
      // Prepare patient data for API (only fields supported by the API)
      const patientData: any = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        date_of_birth: typeof data.dateOfBirth === 'string' 
          ? data.dateOfBirth 
          : data.dateOfBirth?.toISOString().split('T')[0],
      };

      // Add emergency contact if provided
      if (data.emergencyContactName) {
        patientData.emergency_contact = {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship,
        };
      }

      // Add insurance info if provided
      if (data.insuranceProvider) {
        patientData.insurance_info = {
          provider: data.insuranceProvider,
          policy_number: data.insurancePolicyNumber,
        };
      }

      await createPatientMutation.mutateAsync(patientData);
      

      toast({
        title: "Patient added",
        description: `${data.firstName} ${data.lastName} has been added successfully.`,
      });
      
      // Refetch patients list
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ResponsiveContainer>
      {/* Header */}
      <ResponsiveHeader
        title="Patients"
        subtitle="Manage patient records and information"
        actions={
          <AddPatientModal
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            }
          />
        }
      />

      {/* Stats Cards */}
      <ResponsiveGrid columns={4} className="mb-6">
        <ResponsiveStatsCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <ResponsiveStatsCard
          title="New This Month"
          value="24"
          icon={UserPlus}
          trend={{ value: 8, isPositive: true }}
        />
        <ResponsiveStatsCard
          title="Active Patients"
          value={filteredPatients.length}
          icon={Eye}
        />
        <ResponsiveStatsCard
          title="Avg Age"
          value="45"
          icon={Calendar}
        />
      </ResponsiveGrid>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="responsive-card-padding pb-3">
          <CardTitle className="responsive-text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="responsive-card-padding pt-0">
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 xs:gap-3">
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="btn-responsive border border-input bg-background px-3 py-2 rounded-md"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="responsive-card-padding pb-3">
            <CardTitle className="responsive-text-lg">Patient Records</CardTitle>
            <CardDescription className="responsive-text-sm">
              A list of all patients in your clinic with their details
            </CardDescription>
          </CardHeader>
          <CardContent className="responsive-card-padding">
            {error && (
              <Alert className="mb-4">
                <AlertDescription>
                  Failed to load patients. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <ResponsiveTable
              data={filteredPatients}
              columns={tableColumns}
              mobileCard={mobileCardConfig}
              actions={tableActions}
              loading={isLoading}
              emptyMessage="No patients found. Add your first patient to get started."
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col xs:flex-row items-center justify-between gap-3 mt-6">
                <p className="responsive-text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalPatients)} of {totalPatients} patients
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-responsive-sm"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-responsive-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}

      <ViewDetailsModal
        open={viewDetailsModal.open && !!viewDetailsModal.item}
        onOpenChange={() => setViewDetailsModal({ open: false, item: null })}
        data={viewDetailsModal.item}
        title="Patient Details"
        fields={[
          { key: "firstName", label: "First Name" },
          { key: "lastName", label: "Last Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "gender", label: "Gender" },
          { key: "dateOfBirth", label: "Date of Birth", type: "date" },
          { key: "bloodGroup", label: "Blood Group" },
          { key: "emergencyContact.name", label: "Emergency Contact Name" },
          { key: "emergencyContact.phone", label: "Emergency Contact Phone" },
          { key: "emergencyContact.relationship", label: "Emergency Contact Relationship" },
        ]}
      />

      <EditItemModal
        open={editModal.open}
        onOpenChange={() => setEditModal({ open: false, item: null })}
        onSave={handleSaveEdit}
        data={editModal.item || {}}
        title="Edit Patient"
        fields={[
          { key: "firstName", label: "First Name", type: "text", required: true },
          { key: "lastName", label: "Last Name", type: "text", required: true },
          { key: "email", label: "Email", type: "text", required: true },
          { key: "phone", label: "Phone", type: "text", required: true },
          { key: "address", label: "Address", type: "textarea" },
          { key: "gender", label: "Gender", type: "select", options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" }
          ]},
          { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
          { key: "bloodGroup", label: "Blood Group", type: "select", options: [
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" }
          ]},
          { key: "emergencyContact.name", label: "Emergency Contact Name", type: "text" },
          { key: "emergencyContact.phone", label: "Emergency Contact Phone", type: "text" },
          { key: "emergencyContact.relationship", label: "Emergency Contact Relationship", type: "text" },
        ]}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, item: open ? deleteModal.item : null })}
        onConfirm={handleConfirmDelete}
        title="Delete Patient"
        description={`Are you sure you want to delete this patient? This action cannot be undone.`}
        itemName={`${deleteModal.item?.firstName || ''} ${deleteModal.item?.lastName || ''}`.trim() || 'this patient'}
      />

      <NewAppointmentModal
        open={appointmentModal.open}
        onOpenChange={(open) => setAppointmentModal({ open, patientId: open ? appointmentModal.patientId : null })}
        preSelectedPatientId={appointmentModal.patientId || undefined}
      />
    </ResponsiveContainer>
  );
};

export default Patients;
