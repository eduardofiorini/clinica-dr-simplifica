import TestCategory from '../models/TestCategory';

export async function seedTestCategories(): Promise<void> {
  try {
    await TestCategory.deleteMany({});
    
    await TestCategory.insertMany([
      { name: 'Hematology', code: 'HEM', description: 'Blood related tests', department: 'Laboratory', color: '#FF6B6B', icon: 'test-tube', testCount: 0, commonTests: ['CBC', 'ESR'], sortOrder: 1 },
      { name: 'Biochemistry', code: 'BIO', description: 'Chemical analysis tests', department: 'Laboratory', color: '#4ECDC4', icon: 'beaker', testCount: 0, commonTests: ['Glucose', 'Creatinine'], sortOrder: 2 },
      { name: 'Microbiology', code: 'MIC', description: 'Infectious disease tests', department: 'Laboratory', color: '#45B7D1', icon: 'microscope', testCount: 0, commonTests: ['Culture', 'Sensitivity'], sortOrder: 3 },
      { name: 'Cardiology', code: 'CARD', description: 'Heart function tests', department: 'Cardiology', color: '#96CEB4', icon: 'heart', testCount: 0, commonTests: ['ECG', 'Echo'], sortOrder: 4 },
      { name: 'Radiology', code: 'RAD', description: 'Imaging tests', department: 'Radiology', color: '#FFEAA7', icon: 'zap', testCount: 0, commonTests: ['X-Ray', 'CT Scan'], sortOrder: 5 }
    ]);
  } catch (error) {
    throw error;
  }
} 