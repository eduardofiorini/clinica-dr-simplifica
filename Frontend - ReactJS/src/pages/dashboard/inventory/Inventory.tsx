import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Medicine } from "@/types";
import AddItemModal from "@/components/modals/AddItemModal";
import ViewDetailsModal from "@/components/modals/ViewDetailsModal";
import EditItemModal from "@/components/modals/EditItemModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import AdvancedFiltersModal from "@/components/modals/AdvancedFiltersModal";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { apiService, type InventoryItem } from "@/services/api";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>(
    {},
  );
  const { formatAmount } = useCurrency();

  // API state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<{
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiredItems: number;
    totalValue: number;
    categoryStats: Array<{
      _id: string;
      count: number;
      totalValue: number;
    }>;
  } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  // Modal states
  const [viewDetailsModal, setViewDetailsModal] = useState<{
    open: boolean;
    item: Medicine | null;
  }>({ open: false, item: null });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    item: Medicine | null;
  }>({ open: false, item: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: Medicine | null;
  }>({ open: false, item: null });

  // Transform backend inventory data to frontend Medicine interface
  const transformInventoryItem = (item: InventoryItem): Medicine => ({
    id: item._id,
    name: item.name,
    category: item.category,
    manufacturer: 'Unknown', // Backend doesn't have this field
    batchNumber: item.sku, // Use SKU as batch number
    expiryDate: item.expiry_date ? new Date(item.expiry_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    quantity: item.current_stock,
    unitPrice: item.unit_price,
    supplier: item.supplier,
    description: '', // Backend doesn't have this field
    lowStockAlert: item.minimum_stock,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  });

  // Load inventory from API
  const fetchInventory = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const filters = {
        search: searchTerm || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        page: pagination.page,
        limit: pagination.limit,
        ...advancedFilters,
      };

      const [inventoryResponse, statsResponse] = await Promise.all([
        apiService.getInventory(filters),
        apiService.getInventoryStats()
      ]);

      // Transform backend data to frontend format
      const transformedItems = inventoryResponse.data.items.map(transformInventoryItem);
      setMedicines(transformedItems);
      setPagination(inventoryResponse.data.pagination);
      setStats(statsResponse);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchInventory();
  }, [searchTerm, selectedCategory, advancedFilters, pagination.page]);

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchInventory();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Get available categories from API data
  const categories = [
    "all",
    ...Array.from(new Set(medicines.map((m) => m.category))),
  ];

  const getStockLevel = (quantity: number, lowStockAlert: number) => {
    const percentage = (quantity / (lowStockAlert * 2)) * 100;
    return Math.min(percentage, 100);
  };

  const getStockStatus = (quantity: number, lowStockAlert: number) => {
    if (quantity === 0)
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-800",
        urgency: "critical",
      };
    if (quantity <= lowStockAlert / 2)
      return {
        label: "Critical",
        color: "bg-red-100 text-red-800",
        urgency: "critical",
      };
    if (quantity <= lowStockAlert)
      return {
        label: "Low Stock",
        color: "bg-orange-100 text-orange-800",
        urgency: "warning",
      };
    return {
      label: "In Stock",
      color: "bg-green-100 text-green-800",
      urgency: "good",
    };
  };

  const isExpiringSoon = (expiryDate: Date) => {
    const today = new Date();
    const monthsUntilExpiry =
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilExpiry <= 6;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Using the currency context for dynamic currency formatting
  const formatCurrency = (amount: number) => {
    return formatAmount(amount);
  };

  // Action handlers
  const handleViewDetails = (item: Medicine) => {
    setViewDetailsModal({ open: true, item });
  };

  const handleEdit = (item: Medicine) => {
    setEditModal({ open: true, item });
  };

  const handleDelete = (item: Medicine) => {
    setDeleteModal({ open: true, item });
  };

  const handleSaveEdit = async (updatedData: Record<string, any>) => {
    try {
      if (!editModal.item) return;

      // Transform data to match backend format
      const updateData = {
        name: updatedData.name,
        category: updatedData.category,
        current_stock: parseInt(updatedData.quantity),
        minimum_stock: parseInt(updatedData.lowStockAlert),
        unit_price: parseFloat(updatedData.unitPrice),
        supplier: updatedData.supplier,
        expiry_date: updatedData.expiryDate ? new Date(updatedData.expiryDate).toISOString() : undefined,
        manufacturer: updatedData.manufacturer,
        batchNumber: updatedData.batchNumber,
        description: updatedData.description,
      };

      await apiService.updateInventoryItem(editModal.item.id, updateData);
      
      toast({
        title: "Item updated",
        description: `${updatedData.name} has been updated successfully.`,
      });

      setEditModal({ open: false, item: null });
      fetchInventory(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!deleteModal.item) return;

      await apiService.deleteInventoryItem(deleteModal.item.id);
      
      toast({
        title: "Item deleted",
        description: `${deleteModal.item.name} has been deleted successfully.`,
      });

      setDeleteModal({ open: false, item: null });
      fetchInventory(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddStock = async (item: Medicine) => {
    try {
      // For demo, add 10 units
      await apiService.updateInventoryStock(item.id, { quantity: 10, operation: 'add' });
      
      toast({
        title: "Stock Added",
        description: `Added 10 units to ${item.name}`,
      });

      fetchInventory(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStock = async (item: Medicine) => {
    try {
      // For demo, remove 5 units
      await apiService.updateInventoryStock(item.id, { quantity: 5, operation: 'subtract' });
      
      toast({
        title: "Stock Removed",
        description: `Removed 5 units from ${item.name}`,
      });

      fetchInventory(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExpiry = (item: Medicine) => {
    // This would open a date picker modal in a real implementation
    toast({
      title: "Update Expiry",
      description: `Opening expiry date editor for ${item.name}`,
    });
  };

  // Filter handlers
  const handleApplyAdvancedFilters = (filters: Record<string, any>) => {
    setAdvancedFilters(filters);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({});
  };

  const handleRefresh = () => {
    fetchInventory(true);
  };

  // Filter configuration
  const filterFields = [
    {
      key: "manufacturer",
      label: "Manufacturer",
      type: "select" as const,
      options: Array.from(new Set(medicines.map((m) => m.manufacturer))),
    },
    {
      key: "supplier",
      label: "Supplier",
      type: "select" as const,
      options: Array.from(new Set(medicines.map((m) => m.supplier))),
    },
    {
      key: "minQuantity",
      label: "Minimum Quantity",
      type: "number" as const,
      placeholder: "Enter minimum quantity",
    },
    {
      key: "maxQuantity",
      label: "Maximum Quantity",
      type: "number" as const,
      placeholder: "Enter maximum quantity",
    },
    {
      key: "status",
      label: "Stock Status",
      type: "checkbox" as const,
      options: ["In Stock", "Low Stock", "Out of Stock"],
    },
  ];

  // Calculate stats from API or fallback
  const totalItems = stats?.totalItems || medicines.length;
  const lowStockItems = stats?.lowStockItems || medicines.filter(
    (m) => m.quantity <= m.lowStockAlert,
  ).length;
  const outOfStockItems = stats?.outOfStockItems || medicines.filter((m) => m.quantity === 0).length;
  const totalValue = stats?.totalValue || medicines.reduce(
    (sum, m) => sum + m.quantity * m.unitPrice,
    0,
  );

  // Loading state
  if (isLoading && medicines.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading inventory...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track medical supplies and medication stock
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddItemModal onSuccess={() => fetchInventory(true)} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalItems}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {lowStockItems}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Out of Stock
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {outOfStockItems}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Value
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    <CurrencyDisplay amount={totalValue} variant="large" />
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0 sm:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, manufacturer, or batch number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <AdvancedFiltersModal
                filterFields={filterFields}
                onApplyFilters={handleApplyAdvancedFilters}
                onClearFilters={handleClearAdvancedFilters}
                initialFilters={advancedFilters}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Medicine & Supplies Inventory</CardTitle>
            <CardDescription>
              Monitor stock levels, expiry dates, and inventory values
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">
                      Item Details
                    </TableHead>
                    <TableHead className="min-w-[120px]">Category</TableHead>
                    <TableHead className="min-w-[140px]">Stock Level</TableHead>
                    <TableHead className="min-w-[120px]">Unit Price</TableHead>
                    <TableHead className="min-w-[130px]">Total Value</TableHead>
                    <TableHead className="min-w-[130px]">Expiry Date</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((medicine) => {
                    const stockStatus = getStockStatus(
                      medicine.quantity,
                      medicine.lowStockAlert,
                    );
                    const stockLevel = getStockLevel(
                      medicine.quantity,
                      medicine.lowStockAlert,
                    );
                    const isExpiring = isExpiringSoon(medicine.expiryDate);

                    return (
                      <TableRow key={medicine.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{medicine.name}</div>
                            <div className="text-sm text-gray-500">
                              {medicine.manufacturer} • Batch:{" "}
                              {medicine.batchNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{medicine.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{medicine.quantity} units</span>
                              <span className="text-gray-500">
                                Min: {medicine.lowStockAlert}
                              </span>
                            </div>
                            <Progress value={stockLevel} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(medicine.unitPrice)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(
                              medicine.quantity * medicine.unitPrice,
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={isExpiring ? "text-orange-600" : ""}>
                            {formatDate(medicine.expiryDate)}
                            {isExpiring && (
                              <div className="text-xs text-orange-600">
                                Expiring Soon
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${stockStatus.color}`}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8">
                                <MoreVertical className="h-4 w-4 mr-1" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(medicine)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(medicine)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAddStock(medicine)}
                              >
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Add Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRemoveStock(medicine)}
                              >
                                <TrendingDown className="mr-2 h-4 w-4" />
                                Remove Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateExpiry(medicine)}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Update Expiry
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(medicine)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {medicines.map((medicine) => {
                const stockStatus = getStockStatus(
                  medicine.quantity,
                  medicine.lowStockAlert,
                );
                const stockLevel = getStockLevel(
                  medicine.quantity,
                  medicine.lowStockAlert,
                );

                return (
                  <div
                    key={medicine.id}
                    className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                  >
                    {/* Header with Item and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">
                          {medicine.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {medicine.manufacturer}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <Badge className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Stock Level Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Stock Level</span>
                        <span className="font-medium">
                          {medicine.quantity} units
                        </span>
                      </div>
                      <Progress value={stockLevel} className="h-2" />
                      <div className="text-xs text-gray-500">
                        Low stock alert: {medicine.lowStockAlert} units
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Category
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {medicine.category}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Unit Price
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(medicine.unitPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Total Value
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(
                            medicine.quantity * medicine.unitPrice,
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Expiry Date
                        </div>
                        <div className="text-sm">
                          {medicine.expiryDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        Batch: {medicine.batchNumber}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4 mr-1" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(medicine)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(medicine)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddStock(medicine)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(medicine)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {medicines.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No inventory items found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first inventory item.
                </p>
                <AddItemModal onSuccess={() => fetchInventory(true)} />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Details Modal */}
      <ViewDetailsModal
        open={viewDetailsModal.open}
        onOpenChange={(open) => setViewDetailsModal({ open, item: null })}
        title={`Medicine Details - ${viewDetailsModal.item?.name || ""}`}
        data={viewDetailsModal.item || {}}
        fields={[
          { key: "name", label: "Name" },
          { key: "category", label: "Category", type: "badge" },
          { key: "manufacturer", label: "Manufacturer" },
          { key: "batchNumber", label: "Batch Number" },
          { key: "quantity", label: "Quantity" },
          { key: "unitPrice", label: "Unit Price", type: "currency" },
          { key: "expiryDate", label: "Expiry Date", type: "date" },
          { key: "supplier", label: "Supplier" },
          { key: "description", label: "Description" },
          { key: "lowStockAlert", label: "Low Stock Alert" },
        ]}
      />

      {/* Edit Modal */}
      <EditItemModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ open, item: null })}
        title={`Edit Medicine - ${editModal.item?.name || ""}`}
        data={editModal.item || {}}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          {
            key: "category",
            label: "Category",
            type: "select",
            required: true,
            options: categories
              .filter((c) => c !== "all")
              .map((c) => ({ value: c, label: c })),
          },
          {
            key: "manufacturer",
            label: "Manufacturer",
            type: "text",
            required: true,
          },
          { key: "batchNumber", label: "Batch Number", type: "text" },
          {
            key: "quantity",
            label: "Quantity",
            type: "number",
            required: true,
          },
          {
            key: "unitPrice",
            label: "Unit Price",
            type: "number",
            required: true,
          },
          { key: "expiryDate", label: "Expiry Date", type: "date" },
          { key: "supplier", label: "Supplier", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "lowStockAlert", label: "Low Stock Alert", type: "number" },
        ]}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, item: null })}
        title="Delete Medicine"
        description="Are you sure you want to delete this medicine from the inventory?"
        itemName={deleteModal.item?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Inventory;
