import React, { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle, TrendingUp, Shield, CreditCard, Star, MapPin, ArrowRight, Menu, User } from "lucide-react";
import logoImage from "figma:asset/629703c093c2f72bf409676369fecdf03c462cd2.png";

interface ProfessionalBenefitsProps {
  onRegister: () => void;
  onLogin: () => void;
  onBack: () => void;
  onNavigateHome: () => void;
  onNavigateServices: () => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
}

export function ProfessionalBenefits({ onRegister, onLogin, onBack, onNavigateHome, onNavigateServices, onNavigateAbout, onNavigateContact }: ProfessionalBenefitsProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const benefits = [
    {
      icon: Shield,
      color: "bg-green-500",
      title: "Verified Professionals",
      description: "Build trust with verified badges and certifications displayed on your profile"
    },
    {
      icon: CheckCircle,
      color: "bg-blue-500",
      title: "Instant Bookings",
      description: "Receive and confirm booking requests instantly with our real-time system"
    },
    {
      icon: CreditCard,
      color: "bg-purple-500",
      title: "Secure Payments",
      description: "Get paid directly with secure, automated payment processing"
    },
    {
      icon: TrendingUp,
      color: "bg-orange-500",
      title: "Analytics Dashboard",
      description: "Track your performance, bookings, and revenue with detailed insights"
    },
    {
      icon: Star,
      color: "bg-yellow-500",
      title: "Reviews & Trust",
      description: "Build your reputation with customer reviews and ratings"
    },
    {
      icon: MapPin,
      color: "bg-red-500",
      title: "Nationwide Exposure",
      description: "Reach customers across the UK looking for fire safety services"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Premium Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A2F] via-[#0d2238] to-[#0A1A2F]">
        {/* Radial glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-600/5 rounded-full blur-3xl" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-transparent text-white py-4 px-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
              <img src={logoImage} alt="Fire Guide" className="h-12" />
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={onNavigateHome} className="relative py-2 text-white hover:text-red-600 transition-colors group cursor-pointer">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={onNavigateServices} className="relative py-2 text-white hover:text-red-600 transition-colors group cursor-pointer">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button className="relative py-2 text-white hover:text-red-600 transition-colors group cursor-pointer">
                For Professionals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={onNavigateAbout} className="relative py-2 text-white hover:text-red-600 transition-colors group cursor-pointer">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={onNavigateContact} className="relative py-2 text-white hover:text-red-600 transition-colors group cursor-pointer">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onLogin}
                className="text-white hover:text-red-600 hover:bg-transparent transition-colors cursor-pointer group relative"
              >
                <User className="w-4 h-4 mr-2" />
                Login/Register
              </Button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-transparent border-t border-white/10 mt-4 py-6">
              <nav className="flex flex-col gap-1 px-6">
                <button 
                  onClick={onNavigateHome} 
                  className="text-left py-3 px-4 rounded-lg text-white hover:bg-white/10 hover:text-red-400 transition-all cursor-pointer"
                >
                  Home
                </button>
                <button 
                  onClick={onNavigateServices} 
                  className="text-left py-3 px-4 rounded-lg text-white hover:bg-white/10 hover:text-red-400 transition-all cursor-pointer"
                >
                  Services
                </button>
                <button 
                  className="text-left py-3 px-4 rounded-lg bg-white/10 text-red-400 cursor-pointer"
                >
                  For Professionals
                </button>
                <button 
                  onClick={onNavigateAbout} 
                  className="text-left py-3 px-4 rounded-lg text-white hover:bg-white/10 hover:text-red-400 transition-all cursor-pointer"
                >
                  About
                </button>
                <button 
                  onClick={onNavigateContact} 
                  className="text-left py-3 px-4 rounded-lg text-white hover:bg-white/10 hover:text-red-400 transition-all cursor-pointer"
                >
                  Contact
                </button>
                <div className="pt-4 mt-2 border-t border-white/10">
                  <Button 
                    variant="ghost" 
                    onClick={onLogin}
                    className="w-full text-white hover:text-red-400 hover:bg-white/10 justify-start py-3 px-4 h-auto cursor-pointer transition-all"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login/Register
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 py-12 md:py-16 lg:py-20 px-6">
          <div className="max-w-[1280px] mx-auto">
            {/* Top Section - Benefits Overview */}
            <div className="text-center mb-12 md:mb-16 lg:mb-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Why Join Fire Guide?</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-white mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl max-w-4xl mx-auto leading-tight">
                Grow Your Fire Safety Business with Fire Guide
              </h1>

              {/* Subtext */}
              <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Join the UK's leading fire safety marketplace and connect with thousands of customers looking for your services
              </p>
            </div>

            {/* Interactive Benefit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 lg:mb-20">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-red-600/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${benefit.color} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-white text-lg md:text-xl mb-2 md:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 lg:mb-20">
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
                <p className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-2">10,000+</p>
                <p className="text-sm md:text-base text-gray-300">Verified Professionals</p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
                <p className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-2">50,000+</p>
                <p className="text-sm md:text-base text-gray-300">Bookings Completed</p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
                <p className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-2">4.9★</p>
                <p className="text-sm md:text-base text-gray-300">Average Rating</p>
              </div>
            </div>

            {/* Bottom Section - CTA Area */}
            <div className="flex justify-center">
              <div className="w-full md:max-w-[480px] bg-white rounded-2xl shadow-2xl p-6 md:p-10">
                {/* CTA Content */}
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-[#0A1A2F] text-2xl md:text-3xl mb-3 md:mb-4">
                    Ready to Start Getting Customers?
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg">
                    Join Fire Guide and grow your professional business today.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
                  <Button
                    onClick={onRegister}
                    className="w-full h-12 md:h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all duration-300 cursor-pointer text-base md:text-lg"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={onLogin}
                    variant="outline"
                    className="w-full h-12 md:h-14 border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-300 cursor-pointer text-base md:text-lg"
                  >
                    Login
                  </Button>
                </div>

                {/* Micro Trust Line */}
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-500">
                    Free to join • No setup fees • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}