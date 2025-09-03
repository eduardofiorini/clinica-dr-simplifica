import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserClinic extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  clinic_id: Types.ObjectId;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'accountant' | 'staff';
  permissions: string[]; // Custom permissions per clinic
  is_active: boolean;
  joined_at: Date;
  created_at: Date;
  updated_at: Date;
}

const UserClinicSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  clinic_id: {
    type: Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Clinic ID is required'],
    index: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'accountant', 'staff'],
    required: [true, 'Role is required'],
    default: 'staff'
  },
  permissions: {
    type: [String],
    default: [],
    validate: {
      validator: function(permissions: string[]) {
        // Validate that permissions are from allowed list
        const allowedPermissions = [
          'read_patients',
          'write_patients',
          'delete_patients',
          'read_appointments',
          'write_appointments',
          'delete_appointments',
          'read_medical_records',
          'write_medical_records',
          'delete_medical_records',
          'read_prescriptions',
          'write_prescriptions',
          'delete_prescriptions',
          'read_invoices',
          'write_invoices',
          'delete_invoices',
          'read_payments',
          'write_payments',
          'delete_payments',
          'read_inventory',
          'write_inventory',
          'delete_inventory',
          'read_staff',
          'write_staff',
          'delete_staff',
          'read_reports',
          'write_reports',
          'manage_clinic_settings',
          'view_analytics',
          'manage_departments',
          'manage_services',
          'manage_tests',
          'view_payroll',
          'manage_payroll'
        ];
        return permissions.every(permission => allowedPermissions.includes(permission));
      },
      message: 'Invalid permission provided'
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  joined_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Compound indexes for better performance
UserClinicSchema.index({ user_id: 1, clinic_id: 1 }, { unique: true });
UserClinicSchema.index({ user_id: 1, is_active: 1 });
UserClinicSchema.index({ clinic_id: 1, is_active: 1 });
UserClinicSchema.index({ clinic_id: 1, role: 1 });

// Static methods
UserClinicSchema.statics.findUserClinics = function(userId: string) {
  return this.find({ user_id: userId, is_active: true })
    .populate('clinic_id', 'name code description is_active')
    .sort({ joined_at: 1 });
};

UserClinicSchema.statics.findClinicUsers = function(clinicId: string) {
  return this.find({ clinic_id: clinicId, is_active: true })
    .populate('user_id', 'first_name last_name email phone role is_active')
    .sort({ role: 1, joined_at: 1 });
};

UserClinicSchema.statics.findUserClinicRelation = function(userId: string, clinicId: string) {
  return this.findOne({ 
    user_id: userId, 
    clinic_id: clinicId, 
    is_active: true 
  }).populate('clinic_id user_id');
};

UserClinicSchema.statics.getUserPermissions = function(userId: string, clinicId: string) {
  return this.findOne({ 
    user_id: userId, 
    clinic_id: clinicId, 
    is_active: true 
  }).select('role permissions');
};

UserClinicSchema.statics.getClinicAdmins = function(clinicId: string) {
  return this.find({ 
    clinic_id: clinicId, 
    role: 'admin', 
    is_active: true 
  }).populate('user_id', 'first_name last_name email phone');
};

// Instance methods
UserClinicSchema.methods.activate = function() {
  this.is_active = true;
  return this.save();
};

UserClinicSchema.methods.deactivate = function() {
  this.is_active = false;
  return this.save();
};

UserClinicSchema.methods.updateRole = function(newRole: string) {
  this.role = newRole;
  // Set default permissions based on role
  this.permissions = this.getDefaultPermissionsByRole(newRole);
  return this.save();
};

UserClinicSchema.methods.addPermissions = function(permissions: string[]) {
  const currentPermissions = new Set(this.permissions);
  permissions.forEach(permission => currentPermissions.add(permission));
  this.permissions = Array.from(currentPermissions);
  return this.save();
};

UserClinicSchema.methods.removePermissions = function(permissions: string[]) {
  this.permissions = this.permissions.filter((permission: string) => !permissions.includes(permission));
  return this.save();
};

UserClinicSchema.methods.hasPermission = function(permission: string) {
  return this.permissions.includes(permission);
};

UserClinicSchema.methods.getDefaultPermissionsByRole = function(role: string): string[] {
  const rolePermissions: { [key: string]: string[] } = {
    admin: [
      'read_patients', 'write_patients', 'delete_patients',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_medical_records', 'write_medical_records', 'delete_medical_records',
      'read_prescriptions', 'write_prescriptions', 'delete_prescriptions',
      'read_invoices', 'write_invoices', 'delete_invoices',
      'read_payments', 'write_payments', 'delete_payments',
      'read_inventory', 'write_inventory', 'delete_inventory',
      'read_staff', 'write_staff', 'delete_staff',
      'read_reports', 'write_reports',
      'manage_clinic_settings', 'view_analytics',
      'manage_departments', 'manage_services', 'manage_tests',
      'view_payroll', 'manage_payroll'
    ],
    doctor: [
      'read_patients', 'write_patients',
      'read_appointments', 'write_appointments',
      'read_medical_records', 'write_medical_records',
      'read_prescriptions', 'write_prescriptions',
      'read_reports', 'write_reports',
      'manage_tests'
    ],
    nurse: [
      'read_patients', 'write_patients',
      'read_appointments', 'write_appointments',
      'read_medical_records', 'write_medical_records',
      'read_inventory', 'write_inventory',
      'read_reports'
    ],
    receptionist: [
      'read_patients', 'write_patients',
      'read_appointments', 'write_appointments',
      'read_invoices', 'write_invoices',
      'read_payments', 'write_payments'
    ],
    accountant: [
      'read_invoices', 'write_invoices', 'delete_invoices',
      'read_payments', 'write_payments', 'delete_payments',
      'read_reports', 'write_reports',
      'view_payroll', 'manage_payroll',
      'view_analytics'
    ],
    staff: [
      'read_patients',
      'read_appointments',
      'read_reports'
    ]
  };

  return rolePermissions[role] || [];
};

// Pre-save middleware
UserClinicSchema.pre<IUserClinic>('save', function(next) {
  if (!this.isNew) {
    this.updated_at = new Date();
  }
  
  // Set default permissions if none provided
  const permissions = this.permissions as string[];
  if (this.isNew && (!permissions || permissions.length === 0)) {
    const rolePermissions: { [key: string]: string[] } = {
      admin: [
        'read_patients', 'write_patients', 'delete_patients',
        'read_appointments', 'write_appointments', 'delete_appointments',
        'read_medical_records', 'write_medical_records', 'delete_medical_records',
        'read_prescriptions', 'write_prescriptions', 'delete_prescriptions',
        'read_invoices', 'write_invoices', 'delete_invoices',
        'read_payments', 'write_payments', 'delete_payments',
        'read_inventory', 'write_inventory', 'delete_inventory',
        'read_staff', 'write_staff', 'delete_staff',
        'read_reports', 'write_reports',
        'manage_clinic_settings', 'view_analytics',
        'manage_departments', 'manage_services', 'manage_tests',
        'view_payroll', 'manage_payroll'
      ],
      doctor: [
        'read_patients', 'write_patients',
        'read_appointments', 'write_appointments',
        'read_medical_records', 'write_medical_records',
        'read_prescriptions', 'write_prescriptions',
        'read_reports', 'write_reports',
        'manage_tests'
      ],
      nurse: [
        'read_patients', 'write_patients',
        'read_appointments', 'write_appointments',
        'read_medical_records', 'write_medical_records',
        'read_inventory', 'write_inventory',
        'read_reports'
      ],
      receptionist: [
        'read_patients', 'write_patients',
        'read_appointments', 'write_appointments',
        'read_invoices', 'write_invoices',
        'read_payments', 'write_payments'
      ],
      accountant: [
        'read_invoices', 'write_invoices', 'delete_invoices',
        'read_payments', 'write_payments', 'delete_payments',
        'read_reports', 'write_reports',
        'view_payroll', 'manage_payroll',
        'view_analytics'
      ],
      staff: [
        'read_patients',
        'read_appointments',
        'read_reports'
      ]
    };
    this.permissions = rolePermissions[this.role as string] || [];
  }
  
  next();
});

// Pre-save validation to ensure user-clinic combination is unique
UserClinicSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await mongoose.model('UserClinic').findOne({
      user_id: this.user_id,
      clinic_id: this.clinic_id
    });
    
    if (existing) {
      const error = new Error('User is already associated with this clinic');
      return next(error);
    }
  }
  next();
});

export const UserClinic = mongoose.model<IUserClinic>('UserClinic', UserClinicSchema);
export default UserClinic; 