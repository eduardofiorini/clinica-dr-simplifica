import Service from '../models/Service';

export async function seedServices(): Promise<void> {
  try {
    await Service.deleteMany({});
    
    await Service.insertMany([
      { name: 'General Consultation', category: 'Consultation', description: 'General medical consultation', duration: 30, price: 150, department: 'General Medicine', maxBookingsPerDay: 20 },
      { name: 'Cardiology Consultation', category: 'Consultation', description: 'Specialized cardiac consultation', duration: 45, price: 300, department: 'Cardiology', maxBookingsPerDay: 10 },
      { name: 'Pediatric Checkup', category: 'Checkup', description: 'Routine pediatric examination', duration: 30, price: 120, department: 'Pediatrics', maxBookingsPerDay: 15 },
      { name: 'Blood Test', category: 'Laboratory', description: 'Comprehensive blood analysis', duration: 15, price: 80, department: 'Laboratory', maxBookingsPerDay: 50 },
      { name: 'X-Ray', category: 'Imaging', description: 'Digital X-ray imaging', duration: 20, price: 100, department: 'Radiology', maxBookingsPerDay: 30 }
    ]);
  } catch (error) {
    throw error;
  }
} 