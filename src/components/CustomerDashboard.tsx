import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CustomerBookings } from "./CustomerBookings";
import { CustomerPayments } from "./CustomerPayments";
import { ProfessionalCertifications } from "./ProfessionalCertifications";
import { AddCertification } from "./AddCertification";
import { EditCertification } from "./EditCertification";
import { Addresses } from "./Addresses";
import { AddAddress } from "./AddAddress";
import { EditAddress } from "./EditAddress";
import { ProfessionalPricingContent } from "./ProfessionalPricingContent";
import { AddPricing } from "./AddPricing";
import { EditPricing } from "./EditPricing";
import { AvailableDatesContent } from "./AvailableDatesContent";
import { AddAvailableDate } from "./AddAvailableDate";
import { EditAvailableDate } from "./EditAvailableDate";
import { InsuranceContent } from "./InsuranceContent";
import { AddInsurance } from "./AddInsurance";
import { EditInsurance } from "./EditInsurance";
import { AddSpecialization } from "./AddSpecialization";
import { EditSpecialization } from "./EditSpecialization";
import {
  Flame,
  LogOut,
  User,
  Calendar,
  CreditCard,
  Home,
  Bell,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  TrendingUp,
  Menu,
  X,
  LayoutDashboard,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Award,
  Loader2,
  DollarSign,
  CalendarCheck,
  Tag
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Booking } from "../App";
import { Payment } from "../App";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { updateUser, uploadProfileImage } from "../api/authService";
import { fetchAddresses, deleteAddress } from "../api/addressService";
import { getApiToken, getUserEmail, getUserFullName, getUserPhone, setUserFullName, setUserPhone, getUserProfileImage, setUserProfileImage, getUserRole } from "../lib/auth";
import { fetchSpecializations, deleteSpecialization, SpecializationItem } from "../api/specializationsService";

interface CustomerDashboardProps {
  onLogout: () => void;
  onBookNewService: () => void;
  bookings: Booking[];
  payments: Payment[];
  onUpdateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  onDeleteBooking: (bookingId: string) => void;
  onNavigateHome?: () => void;
}

type CustomerView = "overview" | "bookings" | "payments" | "profile" | "certification" | "addresses" | "settings" | "notifications" | "pricing" | "available_date" | "insurance" | "specializations";

