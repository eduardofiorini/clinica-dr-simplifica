import Patient, { IPatient } from '../models/Patient';

const patientData: Partial<IPatient>[] = [
  {
    first_name: 'John',
    last_name: 'Smith',
    date_of_birth: new Date('1985-06-15'),
    gender: 'male',
    phone: '+1-555-2001',
    email: 'john.smith@email.com',
    address: '123 Main Street, Anytown, State 12345',
    emergency_contact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1-555-2002',
      email: 'jane.smith@email.com'
    },
    insurance_info: {
      provider: 'Blue Cross Blue Shield',
      policy_number: 'BC123456789',
      group_number: 'GRP001',
      expiry_date: new Date('2024-12-31')
    }
  },
  {
    first_name: 'Maria',
    last_name: 'Garcia',
    date_of_birth: new Date('1992-03-22'),
    gender: 'female',
    phone: '+1-555-2003',
    email: 'maria.garcia@email.com',
    address: '456 Oak Avenue, Springfield, State 12346',
    emergency_contact: {
      name: 'Carlos Garcia',
      relationship: 'Father',
      phone: '+1-555-2004',
      email: 'carlos.garcia@email.com'
    },
    insurance_info: {
      provider: 'Aetna',
      policy_number: 'AE987654321',
      group_number: 'GRP002',
      expiry_date: new Date('2024-11-30')
    }
  },
  {
    first_name: 'Robert',
    last_name: 'Johnson',
    date_of_birth: new Date('1975-11-08'),
    gender: 'male',
    phone: '+1-555-2005',
    email: 'robert.johnson@email.com',
    address: '789 Pine Street, Riverside, State 12347',
    emergency_contact: {
      name: 'Susan Johnson',
      relationship: 'Wife',
      phone: '+1-555-2006',
      email: 'susan.johnson@email.com'
    },
    insurance_info: {
      provider: 'Cigna',
      policy_number: 'CG456789123',
      group_number: 'GRP003',
      expiry_date: new Date('2024-10-31')
    }
  },
  {
    first_name: 'Emily',
    last_name: 'Davis',
    date_of_birth: new Date('2010-08-14'),
    gender: 'female',
    phone: '+1-555-2007',
    email: 'emily.davis@email.com',
    address: '321 Elm Street, Hillside, State 12348',
    emergency_contact: {
      name: 'Michael Davis',
      relationship: 'Father',
      phone: '+1-555-2008',
      email: 'michael.davis@email.com'
    },
    insurance_info: {
      provider: 'United Healthcare',
      policy_number: 'UH789123456',
      group_number: 'GRP004',
      expiry_date: new Date('2024-09-30')
    }
  },
  {
    first_name: 'William',
    last_name: 'Brown',
    date_of_birth: new Date('1955-12-03'),
    gender: 'male',
    phone: '+1-555-2009',
    email: 'william.brown@email.com',
    address: '654 Maple Drive, Lakewood, State 12349',
    emergency_contact: {
      name: 'Margaret Brown',
      relationship: 'Wife',
      phone: '+1-555-2010',
      email: 'margaret.brown@email.com'
    },
    insurance_info: {
      provider: 'Medicare',
      policy_number: 'MC321654987',
      group_number: 'GRP005',
      expiry_date: new Date('2024-12-31')
    }
  },
  {
    first_name: 'Sarah',
    last_name: 'Wilson',
    date_of_birth: new Date('1988-04-17'),
    gender: 'female',
    phone: '+1-555-2011',
    email: 'sarah.wilson@email.com',
    address: '987 Cedar Lane, Fairview, State 12350',
    emergency_contact: {
      name: 'David Wilson',
      relationship: 'Husband',
      phone: '+1-555-2012',
      email: 'david.wilson@email.com'
    },
    insurance_info: {
      provider: 'Humana',
      policy_number: 'HU654987321',
      group_number: 'GRP006',
      expiry_date: new Date('2024-08-31')
    }
  },
  {
    first_name: 'Christopher',
    last_name: 'Lee',
    date_of_birth: new Date('1970-09-25'),
    gender: 'male',
    phone: '+1-555-2013',
    email: 'christopher.lee@email.com',
    address: '147 Birch Street, Greenfield, State 12351',
    emergency_contact: {
      name: 'Lisa Lee',
      relationship: 'Wife',
      phone: '+1-555-2014',
      email: 'lisa.lee@email.com'
    },
    insurance_info: {
      provider: 'Kaiser Permanente',
      policy_number: 'KP987321654',
      group_number: 'GRP007',
      expiry_date: new Date('2024-07-31')
    }
  },
  {
    first_name: 'Jessica',
    last_name: 'Taylor',
    date_of_birth: new Date('1995-01-12'),
    gender: 'female',
    phone: '+1-555-2015',
    email: 'jessica.taylor@email.com',
    address: '258 Walnut Avenue, Westside, State 12352',
    emergency_contact: {
      name: 'Jennifer Taylor',
      relationship: 'Mother',
      phone: '+1-555-2016',
      email: 'jennifer.taylor@email.com'
    },
    insurance_info: {
      provider: 'Anthem',
      policy_number: 'AN147258369',
      group_number: 'GRP008',
      expiry_date: new Date('2024-06-30')
    }
  },
  {
    first_name: 'Daniel',
    last_name: 'Anderson',
    date_of_birth: new Date('1982-07-30'),
    gender: 'male',
    phone: '+1-555-2017',
    email: 'daniel.anderson@email.com',
    address: '369 Spruce Road, Eastpark, State 12353',
    emergency_contact: {
      name: 'Amanda Anderson',
      relationship: 'Wife',
      phone: '+1-555-2018',
      email: 'amanda.anderson@email.com'
    },
    insurance_info: {
      provider: 'Molina Healthcare',
      policy_number: 'MH258369147',
      group_number: 'GRP009',
      expiry_date: new Date('2024-05-31')
    }
  },
  {
    first_name: 'Ashley',
    last_name: 'Martinez',
    date_of_birth: new Date('1993-10-05'),
    gender: 'female',
    phone: '+1-555-2019',
    email: 'ashley.martinez@email.com',
    address: '741 Poplar Street, Northside, State 12354',
    emergency_contact: {
      name: 'Roberto Martinez',
      relationship: 'Brother',
      phone: '+1-555-2020',
      email: 'roberto.martinez@email.com'
    },
    insurance_info: {
      provider: 'Medicaid',
      policy_number: 'MD369147258',
      group_number: 'GRP010',
      expiry_date: new Date('2024-04-30')
    }
  }
];

export async function seedPatients(): Promise<void> {
  try {
    await Patient.deleteMany({});
    await Patient.insertMany(patientData);
  } catch (error) {
    throw error;
  }
} 