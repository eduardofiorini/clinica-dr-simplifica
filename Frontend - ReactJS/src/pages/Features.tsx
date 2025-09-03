import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import FeaturesShowcase from "@/components/features/FeaturesShowcase";
import FeatureCards from "@/components/features/FeatureCards";

const Features = () => {
  return (
    <div className="w-full bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">ClinicPro</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm">Try Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Features Content */}
      <FeaturesShowcase />
      <FeatureCards />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">ClinicPro</span>
            </Link>
            <p className="text-gray-400 mb-6">
              The complete clinic management solution for modern healthcare
              practices.
            </p>
            <div className="flex justify-center space-x-6">
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try Demo
              </Link>
              <Link
                to="/#contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/#pricing"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
