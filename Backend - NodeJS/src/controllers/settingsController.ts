import { Request, Response } from 'express';

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Settings ID
 *         clinic:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Clinic name
 *             address:
 *               type: string
 *               description: Clinic address
 *             phone:
 *               type: string
 *               description: Phone number
 *             email:
 *               type: string
 *               description: Email address
 *             website:
 *               type: string
 *               description: Website URL
 *             description:
 *               type: string
 *               description: Clinic description
 *             logo:
 *               type: string
 *               description: Logo URL
 *         workingHours:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               isOpen:
 *                 type: boolean
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *         financial:
 *           type: object
 *           properties:
 *             currency:
 *               type: string
 *             taxRate:
 *               type: number
 *             invoicePrefix:
 *               type: string
 *             paymentTerms:
 *               type: number
 *             defaultDiscount:
 *               type: number
 *         notifications:
 *           type: object
 *           properties:
 *             emailNotifications:
 *               type: boolean
 *             smsNotifications:
 *               type: boolean
 *             appointmentReminders:
 *               type: boolean
 *             paymentReminders:
 *               type: boolean
 *             lowStockAlerts:
 *               type: boolean
 *             systemAlerts:
 *               type: boolean
 *         security:
 *           type: object
 *           properties:
 *             twoFactorAuth:
 *               type: boolean
 *             sessionTimeout:
 *               type: number
 *             passwordExpiry:
 *               type: number
 *             backupFrequency:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get clinic settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *       500:
 *         description: Server error
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    // Mock settings data for now
    const mockSettings = {
      id: 'clinic-settings-1',
      clinic: {
        name: "HealthCare Plus Clinic",
        address: "123 Medical Drive, Health City, HC 12345",
        phone: "+1 (555) 123-4567",
        email: "contact@healthcareplus.com",
        website: "www.healthcareplus.com",
        description: "Providing quality healthcare services to our community.",
        logo: "",
      },
      workingHours: {
        monday: { isOpen: true, start: "09:00", end: "17:00" },
        tuesday: { isOpen: true, start: "09:00", end: "17:00" },
        wednesday: { isOpen: true, start: "09:00", end: "17:00" },
        thursday: { isOpen: true, start: "09:00", end: "17:00" },
        friday: { isOpen: true, start: "09:00", end: "15:00" },
        saturday: { isOpen: false, start: "09:00", end: "13:00" },
        sunday: { isOpen: false, start: "10:00", end: "14:00" },
      },
      financial: {
        currency: "USD",
        taxRate: 10,
        invoicePrefix: "INV",
        paymentTerms: 30,
        defaultDiscount: 0,
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        paymentReminders: true,
        lowStockAlerts: true,
        systemAlerts: true,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 60,
        passwordExpiry: 90,
        backupFrequency: "daily",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return res.json({
      success: true,
      data: mockSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update clinic settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { clinic, workingHours, financial, notifications, security } = req.body;

    // Basic validation
    if (clinic && (!clinic.name || !clinic.email || !clinic.phone || !clinic.address)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required clinic information (name, email, phone, address)'
      });
    }

    // Mock updated settings
    const updatedSettings = {
      id: 'clinic-settings-1',
      clinic: clinic || {
        name: "HealthCare Plus Clinic",
        address: "123 Medical Drive, Health City, HC 12345",
        phone: "+1 (555) 123-4567",
        email: "contact@healthcareplus.com",
        website: "www.healthcareplus.com",
        description: "Providing quality healthcare services to our community.",
        logo: "",
      },
      workingHours: workingHours || {
        monday: { isOpen: true, start: "09:00", end: "17:00" },
        tuesday: { isOpen: true, start: "09:00", end: "17:00" },
        wednesday: { isOpen: true, start: "09:00", end: "17:00" },
        thursday: { isOpen: true, start: "09:00", end: "17:00" },
        friday: { isOpen: true, start: "09:00", end: "15:00" },
        saturday: { isOpen: false, start: "09:00", end: "13:00" },
        sunday: { isOpen: false, start: "10:00", end: "14:00" },
      },
      financial: financial || {
        currency: "USD",
        taxRate: 10,
        invoicePrefix: "INV",
        paymentTerms: 30,
        defaultDiscount: 0,
      },
      notifications: notifications || {
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        paymentReminders: true,
        lowStockAlerts: true,
        systemAlerts: true,
      },
      security: security || {
        twoFactorAuth: false,
        sessionTimeout: 60,
        passwordExpiry: 90,
        backupFrequency: "daily",
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    };

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default {
  getSettings,
  updateSettings,
}; 