import { Router } from 'express';
import { body } from 'express-validator';
import { TestCategoryController } from '../controllers';

const router = Router();

// Validation middleware
const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('code').notEmpty().withMessage('Category code is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('color').matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Please provide a valid hex color'),
  body('icon').isIn(['beaker', 'test-tube', 'heart', 'zap', 'microscope', 'folder']).withMessage('Invalid icon type'),
  body('testCount').optional().isInt({ min: 0 }).withMessage('Test count must be a non-negative integer'),
  body('commonTests').optional().isArray().withMessage('Common tests must be an array'),
  body('sortOrder').optional().isInt().withMessage('Sort order must be an integer')
];

// Routes
router.post('/', categoryValidation, TestCategoryController.createCategory);
router.get('/', TestCategoryController.getAllCategories);
router.get('/stats', TestCategoryController.getCategoryStats);
router.get('/:id', TestCategoryController.getCategoryById);
router.put('/:id', categoryValidation, TestCategoryController.updateCategory);
router.patch('/:id/toggle', TestCategoryController.toggleStatus);
router.delete('/:id', TestCategoryController.deleteCategory);

export default router; 