import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'advertisement' | 'walk-in';
  serviceInterest: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  assignedTo?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const LeadSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [100, 'First name cannot exceed 100 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [100, 'Last name cannot exceed 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'advertisement', 'walk-in'],
    required: [true, 'Lead source is required']
  },
  serviceInterest: {
    type: String,
    required: [true, 'Service interest is required'],
    trim: true,
    maxlength: [200, 'Service interest cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'lost'],
    default: 'new',
    required: [true, 'Status is required']
  },
  assignedTo: {
    type: String,
    trim: true,
    maxlength: [100, 'Assigned to cannot exceed 100 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create index for better search performance
LeadSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  phone: 'text'
});

// Index for filtering by status and source
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ assignedTo: 1 });

// Compound index for common queries
LeadSchema.index({ status: 1, source: 1 });
LeadSchema.index({ created_at: -1 });

// Virtual for full name
LeadSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model<ILead>('Lead', LeadSchema); 