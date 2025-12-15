import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { ServiceSelection } from "./components/ServiceSelection";
import { SmartQuestionnaire } from "./components/SmartQuestionnaire";
import { LocationPage } from "./components/LocationPage";
import { ComparisonResults } from "./components/ComparisonResults";
import { ProfessionalProfile } from "./components/ProfessionalProfile";
import { BookingFlow } from "./components/BookingFlow";
import { PaymentConfirmation } from "./components/PaymentConfirmation";
import { AppointmentDetails } from "./components/AppointmentDetails";
import { ReportUpload } from "./components/ReportUpload";
import { ProfessionalBenefits } from "./components/ProfessionalBenefits";
import { ProfessionalAuth } from "./components/ProfessionalAuth";
import { ProfessionalDashboard } from "./components/ProfessionalDashboard";
import { ProfessionalProfileSetup } from "./components/ProfessionalProfileSetup";
import { ProfessionalPricing } from "./components/ProfessionalPricing";
import { ProfessionalAvailability } from "./components/ProfessionalAvailability";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { CustomerAuth } from "./components/CustomerAuth";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { AboutContact } from "./components/AboutContact";
import { Toaster } from "./components/ui/sonner";

export type PageType = 
  | "landing"
  | "service-selection"
  | "questionnaire"
  | "location"
  | "comparison"
  | "profile"
  | "booking"
  | "confirmation"
  | "appointment-details"
  | "report-upload"
  | "professional-benefits"
  | "professional-auth"
  | "professional-dashboard"
  | "professional-profile-setup"
  | "professional-pricing"
  | "professional-availability"
  | "admin-login"
  | "admin-dashboard"
  | "customer-auth"
  | "customer-dashboard"
  | "about-contact";

export interface Booking {
  id: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  location: string;
  price: string;
  professionalEmail: string;
  professionalPhone: string;
  bookingRef: string;
  hasReport?: boolean;
  professionalImage?: string;
  professionalType?: "individual" | "company";
}

export interface Payment {
  id: string;
  date: string;
  service: string;
  professional: string;
  amount: string;
  status: "paid" | "refunded" | "pending";
  paymentMethod: string;
  invoiceNumber: string;
  bookingRef: string;
}

export interface User {
  name: string;
  role: "customer" | "professional" | "admin";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [customerPayments, setCustomerPayments] = useState<Payment[]>([]);
  const [bookingData, setBookingData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const addBooking = (booking: Booking) => {
    setCustomerBookings(prev => [booking, ...prev]);
  };

  const addPayment = (payment: Payment) => {
    setCustomerPayments(prev => [payment, ...prev]);
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setCustomerBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    );
  };

