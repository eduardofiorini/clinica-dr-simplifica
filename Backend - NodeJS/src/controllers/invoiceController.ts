import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Invoice } from '../models';

export class InvoiceController {
  static async createInvoice(req: Request, res: Response): Promise<void> {
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

      const invoice = new Invoice(req.body);
      await invoice.save();

      await invoice.populate('patient_id', 'first_name last_name email phone');

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: { invoice }
      });
    } catch (error) {
      console.error('Create invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getAllInvoices(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      let filter: any = {};

      if (req.query.status) {
        filter.status = req.query.status;
      }

      if (req.query.patient_id) {
        filter.patient_id = req.query.patient_id;
      }

      if (req.query.start_date && req.query.end_date) {
        filter.created_at = {
          $gte: new Date(req.query.start_date as string),
          $lte: new Date(req.query.end_date as string)
        };
      }

      const invoices = await Invoice.find(filter)
        .populate('patient_id', 'first_name last_name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const totalInvoices = await Invoice.countDocuments(filter);

      res.json({
        success: true,
        data: {
          invoices,
          pagination: {
            page,
            limit,
            total: totalInvoices,
            pages: Math.ceil(totalInvoices / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getInvoiceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id)
        .populate('patient_id', 'first_name last_name email phone address');

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { invoice }
      });
    } catch (error) {
      console.error('Get invoice by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      )
      .populate('patient_id', 'first_name last_name email phone');

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: { invoice }
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async markAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findByIdAndUpdate(
        id,
        { 
          status: 'paid',
          payment_date: new Date()
        },
        { new: true }
      );

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Invoice marked as paid successfully',
        data: { invoice }
      });
    } catch (error) {
      console.error('Mark invoice as paid error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getOverdueInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await Invoice.find({
        status: { $in: ['pending'] },
        due_date: { $lt: new Date() }
      })
      .populate('patient_id', 'first_name last_name email phone')
              .sort({ due_date: -1 });

      res.json({
        success: true,
        data: { invoices }
      });
    } catch (error) {
      console.error('Get overdue invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getInvoiceStats(req: Request, res: Response): Promise<void> {
    try {
      const totalInvoices = await Invoice.countDocuments();
      const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
      const pendingInvoices = await Invoice.countDocuments({ status: 'pending' });
      const overdueInvoices = await Invoice.countDocuments({
        status: 'pending',
        due_date: { $lt: new Date() }
      });

      const revenueData = await Invoice.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total_amount' },
            averageInvoice: { $avg: '$total_amount' }
          }
        }
      ]);

      const monthlyRevenue = await Invoice.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: {
              year: { $year: '$payment_date' },
              month: { $month: '$payment_date' }
            },
            revenue: { $sum: '$total_amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);

      res.json({
        success: true,
        data: {
          totalInvoices,
          paidInvoices,
          pendingInvoices,
          overdueInvoices,
          totalRevenue: revenueData[0]?.totalRevenue || 0,
          averageInvoice: revenueData[0]?.averageInvoice || 0,
          monthlyRevenue
        }
      });
    } catch (error) {
      console.error('Get invoice stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async deleteInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
        return;
      }

      // Optional: Add business logic to prevent deletion of paid invoices
      // if (invoice.status === 'paid') {
      //   res.status(400).json({
      //     success: false,
      //     message: 'Cannot delete paid invoices. Consider cancelling instead.'
      //   });
      //   return;
      // }

      await Invoice.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
} 