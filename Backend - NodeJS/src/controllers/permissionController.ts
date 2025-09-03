import { Request, Response } from 'express';
import Permission from '../models/Permission';
import { AuthRequest } from '../types/express';

export default class PermissionController {
  static async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const perms = await Permission.find({}).select('name display_name module sub_module action').sort({ name: 1 });
      res.json({ success: true, data: { permissions: perms } });
    } catch (error) {
      console.error('Error listing permissions:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch permissions' });
    }
  }
}


