import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Menu,
  Search,
  LogOut,
  User,
  Settings,
  X,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import GoogleTranslate from "@/components/ui/GoogleTranslate";
import DirectionToggle from "@/components/ui/DirectionToggle";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-2 xs:px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Menu and Search */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-4 flex-1">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden p-2 h-9 w-9 touch-manipulation"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 h-9 w-9 touch-manipulation"
            >
              {showSearch ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop search - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients, appointments..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
            {/* Google Translate - Hidden on small screens */}
            <div className="hidden md:block">
              <ErrorBoundary>
                <GoogleTranslate variant="compact" />
              </ErrorBoundary>
            </div>

            {/* Direction Toggle - Hidden on small screens */}
            <div className="hidden md:block">
              <ErrorBoundary>
                <DirectionToggle variant="compact" />
              </ErrorBoundary>
            </div>

            {/* Currency Selector - Hidden on small screens */}
            <div className="hidden md:block">
              <CurrencySelector variant="compact" showLabel={false} />
            </div>

            {/* Notifications - Mobile optimized */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex relative p-2 h-9 w-9 touch-manipulation"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 touch-manipulation"
                >
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                    <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 max-w-[calc(100vw-2rem)]"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium leading-none truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <Badge
                      variant="secondary"
                      className="w-fit text-xs mt-1 capitalize"
                    >
                      {user?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Mobile-only utility items */}
                <div className="md:hidden">
                  <DropdownMenuItem className="py-3">
                    <ErrorBoundary>
                      <div className="flex items-center space-x-2 w-full">
                        <span className="text-sm">Currency:</span>
                        <CurrencySelector variant="compact" showLabel={false} />
                      </div>
                    </ErrorBoundary>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3">
                    <ErrorBoundary>
                      <div className="flex items-center space-x-2 w-full">
                        <span className="text-sm">Translate:</span>
                        <GoogleTranslate variant="compact" />
                      </div>
                    </ErrorBoundary>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem onClick={handleProfileClick} className="py-3">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem onClick={handleSettingsClick} className="py-3">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="py-3">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden mt-3 pb-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients, appointments..."
                className="pl-10 w-full h-10"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
