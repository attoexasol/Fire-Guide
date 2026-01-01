import React, { useState } from "react";
import { Menu, User } from "lucide-react";
import { Button } from "./ui/button";

export interface UserInfo {
  name: string;
  role: "customer" | "professional" | "admin";
}

interface HeaderProps {
  onGetStarted: () => void;
  onProfessionalLogin: () => void;
  onCustomerLogin?: () => void;
  onLogin?: () => void;
  currentUser?: UserInfo | null;
  onLogout?: () => void;
  onAboutContact?: () => void;
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateToDashboard?: () => void;
}

export function Header({ 
  onGetStarted, 
  onProfessionalLogin, 
  onCustomerLogin, 
  onLogin, 
  currentUser, 
  onLogout, 
  onAboutContact,
  onNavigateHome,
  onNavigateServices,
  onNavigateAbout,
  onNavigateContact,
  onNavigateToDashboard
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Explicit handler for Login/Register button
  const handleLoginClick = () => {
    if (onCustomerLogin) {
      onCustomerLogin();
    } else if (onLogin) {
      onLogin();
    }
  };

  // Handler for user icon/name click - navigate to dashboard
  const handleUserClick = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm text-[#0A1A2F] py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600" aria-hidden="true">
            <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"></path>
          </svg>
          <span className="text-xl font-semibold text-[#0A1A2F]">Fire Guide</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={onNavigateHome} className="relative py-2 hover:text-red-600 transition-colors group cursor-pointer">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={onNavigateServices || onGetStarted} className="relative py-2 hover:text-red-600 transition-colors group cursor-pointer">
            Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={onProfessionalLogin} className="relative py-2 hover:text-red-600 transition-colors group cursor-pointer">
            For Professionals
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={onNavigateAbout || onAboutContact} className="relative py-2 hover:text-red-600 transition-colors group cursor-pointer">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={onNavigateContact || onAboutContact} className="relative py-2 hover:text-red-600 transition-colors group cursor-pointer">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <Button 
              variant="ghost" 
              onClick={handleUserClick} 
              className="text-[#0A1A2F] hover:text-red-600 hover:bg-transparent cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              {currentUser.name}
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleLoginClick} 
              className="text-[#0A1A2F] hover:text-red-600 hover:bg-transparent cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Login/Register
            </Button>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 mt-4 py-6">
          <nav className="flex flex-col gap-1 px-6">
            <button 
              onClick={onNavigateHome} 
              className="text-left py-3 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={onNavigateServices || onGetStarted} 
              className="text-left py-3 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={onProfessionalLogin} 
              className="text-left py-3 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              For Professionals
            </button>
            <button 
              onClick={onNavigateAbout || onAboutContact} 
              className="text-left py-3 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={onNavigateContact || onAboutContact} 
              className="text-left py-3 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              Contact
            </button>
            <div className="pt-4 mt-2 border-t border-gray-200">
              {currentUser ? (
                <Button 
                  variant="ghost" 
                  onClick={handleUserClick} 
                  className="w-full text-[#0A1A2F] hover:text-red-600 hover:bg-red-50 justify-start py-3 px-4 h-auto cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  {currentUser.name}
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={handleLoginClick} 
                  className="w-full text-[#0A1A2F] hover:text-red-600 hover:bg-red-50 justify-start py-3 px-4 h-auto cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login/Register
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}