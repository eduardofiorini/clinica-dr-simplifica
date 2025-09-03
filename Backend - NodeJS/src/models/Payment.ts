import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  invoice_id: mongoose.Types.ObjectId;
  patient_id: mongoose.Types.ObjectId;
  amount: number;
  method: 'credit_card' | 'cash' | 'bank_transfer' | 'upi' | 'insurance';
  status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';
  transaction_id?: string;
  card_last4?: string;
  insurance_provider?: string;
  processing_fee: number;
  net_amount: number;
  payment_date: Date;
  failure_reason?: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

const PaymentSchema: Schema = new Schema({
  invoice_id: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required']
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative'],
    validate: {
      validator: function(value: number) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Payment amount must be a valid positive number'
    }
  },
  method: {
    type: String,
    enum: ['credit_card', 'cash', 'bank_transfer', 'upi', 'insurance'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'processing', 'failed', 'refunded'],
    required: [true, 'Payment status is required'],
    default: 'pending'
  },
  transaction_id: {
    type: String,
    trim: true,
    maxlength: [100, 'Transaction ID cannot exceed 100 characters']
  },
  card_last4: {
    type: String,
    trim: true,
    maxlength: [4, 'Card last 4 digits cannot exceed 4 characters'],
    minlength: [4, 'Card last 4 digits must be exactly 4 characters']
  },
  insurance_provider: {
    type: String,
    trim: true,
    maxlength: [200, 'Insurance provider name cannot exceed 200 characters']
  },
  processing_fee: {
    type: Number,
    required: [true, 'Processing fee is required'],
    min: [0, 'Processing fee cannot be negative'],
    default: 0
  },
  net_amount: {
    type: Number,
    min: [0, 'Net amount cannot be negative']
  },
  payment_date: {
    type: Date,
    required: [true, 'Payment date is required'],
    default: Date.now
  },
  failure_reason: {
    type: String,
    trim: true,
    maxlength: [500, 'Failure reason cannot exceed 500 characters']
  },
  description: {
    type: String,
    required: [true, 'Payment description is required'],
    trim: true,
    maxlength: [500, 'Payment description cannot exceed 500 characters']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes for better query performance
PaymentSchema.index({ invoice_id: 1 });
PaymentSchema.index({ patient_id: 1, payment_date: -1 });
PaymentSchema.index({ status: 1, payment_date: -1 });
PaymentSchema.index({ method: 1 });
PaymentSchema.index({ payment_date: -1 });

// Pre-save middleware to calculate net amount
PaymentSchema.pre('save', function(next) {
  // Always calculate net_amount for new documents or when amount/processing_fee are modified
  if (this.isNew || this.isModified('amount') || this.isModified('processing_fee')) {
    this.net_amount = (this.amount as number) - (this.processing_fee as number);
  }
  next();
});

// Virtual to generate payment ID for display
PaymentSchema.virtual('payment_id').get(function() {
  return `PAY-${(this._id as any).toString().slice(-6).toUpperCase()}`;
});

export default mongoose.model<IPayment>('Payment', PaymentSchema); 