import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Import centralized database connection
import connectDB, { gracefulShutdown } from '../config/database';

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

/**
 * Clear all collections in the database
 */
async function clearDatabase() {
  const collections = mongoose.connection.collections;
  
  console.log(`🗑️  Clearing ${Object.keys(collections).length} collections...`);
  
  for (const key in collections) {
    const collection = collections[key];
    const count = await collection.countDocuments({});
    await collection.deleteMany({});
    console.log(`  ✨ Cleared ${key}: ${count} documents`);
  }
  
  console.log('✅ Database cleared successfully');
}

/**
 * Seed basic/foundational data
 */
async function seedBasicData() {
  try {
    console.log('📦 Seeding basic data...');
    
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
    
    console.log('✅ Basic data seeded successfully');
  } catch (error) {
    console.error('❌ Error in seedBasicData:', error);
    throw error;
  }
}

/**
 * Seed relational data that depends on basic data
 */
async function seedRelationalData() {
  try {
    console.log('🔗 Seeding relational data...');
    
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
    
    console.log('✅ Relational data seeded successfully');
  } catch (error) {
    console.error('❌ Error in seedRelationalData:', error);
    throw error;
  }
}

/**
 * Run all seeders in the correct order
 */
export async function runAllSeeders() {
  try {
    console.log('🚀 Starting comprehensive database seeding...');
    
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

    console.log('🔗 Seeding relational data...');
    await seedRelationalData();

    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error in runAllSeeders:', error);
    throw error;
  }
}

/**
 * Main seeder execution function
 */
async function main() {
  const startTime = Date.now();
  
  try {
    console.log('🌱 ClinicPro Database Seeding Started');
    console.log('=====================================');
    
    // Use centralized database connection
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database successfully');
    
    // Check if we should clear existing data
    const shouldClear = process.argv.includes('--clear');
    
    if (shouldClear) {
      console.log('🗑️  Clear flag detected - removing existing data...');
      await clearDatabase();
    }
    
    // Run all seeders
    await runAllSeeders();
    
    // Calculate execution time
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('=====================================');
    console.log('🎯 Seeding completed successfully!');
    console.log(`⏱️  Total execution time: ${executionTime}s`);
    console.log('🔚 Disconnecting from database...');
    
    // Use graceful shutdown instead of direct disconnect
    await gracefulShutdown();
    console.log('✅ Database connection closed gracefully');
    
    process.exit(0);
  } catch (error) {
    console.error('=====================================');
    console.error('💥 Fatal error during seeding:', error);
    
    if (error instanceof Error) {
      console.error('📝 Error message:', error.message);
      if (error.stack) {
        console.error('📚 Stack trace:', error.stack);
      }
    }
    
    console.error('🔚 Attempting graceful shutdown...');
    await gracefulShutdown();
    
    process.exit(1);
  }
}

// Execute main function if this file is run directly
if (require.main === module) {
  main();
} 