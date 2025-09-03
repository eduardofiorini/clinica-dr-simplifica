import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Building2, MapPin, Phone, Mail, Users, Clock, ChevronRight, Lock } from 'lucide-react';
import { useClinic, useClinicSelection } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import PublicHeader from '@/components/layout/PublicHeader';
import apiService from '@/services/api';

interface AllClinic {
  _id: string;
  name: string;
  code: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ClinicDisplayItem {
  clinic: AllClinic;
  userClinic?: any;
  hasAccess: boolean;
  role?: string;
  joined_at?: string;
}

const ClinicSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectClinic } = useClinic();
  const { userClinics, loading: userClinicsLoading, requiresSelection, hasClinics } = useClinicSelection();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [allClinics, setAllClinics] = useState<AllClinic[]>([]);
  const [allClinicsLoading, setAllClinicsLoading] = useState(false);
  const [combinedClinics, setCombinedClinics] = useState<ClinicDisplayItem[]>([]);

  // Fetch all clinics
  const fetchAllClinics = async () => {
    try {
      setAllClinicsLoading(true);
      const response = await apiService.getAllClinicsForAdmin();
      setAllClinics(response.data?.clinics || []);
    } catch (error) {
      console.error('Error fetching all clinics:', error);
      // If we can't fetch all clinics, we'll just show user clinics
      setAllClinics([]);
    } finally {
      setAllClinicsLoading(false);
    }
  };

  // Combine all clinics with user clinic data
  useEffect(() => {
    if (allClinics.length > 0) {
      const userClinicMap = new Map();
      
      // Create a map of clinic IDs to user clinic data
      userClinics.forEach(uc => {
        userClinicMap.set(uc.clinic_id._id, uc);
      });

      const combined: ClinicDisplayItem[] = allClinics.map(clinic => {
        const userClinic = userClinicMap.get(clinic._id);
        
        // Check if user has actual relationship with this clinic
        const hasAccess = userClinic && userClinic.hasRelationship === true;
        
        // Extract role name if user has access
        let roleName = undefined;
        if (hasAccess && userClinic) {
          roleName = userClinic.role || 'staff'; // Use the role field from the API response
        }
        
        return {
          clinic,
          userClinic,
          hasAccess,
          role: roleName,
          joined_at: userClinic?.joined_at,
        };
      });

      setCombinedClinics(combined);
    }
  }, [allClinics, userClinics]);

  // Fetch all clinics on component mount
  useEffect(() => {
    fetchAllClinics();
  }, []);

  useEffect(() => {
    // If user doesn't require selection (already has clinic selected), redirect
    if (!requiresSelection && hasClinics) {
      navigate('/dashboard', { replace: true });
    }
  }, [requiresSelection, hasClinics, navigate]);

  const handleSelectClinic = async (clinicId: string, hasAccess: boolean) => {
    if (!hasAccess) {
      toast.error('You do not have access to this clinic. Contact your administrator.');
      return;
    }

    try {
      setIsSelecting(true);
      setSelectedClinicId(clinicId);

      const success = await selectClinic(clinicId);
      
      if (success) {
        toast.success('Clinic selected successfully');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('Failed to select clinic');
      }
    } catch (error) {
      console.error('Error selecting clinic:', error);
      toast.error('Failed to select clinic');
    } finally {
      setIsSelecting(false);
      setSelectedClinicId(null);
    }
  };

  const getClinicInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAddress = (clinic: AllClinic): string => {
    const addr = clinic.address;
    return `${addr.city}, ${addr.state}`;
  };

  const getRoleBadgeColor = (role: string): string => {
    const colors: { [key: string]: string } = {
      admin: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      doctor: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      nurse: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      receptionist: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      accountant: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      staff: 'bg-muted text-muted-foreground border-border'
    };
    return colors[role] || colors.staff;
  };

  const loading = userClinicsLoading || allClinicsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader showActions={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading clinics...</p>
        </div>
        </div>
      </div>
    );
  }

  if (!hasClinics) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader showActions={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>No Clinics Available</CardTitle>
            <CardDescription>
              You don't have access to any clinics yet. Please contact your administrator to get access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader showActions={false} />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Available Clinics</h2>
          <p className="text-muted-foreground">
            You have access to {userClinics.length} out of {combinedClinics.length} clinic{combinedClinics.length !== 1 ? 's' : ''}. 
            Select one to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedClinics.map((clinicItem) => {
            const clinic = clinicItem.clinic;
            const isCurrentlySelecting = selectedClinicId === clinic._id;
            const hasAccess = clinicItem.hasAccess;

            return (
              <Card 
                key={clinic._id} 
                className={`transition-all duration-200 relative overflow-hidden ${
                  hasAccess 
                    ? 'hover:shadow-lg cursor-pointer group' 
                    : 'opacity-50 cursor-not-allowed bg-muted/30'
                }`}
                onClick={() => !isSelecting && handleSelectClinic(clinic._id, hasAccess)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className={`h-12 w-12 ${!hasAccess ? 'opacity-50' : ''}`}>
                        <AvatarFallback className={`font-semibold ${
                          hasAccess 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {getClinicInitials(clinic.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className={`text-lg transition-colors ${
                            hasAccess 
                              ? 'group-hover:text-primary' 
                              : 'text-muted-foreground'
                          }`}>
                            {clinic.name}
                          </CardTitle>
                          {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          {clinic.code}
                        </p>
                      </div>
                    </div>
                    {hasAccess && clinicItem.role && (
                      <Badge className={getRoleBadgeColor(clinicItem.role)}>
                        {clinicItem.role}
                      </Badge>
                    )}
                    {!hasAccess && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        No Access
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {clinic.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {clinic.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{formatAddress(clinic)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{clinic.contact.phone}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{clinic.contact.email}</span>
                    </div>

                    {hasAccess && clinicItem.joined_at && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Joined {new Date(clinicItem.joined_at).toLocaleDateString()}</span>
                      </div>
                    )}

                    {!hasAccess && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>Contact administrator for access</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button 
                      className={`w-full transition-all ${
                        hasAccess 
                          ? 'group-hover:bg-primary group-hover:text-primary-foreground' 
                          : ''
                      }`}
                      variant={
                        !hasAccess 
                          ? "secondary" 
                          : isCurrentlySelecting 
                            ? "default" 
                            : "outline"
                      }
                      disabled={isSelecting || !hasAccess}
                    >
                      {isCurrentlySelecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Selecting...
                        </>
                      ) : !hasAccess ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          No Access
                        </>
                      ) : (
                        <>
                          Access Clinic
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>

                {/* Hover overlay - only for accessible clinics */}
                {hasAccess && (
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need access to another clinic? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicSelection; 