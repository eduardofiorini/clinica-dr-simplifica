import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

const userData: Partial<IUser>[] = [
  {
    email: 'admin@clinic.com',
    password_hash: 'admin123',
    first_name: 'John',
    last_name: 'Administrator',
    role: 'admin',
    phone: '+1-555-1001',
    is_active: true,
    base_currency: 'USD',
    address: '123 Admin Street, City, State 12345',
    bio: 'System Administrator with 10 years experience in healthcare management',
    date_of_birth: new Date('1980-05-15'),
    department: 'Administration'
  },
  {
    email: 'sarah.johnson@clinic.com',
    password_hash: 'doctor123',
    first_name: 'Sarah',
    last_name: 'Johnson',
    role: 'doctor',
    phone: '+1-555-1002',
    is_active: true,
    base_currency: 'USD',
    address: '456 Doctor Lane, City, State 12345',
    bio: 'Cardiologist with 15 years of experience in cardiovascular medicine',
    date_of_birth: new Date('1975-08-22'),
    specialization: 'Cardiology',
    license_number: 'MD-12345',
    department: 'Cardiology'
  },
  {
    email: 'michael.chen@clinic.com',
    password_hash: 'doctor123',
    first_name: 'Michael',
    last_name: 'Chen',
    role: 'doctor',
    phone: '+1-555-1003',
    is_active: true,
    base_currency: 'USD',
    address: '789 Medical Ave, City, State 12345',
    bio: 'Neurologist specializing in brain disorders and neurological conditions',
    date_of_birth: new Date('1978-12-10'),
    specialization: 'Neurology',
    license_number: 'MD-12346',
    department: 'Neurology'
  },
  {
    email: 'emily.rodriguez@clinic.com',
    password_hash: 'doctor123',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    role: 'doctor',
    phone: '+1-555-1004',
    is_active: true,
    base_currency: 'USD',
    address: '321 Pediatric Blvd, City, State 12345',
    bio: 'Pediatrician dedicated to providing comprehensive care for children',
    date_of_birth: new Date('1982-03-18'),
    specialization: 'Pediatrics',
    license_number: 'MD-12347',
    department: 'Pediatrics'
  },
  {
    email: 'james.wilson@clinic.com',
    password_hash: 'doctor123',
    first_name: 'James',
    last_name: 'Wilson',
    role: 'doctor',
    phone: '+1-555-1005',
    is_active: true,
    base_currency: 'USD',
    address: '654 Orthopedic St, City, State 12345',
    bio: 'Orthopedic surgeon with expertise in joint replacement and sports medicine',
    date_of_birth: new Date('1976-11-25'),
    specialization: 'Orthopedics',
    license_number: 'MD-12348',
    department: 'Orthopedics'
  },
  {
    email: 'mary.nurse@clinic.com',
    password_hash: 'nurse123',
    first_name: 'Mary',
    last_name: 'Williams',
    role: 'nurse',
    phone: '+1-555-1006',
    is_active: true,
    base_currency: 'USD',
    address: '987 Nursing Way, City, State 12345',
    bio: 'Registered Nurse with 8 years experience in patient care',
    date_of_birth: new Date('1985-07-14'),
    department: 'Emergency Medicine'
  },
  {
    email: 'linda.receptionist@clinic.com',
    password_hash: 'receptionist123',
    first_name: 'Linda',
    last_name: 'Davis',
    role: 'receptionist',
    phone: '+1-555-1007',
    is_active: true,
    base_currency: 'USD',
    address: '147 Reception Ave, City, State 12345',
    bio: 'Front desk receptionist managing patient appointments and inquiries',
    date_of_birth: new Date('1990-01-30'),
    department: 'Administration'
  },
  {
    email: 'robert.accountant@clinic.com',
    password_hash: 'accountant123',
    first_name: 'Robert',
    last_name: 'Brown',
    role: 'accountant',
    phone: '+1-555-1008',
    is_active: true,
    base_currency: 'USD',
    address: '258 Finance Rd, City, State 12345',
    bio: 'Certified Public Accountant managing clinic finances and billing',
    date_of_birth: new Date('1983-09-05'),
    department: 'Administration'
  },
  {
    email: 'alice.nurse@clinic.com',
    password_hash: 'nurse123',
    first_name: 'Alice',
    last_name: 'Miller',
    role: 'nurse',
    phone: '+1-555-1009',
    is_active: true,
    base_currency: 'USD',
    address: '369 Care Street, City, State 12345',
    bio: 'Pediatric nurse with specialization in child healthcare',
    date_of_birth: new Date('1987-04-12'),
    department: 'Pediatrics'
  },
  {
    email: 'david.staff@clinic.com',
    password_hash: 'staff123',
    first_name: 'David',
    last_name: 'Garcia',
    role: 'staff',
    phone: '+1-555-1010',
    is_active: true,
    base_currency: 'USD',
    address: '741 Support Lane, City, State 12345',
    bio: 'Laboratory technician supporting diagnostic services',
    date_of_birth: new Date('1989-12-20'),
    department: 'Laboratory'
  }
];

export async function seedUsers(): Promise<void> {
  try {
    await User.deleteMany({});
    
    const users = await Promise.all(
      userData.map(async (user) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password_hash as string, salt);
        
        return {
          ...user,
          password_hash: hashedPassword
        };
      })
    );
    
    await User.insertMany(users);
  } catch (error) {
    throw error;
  }
} 