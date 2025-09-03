import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCategory extends Document {
  name: string;
  code: string;
  description: string;
  department: string;
  color: string;
  icon: string;
  testCount: number;
  commonTests: string[];
  isActive: boolean;
  sortOrder: number;
  created_at: Date;
  updated_at: Date;
}

const TestCategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Category code is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Category code cannot exceed 20 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    enum: ['beaker', 'test-tube', 'heart', 'zap', 'microscope', 'folder'],
    default: 'folder'
  },
  testCount: {
    type: Number,
    default: 0,
    min: [0, 'Test count cannot be negative']
  },
  commonTests: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes for better performance
TestCategorySchema.index({ name: 'text', code: 'text', description: 'text' });
TestCategorySchema.index({ department: 1 });
TestCategorySchema.index({ isActive: 1 });
TestCategorySchema.index({ sortOrder: 1 });

// Pre-save middleware to ensure code is uppercase
TestCategorySchema.pre('save', function(this: ITestCategory, next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

export default mongoose.model<ITestCategory>('TestCategory', TestCategorySchema); 