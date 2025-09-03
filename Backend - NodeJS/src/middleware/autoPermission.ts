import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { authenticate } from './auth';
import { hasPermission as checkPermission } from './permission';

// Map first path segment to permission module name
const resourceMap: Record<string, string> = {
  users: 'users',
  clinics: 'clinics',
  patients: 'patients',
  appointments: 'appointments',
  'medical-records': 'medical_records',
  prescriptions: 'prescriptions',
  invoices: 'invoices',
  payments: 'payments',
  inventory: 'inventory',
  departments: 'departments',
  services: 'services',
  tests: 'tests',
  'test-reports': 'test_reports',
  'lab-vendors': 'lab_vendors',
  'xray-analysis': 'xray_analysis',
  'odontograms': 'odontogram',
  payroll: 'payroll',
  expenses: 'expenses',
  settings: 'settings',
};

const methodToAction: Record<string, string> = {
  GET: 'view',
  POST: 'create',
  PUT: 'edit',
  PATCH: 'edit',
  DELETE: 'delete',
};

const SKIP_PREFIXES = ['/auth', '/public', '/health', '/docs'];

export async function autoPermissionGuard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Skip public endpoints
    const path = req.originalUrl.replace(/\?.*$/, '');
    if (SKIP_PREFIXES.some((p) => path.startsWith(`/api${p}`) || path.startsWith(p))) {
      return next();
    }

    // Only apply when an auth token is present (protected APIs)
    const hasAuthHeader = !!req.header('Authorization');
    if (!hasAuthHeader) {
      return next();
    }

    // Ensure authentication (validate token)
    await new Promise<void>((resolve, reject) =>
      authenticate(req, res, (err?: any) => (err ? reject(err) : resolve()))
    );

    // Admin global bypass
    if (req.user?.role === 'admin') {
      return next();
    }

    // Derive permission
    // Get first segment after /api/
    const afterApi = path.replace(/^\/api\//, '');
    const [segment] = afterApi.split('/');
    const resource = resourceMap[segment];
    const action = methodToAction[req.method] || 'view';

    if (!resource) {
      // Unknown resource, do not block
      return next();
    }

    let permissionName = `${resource}.${action}`;

    // Settings: non-GET treated as general manage
    if (resource === 'settings' && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      permissionName = 'settings.general';
    }

    // For clinic-scoped permissions, require clinic context when resource is clinic-scoped
    const clinicId = (req.headers['x-clinic-id'] as string) || req.clinic_id;
    const clinicScoped = resource !== 'users' && resource !== 'settings';
    if (clinicScoped && !clinicId) {
      return res.status(400).json({ success: false, message: 'Clinic context required' });
    }

    // Check permission in current clinic context
    const allowed = clinicScoped
      ? await checkPermission(req.user!.id.toString(), clinicId!.toString(), permissionName)
      : (req.user?.role as any) === 'admin';
    if (!allowed) {
      return res.status(403).json({ success: false, message: 'Permission denied', required: permissionName });
    }

    return next();
  } catch (error) {
    // If auth fails, respond 401
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    console.error('autoPermissionGuard error:', error);
    return res.status(500).json({ success: false, message: 'Internal permission guard error' });
  }
}

export default autoPermissionGuard;