  const deleteBooking = (bookingId: string) => {
    setCustomerBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage 
            onGetStarted={() => navigateTo("service-selection")}
            onProfessionalLogin={() => navigateTo("professional-benefits")}
            onAdminLogin={() => navigateTo("admin-login")}
            onCustomerLogin={() => navigateTo("customer-auth")}
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setIsCustomerLoggedIn(false);
              navigateTo("landing");
            }}
            onAboutContact={() => navigateTo("about-contact")}
          />
        );
      case "service-selection":
        return (
          <ServiceSelection
            onSelectService={(service) => {
              setSelectedService(service);
              navigateTo("questionnaire");
            }}
            onBack={() => navigateTo("landing")}
            onNavigateHome={() => navigateTo("landing")}
            onNavigateServices={() => navigateTo("service-selection")}
            onNavigateProfessionals={() => navigateTo("professional-benefits")}
            onNavigateAbout={() => navigateTo("about-contact")}
            onNavigateContact={() => navigateTo("about-contact")}
            onCustomerLogin={() => navigateTo("customer-auth")}
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setIsCustomerLoggedIn(false);
              navigateTo("landing");
            }}
          />
        );
      case "questionnaire":
        return (
          <SmartQuestionnaire
            service={selectedService}
            onComplete={() => navigateTo("location")}
            onBack={() => navigateTo("service-selection")}
          />
        );
      case "location":
        return (
          <LocationPage
            onContinue={() => navigateTo("comparison")}
            onBack={() => navigateTo("questionnaire")}
          />
        );
      case "comparison":
        return (
          <ComparisonResults
            onViewProfile={(professional) => {
              setSelectedProfessional(professional);
              navigateTo("profile");
            }}
            onBack={() => navigateTo("location")}
          />
        );
      case "profile":
        return (
          <ProfessionalProfile
            professional={selectedProfessional}
            onBook={() => navigateTo("booking")}
            onBack={() => navigateTo("comparison")}
          />
        );
      case "booking":
        return (
          <BookingFlow
            onConfirm={(data) => {
              setBookingData(data);
              navigateTo("confirmation");
            }}
            onBack={() => navigateTo("profile")}
            selectedService={selectedService}
            selectedProfessional={selectedProfessional}
          />
        );
      case "confirmation":
        return (
          <PaymentConfirmation
            onBackToHome={() => {
              if (isCustomerLoggedIn) {
                navigateTo("customer-dashboard");
              } else {
                navigateTo("landing");
              }
            }}
            onViewAppointment={() => navigateTo("appointment-details")}
            bookingData={bookingData}
            onBookingComplete={(booking, payment) => {
              if (isCustomerLoggedIn) {
                addBooking(booking);
                addPayment(payment);
              }
            }}
          />
        );
      case "appointment-details":
        return (
          <AppointmentDetails
            onBack={() => navigateTo("confirmation")}
            onBackToHome={() => {
              if (isCustomerLoggedIn) {
                navigateTo("customer-dashboard");
              } else {
                navigateTo("landing");
              }
            }}
            bookingData={bookingData}
          />
        );
      case "professional-benefits":
        return (
          <ProfessionalBenefits
            onRegister={() => navigateTo("professional-auth")}
            onLogin={() => navigateTo("professional-auth")}
            onBack={() => navigateTo("landing")}
            onNavigateHome={() => navigateTo("landing")}
            onNavigateServices={() => navigateTo("service-selection")}
            onNavigateAbout={() => navigateTo("about-contact")}
            onNavigateContact={() => navigateTo("about-contact")}
          />
        );
      case "professional-auth":
        return (
          <ProfessionalAuth
            onAuthSuccess={(name: string) => {
              setCurrentUser({ name, role: "professional" });
              navigateTo("professional-dashboard");
            }}
            onBack={() => navigateTo("landing")}
            onNavigateHome={() => navigateTo("landing")}
            onNavigateServices={() => navigateTo("service-selection")}
            onNavigateProfessionals={() => navigateTo("professional-benefits")}
            onNavigateAbout={() => navigateTo("about-contact")}
            onNavigateContact={() => navigateTo("about-contact")}
          />
        );
      case "professional-dashboard":
        return (
          <ProfessionalDashboard
            onLogout={() => navigateTo("landing")}
            onNavigateToReports={() => navigateTo("report-upload")}
          />
        );
      case "professional-profile-setup":
        return (
          <ProfessionalProfileSetup
            onSave={() => navigateTo("professional-dashboard")}
            onBack={() => navigateTo("professional-dashboard")}
          />
        );
      case "professional-pricing":
        return (
          <ProfessionalPricing
            onSave={() => navigateTo("professional-dashboard")}
            onBack={() => navigateTo("professional-dashboard")}
          />
        );
      case "professional-availability":
        return (
          <ProfessionalAvailability
            onSave={() => navigateTo("professional-dashboard")}
            onBack={() => navigateTo("professional-dashboard")}
          />
        );
      case "admin-login":
        return (
          <AdminLogin
            onLoginSuccess={(name: string) => {
              setCurrentUser({ name, role: "admin" });
              navigateTo("admin-dashboard");
            }}
            onBack={() => navigateTo("landing")}
          />
        );
      case "admin-dashboard":
        return (
          <AdminDashboard
            onLogout={() => navigateTo("landing")}
          />
        );
      case "customer-auth":
        return (
          <CustomerAuth
            onAuthSuccess={(name: string) => {
              setIsCustomerLoggedIn(true);
              setCurrentUser({ name, role: "customer" });
              // Add demo bookings and payments for testing
              if (customerBookings.length === 0) {
                const demoBookings: Booking[] = [
                  {
                    id: "demo-1",
                    service: "Fire Risk Assessment",
                    professional: "SafeGuard Fire Ltd",
                    date: "2024-12-15",
                    time: "10:00 AM",
                    status: "upcoming",
                    location: "123 Business Park, London, SW1A 1AA",
                    price: "£450.00",
                    professionalEmail: "contact@safeguardfire.co.uk",
                    professionalPhone: "020 7946 0958",
                    bookingRef: "FG-2024-001",
                    hasReport: false,
                    professionalImage: "https://images.unsplash.com/photo-1654527288084-bce1ee2ccfdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJlJTIwc2FmZXR5JTIwY29tcGFueSUyMGxvZ298ZW58MXx8fHwxNzY1MTc5MjU4fDA&ixlib=rb-4.1.0&q=80&w=400",
                    professionalType: "company"
                  },
                  {
                    id: "demo-2",
                    service: "Fire Extinguisher Service",
                    professional: "Fire Safety Experts",
                    date: "2024-11-20",
                    time: "2:00 PM",
                    status: "completed",
                    location: "456 Office Plaza, Manchester, M1 1AE",
                    price: "£180.00",
                    professionalEmail: "info@firesafetyexperts.co.uk",
                    professionalPhone: "0161 123 4567",
                    bookingRef: "FG-2024-002",
                    hasReport: true,
                    professionalImage: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbnxlbnwxfHx8fDE3NjUxMDA5Njd8MA&ixlib=rb-4.1.0&q=80&w=400",
                    professionalType: "individual"
                  },
                  {
                    id: "demo-3",
                    service: "Fire Alarm Service",
                    professional: "Alert Fire Systems",
                    date: "2024-10-05",
                    time: "11:00 AM",
                    status: "completed",
                    location: "789 Industrial Estate, Birmingham, B1 1BB",
                    price: "£320.00",
                    professionalEmail: "service@alertfire.co.uk",
                    professionalPhone: "0121 456 7890",
                    bookingRef: "FG-2024-003",
                    hasReport: true,
                    professionalImage: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2NTE3MDg5Mnww&ixlib=rb-4.1.0&q=80&w=400",
                    professionalType: "individual"
                  }
                ];

                const demoPayments: Payment[] = [
                  {
                    id: "pay-1",
                    date: "2024-12-01",
                    service: "Fire Risk Assessment",
                    professional: "SafeGuard Fire Ltd",
                    amount: "£450.00",
                    status: "paid",
                    paymentMethod: "Visa ending 4242",
                    invoiceNumber: "INV-2024-001",
                    bookingRef: "FG-2024-001"
                  },
                  {
                    id: "pay-2",
                    date: "2024-11-20",
                    service: "Fire Extinguisher Service",
                    professional: "Fire Safety Experts",
                    amount: "£180.00",
                    status: "paid",
                    paymentMethod: "Mastercard ending 5555",
                    invoiceNumber: "INV-2024-002",
                    bookingRef: "FG-2024-002"
                  },
                  {
                    id: "pay-3",
                    date: "2024-10-05",
                    service: "Fire Alarm Service",
                    professional: "Alert Fire Systems",
                    amount: "£320.00",
                    status: "paid",
                    paymentMethod: "Visa ending 4242",
                    invoiceNumber: "INV-2024-003",
                    bookingRef: "FG-2024-003"
                  }
                ];

                setCustomerBookings(demoBookings);
                setCustomerPayments(demoPayments);
              }
              navigateTo("customer-dashboard");
            }}
            onBack={() => navigateTo("landing")}
          />
        );
      case "customer-dashboard":
        return (
          <CustomerDashboard
            onLogout={() => {
              setIsCustomerLoggedIn(false);
              navigateTo("landing");
            }}
            onBookNewService={() => navigateTo("service-selection")}
            bookings={customerBookings}
            payments={customerPayments}
            onUpdateBooking={updateBooking}
            onDeleteBooking={deleteBooking}
          />
        );
      case "report-upload":
        return (
          <ReportUpload
            onBack={() => navigateTo("professional-dashboard")}
          />
        );
      case "about-contact":
        return (
          <AboutContact
            onBack={() => navigateTo("landing")}
            onAdminLogin={() => navigateTo("admin-login")}
            currentUserName={currentUser?.name}
            onLogout={() => {
              setCurrentUser(null);
              setIsCustomerLoggedIn(false);
            }}
            onNavigateServices={() => navigateTo("service-selection")}
            onNavigateProfessionals={() => navigateTo("professional-auth")}
            onCustomerLogin={() => navigateTo("customer-auth")}
          />
        );
      default:
        return (
          <LandingPage 
            onGetStarted={() => navigateTo("service-selection")}
            onProfessionalLogin={() => navigateTo("professional-benefits")}
            onAdminLogin={() => navigateTo("admin-login")}
            onCustomerLogin={() => navigateTo("customer-auth")}
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setIsCustomerLoggedIn(false);
            }}
            onAboutContact={() => navigateTo("about-contact")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderPage()}
      <Toaster />
    </div>
  );
}