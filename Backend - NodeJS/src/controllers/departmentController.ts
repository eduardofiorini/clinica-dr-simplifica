import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Department } from '../models';

export class DepartmentController {
  static async createDepartment(req: Request, res: Response): Promise<void> {
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

      // Check if department code already exists
      const existingDept = await Department.findOne({ code: req.body.code.toUpperCase() });
      if (existingDept) {
        res.status(400).json({
          success: false,
          message: 'Department code already exists'
        });
        return;
      }

      const department = new Department(req.body);
      await department.save();

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: { department }
      });
    } catch (error) {
      console.error('Create department error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getAllDepartments(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      let filter: any = {};

      // Search filter
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { code: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { head: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Status filter
      if (req.query.status) {
        filter.status = req.query.status;
      }

      const departments = await Department.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const totalDepartments = await Department.countDocuments(filter);

      res.json({
        success: true,
        data: {
          departments,
          pagination: {
            page,
            limit,
            total: totalDepartments,
            pages: Math.ceil(totalDepartments / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all departments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const department = await Department.findById(id);

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { department }
      });
    } catch (error) {
      console.error('Get department by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateDepartment(req: Request, res: Response): Promise<void> {
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

      // Check if department code already exists (excluding current department)
      if (req.body.code) {
        const existingDept = await Department.findOne({ 
          code: req.body.code.toUpperCase(),
          _id: { $ne: id }
        });
        if (existingDept) {
          res.status(400).json({
            success: false,
            message: 'Department code already exists'
          });
          return;
        }
      }

      const department = await Department.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Department updated successfully',
        data: { department }
      });
    } catch (error) {
      console.error('Update department error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const department = await Department.findByIdAndDelete(id);

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      console.error('Delete department error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getDepartmentStats(req: Request, res: Response): Promise<void> {
    try {
      const totalDepartments = await Department.countDocuments();
      const activeDepartments = await Department.countDocuments({ status: 'active' });
      const inactiveDepartments = await Department.countDocuments({ status: 'inactive' });

      // Staff statistics
      const staffStats = await Department.aggregate([
        {
          $group: {
            _id: null,
            totalStaff: { $sum: '$staffCount' },
            avgStaffPerDept: { $avg: '$staffCount' },
            maxStaff: { $max: '$staffCount' },
            minStaff: { $min: '$staffCount' }
          }
        }
      ]);

      // Budget statistics
      const budgetStats = await Department.aggregate([
        {
          $group: {
            _id: null,
            totalBudget: { $sum: '$budget' },
            avgBudget: { $avg: '$budget' },
            maxBudget: { $max: '$budget' },
            minBudget: { $min: '$budget' }
          }
        }
      ]);

      // Status distribution
      const statusStats = await Department.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Top departments by staff count
      const topDepartmentsByStaff = await Department.find()
        .select('name code staffCount')
        .sort({ staffCount: -1 })
        .limit(5);

      // Top departments by budget
      const topDepartmentsByBudget = await Department.find()
        .select('name code budget')
        .sort({ budget: -1 })
        .limit(5);

      res.json({
        success: true,
        data: {
          overview: {
            totalDepartments,
            activeDepartments,
            inactiveDepartments
          },
          staff: staffStats[0] || {
            totalStaff: 0,
            avgStaffPerDept: 0,
            maxStaff: 0,
            minStaff: 0
          },
          budget: budgetStats[0] || {
            totalBudget: 0,
            avgBudget: 0,
            maxBudget: 0,
            minBudget: 0
          },
          statusDistribution: statusStats,
          topByStaff: topDepartmentsByStaff,
          topByBudget: topDepartmentsByBudget
        }
      });
    } catch (error) {
      console.error('Get department stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateDepartmentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be either "active" or "inactive"'
        });
        return;
      }

      const department = await Department.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      res.json({
        success: true,
        message: `Department ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
        data: { department }
      });
    } catch (error) {
      console.error('Update department status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
} 