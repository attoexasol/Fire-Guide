import React, { lazy, Suspense } from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { isAuthenticated, getUserInfo } from "../lib/auth";
import { Loader2 } from "lucide-react";

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ServiceSelectionPage = lazy(() => import("./pages/ServiceSelectionPage"));
const QuestionnairePage = lazy(() => import("./pages/QuestionnairePage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const ConfirmationPage = lazy(() => import("./pages/ConfirmationPage"));
const AppointmentDetailsPage = lazy(() => import("./pages/AppointmentDetailsPage"));
const ProfessionalBenefitsPage = lazy(() => import("./pages/ProfessionalBenefitsPage"));
const ProfessionalAuthPage = lazy(() => import("./pages/ProfessionalAuthPage"));
const ProfessionalDashboardPage = lazy(() => import("./pages/ProfessionalDashboardPage"));
const ProfessionalProfileSetupPage = lazy(() => import("./pages/ProfessionalProfileSetupPage"));
const ProfessionalPricingPage = lazy(() => import("./pages/ProfessionalPricingPage"));
const ProfessionalAvailabilityPage = lazy(() => import("./pages/ProfessionalAvailabilityPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CustomerAuthPage = lazy(() => import("./pages/CustomerAuthPage"));
const CustomerDashboardPage = lazy(() => import("./pages/CustomerDashboardPage"));
const AboutContactPage = lazy(() => import("./pages/AboutContactPage"));
const ReportUploadPage = lazy(() => import("./pages/ReportUploadPage"));
const TestPage = lazy(() => import("./TestPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: "customer" | "professional" | "admin" 
}) {
  const { currentUser } = useApp();
  
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  // Check role from localStorage first (available immediately on reload)
  // before checking currentUser from context (which may be null initially)
  if (requiredRole) {
    const userInfo = getUserInfo();
    // If userInfo exists and role matches, allow access even if currentUser is null
    // (currentUser will be set by useEffect soon)
    if (userInfo?.role === requiredRole) {
      return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
    }
    // Role doesn't match - redirect based on actual role
    if (userInfo?.role === "customer") {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (userInfo?.role === "professional") {
      return <Navigate to="/professional/dashboard" replace />;
    } else if (userInfo?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Fallback: check currentUser from context as last resort
    if (currentUser?.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/test" element={<Suspense fallback={<PageLoader />}><TestPage /></Suspense>} />
      <Route path="/" element={<Suspense fallback={<PageLoader />}><LandingPage /></Suspense>} />
      <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutContactPage /></Suspense>} />
      <Route path="/services" element={<Suspense fallback={<PageLoader />}><ServiceSelectionPage /></Suspense>} />
      <Route path="/services/:serviceId/questionnaire" element={<Suspense fallback={<PageLoader />}><QuestionnairePage /></Suspense>} />
      <Route path="/services/:serviceId/location" element={<Suspense fallback={<PageLoader />}><LocationPage /></Suspense>} />
      <Route path="/professionals/compare" element={<Suspense fallback={<PageLoader />}><ComparisonPage /></Suspense>} />
      <Route path="/professionals/:professionalId" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
      <Route path="/booking" element={<Suspense fallback={<PageLoader />}><BookingPage /></Suspense>} />
      <Route path="/booking/confirmation" element={<Suspense fallback={<PageLoader />}><ConfirmationPage /></Suspense>} />
      <Route path="/booking/appointment-details" element={<Suspense fallback={<PageLoader />}><AppointmentDetailsPage /></Suspense>} />
      
      {/* Professional Routes */}
      <Route path="/professional/benefits" element={<Suspense fallback={<PageLoader />}><ProfessionalBenefitsPage /></Suspense>} />
      <Route path="/professional/auth" element={<Suspense fallback={<PageLoader />}><ProfessionalAuthPage /></Suspense>} />
      <Route 
        path="/professional/dashboard/:view" 
        element={
          <ProtectedRoute requiredRole="professional">
            <ProfessionalDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/professional/dashboard" 
        element={
          <ProtectedRoute requiredRole="professional">
            <ProfessionalDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/professional/profile-setup" 
        element={
          <ProtectedRoute requiredRole="professional">
            <ProfessionalProfileSetupPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/professional/pricing" 
        element={
          <ProtectedRoute requiredRole="professional">
            <ProfessionalPricingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/professional/availability" 
        element={
          <ProtectedRoute requiredRole="professional">
            <ProfessionalAvailabilityPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/professional/reports" 
        element={
          <ProtectedRoute requiredRole="professional">
            <ReportUploadPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLoginPage /></Suspense>} />
      <Route 
        path="/admin/dashboard/services/add" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard/services/edit/:id" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard/:view" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Customer Routes */}
      <Route path="/customer/auth" element={<Suspense fallback={<PageLoader />}><CustomerAuthPage /></Suspense>} />
      <Route 
        path="/customer/dashboard/certification/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/certification/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/profile/addresses/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/profile/addresses/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/pricing/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/pricing/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/available_date/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/available_date/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/insurance/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/insurance/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/specializations/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/specializations/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/experiences/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/experiences/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/reviews/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/reviews/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/services/add" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/services/edit/:id" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard/:view" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/dashboard" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}

