import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Import mongoose for database operations

// Import seeder functions
import { 
  seedTests, 
  seedAppointments, 
  seedMedicalRecords, 
  seedPrescriptions, 
  seedInvoices, 
  seedPayments, 
  seedTestReports, 
  seedExpenses, 
  seedPayroll, 
  seedTrainingProgress 
} from './relationalSeeders';
import { seedUsers } from './userSeeder';
import { seedPatients } from './patientSeeder';
import { seedDepartments } from './departmentSeeder';
import { seedServices } from './serviceSeeder';
import { seedTestCategories } from './testCategorySeeder';
import { 
  seedSampleTypes, 
  seedTestMethodologies, 
  seedTurnaroundTimes, 
  seedLabVendors, 
  seedTraining, 
  seedInventory, 
  seedLeads 
} from './basicSeeders';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devthreetech:QtTSCkixMFdHnJCK@cluster0.b7eymxa.mongodb.net/clinicpro';

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    throw error;
  }
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

async function seedBasicData() {
  try {
    console.log('  📦 Seeding services...');
    await seedServices();
    console.log('  📦 Seeding test categories...');
    await seedTestCategories();
    console.log('  📦 Seeding sample types...');
    await seedSampleTypes();
    console.log('  📦 Seeding test methodologies...');
    await seedTestMethodologies();
    console.log('  📦 Seeding turnaround times...');
    await seedTurnaroundTimes();
    console.log('  📦 Seeding lab vendors...');
    await seedLabVendors();
    console.log('  📦 Seeding training programs...');
    await seedTraining();
    console.log('  📦 Seeding inventory...');
    await seedInventory();
    console.log('  📦 Seeding leads...');
    await seedLeads();
  } catch (error) {
    console.error('❌ Error in seedBasicData:', error);
    throw error;
  }
}

async function seedRelationalData() {
  try {
    // Seed in the correct order to maintain dependencies
    console.log('  🧪 Seeding tests...');
    await seedTests();
    console.log('  📅 Seeding appointments...');
    await seedAppointments();
    console.log('  📋 Seeding medical records...');
    await seedMedicalRecords();
    console.log('  💊 Seeding prescriptions...');
    await seedPrescriptions();
    console.log('  💰 Seeding invoices...');
    await seedInvoices();
    console.log('  💳 Seeding payments...');
    await seedPayments();
    console.log('  📊 Seeding test reports...');
    await seedTestReports();
    console.log('  💸 Seeding expenses...');
    await seedExpenses();
    console.log('  💼 Seeding payroll...');
    await seedPayroll();
    console.log('  📚 Seeding training progress...');
    await seedTrainingProgress();
  } catch (error) {
    console.error('❌ Error in seedRelationalData:', error);
    throw error;
  }
}

export async function runAllSeeders() {
  try {
    console.log('🏢 Seeding departments...');
    await seedDepartments();
    console.log('✅ Departments seeded successfully');

    console.log('👥 Seeding users...');
    await seedUsers();
    console.log('✅ Users seeded successfully');

    console.log('🏥 Seeding patients...');
    await seedPatients();
    console.log('✅ Patients seeded successfully');

    console.log('📋 Seeding basic data...');
    await seedBasicData();
    console.log('✅ Basic data seeded successfully');

    console.log('🔗 Seeding relational data...');
    await seedRelationalData();
    console.log('✅ Relational data seeded successfully');

    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error in runAllSeeders:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...');
    
    console.log('🔌 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Connected to database');
    
    const shouldClear = process.argv.includes('--clear');
    
    if (shouldClear) {
      console.log('🗑️  Clearing existing data...');
      await clearDatabase();
      console.log('✅ Database cleared');
    }
    
    await runAllSeeders();
    
    console.log('🔚 Disconnecting from database...');
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    console.log('🎯 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 