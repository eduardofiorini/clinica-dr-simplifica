import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  category: string;
  description: string;
  duration: number; // in minutes
  price: number;
  department: string;
  isActive: boolean;
  prerequisites?: string;
  followUpRequired: boolean;
  maxBookingsPerDay: number;
  specialInstructions?: string;
  created_at: Date;
  updated_at: Date;
}

const ServiceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 1440 // Max 24 hours
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  department: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  prerequisites: {
    type: String,
    trim: true,
    maxlength: 500
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  maxBookingsPerDay: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better query performance
ServiceSchema.index({ name: 1 });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ department: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ price: 1 });

export default mongoose.model<IService>('Service', ServiceSchema); 