import Test from '../models/Test';
import Appointment from '../models/Appointment';
import MedicalRecord from '../models/MedicalRecord';
import Prescription from '../models/Prescription';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';
import TestReport from '../models/TestReport';
import Expense from '../models/Expense';
import Payroll from '../models/Payroll';
import TrainingProgress from '../models/TrainingProgress';
import User from '../models/User';
import Patient from '../models/Patient';
import Training from '../models/Training';

export async function seedTests(): Promise<void> {
  try {
    await Test.deleteMany({});
    
    await Test.insertMany([
      { name: 'Complete Blood Count', code: 'CBC', category: 'Hematology', description: 'Full blood analysis', normalRange: '4.5-11.0 x10^9/L', units: 'cells/µL', methodology: 'Flow cytometry', turnaroundTime: '4 hours', sampleType: 'Venous Blood' },
      { name: 'Blood Glucose', code: 'GLU', category: 'Biochemistry', description: 'Blood sugar level', normalRange: '70-100 mg/dL', units: 'mg/dL', methodology: 'Enzymatic', turnaroundTime: '1 hour', sampleType: 'Venous Blood' },
      { name: 'Urine Analysis', code: 'UA', category: 'Chemistry', description: 'Urine examination', normalRange: 'Clear, Yellow', units: 'Various', methodology: 'Microscopy', turnaroundTime: '2 hours', sampleType: 'Urine' },
      { name: 'Lipid Panel', code: 'LIPID', category: 'Biochemistry', description: 'Cholesterol and lipid levels', normalRange: '<200 mg/dL', units: 'mg/dL', methodology: 'Enzymatic', turnaroundTime: '4 hours', sampleType: 'Venous Blood' },
      { name: 'Liver Function Tests', code: 'LFT', category: 'Biochemistry', description: 'Liver enzyme levels', normalRange: '10-40 U/L', units: 'U/L', methodology: 'Enzymatic', turnaroundTime: '6 hours', sampleType: 'Venous Blood' },
      { name: 'Thyroid Stimulating Hormone', code: 'TSH', category: 'Endocrinology', description: 'Thyroid function', normalRange: '0.4-4.0 mIU/L', units: 'mIU/L', methodology: 'ELISA', turnaroundTime: '24 hours', sampleType: 'Venous Blood' },
      { name: 'HbA1c', code: 'A1C', category: 'Biochemistry', description: 'Diabetes monitoring', normalRange: '<7%', units: '%', methodology: 'HPLC', turnaroundTime: '4 hours', sampleType: 'Venous Blood' },
      { name: 'Creatinine', code: 'CREAT', category: 'Biochemistry', description: 'Kidney function', normalRange: '0.6-1.2 mg/dL', units: 'mg/dL', methodology: 'Enzymatic', turnaroundTime: '2 hours', sampleType: 'Venous Blood' },
      { name: 'C-Reactive Protein', code: 'CRP', category: 'Immunology', description: 'Inflammation marker', normalRange: '<3.0 mg/L', units: 'mg/L', methodology: 'Turbidimetry', turnaroundTime: '2 hours', sampleType: 'Venous Blood' },
      { name: 'Troponin I', code: 'TROP', category: 'Cardiology', description: 'Heart damage marker', normalRange: '<0.04 ng/mL', units: 'ng/mL', methodology: 'ELISA', turnaroundTime: '1 hour', sampleType: 'Venous Blood' }
    ]);
  } catch (error) {
    throw error;
  }
}

