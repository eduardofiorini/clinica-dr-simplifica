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
  BookOpen,
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
  Star,
  Lightbulb,
  HelpCircle,
  Download,
  Play,
  UserCheck,
  Stethoscope,
  BarChart3,
  Shield,
  Home,
  Search,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

const Documentation = () => {
  const [activeFlow, setActiveFlow] = useState("patient");

  const userRoles = [
    {
      role: "Admin",
      icon: Shield,
      color: "text-purple-600 bg-purple-100",
      description: "Complete system access and management",
      access: [
        "All Modules",
        "User Management",
        "System Settings",
        "Reports",
        "Analytics",
      ],
    },
    {
      role: "Doctor",
      icon: Stethoscope,
      color: "text-blue-600 bg-blue-100",
      description: "Medical practice and patient care",
      access: [
        "Patients",
        "Appointments",
        "Prescriptions",
        "Test Reports",
        "Services",
      ],
    },
    {
      role: "Nurse",
      icon: Heart,
      color: "text-red-600 bg-red-100",
      description: "Patient care and inventory management",
      access: ["Patients", "Inventory", "Test Reports", "Appointments"],
    },
    {
      role: "Receptionist",
      icon: Users,
      color: "text-green-600 bg-green-100",
      description: "Front desk operations and scheduling",
      access: [
        "Appointments",
        "Patients",
        "Leads",
        "Basic Billing",
        "Calendar",
      ],
    },
    {
      role: "Accountant",
      icon: DollarSign,
      color: "text-orange-600 bg-orange-100",
      description: "Financial management and reporting",
      access: [
        "Billing",
        "Invoices",
        "Payments",
        "Payroll",
        "Financial Reports",
      ],
    },
  ];

  const workflows = [
    {
      id: "patient",
      title: "Patient Registration & Management",
      description: "Complete patient onboarding and management process",
      steps: [
        {
          title: "Initial Registration",
          description: "Collect basic patient information",
          details: [
            "Personal details (name, DOB, contact)",
            "Insurance information",
            "Emergency contacts",
            "Medical history questionnaire",
          ],
        },
        {
          title: "Document Upload",
          description: "Attach relevant medical documents",
          details: [
            "ID verification documents",
            "Insurance cards",
            "Previous medical records",
            "Lab reports and imaging",
          ],
        },
        {
          title: "Medical History",
          description: "Comprehensive health background",
          details: [
            "Previous conditions and treatments",
            "Allergies and medications",
            "Family medical history",
            "Lifestyle factors",
          ],
        },
        {
          title: "Profile Completion",
          description: "Finalize patient profile setup",
          details: [
            "Review all information",
            "Set up patient portal access",
            "Schedule initial consultation",
            "Send welcome communications",
          ],
        },
      ],
    },
    {
      id: "appointment",
      title: "Appointment Scheduling",
      description: "End-to-end appointment management workflow",
      steps: [
        {
          title: "Booking Request",
          description: "Patient initiates appointment request",
          details: [
            "Select preferred doctor",
            "Choose appointment type",
            "Specify date/time preferences",
            "Add reason for visit",
          ],
        },
        {
          title: "Availability Check",
          description: "System checks doctor availability",
          details: [
            "Real-time calendar integration",
            "Conflict detection",
            "Alternative slot suggestions",
            "Waiting list management",
          ],
        },
        {
          title: "Confirmation",
          description: "Appointment booking confirmation",
          details: [
            "Send confirmation emails/SMS",
            "Add to doctor's calendar",
            "Update patient records",
            "Set up automated reminders",
          ],
        },
        {
          title: "Pre-appointment",
          description: "Preparation and reminders",
          details: [
            "Send reminder notifications",
            "Pre-visit questionnaires",
            "Insurance verification",
            "Preparation instructions",
          ],
        },
      ],
    },
    {
      id: "billing",
      title: "Billing & Payment Processing",
      description: "Complete financial transaction workflow",
      steps: [
        {
          title: "Service Completion",
          description: "Medical service provided to patient",
          details: [
            "Service documentation",
            "Procedure codes assignment",
            "Time and resource tracking",
            "Notes and observations",
          ],
        },
        {
          title: "Invoice Generation",
          description: "Automated billing creation",
          details: [
            "Service cost calculation",
            "Insurance coverage check",
            "Tax and fee application",
            "Payment terms setting",
          ],
        },
        {
          title: "Payment Processing",
          description: "Handle various payment methods",
          details: [
            "Cash payments",
            "Credit/debit cards",
            "Insurance claims",
            "Payment plan setup",
          ],
        },
        {
          title: "Record Keeping",
          description: "Financial record management",
          details: [
            "Transaction logging",
            "Receipt generation",
            "Accounting integration",
            "Audit trail maintenance",
          ],
        },
      ],
    },
  ];

  const quickGuides = [
    {
      title: "Getting Started",
      description: "Basic setup and navigation",
      time: "5 min read",
      difficulty: "Beginner",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "User Management",
      description: "Adding and managing staff accounts",
      time: "8 min read",
      difficulty: "Intermediate",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Appointment Scheduling",
      description: "Managing clinic calendar and bookings",
      time: "10 min read",
      difficulty: "Beginner",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Financial Reports",
      description: "Generating and analyzing reports",
      time: "12 min read",
      difficulty: "Advanced",
      color: "bg-orange-100 text-orange-800",
    },
    {
      title: "System Configuration",
      description: "Customizing clinic settings",
      time: "15 min read",
      difficulty: "Advanced",
      color: "bg-orange-100 text-orange-800",
    },
    {
      title: "Data Backup & Security",
      description: "Protecting your clinic data",
      time: "7 min read",
      difficulty: "Intermediate",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Platform Documentation
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive guides, workflows, and help resources for ClinicPro
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button className="w-full sm:w-auto">
            <MessageCircle className="h-4 w-4 mr-2" />
            Get Support
          </Button>
        </div>
      </div>
      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>
            Jump to the most commonly needed documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickGuides.map((guide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-sm">{guide.title}</h3>
                      <Badge className={guide.color}>{guide.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{guide.time}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Documentation */}
      <Tabs defaultValue="workflows" className="space-y-4">
        {/* Tab Navigation - Responsive */}
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 min-w-max">
            <TabsTrigger value="workflows" className="whitespace-nowrap">
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Workflows</span>
              <span className="sm:hidden">Flows</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="whitespace-nowrap">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">User Roles</span>
              <span className="sm:hidden">Roles</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="whitespace-nowrap">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Features</span>
              <span className="sm:hidden">Features</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="whitespace-nowrap">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Support</span>
              <span className="sm:hidden">Help</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Workflows */}
        <TabsContent value="workflows">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Workflows</CardTitle>
                <CardDescription>
                  Step-by-step guides for common clinic processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop View */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {workflows.map((workflow) => (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className={`h-full cursor-pointer transition-all duration-200 ${
                            activeFlow === workflow.id
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setActiveFlow(workflow.id)}
                        >
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2">
                              {workflow.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {workflow.description}
                            </p>
                            <div className="space-y-2">
                              {workflow.steps.map((step, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-sm"
                                >
                                  <ArrowRight className="h-3 w-3 mr-2 text-gray-400" />
                                  {step.title}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        activeFlow === workflow.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setActiveFlow(workflow.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">
                          {workflow.title}
                        </h3>
                        {activeFlow === workflow.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {workflow.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {workflow.steps.length} steps
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Workflow Details */}
            {activeFlow && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {workflows.find((w) => w.id === activeFlow)?.title}
                    </CardTitle>
                    <CardDescription>
                      {workflows.find((w) => w.id === activeFlow)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {workflows
                        .find((w) => w.id === activeFlow)
                        ?.steps.map((step, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-blue-500 pl-6"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <span className="text-sm font-semibold text-blue-600">
                                  {index + 1}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg">
                                {step.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 mb-3">
                              {step.description}
                            </p>
                            <ul className="space-y-1">
                              {step.details.map((detail, detailIndex) => (
                                <li
                                  key={detailIndex}
                                  className="flex items-center text-sm text-gray-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* User Roles */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Roles & Permissions</CardTitle>
              <CardDescription>
                Understanding access levels and capabilities for each user type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Grid View */}
              <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {userRoles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`p-3 rounded-lg ${role.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {role.role}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {role.description}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-900">
                              Access Permissions:
                            </h4>
                            <div className="space-y-1">
                              {role.access.map((item, accessIndex) => (
                                <div
                                  key={accessIndex}
                                  className="flex items-center text-sm text-gray-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile List View */}
              <div className="md:hidden space-y-4">
                {userRoles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${role.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{role.role}</h3>
                          <p className="text-sm text-gray-600">
                            {role.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-sm text-gray-900">
                          Access Permissions:
                        </h4>
                        <div className="space-y-1">
                          {role.access.map((item, accessIndex) => (
                            <div
                              key={accessIndex}
                              className="flex items-center text-sm text-gray-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Features</CardTitle>
                <CardDescription>
                  Essential functionality overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: Users,
                      title: "Patient Management",
                      desc: "Complete patient records and history",
                    },
                    {
                      icon: Calendar,
                      title: "Appointment Scheduling",
                      desc: "Advanced calendar and booking system",
                    },
                    {
                      icon: DollarSign,
                      title: "Billing & Payments",
                      desc: "Comprehensive financial management",
                    },
                    {
                      icon: TestTube2,
                      title: "Laboratory Integration",
                      desc: "Test ordering and result management",
                    },
                    {
                      icon: BarChart3,
                      title: "Analytics & Reports",
                      desc: "Detailed insights and reporting",
                    },
                    {
                      icon: Shield,
                      title: "Security & Compliance",
                      desc: "HIPAA compliant data protection",
                    },
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-gray-600">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>
                  Enhanced capabilities and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: Activity,
                      title: "Real-time Monitoring",
                      desc: "Live system status and alerts",
                    },
                    {
                      icon: Package,
                      title: "Inventory Management",
                      desc: "Medical supplies and equipment tracking",
                    },
                    {
                      icon: Building,
                      title: "Multi-location Support",
                      desc: "Manage multiple clinic locations",
                    },
                    {
                      icon: FileText,
                      title: "Document Management",
                      desc: "Digital document storage and sharing",
                    },
                    {
                      icon: Home,
                      title: "Telemedicine",
                      desc: "Virtual consultations and remote care",
                    },
                    {
                      icon: Settings,
                      title: "Custom Workflows",
                      desc: "Configurable business processes",
                    },
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-gray-600">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Get Help</CardTitle>
                <CardDescription>
                  Multiple ways to get support and assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Live Chat Support</h4>
                      <p className="text-sm text-gray-600">
                        24/7 instant support chat
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                    <Phone className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-gray-600">
                        Call us at +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                    <Mail className="h-6 w-6 text-purple-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-gray-600">
                        support@clinicpro.com
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>
                  Additional learning materials and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Video Tutorials
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    User Manual PDF
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Best Practices Guide
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQ Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
