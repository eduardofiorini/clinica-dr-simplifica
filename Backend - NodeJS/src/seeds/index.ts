import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Import centralized database connection
import connectDB, { gracefulShutdown } from '../config/database';

// Import seeder functions
import { seedClinics } from './clinicSeeder';
import { seedUsers } from './userSeeder';
import { seedAllData } from './dataSeeder';

dotenv.config();

/**
 * Clear all collections in the database
 */
async function clearDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;
  
  console.log(`Clearing ${Object.keys(collections).length} collections...`);
  
  for (const key in collections) {
    const collection = collections[key];
    const count = await collection.countDocuments({});
    if (count > 0) {
      await collection.deleteMany({});
      console.log(`  Cleared ${key}: ${count} documents`);
    }
  }
  
  console.log('Database cleared successfully\n');
}

/**
 * Run comprehensive seeding for multi-clinic setup
 */
async function runComprehensiveSeeding(): Promise<void> {
  try {
    console.log('Starting comprehensive multi-clinic database seeding...\n');
    console.log('='.repeat(60));

    // 1. Clear database first (if requested)
    const shouldClear = process.argv.includes('--clear') || process.argv.includes('-c');
    if (shouldClear) {
      await clearDatabase();
    }

    // 2. Create 5 clinics first (foundation)
    console.log('PHASE 1: Creating Clinics');
    console.log('-'.repeat(30));
    const clinicIds = await seedClinics();
    
    // 3. Create users and user-clinic relationships
    console.log('\nPHASE 2: Creating Users & Relationships');
    console.log('-'.repeat(40));
    await seedUsers(clinicIds);
    
    // 4. Create comprehensive data for all models (10 rows per clinic)
    console.log('\nPHASE 3: Creating Comprehensive Data');
    console.log('-'.repeat(40));
    await seedAllData(clinicIds);

    // 5. Display summary
    console.log('\n' + '='.repeat(60));
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\nSEEDING SUMMARY:');
    console.log(`   Clinics: ${clinicIds.length} created`);
    console.log(`   Users: ~${clinicIds.length * 10 + 2} created (including super admins)`);
    console.log(`   User-Clinic Relations: ~${clinicIds.length * 10 + clinicIds.length * 2} created`);
    console.log(`   Data Records: ~${clinicIds.length * 200} created across all models`);
    
    console.log('\nMULTI-CLINIC FEATURES:');
    console.log('   5 distinct clinics with unique settings');
    console.log('   Clinic-specific data isolation');
    console.log('   Super admins with multi-clinic access');
    console.log('   Realistic faker-generated data');
    console.log('   Proper relationships and foreign keys');
    console.log('   10 records per model per clinic');
    
    console.log('\nTEST CREDENTIALS:');
    console.log('   Email: Any user email from the generated data');
    console.log('   Password: password123');
    
    console.log('\nNEXT STEPS:');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Test multi-clinic functionality');
    console.log('   3. Verify data isolation between clinics');
    console.log('   4. Test user permissions and clinic access');
    
  } catch (error) {
    console.error('\nError in comprehensive seeding:', error);
    throw error;
  }
}

/**
 * Main seeder execution function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('ClinicPro Multi-Clinic Database Seeding');
    console.log('==========================================');
    console.log('Creating realistic data with Faker.js');
    console.log('Multi-clinic setup with data isolation');
    console.log('==========================================\n');
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully\n');
    
    // Run comprehensive seeding
    await runComprehensiveSeeding();
    
    // Calculate execution time
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('SEEDING PROCESS COMPLETED!');
    console.log(`Total execution time: ${executionTime}s`);
    console.log('Disconnecting from database...');
    
    // Graceful shutdown
    await gracefulShutdown();
    console.log('Database connection closed gracefully');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('FATAL ERROR DURING SEEDING');
    console.error('='.repeat(60));
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    
    console.error('\nAttempting graceful shutdown...');
    await gracefulShutdown();
    
    process.exit(1);
  }
}

// Export for use in other files
export { seedClinics, seedUsers, seedAllData, clearDatabase };

// Execute main function if this file is run directly
if (require.main === module) {
  main();
}