export async function seedAppointments(): Promise<void> {
  try {
    await Appointment.deleteMany({});
    
    const users = await User.find({ role: 'doctor' });
    const patients = await Patient.find();
    const nurses = await User.find({ role: 'nurse' });
    
    if (users.length === 0 || patients.length === 0) {
      return;
    }
    
    const appointments = [];
    const appointmentTypes = ['consultation', 'follow-up', 'check-up', 'vaccination', 'procedure', 'emergency', 'screening', 'therapy', 'other'];
    const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
    const reasons = [
      'Regular checkup', 'Follow-up visit', 'Chest pain', 'Headache', 'Fever', 
      'Back pain', 'Cough', 'Annual physical', 'Blood pressure check', 'Diabetes management',
      'Skin rash', 'Joint pain', 'Breathing difficulty', 'Allergy consultation', 'Vaccination'
    ];
    const notes = [
      'Patient reported feeling better', 'Need to monitor closely', 'Prescribed medication',
      'Recommended lifestyle changes', 'Schedule follow-up in 2 weeks', 'All vital signs normal',
      'Patient education provided', 'Referred to specialist', 'Lab tests ordered', 'Emergency consultation'
    ];

    // Generate appointments for the next 9 months (all future dates to satisfy validation)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 9);

    // Generate 200-300 appointments
    for (let i = 0; i < 250; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      
      // Set random time between 8 AM and 6 PM
      randomDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 4) * 15, 0, 0);
      
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = users[Math.floor(Math.random() * users.length)];
      const nurse = nurses.length > 0 ? (Math.random() > 0.3 ? nurses[Math.floor(Math.random() * nurses.length)] : null) : null;
      
      let status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Set more realistic statuses based on how far in the future the appointment is
      const now = new Date();
      const daysFromNow = Math.floor((randomDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysFromNow <= 7) {
        // Near future appointments are more likely to be confirmed
        status = Math.random() < 0.8 ? 'confirmed' : 'scheduled';
      } else if (daysFromNow <= 30) {
        // Medium term appointments
        status = Math.random() < 0.6 ? 'scheduled' : 'confirmed';
      } else {
        // Far future appointments are mostly scheduled
        status = Math.random() < 0.9 ? 'scheduled' : 'confirmed';
      }

      appointments.push({
        patient_id: patient._id,
        doctor_id: doctor._id,
        nurse_id: nurse?._id,
        appointment_date: randomDate,
        duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        notes: notes[Math.floor(Math.random() * notes.length)],
        status: status
      });
    }
    
    await Appointment.insertMany(appointments);
  } catch (error) {
    throw error;
  }
}

export async function seedMedicalRecords(): Promise<void> {
  try {
    await MedicalRecord.deleteMany({});
    
    const users = await User.find({ role: 'doctor' });
    const patients = await Patient.find();
    
    if (users.length === 0 || patients.length === 0) {
      return;
    }
    
    const records = [];
    const complaints = [
      'Chest pain and shortness of breath', 'Headache and dizziness', 'Fever and cough',
      'Back pain', 'Stomach pain', 'Skin rash', 'Joint pain', 'Fatigue',
      'Sore throat', 'Nausea and vomiting', 'Difficulty sleeping', 'Anxiety'
    ];
    const diagnoses = [
      'Hypertension, Stage 1', 'Type 2 Diabetes', 'Common cold', 'Muscle strain',
      'Gastritis', 'Allergic reaction', 'Arthritis', 'Anxiety disorder',
      'Upper respiratory infection', 'Migraine', 'Insomnia', 'Depression'
    ];
    const treatments = [
      'Lifestyle modification and ACE inhibitor', 'Metformin and diet control',
      'Rest and fluids', 'Physical therapy', 'Antacids and dietary changes',
      'Antihistamines', 'Anti-inflammatory medication', 'Counseling and medication',
      'Antibiotics', 'Pain medication', 'Sleep hygiene', 'Antidepressants'
    ];
    const medications = [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '14 days' },
      { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
    ];
    const allergies = [
      { allergen: 'Penicillin', severity: 'moderate', reaction: 'Rash and itching' },
      { allergen: 'Peanuts', severity: 'severe', reaction: 'Anaphylaxis' },
      { allergen: 'Latex', severity: 'mild', reaction: 'Skin irritation' },
      { allergen: 'Shellfish', severity: 'severe', reaction: 'Swelling and difficulty breathing' }
    ];

    // Generate records for the last 12 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    const endDate = new Date();

    // Generate 150-200 medical records
    for (let i = 0; i < 175; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = users[Math.floor(Math.random() * users.length)];
      const complaintIndex = Math.floor(Math.random() * complaints.length);
      
      // Generate realistic vital signs
      const temperature = 36.1 + Math.random() * 2; // 36.1 - 38.1°C
      const systolic = 110 + Math.floor(Math.random() * 40); // 110-150
      const diastolic = 70 + Math.floor(Math.random() * 20); // 70-90
      const heartRate = 60 + Math.floor(Math.random() * 40); // 60-100
      const weight = 50 + Math.floor(Math.random() * 50); // 50-100kg
      const height = 150 + Math.floor(Math.random() * 35); // 150-185cm

      records.push({
        patient_id: patient._id,
        doctor_id: doctor._id,
        visit_date: randomDate,
        chief_complaint: complaints[complaintIndex],
        diagnosis: diagnoses[complaintIndex],
        treatment: treatments[complaintIndex],
        vital_signs: {
          temperature: Math.round(temperature * 10) / 10,
          blood_pressure: { systolic, diastolic },
          heart_rate: heartRate,
          respiratory_rate: 14 + Math.floor(Math.random() * 8), // 14-22
          oxygen_saturation: 95 + Math.floor(Math.random() * 5), // 95-99
          weight,
          height
        },
        medications: Math.random() > 0.3 ? [medications[Math.floor(Math.random() * medications.length)]] : [],
        allergies: Math.random() > 0.7 ? [allergies[Math.floor(Math.random() * allergies.length)]] : []
      });
    }
    
    await MedicalRecord.insertMany(records);
  } catch (error) {
    throw error;
  }
}

