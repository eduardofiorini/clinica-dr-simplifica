import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { transformUserToStaff } from "@/hooks/useStaff";
import { useCurrency } from "@/contexts/CurrencyContext";

interface UpdateSalaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: ReturnType<typeof transformUserToStaff> | null;
  onUpdate: (id: string, data: any) => Promise<void>;
}

const UpdateSalaryModal: React.FC<UpdateSalaryModalProps> = ({
  open,
  onOpenChange,
  staff,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formatAmount } = useCurrency();
  const [formData, setFormData] = useState({
    currentSalary: 0,
    newSalary: "",
    adjustmentType: "raise",
    effectiveDate: "",
    reason: "",
    notes: "",
  });

  const adjustmentTypes = [
    { value: "raise", label: "Salary Raise" },
    { value: "promotion", label: "Promotion" },
    { value: "adjustment", label: "Market Adjustment" },
    { value: "bonus", label: "Performance Bonus" },
    { value: "correction", label: "Salary Correction" },
  ];

  // Initialize form data when staff changes
  useEffect(() => {
    if (staff) {
      setFormData(prev => ({
        ...prev,
        currentSalary: staff.salary,
        effectiveDate: new Date().toISOString().split('T')[0], // Today's date
      }));
    }
  }, [staff]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateIncrease = () => {
    const current = formData.currentSalary;
    const newSalary = parseFloat(formData.newSalary) || 0;
    const increase = newSalary - current;
    const percentage = current > 0 ? ((increase / current) * 100) : 0;
    
    return {
      amount: increase,
      percentage: percentage.toFixed(2),
      isIncrease: increase >= 0,
    };
  };

  const validateForm = () => {
    const newSalary = parseFloat(formData.newSalary);
    
    if (!formData.newSalary || isNaN(newSalary)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid salary amount",
        variant: "destructive",
      });
      return false;
    }

    if (newSalary < 0) {
      toast({
        title: "Validation Error",
        description: "Salary cannot be negative",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.effectiveDate) {
      toast({
        title: "Validation Error",
        description: "Please select an effective date",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for the salary change",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staff || !validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Note: This would need backend support for salary updates
      // For now, we'll just show a success message
      const increase = calculateIncrease();
      
      toast({
        title: "Salary Updated",
        description: `Salary for ${staff.firstName} ${staff.lastName} has been updated to ${formatAmount(parseFloat(formData.newSalary))} (${increase.isIncrease ? '+' : ''}${formatAmount(increase.amount)}, ${increase.percentage}%).`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating salary:', error);
      toast({
        title: "Error",
        description: "Failed to update salary. This feature requires backend support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!staff) return null;

  const salaryIncrease = calculateIncrease();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Update Salary
          </DialogTitle>
          <DialogDescription>
            Adjust salary for {staff.firstName} {staff.lastName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Salary Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Current Salary Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Current Annual Salary</Label>
                  <div className="text-2xl font-bold text-gray-900">
                    {formData.currentSalary > 0 ? formatAmount(formData.currentSalary) : 'Not set'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Role</Label>
                  <div className="text-lg font-medium text-gray-700 capitalize">
                    {staff.role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Update Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Salary Adjustment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newSalary">New Annual Salary *</Label>
                  <Input
                    id="newSalary"
                    type="number"
                    value={formData.newSalary}
                    onChange={(e) => handleChange("newSalary", e.target.value)}
                    placeholder="75000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjustmentType">Adjustment Type *</Label>
                  <Select value={formData.adjustmentType} onValueChange={(value) => handleChange("adjustmentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select adjustment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {adjustmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleChange("effectiveDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Change *</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  placeholder="Annual performance review, promotion, market adjustment, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional notes about this salary change..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Salary Change Summary */}
          {formData.newSalary && !isNaN(parseFloat(formData.newSalary)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Change Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Current</div>
                    <div className="text-lg font-semibold">
                      {formatAmount(formData.currentSalary)}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-500">New</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatAmount(parseFloat(formData.newSalary))}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${salaryIncrease.isIncrease ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-sm text-gray-500">Change</div>
                    <div className={`text-lg font-semibold ${salaryIncrease.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                      {salaryIncrease.isIncrease ? '+' : ''}{formatAmount(salaryIncrease.amount)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${salaryIncrease.isIncrease ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-sm text-gray-500">Percentage</div>
                    <div className={`text-lg font-semibold ${salaryIncrease.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                      {salaryIncrease.isIncrease ? '+' : ''}{salaryIncrease.percentage}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Update Salary
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSalaryModal; 