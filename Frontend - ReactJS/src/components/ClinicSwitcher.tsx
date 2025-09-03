import React, { useState } from 'react';
import { ChevronDown, Building2, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useClinic } from '@/contexts/ClinicContext';
import { toast } from 'sonner';
import { clinicCookies } from '@/utils/cookies';

const ClinicSwitcher: React.FC = () => {
  const { 
    currentClinic, 
    userClinics, 
    currentUserClinic, 
    switchClinic, 
    loading
  } = useClinic();
  
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  // Enhanced debug logging
  console.log('ClinicSwitcher Enhanced Debug:', {
    currentClinic,
    userClinics,
    userClinicsLength: userClinics?.length || 0,
    currentUserClinic,
    loading,
    cookie_clinic_id: clinicCookies.getClinicId(),
    cookie_clinic_token: clinicCookies.getClinicToken(),
  });

  const handleSwitchClinic = async (clinicId: string) => {
    if (clinicId === currentClinic?._id) return;

    try {
      setSwitchingTo(clinicId);
      const success = await switchClinic(clinicId);
      
      if (success) {
        toast.success('Clinic switched successfully');
        
        // Refresh the page to ensure all components load data for the new clinic
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Small delay to show the success toast
      } else {
        toast.error('Failed to switch clinic');
      }
    } catch (error) {
      console.error('Error switching clinic:', error);
      toast.error('Failed to switch clinic');
    } finally {
      setSwitchingTo(null);
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

  // Always show loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-2 h-10 px-3 bg-muted border border-border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading clinics...</span>
      </div>
    );
  }

  // Show message if no clinics are available
  if (!userClinics || userClinics.length === 0) {
    return (
      <div className="flex items-center space-x-2 h-10 px-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
        <Building2 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm text-yellow-700 dark:text-yellow-300">No clinics available</span>
      </div>
    );
  }

  // Show message if no clinic is selected but clinics are available
  if (!currentClinic) {
    return (
      <div className="flex items-center space-x-2 h-10 px-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm text-blue-700 dark:text-blue-300">Select a clinic</span>
      </div>
    );
  }

  // Always show the clinic switcher with all available clinics
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 h-10 px-3 bg-background border-border shadow-sm w-full justify-start hover:bg-muted/50"
          disabled={loading}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getClinicInitials(currentClinic.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-medium text-foreground truncate max-w-32">
              {currentClinic.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {currentClinic.code}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Switch Clinic</p>
            <p className="text-xs leading-none text-muted-foreground">
              Select a clinic to access
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {userClinics.map((userClinic) => {
          const clinic = userClinic.clinic_id;
          const isCurrentClinic = clinic._id === currentClinic._id;
          const isSwitching = switchingTo === clinic._id;

          return (
            <DropdownMenuItem
              key={clinic._id}
              className="cursor-pointer p-3"
              onClick={() => !isCurrentClinic && handleSwitchClinic(clinic._id)}
              disabled={isCurrentClinic || isSwitching}
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getClinicInitials(clinic.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {clinic.name}
                    </p>
                    {isCurrentClinic && (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {isSwitching && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      {clinic.code}
                    </p>
                  </div>
                  
                  {clinic.address && (
                    <p className="text-xs text-muted-foreground/80 truncate mt-1">
                      {clinic.address.city}, {clinic.address.state}
                    </p>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground cursor-default">
          <Building2 className="h-3 w-3 mr-1" />
          {userClinics.length} clinic{userClinics.length !== 1 ? 's' : ''} available
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClinicSwitcher; 