import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserClinic, Clinic } from '../models';
import { AuthRequest } from '../types/express';

export class UserClinicController {
  
  /**
   * Get current user's clinics
   * GET /api/user/clinics
   */
  static async getUserClinics(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Get all active clinics
      const allClinics = await Clinic.find({ is_active: true })
        .select('name code description address contact settings is_active created_at')
        .sort({ name: 1 });

      // If user is not authenticated, return all clinics with default data
      if (!req.user?._id) {
        const clinicsData = allClinics.map(clinic => ({
          _id: null,
          user_id: null,
          clinic_id: clinic,
          role: 'staff',
          permissions: [],
          is_active: true,
          joined_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          hasRelationship: false
        }));

        res.status(200).json({
          success: true,
          data: clinicsData,
          total: clinicsData.length,
          message: 'All active clinics retrieved successfully'
        });
        return;
      }

      // Get user's existing clinic relationships (when user is authenticated)
      const userClinics = await UserClinic.find({
        user_id: req.user._id,
        is_active: true
      }).populate('clinic_id');

      // Create a map of user's clinic relationships
      const userClinicMap = new Map();
      userClinics.forEach(uc => {
        if (uc.clinic_id) {
          userClinicMap.set(uc.clinic_id._id.toString(), uc);
        }
      });

      // Build response data with all clinics
      const clinicsData = allClinics.map(clinic => {
        const existingRelation = userClinicMap.get(clinic._id.toString());
        
        return {
          _id: existingRelation?._id || null,
          user_id: req.user!._id, // Non-null assertion since we've already checked above
          clinic_id: clinic,
          role: existingRelation?.role || 'staff', // Default role if no relationship exists
          permissions: existingRelation?.permissions || [],
          is_active: existingRelation?.is_active || true,
          joined_at: existingRelation?.joined_at || new Date(),
          created_at: existingRelation?.created_at || new Date(),
          updated_at: existingRelation?.updated_at || new Date(),
          hasRelationship: !!existingRelation // Flag to indicate if UserClinic relationship exists
        };
      });

      res.json({
        success: true,
        data: clinicsData,
        total: clinicsData.length
      });
    } catch (error) {
      console.error('Error fetching user clinics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinics'
      });
    }
  }

  /**
   * DEVELOPMENT ONLY: Assign current user to all clinics
   * POST /api/user/assign-to-all-clinics
   */
  static async assignUserToAllClinics(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Get all active clinics
      const clinics = await Clinic.find({ is_active: true });
      
      if (clinics.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No active clinics found'
        });
        return;
      }

      const userClinicRecords: any[] = [];
      
      for (const clinic of clinics) {
        // Check if user-clinic relationship already exists
        const existingRelation = await UserClinic.findOne({
          user_id: req.user?._id,
          clinic_id: clinic._id
        });

        if (!existingRelation) {
          // Create new user-clinic relationship
          const userClinic = new UserClinic({
            user_id: req.user?._id,
            clinic_id: clinic._id,
            role: 'admin', // Give admin role for testing
            permissions: [
              'read_patients', 'write_patients', 'delete_patients',
              'read_appointments', 'write_appointments', 'delete_appointments',
              'read_medical_records', 'write_medical_records', 'delete_medical_records',
              'read_prescriptions', 'write_prescriptions', 'delete_prescriptions',
              'read_invoices', 'write_invoices', 'delete_invoices',
              'read_payments', 'write_payments', 'delete_payments',
              'read_inventory', 'write_inventory', 'delete_inventory',
              'read_staff', 'write_staff', 'delete_staff',
              'read_reports', 'write_reports',
              'manage_clinic_settings', 'view_analytics',
              'manage_departments', 'manage_services', 'manage_tests',
              'view_payroll', 'manage_payroll'
            ],
            is_active: true
          });

          await userClinic.save();
          userClinicRecords.push(userClinic);
        } else {
          // Reactivate if it exists but is inactive
          if (!existingRelation.is_active) {
            existingRelation.is_active = true;
            await existingRelation.save();
            userClinicRecords.push(existingRelation);
          }
        }
      }

      res.json({
        success: true,
        message: `User assigned to ${userClinicRecords.length} clinics`,
        data: {
          assignedClinics: userClinicRecords.length,
          totalClinics: clinics.length
        }
      });
    } catch (error) {
      console.error('Error assigning user to clinics:', error);
      res.status(500).json({
        success: false,
        message: 'Error assigning user to clinics'
      });
    }
  }

  /**
   * Select a clinic and update the session
   */
  static async selectClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      // setLoading(true);
      // clearError();

      const { clinic_id } = req.body;

      if (!clinic_id) {
        res.status(400).json({
          success: false,
          message: 'Clinic ID is required'
        });
        return;
      }

      // Verify clinic exists and is active
      const clinic = await Clinic.findOne({
        _id: clinic_id,
        is_active: true
      });

      if (!clinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic not found or inactive'
        });
        return;
      }

      // Check if user has existing relationship with this clinic
      let userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: clinic_id,
        is_active: true
      }).populate('clinic_id', 'name code description is_active');

      // If no relationship exists, create one automatically
      if (!userClinic) {
        userClinic = new UserClinic({
          user_id: req.user?._id,
          clinic_id: clinic_id,
          role: 'staff', // Default role
          permissions: [
            'read_patients', 'read_appointments', 'read_medical_records',
            'read_prescriptions', 'read_invoices', 'read_payments'
          ], // Basic read permissions
          is_active: true
        });

        await userClinic.save();
        
        // Populate the clinic_id field
        await userClinic.populate('clinic_id', 'name code description is_active');
      }

      // Generate new JWT token with clinic context
      const tokenPayload = {
        id: req.user?._id,
        email: req.user?.email,
        role: req.user?.role,
        clinic_id: clinic_id,
        clinic_role: userClinic.role
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Clinic selected successfully',
        data: {
          token,
          clinic: userClinic.clinic_id,
          role: userClinic.role,
          permissions: userClinic.permissions
        }
      });
    } catch (error) {
      console.error('Error selecting clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error selecting clinic'
      });
    }
  };

  /**
   * Get current selected clinic
   * GET /api/user/current-clinic
   */
  static async getCurrentClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.clinic_id) {
        res.status(400).json({
          success: false,
          message: 'No clinic selected'
        });
        return;
      }

      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: req.clinic_id,
        is_active: true
      }).populate('clinic_id', 'name code description address contact settings');

      if (!userClinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic access not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          clinic: userClinic.clinic_id,
          role: userClinic.role,
          permissions: userClinic.permissions,
          joined_at: userClinic.joined_at
        }
      });
    } catch (error) {
      console.error('Error fetching current clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching current clinic'
      });
    }
  }

  /**
   * Switch clinic (same as select but with different semantics)
   * POST /api/user/switch-clinic
   */
  static async switchClinic(req: AuthRequest, res: Response): Promise<void> {
    // Use the same logic as selectClinic
    await UserClinicController.selectClinic(req, res);
  }

  /**
   * Clear clinic selection (return to clinic selection state)
   * POST /api/user/clear-clinic
   */
  static async clearClinicSelection(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Generate new JWT token without clinic context
      const tokenPayload = {
        id: req.user?._id,
        email: req.user?.email,
        role: req.user?.role
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Clinic selection cleared',
        data: {
          token
        }
      });
    } catch (error) {
      console.error('Error clearing clinic selection:', error);
      res.status(500).json({
        success: false,
        message: 'Error clearing clinic selection'
      });
    }
  }

  /**
   * Get user's role and permissions in current clinic
   * GET /api/user/clinic-permissions
   */
  static async getClinicPermissions(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.clinic_id) {
        res.status(400).json({
          success: false,
          message: 'No clinic selected'
        });
        return;
      }

      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: req.clinic_id,
        is_active: true
      }).select('role permissions joined_at');

      if (!userClinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic access not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          clinic_id: req.clinic_id,
          role: userClinic.role,
          permissions: userClinic.permissions,
          joined_at: userClinic.joined_at
        }
      });
    } catch (error) {
      console.error('Error fetching clinic permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinic permissions'
      });
    }
  }

  /**
   * Update user's own profile within current clinic context
   * PUT /api/user/clinic-profile
   */
  static async updateClinicProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.clinic_id) {
        res.status(400).json({
          success: false,
          message: 'No clinic selected'
        });
        return;
      }

      const { bio, specialization, department } = req.body;

      // Only allow updating specific clinic-related fields
      const allowedUpdates: any = {};
      if (bio !== undefined) allowedUpdates.bio = bio;
      if (specialization !== undefined) allowedUpdates.specialization = specialization;
      if (department !== undefined) allowedUpdates.department = department;

      const updatedUser = await req.user?.updateOne(allowedUpdates, { new: true });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          bio: req.user?.bio,
          specialization: req.user?.specialization,
          department: req.user?.department
        }
      });
    } catch (error) {
      console.error('Error updating clinic profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile'
      });
    }
  }

  /**
   * Get user's clinic activity/stats
   * GET /api/user/clinic-activity
   */
  static async getClinicActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.clinic_id) {
        res.status(400).json({
          success: false,
          message: 'No clinic selected'
        });
        return;
      }

      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: req.clinic_id,
        is_active: true
      }).select('role permissions joined_at');

      if (!userClinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic access not found'
        });
        return;
      }

      // Calculate days since joining
      const daysSinceJoining = Math.floor(
        (new Date().getTime() - new Date(userClinic.joined_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      // You can expand this with more activity metrics
      const activity = {
        joined_at: userClinic.joined_at,
        days_since_joining: daysSinceJoining,
        role: userClinic.role,
        permissions_count: userClinic.permissions.length,
        clinic_id: req.clinic_id
      };

      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      console.error('Error fetching clinic activity:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinic activity'
      });
    }
  }
} 