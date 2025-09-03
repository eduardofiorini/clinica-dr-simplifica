import mongoose, { Document, Schema } from 'mongoose';

export interface ISampleType extends Document {
  name: string;
  code: string;
  description: string;
  category: 'blood' | 'urine' | 'body_fluid' | 'tissue' | 'swab' | 'other';
  collectionMethod: string;
  container: string;
  preservative?: string;
  storageTemp: string;
  storageTime: string;
  volume: string;
  specialInstructions?: string;
  commonTests: string[];
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

const SampleTypeSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Sample type name is required'],
    trim: true,
    maxlength: [100, 'Sample type name cannot exceed 100 characters'],
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Sample type code is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Sample type code cannot exceed 20 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['blood', 'urine', 'body_fluid', 'tissue', 'swab', 'other'],
      message: 'Invalid sample category'
    }
  },
  collectionMethod: {
    type: String,
    required: [true, 'Collection method is required'],
    trim: true,
    maxlength: [200, 'Collection method cannot exceed 200 characters']
  },
  container: {
    type: String,
    required: [true, 'Container information is required'],
    trim: true,
    maxlength: [200, 'Container information cannot exceed 200 characters']
  },
  preservative: {
    type: String,
    trim: true,
    maxlength: [100, 'Preservative information cannot exceed 100 characters']
  },
  storageTemp: {
    type: String,
    required: [true, 'Storage temperature is required'],
    trim: true,
    maxlength: [50, 'Storage temperature cannot exceed 50 characters']
  },
  storageTime: {
    type: String,
    required: [true, 'Storage time is required'],
    trim: true,
    maxlength: [100, 'Storage time cannot exceed 100 characters']
  },
  volume: {
    type: String,
    required: [true, 'Volume requirement is required'],
    trim: true,
    maxlength: [50, 'Volume requirement cannot exceed 50 characters']
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: [1000, 'Special instructions cannot exceed 1000 characters']
  },
  commonTests: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes for better performance
SampleTypeSchema.index({ name: 'text', code: 'text', description: 'text' });
SampleTypeSchema.index({ category: 1 });
SampleTypeSchema.index({ isActive: 1 });

// Pre-save middleware to ensure code is uppercase
SampleTypeSchema.pre('save', function(this: ISampleType, next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

export default mongoose.model<ISampleType>('SampleType', SampleTypeSchema); 