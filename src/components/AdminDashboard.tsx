import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  CreditCard, 
  Star, 
  FileText, 
  Settings, 
  Bell,
  DollarSign,
  TrendingUp,
  Activity,
  CalendarCheck,
  UserCheck,
  AlertCircle,
  Menu,
  X,
  LogOut,
  Flame,
  User
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AdminCustomers } from "./AdminCustomers";
import { AdminProfessionals } from "./AdminProfessionals";
import { AdminBookings } from "./AdminBookings";
import { AdminPayments } from "./AdminPayments";
import { AdminReviews } from "./AdminReviews";
import { AdminServices } from "./AdminServices";
import { AdminSettings } from "./AdminSettings";
import { AdminNotifications } from "./AdminNotifications";
import logoImage from "figma:asset/629703c093c2f72bf409676369fecdf03c462cd2.png";
import { getUserRole } from "../lib/auth";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = "dashboard" | "customers" | "professionals" | "bookings" | "payments" | "reviews" | "services" | "settings" | "notifications";

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get user role from localStorage (stored during login)
  const userRole = getUserRole();

  // Define all available admin menu items
  const allAdminMenuItems = [
    { id: "dashboard" as AdminView, label: "Dashboard", icon: LayoutDashboard },
    { id: "customers" as AdminView, label: "Customers", icon: Users },
    { id: "professionals" as AdminView, label: "Professionals", icon: Briefcase },
    { id: "bookings" as AdminView, label: "Bookings", icon: Calendar },
    { id: "payments" as AdminView, label: "Payments", icon: CreditCard },
    { id: "reviews" as AdminView, label: "Reviews", icon: Star },
    { id: "services" as AdminView, label: "Services", icon: FileText },
    { id: "notifications" as AdminView, label: "Notifications", icon: Bell },
    { id: "settings" as AdminView, label: "Settings", icon: Settings },
  ];

  // Filter menu items based on role - for ADMIN role, show all admin menu items
  // This structure allows for future role-based filtering (e.g., SUPER_ADMIN, MODERATOR, etc.)
  const menuItems = userRole === "ADMIN" ? allAdminMenuItems : allAdminMenuItems;

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-800 mb-1">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
              <p className="text-gray-900">£45,280</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Active Bookings</p>
              <p className="text-gray-900">127</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                18 scheduled today
              </p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Total Customers</p>
              <p className="text-gray-900">1,547</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-purple-600 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                +89 this month
              </p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Active Professionals</p>
              <p className="text-gray-900">68</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                5 pending approval
              </p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-800">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {[
                { customer: "John Smith", professional: "Sarah Mitchell", service: "Fire Risk Assessment", amount: "£285", status: "confirmed" },
                { customer: "Emma Davis", professional: "James Patterson", service: "Fire Equipment Service", amount: "£150", status: "pending" },
                { customer: "Michael Brown", professional: "David Chen", service: "Emergency Lighting", amount: "£195", status: "confirmed" },
                { customer: "Lisa Anderson", professional: "Emma Thompson", service: "Fire Risk Assessment", amount: "£320", status: "completed" },
              ].map((booking, index) => (
                <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{booking.customer}</p>
                    <p className="text-xs text-gray-600">{booking.service}</p>
                    <p className="text-xs text-gray-400">with {booking.professional}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-900">{booking.amount}</p>
                    <span 
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-800">System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-900">5 Professionals Pending Approval</p>
                  <p className="text-xs text-yellow-700 mt-0.5">Review and approve new professional applications</p>
                  <button 
                    className="text-xs text-yellow-800 mt-1 hover:underline"
                    onClick={() => setCurrentView("professionals")}
                  >
                    Review Now →
                  </button>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900">3 Reviews Pending Moderation</p>
                  <p className="text-xs text-blue-700 mt-0.5">Check and moderate customer reviews</p>
                  <button 
                    className="text-xs text-blue-800 mt-1 hover:underline"
                    onClick={() => setCurrentView("reviews")}
                  >
                    View Reviews →
                  </button>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <Activity className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-900">Platform Running Smoothly</p>
                  <p className="text-xs text-green-700 mt-0.5">All systems operational • Last checked 2 mins ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return renderDashboard();
      case "customers":
        return <AdminCustomers />;
      case "professionals":
        return <AdminProfessionals />;
      case "bookings":
        return <AdminBookings />;
      case "payments":
        return <AdminPayments />;
      case "reviews":
        return <AdminReviews />;
      case "services":
        return <AdminServices />;
      case "notifications":
        return <AdminNotifications />;
      case "settings":
        return <AdminSettings />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1A2F] via-[#0d2238] to-[#0A1A2F]">
      {/* Top Header - FIXED AND STICKY */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a2942] border-b border-white/10 z-50">
        <div className="flex items-center justify-between px-6 h-14">
          {/* Logo - Left */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:text-red-500 transition-colors p-1"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <img src={logoImage} alt="Fire Guide Admin" className="h-10" />
          </div>
          
          {/* Admin Actions - Right */}
          <div className="flex items-center gap-3">
            <button
              className="relative text-white hover:text-red-500 transition-colors"
              onClick={() => setCurrentView("notifications")}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              className="text-white hover:text-red-500 transition-colors"
              onClick={() => setCurrentView("settings")}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              className="text-white hover:text-red-500 transition-colors"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar - Mobile & Desktop with smooth animations */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:sticky lg:translate-x-0 top-[56px] left-0 h-[calc(100vh-56px)] w-56 bg-white border-r border-gray-200 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out z-40`}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Display user role */}
            {userRole && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="capitalize">{userRole.toLowerCase()}</span>
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}