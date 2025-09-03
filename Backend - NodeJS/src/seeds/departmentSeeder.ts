import Department, { IDepartment } from '../models/Department';

const departmentData: Partial<IDepartment>[] = [
  {
    code: 'CARD',
    name: 'Cardiology',
    description: 'Diagnosis and treatment of heart and cardiovascular diseases',
    head: 'Dr. Sarah Johnson',
    location: 'Building A, Floor 2',
    phone: '+1-555-0101',
    email: 'cardiology@clinic.com',
    staffCount: 15,
    budget: 500000,
    status: 'active'
  },
  {
    code: 'NEURO',
    name: 'Neurology',
    description: 'Disorders of the nervous system including brain and spinal cord',
    head: 'Dr. Michael Chen',
    location: 'Building B, Floor 3',
    phone: '+1-555-0102',
    email: 'neurology@clinic.com',
    staffCount: 12,
    budget: 450000,
    status: 'active'
  },
  {
    code: 'PEDS',
    name: 'Pediatrics',
    description: 'Medical care for infants, children, and adolescents',
    head: 'Dr. Emily Rodriguez',
    location: 'Building C, Floor 1',
    phone: '+1-555-0103',
    email: 'pediatrics@clinic.com',
    staffCount: 18,
    budget: 400000,
    status: 'active'
  },
  {
    code: 'ORTHO',
    name: 'Orthopedics',
    description: 'Treatment of musculoskeletal system disorders',
    head: 'Dr. James Wilson',
    location: 'Building A, Floor 1',
    phone: '+1-555-0104',
    email: 'orthopedics@clinic.com',
    staffCount: 10,
    budget: 380000,
    status: 'active'
  },
  {
    code: 'EMER',
    name: 'Emergency Medicine',
    description: '24/7 emergency medical care and trauma treatment',
    head: 'Dr. Lisa Thompson',
    location: 'Building D, Ground Floor',
    phone: '+1-555-0105',
    email: 'emergency@clinic.com',
    staffCount: 25,
    budget: 600000,
    status: 'active'
  },
  {
    code: 'LAB',
    name: 'Laboratory',
    description: 'Clinical laboratory testing and pathology services',
    head: 'Dr. Robert Kim',
    location: 'Building B, Basement',
    phone: '+1-555-0106',
    email: 'laboratory@clinic.com',
    staffCount: 8,
    budget: 300000,
    status: 'active'
  },
  {
    code: 'RAD',
    name: 'Radiology',
    description: 'Medical imaging and diagnostic radiology services',
    head: 'Dr. Amanda Davis',
    location: 'Building B, Floor 1',
    phone: '+1-555-0107',
    email: 'radiology@clinic.com',
    staffCount: 6,
    budget: 250000,
    status: 'active'
  },
  {
    code: 'ADMIN',
    name: 'Administration',
    description: 'Administrative and management services',
    head: 'Mrs. Jennifer Brown',
    location: 'Building A, Floor 3',
    phone: '+1-555-0108',
    email: 'admin@clinic.com',
    staffCount: 12,
    budget: 200000,
    status: 'active'
  }
];

export async function seedDepartments(): Promise<void> {
  try {
    await Department.deleteMany({});
    await Department.insertMany(departmentData);
  } catch (error) {
    throw error;
  }
} 