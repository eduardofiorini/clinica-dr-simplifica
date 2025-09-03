import { Router } from 'express';
import { body } from 'express-validator';
import { TestReportController, upload } from '../controllers/testReportController';

const router = Router();

// Validation middleware
const reportValidation = [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
  body('testId').isMongoId().withMessage('Valid test ID is required'),
  body('externalVendor').notEmpty().withMessage('External vendor is required'),
  body('testDate').isISO8601().withMessage('Valid test date is required'),
  body('recordedDate').isISO8601().withMessage('Valid recorded date is required'),
  body('recordedBy').notEmpty().withMessage('Recorded by is required'),
  body('status').optional().isIn(['pending', 'recorded', 'verified', 'delivered']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
  body('interpretation').optional().isLength({ max: 2000 }).withMessage('Interpretation cannot exceed 2000 characters')
];

const statusUpdateValidation = [
  body('status').isIn(['pending', 'recorded', 'verified', 'delivered']).withMessage('Invalid status'),
  body('verifiedBy').optional().notEmpty().withMessage('Verified by is required when verifying')
];

// Routes
router.post('/', reportValidation, TestReportController.createReport);
router.get('/', TestReportController.getAllReports);
router.get('/stats', TestReportController.getReportStats);
router.get('/patient/:patientId', TestReportController.getPatientReports);
router.get('/:id', TestReportController.getReportById);
router.put('/:id', reportValidation, TestReportController.updateReport);
router.patch('/:id/status', statusUpdateValidation, TestReportController.updateStatus);
router.post('/:id/attachments', upload.single('file'), TestReportController.addAttachment);
router.delete('/:id/attachments/:attachmentId', TestReportController.removeAttachment);
router.delete('/:id', TestReportController.deleteReport);

export default router; 