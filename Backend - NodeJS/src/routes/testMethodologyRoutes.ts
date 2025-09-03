import { Router } from 'express';
import { body } from 'express-validator';
import { TestMethodologyController } from '../controllers';

const router = Router();

// Validation middleware
const methodologyValidation = [
  body('name').notEmpty().withMessage('Methodology name is required'),
  body('code').notEmpty().withMessage('Methodology code is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('equipment').notEmpty().withMessage('Equipment information is required'),
  body('principles').notEmpty().withMessage('Principles are required'),
  body('advantages').notEmpty().withMessage('Advantages are required'),
  body('limitations').notEmpty().withMessage('Limitations are required'),
  body('applications').isArray({ min: 1 }).withMessage('At least one application is required'),
  body('applications.*').notEmpty().withMessage('Application cannot be empty')
];

// Routes
router.post('/', methodologyValidation, TestMethodologyController.createMethodology);
router.get('/', TestMethodologyController.getAllMethodologies);
router.get('/stats', TestMethodologyController.getMethodologyStats);
router.get('/:id', TestMethodologyController.getMethodologyById);
router.put('/:id', methodologyValidation, TestMethodologyController.updateMethodology);
router.patch('/:id/toggle', TestMethodologyController.toggleStatus);
router.delete('/:id', TestMethodologyController.deleteMethodology);

export default router; 