export function CustomerDashboard({
  onLogout,
  onBookNewService,
  bookings,
  payments,
  onUpdateBooking,
  onDeleteBooking,
  onNavigateHome
}: CustomerDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { view } = useParams<{ view?: string }>();
  const validViews: CustomerView[] = ["overview", "bookings", "payments", "profile", "certification", "addresses", "settings", "notifications", "pricing", "available_date", "insurance", "specializations"];
  
  // Check if we're on the add certification route
  const isAddCertificationRoute = location.pathname === "/customer/dashboard/certification/add";
  // Check if we're on the edit certification route
  const isEditCertificationRoute = location.pathname.startsWith("/customer/dashboard/certification/edit/");
  // Check if we're on the add address route (child of profile)
  const isAddAddressRoute = location.pathname === "/customer/dashboard/profile/addresses/add";
  // Check if we're on the edit address route (child of profile)
  const isEditAddressRoute = location.pathname.startsWith("/customer/dashboard/profile/addresses/edit/");
  // Check if we're on the add pricing route
  const isAddPricingRoute = location.pathname === "/customer/dashboard/pricing/add";
  // Check if we're on the edit pricing route
  const isEditPricingRoute = location.pathname.startsWith("/customer/dashboard/pricing/edit/");
  // Check if we're on the add available date route
  const isAddAvailableDateRoute = location.pathname === "/customer/dashboard/available_date/add";
  // Check if we're on the edit available date route
  const isEditAvailableDateRoute = location.pathname.startsWith("/customer/dashboard/available_date/edit/");
  // Check if we're on the add insurance route
  const isAddInsuranceRoute = location.pathname === "/customer/dashboard/insurance/add";
  // Check if we're on the edit insurance route
  const isEditInsuranceRoute = location.pathname.startsWith("/customer/dashboard/insurance/edit/");
  // Check if we're on the add specialization route
  const isAddSpecializationRoute = location.pathname === "/customer/dashboard/specializations/add";
  // Check if we're on the edit specialization route
  const isEditSpecializationRoute = location.pathname.startsWith("/customer/dashboard/specializations/edit/");
  
  // Determine current view from URL parameter or pathname
    // If on /certification/add or /certification/edit route, treat it as certification view
    // If on /profile/addresses/add or /profile/addresses/edit route, treat it as profile view
    // If on /pricing/add or /pricing/edit route, treat it as pricing view
    // If on /available_date/add or /available_date/edit route, treat it as available_date view
    // If on /insurance/add or /insurance/edit route, treat it as insurance view
    // If on /specializations/add or /specializations/edit route, treat it as specializations view
    const currentViewFromUrl: CustomerView = isAddCertificationRoute || isEditCertificationRoute
      ? "certification"
      : isAddAddressRoute || isEditAddressRoute
      ? "profile"
      : isAddPricingRoute || isEditPricingRoute
      ? "pricing"
      : isAddAvailableDateRoute || isEditAvailableDateRoute
      ? "available_date"
      : isAddInsuranceRoute || isEditInsuranceRoute
      ? "insurance"
      : isAddSpecializationRoute || isEditSpecializationRoute
      ? "specializations"
      : (view && validViews.includes(view as CustomerView))
        ? (view as CustomerView)
        : "overview";
  
  const [currentView, setCurrentView] = useState<CustomerView>(currentViewFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync state with URL parameter when it changes (including on mount and URL changes)
  useEffect(() => {
    const newView = isAddCertificationRoute || isEditCertificationRoute
      ? "certification"
      : isAddAddressRoute || isEditAddressRoute
      ? "profile"
      : isAddPricingRoute || isEditPricingRoute
      ? "pricing"
      : isAddAvailableDateRoute || isEditAvailableDateRoute
      ? "available_date"
      : isAddInsuranceRoute || isEditInsuranceRoute
      ? "insurance"
      : isAddSpecializationRoute || isEditSpecializationRoute
      ? "specializations"
      : (view && validViews.includes(view as CustomerView))
        ? (view as CustomerView)
        : "overview";
    setCurrentView(newView);
  }, [view, isAddCertificationRoute, isEditCertificationRoute, isAddAddressRoute, isEditAddressRoute, isAddPricingRoute, isEditPricingRoute, isAddAvailableDateRoute, isEditAvailableDateRoute, isAddInsuranceRoute, isEditInsuranceRoute, isAddSpecializationRoute, isEditSpecializationRoute]);

  // Fetch addresses when profile view is shown
  useEffect(() => {
    const loadAddresses = async () => {
      if (currentView === "profile" && !isAddAddressRoute && !isEditAddressRoute) {
        const token = getApiToken();
        if (!token) {
          return;
        }

        setIsLoadingAddresses(true);
        try {
          const response = await fetchAddresses(token);
          if (response.status === "success" && response.data) {
            // Map API response to local address format
            const mappedAddresses = response.data.map((addr) => ({
              id: addr.id,
              label: addr.tag,
              street: addr.adress_line,
              city: addr.city,
              postcode: addr.postal_code,
              country: addr.country,
              isDefault: addr.is_default_address === 1
            }));
            setAddresses(mappedAddresses);
          }
        } catch (error: any) {
          console.error('Failed to load addresses:', error);
          // Don't show error toast on initial load, just log it
        } finally {
          setIsLoadingAddresses(false);
        }
      }
    };

    loadAddresses();
  }, [currentView, isAddAddressRoute, isEditAddressRoute]);

  // Fetch specializations when specializations view is shown
  useEffect(() => {
    const loadSpecializations = async () => {
      // Only load if we're on the main specializations view (not on add/edit routes)
      if (currentView === "specializations" && !isAddSpecializationRoute && !isEditSpecializationRoute) {
        setIsLoadingSpecializations(true);
        try {
          const data = await fetchSpecializations();
          setSpecializations(data);
        } catch (error: any) {
          console.error('Failed to load specializations:', error);
          toast.error(error.message || 'Failed to load specializations');
        } finally {
          setIsLoadingSpecializations(false);
        }
      }
    };

    loadSpecializations();
  }, [currentView, isAddSpecializationRoute, isEditSpecializationRoute]);

  // Navigation handler that updates URL
  const handleViewChange = (view: CustomerView) => {
    setCurrentView(view);
    if (view === "overview") {
      navigate("/customer/dashboard", { replace: true });
    } else {
      navigate(`/customer/dashboard/${view}`, { replace: true });
    }
  };

  // Address management state
  const [addresses, setAddresses] = useState<Array<{
    id: number;
    label: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    isDefault: boolean;
  }>>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [specializations, setSpecializations] = useState<SpecializationItem[]>([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(false);
  const [deleteSpecializationModalOpen, setDeleteSpecializationModalOpen] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] = useState<SpecializationItem | null>(null);
  const [isDeletingSpecialization, setIsDeletingSpecialization] = useState(false);

  // Get user data from localStorage
  const storedFullName = getUserFullName();
  const storedEmail = getUserEmail();
  const storedPhone = getUserPhone();
  const storedProfileImage = getUserProfileImage();

  // Use stored data or fallback to defaults
  const customerName = storedFullName || "User";
  const customerEmail = storedEmail || "user@example.com";
  const customerPhone = storedPhone || "";

  // Profile form state - initialize with stored user data
  const [profileForm, setProfileForm] = useState({
    full_name: customerName,
    phone: customerPhone
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(storedProfileImage);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate stats from real data
  const upcomingBookings = bookings.filter(b => b.status === "upcoming").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const totalSpent = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace("£", "").replace(",", "")), 0);

  // Address management handlers
  const handleAddAddress = () => {
    navigate("/customer/dashboard/profile/addresses/add");
  };

  const handleEditAddress = (address: any) => {
    navigate(`/customer/dashboard/profile/addresses/edit/${address.id}`);
  };

  const handleDeleteAddress = (id: number) => {
    setAddressToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) {
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to delete address.");
      setDeleteModalOpen(false);
      setAddressToDelete(null);
      return;
    }

    try {
      const response = await deleteAddress({
        api_token: token,
        id: addressToDelete
      });

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        // Remove from local state
        setAddresses(addresses.filter(addr => addr.id !== addressToDelete));
        toast.success(response.message || "Address deleted successfully");
      } else {
        toast.error(response.message || response.error || "Failed to delete address. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while deleting address. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  const cancelDeleteAddress = () => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Default address updated");
  };


  const handleUpdateProfile = async () => {
    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to update your profile.");
      return;
    }

    if (!profileForm.full_name || !profileForm.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await updateUser({
        api_token: token,
        full_name: profileForm.full_name,
        phone: profileForm.phone
      });

      if (response.success || response.status === "success" || (response.data && !response.error)) {
        // Update localStorage with the new values
        setUserFullName(profileForm.full_name);
        setUserPhone(profileForm.phone);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || response.error || "Failed to update profile. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while updating your profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to upload a profile image.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await uploadProfileImage({
        api_token: token,
        file: file
      });

      if (response.status === true && response.image_url) {
        // Update state and localStorage
        setProfileImage(response.image_url);
        setUserProfileImage(response.image_url);
        toast.success(response.message || "Profile image updated successfully!");
      } else {
        toast.error(response.message || response.error || "Failed to upload profile image. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while uploading your profile image. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };



  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Get user role from backend (checks both user_role and fireguide_user_role)
  const userRole = getUserRole();

  // Define customer menu items
  const customerMenuItems = [
    { id: "overview" as CustomerView, label: "Overview", icon: LayoutDashboard },
    { id: "bookings" as CustomerView, label: "My Bookings", icon: Calendar },
    { id: "payments" as CustomerView, label: "Payments", icon: CreditCard },
    { id: "profile" as CustomerView, label: "My Profile", icon: User },
    { id: "addresses" as CustomerView, label: "Addresses", icon: MapPin },
    { id: "notifications" as CustomerView, label: "Notifications", icon: Bell },
    { id: "settings" as CustomerView, label: "Settings", icon: Settings },
  ];

  // Define professional menu items
  const professionalMenuItems = [
    { id: "overview" as CustomerView, label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings" as CustomerView, label: "Bookings", icon: Calendar },
    { id: "payments" as CustomerView, label: "Payments", icon: CreditCard },
    { id: "profile" as CustomerView, label: "Profile", icon: User },
    { id: "addresses" as CustomerView, label: "Addresses", icon: MapPin },
    { id: "certification" as CustomerView, label: "Certification", icon: Award },
    { id: "pricing" as CustomerView, label: "Pricing", icon: DollarSign },
    { id: "available_date" as CustomerView, label: "Available Date", icon: CalendarCheck },
    { id: "insurance" as CustomerView, label: "Insurance", icon: Shield },
    { id: "notifications" as CustomerView, label: "Notifications", icon: Bell },
    { id: "settings" as CustomerView, label: "Settings", icon: Settings },
  ];

  // Select menu items based on role
  let menuItems = userRole === "PROFESSIONAL" ? professionalMenuItems : customerMenuItems;
  
  // Add Specializations menu item for Admin users
  if (userRole === "ADMIN") {
    menuItems = [
      ...menuItems,
      { id: "specializations" as CustomerView, label: "Specializations", icon: Tag }
    ];
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl text-[#0A1A2F] mb-2">Welcome back, {customerName}!</h1>
          <p className="text-gray-600 text-sm md:text-base">Here's an overview of your fire safety services.</p>
        </div>
        <Button
          onClick={onBookNewService}
          className="bg-red-600 hover:bg-red-700 w-full md:w-auto h-12 md:h-10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book New Service
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          onClick={() => handleViewChange("bookings")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                <p className="text-3xl text-[#0A1A2F]">{upcomingBookings}</p>
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Upcoming services
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          onClick={() => handleViewChange("bookings")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl text-[#0A1A2F]">{completedBookings}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Services completed
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          onClick={() => handleViewChange("payments")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-3xl text-[#0A1A2F]">£{totalSpent.toFixed(2)}</p>
                <p className="text-sm text-purple-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  All time
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A1A2F]">Upcoming Bookings</h3>
              <Button
                variant="link"
                className="text-red-600 p-0 h-auto"
                onClick={() => handleViewChange("bookings")}
              >
                View All →
              </Button>
            </div>
            {upcomingBookings === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No upcoming bookings</p>
                <Button
                  onClick={onBookNewService}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Book Your First Service
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings
                  .filter(b => b.status === "upcoming")
                  .slice(0, 3)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleViewChange("bookings")}
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{booking.service}</p>
                        <p className="text-sm text-gray-600">{booking.professional}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-[#0A1A2F] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {bookings.length === 0 && payments.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...bookings, ...payments]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((item, index) => {
                      const isBooking = 'bookingRef' in item && 'professionalEmail' in item;
                      return (
                        <div key={index} className="flex items-start gap-3 border-l-2 border-gray-200 pl-4 pb-3">
                          <div className="flex-1">
                            {isBooking ? (
                              <>
                                <p className="text-sm font-medium text-gray-900">
                                  Booking {(item as Booking).status === "completed" ? "Completed" : "Created"}
                                </p>
                                <p className="text-xs text-gray-600">{(item as Booking).service}</p>
                                <p className="text-xs text-gray-500 mt-1">{(item as Booking).date}</p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-gray-900">Payment Processed</p>
                                <p className="text-xs text-gray-600">{(item as Payment).service}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(item as Payment).date} • {(item as Payment).amount}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-red-100 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-red-600" />
                )}
              </div>
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs">Uploading...</div>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl text-[#0A1A2F] mb-1">{profileForm.full_name || customerName}</h2>
              <p className="text-gray-600">{customerEmail}</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="mt-3"
                onClick={handleChangePhotoClick}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  value={customerEmail}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Property Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setProfileForm({ full_name: customerName, phone: customerPhone })}
                disabled={isUpdatingProfile}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Addresses Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl text-[#0A1A2F]">Saved Addresses</h3>
            <Button
              onClick={handleAddAddress}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Address
            </Button>
          </div>

          {isLoadingAddresses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              <span className="ml-3 text-gray-600">Loading addresses...</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No saved addresses yet</p>
              <Button
                variant="outline"
                onClick={handleAddAddress}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{address.label}</p>
                      {address.isDefault && (
                        <Badge className="bg-green-100 text-green-700">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.postcode}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      title="Edit address"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        title="Set as default"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-[#0A1A2F] mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { id: "booking", label: "Booking Confirmations", description: "Get notified when bookings are confirmed" },
              { id: "reminder", label: "Service Reminders", description: "Receive reminders before scheduled services" },
              { id: "report", label: "Report Uploads", description: "Notification when reports are available" },
              { id: "marketing", label: "Marketing Emails", description: "Receive updates and special offers" },
            ].map((pref) => (
              <div key={pref.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pref.label}</p>
                  <p className="text-sm text-gray-600">{pref.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-[#0A1A2F] mb-4">Account Security</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">Change Password</Button>
            <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your bookings and services.</p>
      </div>

      <div className="space-y-3">
        {bookings.slice(0, 3).map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {booking.status === "upcoming" ? "Upcoming Service Reminder" : "Service Completed"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.service} scheduled for {booking.date} at {booking.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No notifications yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return renderOverview();
      case "bookings":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl text-[#0A1A2F] mb-2">My Bookings</h1>
              <p className="text-gray-600">View and manage all your fire safety service bookings.</p>
            </div>
            <CustomerBookings
              bookings={bookings}
              onUpdateBooking={onUpdateBooking}
              onDeleteBooking={onDeleteBooking}
            />
          </div>
        );
      case "payments":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl text-[#0A1A2F] mb-2">Payment History</h1>
              <p className="text-gray-600">View your transaction history and download invoices.</p>
            </div>
            <CustomerPayments payments={payments} />
          </div>
        );
      case "profile":
        // Check if we're on the add address route (child of profile)
        if (isAddAddressRoute) {
          return <AddAddress />;
        }
        // Check if we're on the edit address route (child of profile)
        if (isEditAddressRoute) {
          return <EditAddress />;
        }
        return renderProfile();
      case "certification":
        // Check if we're on the add certification route
        if (isAddCertificationRoute) {
          return <AddCertification />;
        }
        // Check if we're on the edit certification route
        if (isEditCertificationRoute) {
          return <EditCertification />;
        }
        return <ProfessionalCertifications />;
      case "pricing":
        // Check if we're on the add pricing route
        if (isAddPricingRoute) {
          return <AddPricing />;
        }
        // Check if we're on the edit pricing route
        if (isEditPricingRoute) {
          return <EditPricing />;
        }
        return <ProfessionalPricingContent />;
      case "available_date":
        // Check if we're on the add or edit available date route
        if (isAddAvailableDateRoute) {
          return <AddAvailableDate />;
        }
        if (isEditAvailableDateRoute) {
          return <EditAvailableDate />;
        }
        return <AvailableDatesContent />;
      case "insurance":
        // Check if we're on the add insurance route
        if (isAddInsuranceRoute) {
          return <AddInsurance />;
        }
        // Check if we're on the edit insurance route
        if (isEditInsuranceRoute) {
          return <EditInsurance />;
        }
        return <InsuranceContent />;
      case "addresses":
        return <Addresses />;
      case "settings":
        return renderSettings();
      case "notifications":
        return renderNotifications();
      case "specializations":
        // Check if we're on the add specialization route
        if (isAddSpecializationRoute) {
          return <AddSpecialization />;
        }
        // Check if we're on the edit specialization route
        if (isEditSpecializationRoute) {
          return <EditSpecialization />;
        }
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl text-[#0A1A2F] mb-2">Specializations</h1>
                <p className="text-gray-600">Manage professional specializations and categories.</p>
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700 whitespace-nowrap"
                onClick={() => navigate("/customer/dashboard/specializations/add")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Specializations
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                {isLoadingSpecializations ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600 mr-2" />
                    <span className="text-gray-600">Loading specializations...</span>
                  </div>
                ) : specializations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No specializations found</p>
                    <p className="text-sm">No specializations have been added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {specializations.map((specialization) => {
                      const createdDate = new Date(specialization.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                      const updatedDate = specialization.updated_at && specialization.updated_at !== specialization.created_at
                        ? new Date(specialization.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : null;

                      return (
                        <div
                          key={specialization.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-red-200 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Tag className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 mb-1">{specialization.title}</h4>
                                  <div className="text-xs text-gray-500 space-y-1">
                                    <div>
                                      Created: {createdDate}
                                      {specialization.creator && ` • By ${specialization.creator.full_name}`}
                                    </div>
                                    {updatedDate && (
                                      <div>
                                        Updated: {updatedDate}
                                        {specialization.updater && ` • By ${specialization.updater.full_name}`}
                                      </div>
                                    )}
                                    {specialization.professional && (
                                      <div>
                                        Professional ID: {specialization.professional.id}
                                        {specialization.professional.name && ` • ${specialization.professional.name}`}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => navigate(`/customer/dashboard/specializations/edit/${specialization.id}`)}
                                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded"
                                  aria-label="Edit specialization"
                                  type="button"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSpecializationToDelete(specialization);
                                    setDeleteSpecializationModalOpen(true);
                                  }}
                                  className="p-1 text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded"
                                  aria-label="Delete specialization"
                                  type="button"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteSpecializationModalOpen} onOpenChange={setDeleteSpecializationModalOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#0A1A2F]">
                    Delete Specialization
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{specializationToDelete?.title}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteSpecializationModalOpen(false);
                      setSpecializationToDelete(null);
                    }}
                    disabled={isDeletingSpecialization}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      if (!specializationToDelete) return;

                      const token = getApiToken();
                      if (!token) {
                        toast.error("Please log in to delete specialization.");
                        setDeleteSpecializationModalOpen(false);
                        setSpecializationToDelete(null);
                        return;
                      }
                      
                      setIsDeletingSpecialization(true);
                      try {
                        const response = await deleteSpecialization({
                          api_token: token,
                          id: specializationToDelete.id
                        });

                        if (response.status === "success" || response.success || (response.message && !response.error)) {
                          toast.success(response.message || "Specialization deleted successfully!");
                          setDeleteSpecializationModalOpen(false);
                          setSpecializationToDelete(null);
                          // Refresh the specializations list
                          const data = await fetchSpecializations();
                          setSpecializations(data);
                        } else {
                          toast.error(response.message || response.error || "Failed to delete specialization. Please try again.");
                        }
                      } catch (error: any) {
                        const errorMessage = error?.message || error?.error || "An error occurred while deleting specialization. Please try again.";
                        toast.error(errorMessage);
                      } finally {
                        setIsDeletingSpecialization(false);
                      }
                    }}
                    disabled={isDeletingSpecialization}
                  >
                    {isDeletingSpecialization ? "Deleting..." : "Sure"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    //     <div className="min-h-screen bg-gray-50 overflow-x-hidden w-full"> 
    <div className="h-screen bg-gray-50 overflow-hidden w-full flex flex-col">
      {/* Top Header */}
      <header className="bg-[#0A1A2F] text-white py-3 md:py-4 px-4 md:px-6 sticky top-0 z-50 w-full">
        <div className="flex items-center justify-between w-full max-w-full">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:text-red-500 hover:bg-transparent p-1.5"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onNavigateHome}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0" aria-hidden="true">
                <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"></path>
              </svg>
              <span className="text-lg font-semibold text-white">Fire Guide</span>
              <Badge variant="outline" className="text-white border-white hidden md:inline-flex">Customer</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-red-500 hover:bg-transparent relative p-1.5"
              onClick={() => handleViewChange("notifications")}
            >
              <Bell className="w-5 h-5" />
              {bookings.filter(b => b.status === "upcoming").length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-red-500 hover:bg-transparent hidden md:flex p-1.5"
              onClick={() => handleViewChange("settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-red-500 hover:bg-transparent p-1.5 md:px-3"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

{/*  <div className="flex w-full overflow-x-hidden"> */}
      <div className="flex w-full overflow-hidden flex-1 min-h-0">
        {/* Sidebar - Full Slide-in Panel */}
        <aside
        //  className={`fixed lg:sticky left-0 bg-white border-r w-64 z-30 transition-transform lg:translate-x-0 lg:top-[73px] lg:h-[calc(100vh-73px)] $
        //   {sidebarOpen ? "translate-x-0" : "-translate-x-full"
          className={`fixed lg:sticky left-0 bg-white border-r w-64 z-30 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${sidebarOpen ? "top-0 h-screen" : "top-[73px] h-[calc(100vh-73px)]"} lg:!top-[73px] lg:!h-[calc(100vh-73px)]`}
        >
          <div className="p-6 pt-16 lg:pt-6 h-full flex flex-col overflow-hidden">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <nav className="space-y-2 flex-1 mt-6 lg:mt-0 overflow-y-auto min-h-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleViewChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px] ${isActive
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === "notifications" && bookings.filter(b => b.status === "upcoming").length > 0 && (
                      <Badge className="ml-auto bg-red-600 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs flex-shrink-0">
                        {bookings.filter(b => b.status === "upcoming").length}
                      </Badge>
                    )}
                  </button>
                );
              })}
              
              {userRole && (
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 cursor-default min-h-[44px]">
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">
                    {userRole === "PROFESSIONAL" ? "Professional" : 
                     userRole === "ADMIN" ? "Admin" : "User"}
                  </span>
                </button>
              )}

            </nav>

            <div className="space-y-2 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        {/*  <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-x-hidden"> */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-y-auto overflow-x-hidden h-[calc(100vh-73px)] lg:ml-64">
          <div className="max-w-9xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteAddress}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteAddress}
            >
              Sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}