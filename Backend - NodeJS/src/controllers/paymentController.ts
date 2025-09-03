import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Payment, Invoice, Patient } from '../models';
import mongoose from 'mongoose';

export class PaymentController {
  // Create a new payment
  static async createPayment(req: Request, res: Response): Promise<void> {
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

      const payment = new Payment(req.body);
      await payment.save();

      // If payment is completed, update invoice status
      if (payment.status === 'completed') {
        await Invoice.findByIdAndUpdate(payment.invoice_id, {
          status: 'paid',
          paid_at: payment.payment_date,
          payment_method: payment.method
        });
      }

      const populatedPayment = await Payment.findById(payment._id)
        .populate('invoice_id', 'invoice_number total_amount')
        .populate('patient_id', 'first_name last_name email');

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: populatedPayment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create payment',
        error: error.message
      });
    }
  }

  // Get all payments with filters
  static async getAllPayments(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        method, 
        patient_id,
        start_date, 
        end_date 
      } = req.query;

      const query: any = {};
      
      if (status) query.status = status;
      if (method) query.method = method;
      if (patient_id) query.patient_id = patient_id;
      
      if (start_date || end_date) {
        query.payment_date = {};
        if (start_date) query.payment_date.$gte = new Date(start_date as string);
        if (end_date) query.payment_date.$lte = new Date(end_date as string);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const payments = await Payment.find(query)
        .populate('invoice_id', 'invoice_number total_amount')
        .populate('patient_id', 'first_name last_name email')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Payment.countDocuments(query);

      res.json({
        success: true,
        data: {
          items: payments,
          pagination: {
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total: total,
            limit: Number(limit)
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  // Get payment by ID
  static async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payment ID'
        });
        return;
      }

      const payment = await Payment.findById(id)
        .populate('invoice_id', 'invoice_number total_amount services')
        .populate('patient_id', 'first_name last_name email phone');

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  }

  // Update payment
  static async updatePayment(req: Request, res: Response): Promise<void> {
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

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payment ID'
        });
        return;
      }

      const payment = await Payment.findByIdAndUpdate(id, req.body, { new: true })
        .populate('invoice_id', 'invoice_number total_amount')
        .populate('patient_id', 'first_name last_name email');

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      // Update invoice status if payment is completed
      if (payment.status === 'completed') {
        await Invoice.findByIdAndUpdate(payment.invoice_id, {
          status: 'paid',
          paid_at: payment.payment_date,
          payment_method: payment.method
        });
      }

      res.json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update payment',
        error: error.message
      });
    }
  }

  // Update payment status
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, failure_reason } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payment ID'
        });
        return;
      }

      const updateData: any = { status };
      if (failure_reason) updateData.failure_reason = failure_reason;
      if (status === 'completed') updateData.payment_date = new Date();

      const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true })
        .populate('invoice_id', 'invoice_number total_amount')
        .populate('patient_id', 'first_name last_name email');

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      // Update invoice status if payment is completed
      if (status === 'completed') {
        await Invoice.findByIdAndUpdate(payment.invoice_id, {
          status: 'paid',
          paid_at: payment.payment_date,
          payment_method: payment.method
        });
      }

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  }

  // Get payment statistics
  static async getPaymentStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      
      const dateFilter: any = {};
      if (start_date || end_date) {
        dateFilter.payment_date = {};
        if (start_date) dateFilter.payment_date.$gte = new Date(start_date as string);
        if (end_date) dateFilter.payment_date.$lte = new Date(end_date as string);
      }

      const stats = await Payment.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            total_payments: { $sum: 1 },
            total_revenue: { 
              $sum: { 
                $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] 
              } 
            },
            completed_payments: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            failed_payments: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            pending_payments: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            processing_payments: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
            }
          }
        }
      ]);

      const methodStats = await Payment.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        {
          $group: {
            _id: '$method',
            count: { $sum: 1 },
            total_amount: { $sum: '$amount' }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          overview: stats[0] || {
            total_payments: 0,
            total_revenue: 0,
            completed_payments: 0,
            failed_payments: 0,
            pending_payments: 0,
            processing_payments: 0
          },
          by_method: methodStats
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment statistics',
        error: error.message
      });
    }
  }

  // Initiate refund
  static async initiateRefund(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { refund_amount, reason } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payment ID'
        });
        return;
      }

      const payment = await Payment.findById(id);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      if (payment.status !== 'completed') {
        res.status(400).json({
          success: false,
          message: 'Can only refund completed payments'
        });
        return;
      }

      // Create refund record (you might want a separate Refund model)
      payment.status = 'refunded';
      payment.failure_reason = reason;
      await payment.save();

      // Update invoice status back to pending if fully refunded
      if (refund_amount >= payment.amount) {
        await Invoice.findByIdAndUpdate(payment.invoice_id, {
          status: 'pending',
          paid_at: undefined,
          payment_method: undefined
        });
      }

      res.json({
        success: true,
        message: 'Refund initiated successfully',
        data: payment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to initiate refund',
        error: error.message
      });
    }
  }
}

export default PaymentController; 