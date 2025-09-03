import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Users,
  DollarSign,
  Package,
  BarChart3,
  Shield,
  Clock,
  Heart,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Database,
  Activity,
  TestTube2,
  Stethoscope,
  Building,
  UserCheck,
  FileText,
  BookOpen,
  Settings,
  TrendingUp,
  Zap,
  Globe,
  Menu,
  X,
} from "lucide-react";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const coreFeatures = [
    {
      icon: Calendar,
      title: "Smart Appointment System",
      description:
        "Advanced scheduling with automated reminders, conflict detection, and calendar integration",
    },
    {
      icon: Users,
      title: "Complete Patient Management",
      description:
        "Comprehensive patient records, medical history, allergies, and treatment tracking",
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description:
        "Automated billing, invoicing, payment tracking, and comprehensive financial reporting",
    },
    {
      icon: Building2,
      title: "Department Management",
      description:
        "Organize staff by departments with budget tracking and location management",
    },
    {
      icon: UserCheck,
      title: "Staff & Role Management",
      description:
        "Complete staff management with role-based access control and scheduling",
    },
    {
      icon: Activity,
      title: "Services Management",
      description:
        "Medical services catalog with pricing, scheduling, and department assignments",
    },
  ];

  const advancedFeatures = [
    {
      icon: Package,
      title: "Inventory Control",
      description:
        "Advanced inventory management with expiry tracking, low stock alerts, and supplier management",
      highlight: "Smart Alerts",
    },
    {
      icon: TestTube2,
      title: "Laboratory Integration",
      description:
        "Complete test management with external lab vendor integration and result tracking",
      highlight: "Lab Vendors",
    },
    {
      icon: Stethoscope,
      title: "Prescription Management",
      description:
        "Digital prescriptions with medication tracking and inventory integration",
      highlight: "Digital Rx",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive dashboards with revenue tracking, patient analytics, and performance metrics",
      highlight: "Real-time Data",
    },
    {
      icon: Database,
      title: "Database Management",
      description:
        "Complete database structure visualization with relationship mapping and technical documentation",
      highlight: "Technical Docs",
    },
    {
      icon: GraduationCap,
      title: "Training Center",
      description:
        "Role-based training modules with progress tracking and comprehensive documentation",
      highlight: "Learning Hub",
    },
  ];

  const systemFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "HIPAA compliant with role-based access control",
    },
    {
      icon: BookOpen,
      title: "Complete Documentation",
      description: "Comprehensive guides and workflow documentation",
    },
    {
      icon: Settings,
      title: "Customizable Workflows",
      description: "Adapt the system to your clinic's specific needs",
    },
    {
      icon: Globe,
      title: "Multi-location Support",
      description: "Manage multiple clinic locations from one dashboard",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      clinic: "HealthCare Plus",
      content:
        "The new Department Management feature revolutionized how we organize our staff. The Training Center helped our team adapt quickly to the new workflows.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Clinic Director",
      clinic: "MedCenter Pro",
      content:
        "The advanced analytics and database structure documentation gave us insights we never had before. Revenue tracking is now seamless.",
      rating: 5,
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Practice Manager",
      clinic: "Wellness Clinic",
      content:
        "The Services Management and Lab Vendor integration streamlined our entire operation. Patient satisfaction increased significantly.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500+", label: "Clinics Worldwide" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Expert Support" },
  ];

  return (
    <div className="w-full bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">ClinicPro</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#modules"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Modules
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Start Free Trial</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t bg-white/95 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/features"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#modules"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Modules
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="px-3 pt-2 space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Start Free Trial</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4" variant="secondary">
                <Star className="w-4 h-4 mr-1" />
                Trusted by 10,000+ Healthcare Professionals
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Next-Generation Clinic Management Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Complete healthcare management solution with advanced department
                organization, training modules, analytics, and comprehensive
                workflow automation. Transform your clinic operations today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  Explore Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <div className="flex items-center mt-8 space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free 30-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Full feature access
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl border p-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Advanced Dashboard
                    </h3>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">47</div>
                      <div className="text-sm text-blue-600">
                        Today's Appointments
                      </div>
                    </div>
                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        $12,450
                      </div>
                      <div className="text-sm text-green-600">
                        Weekly Revenue
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">6 Departments</div>
                      <div className="text-xs text-gray-500">
                        Active with 47 staff members
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Training Center</div>
                      <div className="text-xs text-gray-500">
                        85% completion rate
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                    <Database className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Analytics Ready</div>
                      <div className="text-xs text-gray-500">
                        Real-time insights available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential features that form the foundation of modern clinic
              management, designed for efficiency and growth.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Advanced Platform Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge features that set ClinicPro apart from traditional
              clinic management systems.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all hover:scale-105 border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade System Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with security, scalability, and reliability at its core.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See how ClinicPro's advanced features are transforming clinics
              worldwide
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <CardDescription className="text-base italic mb-4">
                      "{testimonial.content}"
                    </CardDescription>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-blue-600">
                        {testimonial.clinic}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Clinic?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals who are already using
              ClinicPro to streamline their operations and improve patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Experience ClinicPro Today
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get in touch with our team to schedule a personalized demo and
                see how ClinicPro's advanced features can transform your
                practice.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">contact@clinicpro.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">San Francisco, CA</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Request a Demo</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="First Name" />
                      <Input placeholder="Last Name" />
                    </div>
                    <Input placeholder="Email Address" type="email" />
                    <Input placeholder="Phone Number" type="tel" />
                    <Input placeholder="Clinic Name" />
                    <Textarea placeholder="Tell us about your clinic and which features interest you most..." />
                    <Button className="w-full" size="lg">
                      Request Demo
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="font-bold text-xl">ClinicPro</span>
              </div>
              <p className="text-gray-400 mb-4">
                The next-generation clinic management platform with advanced
                features for modern healthcare practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Core Features
                  </a>
                </li>
                <li>
                  <a
                    href="#modules"
                    className="hover:text-white transition-colors"
                  >
                    Advanced Modules
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security & Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integration API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ClinicPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
