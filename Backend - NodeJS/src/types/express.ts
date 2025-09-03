import { Request } from 'express';
import { IUser, IClinic, IUserClinic } from '../models';

export interface AuthRequest extends Request {
  user?: IUser;
  clinic_id?: string; // Current selected clinic ID
  userClinics?: IUserClinic[]; // All clinics user has access to
  currentUserClinic?: IUserClinic; // Current user-clinic relationship
  currentClinic?: IClinic; // Current selected clinic details
} 