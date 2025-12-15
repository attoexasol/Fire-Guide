import { useState } from "react";
import { 
  LayoutDashboard,
  User, 
  DollarSign, 
  Clock, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Flame,
  Briefcase,
  TrendingUp,
  FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProfessionalBookings } from "./ProfessionalBookings";
import { ProfessionalPayments } from "./ProfessionalPayments";
import { ProfessionalVerification } from "./ProfessionalVerification";
import { ProfessionalSettings } from "./ProfessionalSettings";
import { ProfessionalNotifications } from "./ProfessionalNotifications";
import { ProfessionalProfileContent } from "./ProfessionalProfileContent";
import { ProfessionalPricingContent } from "./ProfessionalPricingContent";
import { ProfessionalAvailabilityContent } from "./ProfessionalAvailabilityContent";
import logoImage from "figma:asset/629703c093c2f72bf409676369fecdf03c462cd2.png";

interface ProfessionalDashboardProps {
  onLogout: () => void;
  onNavigateToReports: () => void;
}

type ProfessionalView = "dashboard" | "profile" | "pricing" | "availability" | "bookings" | "payments" | "verification" | "settings" | "notifications";

export function ProfessionalDashboard({ onLogout, onNavigateToReports }: ProfessionalDashboardProps) {
  const [activeMenu, setActiveMenu] = useState<ProfessionalView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard" as ProfessionalView, label: "Dashboard", icon: LayoutDashboard },
    { id: "profile" as ProfessionalView, label: "Profile", icon: User, onClick: () => setActiveMenu("profile") },
    { id: "pricing" as ProfessionalView, label: "Pricing", icon: DollarSign, onClick: () => setActiveMenu("pricing") },
    { id: "availability" as ProfessionalView, label: "Availability", icon: Clock, onClick: () => setActiveMenu("availability") },
    { id: "bookings" as ProfessionalView, label: "Bookings", icon: Calendar },
    { id: "payments" as ProfessionalView, label: "Payments", icon: CreditCard },
    { id: "verification" as ProfessionalView, label: "Verification Status", icon: ShieldCheck },
    { id: "notifications" as ProfessionalView, label: "Notifications", icon: Bell },
    { id: "settings" as ProfessionalView, label: "Settings", icon: Settings },
  ];

  const stats = [
    {
      title: "Upcoming Jobs",
      value: "8",
      change: "+2 this week",
      icon: Briefcase,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconBg: "bg-blue-600"
    },
    {
      title: "Total Earnings",
      value: "£4,250",
      change: "+£850 this month",
      icon: TrendingUp,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconBg: "bg-green-600"
    },
    {
      title: "Pending Reports",
      value: "3",
      change: "2 due this week",
      icon: FileText,
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      iconBg: "bg-orange-600"
    }
  ];

  const upcomingJobs = [
    {
      id: 1,
      service: "Fire Risk Assessment",
      client: "ABC Office Ltd",
      date: "Tomorrow, 10:00 AM",
      location: "London, SW1A 1AA",
      status: "confirmed"
    },
    {
      id: 2,
      service: "Fire Extinguisher Service",
      client: "XYZ Retail Shop",
      date: "Nov 22, 2:00 PM",
      location: "Manchester, M1 1AD",
      status: "confirmed"
    },
    {
      id: 3,
      service: "Fire Door Inspection",
      client: "Tech Startup Inc",
      date: "Nov 23, 9:00 AM",
      location: "Birmingham, B1 1BB",
      status: "pending"
    }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return renderDashboard();
      case "bookings":
        return <ProfessionalBookings onViewDetails={(id) => console.log("View booking:", id)} />;
      case "payments":
        return <ProfessionalPayments />;
      case "verification":
        return <ProfessionalVerification />;
      case "settings":
        return <ProfessionalSettings />;
      case "notifications":
        return <ProfessionalNotifications />;
      case "profile":
        return <ProfessionalProfileContent />;
      case "pricing":
        return <ProfessionalPricingContent />;
      case "availability":
        return <ProfessionalAvailabilityContent />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[#0A1A2F] mb-2">
          Welcome back, John
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          // Determine click handler based on card type
          const getClickHandler = () => {
            if (stat.title === "Upcoming Jobs") {
              return () => setActiveMenu("bookings");
            } else if (stat.title === "Total Earnings") {
              return () => setActiveMenu("payments");
            } else if (stat.title === "Pending Reports") {
              return onNavigateToReports;
            }
            return undefined;
          };

          return (
            <Card 
              key={index} 
              className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={getClickHandler()}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl text-[#0A1A2F] mb-1">{stat.value}</p>
                    <p className={`text-sm ${stat.textColor}`}>{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Button 
          onClick={onNavigateToReports}
          className="h-auto py-4 bg-red-600 hover:bg-red-700 justify-start"
        >
          <FileText className="w-5 h-5 mr-3" />
          <div className="text-left">
            <p className="font-semibold">Upload Report</p>
            <p className="text-xs opacity-90">Submit completed job reports</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 justify-start border-2"
          onClick={() => setActiveMenu("availability")}
        >
          <Calendar className="w-5 h-5 mr-3 text-blue-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-900">Manage Availability</p>
            <p className="text-xs text-gray-600">Update your schedule</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 justify-start border-2"
          onClick={() => setActiveMenu("payments")}
        >
          <DollarSign className="w-5 h-5 mr-3 text-green-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-900">View Payments</p>
            <p className="text-xs text-gray-600">Check earnings & invoices</p>
          </div>
        </Button>
      </div>

      {/* Upcoming Jobs */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Upcoming Jobs</span>
            <Button 
              variant="ghost" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setActiveMenu("bookings")}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{job.service}</h4>
                    <Badge
                      variant={job.status === "confirmed" ? "default" : "secondary"}
                      className={
                        job.status === "confirmed"
                          ? "bg-green-100 text-green-700 border-0"
                          : "bg-yellow-100 text-yellow-700 border-0"
                      }
                    >
                      {job.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{job.client}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { amount: "£450", client: "ABC Office Ltd", date: "2 days ago", status: "completed" },
                { amount: "£850", client: "Tech Hub", date: "5 days ago", status: "completed" },
                { amount: "£250", client: "Retail Store", date: "1 week ago", status: "completed" }
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.client}</p>
                    <p className="text-sm text-gray-500">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Profile Strength</span>
                  <span className="text-sm font-semibold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-600">Basic information completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-600">Certifications uploaded</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xs">!</span>
                  </div>
                  <span className="text-gray-600">Add profile photo</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xs">!</span>
                  </div>
                  <span className="text-gray-600">Update availability calendar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header - MATCHES ADMIN HEADER EXACTLY */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a2942] border-b border-white/10 z-50">
        <div className="flex items-center justify-between px-6 h-14">
          {/* Left - Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:text-red-500 transition-colors p-1"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <img src={logoImage} alt="Fire Guide" className="h-10" />
            <Badge variant="secondary" className="bg-red-600 text-white border-0 text-sm px-2 py-0.5">
              Pro
            </Badge>
          </div>
          
          {/* Right - Action Icons */}
          <div className="flex items-center gap-3">
            <button
              className="relative text-white hover:text-red-500 transition-colors"
              onClick={() => setActiveMenu("notifications")}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              className="text-white hover:text-red-500 transition-colors"
              onClick={() => setActiveMenu("settings")}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              className="text-white hover:text-red-500 transition-colors"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky lg:translate-x-0 top-[56px] left-0 h-[calc(100vh-56px)] w-64 bg-white border-r shadow-lg lg:shadow-none transition-all duration-300 ease-in-out z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>

            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                    if (item.onClick && item.id !== "dashboard") {
                      item.onClick();
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeMenu === item.id
                      ? "bg-red-50 text-red-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}