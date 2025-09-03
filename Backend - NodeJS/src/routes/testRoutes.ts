import { Router } from 'express';
import { body } from 'express-validator';
import { TestController } from '../controllers';

const router = Router();

// Validation middleware
const testValidation = [
  body('name').notEmpty().withMessage('Test name is required'),
  body('code').notEmpty().withMessage('Test code is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('turnaroundTime').notEmpty().withMessage('Turnaround time is required'),
  body('normalRange').optional().isLength({ max: 500 }).withMessage('Normal range cannot exceed 500 characters'),
  body('units').optional().isLength({ max: 50 }).withMessage('Units cannot exceed 50 characters'),
  body('methodology').optional().isLength({ max: 200 }).withMessage('Methodology cannot exceed 200 characters'),
  body('sampleType').optional().isLength({ max: 100 }).withMessage('Sample type cannot exceed 100 characters')
];

// Routes
router.post('/', testValidation, TestController.createTest);
router.get('/', TestController.getAllTests);
router.get('/stats', TestController.getTestStats);
router.get('/:id', TestController.getTestById);
router.put('/:id', testValidation, TestController.updateTest);
router.patch('/:id/toggle', TestController.toggleStatus);
router.delete('/:id', TestController.deleteTest);

export default router; 