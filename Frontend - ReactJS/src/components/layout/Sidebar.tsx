import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Home,
  Users,
  Calendar,
  UserPlus,
  DollarSign,
  Package,
  UserCheck,
  Receipt,
  Stethoscope,
  CalendarDays,
  BarChart3,
  Settings,
  X,
  Shield,
  CreditCard,
  FileText,
  Briefcase,
  TestTube2,
  Building,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplets,
  Folder,
  Activity,
  Building2,
  Brain,
  Zap,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
  permission?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, hasRole, hasPermission } = useAuth();
  const [isTestModulesOpen, setIsTestModulesOpen] = useState(false);

  // Role-based navigation configuration
  const navigationSections: NavigationSection[] = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: Home,
          roles: ["admin", "doctor", "receptionist", "nurse", "accountant"],
        },
        {
          name: "AI X-ray Analysis",
          href: "/dashboard/xray-analysis",
          icon: Brain,
          badge: "AI",
          roles: ["admin", "doctor", "nurse"],
        },
      ],
    },
    {
      title: "Patient Management",
      items: [
        {
          name: "Patients",
          href: "/dashboard/patients",
          icon: Users,
          roles: ["admin", "doctor", "receptionist", "nurse"],
        },
        {
          name: "Appointments",
          href: "/dashboard/appointments",
          icon: Calendar,
          roles: ["admin", "doctor", "receptionist"],
        },
        {
          name: "Leads",
          href: "/dashboard/leads",
          icon: UserPlus,
          roles: ["admin", "receptionist"],
        },
        {
          name: "Prescriptions",
          href: "/dashboard/prescriptions",
          icon: Stethoscope,
          roles: ["admin", "doctor"],
        },
        {
          name: "Odontogram",
          href: "/dashboard/odontograms",
          icon: Zap,
          badge: "Dental",
          roles: ["admin", "doctor"],
        },
        {
          name: "Test Reports",
          href: "/dashboard/test-reports",
          icon: FileText,
          roles: ["admin", "doctor", "nurse"],
        },
      ],
    },
    {
      title: "Financial Management",
      items: [
        {
          name: "Billing",
          href: "/dashboard/billing",
          icon: DollarSign,
          roles: ["admin", "accountant", "receptionist"],
        },
        {
          name: "Invoices",
          href: "/dashboard/invoices",
          icon: Receipt,
          roles: ["admin", "accountant"],
        },
        {
          name: "Payments",
          href: "/dashboard/payments",
          icon: CreditCard,
          roles: ["admin", "accountant"],
        },
        {
          name: "Payroll",
          href: "/dashboard/payroll",
          icon: Briefcase,
          roles: ["admin", "accountant"],
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          name: "Services",
          href: "/dashboard/services",
          icon: Activity,
          roles: ["admin", "doctor"],
        },
        {
          name: "Departments",
          href: "/dashboard/departments",
          icon: Building2,
          roles: ["admin"],
        },
        {
          name: "Clinics",
          href: "/dashboard/clinics",
          icon: Building2,
          roles: ["admin"],
        },
        {
          name: "Inventory",
          href: "/dashboard/inventory",
          icon: Package,
          roles: ["admin", "nurse"],
        },
        {
          name: "Staff",
          href: "/dashboard/staff",
          icon: UserCheck,
          roles: ["admin"],
        },
        {
          name: "Lab Vendors",
          href: "/dashboard/lab-vendors",
          icon: Building,
          roles: ["admin", "accountant"],
        },
      ],
    },
    {
      title: "Analytics & Reports",
      items: [
        {
          name: "Calendar",
          href: "/dashboard/calendar",
          icon: CalendarDays,
          roles: ["admin", "doctor", "receptionist"],
        },
        {
          name: "Reports",
          href: "/dashboard/reports",
          icon: BarChart3,
          roles: ["admin", "accountant"],
        },
      ],
    },

  ];

  // Role-specific navigation for different user types
  const getRoleSpecificSections = (): NavigationSection[] => {
    if (!user) return [];

    switch (user.role) {
      case "doctor":
        return [
          {
            title: "My Dashboard",
            items: [
              { name: "Dashboard", href: "/dashboard", icon: Home },
              {
                name: "AI X-ray Analysis",
                href: "/dashboard/xray-analysis",
                icon: Brain,
                badge: "AI",
              },
              { name: "My Patients", href: "/dashboard/patients", icon: Users },
              {
                name: "Appointments",
                href: "/dashboard/appointments",
                icon: Calendar,
              },
              {
                name: "Prescriptions",
                href: "/dashboard/prescriptions",
                icon: Stethoscope,
              },
              {
                name: "Odontogram",
                href: "/dashboard/odontograms",
                icon: Zap,
                badge: "Dental",
              },
            ],
          },
        ];

      case "receptionist":
        return [
          {
            title: "Reception",
            items: [
              { name: "Dashboard", href: "/dashboard", icon: Home },
              { name: "Leads", href: "/dashboard/leads", icon: UserPlus },
              {
                name: "Appointments",
                href: "/dashboard/appointments",
                icon: Calendar,
              },
              {
                name: "Patient Intake",
                href: "/dashboard/patients",
                icon: Users,
              },
              {
                name: "Basic Billing",
                href: "/dashboard/billing",
                icon: DollarSign,
              },
            ],
          },
        ];

      case "nurse":
        return [
          {
            title: "Nursing",
            items: [
              { name: "Dashboard", href: "/dashboard", icon: Home },
              {
                name: "AI X-ray Analysis",
                href: "/dashboard/xray-analysis",
                icon: Brain,
                badge: "AI",
              },
              {
                name: "Assigned Patients",
                href: "/dashboard/patients",
                icon: Users,
              },
              {
                name: "Inventory",
                href: "/dashboard/inventory",
                icon: Package,
              },
            ],
          },
        ];

      case "accountant":
        return [
          {
            title: "Finance",
            items: [
              { name: "Dashboard", href: "/dashboard", icon: Home },
              { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
              {
                name: "Payments",
                href: "/dashboard/payments",
                icon: CreditCard,
              },
              { name: "Payroll", href: "/dashboard/payroll", icon: Briefcase },
              {
                name: "Revenue Reports",
                href: "/dashboard/reports",
                icon: BarChart3,
              },
            ],
          },
        ];

      default:
        return navigationSections;
    }
  };

  const sectionsToShow =
    user?.role === "admin" ? navigationSections : getRoleSpecificSections();

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const canAccessItem = (item: NavigationItem) => {
    if (item.roles && !hasRole(item.roles)) return false;
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 max-w-[16rem] bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-x-hidden dashboard-sidebar",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ClinicPro</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4 h-[calc(100vh-80px)]">
          <div className="space-y-6 pb-8">
            {/* User info */}
            <div className="px-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Role indicator for admins */}
            {user?.role === "admin" && (
              <div className="px-3">
                <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">
                    Full Access
                  </span>
                </div>
              </div>
            )}

            {/* Navigation */}
            {sectionsToShow.map((section, sectionIndex) => (
              <div key={section.title}>
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {section.items.filter(canAccessItem).map((item) => {
                    const isActive = isActiveLink(item.href);

                    // Special handling for Test Reports with dropdown
                    if (
                      item.name === "Test Reports" &&
                      section.title === "Patient Management"
                    ) {
                      return (
                        <div key={item.name}>
                          <button
                            onClick={() =>
                              setIsTestModulesOpen(!isTestModulesOpen)
                            }
                            className={cn(
                              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                              isActive ||
                                location.pathname.includes("/test-modules/")
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                            )}
                          >
                            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span className="flex-1 text-left">{item.name}</span>
                            {isTestModulesOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>

                          {/* Test Reports submenu */}
                          {isTestModulesOpen && (
                            <div className="ml-6 mt-1 space-y-1">
                              <Link
                                to="/dashboard/tests"
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  location.pathname === "/dashboard/tests"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                <TestTube2 className="h-5 w-5 mr-3 flex-shrink-0" />
                                Tests
                              </Link>

                              <Link
                                to="/dashboard/test-reports"
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  location.pathname ===
                                    "/dashboard/test-reports"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                <FileText className="h-5 w-5 mr-3 flex-shrink-0" />
                                Test Reports
                              </Link>

                              <Link
                                to="/dashboard/test-modules/methodology"
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  location.pathname ===
                                    "/dashboard/test-modules/methodology"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                <Settings className="h-5 w-5 mr-3 flex-shrink-0" />
                                Methodology
                              </Link>

                              <Link
                                to="/dashboard/test-modules/turnaround-time"
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  location.pathname ===
                                    "/dashboard/test-modules/turnaround-time"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
                                Turnaround Time
                              </Link>

                              <Link
                                to="/dashboard/test-modules/sample-type"
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  location.pathname ===
                                    "/dashboard/test-modules/sample-type"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                <Droplets className="h-5 w-5 mr-3 flex-shrink-0" />
                                Sample Type
                              </Link>

                              <Link
                                to="/dashboard/test-modules/category"
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  location.pathname ===
                                    "/dashboard/test-modules/category"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                <Folder className="h-5 w-5 mr-3 flex-shrink-0" />
                                Category
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Regular navigation items
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
                {sectionIndex < sectionsToShow.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;
