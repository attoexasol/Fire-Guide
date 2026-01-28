import React, { useState, useEffect, useRef, startTransition } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CustomerBookings } from "./CustomerBookings";
import { CustomerPayments } from "./CustomerPayments";
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
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Booking } from "../App";
import { Payment } from "../App";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import logoImage from "figma:asset/629703c093c2f72bf409676369fecdf03c462cd2.png";
import { uploadProfileImage, UploadProfileImageRequest, updateUser, UpdateUserRequest, getCustomerDashboardSummary, CustomerDashboardSummaryData, getCustomerUpcomingBookings, CustomerUpcomingBookingItem, getCustomerData, updateCustomerData, UpdateCustomerDataRequest, changePassword, getCustomerNotifications, CustomerNotificationItem, deleteAccount, getRecentActivity, RecentActivityItem, enableNotification, disableNotification, NotificationPreferencesData, getNotificationPreferences } from "../api/authService";
import { getApiToken, getUserInfo, setUserInfo } from "../lib/auth";
import { Loader2, Upload, ArrowLeft, Save } from "lucide-react";
import { storeAddress, StoreAddressRequest, fetchAddresses, AddressResponse, deleteAddress, updateAddress } from "../api/addressService";

interface CustomerDashboardProps {
  onLogout: () => void;
  onBookNewService: () => void;
  bookings: Booking[];
  payments: Payment[];
  onUpdateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  onDeleteBooking: (bookingId: string) => void;
}

type CustomerView = "overview" | "bookings" | "payments" | "profile" | "settings" | "notifications";