export async function seedPrescriptions(): Promise<void> {
  try {
    await Prescription.deleteMany({});
    
    const users = await User.find({ role: 'doctor' });
    const patients = await Patient.find();
    
    if (users.length === 0 || patients.length === 0) {
      return;
    }
    
    const prescriptions = [];
    const diagnoses = [
      'Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia', 'Depression', 'Anxiety',
      'Arthritis', 'Asthma', 'COPD', 'Migraine', 'Insomnia', 'GERD', 'UTI'
    ];
    const medicationsList = [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', instructions: 'Take with or without food' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', instructions: 'Take with meals' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', instructions: 'Take in the evening' },
      { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', instructions: 'Take in the morning' },
      { name: 'Lorazepam', dosage: '0.5mg', frequency: 'As needed', instructions: 'For anxiety, maximum 3 times daily' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily', instructions: 'Take with food' },
      { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed', instructions: 'Use inhaler for breathing difficulty' },
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', instructions: 'For migraine headaches' },
      { name: 'Zolpidem', dosage: '10mg', frequency: 'At bedtime', instructions: 'Take only when needed for sleep' },
      { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', instructions: 'Take before breakfast' }
    ];
    const statuses = ['active', 'completed', 'pending', 'cancelled', 'expired'];
    const notes = [
      'Monitor blood pressure regularly', 'Check blood sugar levels', 'Follow up in 4 weeks',
      'Watch for side effects', 'Take full course as prescribed', 'Monitor liver function',
      'Avoid alcohol while taking this medication', 'Report any unusual symptoms'
    ];

    // Generate prescriptions for the last 12 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    const endDate = new Date();

    // Generate 100-150 prescriptions
    for (let i = 0; i < 125; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = users[Math.floor(Math.random() * users.length)];
      const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const medication = medicationsList[Math.floor(Math.random() * medicationsList.length)];
      
      const durations = ['7 days', '14 days', '30 days', '60 days', '90 days'];
      const duration = durations[Math.floor(Math.random() * durations.length)];
      const durationDays = parseInt(duration);
      
      // Calculate quantity based on frequency and duration
      let quantity = 30; // default
      if (medication.frequency.includes('once')) quantity = durationDays;
      else if (medication.frequency.includes('twice')) quantity = durationDays * 2;
      else if (medication.frequency.includes('three')) quantity = durationDays * 3;
      else if (medication.frequency.includes('needed')) quantity = Math.floor(durationDays / 2);

      let status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Set more realistic status based on date
      const now = new Date();
      const endPrescriptionDate = new Date(randomDate);
      endPrescriptionDate.setDate(endPrescriptionDate.getDate() + durationDays);
      
      if (endPrescriptionDate < now) {
        status = Math.random() < 0.8 ? 'completed' : (Math.random() < 0.9 ? 'expired' : 'cancelled');
      } else {
        status = Math.random() < 0.9 ? 'active' : 'pending';
      }

      prescriptions.push({
        patient_id: patient._id,
        doctor_id: doctor._id,
        prescription_id: `RX-${String(i + 1).padStart(4, '0')}`,
        diagnosis: diagnosis,
        medications: [{
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          duration: duration,
          instructions: medication.instructions,
          quantity: quantity
        }],
        status: status,
        notes: notes[Math.floor(Math.random() * notes.length)],
        prescribed_date: randomDate
      });
    }
    
    await Prescription.insertMany(prescriptions);
  } catch (error) {
    throw error;
  }
}

export async function seedInvoices(): Promise<void> {
  try {
    await Invoice.deleteMany({});
    
    const patients = await Patient.find();
    
    if (patients.length === 0) {
      return;
    }
    
    const invoices = [];
    const services = [
      { description: 'General Consultation', unit_price: 150, type: 'service' },
      { description: 'Specialist Consultation', unit_price: 300, type: 'service' },
      { description: 'Follow-up Visit', unit_price: 100, type: 'service' },
      { description: 'Emergency Consultation', unit_price: 400, type: 'service' },
      { description: 'Blood Test', unit_price: 80, type: 'test' },
      { description: 'Urine Analysis', unit_price: 50, type: 'test' },
      { description: 'X-Ray', unit_price: 120, type: 'test' },
      { description: 'ECG', unit_price: 100, type: 'test' },
      { description: 'MRI Scan', unit_price: 800, type: 'test' },
      { description: 'CT Scan', unit_price: 600, type: 'test' }
    ];
    const statuses = ['pending', 'paid', 'overdue', 'cancelled', 'draft'];

    // Generate invoices for recent months (due dates must not be more than 1 day in the past)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // Only 3 months back
    const endDate = new Date();

    // Generate 200-250 invoices
    for (let i = 0; i < 225; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const patient = patients[Math.floor(Math.random() * patients.length)];
      
      // Generate 1-4 services per invoice
      const numServices = 1 + Math.floor(Math.random() * 4);
      const invoiceServices = [];
      let subtotal = 0;

      for (let j = 0; j < numServices; j++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const quantity = 1; // Most services are quantity 1
        const total = service.unit_price * quantity;
        subtotal += total;

        invoiceServices.push({
          id: `${j + 1}`,
          description: service.description,
          quantity: quantity,
          unit_price: service.unit_price,
          total: total,
          type: service.type
        });
      }

      const discountPercent = Math.random() < 0.2 ? (5 + Math.floor(Math.random() * 15)) : 0; // 20% chance of discount
      const discount = Math.floor(subtotal * discountPercent / 100);
      const afterDiscount = subtotal - discount;
      const taxRate = 0.1; // 10% tax
      const taxAmount = Math.floor(afterDiscount * taxRate);
      const totalAmount = afterDiscount + taxAmount;

      let status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Set more realistic status based on date
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - randomDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 60) {
        status = Math.random() < 0.8 ? 'paid' : (Math.random() < 0.9 ? 'overdue' : 'cancelled');
      } else if (daysDiff > 30) {
        status = Math.random() < 0.6 ? 'paid' : (Math.random() < 0.8 ? 'overdue' : 'pending');
      } else {
        status = Math.random() < 0.4 ? 'paid' : 'pending';
      }

      const dueDate = new Date(randomDate);
      dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms
      
      // Ensure due date is not more than 1 day in the past
      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
      if (dueDate < oneDayAgo) {
        dueDate.setTime(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000); // Set 30 days from now
      }

      invoices.push({
        patient_id: patient._id,
        invoice_number: `INV-2024-${String(i + 1).padStart(4, '0')}`,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        subtotal: subtotal,
        discount: discount,
        status: status,
        issue_date: randomDate,
        due_date: dueDate,
        services: invoiceServices
      });
    }
    
    await Invoice.insertMany(invoices);
  } catch (error) {
    throw error;
  }
}

export async function seedPayments(): Promise<void> {
  try {
    await Payment.deleteMany({});
    
    const patients = await Patient.find();
    const invoices = await Invoice.find({ status: { $in: ['paid', 'overdue'] } });
    
    if (patients.length === 0 || invoices.length === 0) {
      return;
    }
    
    const payments = [];
    const methods = ['credit_card', 'cash', 'bank_transfer', 'upi', 'insurance'];
    const statuses = ['completed', 'pending', 'failed', 'refunded'];
    const descriptions = [
      'Payment for consultation and tests', 'Payment for medical services', 'Insurance payment',
      'Co-payment for treatment', 'Payment for laboratory tests', 'Emergency treatment payment',
      'Specialist consultation payment', 'Follow-up visit payment', 'Diagnostic test payment'
    ];

    // Create payments for paid and some overdue invoices
    for (const invoice of invoices) {
      // 90% of paid invoices have payments, 30% of overdue invoices have partial payments
      const shouldCreatePayment = invoice.status === 'paid' ? (Math.random() < 0.9) : (Math.random() < 0.3);
      
      if (shouldCreatePayment) {
        const method = methods[Math.floor(Math.random() * methods.length)];
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Most payments for paid invoices are completed
        if (invoice.status === 'paid') {
          status = Math.random() < 0.95 ? 'completed' : 'refunded';
        }

        // Calculate processing fee based on method
        let processingFee = 0;
        if (method === 'credit_card') processingFee = Math.round(invoice.total_amount * 0.029 * 100) / 100; // 2.9%
        else if (method === 'upi') processingFee = Math.round(invoice.total_amount * 0.015 * 100) / 100; // 1.5%
        
        const amount = invoice.status === 'paid' ? invoice.total_amount : 
                      Math.floor(invoice.total_amount * (0.3 + Math.random() * 0.4)); // Partial payment
        
        const netAmount = amount - processingFee;

        // Payment date should be after invoice date
        const paymentDate = new Date(invoice.issue_date);
        paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 45)); // 0-45 days after invoice

        payments.push({
          invoice_id: invoice._id,
          patient_id: invoice.patient_id,
          amount: amount,
          method: method,
          status: status,
          processing_fee: processingFee,
          net_amount: netAmount,
          payment_date: paymentDate,
          card_last4: method === 'credit_card' ? String(1000 + Math.floor(Math.random() * 9000)) : undefined,
          description: descriptions[Math.floor(Math.random() * descriptions.length)]
        });
      }
    }
    
    await Payment.insertMany(payments);
  } catch (error) {
    throw error;
  }
}

export async function seedTestReports(): Promise<void> {
  try {
    await TestReport.deleteMany({});
    
    const patients = await Patient.find();
    const tests = await Test.find();
    
    if (patients.length === 0 || tests.length === 0) {
      return;
    }
    
    const reports = [];
    const vendors = ['Quest Diagnostics', 'LabCorp', 'Mayo Clinic Labs', 'Internal Lab', 'Sonic Healthcare'];
    const technicians = ['Lab Technician', 'Senior Lab Tech', 'Dr. Smith', 'Lab Supervisor', 'Clinical Analyst'];
    const statuses = ['pending', 'recorded', 'verified', 'delivered'];

    // Generate test results based on test types
    const generateResults = (test: any) => {
      switch (test.code) {
        case 'CBC':
          return {
            wbc: (4 + Math.random() * 7).toFixed(1), // 4-11 x10^9/L
            rbc: (4.2 + Math.random() * 1.8).toFixed(1), // 4.2-6.0 x10^12/L
            hgb: (12 + Math.random() * 6).toFixed(1), // 12-18 g/dL
            hct: (36 + Math.random() * 18).toFixed(1), // 36-54%
            platelets: (150 + Math.random() * 300).toFixed(0) // 150-450 x10^9/L
          };
        case 'GLU':
          return { value: (70 + Math.random() * 180).toFixed(0), unit: 'mg/dL' }; // 70-250 mg/dL
        case 'UA':
          return {
            color: ['Yellow', 'Pale Yellow', 'Dark Yellow'][Math.floor(Math.random() * 3)],
            clarity: ['Clear', 'Slightly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
            specific_gravity: (1.005 + Math.random() * 0.025).toFixed(3),
            protein: ['Negative', 'Trace', '+1'][Math.floor(Math.random() * 3)]
          };
        default:
          return { value: (Math.random() * 100).toFixed(1), unit: test.units || 'units' };
      }
    };

    // Generate reports for the last 12 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    const endDate = new Date();

    // Generate 300-400 test reports
    for (let i = 0; i < 350; i++) {
      const testDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const recordedDate = new Date(testDate);
      recordedDate.setHours(testDate.getHours() + Math.floor(Math.random() * 48)); // Recorded within 48 hours

      const patient = patients[Math.floor(Math.random() * patients.length)];
      const test = tests[Math.floor(Math.random() * tests.length)];
      
      // Calculate patient age based on their date of birth
      const age = patient.date_of_birth ? 
        Math.floor((testDate.getTime() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
        25 + Math.floor(Math.random() * 50);

      let status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Set more realistic status based on date
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 7) {
        status = Math.random() < 0.9 ? 'verified' : (Math.random() < 0.8 ? 'delivered' : 'recorded');
      } else if (daysDiff > 1) {
        status = Math.random() < 0.7 ? 'recorded' : 'pending';
      } else {
        status = 'pending';
      }

      reports.push({
        reportNumber: `RPT-2024-${String(i + 1).padStart(4, '0')}`,
        patientId: patient._id,
        patientName: `${patient.first_name} ${patient.last_name}`,
        patientAge: age,
        patientGender: patient.gender,
        testId: test._id,
        testName: test.name,
        testCode: test.code,
        category: test.category,
        externalVendor: vendors[Math.floor(Math.random() * vendors.length)],
        testDate: testDate,
        recordedDate: recordedDate,
        recordedBy: technicians[Math.floor(Math.random() * technicians.length)],
        status: status,
        results: generateResults(test),
        normalRange: test.normalRange,
        units: test.units,
        notes: Math.random() > 0.7 ? 'Results within normal limits' : undefined
      });
    }
    
    await TestReport.insertMany(reports);
  } catch (error) {
    throw error;
  }
}

export async function seedExpenses(): Promise<void> {
  try {
    await Expense.deleteMany({});
    
    const users = await User.find({ role: 'admin' });
    
    if (users.length === 0) {
      return;
    }
    
    const expenses = [];
          const categories = ['equipment', 'supplies', 'utilities', 'maintenance', 'staff', 'marketing', 'insurance', 'rent', 'other'];
    const vendors = [
      'Medical Equipment Inc', 'Office Depot', 'Staples', 'Dell Technologies', 'Microsoft',
      'Johnson & Johnson', 'GE Healthcare', 'Philips Healthcare', 'Siemens', 'Abbott',
      'Local Utilities Co', 'Building Maintenance LLC', 'Software Solutions Inc'
    ];
          const paymentMethods = ['cash', 'card', 'bank_transfer', 'check'];
    const statuses = ['pending', 'paid', 'cancelled'];
    
          const expenseTemplates = [
        { title: 'Medical Equipment Purchase', description: 'New medical devices and equipment', category: 'equipment', baseAmount: 1500 },
        { title: 'Office Supplies', description: 'Paper, pens, and stationery', category: 'supplies', baseAmount: 250 },
        { title: 'Software License Renewal', description: 'Annual software subscriptions', category: 'other', baseAmount: 800 },
        { title: 'Utility Bills', description: 'Electricity, water, internet', category: 'utilities', baseAmount: 500 },
        { title: 'Equipment Maintenance', description: 'Maintenance and repairs', category: 'maintenance', baseAmount: 600 },
        { title: 'Staff Training', description: 'Professional development courses', category: 'staff', baseAmount: 400 },
        { title: 'Insurance Premium', description: 'Medical malpractice insurance', category: 'insurance', baseAmount: 2000 },
        { title: 'Building Rent', description: 'Monthly facility rental', category: 'rent', baseAmount: 5000 },
        { title: 'Marketing Materials', description: 'Promotional and advertising materials', category: 'marketing', baseAmount: 300 }
      ];

    // Generate expenses for the last 18 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 18);
    const endDate = new Date();

    // Generate 150-200 expenses
    for (let i = 0; i < 175; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Vary the amount by ±50% of base amount
      const amountVariation = 0.5 + Math.random(); // 0.5 to 1.5
      const amount = Math.floor(template.baseAmount * amountVariation);

      let status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Set more realistic status based on date
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - randomDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 30) {
        status = Math.random() < 0.9 ? 'paid' : 'cancelled';
      } else if (daysDiff > 7) {
        status = Math.random() < 0.6 ? 'paid' : (Math.random() < 0.8 ? 'pending' : 'cancelled');
      } else {
        status = Math.random() < 0.3 ? 'paid' : 'pending';
      }

      expenses.push({
        title: template.title,
        description: template.description,
        amount: amount,
        category: template.category,
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        date: randomDate,
        status: status,
        created_by: user._id,
        notes: Math.random() > 0.7 ? 'Approved by department head' : undefined
      });
    }
    
    await Expense.insertMany(expenses);
  } catch (error) {
    throw error;
  }
}

export async function seedPayroll(): Promise<void> {
  try {
    await Payroll.deleteMany({});
    
    const users = await User.find({ role: { $in: ['doctor', 'nurse', 'staff', 'receptionist', 'accountant'] } });
    
    if (users.length === 0) {
      return;
    }
    
    const payrolls = [];
    const statuses = ['draft', 'pending', 'processed', 'paid'];
    
    // Define base salaries by role
    const baseSalaries = {
      doctor: 12000,
      nurse: 4000,
      staff: 3000,
      receptionist: 2500,
      accountant: 5000,
      admin: 8000
    };

    // Generate payroll for the last 12 months
    const currentDate = new Date();
    
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const payrollDate = new Date(currentDate);
      payrollDate.setMonth(payrollDate.getMonth() - monthOffset);
      
      const month = payrollDate.toLocaleString('default', { month: 'long' });
      const year = payrollDate.getFullYear();
      
      // Create payroll for each employee for this month
      for (const user of users) {
        const baseSalary = baseSalaries[user.role as keyof typeof baseSalaries] || 3000;
        
        // Add some variation to base salary (±10%)
        const salaryVariation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const adjustedBaseSalary = Math.floor(baseSalary * salaryVariation);
        
        // Generate realistic values
        const workingDays = 20 + Math.floor(Math.random() * 3); // 20-22 working days
        const totalDays = 28 + Math.floor(Math.random() * 3); // 28-30 total days
        const leaves = Math.floor(Math.random() * 3); // 0-2 leaves
        
        // Calculate overtime (more for doctors and nurses)
        const overtimeHours = user.role === 'doctor' || user.role === 'nurse' ? 
          Math.floor(Math.random() * 20) : Math.floor(Math.random() * 5);
        const overtimeRate = baseSalary / (workingDays * 8); // hourly rate
        const overtime = Math.floor(overtimeHours * overtimeRate * 1.5); // 1.5x for overtime
        
        // Bonus (quarterly or performance-based)
        const bonus = (monthOffset % 3 === 0 && Math.random() > 0.5) ? 
          Math.floor(baseSalary * (0.1 + Math.random() * 0.1)) : 0; // 10-20% of base
        
        // Allowances
        const allowances = Math.floor(200 + Math.random() * 300); // 200-500
        
        // Deductions (health insurance, etc.)
        const deductions = Math.floor(baseSalary * 0.05 + Math.random() * 200); // 5% + random
        
        // Tax calculation (progressive)
        const grossPay = adjustedBaseSalary + overtime + bonus + allowances;
        const tax = Math.floor(grossPay * (0.15 + Math.random() * 0.1)); // 15-25%
        
        const netSalary = grossPay - deductions - tax;
        
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Set more realistic status based on month
        if (monthOffset === 0) {
          // Current month might be pending
          status = Math.random() < 0.7 ? 'processed' : 'pending';
        } else {
          // Past months are mostly processed or paid
          status = Math.random() < 0.95 ? 'paid' : 'processed';
        }
        
        // Pay date is usually end of month or beginning of next month
        const payDate = new Date(payrollDate);
        payDate.setDate(payDate.getDate() + 25 + Math.floor(Math.random() * 10));

        payrolls.push({
          employee_id: user._id,
          month: month,
          year: year,
          base_salary: adjustedBaseSalary,
          overtime: overtime,
          bonus: bonus,
          allowances: allowances,
          deductions: deductions,
          tax: tax,
          net_salary: netSalary,
          status: status,
          working_days: workingDays,
          total_days: totalDays,
          leaves: leaves,
          pay_date: payDate
        });
      }
    }
    
    await Payroll.insertMany(payrolls);
  } catch (error) {
    throw error;
  }
}

export async function seedTrainingProgress(): Promise<void> {
  try {
    await TrainingProgress.deleteMany({});
    
    const users = await User.find();
    const trainings = await Training.find();
    
    if (users.length === 0 || trainings.length === 0) {
      return;
    }

    const trainingProgresses = [];

    // Create training progress for each user
    for (const user of users) {
      // Find trainings relevant to this user's role
      const relevantTrainings = trainings.filter(training => 
        training.role === user.role
      );

      // Each user might be enrolled in 1-3 training programs
      const numTrainings = Math.min(relevantTrainings.length, 1 + Math.floor(Math.random() * 3));
      
      for (let i = 0; i < numTrainings; i++) {
        const training = relevantTrainings[i];
        
        if (!training.modules || training.modules.length === 0) {
          continue;
        }

        // Generate start date (within last 6 months)
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
        
        // Calculate last accessed (between start date and now)
        const lastAccessed = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
        
        // Generate module progress
        const modulesProgress = [];
        let completedModules = 0;
        let totalProgress = 0;

        for (let moduleIndex = 0; moduleIndex < training.modules.length; moduleIndex++) {
          const module = training.modules[moduleIndex];
          let moduleCompleted = false;
          let progressPercentage = 0;
          let completedAt = undefined;

          // First modules are more likely to be completed
          const completionProbability = Math.max(0.1, 1 - (moduleIndex * 0.3));
          
          if (Math.random() < completionProbability) {
            moduleCompleted = true;
            progressPercentage = 100;
            completedModules++;
            
            // Completion date between start and last accessed
            completedAt = new Date(startDate.getTime() + Math.random() * (lastAccessed.getTime() - startDate.getTime()));
          } else if (moduleIndex === completedModules) {
            // Current module might be partially completed
            progressPercentage = Math.floor(Math.random() * 90);
          }

          totalProgress += progressPercentage;

          modulesProgress.push({
            module_id: module._id?.toString() || `module-${moduleIndex + 1}`,
            module_title: module.title,
            completed: moduleCompleted,
            completed_at: completedAt,
            lessons_completed: moduleCompleted ? (module.lessons || []) : 
                             (module.lessons || []).slice(0, Math.floor((module.lessons || []).length * progressPercentage / 100)),
            progress_percentage: progressPercentage
          });
        }

        const overallProgress = Math.floor(totalProgress / training.modules.length);
        const isCompleted = completedModules === training.modules.length;
        const certificateIssued = isCompleted && Math.random() < 0.8; // 80% chance of certificate if completed

        trainingProgresses.push({
          user_id: user._id,
          training_id: training._id,
          role: user.role,
          overall_progress: overallProgress,
          modules_progress: modulesProgress,
          started_at: startDate,
          last_accessed: lastAccessed,
          is_completed: isCompleted,
          certificate_issued: certificateIssued,
          completed_at: isCompleted ? lastAccessed : undefined
        });
      }
    }
    
    await TrainingProgress.insertMany(trainingProgresses);
  } catch (error) {
    throw error;
  }
} 