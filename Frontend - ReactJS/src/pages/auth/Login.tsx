import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoUsers } from "@/hooks/useDemoUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Stethoscope,
  Users,
  Calculator,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { clinicCookies, iframeUtils } from "@/utils/cookies";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loading: authLoading } = useAuth();
  const { demoAccounts, loading: demoLoading, error: demoError, refetch: refetchDemoUsers } = useDemoUsers();
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent any default form behavior
    if (e.target) {
      e.stopPropagation();
    }
    
    // Validate inputs before attempting login
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to ClinicPro!",
        });
        navigate("/dashboard");
      } else {
        // When login returns false, it means invalid credentials
        setError("Invalid email or password. Please check your credentials and try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Handle different types of errors
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    setError("");

    try {
      const success = await login(demoEmail, demoPassword);
      
      if (success) {
        toast({
          title: "Demo login successful",
          description: "Welcome to ClinicPro demo!",
        });
        navigate("/dashboard");
      } else {
        setError("Demo login failed. Invalid credentials for demo account.");
      }
    } catch (err: any) {
      console.error("Demo login error:", err);
      // Handle different types of errors
      if (err?.response?.data?.message) {
        setError(`Demo login failed: ${err.response.data.message}`);
      } else if (err?.message) {
        setError(`Demo login failed: ${err.message}`);
      } else if (typeof err === 'string') {
        setError(`Demo login failed: ${err}`);
      } else {
        setError("Demo login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* iframe Access Notice */}
        {iframeUtils.isInIframe() && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>Having trouble accessing the login?</span>
                <a 
                  href="https://clinic-management-system-kappa.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-500 underline transition-colors"
                >
                  Try the direct link to our original domain →
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Information for iframe contexts */}
        {iframeUtils.isInIframe() && process.env.NODE_ENV === 'development' && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-800">
              <details className="cursor-pointer">
                <summary className="font-medium mb-2">🔧 Debug Information (Dev Mode)</summary>
                <pre className="text-xs bg-amber-100 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(clinicCookies.getStorageDiagnostics(), null, 2)}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ClinicPro</span>
          </Link>
        </div>

                {/* Responsive Layout: Desktop 2-column with Role card below login, Mobile stacked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8"
        >
          {/* Left Column: Login Form + Role-Based Access Control */}
          <div className="space-y-6">
            {/* Login Form */}
            <Card className="shadow-xl border-0 h-fit">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-xl lg:text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your ClinicPro account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800 font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  noValidate
                  autoComplete="off"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear error when user starts typing
                        if (error) setError("");
                      }}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          // Clear error when user starts typing
                          if (error) setError("");
                        }}
                        required
                        disabled={isLoading}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading || authLoading || !email.trim() || !password.trim()}
                  >
                    {(isLoading || authLoading) ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Role-Based Access Control - Now under Login Form */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg h-fit">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-center text-lg lg:text-xl">
                  Role-Based Access Control
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span>
                      <strong>Admin:</strong> Full system access & management
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>
                      <strong>Doctor:</strong> Patient care & medical records
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>
                      <strong>Receptionist:</strong> Appointment & lead management
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-orange-600 flex-shrink-0" />
                    <span>
                      <strong>Nurse:</strong> Patient care & inventory
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-pink-600 flex-shrink-0" />
                    <span>
                      <strong>Accountant:</strong> Financial management & reports
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Demo Accounts Section */}
          <Card className="shadow-xl border-0 h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <CardTitle className="text-lg lg:text-xl">
                    Try Demo Accounts
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Experience different user roles with our demo accounts. Click "Try" to login instantly.
                  </CardDescription>
                </div>
                {!demoLoading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refetchDemoUsers}
                    className="ml-2 h-8 w-8 p-0"
                    title="Refresh demo accounts"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Loading demo accounts...</span>
                </div>
              ) : demoError ? (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {demoError}
                  </AlertDescription>
                </Alert>
              ) : null}
              
              {demoAccounts.map((account) => (
                <div
                  key={account.role}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 rounded-full bg-gray-100 flex-shrink-0">
                      <account.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {account.role}
                          {account.firstName && account.lastName && (
                            <span className="font-normal text-gray-600 ml-1">
                              ({account.firstName} {account.lastName})
                            </span>
                          )}
                        </p>
                        <Badge className={`text-xs ${account.color}`}>
                          {account.role.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {account.description}
                      </p>
                      <p className="text-xs text-gray-500 font-mono truncate mb-1">
                        {account.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Password: <code className="bg-gray-100 px-1 rounded text-xs">{account.password}</code>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={isLoading || authLoading || demoLoading}
                    className="ml-3 flex-shrink-0"
                  >
                    {(isLoading || authLoading) ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Try"
                    )}
                  </Button>
                </div>
              ))}
              
              {!demoLoading && demoAccounts.length === 0 && !demoError && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No users found in database</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Please run the database seeder to create demo users
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetchDemoUsers}
                    className="mt-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Homepage Link */}
        <div className="text-center text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-700 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
