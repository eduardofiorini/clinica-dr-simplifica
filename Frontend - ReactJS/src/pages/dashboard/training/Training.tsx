import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTraining } from "@/hooks/useTraining";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GraduationCap,
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
  Play,
  BookOpen,
  UserCheck,
  Stethoscope,
  BarChart3,
  Shield,
  Home,
  Clock,
  Target,
  Lightbulb,
  AlertCircle,
  Star,
  Video,
  Download,
  Edit,
  Plus,
  Search,
  Save,
} from "lucide-react";

const Training = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"admin" | "doctor" | "receptionist" | "nurse" | "accountant">(
    (user?.role as "admin" | "doctor" | "receptionist" | "nurse" | "accountant") || "admin"
  );
  const [currentTraining, setCurrentTraining] = useState(null);
  const [lessonProgress, setLessonProgress] = useState<{[key: string]: boolean}>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const {
    trainings,
    userProgress,
    loading,
    error,
    fetchTrainings,
    fetchUserProgress,
    startTraining,
    updateModuleProgress,
    completeTraining,
    issueCertificate,
    getTrainingByRole,
    getProgressForTraining,
    getTrainingCompletionPercentage,
    isTrainingStarted,
    isTrainingCompleted,
    calculateProgress,
  } = useTraining();

  // Set selected role when user changes
  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role as "admin" | "doctor" | "receptionist" | "nurse" | "accountant");
    }
  }, [user]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTrainings();
        if (user) {
          await fetchUserProgress();
        }
      } catch (err) {
        console.error('Error loading training data:', err);
      }
    };
    loadData();
  }, [fetchTrainings, fetchUserProgress, user]);

  // Load training for selected role
  useEffect(() => {
    const loadTrainingForRole = async () => {
      try {
        const training = await getTrainingByRole(selectedRole);
        setCurrentTraining(training);
        // Initialize lesson progress from current training progress
        initializeLessonProgress(training);
      } catch (err) {
        console.error('Error loading training for role:', err);
        // Fallback to static data if API fails
        const fallbackTraining = trainingContent[selectedRole] || null;
        setCurrentTraining(fallbackTraining);
        initializeLessonProgress(fallbackTraining);
      }
    };
    
    if (selectedRole) {
      loadTrainingForRole();
    }
  }, [selectedRole, getTrainingByRole, userProgress]);

  // Initialize lesson progress from API data or set to empty
  const initializeLessonProgress = (training) => {
    if (!training) return;
    
    const currentTrainingFromAPI = trainings.find(t => t.role === selectedRole);
    const currentProgress = currentTrainingFromAPI ? getProgressForTraining(currentTrainingFromAPI._id) : null;
    
    const progressMap = {};
    
    training.modules?.forEach((module, moduleIndex) => {
      module.lessons?.forEach((lesson, lessonIndex) => {
        const key = `${moduleIndex}-${lessonIndex}`;
        
        // Check if this lesson is completed in the current progress
        if (currentProgress) {
          const moduleProgress = currentProgress.modules_progress.find(
            m => m.module_title === module.title
          );
          if (moduleProgress && moduleProgress.lessons_completed) {
            progressMap[key] = moduleProgress.lessons_completed.includes(lesson);
          } else {
            progressMap[key] = false;
          }
        } else {
          progressMap[key] = false;
        }
      });
    });
    
    setLessonProgress(progressMap);
    setHasUnsavedChanges(false);
  };

  const roles = [
    {
      id: "admin",
      name: "Administrator",
      icon: Shield,
      color: "bg-purple-100 text-purple-800",
      description: "Complete system management and oversight",
    },
    {
      id: "doctor",
      name: "Doctor",
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-800",
      description: "Patient care and medical practice",
    },
    {
      id: "nurse",
      name: "Nurse",
      icon: Heart,
      color: "bg-red-100 text-red-800",
      description: "Patient care and support services",
    },
    {
      id: "receptionist",
      name: "Receptionist",
      icon: Users,
      color: "bg-green-100 text-green-800",
      description: "Front desk and appointment management",
    },
    {
      id: "accountant",
      name: "Accountant",
      icon: DollarSign,
      color: "bg-orange-100 text-orange-800",
      description: "Financial management and reporting",
    },
  ];

  // Handle lesson checkbox change
  const handleLessonToggle = (moduleIndex: number, lessonIndex: number, checked: boolean) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setLessonProgress(prev => ({
      ...prev,
      [key]: checked
    }));
    setHasUnsavedChanges(true);
  };

  // Save progress to backend
  const handleSaveProgress = async () => {
    if (!user || !currentTraining) {
      toast.error("Please log in to save progress");
      return;
    }

    try {
      const currentTrainingFromAPI = trainings.find(t => t.role === selectedRole);
      let currentProgress = currentTrainingFromAPI ? getProgressForTraining(currentTrainingFromAPI._id) : null;

      // If no progress exists, start training first
      if (!currentProgress && currentTrainingFromAPI) {
        await startTraining(currentTrainingFromAPI._id, selectedRole);
        // Refetch progress after starting
        await fetchUserProgress();
        currentProgress = getProgressForTraining(currentTrainingFromAPI._id);
      }

      if (!currentProgress) {
        toast.error("Failed to initialize training progress");
        return;
      }

      // Update each module's progress based on lesson completion
      const moduleUpdates = currentTraining.modules.map((module, moduleIndex) => {
        const completedLessons = module.lessons.filter((lesson, lessonIndex) => {
          const key = `${moduleIndex}-${lessonIndex}`;
          return lessonProgress[key];
        });

        const progressPercentage = Math.round((completedLessons.length / module.lessons.length) * 100);
        const isModuleCompleted = progressPercentage === 100;

        return {
          moduleIndex,
          moduleId: module._id || moduleIndex.toString(),
          completed: isModuleCompleted,
          lessonsCompleted: completedLessons,
          progressPercentage
        };
      });

      // Update each module
      for (const update of moduleUpdates) {
        await updateModuleProgress(
          currentProgress._id,
          update.moduleId,
          update.completed,
          update.lessonsCompleted,
          update.progressPercentage
        );
      }

      // Check if all modules are completed
      const allModulesCompleted = moduleUpdates.every(update => update.completed);
      if (allModulesCompleted && !currentProgress.is_completed) {
        await completeTraining(currentProgress._id);
      }

      setHasUnsavedChanges(false);
      toast.success("Progress saved successfully!");
      
      // Refresh progress data
      await fetchUserProgress();
    } catch (err: any) {
      toast.error(err.message || "Failed to save progress");
      console.error("Save progress error:", err);
    }
  };

  // Training action handlers
  const handleStartTraining = async (trainingId: string) => {
    if (!user) {
      toast.error("Please log in to start training");
      return;
    }

    try {
      await startTraining(trainingId, selectedRole);
      toast.success("Training started successfully!");
      await fetchUserProgress();
    } catch (err: any) {
      toast.error(err.message || "Failed to start training");
    }
  };

  const handleIssueCertificate = async (progressId: string) => {
    if (!user) return;

    try {
      const { certificate } = await issueCertificate(progressId);
      toast.success("Certificate issued successfully!");
      // You could download or display the certificate here
    } catch (err: any) {
      toast.error(err.message || "Failed to issue certificate");
    }
  };

  const trainingContent = {
    admin: {
      overview:
        "As an Administrator, you have complete access to all system features. Learn to manage users, configure settings, and oversee clinic operations.",
      modules: [
        {
          title: "Getting Started",
          duration: "15 mins",
          completed: true,
          lessons: [
            "Dashboard Overview",
            "Navigation Basics",
            "User Interface Elements",
            "Quick Actions",
          ],
        },
        {
          title: "User Management",
          duration: "25 mins",
          completed: false,
          lessons: [
            "Adding New Users",
            "Role Assignment",
            "Permission Management",
            "User Deactivation",
          ],
        },
        {
          title: "System Configuration",
          duration: "30 mins",
          completed: false,
          lessons: [
            "Clinic Settings",
            "Working Hours",
            "Payment Methods",
            "Notification Settings",
          ],
        },
        {
          title: "Analytics & Reports",
          duration: "20 mins",
          completed: false,
          lessons: [
            "Revenue Analysis",
            "Patient Analytics",
            "Performance Metrics",
            "Exporting Data",
          ],
        },
      ],
    },
    doctor: {
      overview:
        "Learn how to efficiently manage patients, appointments, and medical records using ClinicPro.",
      modules: [
        {
          title: "Patient Management",
          duration: "20 mins",
          completed: true,
          lessons: [
            "Patient Registration",
            "Medical History",
            "Document Upload",
            "Patient Search",
          ],
        },
        {
          title: "Appointment Scheduling",
          duration: "15 mins",
          completed: false,
          lessons: [
            "Creating Appointments",
            "Calendar Management",
            "Rescheduling",
            "Cancellations",
          ],
        },
        {
          title: "Prescriptions",
          duration: "18 mins",
          completed: false,
          lessons: [
            "Digital Prescriptions",
            "Medication Database",
            "Dosage Guidelines",
            "Prescription History",
          ],
        },
        {
          title: "Test Management",
          duration: "22 mins",
          completed: false,
          lessons: [
            "Ordering Tests",
            "Lab Integration",
            "Report Review",
            "Result Communication",
          ],
        },
      ],
    },
    nurse: {
      overview:
        "Master the essential features for patient care, inventory management, and clinical support.",
      modules: [
        {
          title: "Patient Care",
          duration: "18 mins",
          completed: true,
          lessons: [
            "Vital Signs Entry",
            "Care Plans",
            "Medication Administration",
            "Patient Communication",
          ],
        },
        {
          title: "Inventory Management",
          duration: "25 mins",
          completed: false,
          lessons: [
            "Stock Monitoring",
            "Supply Ordering",
            "Expiry Tracking",
            "Usage Recording",
          ],
        },
        {
          title: "Test Support",
          duration: "20 mins",
          completed: false,
          lessons: [
            "Sample Collection",
            "Lab Preparation",
            "Quality Control",
            "Report Distribution",
          ],
        },
      ],
    },
    receptionist: {
      overview:
        "Learn front desk operations, appointment management, and patient communication.",
      modules: [
        {
          title: "Front Desk Operations",
          duration: "20 mins",
          completed: true,
          lessons: [
            "Patient Check-in",
            "Insurance Verification",
            "Payment Processing",
            "Document Management",
          ],
        },
        {
          title: "Appointment Management",
          duration: "15 mins",
          completed: false,
          lessons: [
            "Booking Appointments",
            "Calendar Coordination",
            "Reminder Calls",
            "Waitlist Management",
          ],
        },
        {
          title: "Lead Management",
          duration: "18 mins",
          completed: false,
          lessons: [
            "Lead Capture",
            "Follow-up Scheduling",
            "Conversion Tracking",
            "Communication Templates",
          ],
        },
      ],
    },
    accountant: {
      overview:
        "Master financial management, billing, and reporting features of the system.",
      modules: [
        {
          title: "Billing & Invoicing",
          duration: "25 mins",
          completed: true,
          lessons: [
            "Invoice Creation",
            "Payment Recording",
            "Insurance Claims",
            "Billing Reports",
          ],
        },
        {
          title: "Financial Reports",
          duration: "20 mins",
          completed: false,
          lessons: [
            "Revenue Analysis",
            "Expense Tracking",
            "Profit Margins",
            "Tax Reporting",
          ],
        },
        {
          title: "Payroll Management",
          duration: "22 mins",
          completed: false,
          lessons: [
            "Staff Payments",
            "Salary Calculations",
            "Deductions",
            "Payroll Reports",
          ],
        },
      ],
    },
  };

  const currentRole = roles.find((role) => role.id === selectedRole);
  const currentContent = currentTraining || trainingContent[selectedRole as keyof typeof trainingContent];
  const currentTrainingFromAPI = trainings.find(t => t.role === selectedRole);
  const currentProgress = currentTrainingFromAPI ? getProgressForTraining(currentTrainingFromAPI._id) : null;

  const getCompletionPercentage = (modules: any[]) => {
    if (currentProgress) {
      return currentProgress.overall_progress;
    }
    
    // Calculate based on lesson completion
    if (modules && Object.keys(lessonProgress).length > 0) {
      let totalLessons = 0;
      let completedLessons = 0;
      
      modules.forEach((module, moduleIndex) => {
        module.lessons?.forEach((lesson, lessonIndex) => {
          totalLessons++;
          const key = `${moduleIndex}-${lessonIndex}`;
          if (lessonProgress[key]) {
            completedLessons++;
          }
        });
      });
      
      return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }
    
    return 0;
  };

  const getModuleCompletionPercentage = (module: any, moduleIndex: number) => {
    if (!module.lessons) return 0;
    
    let completedLessons = 0;
    module.lessons.forEach((lesson, lessonIndex) => {
      const key = `${moduleIndex}-${lessonIndex}`;
      if (lessonProgress[key]) {
        completedLessons++;
      }
    });
    
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Training Center
          </h1>
          <p className="text-gray-600 mt-1">
            Interactive training modules for all clinic staff roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
          {hasUnsavedChanges && (
            <Button 
              onClick={handleSaveProgress}
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 ring-2 ring-green-200 animate-pulse"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Progress"}
            </Button>
          )}
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Guide
          </Button>
          {currentProgress?.certificate_issued && (
            <Button 
              className="w-full sm:w-auto"
              onClick={() => currentProgress && handleIssueCertificate(currentProgress._id)}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">You have unsaved changes. Don't forget to save your progress!</span>
            </div>
            <Button 
              onClick={handleSaveProgress}
              disabled={loading}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Save className="h-4 w-4 mr-1" />
              {loading ? "Saving..." : "Save Now"}
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading training data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Your Role */}
      <Card>
        <CardHeader>
          <CardTitle>Your Role</CardTitle>
          <CardDescription>
            Training content customized for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show only the user's role */}
          {(() => {
            const currentUserRole = roles.find((role) => role.id === selectedRole);
            if (!currentUserRole) return null;
            
            const Icon = currentUserRole.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <Card className="ring-2 ring-blue-500 bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 rounded-lg mx-auto w-fit mb-4 ${currentUserRole.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{currentUserRole.name}</h3>
                    <p className="text-sm text-gray-600">
                      {currentUserRole.description}
                    </p>
                    <div className="mt-4 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-700 font-medium">Active Role</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Training Content */}
      {currentRole && (
        <motion.div
          key={selectedRole}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${currentRole.color}`}>
                  <currentRole.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{currentRole.name} Training</CardTitle>
                  <CardDescription>{currentContent.overview}</CardDescription>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-500">
                    {getCompletionPercentage(currentContent.modules)}%
                  </span>
                </div>
                <Progress
                  value={getCompletionPercentage(currentContent.modules)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Training Modules with Checkboxes */}
              <div className="space-y-6">
                {currentContent.modules?.map((module, moduleIndex) => {
                  const moduleProgress = getModuleCompletionPercentage(module, moduleIndex);
                  const isModuleCompleted = moduleProgress === 100;
                  
                  return (
                    <motion.div
                      key={moduleIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: moduleIndex * 0.1 }}
                    >
                      <Card className="border-2 border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${isModuleCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {isModuleCompleted ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : (
                                  <BookOpen className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {module.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {module.duration} • {module.lessons?.length || 0} lessons
                                </p>
                              </div>
                            </div>
                            <Badge 
                              className={isModuleCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {moduleProgress}% Complete
                            </Badge>
                          </div>

                          {/* Module Progress Bar */}
                          <div className="mb-4">
                            <Progress value={moduleProgress} className="h-2" />
                          </div>

                          {/* Lessons with Checkboxes */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Lessons ({module.lessons?.length || 0})
                            </h4>
                            {module.lessons?.map((lesson, lessonIndex) => {
                              const key = `${moduleIndex}-${lessonIndex}`;
                              const isCompleted = lessonProgress[key] || false;
                              
                              return (
                                <div
                                  key={lessonIndex}
                                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <Checkbox
                                    id={key}
                                    checked={isCompleted}
                                    onCheckedChange={(checked) => 
                                      handleLessonToggle(moduleIndex, lessonIndex, checked as boolean)
                                    }
                                    className="shrink-0"
                                  />
                                  <label
                                    htmlFor={key}
                                    className={`text-sm flex-1 cursor-pointer ${
                                      isCompleted 
                                        ? 'line-through text-gray-500' 
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    {lesson}
                                  </label>
                                  {isCompleted && (
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Module Description */}
                          {module.description && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-700">
                                <Lightbulb className="h-4 w-4 inline mr-1" />
                                {module.description}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Start Training Button for New Users */}
              {!currentProgress && currentTrainingFromAPI && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => handleStartTraining(currentTrainingFromAPI._id)}
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {loading ? "Starting..." : "Start Training Program"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            Helpful documents and materials for using ClinicPro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">User Manual</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Comprehensive guide for all features
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-3 w-3 mr-1" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Video className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Video Tutorials</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Step-by-step video instructions
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Play className="h-3 w-3 mr-1" />
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Lightbulb className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Tips and recommendations
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Read Tips
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Save Button - Always visible when there are unsaved changes */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={handleSaveProgress}
            disabled={loading}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg ring-4 ring-green-200 animate-bounce hover:animate-none transition-all duration-300"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? "Saving..." : "Save Progress"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Training;
