import SampleType from '../models/SampleType';
import TestMethodology from '../models/TestMethodology';
import TurnaroundTime from '../models/TurnaroundTime';
import LabVendor from '../models/LabVendor';
import Training from '../models/Training';
import Inventory from '../models/Inventory';
import Lead from '../models/Lead';

export async function seedSampleTypes(): Promise<void> {
  try {
    await SampleType.deleteMany({});
    
    await SampleType.insertMany([
      { name: 'Venous Blood', code: 'VB', description: 'Blood drawn from vein', category: 'blood', collectionMethod: 'Venipuncture', container: 'EDTA tube', storageTemp: '2-8°C', storageTime: '24 hours', volume: '5ml', commonTests: ['CBC', 'Chemistry'] },
      { name: 'Urine', code: 'UR', description: 'Clean catch urine sample', category: 'urine', collectionMethod: 'Midstream collection', container: 'Sterile container', storageTemp: '2-8°C', storageTime: '2 hours', volume: '50ml', commonTests: ['Urinalysis', 'Culture'] },
      { name: 'Throat Swab', code: 'TS', description: 'Throat culture sample', category: 'swab', collectionMethod: 'Swab collection', container: 'Transport medium', storageTemp: 'Room temp', storageTime: '24 hours', volume: 'N/A', commonTests: ['Strep test', 'Culture'] }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedTestMethodologies(): Promise<void> {
  try {
    await TestMethodology.deleteMany({});
    
    await TestMethodology.insertMany([
      { name: 'ELISA', code: 'ELI', description: 'Enzyme-Linked Immunosorbent Assay', category: 'Immunology', equipment: 'ELISA Reader', principles: 'Antibody-antigen binding', applications: ['Hormones', 'Infections'], advantages: 'High specificity', limitations: 'Time consuming' },
      { name: 'PCR', code: 'PCR', description: 'Polymerase Chain Reaction', category: 'Molecular', equipment: 'Thermal Cycler', principles: 'DNA amplification', applications: ['Genetic testing', 'Pathogen detection'], advantages: 'High sensitivity', limitations: 'Contamination risk' }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedTurnaroundTimes(): Promise<void> {
  try {
    await TurnaroundTime.deleteMany({});
    
    await TurnaroundTime.insertMany([
      { name: 'STAT', code: 'STAT', duration: '1 hour', durationMinutes: 60, priority: 'stat', category: 'Emergency', description: 'Immediate processing', examples: ['Troponin', 'Blood gas'] },
      { name: 'Urgent', code: 'URG', duration: '4 hours', durationMinutes: 240, priority: 'urgent', category: 'Priority', description: 'Same day processing', examples: ['CBC', 'Basic metabolic panel'] },
      { name: 'Routine', code: 'ROU', duration: '24 hours', durationMinutes: 1440, priority: 'routine', category: 'Standard', description: 'Next day processing', examples: ['Lipid panel', 'HbA1c'] }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedLabVendors(): Promise<void> {
  try {
    await LabVendor.deleteMany({});
    
    await LabVendor.insertMany([
      {
        name: 'Quest Diagnostics', code: 'QUEST', type: 'reference_lab', status: 'active',
        contactPerson: 'John Manager', email: 'contact@quest.com', phone: '+1-555-3001',
        address: '123 Lab Street', city: 'Lab City', state: 'LabState', zipCode: '12345',
        license: 'LAB-001', accreditation: ['CAP', 'CLIA'], specialties: ['Molecular', 'Pathology'],
        rating: 4.5, totalTests: 1000, averageTurnaround: '24 hours', pricing: 'moderate',
        contractStart: new Date('2024-01-01'), contractEnd: new Date('2024-12-31')
      }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedTraining(): Promise<void> {
  try {
    await Training.deleteMany({});
    
    await Training.insertMany([
      {
        role: 'doctor', name: 'Doctor Onboarding', description: 'Comprehensive training for doctors',
        overview: 'Complete orientation program for medical staff',
        modules: [
          { title: 'EMR System', duration: '2 hours', lessons: ['Login', 'Patient records', 'Prescriptions'], order: 1 },
          { title: 'Protocols', duration: '3 hours', lessons: ['Emergency procedures', 'Documentation'], order: 2 }
        ]
      },
      {
        role: 'nurse', name: 'Nurse Onboarding', description: 'Training program for nursing staff',
        overview: 'Essential skills and procedures for nurses',
        modules: [
          { title: 'Patient Care', duration: '4 hours', lessons: ['Vital signs', 'Medication admin'], order: 1 }
        ]
      }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedInventory(): Promise<void> {
  try {
    await Inventory.deleteMany({});
    
    // Create dates that are definitely in the future
    const futureDate1 = new Date();
    futureDate1.setFullYear(futureDate1.getFullYear() + 2); // 2 years from now
    
    const futureDate2 = new Date();
    futureDate2.setFullYear(futureDate2.getFullYear() + 3); // 3 years from now
    
    await Inventory.insertMany([
      { name: 'Surgical Gloves', category: 'consumables', sku: 'GL-001', current_stock: 500, minimum_stock: 100, unit_price: 0.25, supplier: 'Medical Supply Co', expiry_date: futureDate1 },
      { name: 'Blood Pressure Monitor', category: 'equipment', sku: 'BP-001', current_stock: 10, minimum_stock: 2, unit_price: 150, supplier: 'Medical Equipment Inc' },
      { name: 'Paracetamol 500mg', category: 'medications', sku: 'MED-001', current_stock: 1000, minimum_stock: 200, unit_price: 0.10, supplier: 'Pharma Corp', expiry_date: futureDate2 }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedLeads(): Promise<void> {
  try {
    await Lead.deleteMany({});
    
    await Lead.insertMany([
      { firstName: 'Jennifer', lastName: 'White', email: 'jennifer.white@email.com', phone: '+1-555-4001', source: 'website', serviceInterest: 'Cardiology consultation', status: 'new', assignedTo: 'Sarah Johnson' },
      { firstName: 'Michael', lastName: 'Green', email: 'michael.green@email.com', phone: '+1-555-4002', source: 'referral', serviceInterest: 'General checkup', status: 'contacted', assignedTo: 'Linda Davis' },
      { firstName: 'Lisa', lastName: 'Blue', phone: '+1-555-4003', source: 'walk-in', serviceInterest: 'Pediatric consultation', status: 'new' }
    ]);
  } catch (error) {
    throw error;
  }
} 