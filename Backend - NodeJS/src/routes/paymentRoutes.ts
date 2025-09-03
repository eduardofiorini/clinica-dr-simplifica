import { Router } from 'express';
import { body } from 'express-validator';
import { PaymentController } from '../controllers';
import { authenticate } from '../middleware/auth';
import { clinicContext } from '../middleware/clinicContext';

const router = Router();

// Apply authentication and clinic context middleware to all routes
router.use(authenticate);
router.use(clinicContext);

// Validation middleware
const paymentValidation = [
  body('invoice_id').isMongoId().withMessage('Valid invoice ID is required'),
  body('patient_id').isMongoId().withMessage('Valid patient ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('method').isIn(['credit_card', 'cash', 'bank_transfer', 'upi', 'insurance']).withMessage('Invalid payment method'),
  body('status').optional().isIn(['completed', 'pending', 'processing', 'failed', 'refunded']).withMessage('Invalid payment status'),
  body('processing_fee').optional().isFloat({ min: 0 }).withMessage('Processing fee must be a positive number'),
  body('description').notEmpty().withMessage('Payment description is required'),
  body('card_last4').optional().isLength({ min: 4, max: 4 }).withMessage('Card last 4 digits must be exactly 4 characters'),
  body('insurance_provider').optional().isLength({ max: 200 }).withMessage('Insurance provider name cannot exceed 200 characters')
];

const statusUpdateValidation = [
  body('status').isIn(['completed', 'pending', 'processing', 'failed', 'refunded']).withMessage('Invalid payment status'),
  body('failure_reason').optional().isLength({ max: 500 }).withMessage('Failure reason cannot exceed 500 characters')
];

const refundValidation = [
  body('refund_amount').isFloat({ min: 0 }).withMessage('Refund amount must be a positive number'),
  body('reason').notEmpty().withMessage('Refund reason is required')
];

// Routes
router.post('/', paymentValidation, PaymentController.createPayment);
router.get('/', PaymentController.getAllPayments);
router.get('/stats', PaymentController.getPaymentStats);
router.get('/:id', PaymentController.getPaymentById);
router.put('/:id', paymentValidation, PaymentController.updatePayment);
router.patch('/:id/status', statusUpdateValidation, PaymentController.updatePaymentStatus);
router.post('/:id/refund', refundValidation, PaymentController.initiateRefund);

export default router; 