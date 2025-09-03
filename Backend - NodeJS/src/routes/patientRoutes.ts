import { Router } from 'express';
import { body } from 'express-validator';
import { PatientController } from '../controllers';
import { authenticate, requireMedicalStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const patientValidation = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('date_of_birth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('address').notEmpty().withMessage('Address is required'),
  body('emergency_contact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergency_contact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
  body('emergency_contact.phone').notEmpty().withMessage('Emergency contact phone is required'),
  body('insurance_info.provider').notEmpty().withMessage('Insurance provider is required'),
  body('insurance_info.policy_number').notEmpty().withMessage('Policy number is required')
];

// Routes - All routes require authentication and medical staff access
router.post('/', authenticate, patientValidation, PatientController.createPatient);
router.get('/', authenticate, PatientController.getAllPatients);
router.get('/stats', authenticate, PatientController.getPatientStats);
router.get('/:id', authenticate, PatientController.getPatientById);
router.put('/:id', authenticate, patientValidation, PatientController.updatePatient);
router.delete('/:id', authenticate, PatientController.deletePatient);

export default router; 