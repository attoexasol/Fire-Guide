import { Flame, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import logoImage from "figma:asset/629703c093c2f72bf409676369fecdf03c462cd2.png";

interface FooterProps {
  onAdminLogin?: () => void;
}

export function Footer({ onAdminLogin }: FooterProps) {
  return (
    <footer id="contact" className="bg-[#0A1A2F] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src={logoImage} alt="Fire Guide" className="h-12" />
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your trusted platform for connecting with certified fire safety professionals across the UK. Making fire safety simple, transparent, and accessible.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@fireguide.co.uk</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>0800 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>London, United Kingdom</span>
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-red-500 transition-colors">Fire Risk Assessment</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Fire Alarm Service</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Extinguisher Service</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Fire Door Inspection</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Fire Marshal Training</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-red-500 transition-colors">About Us</a></li>
              <li><a href="#how-it-works" className="hover:text-red-500 transition-colors">How It Works</a></li>
              <li><a href="#professionals" className="hover:text-red-500 transition-colors">For Professionals</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">GDPR</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Accessibility</a></li>
              {onAdminLogin && (
                <li>
                  <button 
                    onClick={onAdminLogin}
                    className="hover:text-red-500 transition-colors text-gray-500 text-xs"
                  >
                    Admin Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; 2025 Fire Guide. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}