import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, type XrayAnalysis as XrayAnalysisType, type XrayAnalysisStats, type Patient } from "@/services/api";
import {
  Upload,
  Brain,
  FileImage,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Zap,
  FileText,
  Camera
} from "lucide-react";



const XrayAnalysis: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyses, setAnalyses] = useState<XrayAnalysisType[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<XrayAnalysisStats | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<XrayAnalysisType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [viewModalAnalysis, setViewModalAnalysis] = useState<XrayAnalysisType | null>(null);

  // File upload handler
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, JPG, or PNG image.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  }, [toast]);

  // Drag and drop handlers
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as any;
      handleFileSelect(fakeEvent);
    }
  }, [handleFileSelect]);

  // Test X-ray Analysis API health
  const handleHealthCheck = async () => {
    try {
      const health = await apiService.checkXrayAnalysisHealth();
      toast({
        title: "Health Check Results",
        description: `API Status: ${health.message}. Gemini API Key: ${health.geminiApiKeyConfigured ? 'Configured' : 'Not Configured'}`,
        variant: health.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Health check error:', error);
      toast({
        title: "Health Check Failed",
        description: "Could not connect to X-ray Analysis API. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  // Submit analysis
  const handleAnalyzeXray = async () => {
    if (!selectedFile || !selectedPatient) {
      toast({
        title: "Missing information",
        description: "Please select both an X-ray image and a patient.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);
    setAnalysisStage("Preparing upload...");

    try {
      const formData = new FormData();
      formData.append('xray_image', selectedFile);
      formData.append('patient_id', selectedPatient);
      if (customPrompt.trim()) {
        formData.append('custom_prompt', customPrompt);
      }

      // Enhanced progress simulation for long-running analysis
      let currentStage = 0;
      const stages = [
        "Uploading X-ray image...",
        "Processing image with AI...",
        "Analyzing dental structure...",
        "Generating report...",
        "Finalizing results..."
      ];
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 2;
          
          // Update stage based on progress
          if (newProgress > 20 && currentStage < 1) {
            currentStage = 1;
            setAnalysisStage(stages[1]);
          } else if (newProgress > 40 && currentStage < 2) {
            currentStage = 2;
            setAnalysisStage(stages[2]);
          } else if (newProgress > 60 && currentStage < 3) {
            currentStage = 3;
            setAnalysisStage(stages[3]);
          } else if (newProgress > 80 && currentStage < 4) {
            currentStage = 4;
            setAnalysisStage(stages[4]);
          }
          
          if (newProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return newProgress;
        });
      }, 3000); // Update every 3 seconds for more realistic timing

      setAnalysisStage("Uploading X-ray image...");
      const result = await apiService.analyzeXray(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysisStage("Analysis completed!");
      
      toast({
        title: "Analysis completed!",
        description: "Your X-ray has been successfully analyzed.",
      });

      setCurrentAnalysis(result);
      setShowResults(true);
      
      // Reset form
      setSelectedFile(null);
      setSelectedPatient("");
      setCustomPrompt("");
      
      // Refresh analyses list
      await fetchAnalyses();

    } catch (error: any) {
      console.error('Analysis error:', error);
      
      let errorMessage = "There was an error analyzing the X-ray. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('timeout')) {
          errorMessage = "Analysis timed out. The image may be too large or the service is busy. Please try again.";
        } else if (error.message.includes('Network Error')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAnalysisStage("");
    }
  };

  // Fetch data functions
  const fetchPatients = async () => {
    try {
      const result = await apiService.getPatients();
      setPatients(result.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const result = await apiService.getXrayAnalyses();
      setAnalyses(result.analyses || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast({
        title: "Error loading analyses",
        description: "Could not load X-ray analysis history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await apiService.getXrayAnalysisStats();
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Initialize data
  React.useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPatients(),
          fetchAnalyses(),
          fetchStats()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: "Error loading data",
          description: "Some data could not be loaded. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter analyses
  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = searchTerm === '' || (
      analysis.patient_id?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.patient_id?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Helper function to format analysis text
  const formatAnalysisText = (text: string): JSX.Element => {
    if (!text) return <span>No analysis result available</span>;
    
    // Split by lines and process each line
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Replace **text** with bold formatting
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Create JSX element with proper formatting
      return (
        <span key={index}>
          <span dangerouslySetInnerHTML={{ __html: boldFormatted }} />
          {index < lines.length - 1 && <br />}
        </span>
      );
    });
    
    return <>{formattedLines}</>;
  };

  // Download sample X-ray
  const handleDownloadSampleXray = async () => {
    try {
      const sampleImageUrl = "https://res.cloudinary.com/doztc8x6p/image/upload/v1753355248/64e9731d7af8da9c45eccd9b_X_Ray_1_pnuppt.jpg";
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = sampleImageUrl;
      link.download = 'sample-dental-xray.jpg';
      link.target = '_blank';
      
      // For cross-origin images, we need to fetch and create blob
      const response = await fetch(sampleImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      toast({
        title: "Download started",
        description: "Sample X-ray image is being downloaded for testing.",
      });
    } catch (error) {
      console.error('Sample download error:', error);
      // Fallback: open in new tab if download fails
      window.open("https://res.cloudinary.com/doztc8x6p/image/upload/v1753355248/64e9731d7af8da9c45eccd9b_X_Ray_1_pnuppt.jpg", '_blank');
      
      toast({
        title: "Download initiated",
        description: "Sample X-ray opened in new tab. Right-click to save the image.",
      });
    }
  };

  // Action handlers
  const handleViewReport = (analysis: XrayAnalysisType) => {
    setViewModalAnalysis(analysis);
    setShowViewModal(true);
  };

  const handleDownloadReport = async (analysis: XrayAnalysisType) => {
    try {
      // Clean up markdown formatting for download
      const cleanAnalysisText = (analysis.analysis_result || '').replace(/\*\*(.*?)\*\*/g, '$1');
      
      const reportContent = `
X-RAY ANALYSIS REPORT
=====================

Patient: ${analysis.patient_id?.first_name || 'Unknown'} ${analysis.patient_id?.last_name || 'Patient'}
Analysis Date: ${new Date(analysis.analysis_date).toLocaleDateString()}
Doctor: ${analysis.doctor_id?.first_name || 'Unknown'} ${analysis.doctor_id?.last_name || 'Doctor'}
Status: ${analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}

ANALYSIS RESULTS:
${cleanAnalysisText || 'No analysis result available'}

KEY FINDINGS:
- Cavities: ${analysis.findings?.cavities ? 'Detected' : 'Not detected'}
- Infections: ${analysis.findings?.infections ? 'Signs present' : 'No signs detected'}
${analysis.findings?.wisdom_teeth ? `- Wisdom Teeth: ${analysis.findings.wisdom_teeth}` : ''}
${analysis.findings?.bone_density ? `- Bone Density: ${analysis.findings.bone_density}` : ''}

Generated on: ${new Date().toLocaleString()}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `xray-analysis-${analysis.patient_id?.first_name || 'unknown'}-${new Date(analysis.analysis_date).toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "X-ray analysis report is being downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not download the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnalysis = async (analysis: XrayAnalysisType) => {
    if (!window.confirm(`Are you sure you want to delete this X-ray analysis for ${analysis.patient_id?.first_name || 'Unknown'} ${analysis.patient_id?.last_name || 'Patient'}?`)) {
      return;
    }

    try {
      await apiService.deleteXrayAnalysis(analysis._id);
      
      toast({
        title: "Analysis deleted",
        description: "X-ray analysis has been successfully deleted.",
      });

      // Refresh the analyses list
      await fetchAnalyses();
      
      // If the deleted analysis was currently being viewed, clear it
      if (currentAnalysis?._id === analysis._id) {
        setCurrentAnalysis(null);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              AI X-ray Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              Loading...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            AI X-ray Analysis
          </h1>
          <p className="text-gray-600 mt-1">
            Upload dental X-rays and get AI-powered analysis reports
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_analyses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recent_analyses} in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed_analyses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_analyses > 0 ? Math.round((stats.completed_analyses / stats.total_analyses) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_analyses}</div>
              <p className="text-xs text-muted-foreground">
                Currently processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Common Findings</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.findings_stats.totalCavities}</div>
              <p className="text-xs text-muted-foreground">
                Cavities detected
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="analyze" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            New Analysis
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Analysis History
          </TabsTrigger>
        </TabsList>

        {/* New Analysis Tab */}
        <TabsContent value="analyze" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Upload X-ray Image
              </CardTitle>
              <CardDescription>
                Select a dental X-ray image and add optional analysis instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                      <p className="text-xs text-green-600">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Drop your X-ray image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports JPEG, JPG, PNG (max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="xray-upload"
                    />
                    <label htmlFor="xray-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Sample X-ray Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <FileImage className="w-5 h-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Need a sample X-ray for testing?
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Download our sample dental X-ray image to test the AI analysis feature.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSampleXray}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Sample X-ray
                    </Button>
                  </div>
                </div>
              </div>

              {/* Patient Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Patient</label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient?.first_name || 'Unknown'} {patient?.last_name || 'Patient'} - {patient?.phone || 'N/A'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Custom Analysis Instructions (Optional)
                </label>
                <Textarea
                  placeholder="e.g., Focus on wisdom tooth positioning, check for signs of infection..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use default comprehensive analysis
                </p>
              </div>

              {/* Upload Progress */}
              {isAnalyzing && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      {analysisStage}
                    </span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500 text-center">
                    This may take several minutes. Please don't close the browser.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleAnalyzeXray}
                disabled={!selectedFile || !selectedPatient || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing X-ray...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze X-ray
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          {showResults && currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>
                    AI-generated analysis for {currentAnalysis?.patient_id?.first_name || 'Unknown'} {currentAnalysis?.patient_id?.last_name || 'Patient'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Analysis Text */}
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Detailed Analysis:</h4>
                      <div className="text-sm leading-relaxed">
                        {formatAnalysisText(currentAnalysis?.analysis_result || '')}
                      </div>
                    </div>
                  </div>

                  {/* Key Findings */}
                  {currentAnalysis?.findings && (
                    <div>
                      <h4 className="font-medium mb-3">Key Findings:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={currentAnalysis.findings.cavities ? "destructive" : "secondary"}>
                            {currentAnalysis.findings.cavities ? "Cavities Detected" : "No Cavities"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={currentAnalysis.findings.infections ? "destructive" : "secondary"}>
                            {currentAnalysis.findings.infections ? "Infection Signs" : "No Infection"}
                          </Badge>
                        </div>
                        {currentAnalysis.findings.wisdom_teeth && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              Wisdom Teeth: {currentAnalysis.findings.wisdom_teeth}
                            </Badge>
                          </div>
                        )}
                        {currentAnalysis.findings.bone_density && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              Bone Density: {currentAnalysis.findings.bone_density}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Analysis History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                View and manage all X-ray analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Analysis Table */}
              <ResponsiveTable
                data={filteredAnalyses}
                columns={[
                  {
                    key: "patient",
                    label: "Patient",
                    render: (analysis) => (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {analysis.patient_id?.first_name?.[0] || 'U'}{analysis.patient_id?.last_name?.[0] || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {analysis.patient_id?.first_name || 'Unknown'} {analysis.patient_id?.last_name || 'Patient'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {analysis.patient_id?.phone || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )
                  },
                  {
                    key: "date",
                    label: "Analysis Date",
                    render: (analysis) => (
                      <div>
                        <p className="font-medium">
                          {new Date(analysis.analysis_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(analysis.analysis_date).toLocaleTimeString()}
                        </p>
                      </div>
                    )
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (analysis) => (
                      <Badge className={getStatusColor(analysis.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(analysis.status)}
                          {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                        </span>
                      </Badge>
                    )
                  },
                  {
                    key: "findings",
                    label: "Findings",
                    render: (analysis) => (
                      <div className="space-y-1">
                        {analysis.findings?.cavities && (
                          <Badge variant="destructive" className="text-xs">Cavities</Badge>
                        )}
                        {analysis.findings?.infections && (
                          <Badge variant="destructive" className="text-xs">Infection</Badge>
                        )}
                        {(!analysis.findings?.cavities && !analysis.findings?.infections) && (
                          <Badge variant="secondary" className="text-xs">Normal</Badge>
                        )}
                      </div>
                    )
                  }
                ]}
                actions={(analysis) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewReport(analysis)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadReport(analysis)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteAnalysis(analysis)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                emptyMessage="No X-ray analyses found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Report Modal */}
      <Dialog open={showViewModal} onOpenChange={(open) => {
        setShowViewModal(open);
        if (!open) {
          setViewModalAnalysis(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              X-ray Analysis Report
            </DialogTitle>
            <DialogDescription>
              Detailed analysis report for {viewModalAnalysis?.patient_id?.first_name || 'Unknown'} {viewModalAnalysis?.patient_id?.last_name || 'Patient'}
            </DialogDescription>
          </DialogHeader>

          {viewModalAnalysis && (
            <div className="space-y-6">
              {/* Patient & Analysis Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {viewModalAnalysis.patient_id?.first_name?.[0] || 'U'}{viewModalAnalysis.patient_id?.last_name?.[0] || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {viewModalAnalysis.patient_id?.first_name || 'Unknown'} {viewModalAnalysis.patient_id?.last_name || 'Patient'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {viewModalAnalysis.patient_id?.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700">Analysis Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Date:</span> {new Date(viewModalAnalysis.analysis_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Doctor:</span> {viewModalAnalysis.doctor_id?.first_name || 'Unknown'} {viewModalAnalysis.doctor_id?.last_name || 'Doctor'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={getStatusColor(viewModalAnalysis.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(viewModalAnalysis.status)}
                            {viewModalAnalysis.status.charAt(0).toUpperCase() + viewModalAnalysis.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm leading-relaxed">
                      {formatAnalysisText(viewModalAnalysis.analysis_result || '')}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Findings */}
              {viewModalAnalysis.findings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Key Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={viewModalAnalysis.findings.cavities ? "destructive" : "secondary"}>
                          {viewModalAnalysis.findings.cavities ? "Cavities Detected" : "No Cavities"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={viewModalAnalysis.findings.infections ? "destructive" : "secondary"}>
                          {viewModalAnalysis.findings.infections ? "Infection Signs" : "No Infection"}
                        </Badge>
                      </div>
                      {viewModalAnalysis.findings.wisdom_teeth && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Wisdom Teeth: {viewModalAnalysis.findings.wisdom_teeth}
                          </Badge>
                        </div>
                      )}
                      {viewModalAnalysis.findings.bone_density && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Bone Density: {viewModalAnalysis.findings.bone_density}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

                             {/* Action Buttons */}
               <div className="flex flex-wrap gap-2 pt-4 border-t">
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => handleDownloadReport(viewModalAnalysis)}
                 >
                   <Download className="w-4 h-4 mr-2" />
                   Download Report
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => {
                     setShowViewModal(false);
                     setViewModalAnalysis(null);
                   }}
                 >
                   Close
                 </Button>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default XrayAnalysis; 