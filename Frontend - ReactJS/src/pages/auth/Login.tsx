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
import PublicHeader from "@/components/layout/PublicHeader";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loading: authLoading } = useAuth();
  const { demoAccounts, loading: demoLoading, error: demoError, refetch: refetchDemoUsers } = useDemoUsers();
  const navigate = useNavigate();
  const { t } = useTranslation();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent any default form behavior
    if (e.target) {
      e.stopPropagation();
    }
    
    // Validate inputs before attempting login
    if (!email.trim() || !password.trim()) {
      setError(t("Please enter both email and password."));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: t("Login successful"),
          description: t("Welcome back to ClinicPro!"),
        });
        navigate("/dashboard");
      } else {
        // When login returns false, it means invalid credentials
        setError(t("Invalid email or password. Please check your credentials and try again."));
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
        setError(t("An error occurred during login. Please try again."));
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
          title: t("Demo login successful"),
          description: t("Welcome to ClinicPro demo!"),
        });
        navigate("/dashboard");
      } else {
        setError(t("Demo login failed. Invalid credentials for demo account."));
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
        setError(t("Demo login failed. Please try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full bg-background min-h-screen">
      <PublicHeader variant="auth" />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-7xl mx-auto">
        {/* iframe Access Notice */}
        {iframeUtils.isInIframe() && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800 dark:text-blue-300 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>{t("Having trouble accessing the login?")}</span>
                <a 
                  href="https://clinic-management-system-kappa.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline transition-colors"
                >
                  {t("Try the direct link to our original domain →")}
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
                <summary className="font-medium mb-2">🔧 {t("Debug Information (Dev Mode)")}</summary>
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
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">{t("ClinicPro")}</span>
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
                <CardTitle className="text-xl lg:text-2xl font-bold">{t("Welcome back")}</CardTitle>
                <CardDescription>
                  {t("Sign in to your ClinicPro account to continue")}
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
                    <Label htmlFor="email">{t("Email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("Enter your email")}
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
                    <Label htmlFor="password">{t("Password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("Enter your password")}
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                    >
                      {t("Forgot password?")}
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
                        {t("Signing in...")}
                      </>
                    ) : (
                      t("Sign In")
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("Don't have an account?")}{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      {t("Sign up")}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Role-Based Access Control - Now under Login Form */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg h-fit">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3 text-center text-lg lg:text-xl">
                  Role-Based Access Control
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span>
                      <strong>Admin:</strong> Full system access & management
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4 text-primary flex-shrink-0" />
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
                    {t("Try Demo Accounts")}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {t("Experience different user roles with our demo accounts. Click \"Try\" to login instantly.")}
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
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">{t("Loading demo accounts...")}</span>
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
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 rounded-full bg-muted flex-shrink-0">
                      <account.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-foreground text-sm">
                          {account.role}
                          {account.firstName && account.lastName && (
                            <span className="font-normal text-muted-foreground ml-1">
                              ({account.firstName} {account.lastName})
                            </span>
                          )}
                        </p>
                        <Badge className={`text-xs ${account.color}`}>
                          {account.role.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {account.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate mb-1">
                        {account.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Password: <code className="bg-muted px-1 rounded text-xs">{account.password}</code>
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
                    t("Try")
                    )}
                  </Button>
                </div>
              ))}
              
              {!demoLoading && demoAccounts.length === 0 && !demoError && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">{t("No users found in database")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Please run the database seeder to create demo users")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetchDemoUsers}
                    className="mt-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("Refresh")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Homepage Link */}
        <div className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t("← Back to homepage")}
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
