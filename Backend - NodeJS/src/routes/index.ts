import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import clinicRoutes from './clinicRoutes';
import userClinicRoutes from './userClinicRoutes';
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
import odontogramRoutes from './odontogramRoutes';
import { getConnectionState, isConnectionHealthy } from '../config/database';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clinics', clinicRoutes);
router.use('/user', userClinicRoutes);
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
router.use('/odontograms', odontogramRoutes);

// Basic health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Clinic Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check route
router.get('/health/database', async (req, res) => {
  try {
    const connectionState = getConnectionState();
    const isHealthy = await isConnectionHealthy();
    
    const healthStatus = {
      success: true,
      message: isHealthy ? 'Database connection is healthy' : 'Database connection issues detected',
      timestamp: new Date().toISOString(),
      database: {
        healthy: isHealthy,
        connected: connectionState.isConnected,
        connecting: connectionState.isConnecting,
        host: connectionState.host,
        database: connectionState.database,
        readyState: connectionState.mongooseReadyState,
        readyStateLabel: connectionState.mongooseReadyStateLabel,
        collections: connectionState.collections,
        connectionAttempts: connectionState.connectionAttempts,
        lastConnectionTime: connectionState.lastConnectionTime,
        lastError: connectionState.lastError ? {
          message: connectionState.lastError.message,
          timestamp: connectionState.lastConnectionTime
        } : null
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    };

    // Set appropriate HTTP status based on health
    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Connection state monitoring endpoint (for debugging)
router.get('/health/connection-state', async (req, res) => {
  try {
    const connectionState = getConnectionState();
    res.json({
      success: true,
      message: 'Connection state retrieved successfully',
      timestamp: new Date().toISOString(),
      connectionState
    });
  } catch (error) {
    console.error('Connection state error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve connection state',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 