export function CustomerDashboard({ 
  onLogout, 
  onBookNewService,
  bookings,
  payments,
  onUpdateBooking,
  onDeleteBooking
}: CustomerDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { view, id: addressIdParam } = useParams<{ view?: string; id?: string }>();
  const validViews: CustomerView[] = ["overview", "bookings", "payments", "profile", "settings", "notifications"];
  
  // Check if we're on the add or edit address route
  const isAddAddressRoute = location.pathname === "/customer/dashboard/profile/addresses/add";
  const isEditAddressRoute = location.pathname.startsWith("/customer/dashboard/profile/addresses/edit/");
  
  // Safely parse address ID from URL parameter
  let addressIdToEdit: number | null = null;
  if (isEditAddressRoute && addressIdParam) {
    const parsedId = parseInt(addressIdParam, 10);
    if (!isNaN(parsedId) && parsedId > 0) {
      addressIdToEdit = parsedId;
    } else {
      console.error("Invalid address ID in URL:", addressIdParam);
    }
  }
  
  // Determine current view from URL parameter, default to "overview"
  const currentViewFromUrl: CustomerView = (view && validViews.includes(view as CustomerView)) 
    ? (view as CustomerView) 
    : "overview";
  
  const [currentView, setCurrentView] = useState<CustomerView>(currentViewFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Sync state with URL parameter when it changes (including on mount and URL changes)
  useEffect(() => {
    // If on add or edit address route, set view to profile
    if (isAddAddressRoute || isEditAddressRoute) {
      setCurrentView("profile");
    } else {
      setCurrentView(currentViewFromUrl);
    }
  }, [currentViewFromUrl, isAddAddressRoute, isEditAddressRoute]);

  // Fetch addresses from API
  useEffect(() => {
    const loadAddresses = async () => {
      const token = getApiToken();
      if (!token) {
        return;
      }

      setIsLoadingAddresses(true);
      try {
        const response = await fetchAddresses(token);
        if (response.status === "success" && response.data) {
          setAddresses(response.data);
        } else {
          console.error("Failed to fetch addresses:", response.message || response.error);
          // Set empty array on error to show empty state
          setAddresses([]);
        }
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
        toast.error(error?.message || "Failed to load addresses. Please try again.");
        // Set empty array on error to show empty state
        setAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    // Fetch addresses when profile view is active or when component mounts
    loadAddresses();
  }, [currentView, isAddAddressRoute, isEditAddressRoute]); // Refetch when view changes or after adding/editing address

  // Load address data when on edit route
  useEffect(() => {
    const loadAddressForEdit = async () => {
      if (!isEditAddressRoute || !addressIdToEdit) {
        return;
      }

      const token = getApiToken();
      if (!token) {
        toast.error("Please log in to edit address.");
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
        return;
      }

      setIsLoadingEditAddress(true);
      try {
        // Always fetch from API to ensure we have the latest data
        const response = await fetchAddresses(token);
        
        if (response.status === "success" && response.data) {
          // Update addresses state
          setAddresses(response.data);
          
          // Validate address ID type matching (ensure both are numbers for comparison)
          const addressToEdit = response.data.find(addr => {
            const addrId = typeof addr.id === 'string' ? parseInt(addr.id, 10) : addr.id;
            const editId = addressIdToEdit;
            return addrId === editId && !isNaN(addrId) && !isNaN(editId);
          });
          
          if (addressToEdit) {
            setEditAddressForm({
              tag: addressToEdit.tag,
              adress_line: addressToEdit.adress_line,
              city: addressToEdit.city,
              postal_code: addressToEdit.postal_code,
              country: addressToEdit.country,
              is_default_address: addressToEdit.is_default_address === 1,
              is_favourite_address: addressToEdit.is_favourite_address === 1
            });
          } else {
            toast.error("Address not found. It may have been deleted.");
            startTransition(() => {
              navigate("/customer/dashboard/profile");
            });
          }
        } else {
          toast.error(response.message || response.error || "Failed to load address data");
          startTransition(() => {
            navigate("/customer/dashboard/profile");
          });
        }
      } catch (error: any) {
        console.error("Error loading address for edit:", error);
        
        // Handle 404 specifically
        if (error?.status === 404 || error?.response?.status === 404) {
          toast.error("Address not found. It may have been deleted.");
        } else if (error?.message?.includes("404") || error?.error?.includes("404")) {
          toast.error("Address not found. It may have been deleted.");
        } else if (error?.message?.toLowerCase().includes("not found")) {
          toast.error("Address not found. It may have been deleted.");
        } else {
          toast.error(error?.message || error?.error || "Failed to load address. Please try again.");
        }
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
      } finally {
        setIsLoadingEditAddress(false);
      }
    };

    loadAddressForEdit();
  }, [isEditAddressRoute, addressIdToEdit, navigate]);
  
  // Handler to update both state and URL
  const handleViewChange = (view: CustomerView) => {
    setCurrentView(view);
    startTransition(() => {
      if (view === "overview") {
        navigate("/customer/dashboard", { replace: true });
      } else {
        navigate(`/customer/dashboard/${view}`, { replace: true });
      }
    });
  };
  
  // Address management state
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    postcode: "",
    country: "United Kingdom"
  });
  
  // Add Address form state
  const [addAddressForm, setAddAddressForm] = useState({
    tag: "",
    adress_line: "",
    city: "",
    postal_code: "",
    country: "United Kingdom",
    is_default_address: false,
    is_favourite_address: false
  });
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Edit Address form state
  const [editAddressForm, setEditAddressForm] = useState({
    tag: "",
    adress_line: "",
    city: "",
    postal_code: "",
    country: "United Kingdom",
    is_default_address: false,
    is_favourite_address: false
  });
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isLoadingEditAddress, setIsLoadingEditAddress] = useState(false);

  // Delete Address confirmation modal state
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState<number | null>(null);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  // Password change state
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<CustomerNotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Delete account state
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Recent activity state
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [isLoadingRecentActivity, setIsLoadingRecentActivity] = useState(false);

  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferencesData | null>(null);
  const [isLoadingNotificationPreferences, setIsLoadingNotificationPreferences] = useState(false);
  const [updatingNotification, setUpdatingNotification] = useState<string | null>(null);

  // Load user data from localStorage or use defaults
  const getUserData = () => {
    const userInfo = getUserInfo();
    return {
      name: userInfo?.name || "John Smith",
      email: "john.smith@example.com", // Email should come from API in real implementation
      phone: "07123 456789" // Phone should come from API in real implementation
    };
  };

  const initialUserData = getUserData();
  const [customerName, setCustomerName] = useState(initialUserData.name);
  const [customerEmail, setCustomerEmail] = useState(initialUserData.email); // Email now updates dynamically
  
  // Profile image state
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(() => {
    // Load from localStorage on mount
    const storedImage = localStorage.getItem('customer_profile_image');
    return storedImage || null;
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview before upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile form state - initialize with current user data
  const [profileForm, setProfileForm] = useState(() => {
    const userData = getUserData();
    return {
      full_name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      property_type: "Residential", // Default value
      property_type_id: 18 // Default ID (will be updated from API)
    };
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  
  // Fetch customer data from API when profile view is shown
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (currentView !== 'profile') return;
      
      const token = getApiToken();
      if (!token) {
        console.log('No API token available for customer data');
        setIsLoadingCustomerData(false);
        return;
      }

      setIsLoadingCustomerData(true);
      try {
        const response = await getCustomerData(token);
        if (response.status === true && response.data) {
          const customerData = response.data;
          
          // Update profile form with API data
          setProfileForm({
            full_name: customerData.full_name || initialUserData.name,
            email: customerData.email || initialUserData.email,
            phone: customerData.phone || initialUserData.phone,
            property_type: customerData.property_type?.name || "Residential",
            property_type_id: customerData.property_type?.id || 18
          });
          
          // Update customer name and email if different
          if (customerData.full_name && customerData.full_name !== customerName) {
            setCustomerName(customerData.full_name);
          }
          
          if (customerData.email && customerData.email !== customerEmail) {
            setCustomerEmail(customerData.email);
          }
          
          // Update profile image from API if available
          if (customerData.image) {
            setProfileImageUrl(customerData.image);
            localStorage.setItem('customer_profile_image', customerData.image);
          }
          
          console.log('Customer data loaded from API:', customerData);
        } else {
          console.error('Failed to fetch customer data:', response.message || response.error);
        }
      } catch (error: any) {
        console.error('Error fetching customer data:', error);
      } finally {
        setIsLoadingCustomerData(false);
      }
    };

    fetchCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Dashboard summary state for API data
  const [dashboardSummary, setDashboardSummary] = useState<CustomerDashboardSummaryData | null>(null);
  const [isLoadingDashboardSummary, setIsLoadingDashboardSummary] = useState(true); // Start with loading true

  // Upcoming bookings state for API data
  const [upcomingBookingsList, setUpcomingBookingsList] = useState<CustomerUpcomingBookingItem[]>([]);
  const [isLoadingUpcomingBookings, setIsLoadingUpcomingBookings] = useState(true);

  // Fetch dashboard summary from API
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      const token = getApiToken();
      if (!token) {
        console.log('No API token available for dashboard summary');
        setIsLoadingDashboardSummary(false);
        return;
      }

      setIsLoadingDashboardSummary(true);
      try {
        const response = await getCustomerDashboardSummary(token);
        if (response.status === 'success' && response.data) {
          setDashboardSummary(response.data);
        } else {
          console.error('Failed to fetch dashboard summary:', response.message || response.error);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setIsLoadingDashboardSummary(false);
      }
    };

    // Fetch on mount and when view changes to overview
    if (currentView === 'overview') {
      fetchDashboardSummary();
    }
  }, [currentView]);

  // Fetch upcoming bookings from API
  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      const token = getApiToken();
      if (!token) {
        console.log('No API token available for upcoming bookings');
        setIsLoadingUpcomingBookings(false);
        return;
      }

      setIsLoadingUpcomingBookings(true);
      try {
        const response = await getCustomerUpcomingBookings(token);
        if (response.status === 'success' && response.data?.bookings) {
          setUpcomingBookingsList(response.data.bookings);
        } else {
          console.error('Failed to fetch upcoming bookings:', response.message || response.error);
          setUpcomingBookingsList([]);
        }
      } catch (error: any) {
        console.error('Error fetching upcoming bookings:', error);
        setUpcomingBookingsList([]);
      } finally {
        setIsLoadingUpcomingBookings(false);
      }
    };

    // Fetch on mount and when view changes to overview
    if (currentView === 'overview') {
      fetchUpcomingBookings();
    }
  }, [currentView]);

  // Fetch notifications from API on mount and when notifications view is shown
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = getApiToken();
      if (!token) {
        console.log('No API token available for notifications');
        setIsLoadingNotifications(false);
        return;
      }

      // Only show loading spinner when on notifications view
      if (currentView === 'notifications') {
        setIsLoadingNotifications(true);
      }

      try {
        const response = await getCustomerNotifications({ api_token: token });
        if (response.status === true && response.data) {
          setNotifications(Array.isArray(response.data) ? response.data : []);
          console.log('Notifications loaded from API:', response.data);
        } else {
          console.log('No notifications found:', response.message);
          setNotifications([]);
        }
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        if (currentView === 'notifications') {
          setIsLoadingNotifications(false);
        }
      }
    };

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Fetch recent activity from API when overview is shown
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (currentView !== 'overview') return;
      
      const token = getApiToken();
      if (!token) {
        console.log('No API token available for recent activity');
        setIsLoadingRecentActivity(false);
        return;
      }

      setIsLoadingRecentActivity(true);
      try {
        const response = await getRecentActivity({ api_token: token });
        if (response.status === 'success' && response.data) {
          setRecentActivity(Array.isArray(response.data) ? response.data : []);
          console.log('Recent activity loaded from API:', response.data);
        } else {
          console.log('No recent activity found');
          setRecentActivity([]);
        }
      } catch (error: any) {
        console.error('Error fetching recent activity:', error);
        setRecentActivity([]);
      } finally {
        setIsLoadingRecentActivity(false);
      }
    };

    fetchRecentActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Fetch notification preferences from API when settings view is shown
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      // Only fetch when on settings view
      if (currentView !== 'settings') {
        return;
      }
      
      const token = getApiToken();
      if (!token) {
        console.log('No API token available for notification preferences');
        setIsLoadingNotificationPreferences(false);
        return;
      }

      setIsLoadingNotificationPreferences(true);
      try {
        const response = await getNotificationPreferences({ api_token: token });
        console.log('GET notification preferences response:', response);
        console.log('Response success:', response?.success);
        console.log('Response data:', response?.data);
        console.log('Response data type:', typeof response?.data);
        console.log('Response data keys:', response?.data ? Object.keys(response.data) : 'no data');
        
        // Check for both 'success' and 'status' fields
        const isSuccess = response?.success === true || response?.status === true;
        
        if (isSuccess && response?.data) {
          const d = response.data;
          
          // Ensure we have the data object with all required fields
          if (!d || typeof d !== 'object') {
            console.error('Invalid data structure in API response:', d);
            setNotificationPreferences(null);
            return;
          }
          
          // Debug: Log each value before conversion
          console.log('Raw API values:', {
            is_booking_confirmation: d.is_booking_confirmation,
            is_service_reminders: d.is_service_reminders,
            report_uploads: d.report_uploads,
            marketing_emails: d.marketing_emails,
          });
          
          // Coerce any value to boolean, then to 1/0. Handles true/false, 1/0, "true"/"false"
          const toOnOff = (v: unknown): number => {
            if (v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true') {
              return 1;
            }
            return 0;
          };
          
          const preferencesData: NotificationPreferencesData = {
            id: 0,
            is_booking_confirmation: toOnOff(d.is_booking_confirmation),
            is_service_reminders: toOnOff(d.is_service_reminders),
            report_uploads: toOnOff(d.report_uploads),
            marketing_emails: toOnOff(d.marketing_emails),
            user_id: 0,
            created_at: '',
            updated_at: '',
          };
          
          console.log('Converted notification preferences:', preferencesData);
          console.log('Expected toggle states:', {
            booking: preferencesData.is_booking_confirmation === 1 ? 'ON' : 'OFF',
            reminder: preferencesData.is_service_reminders === 1 ? 'ON' : 'OFF',
            report: preferencesData.report_uploads === 1 ? 'ON' : 'OFF',
            marketing: preferencesData.marketing_emails === 1 ? 'ON' : 'OFF',
          });
          
          // Set state - React will batch this update
          setNotificationPreferences(preferencesData);
        } else {
          console.log('No notification preferences found or success is false. Response:', response);
          setNotificationPreferences(null);
        }
      } catch (error: any) {
        console.error('Error fetching notification preferences:', error);
      } finally {
        setIsLoadingNotificationPreferences(false);
      }
    };

    fetchNotificationPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Debug: Log whenever notificationPreferences state changes
  useEffect(() => {
    console.log('notificationPreferences state changed:', notificationPreferences);
    if (notificationPreferences) {
      console.log('Current toggle values from state:', {
        booking: notificationPreferences.is_booking_confirmation,
        reminder: notificationPreferences.is_service_reminders,
        report: notificationPreferences.report_uploads,
        marketing: notificationPreferences.marketing_emails,
      });
    }
  }, [notificationPreferences]);

  // Use API data for stats - show 0 while loading, then API data
  const upcomingBookings = isLoadingDashboardSummary ? 0 : (dashboardSummary?.jobs?.upcoming ?? 0);
  const completedBookings = isLoadingDashboardSummary ? 0 : (dashboardSummary?.jobs?.completed ?? 0);
  const totalSpent = isLoadingDashboardSummary ? 0 : (dashboardSummary?.spending?.total_spent ? parseFloat(dashboardSummary.spending.total_spent) : 0);

  // Profile image upload handlers
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    // Create preview URL immediately for better UX
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to upload profile image.");
      URL.revokeObjectURL(previewUrl); // Clean up preview
      setImagePreview(null);
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadData: UploadProfileImageRequest = {
        api_token: token,
        file: file
      };

      const response = await uploadProfileImage(uploadData);

      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (response.status === true || response.image_url) {
        const imageUrl = response.image_url || "";
        setProfileImageUrl(imageUrl);
        setImagePreview(null); // Clear preview after successful upload
        // Store in localStorage to persist across sessions
        localStorage.setItem('customer_profile_image', imageUrl);
        toast.success(response.message || "Profile image updated successfully!");
      } else {
        setImagePreview(null); // Clear preview on error
        toast.error(response.message || response.error || "Failed to upload profile image. Please try again.");
      }
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setImagePreview(null);
      const errorMessage = error?.message || error?.error || "An error occurred while uploading the image. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Profile update handler
  const handleSaveProfile = async () => {
    if (!profileForm?.full_name?.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!profileForm?.email?.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!profileForm?.phone?.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to update profile.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      // Map property type name to ID (you may need to adjust these mappings based on your API)
      const propertyTypeMap: Record<string, number> = {
        "Residential": 18,
        "Commercial": 19,
        "Industrial": 20
      };
      
      const propertyTypeId = profileForm.property_type_id || propertyTypeMap[profileForm.property_type || "Residential"] || 18;

      const updateData: UpdateCustomerDataRequest = {
        api_token: token,
        full_name: profileForm.full_name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        property_type_id: propertyTypeId
      };

      const response = await updateCustomerData(updateData);

      if (response.status === true) {
        // Update local state
        setCustomerName(profileForm.full_name.trim());
        setCustomerEmail(profileForm.email.trim());
        // Update localStorage if needed
        const userInfo = getUserInfo();
        if (userInfo) {
          setUserInfo(profileForm.full_name.trim(), userInfo.role);
        }
        
        // Update property_type_id from response
        if (response.data?.property_type_id) {
          setProfileForm(prev => ({
            ...prev,
            property_type_id: response.data.property_type_id
          }));
        }
        
        toast.success(response.message || "Profile updated successfully!");
      } else {
        toast.error(response.message || response.error || "Failed to update profile. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage = error?.message || error?.error || "An error occurred while updating the profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password change handler
  const handleChangePassword = async () => {
    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
      
      // Validate password length
      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long!");
        return;
      }
      
      // Validate current password is provided
      if (!currentPassword.trim()) {
        toast.error("Current password is required!");
        return;
      }

      const apiToken = getApiToken();
      
      if (!apiToken) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      setIsChangingPassword(true);
      
      console.log("Changing password...");
      const response = await changePassword({
        api_token: apiToken,
        current_password: currentPassword.trim(),
        new_password: newPassword.trim(),
        new_password_confirmation: confirmPassword.trim(),
      });
      
      console.log("Change password response:", response);
      
      if (response.status === true) {
        toast.success(response.message || "Password changed successfully!");
        // Clear password fields on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangePasswordDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          error?.error || 
                          "An error occurred while changing the password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Address management handlers
  const handleAddAddress = () => {
    startTransition(() => {
      navigate("/customer/dashboard/profile/addresses/add");
    });
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addAddressForm.tag.trim() || !addAddressForm.adress_line.trim() || 
        !addAddressForm.city.trim() || !addAddressForm.postal_code.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to add an address.");
      return;
    }

    setIsSubmittingAddress(true);
    try {
      const addressData: StoreAddressRequest = {
        api_token: token,
        tag: addAddressForm.tag.trim(),
        adress_line: addAddressForm.adress_line.trim(),
        city: addAddressForm.city.trim(),
        postal_code: addAddressForm.postal_code.trim(),
        country: addAddressForm.country,
        is_default_address: addAddressForm.is_default_address,
        is_favourite_address: addAddressForm.is_favourite_address
      };

      const response = await storeAddress(addressData);

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        toast.success(response.message || "Address added successfully!");
        // Reset form
        setAddAddressForm({
          tag: "",
          adress_line: "",
          city: "",
          postal_code: "",
          country: "United Kingdom",
          is_default_address: false,
          is_favourite_address: false
        });
        // Fetch updated addresses list
        const token = getApiToken();
        if (token) {
          try {
            const addressesResponse = await fetchAddresses(token);
            if (addressesResponse.status === "success" && addressesResponse.data) {
              setAddresses(addressesResponse.data);
            }
          } catch (error) {
            console.error("Error refreshing addresses:", error);
          }
        }
        // Navigate back to profile
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
      } else {
        toast.error(response.message || response.error || "Failed to add address. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding address:", error);
      const errorMessage = error?.message || error?.error || "An error occurred while adding the address. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleBackToProfile = () => {
    startTransition(() => {
      navigate("/customer/dashboard/profile");
    });
  };

  const handleEditAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editAddressForm.tag.trim() || !editAddressForm.adress_line.trim() || 
        !editAddressForm.city.trim() || !editAddressForm.postal_code.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Get the address ID from the route parameter or state
    const currentAddressId = addressIdToEdit;
    
    if (!currentAddressId || isNaN(currentAddressId)) {
      toast.error("Invalid address ID. Please try again.");
      console.error("Invalid address ID:", currentAddressId);
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to update address.");
      return;
    }

      setIsUpdatingAddress(true);
    try {
      // Ensure ID is a number for the API
      const addressIdForApi = typeof currentAddressId === 'string' ? parseInt(currentAddressId, 10) : currentAddressId;
      
      // Validate address ID is valid
      if (!addressIdForApi || isNaN(addressIdForApi) || addressIdForApi <= 0) {
        toast.error("Invalid address ID. Please try again.");
        console.error("Invalid address ID:", currentAddressId);
        return;
      }
      
      console.log("Updating address with ID:", addressIdForApi);
      console.log("Update data:", {
        id: addressIdForApi,
        tag: editAddressForm.tag.trim(),
        adress_line: editAddressForm.adress_line.trim(),
        city: editAddressForm.city.trim(),
        postal_code: editAddressForm.postal_code.trim(),
        country: editAddressForm.country,
        is_default_address: editAddressForm.is_default_address,
        is_favourite_address: editAddressForm.is_favourite_address
      });

      const response = await updateAddress({
        api_token: token,
        id: addressIdForApi,
        tag: editAddressForm.tag.trim(),
        adress_line: editAddressForm.adress_line.trim(),
        city: editAddressForm.city.trim(),
        postal_code: editAddressForm.postal_code.trim(),
        country: editAddressForm.country,
        is_default_address: editAddressForm.is_default_address,
        is_favourite_address: editAddressForm.is_favourite_address
      });

      console.log("Update response:", response);

      // Check for successful response - handle various response formats
      // API returns status: true (boolean) on success, status: false on error, or status: "success" (string)
      const status = response.status as any; // Can be boolean or string
      const successFlag = response.success;
      
      // Handle error response from API (status is false or success is false)
      if (status === false || status === "false" || successFlag === false) {
        const errorMsg = response.message || response.error || "Failed to update address. Please try again.";
        console.error("Address update failed:", errorMsg, "Response:", response);
        toast.error(errorMsg);
        return;
      }

      // Check for success - API returns status: true (boolean) or status: "success" (string)
      const isSuccess = status === true || 
                       status === "success" ||
                       status === "true" ||
                       successFlag === true || 
                       (response.message && !response.error && status !== false && status !== "false");

      if (isSuccess) {
        // Use response data if available, otherwise use form data
        const updatedAddressData = response.data || {
          id: currentAddressId,
          tag: editAddressForm.tag.trim(),
          adress_line: editAddressForm.adress_line.trim(),
          city: editAddressForm.city.trim(),
          postal_code: editAddressForm.postal_code.trim(),
          country: editAddressForm.country,
          is_default_address: editAddressForm.is_default_address ? 1 : 0,
          is_favourite_address: editAddressForm.is_favourite_address ? 1 : 0,
          updated_at: new Date().toISOString()
        };

        // Immediately update local state for instant UI update (handle both string and number IDs)
        setAddresses(prevAddresses => 
          prevAddresses.map(addr => {
            const addrId = typeof addr.id === 'string' ? parseInt(addr.id, 10) : addr.id;
            return addrId === currentAddressId 
              ? {
                  ...addr,
                  ...updatedAddressData,
                  // Ensure numeric format for boolean fields
                  is_default_address: typeof updatedAddressData.is_default_address === 'boolean' 
                    ? (updatedAddressData.is_default_address ? 1 : 0)
                    : updatedAddressData.is_default_address,
                  is_favourite_address: typeof updatedAddressData.is_favourite_address === 'boolean'
                    ? (updatedAddressData.is_favourite_address ? 1 : 0)
                    : updatedAddressData.is_favourite_address,
                }
              : addr;
          })
        );

        toast.success(response.message || "Address updated successfully!");
        
        // Navigate back to profile - the UI is already updated above
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
        
        // Refresh addresses from API in the background to ensure consistency with server
        // Use a small delay to let navigation complete, then refresh
        const refreshAddresses = async () => {
          try {
            const addressesResponse = await fetchAddresses(token);
            if (addressesResponse.status === "success" && addressesResponse.data) {
              setAddresses(addressesResponse.data);
            }
          } catch (refreshError) {
            console.error("Error refreshing addresses after update:", refreshError);
            // Don't show error to user since update was successful and UI is already updated
          }
        };
        
        // Refresh immediately after a brief delay to let navigation settle
        setTimeout(refreshAddresses, 200);
      } else {
        // Handle case where response doesn't indicate success
        const errorMsg = response.message || response.error || "Failed to update address. Please try again.";
        console.error("Update failed. Response:", response);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Error updating address:", error);
      console.error("Attempted to update address ID:", currentAddressId);
      
      // Handle 404 specifically
      if (error?.status === 404 || error?.response?.status === 404) {
        toast.error("Address not found. It may have been deleted.");
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
      } else if (error?.message?.includes("404") || error?.error?.includes("404")) {
        toast.error("Address not found. It may have been deleted.");
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
      } else if (error?.message?.toLowerCase().includes("not found")) {
        toast.error("Address not found. It may have been deleted.");
        startTransition(() => {
          navigate("/customer/dashboard/profile");
        });
      } else {
        const errorMessage = error?.message || error?.error || "An error occurred while updating the address. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleEditAddress = (address: AddressResponse) => {
    // Validate address ID before navigating
    if (!address || address.id === null || address.id === undefined) {
      toast.error("Invalid address data. Cannot edit this address.");
      console.error("Invalid address:", address);
      return;
    }
    
    const addressId = typeof address.id === 'string' ? parseInt(address.id, 10) : address.id;
    if (isNaN(addressId) || addressId <= 0) {
      toast.error("Invalid address ID. Cannot edit this address.");
      console.error("Invalid address ID:", address.id);
      return;
    }
    
    startTransition(() => {
      navigate(`/customer/dashboard/profile/addresses/edit/${addressId}`);
    });
  };

  const handleDeleteAddress = (id: number) => {
    setAddressIdToDelete(id);
    setIsDeleteAddressModalOpen(true);
  };

  const handleDeleteCancel = () => {
    if (!isDeletingAddress) {
      setIsDeleteAddressModalOpen(false);
      setAddressIdToDelete(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!addressIdToDelete) {
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to delete address.");
      setIsDeleteAddressModalOpen(false);
      setAddressIdToDelete(null);
      return;
    }

    setIsDeletingAddress(true);
    try {
      const response = await deleteAddress({ api_token: token, id: addressIdToDelete });
      
      const deleteStatus = response.status as any; // Can be boolean or string
      if ((deleteStatus === true || deleteStatus === "success" || deleteStatus === "true") || response.success === true) {
        // Save the deleted ID before clearing state
        const deletedAddressId = addressIdToDelete;
        
        // Immediately remove from local state for instant UI update (handle both string and number IDs)
        setAddresses(prevAddresses => prevAddresses.filter(addr => {
          const addrId = typeof addr.id === 'string' ? parseInt(addr.id, 10) : addr.id;
          return addrId !== deletedAddressId;
        }));
        
        // Close modal immediately
        setIsDeleteAddressModalOpen(false);
        setAddressIdToDelete(null);
        
        // Show success message
        toast.success(response.message || "Address deleted successfully");
        
        // Refresh addresses from API in the background to ensure consistency
        try {
          const addressesResponse = await fetchAddresses(token);
          if (addressesResponse.status === "success" && addressesResponse.data) {
            setAddresses(addressesResponse.data);
          }
        } catch (refreshError) {
          console.error("Error refreshing addresses after delete:", refreshError);
          // Don't show error to user since deletion was successful
        }
        
        // If we're on the edit page for the deleted address, navigate back to profile
        if (isEditAddressRoute && deletedAddressId === addressIdToEdit) {
          startTransition(() => {
            navigate("/customer/dashboard/profile");
          });
        }
      } else {
        toast.error(response.message || response.error || "Failed to delete address");
      }
    } catch (error: any) {
      console.error("Error deleting address:", error);
      
      // Handle 404 specifically
      if (error?.status === 404 || error?.response?.status === 404) {
        // Address might already be deleted, remove from local state anyway (handle both string and number IDs)
        setAddresses(prevAddresses => prevAddresses.filter(addr => {
          const addrId = typeof addr.id === 'string' ? parseInt(addr.id, 10) : addr.id;
          return addrId !== addressIdToDelete;
        }));
        setIsDeleteAddressModalOpen(false);
        setAddressIdToDelete(null);
        toast.error("Address not found. It may have already been deleted.");
        
        // If we're on the edit page, navigate back
        if (isEditAddressRoute && addressIdToDelete === addressIdToEdit) {
          startTransition(() => {
            navigate("/customer/dashboard/profile");
          });
        }
      } else {
        toast.error(error?.message || error?.error || "Failed to delete address. Please try again.");
      }
    } finally {
      setIsDeletingAddress(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to update address.");
      return;
    }

    // Find address with proper ID comparison
    const addressToUpdate = addresses.find(addr => {
      const addrId = typeof addr.id === 'string' ? parseInt(addr.id, 10) : addr.id;
      return addrId === id;
    });
    
    if (!addressToUpdate) {
      toast.error("Address not found. Please refresh the page.");
      return;
    }

    try {
      const response = await updateAddress({
        api_token: token,
        id: id,
        tag: addressToUpdate.tag,
        adress_line: addressToUpdate.adress_line,
        city: addressToUpdate.city,
        postal_code: addressToUpdate.postal_code,
        country: addressToUpdate.country,
        is_default_address: true,
        is_favourite_address: addressToUpdate.is_favourite_address === 1
      });

      const setDefaultStatus = response.status as any; // Can be boolean or string
      if ((setDefaultStatus === true || setDefaultStatus === "success" || setDefaultStatus === "true") || response.success === true) {
        // Refresh addresses from API
        const addressesResponse = await fetchAddresses(token);
        if (addressesResponse.status === "success" && addressesResponse.data) {
          setAddresses(addressesResponse.data);
        }
        toast.success(response.message || "Default address updated");
      } else {
        toast.error(response.message || response.error || "Failed to update address");
      }
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast.error(error?.message || "Failed to update address. Please try again.");
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.label || !addressForm.street || !addressForm.city || !addressForm.postcode) {
      toast.error("Please fill in all required fields");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to save address.");
      return;
    }

    if (editingAddress) {
      // Update existing address using API
      try {
        const response = await updateAddress({
          api_token: token,
          id: editingAddress.id,
          tag: addressForm.label,
          adress_line: addressForm.street,
          city: addressForm.city,
          postal_code: addressForm.postcode,
          country: addressForm.country,
          is_default_address: editingAddress.is_default_address === 1,
          is_favourite_address: editingAddress.is_favourite_address === 1
        });

        const saveAddressStatus = response.status as any; // Can be boolean or string
        if ((saveAddressStatus === true || saveAddressStatus === "success" || saveAddressStatus === "true") || response.success === true) {
          // Refresh addresses from API
          const addressesResponse = await fetchAddresses(token);
          if (addressesResponse.status === "success" && addressesResponse.data) {
            setAddresses(addressesResponse.data);
          }
          toast.success(response.message || "Address updated successfully");
        } else {
          toast.error(response.message || response.error || "Failed to update address");
        }
      } catch (error: any) {
        console.error("Error updating address:", error);
        toast.error(error?.message || "Failed to update address. Please try again.");
      }
    } else {
      // Add new address - this shouldn't happen via modal anymore, but handle it
      toast.error("Please use the 'Add New Address' button to add addresses");
    }

    setAddressModalOpen(false);
    setEditingAddress(null);
    setAddressForm({
      label: "",
      street: "",
      city: "",
      postcode: "",
      country: "United Kingdom"
    });
  };

  const menuItems = [
    { id: "overview" as CustomerView, label: "Overview", icon: LayoutDashboard },
    { id: "bookings" as CustomerView, label: "My Bookings", icon: Calendar },
    { id: "payments" as CustomerView, label: "Payments", icon: CreditCard },
    { id: "profile" as CustomerView, label: "My Profile", icon: User },
    { id: "notifications" as CustomerView, label: "Notifications", icon: Bell },
    { id: "settings" as CustomerView, label: "Settings", icon: Settings },
  ];

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
                {isLoadingDashboardSummary ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <p className="text-3xl text-[#0A1A2F]">{upcomingBookings}</p>
                )}
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
                {isLoadingDashboardSummary ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <p className="text-3xl text-[#0A1A2F]">{completedBookings}</p>
                )}
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
                {isLoadingDashboardSummary ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                  </div>
                ) : (
                  <p className="text-3xl text-[#0A1A2F]">£{totalSpent.toFixed(2)}</p>
                )}
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
            {isLoadingUpcomingBookings ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : upcomingBookingsList.length === 0 ? (
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
                {upcomingBookingsList
                  .slice(0, 3)
                  .map((booking) => {
                    // Format the date for display
                    const formattedDate = new Date(booking.selected_date).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    });
                    // Get service name from API, fallback to default
                    const serviceName = booking.service?.service_name || 'Fire Safety Service';
                    
                    // Get professional name - check both full_name and name fields
                    const professionalName = booking.professional?.full_name || booking.professional?.name || 'Professional';
                    
                    return (
                      <div 
                        key={booking.id} 
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleViewChange("bookings")}
                      >
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{serviceName}</p>
                          <p className="text-sm text-gray-600">{professionalName}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formattedDate} at {booking.selected_time}
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-[#0A1A2F] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {isLoadingRecentActivity ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-600">Loading activity...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    // Format date from "2026-01-26 07:56:11" to "2026-01-26"
                    const formatDate = (dateString: string): string => {
                      try {
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0];
                      } catch (error) {
                        return dateString.split(' ')[0]; // Fallback to first part if date parsing fails
                      }
                    };

                    // Check if activity title contains payment-related keywords
                    const isPayment = activity.title.toLowerCase().includes('payment') || 
                                     activity.title.toLowerCase().includes('paid') ||
                                     activity.title.toLowerCase().includes('processed');

                    return (
                      <div key={index} className="flex items-start gap-3 border-l-2 border-gray-200 pl-4 pb-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600">{activity.service_name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.date)}
                            {activity.amount && ` • ${activity.amount}`}
                          </p>
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
              {(profileImageUrl || imagePreview) ? (
                <img
                  src={imagePreview || profileImageUrl || ""}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-red-600" />
                </div>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl text-[#0A1A2F] mb-1">{profileForm?.full_name || customerName}</h2>
              <p className="text-gray-600">{profileForm?.email || customerEmail}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                variant="outline"
                className="mt-3"
                onClick={handleImageClick}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={profileForm?.full_name || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  disabled={isUpdatingProfile}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <input 
                  type="email" 
                  value={profileForm?.email || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  disabled={isUpdatingProfile}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <input 
                  type="tel" 
                  value={profileForm?.phone || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  disabled={isUpdatingProfile}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Property Type</label>
                <select 
                  value={profileForm?.property_type || "Residential"}
                  onChange={(e) => setProfileForm({ ...profileForm, property_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  disabled={isUpdatingProfile}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Reset form to current saved values from API
                  const token = getApiToken();
                  if (token) {
                    // Re-fetch customer data to reset form
                    getCustomerData(token).then(response => {
                      if (response.status === true && response.data) {
                        const customerData = response.data;
                        setProfileForm({
                          full_name: customerData.full_name || initialUserData.name,
                          email: customerData.email || initialUserData.email,
                          phone: customerData.phone || initialUserData.phone,
                          property_type: customerData.property_type?.name || "Residential",
                          property_type_id: customerData.property_type?.id || 18
                        });
                      }
                    }).catch(error => {
                      console.error('Error resetting form:', error);
                      // Fallback to initial values
                      const userData = getUserData();
                      setProfileForm({
                        full_name: customerName,
                        email: customerEmail,
                        phone: userData.phone,
                        property_type: "Residential",
                        property_type_id: 18
                      });
                    });
                  } else {
                    // Fallback to initial values
                    const userData = getUserData();
                    setProfileForm({
                      full_name: customerName,
                      email: customerEmail,
                      phone: userData.phone,
                      property_type: "Residential",
                      property_type_id: 18
                    });
                  }
                }}
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
              Add New Address 
            </Button>
          </div>

          {isLoadingAddresses ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600">Loading addresses...</p>
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
                      <p className="font-medium text-gray-900">{address.tag}</p>
                      {address.is_default_address === 1 && (
                        <Badge className="bg-green-100 text-green-700">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                      {address.is_favourite_address === 1 && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Star className="w-3 h-3 mr-1" />
                          Favourite
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.adress_line}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.postal_code}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {address.is_default_address !== 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const addrId = typeof address.id === 'string' ? parseInt(address.id, 10) : address.id;
                          if (!isNaN(addrId) && addrId > 0) {
                            handleSetDefault(addrId);
                          } else {
                            toast.error("Invalid address ID");
                          }
                        }}
                        title="Set as default"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const addrId = typeof address.id === 'string' ? parseInt(address.id, 10) : address.id;
                        if (!isNaN(addrId) && addrId > 0) {
                          handleDeleteAddress(addrId);
                        } else {
                          toast.error("Invalid address ID");
                        }
                      }}
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

      {/* Address Modal */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your address details" : "Add a new address to your profile"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="address-label">Address Label *</Label>
              <Input
                id="address-label"
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                placeholder="e.g., Home, Office, Warehouse"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address-street">Street Address *</Label>
              <Input
                id="address-street"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                placeholder="123 Main Street"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address-city">City *</Label>
                <Input
                  id="address-city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="London"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="address-postcode">Postcode *</Label>
                <Input
                  id="address-postcode"
                  value={addressForm.postcode}
                  onChange={(e) => setAddressForm({ ...addressForm, postcode: e.target.value })}
                  placeholder="SW1A 1AA"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address-country">Country *</Label>
              <select
                id="address-country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mt-2"
              >
                <option>United Kingdom</option>
                <option>Ireland</option>
                <option>Scotland</option>
                <option>Wales</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setAddressModalOpen(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleSaveAddress}
            >
              {editingAddress ? "Update Address" : "Save Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Address Confirmation Modal */}
      <Dialog open={isDeleteAddressModalOpen} onOpenChange={(open) => {
        if (!open && !isDeletingAddress) {
          handleDeleteCancel();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F]">Delete Address</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 px-4">
            <DialogDescription className="text-base">
              Are you sure you want to delete this address?
            </DialogDescription>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeletingAddress}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeletingAddress}
              className="bg-red-600 hover:bg-red-700 h-10"
            >
              {isDeletingAddress ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Sure"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          {isLoadingNotificationPreferences ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600">Loading preferences...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { id: "booking", label: "Booking Confirmations", description: "Get notified when bookings are confirmed" },
                { id: "reminder", label: "Service Reminders", description: "Receive reminders before scheduled services" },
                { id: "report", label: "Report Uploads", description: "Notification when reports are available" },
                { id: "marketing", label: "Marketing Emails", description: "Receive updates and special offers" },
              ].map((pref) => {
                const isChecked = getNotificationValue(pref.id);
                const isUpdating = updatingNotification === pref.id;

                return (
                  <div key={pref.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{pref.label}</p>
                      <p className="text-sm text-gray-600">{pref.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleNotificationToggle(pref.id, e.target.checked)}
                        disabled={isUpdating}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUpdating && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-3 h-3 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-[#0A1A2F] mb-4">Account Security</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsChangePasswordDialogOpen(true)}
            >
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      {renderDeleteAccountDialog()}

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangePasswordDialogOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                className="bg-red-600 hover:bg-red-700"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Handle notification preference toggle
  const handleNotificationToggle = async (prefId: string, newCheckedState: boolean) => {
    const token = getApiToken();
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    // Map preference ID to API column name
    const columnMap: Record<string, 'is_booking_confirmation' | 'is_service_reminders' | 'report_uploads' | 'marketing_emails'> = {
      'booking': 'is_booking_confirmation',
      'reminder': 'is_service_reminders',
      'report': 'report_uploads',
      'marketing': 'marketing_emails',
    };

    const column = columnMap[prefId];
    if (!column) {
      console.error('Invalid preference ID:', prefId);
      return;
    }

    setUpdatingNotification(prefId);
    try {
      // Store current state before making API call
      const currentState = notificationPreferences ? { ...notificationPreferences } : null;
      console.log(`Toggling ${prefId} (${column}) to ${newCheckedState ? 'ON' : 'OFF'}. Current state:`, currentState);
      
      let response;
      if (newCheckedState) {
        // Toggle is being turned ON - call enable API
        response = await enableNotification({
          api_token: token,
          column: column,
        });
      } else {
        // Toggle is being turned OFF - call disable API
        response = await disableNotification({
          api_token: token,
          column: column,
        });
      }

      console.log(`API response for ${column}:`, response);

      if (response.success && response.data) {
        // Use functional update to only update the specific field that changed
        setNotificationPreferences((prevState) => {
          // Start with previous state or defaults
          const baseState: NotificationPreferencesData = prevState || {
            id: 0,
            is_booking_confirmation: 0,
            is_service_reminders: 0,
            report_uploads: 0,
            marketing_emails: 0,
            user_id: 0,
            created_at: '',
            updated_at: '',
          };

          // Helper function to normalize a single value
          const normalizeValue = (value: number | boolean | undefined, defaultValue: number): number => {
            if (value === undefined || value === null) return defaultValue;
            if (typeof value === 'boolean') return value ? 1 : 0;
            if (typeof value === 'number') return value;
            return defaultValue;
          };

          // Only update the specific field that was toggled, preserve all others from previous state
          const updatedState: NotificationPreferencesData = {
            ...baseState,
            id: response.data.id ?? baseState.id,
            user_id: response.data.user_id ?? baseState.user_id,
            created_at: response.data.created_at || baseState.created_at,
            updated_at: response.data.updated_at || baseState.updated_at,
            // Update only the field that was changed, use API response if available, otherwise keep previous state
            is_booking_confirmation: column === 'is_booking_confirmation' 
              ? normalizeValue(response.data.is_booking_confirmation, newCheckedState ? 1 : 0)
              : normalizeValue(response.data.is_booking_confirmation, baseState.is_booking_confirmation),
            is_service_reminders: column === 'is_service_reminders'
              ? normalizeValue(response.data.is_service_reminders, newCheckedState ? 1 : 0)
              : normalizeValue(response.data.is_service_reminders, baseState.is_service_reminders),
            report_uploads: column === 'report_uploads'
              ? normalizeValue(response.data.report_uploads, newCheckedState ? 1 : 0)
              : normalizeValue(response.data.report_uploads, baseState.report_uploads),
            marketing_emails: column === 'marketing_emails'
              ? normalizeValue(response.data.marketing_emails, newCheckedState ? 1 : 0)
              : normalizeValue(response.data.marketing_emails, baseState.marketing_emails),
          };

          console.log(`Updated ${column} to ${newCheckedState ? 'ON' : 'OFF'}`);
          console.log('Updated state:', {
            booking: updatedState.is_booking_confirmation,
            reminder: updatedState.is_service_reminders,
            report: updatedState.report_uploads,
            marketing: updatedState.marketing_emails,
          });

          return updatedState;
        });
        toast.success(response.message || "Notification preference updated successfully");
      } else {
        toast.error(response.message || "Failed to update notification preference");
      }
    } catch (error: any) {
      console.error("Error updating notification preference:", error);
      toast.error(error.message || "Failed to update notification preference. Please try again.");
    } finally {
      setUpdatingNotification(null);
    }
  };

  // Get notification preference value — must match stored 0/1 and API true/false
  const getNotificationValue = (prefId: string): boolean => {
    if (!notificationPreferences) {
      return false;
    }

    const valueMap: Record<string, keyof NotificationPreferencesData> = {
      'booking': 'is_booking_confirmation',
      'reminder': 'is_service_reminders',
      'report': 'report_uploads',
      'marketing': 'marketing_emails',
    };

    const key = valueMap[prefId];
    if (!key) {
      return false;
    }

    const value = notificationPreferences[key];
    
    // Handle number (0/1) - most common case after conversion
    if (typeof value === 'number') {
      return value === 1;
    }
    
    // Handle boolean
    if (typeof value === 'boolean') {
      return value;
    }
    
    // Fallback for any other type
    return value === 1 || value === true || String(value).toLowerCase() === 'true';
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    const token = getApiToken();
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await deleteAccount({ api_token: token });
      if (response.status === true) {
        toast.success(response.message || "Account deleted successfully");
        // Clear local storage and logout
        localStorage.clear();
        setTimeout(() => {
          onLogout();
        }, 1500);
      } else {
        toast.error(response.message || "Failed to delete account");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Format timestamp from ISO date string to relative time
  const formatTimestamp = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      } else {
        // Format as date if older than a week
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch (error) {
      return dateString;
    }
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your bookings and services.</p>
      </div>

      {isLoadingNotifications ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {notification.title || "Notification"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message || ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.created_at ? formatTimestamp(notification.created_at) : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No notifications yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  // Delete Account Confirmation Dialog
  const renderDeleteAccountDialog = () => (
    <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be undone. All your data, bookings, and payment history will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            This will permanently delete your account and all associated data. You will be logged out immediately after deletion.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteAccountDialogOpen(false)}
            disabled={isDeletingAccount}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeletingAccount}
          >
            {isDeletingAccount ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderContent = () => {
    // If on edit address route, show the edit address form
    if (isEditAddressRoute && addressIdToEdit) {
      if (isLoadingEditAddress) {
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600">Loading address...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBackToProfile}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#0A1A2F]">Edit Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditAddressSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="edit-tag" className="text-sm font-medium">
                    Address Name (Tag) <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="edit-tag"
                    value={editAddressForm.tag}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, tag: e.target.value })}
                    className="mt-2 h-11"
                    placeholder="e.g., Home, Office, Warehouse"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-adress_line" className="text-sm font-medium">
                    Address Line <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="edit-adress_line"
                    value={editAddressForm.adress_line}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, adress_line: e.target.value })}
                    className="mt-2 h-11"
                    placeholder="e.g., 123 Main Street, Rampura"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-city" className="text-sm font-medium">
                      City <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="edit-city"
                      value={editAddressForm.city}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, city: e.target.value })}
                      className="mt-2 h-11"
                      placeholder="e.g., Dhaka, London"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-postal_code" className="text-sm font-medium">
                      Postal Code <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="edit-postal_code"
                      value={editAddressForm.postal_code}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, postal_code: e.target.value })}
                      className="mt-2 h-11"
                      placeholder="e.g., 1205, SW1A 1AA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-country" className="text-sm font-medium">
                    Country <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="edit-country"
                    value={editAddressForm.country}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, country: e.target.value })}
                    className="mt-2 w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Wales">Wales</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editAddressForm.is_default_address}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, is_default_address: e.target.checked })}
                      className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Set as default address</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editAddressForm.is_favourite_address}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, is_favourite_address: e.target.checked })}
                      className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Mark as favourite address</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToProfile}
                    disabled={isUpdatingAddress}
                    className="h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 h-10"
                    disabled={isUpdatingAddress}
                  >
                    {isUpdatingAddress ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Address
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If on add address route, show the add address form
    if (isAddAddressRoute) {
      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBackToProfile}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#0A1A2F]">Add New Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAddressSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="tag" className="text-sm font-medium">
                    Address Name (Tag) <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="tag"
                    value={addAddressForm.tag}
                    onChange={(e) => setAddAddressForm({ ...addAddressForm, tag: e.target.value })}
                    className="mt-2 h-11"
                    placeholder="e.g., Home, Office, Warehouse"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="adress_line" className="text-sm font-medium">
                    Address Line <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="adress_line"
                    value={addAddressForm.adress_line}
                    onChange={(e) => setAddAddressForm({ ...addAddressForm, adress_line: e.target.value })}
                    className="mt-2 h-11"
                    placeholder="e.g., 123 Main Street, Rampura"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      City <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={addAddressForm.city}
                      onChange={(e) => setAddAddressForm({ ...addAddressForm, city: e.target.value })}
                      className="mt-2 h-11"
                      placeholder="e.g., Dhaka, London"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code" className="text-sm font-medium">
                      Postal Code <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="postal_code"
                      value={addAddressForm.postal_code}
                      onChange={(e) => setAddAddressForm({ ...addAddressForm, postal_code: e.target.value })}
                      className="mt-2 h-11"
                      placeholder="e.g., 1205, SW1A 1AA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="country"
                    value={addAddressForm.country}
                    onChange={(e) => setAddAddressForm({ ...addAddressForm, country: e.target.value })}
                    className="mt-2 w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Wales">Wales</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addAddressForm.is_default_address}
                      onChange={(e) => setAddAddressForm({ ...addAddressForm, is_default_address: e.target.checked })}
                      className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Set as default address</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addAddressForm.is_favourite_address}
                      onChange={(e) => setAddAddressForm({ ...addAddressForm, is_favourite_address: e.target.checked })}
                      className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Mark as favourite address</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToProfile}
                    disabled={isSubmittingAddress}
                    className="h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 h-10"
                    disabled={isSubmittingAddress}
                  >
                    {isSubmittingAddress ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Add Address
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }

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
        return renderProfile();
      case "settings":
        return renderSettings();
      case "notifications":
        return renderNotifications();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden w-full">
      {/* Top Header - Fixed height like admin dashboard */}
      <header className="bg-[#0A1A2F] text-white px-4 md:px-6 fixed top-0 left-0 right-0 z-50 w-full h-14 flex items-center">
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
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => {
                  startTransition(() => {
                    navigate("/");
                  });
                }}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Go to home"
              >
                <img src={logoImage} alt="Fire Guide" className="h-10 w-auto flex-shrink-0" />
              </button>
              <Badge variant="secondary" className="bg-red-600 text-white border-0 text-sm px-2 py-0.5 hidden md:inline-flex">
                Customer
              </Badge>
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

      <div className="flex pt-14 w-full overflow-x-hidden">
        {/* Sidebar - Fixed below header, full height like admin dashboard */}
        <aside
          className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-white border-r w-64 z-30 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 h-full flex flex-col overflow-y-auto">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <nav className="space-y-2 flex-1 mt-6 lg:mt-0">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.id === "notifications" && (
                      <Badge className="ml-auto bg-red-600 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                        {notifications.length}
                      </Badge>
                    )}
                  </button> 
                );
              })}
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

        {/* Spacer for fixed sidebar on large screens */}
        <div className="hidden lg:block w-64 flex-shrink-0"></div>

        {/* Main Content - Original layout, centered */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
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
    </div>
  );
}