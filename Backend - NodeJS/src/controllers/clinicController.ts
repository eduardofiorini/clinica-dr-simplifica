import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Clinic, UserClinic, User } from '../models';
import { AuthRequest } from '../types/express';
import { getClinicScopedFilter } from '../middleware/clinicContext';

export class ClinicController {
  
  /**
   * Get all clinics that the current user has access to
   * GET /api/clinics
   */
  static async getUserClinics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userClinics = await UserClinic.find({
        user_id: req.user?._id,
        is_active: true
      }).populate({
        path: 'clinic_id',
        match: { is_active: true },
        select: 'name code description address contact settings is_active created_at'
      }).sort({ joined_at: 1 });

      // Filter out clinics that are null (inactive)
      const activeClinics = userClinics.filter(uc => uc.clinic_id);

      res.json({
        success: true,
        data: activeClinics,
        total: activeClinics.length
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
   * Get current clinic details
   * GET /api/clinics/current
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

      const clinic = await Clinic.findById(req.clinic_id);
      if (!clinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
        return;
      }

      res.json({
        success: true,
        data: clinic
      });
    } catch (error) {
      console.error('Error fetching current clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinic details'
      });
    }
  }

  /**
   * Create a new clinic (super admin only)
   * POST /api/clinics
   */
  static async createClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      // Only super admins can create clinics
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Only super administrators can create clinics'
        });
        return;
      }

      const clinicData = req.body;
      const clinic = new Clinic(clinicData);
      await clinic.save();

      // Automatically add the creator as admin of the new clinic
      const userClinic = new UserClinic({
        user_id: req.user._id,
        clinic_id: clinic._id,
        role: 'admin',
        is_active: true
      });
      await userClinic.save();

      res.status(201).json({
        success: true,
        message: 'Clinic created successfully',
        data: clinic
      });
    } catch (error: any) {
      console.error('Error creating clinic:', error);
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Clinic code already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error creating clinic'
        });
      }
    }
  }

  /**
   * Get clinic by ID
   * GET /api/clinics/:id
   */
  static async getClinicById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Verify user has access to this clinic
      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        is_active: true
      });

      if (!userClinic) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this clinic'
        });
        return;
      }

      const clinic = await Clinic.findById(id);
      if (!clinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
        return;
      }

      res.json({
        success: true,
        data: clinic
      });
    } catch (error) {
      console.error('Error fetching clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinic'
      });
    }
  }

  /**
   * Update clinic
   * PUT /api/clinics/:id
   */
  static async updateClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;

      // Verify user is admin of this clinic
      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        role: 'admin',
        is_active: true
      });

      if (!userClinic) {
        res.status(403).json({
          success: false,
          message: 'Admin access required for this clinic'
        });
        return;
      }

      const clinic = await Clinic.findByIdAndUpdate(
        id,
        { ...req.body, updated_at: new Date() },
        { new: true, runValidators: true }
      );

      if (!clinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Clinic updated successfully',
        data: clinic
      });
    } catch (error: any) {
      console.error('Error updating clinic:', error);
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Clinic code already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error updating clinic'
        });
      }
    }
  }

  /**
   * Deactivate clinic (soft delete)
   * DELETE /api/clinics/:id
   */
  static async deactivateClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Only super admin can deactivate clinics
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Only super administrators can deactivate clinics'
        });
        return;
      }

      const clinic = await Clinic.findByIdAndUpdate(
        id,
        { is_active: false, updated_at: new Date() },
        { new: true }
      );

      if (!clinic) {
        res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
        return;
      }

      // Deactivate all user-clinic relationships
      await UserClinic.updateMany(
        { clinic_id: id },
        { is_active: false, updated_at: new Date() }
      );

      res.json({
        success: true,
        message: 'Clinic deactivated successfully'
      });
    } catch (error) {
      console.error('Error deactivating clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error deactivating clinic'
      });
    }
  }

  /**
   * Get clinic statistics
   * GET /api/clinics/:id/stats
   */
  static async getClinicStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Verify user has access to this clinic
      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        is_active: true
      });

      if (!userClinic) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this clinic'
        });
        return;
      }

      // Get clinic users count
      const usersCount = await UserClinic.countDocuments({
        clinic_id: id,
        is_active: true
      });

      // Get users by role
      const usersByRole = await UserClinic.aggregate([
        { $match: { clinic_id: id, is_active: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);

      const clinic = await Clinic.findById(id);

      res.json({
        success: true,
        data: {
          clinic_info: {
            name: clinic?.name,
            code: clinic?.code,
            created_at: clinic?.created_at
          },
          users: {
            total: usersCount,
            by_role: usersByRole.reduce((acc, curr) => {
              acc[curr._id] = curr.count;
              return acc;
            }, {})
          }
        }
      });
    } catch (error) {
      console.error('Error fetching clinic stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinic statistics'
      });
    }
  }

  /**
   * Get clinic users
   * GET /api/clinics/:id/users
   */
  static async getClinicUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20, role } = req.query;

      // Verify user is admin of this clinic
      const userClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        role: 'admin',
        is_active: true
      });

      if (!userClinic) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const filter: any = { clinic_id: id, is_active: true };
      if (role) {
        filter.role = role;
      }

      const users = await UserClinic.find(filter)
        .populate('user_id', 'first_name last_name email phone is_active created_at')
        .sort({ role: 1, joined_at: 1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await UserClinic.countDocuments(filter);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching clinic users:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinic users'
      });
    }
  }

  /**
   * Add user to clinic
   * POST /api/clinics/:id/users
   */
  static async addUserToClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const { user_id, role, permissions } = req.body;

      // Verify current user is admin of this clinic
      const currentUserClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        role: 'admin',
        is_active: true
      });

      if (!currentUserClinic) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      // Check if user exists
      const user = await User.findById(user_id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Check if user is already associated with this clinic
      const existingRelation = await UserClinic.findOne({
        user_id,
        clinic_id: id
      });

      if (existingRelation) {
        if (existingRelation.is_active) {
          res.status(400).json({
            success: false,
            message: 'User is already associated with this clinic'
          });
          return;
        } else {
          // Reactivate existing relationship
          existingRelation.role = role;
          existingRelation.permissions = permissions || [];
          existingRelation.is_active = true;
          await existingRelation.save();

          res.json({
            success: true,
            message: 'User association reactivated',
            data: existingRelation
          });
          return;
        }
      }

      // Create new user-clinic relationship
      const userClinic = new UserClinic({
        user_id,
        clinic_id: id,
        role,
        permissions: permissions || [],
        is_active: true
      });

      await userClinic.save();

      res.status(201).json({
        success: true,
        message: 'User added to clinic successfully',
        data: userClinic
      });
    } catch (error) {
      console.error('Error adding user to clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding user to clinic'
      });
    }
  }

  /**
   * Update user role/permissions in clinic
   * PUT /api/clinics/:id/users/:userId
   */
  static async updateUserInClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { id, userId } = req.params;
      const { role, permissions } = req.body;

      // Verify current user is admin of this clinic
      const currentUserClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        role: 'admin',
        is_active: true
      });

      if (!currentUserClinic) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const userClinic = await UserClinic.findOneAndUpdate(
        { user_id: userId, clinic_id: id, is_active: true },
        { role, permissions: permissions || [], updated_at: new Date() },
        { new: true }
      ).populate('user_id', 'first_name last_name email');

      if (!userClinic) {
        res.status(404).json({
          success: false,
          message: 'User not found in this clinic'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: userClinic
      });
    } catch (error) {
      console.error('Error updating user in clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating user'
      });
    }
  }

  /**
   * Remove user from clinic
   * DELETE /api/clinics/:id/users/:userId
   */
  static async removeUserFromClinic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id, userId } = req.params;

      // Verify current user is admin of this clinic
      const currentUserClinic = await UserClinic.findOne({
        user_id: req.user?._id,
        clinic_id: id,
        role: 'admin',
        is_active: true
      });

      if (!currentUserClinic) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      // Prevent removing yourself as admin if you're the only admin
      if (userId === req.user?._id.toString()) {
        const adminCount = await UserClinic.countDocuments({
          clinic_id: id,
          role: 'admin',
          is_active: true
        });

        if (adminCount <= 1) {
          res.status(400).json({
            success: false,
            message: 'Cannot remove yourself as the only admin'
          });
          return;
        }
      }

      const userClinic = await UserClinic.findOneAndUpdate(
        { user_id: userId, clinic_id: id },
        { is_active: false, updated_at: new Date() },
        { new: true }
      );

      if (!userClinic) {
        res.status(404).json({
          success: false,
          message: 'User not found in this clinic'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User removed from clinic successfully'
      });
    } catch (error) {
      console.error('Error removing user from clinic:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing user from clinic'
      });
    }
  }
} 