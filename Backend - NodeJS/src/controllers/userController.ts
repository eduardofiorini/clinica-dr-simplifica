import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models';
import { AuthRequest } from '../types/express';

export class UserController {
  // Register a new user
  static async register(req: Request, res: Response) {
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

      const { email, password, first_name, last_name, role, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const user = new User({
        email,
        password_hash: password, // Will be hashed by pre-save middleware
        first_name,
        last_name,
        role,
        phone
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            phone: user.phone,
            is_active: user.is_active
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
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

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email',
        });
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            phone: user.phone
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthRequest, res: Response) {
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

      const allowedUpdates = [
        'first_name', 
        'last_name', 
        'phone', 
        'base_currency',
        'address',
        'bio',
        'date_of_birth',
        'specialization',
        'license_number',
        'department'
      ];

      const updates: any = {};
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        updates,
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Change user password
  static async changePassword(req: AuthRequest, res: Response) {
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

      const { current_password, new_password } = req.body;

      // Find the user
      const user = await User.findById(req.user?.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(current_password);
      if (!isCurrentPasswordValid) {
        res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
        return;
      }

      // Check if new password is different from current password
      const isSamePassword = await user.comparePassword(new_password);
      if (isSamePassword) {
        res.status(400).json({
          success: false,
          message: 'New password must be different from current password'
        });
        return;
      }

      // Update password
      user.password_hash = new_password; // Will be hashed by pre-save middleware
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get doctors (accessible by medical staff for appointments)
  static async getDoctors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      const filter: any = { 
        role: 'doctor',
        is_active: true
      };

      const doctors = await User.find(filter)
        .select('first_name last_name email phone role is_active')
        .skip(skip)
        .limit(limit)
        .sort({ first_name: -1, last_name: -1 });

      const totalDoctors = await User.countDocuments(filter);

      res.json({
        success: true,
        data: {
          items: doctors,
          pagination: {
            page,
            limit,
            total: totalDoctors,
            pages: Math.ceil(totalDoctors / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get doctors error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getNurses(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      const filter: any = { 
        role: 'nurse',
        is_active: true
      };

      const nurses = await User.find(filter)
        .select('first_name last_name email phone role is_active')
        .skip(skip)
        .limit(limit)
        .sort({ first_name: -1, last_name: -1 });

      const totalNurses = await User.countDocuments(filter);

      res.json({
        success: true,
        data: {
          items: nurses,
          pagination: {
            page,
            limit,
            total: totalNurses,
            pages: Math.ceil(totalNurses / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get nurses error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (req.query.role) {
        filter.role = req.query.role;
      }
      if (req.query.is_active !== undefined) {
        filter.is_active = req.query.is_active === 'true';
      }

      const users = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const totalUsers = await User.countDocuments(filter);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total: totalUsers,
            pages: Math.ceil(totalUsers / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user by ID (admin only)
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user (admin only)
  static async updateUser(req: Request, res: Response) {
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
      const updates = req.body;

      // Remove sensitive fields that shouldn't be updated directly
      delete updates.password_hash;
      delete updates._id;
      delete updates.created_at;

      const user = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Deactivate user (admin only)
  static async deactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deactivated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Activate user (admin only)
  static async activateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { is_active: true },
        { new: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User activated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Activate user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Admin change user password (admin only)
  static async adminChangeUserPassword(req: Request, res: Response) {
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
      const { new_password } = req.body;

      // Find the user
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Update password
      user.password_hash = new_password; // Will be hashed by pre-save middleware
      await user.save();

      res.json({
        success: true,
        message: 'User password updated successfully'
      });
    } catch (error) {
      console.error('Admin change user password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
} 