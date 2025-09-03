import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Building,
  Clock,
  DollarSign,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RotateCcw,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CurrencySelector } from "@/components/ui/CurrencySelector";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clinicSettings, setClinicSettings] = useState({
    // Clinic Information
    name: "ClinicPro Medical Center",
    address: "123 Medical Drive, Healthcare City, HC 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@clinicpro.com",
    website: "www.clinicpro.com",
    taxId: "12-3456789",
    license: "MC-2024-001",

    // Working Hours
    workingHours: {
      monday: { isOpen: true, start: "08:00", end: "18:00" },
      tuesday: { isOpen: true, start: "08:00", end: "18:00" },
      wednesday: { isOpen: true, start: "08:00", end: "18:00" },
      thursday: { isOpen: true, start: "08:00", end: "18:00" },
      friday: { isOpen: true, start: "08:00", end: "17:00" },
      saturday: { isOpen: true, start: "09:00", end: "14:00" },
      sunday: { isOpen: false, start: "00:00", end: "00:00" },
    },

    // Financial Settings
    currency: "USD",
    taxRate: 8.5,
    defaultPaymentTerms: 30,
    lateFeePercentage: 1.5,
    acceptedPaymentMethods: {
      cash: true,
      creditCard: true,
      debitCard: true,
      bankTransfer: true,
      insurance: true,
      check: false,
    },

    // Notification Settings
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      paymentReminders: true,
      lowStockAlerts: true,
      systemAlerts: true,
      marketingEmails: false,
    },

    // Security Settings
    security: {
      passwordExpiry: 90,
      sessionTimeout: 30,
      twoFactorAuth: false,
      dataBackupFrequency: "daily",
      auditLogging: true,
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your clinic settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            System Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure clinic settings, preferences, and system parameters
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      {/* Settings Tabs */}
      <Tabs defaultValue="clinic" className="space-y-4">
        {/* Tab Navigation - Responsive */}
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 min-w-max">
            <TabsTrigger value="clinic" className="whitespace-nowrap">
              <Building className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Clinic Info</span>
              <span className="sm:hidden">Clinic</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="whitespace-nowrap">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Working Hours</span>
              <span className="sm:hidden">Hours</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="whitespace-nowrap">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Financial</span>
              <span className="sm:hidden">Finance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="whitespace-nowrap">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notify</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="whitespace-nowrap">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="whitespace-nowrap">
              <Database className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Backup & Data</span>
              <span className="sm:hidden">Backup</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Clinic Information */}
        <TabsContent value="clinic">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Basic information about your medical practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    value={clinicSettings.name}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clinicSettings.email}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={clinicSettings.phone}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={clinicSettings.website}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={clinicSettings.address}
                  onChange={(e) =>
                    setClinicSettings({
                      ...clinicSettings,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={clinicSettings.taxId}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        taxId: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Medical License</Label>
                  <Input
                    id="license"
                    value={clinicSettings.license}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        license: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Set your clinic's operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(clinicSettings.workingHours).map(
                  ([day, hours]) => (
                    <div
                      key={day}
                      className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-[120px]">
                        <Switch
                          checked={hours.isOpen}
                          onCheckedChange={(checked) => {
                            setClinicSettings({
                              ...clinicSettings,
                              workingHours: {
                                ...clinicSettings.workingHours,
                                [day]: { ...hours, isOpen: checked },
                              },
                            });
                          }}
                        />
                        <Label className="capitalize font-medium">{day}</Label>
                      </div>

                      {hours.isOpen ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm whitespace-nowrap">
                              From:
                            </Label>
                            <Input
                              type="time"
                              value={hours.start}
                              className="w-32"
                              onChange={(e) => {
                                setClinicSettings({
                                  ...clinicSettings,
                                  workingHours: {
                                    ...clinicSettings.workingHours,
                                    [day]: { ...hours, start: e.target.value },
                                  },
                                });
                              }}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm whitespace-nowrap">
                              To:
                            </Label>
                            <Input
                              type="time"
                              value={hours.end}
                              className="w-32"
                              onChange={(e) => {
                                setClinicSettings({
                                  ...clinicSettings,
                                  workingHours: {
                                    ...clinicSettings.workingHours,
                                    [day]: { ...hours, end: e.target.value },
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-sm text-gray-500">
                          Closed
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Settings */}
        <TabsContent value="financial">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Configuration</CardTitle>
                <CardDescription>
                  Configure currency, tax rates, and payment settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <CurrencySelector />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      value={clinicSettings.taxRate}
                      onChange={(e) =>
                        setClinicSettings({
                          ...clinicSettings,
                          taxRate: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">
                      Default Payment Terms (days)
                    </Label>
                    <Input
                      id="paymentTerms"
                      type="number"
                      value={clinicSettings.defaultPaymentTerms}
                      onChange={(e) =>
                        setClinicSettings({
                          ...clinicSettings,
                          defaultPaymentTerms: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lateFee">Late Fee Percentage (%)</Label>
                    <Input
                      id="lateFee"
                      type="number"
                      step="0.01"
                      value={clinicSettings.lateFeePercentage}
                      onChange={(e) =>
                        setClinicSettings({
                          ...clinicSettings,
                          lateFeePercentage: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accepted Payment Methods</CardTitle>
                <CardDescription>
                  Choose which payment methods your clinic accepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(clinicSettings.acceptedPaymentMethods).map(
                    ([method, accepted]) => (
                      <div
                        key={method}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <Switch
                          checked={accepted}
                          onCheckedChange={(checked) => {
                            setClinicSettings({
                              ...clinicSettings,
                              acceptedPaymentMethods: {
                                ...clinicSettings.acceptedPaymentMethods,
                                [method]: checked,
                              },
                            });
                          }}
                        />
                        <Label className="capitalize">
                          {method.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(clinicSettings.notifications).map(
                  ([key, enabled]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <Label className="text-base font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {key === "emailNotifications" &&
                            "Receive email notifications for important events"}
                          {key === "smsNotifications" &&
                            "Get SMS alerts for urgent matters"}
                          {key === "appointmentReminders" &&
                            "Send automatic appointment reminders"}
                          {key === "paymentReminders" &&
                            "Remind patients about overdue payments"}
                          {key === "lowStockAlerts" &&
                            "Alert when inventory items are running low"}
                          {key === "systemAlerts" &&
                            "System maintenance and update notifications"}
                          {key === "marketingEmails" &&
                            "Promotional and marketing communications"}
                        </p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          setClinicSettings({
                            ...clinicSettings,
                            notifications: {
                              ...clinicSettings.notifications,
                              [key]: checked,
                            },
                          });
                        }}
                      />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={clinicSettings.security.passwordExpiry}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        security: {
                          ...clinicSettings.security,
                          passwordExpiry: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={clinicSettings.security.sessionTimeout}
                    onChange={(e) =>
                      setClinicSettings({
                        ...clinicSettings,
                        security: {
                          ...clinicSettings.security,
                          sessionTimeout: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to user accounts
                    </p>
                  </div>
                  <Switch
                    checked={clinicSettings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setClinicSettings({
                        ...clinicSettings,
                        security: {
                          ...clinicSettings.security,
                          twoFactorAuth: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">
                      Audit Logging
                    </Label>
                    <p className="text-sm text-gray-500">
                      Keep detailed logs of all system activities
                    </p>
                  </div>
                  <Switch
                    checked={clinicSettings.security.auditLogging}
                    onCheckedChange={(checked) =>
                      setClinicSettings({
                        ...clinicSettings,
                        security: {
                          ...clinicSettings.security,
                          auditLogging: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Data */}
        <TabsContent value="backup">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Backup</CardTitle>
                <CardDescription>
                  Configure automatic backups and data retention policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={clinicSettings.security.dataBackupFrequency}
                    onValueChange={(value) =>
                      setClinicSettings({
                        ...clinicSettings,
                        security: {
                          ...clinicSettings.security,
                          dataBackupFrequency: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Export your clinic data for reporting or migration purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Patient Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Financial Records
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Staff Information
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Appointments
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Complete Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
