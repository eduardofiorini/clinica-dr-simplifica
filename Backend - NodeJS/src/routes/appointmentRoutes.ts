import { Router } from 'express';
import { body } from 'express-validator';
import { AppointmentController } from '../controllers';
import { authenticate, requireMedicalStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const appointmentValidation = [
  body('patient_id').isMongoId().withMessage('Valid patient ID is required'),
  body('doctor_id').isMongoId().withMessage('Valid doctor ID is required'),
  body('nurse_id').optional().isMongoId().withMessage('Valid nurse ID is required if provided'),
  body('appointment_date').isISO8601().withMessage('Please provide a valid appointment date'),
  body('duration').isInt({ min: 15, max: 240 }).withMessage('Duration must be between 15 and 240 minutes'),
  body('type').isIn(['consultation', 'follow-up', 'check-up', 'vaccination', 'procedure', 'emergency', 'screening', 'therapy', 'other']).withMessage('Invalid appointment type'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
];

// Routes - All appointment operations require authentication
router.post('/', authenticate, appointmentValidation, AppointmentController.createAppointment);
router.get('/', authenticate, AppointmentController.getAllAppointments);
router.get('/stats', authenticate, AppointmentController.getAppointmentStats);
router.get('/upcoming', authenticate, AppointmentController.getUpcomingAppointments);
router.get('/doctor/:doctorId/schedule', authenticate, AppointmentController.getDoctorSchedule);
router.get('/:id', authenticate, AppointmentController.getAppointmentById);
router.put('/:id', authenticate, appointmentValidation, AppointmentController.updateAppointment);
router.patch('/:id/cancel', authenticate, AppointmentController.cancelAppointment);

export default router; 