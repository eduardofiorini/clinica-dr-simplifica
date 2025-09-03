import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Building2, MapPin, Phone, Mail, Users, Clock, ChevronRight } from 'lucide-react';
import { useClinic, useClinicSelection } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import PublicHeader from '@/components/layout/PublicHeader';

const ClinicSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectClinic } = useClinic();
  const { userClinics, loading, requiresSelection, hasClinics } = useClinicSelection();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    // If user doesn't require selection (already has clinic selected), redirect
    if (!requiresSelection && hasClinics) {
      navigate('/dashboard', { replace: true });
    }
  }, [requiresSelection, hasClinics, navigate]);

  const handleSelectClinic = async (clinicId: string) => {
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

  const formatAddress = (clinic: any): string => {
    const addr = clinic.clinic_id.address;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader showActions={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your clinics...</p>
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Clinics</h2>
          <p className="text-muted-foreground">
            You have access to {userClinics.length} clinic{userClinics.length !== 1 ? 's' : ''}. 
            Select one to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userClinics.map((userClinic) => {
            const clinic = userClinic.clinic_id;
            const isCurrentlySelecting = selectedClinicId === clinic._id;

            return (
              <Card 
                key={clinic._id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
                onClick={() => !isSelecting && handleSelectClinic(clinic._id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getClinicInitials(clinic.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {clinic.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-mono">
                          {clinic.code}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRoleBadgeColor(userClinic.role)}>
                      {userClinic.role}
                    </Badge>
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
                      <span>{formatAddress(userClinic)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{clinic.contact.phone}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{clinic.contact.email}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Joined {new Date(userClinic.joined_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      variant={isCurrentlySelecting ? "default" : "outline"}
                      disabled={isSelecting}
                    >
                      {isCurrentlySelecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Selecting...
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

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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