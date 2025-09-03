import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MedicalRecord } from '../models';

export class MedicalRecordController {
  static async createMedicalRecord(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const medicalRecord = new MedicalRecord(req.body);
      await medicalRecord.save();

      // Populate patient and doctor details
      await medicalRecord.populate([
        { path: 'patient_id', select: 'first_name last_name email phone' },
        { path: 'doctor_id', select: 'first_name last_name role' }
      ]);

      res.status(201).json({
        success: true,
        message: 'Medical record created successfully',
        data: { medicalRecord }
      });
    } catch (error) {
      console.error('Create medical record error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getMedicalRecordsByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const medicalRecords = await MedicalRecord.find({ patient_id: patientId })
        .populate('doctor_id', 'first_name last_name role')
        .skip(skip)
        .limit(limit)
        .sort({ visit_date: -1 });

      const totalRecords = await MedicalRecord.countDocuments({ patient_id: patientId });

      res.json({
        success: true,
        data: {
          medicalRecords,
          pagination: {
            page,
            limit,
            total: totalRecords,
            pages: Math.ceil(totalRecords / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get medical records by patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getMedicalRecordById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const medicalRecord = await MedicalRecord.findById(id)
        .populate('patient_id', 'first_name last_name email phone date_of_birth')
        .populate('doctor_id', 'first_name last_name role');

      if (!medicalRecord) {
        res.status(404).json({
          success: false,
          message: 'Medical record not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { medicalRecord }
      });
    } catch (error) {
      console.error('Get medical record by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateMedicalRecord(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const medicalRecord = await MedicalRecord.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      )
      .populate('patient_id', 'first_name last_name email phone')
      .populate('doctor_id', 'first_name last_name role');

      if (!medicalRecord) {
        res.status(404).json({
          success: false,
          message: 'Medical record not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Medical record updated successfully',
        data: { medicalRecord }
      });
    } catch (error) {
      console.error('Update medical record error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async deleteMedicalRecord(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const medicalRecord = await MedicalRecord.findByIdAndDelete(id);

      if (!medicalRecord) {
        res.status(404).json({
          success: false,
          message: 'Medical record not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Medical record deleted successfully'
      });
    } catch (error) {
      console.error('Delete medical record error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getPatientHistory(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;

      const medicalRecords = await MedicalRecord.find({ patient_id: patientId })
        .populate('doctor_id', 'first_name last_name role')
        .sort({ visit_date: -1 });

      // Get chronic conditions
      const chronicConditions = await MedicalRecord.aggregate([
        { $match: { patient_id: patientId } },
        { $unwind: '$diagnosis' },
        { $group: { _id: '$diagnosis', count: { $sum: 1 } } },
        { $match: { count: { $gte: 2 } } },
        { $sort: { count: -1 } }
      ]);

      // Get allergies
      const allergies = await MedicalRecord.aggregate([
        { $match: { patient_id: patientId } },
        { $unwind: '$allergies' },
        { $group: { _id: '$allergies' } }
      ]);

      // Get current medications
      const currentMedications = await MedicalRecord.aggregate([
        { $match: { patient_id: patientId } },
        { $sort: { visit_date: -1 } },
        { $limit: 1 },
        { $unwind: '$medications' },
        { $project: { medication: '$medications' } }
      ]);

      res.json({
        success: true,
        data: {
          medicalRecords,
          chronicConditions: chronicConditions.map(c => c._id),
          allergies: allergies.map(a => a._id),
          currentMedications: currentMedications.map(m => m.medication)
        }
      });
    } catch (error) {
      console.error('Get patient history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
} 