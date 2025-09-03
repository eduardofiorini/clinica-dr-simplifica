import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import patientRoutes from './patientRoutes';
import appointmentRoutes from './appointmentRoutes';
import medicalRecordRoutes from './medicalRecordRoutes';
import invoiceRoutes from './invoiceRoutes';
import paymentRoutes from './paymentRoutes';
import payrollRoutes from './payrollRoutes';
import inventoryRoutes from './inventoryRoutes';
import leadRoutes from './leadRoutes';
import prescriptionRoutes from './prescriptionRoutes';
import serviceRoutes from './serviceRoutes';
import testCategoryRoutes from './testCategoryRoutes';
import sampleTypeRoutes from './sampleTypeRoutes';
import testMethodologyRoutes from './testMethodologyRoutes';
import turnaroundTimeRoutes from './turnaroundTimeRoutes';
import testRoutes from './testRoutes';
import testReportRoutes from './testReportRoutes';
import departmentRoutes from './departmentRoutes';
import labVendorRoutes from './labVendorRoutes';
import dashboardRoutes from './dashboardRoutes';
import analyticsRoutes from './analyticsRoutes';
import settingsRoutes from './settingsRoutes';
import trainingRoutes from './trainingRoutes';
import receptionistRoutes from './receptionistRoutes';
import xrayAnalysisRoutes from './xrayAnalysisRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/payroll', payrollRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/leads', leadRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/services', serviceRoutes);
router.use('/test-categories', testCategoryRoutes);
router.use('/sample-types', sampleTypeRoutes);
router.use('/test-methodologies', testMethodologyRoutes);
router.use('/turnaround-times', turnaroundTimeRoutes);
router.use('/tests', testRoutes);
router.use('/test-reports', testReportRoutes);
router.use('/departments', departmentRoutes);
router.use('/lab-vendors', labVendorRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/training', trainingRoutes);
router.use('/receptionist', receptionistRoutes);
router.use('/xray-analysis', xrayAnalysisRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Clinic Management API is running',
    timestamp: new Date().toISOString()
  });
});

export default router; 