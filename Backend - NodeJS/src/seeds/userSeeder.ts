import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { User, UserClinic } from '../models';

/**
 * Comprehensive user seeder with realistic data and multi-clinic relationships
 */
export async function seedUsers(clinicIds: mongoose.Types.ObjectId[]): Promise<void> {
  console.log('Seeding users and user-clinic relationships...');
  
  try {
    // Clear existing users and user-clinic relationships
    await User.deleteMany({});
    await UserClinic.deleteMany({});
    
    // Define user roles and their counts per clinic
    const roleTemplates = {
      admin: 1,      // 1 admin per clinic
      doctor: 3,     // 3 doctors per clinic
      nurse: 2,      // 2 nurses per clinic
      receptionist: 2, // 2 receptionists per clinic
      accountant: 1,  // 1 accountant per clinic
      staff: 1       // 1 general staff per clinic
    };
    
    const specializations = [
      'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
      'Dermatology', 'Gynecology', 'Psychiatry', 'Radiology', 'Anesthesiology',
      'Emergency Medicine', 'Internal Medicine', 'Family Medicine'
    ];
    
    const departments = [
      'Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
      'General Medicine', 'ICU', 'Surgery', 'Radiology', 'Laboratory'
    ];
    
    let totalUsersCreated = 0;
    let totalUserClinicsCreated = 0;
    
    for (const clinicId of clinicIds) {
      console.log(`  Creating users for clinic: ${clinicId}`);
      
      for (const [role, count] of Object.entries(roleTemplates)) {
        for (let i = 0; i < count; i++) {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();
          const email = faker.internet.email({ firstName, lastName }).toLowerCase();
          
          const userData = {
            clinic_id: clinicId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password_hash: 'password123', // Will be hashed by pre-save middleware
            phone: faker.phone.number().substring(0, 15),
            role: role as 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'accountant' | 'staff',
            is_active: faker.datatype.boolean({ probability: 0.95 }),
            is_verified: faker.datatype.boolean({ probability: 0.9 }),
            base_currency: 'USD',
            address: faker.location.streetAddress({ useFullAddress: true }),
            bio: faker.lorem.paragraph(),
            date_of_birth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
            specialization: role === 'doctor' ? faker.helpers.arrayElement(specializations) : undefined,
            license_number: role === 'doctor' ? `LIC-${faker.string.alphanumeric(8).toUpperCase()}` : undefined,
            department: ['nurse', 'staff'].includes(role) ? faker.helpers.arrayElement(departments) : undefined,
            avatar: faker.image.avatar(),
            schedule: role === 'doctor' ? {
              monday: { start: "08:00", end: "17:00", isWorking: true },
              tuesday: { start: "08:00", end: "17:00", isWorking: true },
              wednesday: { start: "08:00", end: "17:00", isWorking: true },
              thursday: { start: "08:00", end: "17:00", isWorking: true },
              friday: { start: "08:00", end: "16:00", isWorking: true },
              saturday: { start: "09:00", end: "14:00", isWorking: faker.datatype.boolean() },
              sunday: { start: "00:00", end: "00:00", isWorking: false }
            } : undefined
          };
          
          const createdUser = await User.create(userData);
          totalUsersCreated++;
          
          // Create UserClinic relationship
          const userClinicData = {
            user_id: createdUser._id,
            clinic_id: clinicId,
            role: role as 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'accountant' | 'staff',
            permissions: getDefaultPermissionsByRole(role),
            is_active: true,
            joined_at: faker.date.recent({ days: 365 })
          };
          
          await UserClinic.create(userClinicData);
          totalUserClinicsCreated++;
        }
      }
    }
    
    // Create some super admins that have access to multiple clinics
    console.log('  Creating super admins with multi-clinic access...');
    
    for (let i = 0; i < 2; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      
      const superAdminData = {
        clinic_id: clinicIds[0], // Primary clinic
        first_name: firstName,
        last_name: lastName,
        email: email,
        password_hash: 'password123', // Will be hashed by pre-save middleware
        phone: faker.phone.number().substring(0, 15),
        role: 'admin' as const,
        is_active: true,
        is_verified: true,
        base_currency: 'USD',
        address: faker.location.streetAddress({ useFullAddress: true }),
        bio: 'Super Administrator with multi-clinic access',
        date_of_birth: faker.date.birthdate({ min: 30, max: 55, mode: 'age' }),
        avatar: faker.image.avatar()
      };
      
      const createdSuperAdmin = await User.create(superAdminData);
      totalUsersCreated++;
      
      // Create UserClinic relationships for all clinics
      for (const clinicId of clinicIds) {
        const userClinicData = {
          user_id: createdSuperAdmin._id,
          clinic_id: clinicId,
          role: 'admin' as const,
          permissions: getDefaultPermissionsByRole('admin'),
          is_active: true,
          joined_at: faker.date.recent({ days: 365 })
        };
        
        await UserClinic.create(userClinicData);
        totalUserClinicsCreated++;
      }
    }
    
    console.log(`  Created ${totalUsersCreated} users`);
    console.log(`  Created ${totalUserClinicsCreated} user-clinic relationships`);
    
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

/**
 * Get default permissions for a role
 */
function getDefaultPermissionsByRole(role: string): string[] {
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
}
