import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { isAuthenticated, getUserInfo } from "../lib/auth";
import LandingPage from "./pages/LandingPage";
import ServiceSelectionPage from "./pages/ServiceSelectionPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import LocationPage from "./pages/LocationPage";
import ComparisonPage from "./pages/ComparisonPage";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AppointmentDetailsPage from "./pages/AppointmentDetailsPage";
import ProfessionalBenefitsPage from "./pages/ProfessionalBenefitsPage";
import ProfessionalAuthPage from "./pages/ProfessionalAuthPage";
import ProfessionalDashboardPage from "./pages/ProfessionalDashboardPage";
import ProfessionalProfileSetupPage from "./pages/ProfessionalProfileSetupPage";
import ProfessionalPricingPage from "./pages/ProfessionalPricingPage";
import ProfessionalAvailabilityPage from "./pages/ProfessionalAvailabilityPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CustomerAuthPage from "./pages/CustomerAuthPage";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import AboutContactPage from "./pages/AboutContactPage";
import ReportUploadPage from "./pages/ReportUploadPage";
import TestPage from "./TestPage";

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
      return <>{children}</>;
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
  
  return <>{children}</>;
}

export default function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/test" element={<TestPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutContactPage />} />
      <Route path="/services" element={<ServiceSelectionPage />} />
      <Route path="/services/:serviceId/questionnaire" element={<QuestionnairePage />} />
      <Route path="/services/:serviceId/location" element={<LocationPage />} />
      <Route path="/professionals/compare" element={<ComparisonPage />} />
      <Route path="/professionals/:professionalId" element={<ProfilePage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking/confirmation" element={<ConfirmationPage />} />
      <Route path="/booking/appointment-details" element={<AppointmentDetailsPage />} />
      
      {/* Professional Routes */}
      <Route path="/professional/benefits" element={<ProfessionalBenefitsPage />} />
      <Route path="/professional/auth" element={<ProfessionalAuthPage />} />
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
      <Route path="/admin/login" element={<AdminLoginPage />} />
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
      <Route path="/customer/auth" element={<CustomerAuthPage />} />
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

