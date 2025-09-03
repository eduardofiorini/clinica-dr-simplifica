import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Table,
  Users,
  Calendar,
  TestTube2,
  DollarSign,
  Settings,
  FileText,
  Activity,
  Package,
  Building,
  Heart,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  Link,
  Key,
  GitBranch,
  Server,
  HardDrive,
  Download,
  Code,
  UserCheck,
  Stethoscope,
  BarChart3,
  Shield,
  Home,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";

const DatabaseStructure = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");

  const databaseTables = [
    {
      name: "users",
      module: "Authentication",
      description: "Store user accounts and authentication data for all system users",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique user identifier (MongoDB)",
        },
        {
          name: "email",
          type: "String",
          unique: true,
          description: "User email address (required, unique)",
        },
        {
          name: "password_hash",
          type: "String",
          description: "Encrypted password (bcrypt hashed)",
        },
        {
          name: "first_name",
          type: "String",
          description: "User's first name (max 100 chars)",
        },
        {
          name: "last_name",
          type: "String",
          description: "User's last name (max 100 chars)",
        },
        {
          name: "role",
          type: "Enum",
          description: "User role: admin, doctor, nurse, receptionist, accountant, staff",
        },
        {
          name: "phone",
          type: "String",
          description: "Contact phone number (max 20 chars)",
        },
        { 
          name: "is_active", 
          type: "Boolean", 
          description: "Account active status (default: true)" 
        },
        {
          name: "base_currency",
          type: "String",
          description: "Default currency (USD, EUR, GBP, etc.)",
        },
        {
          name: "address",
          type: "String",
          description: "User address (optional, max 500 chars)",
        },
        {
          name: "bio",
          type: "String",
          description: "User biography (optional, max 1000 chars)",
        },
        {
          name: "date_of_birth",
          type: "Date",
          description: "User's birth date (optional)",
        },
        {
          name: "specialization",
          type: "String",
          description: "Medical specialization (optional, max 200 chars)",
        },
        {
          name: "license_number",
          type: "String",
          description: "Medical license number (optional, max 100 chars)",
        },
        {
          name: "department",
          type: "String",
          description: "Department name (optional, max 100 chars)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Account creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last profile update timestamp",
        },
      ],
      relationships: [
        { table: "appointments", type: "one-to-many", field: "doctor_id" },
        { table: "prescriptions", type: "one-to-many", field: "doctor_id" },
        { table: "medical_records", type: "one-to-many", field: "doctor_id" },
        { table: "test_reports", type: "one-to-many", field: "recordedBy" },
        { table: "expenses", type: "one-to-many", field: "created_by" },
        { table: "payroll", type: "one-to-many", field: "employee_id" },
      ],
    },
    {
      name: "patients",
      module: "Patient Management",
      description: "Patient demographic and contact information with emergency contacts",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique patient identifier (MongoDB)",
        },
        {
          name: "first_name",
          type: "String",
          description: "Patient's first name (required, max 100 chars)",
        },
        {
          name: "last_name",
          type: "String",
          description: "Patient's last name (required, max 100 chars)",
        },
        {
          name: "date_of_birth",
          type: "Date",
          description: "Patient's birth date (required, validates past date)",
        },
        { 
          name: "gender", 
          type: "Enum", 
          description: "Gender: male, female, other" 
        },
        {
          name: "phone",
          type: "String",
          description: "Primary phone number (required, max 20 chars)",
        },
        {
          name: "email",
          type: "String",
          description: "Email address (required, validated format)",
        },
        {
          name: "address",
          type: "String",
          description: "Home address (required)",
        },
        {
          name: "emergency_contact",
          type: "Object",
          description: "Emergency contact: {name, relationship, phone, email}",
        },
        {
          name: "insurance_info",
          type: "Object",
          description: "Insurance: {provider, policy_number, group_number, expiry_date}",
        },
        {
          name: "age",
          type: "Virtual",
          description: "Calculated age from date_of_birth (virtual field)",
        },
        {
          name: "full_name",
          type: "Virtual",
          description: "Concatenated first_name + last_name (virtual field)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Registration timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "appointments", type: "one-to-many", field: "patient_id" },
        { table: "medical_records", type: "one-to-many", field: "patient_id" },
        { table: "prescriptions", type: "one-to-many", field: "patient_id" },
        { table: "invoices", type: "one-to-many", field: "patient_id" },
        { table: "payments", type: "one-to-many", field: "patient_id" },
        { table: "test_reports", type: "one-to-many", field: "patientId" },
      ],
    },
    {
      name: "appointments",
      module: "Scheduling",
      description: "Appointment booking and scheduling with status tracking",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique appointment identifier",
        },
        {
          name: "patient_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Patient document",
        },
        {
          name: "doctor_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to User document (doctor)",
        },
        {
          name: "appointment_date",
          type: "Date",
          description: "Scheduled date and time (must be future)",
        },
        {
          name: "duration",
          type: "Number",
          description: "Duration in minutes (15-240, default: 30)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: scheduled, confirmed, in-progress, completed, cancelled, no-show",
        },
        {
          name: "type",
          type: "Enum",
          description: "Type: consultation, follow-up, check-up, vaccination, procedure, emergency, screening, therapy, other",
        },
        {
          name: "reason",
          type: "String",
          description: "Appointment reason (optional, max 200 chars)",
        },
        {
          name: "notes",
          type: "String",
          description: "Additional notes (max 1000 chars)",
        },
        {
          name: "end_time",
          type: "Virtual",
          description: "Calculated end time (appointment_date + duration)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Booking timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last modification timestamp",
        },
      ],
      relationships: [
        { table: "patients", type: "many-to-one", field: "patient_id" },
        { table: "users", type: "many-to-one", field: "doctor_id" },
        { table: "prescriptions", type: "one-to-one", field: "appointment_id" },
        { table: "invoices", type: "one-to-one", field: "appointment_id" },
      ],
    },
    {
      name: "medical_records",
      module: "Medical Records",
      description: "Patient medical history with vital signs, medications, and allergies",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique record identifier",
        },
        {
          name: "patient_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Patient document",
        },
        {
          name: "doctor_id",
          type: "ObjectId",
          foreign: true,
          description: "Attending physician reference",
        },
        {
          name: "visit_date",
          type: "Date",
          description: "Date of medical visit",
        },
        {
          name: "chief_complaint",
          type: "String",
          description: "Primary concern (required, max 1000 chars)",
        },
        {
          name: "diagnosis",
          type: "String",
          description: "Medical diagnosis (required, max 2000 chars)",
        },
        {
          name: "treatment",
          type: "String",
          description: "Treatment provided (required, max 2000 chars)",
        },
        {
          name: "vital_signs",
          type: "Object",
          description: "Vital signs: {temperature, blood_pressure: {systolic, diastolic}, heart_rate, respiratory_rate, oxygen_saturation, weight, height}",
        },
        {
          name: "medications",
          type: "Array",
          description: "Prescribed medications: [{name, dosage, frequency, duration, notes}]",
        },
        {
          name: "allergies",
          type: "Array",
          description: "Known allergies: [{allergen, severity: mild|moderate|severe, reaction}]",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Record creation timestamp",
        },
      ],
      relationships: [
        { table: "patients", type: "many-to-one", field: "patient_id" },
        { table: "users", type: "many-to-one", field: "doctor_id" },
      ],
    },
    {
      name: "prescriptions",
      module: "Medical Records",
      description: "Electronic prescriptions with medication details and pharmacy status",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique prescription identifier",
        },
        {
          name: "patient_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Patient document",
        },
        {
          name: "doctor_id",
          type: "ObjectId",
          foreign: true,
          description: "Prescribing doctor reference",
        },
        {
          name: "appointment_id",
          type: "ObjectId",
          foreign: true,
          description: "Related appointment (optional)",
        },
        {
          name: "prescription_id",
          type: "String",
          unique: true,
          description: "Custom prescription ID (e.g., RX-001)",
        },
        {
          name: "diagnosis",
          type: "String",
          description: "Medical diagnosis for prescription",
        },
        {
          name: "medications",
          type: "Array",
          description: "Medication list: [{name, dosage, frequency, duration, instructions, quantity}]",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: active, completed, pending, cancelled, expired",
        },
        {
          name: "notes",
          type: "String",
          description: "Additional prescription notes (optional)",
        },
        {
          name: "follow_up_date",
          type: "Date",
          description: "Follow-up appointment date (optional)",
        },
        {
          name: "pharmacy_dispensed",
          type: "Boolean",
          description: "Pharmacy dispensed status (default: false)",
        },
        {
          name: "dispensed_date",
          type: "Date",
          description: "Date when prescription was dispensed",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Prescription creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "patients", type: "many-to-one", field: "patient_id" },
        { table: "users", type: "many-to-one", field: "doctor_id" },
        { table: "appointments", type: "many-to-one", field: "appointment_id" },
      ],
    },
    {
      name: "invoices",
      module: "Billing",
      description: "Billing and invoice management with itemized services and payment tracking",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique invoice identifier",
        },
        {
          name: "patient_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Patient document",
        },
        {
          name: "appointment_id",
          type: "ObjectId",
          foreign: true,
          description: "Related appointment (optional)",
        },
        {
          name: "invoice_number",
          type: "String",
          unique: true,
          description: "Auto-generated invoice number (INV-YYYY-NNNN)",
        },
        {
          name: "total_amount",
          type: "Number",
          description: "Total invoice amount (calculated)",
        },
        {
          name: "tax_amount",
          type: "Number",
          description: "Tax amount (default: 0)",
        },
        {
          name: "subtotal",
          type: "Number",
          description: "Subtotal before tax and discount",
        },
        {
          name: "discount",
          type: "Number",
          description: "Discount amount (default: 0)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: draft, sent, pending, paid, overdue, cancelled, refunded",
        },
        {
          name: "issue_date",
          type: "Date",
          description: "Invoice issue date",
        },
        {
          name: "due_date",
          type: "Date",
          description: "Payment due date",
        },
        {
          name: "payment_method",
          type: "String",
          description: "Payment method used (optional)",
        },
        {
          name: "services",
          type: "Array",
          description: "Billed services: [{id, description, quantity, unit_price, total, type: service|test|medication|procedure}]",
        },
        {
          name: "gross_amount",
          type: "Virtual",
          description: "Calculated gross amount (subtotal + tax)",
        },
        {
          name: "is_overdue",
          type: "Virtual",
          description: "Overdue status check (virtual field)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Invoice creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
        {
          name: "paid_at",
          type: "Date",
          description: "Payment completion timestamp",
        },
      ],
      relationships: [
        { table: "patients", type: "many-to-one", field: "patient_id" },
        { table: "appointments", type: "many-to-one", field: "appointment_id" },
        { table: "payments", type: "one-to-many", field: "invoice_id" },
      ],
    },
    {
      name: "payments",
      module: "Billing",
      description: "Payment transactions with multiple payment methods and processing fees",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique payment identifier",
        },
        {
          name: "invoice_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Invoice document",
        },
        {
          name: "patient_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Patient document",
        },
        {
          name: "amount",
          type: "Number",
          description: "Payment amount (must be positive)",
        },
        {
          name: "method",
          type: "Enum",
          description: "Payment method: credit_card, cash, bank_transfer, upi, insurance",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: completed, pending, processing, failed, refunded",
        },
        {
          name: "transaction_id",
          type: "String",
          description: "External transaction ID (optional)",
        },
        {
          name: "card_last4",
          type: "String",
          description: "Last 4 digits of card (for card payments)",
        },
        {
          name: "insurance_provider",
          type: "String",
          description: "Insurance provider name (for insurance payments)",
        },
        {
          name: "processing_fee",
          type: "Number",
          description: "Payment processing fee (default: 0)",
        },
        {
          name: "net_amount",
          type: "Number",
          description: "Net amount (amount - processing_fee)",
        },
        {
          name: "payment_date",
          type: "Date",
          description: "Payment processing date",
        },
        {
          name: "failure_reason",
          type: "String",
          description: "Reason for payment failure (optional)",
        },
        {
          name: "description",
          type: "String",
          description: "Payment description (required, max 500 chars)",
        },
        {
          name: "payment_id",
          type: "Virtual",
          description: "Generated payment ID for display (PAY-XXXXXX)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Payment creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "invoices", type: "many-to-one", field: "invoice_id" },
        { table: "patients", type: "many-to-one", field: "patient_id" },
      ],
    },
    {
      name: "inventory",
      module: "Inventory",
      description: "Medical supplies and equipment tracking with stock management",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique item identifier",
        },
        {
          name: "name",
          type: "String",
          description: "Item name (required, max 255 chars)",
        },
        {
          name: "category",
          type: "Enum",
          description: "Category: medications, medical-devices, consumables, equipment, laboratory, office-supplies, other",
        },
        {
          name: "sku",
          type: "String",
          unique: true,
          description: "Stock keeping unit (unique, uppercase, alphanumeric with hyphens/underscores)",
        },
        {
          name: "current_stock",
          type: "Number",
          description: "Current stock level (min: 0, default: 0)",
        },
        {
          name: "minimum_stock",
          type: "Number",
          description: "Minimum stock threshold (min: 0, default: 1)",
        },
        {
          name: "unit_price",
          type: "Number",
          description: "Price per unit (must be positive)",
        },
        {
          name: "supplier",
          type: "String",
          description: "Supplier information (required, max 255 chars)",
        },
        {
          name: "expiry_date",
          type: "Date",
          description: "Expiration date (optional, must be future)",
        },
        {
          name: "is_low_stock",
          type: "Virtual",
          description: "Low stock indicator (current_stock <= minimum_stock)",
        },
        {
          name: "is_out_of_stock",
          type: "Virtual",
          description: "Out of stock indicator (current_stock === 0)",
        },
        {
          name: "expiry_status",
          type: "Virtual",
          description: "Expiry status: no-expiry, expired, expiring-soon, valid",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Item creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        {
          table: "inventory_transactions",
          type: "one-to-many",
          field: "item_id",
        },
      ],
    },
    {
      name: "test_reports",
      module: "Laboratory",
      description: "Laboratory test reports with results, attachments, and verification workflow",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique report identifier",
        },
        {
          name: "reportNumber",
          type: "String",
          unique: true,
          description: "Auto-generated report number (RPT + year + timestamp)",
        },
        {
          name: "patientId",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Patient document",
        },
        {
          name: "patientName",
          type: "String",
          description: "Patient name (required, max 200 chars)",
        },
        {
          name: "patientAge",
          type: "Number",
          description: "Patient age (0-150)",
        },
        {
          name: "patientGender",
          type: "Enum",
          description: "Patient gender: male, female, other",
        },
        {
          name: "testId",
          type: "ObjectId",
          foreign: true,
          description: "Reference to Test document",
        },
        {
          name: "testName",
          type: "String",
          description: "Test name (required, max 200 chars)",
        },
        {
          name: "testCode",
          type: "String",
          description: "Test code (required, uppercase, max 20 chars)",
        },
        {
          name: "category",
          type: "String",
          description: "Test category (required, max 100 chars)",
        },
        {
          name: "externalVendor",
          type: "String",
          description: "External vendor name (required, max 200 chars)",
        },
        {
          name: "testDate",
          type: "Date",
          description: "Test performance date (required)",
        },
        {
          name: "recordedDate",
          type: "Date",
          description: "Results recording date (required)",
        },
        {
          name: "recordedBy",
          type: "String",
          description: "Staff member who recorded results (required, max 100 chars)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: pending, recorded, verified, delivered (default: pending)",
        },
        {
          name: "results",
          type: "Mixed",
          description: "Test results data (flexible schema)",
        },
        {
          name: "normalRange",
          type: "String",
          description: "Normal range values (optional, max 500 chars)",
        },
        {
          name: "units",
          type: "String",
          description: "Measurement units (optional, max 50 chars)",
        },
        {
          name: "notes",
          type: "String",
          description: "Additional notes (optional, max 2000 chars)",
        },
        {
          name: "attachments",
          type: "Array",
          description: "File attachments: [{id, name, type, size, url}]",
        },
        {
          name: "interpretation",
          type: "String",
          description: "Results interpretation (optional, max 2000 chars)",
        },
        {
          name: "verifiedBy",
          type: "String",
          description: "Verifying staff member (max 100 chars)",
        },
        {
          name: "verifiedDate",
          type: "Date",
          description: "Verification timestamp",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Report creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "patients", type: "many-to-one", field: "patientId" },
        { table: "tests", type: "many-to-one", field: "testId" },
      ],
    },
    {
      name: "tests",
      module: "Laboratory",
      description: "Laboratory test catalog with methodologies and turnaround times",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique test identifier",
        },
        {
          name: "name",
          type: "String",
          unique: true,
          description: "Test name (required, unique, max 200 chars)",
        },
        {
          name: "code",
          type: "String",
          unique: true,
          description: "Test code (required, unique, uppercase, max 20 chars)",
        },
        {
          name: "category",
          type: "String",
          description: "Test category (required, max 100 chars)",
        },
        {
          name: "description",
          type: "String",
          description: "Test description (required, max 1000 chars)",
        },
        {
          name: "normalRange",
          type: "String",
          description: "Normal range values (optional, max 500 chars)",
        },
        {
          name: "units",
          type: "String",
          description: "Measurement units (optional, max 50 chars)",
        },
        {
          name: "methodology",
          type: "String",
          description: "Test methodology (optional, max 200 chars)",
        },
        {
          name: "turnaroundTime",
          type: "String",
          description: "Expected turnaround time (required, max 100 chars)",
        },
        {
          name: "sampleType",
          type: "String",
          description: "Sample type required (optional, max 100 chars)",
        },
        {
          name: "isActive",
          type: "Boolean",
          description: "Test active status (default: true)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Test creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "test_reports", type: "one-to-many", field: "testId" },
      ],
    },
    {
      name: "departments",
      module: "Organization",
      description: "Hospital departments with staff and budget information",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique department identifier",
        },
        {
          name: "code",
          type: "String",
          unique: true,
          description: "Department code (unique, uppercase alphanumeric, max 10 chars)",
        },
        {
          name: "name",
          type: "String",
          description: "Department name (required, max 100 chars)",
        },
        {
          name: "description",
          type: "String",
          description: "Department description (required, max 500 chars)",
        },
        {
          name: "head",
          type: "String",
          description: "Department head name (required, max 100 chars)",
        },
        {
          name: "location",
          type: "String",
          description: "Physical location (required, max 200 chars)",
        },
        {
          name: "phone",
          type: "String",
          description: "Department phone number (required, max 20 chars)",
        },
        {
          name: "email",
          type: "String",
          description: "Department email (required, validated format)",
        },
        {
          name: "staffCount",
          type: "Number",
          description: "Number of staff members (integer, min: 0)",
        },
        {
          name: "budget",
          type: "Number",
          description: "Department budget (min: 0)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: active, inactive (default: active)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Department creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "users", type: "one-to-many", field: "department" },
      ],
    },
    {
      name: "leads",
      module: "Marketing",
      description: "Lead management for potential patients and referrals",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique lead identifier",
        },
        {
          name: "firstName",
          type: "String",
          description: "Lead's first name (required, max 100 chars)",
        },
        {
          name: "lastName",
          type: "String",
          description: "Lead's last name (required, max 100 chars)",
        },
        {
          name: "email",
          type: "String",
          description: "Email address (optional, validated format)",
        },
        {
          name: "phone",
          type: "String",
          description: "Phone number (required, max 20 chars)",
        },
        {
          name: "source",
          type: "Enum",
          description: "Lead source: website, referral, social, advertisement, walk-in",
        },
        {
          name: "serviceInterest",
          type: "String",
          description: "Service of interest (required, max 200 chars)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: new, contacted, converted, lost (default: new)",
        },
        {
          name: "assignedTo",
          type: "String",
          description: "Assigned staff member (optional, max 100 chars)",
        },
        {
          name: "notes",
          type: "String",
          description: "Lead notes (optional, max 1000 chars)",
        },
        {
          name: "fullName",
          type: "Virtual",
          description: "Concatenated firstName + lastName (virtual field)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Lead creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [],
    },
    {
      name: "expenses",
      module: "Finance",
      description: "Business expense tracking with categories and receipt management",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique expense identifier",
        },
        {
          name: "title",
          type: "String",
          description: "Expense title (required, max 200 chars)",
        },
        {
          name: "description",
          type: "String",
          description: "Expense description (optional, max 500 chars)",
        },
        {
          name: "amount",
          type: "Number",
          description: "Expense amount (required, min: 0)",
        },
        {
          name: "category",
          type: "Enum",
          description: "Category: supplies, equipment, utilities, maintenance, staff, marketing, insurance, rent, other",
        },
        {
          name: "vendor",
          type: "String",
          description: "Vendor name (optional, max 100 chars)",
        },
        {
          name: "payment_method",
          type: "Enum",
          description: "Payment method: cash, card, bank_transfer, check",
        },
        {
          name: "date",
          type: "Date",
          description: "Expense date (required)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: pending, paid, cancelled (default: pending)",
        },
        {
          name: "receipt_url",
          type: "String",
          description: "Receipt file URL (optional)",
        },
        {
          name: "notes",
          type: "String",
          description: "Additional notes (optional, max 1000 chars)",
        },
        {
          name: "created_by",
          type: "ObjectId",
          foreign: true,
          description: "Reference to User who created expense",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Expense creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "users", type: "many-to-one", field: "created_by" },
      ],
    },
    {
      name: "payroll",
      module: "HR",
      description: "Employee payroll management with salary calculations and deductions",
      fields: [
        {
          name: "_id",
          type: "ObjectId",
          primary: true,
          description: "Unique payroll identifier",
        },
        {
          name: "employee_id",
          type: "ObjectId",
          foreign: true,
          description: "Reference to User document (employee)",
        },
        {
          name: "month",
          type: "Enum",
          description: "Month: January, February, ..., December",
        },
        {
          name: "year",
          type: "Number",
          description: "Payroll year (2020 to next year)",
        },
        {
          name: "base_salary",
          type: "Number",
          description: "Base salary amount (required, min: 0)",
        },
        {
          name: "overtime",
          type: "Number",
          description: "Overtime amount (min: 0, default: 0)",
        },
        {
          name: "bonus",
          type: "Number",
          description: "Bonus amount (min: 0, default: 0)",
        },
        {
          name: "allowances",
          type: "Number",
          description: "Allowances amount (min: 0, default: 0)",
        },
        {
          name: "deductions",
          type: "Number",
          description: "Deductions amount (min: 0, default: 0)",
        },
        {
          name: "tax",
          type: "Number",
          description: "Tax amount (min: 0, default: 0)",
        },
        {
          name: "net_salary",
          type: "Number",
          description: "Net salary (calculated: gross - deductions - tax)",
        },
        {
          name: "status",
          type: "Enum",
          description: "Status: draft, pending, processed, paid (default: draft)",
        },
        {
          name: "pay_date",
          type: "Date",
          description: "Payment date (optional)",
        },
        {
          name: "working_days",
          type: "Number",
          description: "Working days in month (0-31)",
        },
        {
          name: "total_days",
          type: "Number",
          description: "Total days in month (28-31)",
        },
        {
          name: "leaves",
          type: "Number",
          description: "Leave days taken (min: 0, default: 0)",
        },
        {
          name: "payroll_id",
          type: "Virtual",
          description: "Generated payroll ID for display (PAY-XXXXXX)",
        },
        {
          name: "gross_salary",
          type: "Virtual",
          description: "Calculated gross salary (base + overtime + bonus + allowances)",
        },
        {
          name: "created_at",
          type: "Date",
          description: "Payroll creation timestamp",
        },
        {
          name: "updated_at",
          type: "Date",
          description: "Last update timestamp",
        },
      ],
      relationships: [
        { table: "users", type: "many-to-one", field: "employee_id" },
      ],
    },
  ];

  const modules = [
    "all",
    ...Array.from(new Set(databaseTables.map((table) => table.module))),
  ];

  const filteredTables = databaseTables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule =
      selectedModule === "all" || table.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const getFieldIcon = (field: any) => {
    if (field.primary) return <Key className="h-4 w-4 text-yellow-600" />;
    if (field.foreign) return <Link className="h-4 w-4 text-blue-600" />;
    if (field.unique) return <Shield className="h-4 w-4 text-green-600" />;
    return <Database className="h-4 w-4 text-gray-600" />;
  };

  const getFieldBadge = (field: any) => {
    if (field.primary)
      return <Badge className="bg-yellow-100 text-yellow-800">Primary</Badge>;
    if (field.foreign)
      return <Badge className="bg-blue-100 text-blue-800">Foreign</Badge>;
    if (field.unique)
      return <Badge className="bg-green-100 text-green-800">Unique</Badge>;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Database Structure
          </h1>
          <p className="text-gray-600 mt-1">
            Complete database schema and table relationships for ClinicPro
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Schema
          </Button>
          <Button className="w-full sm:w-auto">
            <Code className="h-4 w-4 mr-2" />
            Generate DDL
          </Button>
        </div>
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0 sm:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Module Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full sm:w-48 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module === "all" ? "All Modules" : module}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Table className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tables
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {databaseTables.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Fields
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {databaseTables.reduce(
                      (sum, table) => sum + table.fields.length,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <GitBranch className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Relationships
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {databaseTables.reduce(
                      (sum, table) => sum + table.relationships.length,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Modules</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {modules.length - 1}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tables List */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables">Database Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tables List */}
            <Card>
              <CardHeader>
                <CardTitle>Tables</CardTitle>
                <CardDescription>
                  Click on a table to view its structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTables.map((table, index) => (
                    <motion.div
                      key={table.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedTable === table.name
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedTable(table.name)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Table className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold">{table.name}</span>
                          </div>
                          <Badge variant="outline">{table.module}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {table.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{table.fields.length} fields</span>
                          <span>
                            {table.relationships.length} relationships
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Table Details */}
            {selectedTable && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Table className="h-5 w-5" />
                      <span>{selectedTable}</span>
                    </CardTitle>
                    <CardDescription>
                      {
                        databaseTables.find((t) => t.name === selectedTable)
                          ?.description
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Fields</h4>
                        <div className="space-y-2">
                          {databaseTables
                            .find((t) => t.name === selectedTable)
                            ?.fields.map((field, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  {getFieldIcon(field)}
                                  <div>
                                    <div className="font-medium">
                                      {field.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {field.type}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getFieldBadge(field)}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Relationships</h4>
                        <div className="space-y-2">
                          {databaseTables
                            .find((t) => t.name === selectedTable)
                            ?.relationships.map((rel, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3 p-3 border rounded-lg"
                              >
                                <GitBranch className="h-4 w-4 text-purple-600" />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {rel.type} → {rel.table}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    via {rel.field}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle>Database Relationships</CardTitle>
              <CardDescription>
                Visual representation of table relationships and foreign keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {databaseTables.map((table, index) => (
                  <motion.div
                    key={table.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Table className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-lg">
                        {table.name}
                      </span>
                      <Badge variant="outline">{table.module}</Badge>
                    </div>

                    {table.relationships.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {table.relationships.map((rel, relIndex) => (
                          <div
                            key={relIndex}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-sm">
                                {rel.table}
                              </div>
                              <div className="text-xs text-gray-500">
                                {rel.type} via {rel.field}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No relationships defined
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseStructure;
