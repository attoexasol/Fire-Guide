import React, { useState, useEffect, startTransition, useRef } from "react";
import { 
  User, 
  Save,
  CheckCircle2,
  Circle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  Award,
  Shield,
  Info,
  Upload,
  CheckSquare,
  Clock,
  XCircle,
  X,
  Eye,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { fetchServices, ServiceResponse } from "../api/servicesService";
import { uploadProfileImage, UploadProfileImageRequest } from "../api/authService";
import { getApiToken, getProfessionalId, setProfessionalId } from "../lib/auth";
import { createCertification } from "../api/qualificationsService";
import { createProfessional, CreateProfessionalRequest, fetchProfessionals, ProfessionalResponse, getSelectedServices, getProfileCompletionPercentage, ProfileCompletionDetails, getCertificates, CertificateItem } from "../api/professionalsService";
import { toast } from "sonner";

export function ProfessionalProfileContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    postcode: "",
    bio: "",
    serviceRadius: [50],
    emergencyCallout: true
  });

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [loadingProfessional, setLoadingProfessional] = useState(false);
  
  // Profile completion data from API
  const [profileCompletionDetails, setProfileCompletionDetails] = useState<ProfileCompletionDetails | null>(null);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState<number>(0);
  
  // Certificates from API
  const [certifications, setCertifications] = useState<CertificateItem[]>([]);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false); // Track if we've attempted to fetch data (i.e., professional_id exists)
  
  // Profile image upload states
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref to track if component is mounted (prevents state updates after unmount)
  const reloadProfileImageRef = useRef(true);

  // Certification form states
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [certificationFormData, setCertificationFormData] = useState({
    certificate_name: "",
    description: "",
    evidence: "",
    status: "pending"
  });
  const [selectedCertificationFile, setSelectedCertificationFile] = useState<File | null>(null);
  const [isSubmittingCertification, setIsSubmittingCertification] = useState(false);
  const certificationFileInputRef = useRef<HTMLInputElement>(null);

  // Load profile image from localStorage ONLY if professional_id exists
  // For new accounts (no professional_id), image should remain blank
  // This effect runs on mount and when professional_id changes
  useEffect(() => {
    let isMounted = true;
    
    const loadProfileImage = () => {
      const professionalId = getProfessionalId();
      
      // Only load image if professional_id exists (professional has been created)
      if (professionalId && !isNaN(professionalId)) {
        const storedImageUrl = localStorage.getItem('professional_profile_image');
        if (storedImageUrl && isMounted) {
          // Wrap in startTransition to prevent suspend during initial render
          startTransition(() => {
            if (isMounted) {
              setProfileImageUrl(storedImageUrl);
            }
          });
        } else if (isMounted) {
          // Ensure image is blank if no stored image exists
          startTransition(() => {
            if (isMounted) {
              setProfileImageUrl(null);
            }
          });
        }
      } else if (isMounted) {
        // New account - ensure image is blank
        startTransition(() => {
          if (isMounted) {
            setProfileImageUrl(null);
          }
        });
      }
    };
    
    loadProfileImage();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Only run on mount - professional_id changes handled in handleSaveProfile

  // Effect to manage reloadProfileImageRef lifecycle
  useEffect(() => {
    reloadProfileImageRef.current = true;
    return () => {
      reloadProfileImageRef.current = false;
    };
  }, []);

  // Helper function to reload profile image when professional_id becomes available
  // Uses a ref to track if component is still mounted
  
  const reloadProfileImage = () => {
    // Check if component is still mounted before updating state
    if (!reloadProfileImageRef.current) {
      return;
    }
    
    const professionalId = getProfessionalId();
    if (professionalId && !isNaN(professionalId)) {
      const storedImageUrl = localStorage.getItem('professional_profile_image');
      if (storedImageUrl) {
        startTransition(() => {
          if (reloadProfileImageRef.current) {
            setProfileImageUrl(storedImageUrl);
          }
        });
      } else {
        startTransition(() => {
          if (reloadProfileImageRef.current) {
            setProfileImageUrl(null);
          }
        });
      }
    } else {
      startTransition(() => {
        if (reloadProfileImageRef.current) {
          setProfileImageUrl(null);
        }
      });
    }
  };

  // Fetch services from API on component mount
  useEffect(() => {
    let isMounted = true;
  
    const loadServices = async () => {
      // Set loading state synchronously
      setLoadingServices(true);
      setServicesError(null);
      
      try {
        const fetchedServices = await fetchServices();
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Filter only ACTIVE services
          const activeServices = fetchedServices.filter(service => service.status === "ACTIVE");
          
          // Wrap state updates in startTransition to prevent suspend during render
          startTransition(() => {
            setServices(activeServices);
            setLoadingServices(false);
          });
        }
      } catch (error) {
        console.error("Error loading services:", error);
        
        // Only update state if component is still mounted
        if (isMounted) {
          startTransition(() => {
            setServicesError("Failed to load services. Please try again later.");
            setLoadingServices(false);
          });
        }
      }
    };

    loadServices();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to fetch selected services for a professional
  const fetchSelectedServicesForProfessional = async (profId: number) => {
    try {
      const token = getApiToken();
      const response = await getSelectedServices({
        professional_id: profId,
        api_token: token || undefined
      });

      if (response.status === true && response.data) {
        // Extract service_id values from the response
        const serviceIds = response.data.map(item => item.service_id);
        startTransition(() => {
          setSelectedServices(serviceIds);
        });
      } else {
        console.error('Failed to fetch selected services:', response.error || response.message);
        // Don't show error toast as this is not critical
      }
    } catch (error: any) {
      console.error('Error fetching selected services:', error);
      // Don't show error toast as this is not critical
    }
  };

  // Function to fetch profile completion percentage for a professional
  const fetchProfileCompletion = async (profId: number) => {
    try {
      const token = getApiToken();
      const response = await getProfileCompletionPercentage({
        professional_id: profId,
        api_token: token || undefined
      });

      if (response.status === true && response.details && response.profile_completion_percentage !== undefined) {
        startTransition(() => {
          setProfileCompletionDetails(response.details || null);
          setProfileCompletionPercentage(response.profile_completion_percentage || 0);
        });
      } else {
        console.error('Failed to fetch profile completion:', response.error || response.message);
        // Don't show error toast as this is not critical
      }
    } catch (error: any) {
      console.error('Error fetching profile completion:', error);
      // Don't show error toast as this is not critical
    }
  };

  // Helper function to format ISO date to readable format
  const formatDate = (isoDateString: string): string => {
    try {
      const date = new Date(isoDateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return isoDateString;
    }
  };

  // Function to fetch certificates for a professional
  const fetchProfessionalCertificates = async (profId: number) => {
    try {
      setLoadingCertifications(true);
      setHasAttemptedFetch(true); // Mark that we've attempted to fetch
      const token = getApiToken();
      const response = await getCertificates({
        professional_id: profId,
        api_token: token || undefined
      });

      if (response.status === true && response.data) {
        startTransition(() => {
          setCertifications(response.data || []);
        });
      } else {
        console.error('Failed to fetch certificates:', response.error || response.message);
        setCertifications([]);
      }
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      setCertifications([]);
    } finally {
      setLoadingCertifications(false);
    }
  };

  // Function to fetch professional data by ID
  const fetchProfessionalData = async (professionalId: number) => {
    try {
      setLoadingProfessional(true);
      setHasAttemptedFetch(true); // Mark that we've attempted to fetch data (professional_id exists)
      
      // Fetch all professionals (the API returns professionals for the authenticated user)
      const professionals = await fetchProfessionals(1);
      
      if (!professionals || professionals.length === 0) {
        setLoadingProfessional(false);
        return;
      }
      
      // Find the professional that matches the professional_id
      const currentProfessional = professionals.find(prof => prof.id === professionalId);
      
      if (currentProfessional) {
        // Populate form data with fetched professional data
        startTransition(() => {
          setFormData(prev => ({
            ...prev,
            name: currentProfessional.name || prev.name,
            email: currentProfessional.email || prev.email,
            phone: currentProfessional.number || prev.phone,
            businessName: currentProfessional.business_name || prev.businessName,
            address: currentProfessional.business_location || prev.address,
            postcode: currentProfessional.post_code || prev.postcode,
            bio: currentProfessional.about || prev.bio,
          }));
          setLoadingProfessional(false);
        });

        // Fetch selected services, profile completion, and certificates for this professional
        fetchSelectedServicesForProfessional(professionalId);
        fetchProfileCompletion(professionalId);
        fetchProfessionalCertificates(professionalId);
      } else {
        setLoadingProfessional(false);
      }
    } catch (error) {
      console.error("Error loading professional data:", error);
      setLoadingProfessional(false);
      // Don't show error toast as this is not critical - user can still edit form
    }
  };

  // Fetch professional data on mount ONLY if professional_id exists
  useEffect(() => {
    let isMounted = true;
    
    const loadProfessionalData = async () => {
      // Get professional_id from auth (using the standard function)
      const professionalId = getProfessionalId();

      // Only fetch data if professional_id exists
      // If no professional_id exists, keep UI blank (form fields remain with default/empty values)
      if (!professionalId || isNaN(professionalId)) {
        if (isMounted) {
          setLoadingProfessional(false);
        }
        return;
      }

      // Professional exists - fetch and display data
      if (isMounted) {
        await fetchProfessionalData(professionalId);
      }
    };

    loadProfessionalData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle profile image upload
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

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to upload profile image.");
      return;
    }

    // Check if component is still mounted before proceeding
    if (!reloadProfileImageRef.current) {
      return;
    }

    // Set loading state synchronously (immediate feedback)
    setIsUploadingImage(true);
    
    try {
      const uploadData: UploadProfileImageRequest = {
        api_token: token,
        file: file
      };

      const response = await uploadProfileImage(uploadData);

      // Check if component is still mounted before updating state
      if (!reloadProfileImageRef.current) {
        return;
      }

      if (response.status === true || response.image_url) {
        const imageUrl = response.image_url || "";
        
        // Wrap state updates in startTransition to prevent suspend during render
        startTransition(() => {
          if (reloadProfileImageRef.current) {
            setProfileImageUrl(imageUrl);
            setIsUploadingImage(false);
          }
        });
        
        // Store in localStorage to persist across sessions (synchronous, safe)
        // Only store if component is still mounted
        if (reloadProfileImageRef.current) {
          localStorage.setItem('professional_profile_image', imageUrl);
          toast.success(response.message || "Profile image updated successfully!");
        }
      } else {
        startTransition(() => {
          if (reloadProfileImageRef.current) {
            setIsUploadingImage(false);
          }
        });
        if (reloadProfileImageRef.current) {
          toast.error(response.message || response.error || "Failed to upload profile image. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      
      // Check if component is still mounted before showing error
      if (!reloadProfileImageRef.current) {
        return;
      }
      
      const errorMessage = error?.message || error?.error || "An error occurred while uploading the image. Please try again.";
      
      // Wrap state updates in startTransition
      startTransition(() => {
        if (reloadProfileImageRef.current) {
          setIsUploadingImage(false);
        }
      });
      
      toast.error(errorMessage);
    } finally {
      // Reset file input (synchronous, safe)
      if (fileInputRef.current && reloadProfileImageRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle certification form
  const handleOpenCertificationForm = () => {
    setShowCertificationForm(true);
  };

  const handleCloseCertificationForm = () => {
    setShowCertificationForm(false);
    // Reset form data
    setCertificationFormData({
      certificate_name: "",
      description: "",
      evidence: "",
      status: "pending"
    });
    setSelectedCertificationFile(null);
    if (certificationFileInputRef.current) {
      certificationFileInputRef.current.value = "";
    }
  };

  const handleCertificationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (allow PDF, images, and common document formats)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, image, or document file.");
        if (certificationFileInputRef.current) {
          certificationFileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 10MB.");
        if (certificationFileInputRef.current) {
          certificationFileInputRef.current.value = '';
        }
        return;
      }

      setSelectedCertificationFile(file);
      setCertificationFormData({ ...certificationFormData, evidence: file.name });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64String = result.split(',')[1] || result;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCertificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!certificationFormData.certificate_name.trim()) {
      toast.error("Please enter a certificate name");
      return;
    }

    if (!certificationFormData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!certificationFormData.evidence && !selectedCertificationFile) {
      toast.error("Please upload evidence file");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to create a certification.");
      return;
    }

    setIsSubmittingCertification(true);
    try {
      // Convert file to base64 if a file is selected
      let evidenceValue = certificationFormData.evidence;
      if (selectedCertificationFile) {
        try {
          evidenceValue = await convertFileToBase64(selectedCertificationFile);
        } catch (fileError) {
          console.error("Error converting file to base64:", fileError);
          toast.error("Error processing file. Please try again.");
          setIsSubmittingCertification(false);
          return;
        }
      }

      // Get professional_id for backward compatibility (optional)
      const professionalId = getProfessionalId();

      const response = await createCertification({
        api_token: token,
        certificate_name: certificationFormData.certificate_name.trim(),
        description: certificationFormData.description.trim(),
        evidence: evidenceValue,
        status: certificationFormData.status,
        // Optional fields for backward compatibility
        ...(professionalId && { professional_id: professionalId }),
        title: certificationFormData.certificate_name.trim(), // Also send as title for API compatibility
        certification_date: new Date().toISOString().split('T')[0]
      });

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        toast.success(response.message || "Certification created successfully!");
        // Close form and reset
        handleCloseCertificationForm();
        
        // Refresh certifications list after successful creation
        // Only refresh if professional_id exists
        const professionalId = getProfessionalId();
        
        if (professionalId && !isNaN(professionalId)) {
          fetchProfessionalCertificates(professionalId);
          // Also refresh profile completion to update the percentage
          fetchProfileCompletion(professionalId);
        }
      } else {
        toast.error(response.message || response.error || "Failed to create certification. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating certification:", error);
      const errorMessage = error?.message || error?.error || "An error occurred while creating certification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmittingCertification(false);
    }
  };

  const handleSaveProfile = async () => {
    // Validate required fields from Basic Information
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.businessName.trim()) {
      toast.error("Please enter your business name");
      return;
    }
    if (!formData.bio.trim()) {
      toast.error("Please enter your professional bio");
      return;
    }

    // Validate required fields from Contact Information
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your business address");
      return;
    }
    if (!formData.postcode.trim()) {
      toast.error("Please enter your postcode");
      return;
    }

    // Validate services selection
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to save your profile.");
      return;
    }

    try {
      // Prepare services array
      const services = selectedServices.map(serviceId => ({
        service_id: serviceId
      }));

      // Prepare certification data if form has data
      let certificationData: {
        certificate_name?: string;
        description?: string;
        evidence?: string;
        status?: string;
      } = {};

      if (certificationFormData.certificate_name.trim() || 
          certificationFormData.description.trim() || 
          certificationFormData.evidence || 
          selectedCertificationFile) {
        
        // Validate certification fields if any are filled
        if (!certificationFormData.certificate_name.trim()) {
          toast.error("Please enter certificate name");
          return;
        }
        if (!certificationFormData.description.trim()) {
          toast.error("Please enter certificate description");
          return;
        }
        if (!certificationFormData.evidence && !selectedCertificationFile) {
          toast.error("Please upload evidence file");
          return;
        }

        // Use filename instead of base64-encoded content
        // The API expects just the filename, not the file content
        let evidenceValue = certificationFormData.evidence;
        if (selectedCertificationFile) {
          // Send just the filename as the API expects
          evidenceValue = selectedCertificationFile.name;
        }

        certificationData = {
          certificate_name: certificationFormData.certificate_name.trim(),
          description: certificationFormData.description.trim(),
          evidence: evidenceValue,
          status: certificationFormData.status || "pending"
        };
      }

      // Build request payload according to API specification
      const requestPayload: any = {
        api_token: token,
        name: formData.name.trim(),
        business_name: formData.businessName.trim(),
        about: formData.bio.trim(),
        email: formData.email.trim(),
        number: formData.phone.trim(),
        business_location: formData.address.trim(),
        post_code: formData.postcode.trim(),
        services: services,
        ...certificationData
      };

      // Call API
      const response = await createProfessional(requestPayload);

      // Check for success: status can be true (boolean) or "success" (string)
      const isSuccess = response.status === true || 
                        response.status === "success" || 
                        response.success === true ||
                        (response.message && !response.error && response.status !== false);

      if (isSuccess) {
        toast.success(response.message || "Profile saved successfully!");
        
        // Extract professional_id from the response and store it
        const profIdFromResponse = response.data?.professional?.id;
        
        if (profIdFromResponse && !isNaN(profIdFromResponse)) {
          // Store professional_id in localStorage for future use
          setProfessionalId(profIdFromResponse);
          
          // Reload profile image in case one was uploaded before saving
          reloadProfileImage();
          
          // Refresh profile completion percentage, selected services, and certificates
          fetchProfileCompletion(profIdFromResponse);
          fetchSelectedServicesForProfessional(profIdFromResponse);
          fetchProfessionalCertificates(profIdFromResponse);
          
          // Also fetch and populate professional data
          fetchProfessionalData(profIdFromResponse);
        }
        
        // Optionally reset form or close certification form
        if (showCertificationForm) {
          handleCloseCertificationForm();
        }
      } else {
        toast.error(response.message || response.error || "Failed to save profile. Please try again.");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      const errorMessage = error?.message || error?.error || "An error occurred while saving your profile. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Calculate completion steps based on API data
  const completionSteps = [
    { 
      id: 1, 
      title: "Basic Information", 
      completed: profileCompletionDetails ? profileCompletionDetails.basic_info === 20 : false 
    },
    { 
      id: 2, 
      title: "Contact Details", 
      completed: profileCompletionDetails ? profileCompletionDetails.contact_info === 20 : false 
    },
    { 
      id: 3, 
      title: "Service Selection", 
      completed: profileCompletionDetails ? profileCompletionDetails.selected_services === 20 : false 
    },
    { 
      id: 4, 
      title: "Certifications", 
      completed: profileCompletionDetails ? profileCompletionDetails.certificates === 20 : false 
    },
    { 
      id: 5, 
      title: "Profile Photo", 
      completed: profileCompletionDetails ? profileCompletionDetails.profile_image === 20 : !!profileImageUrl 
    },
  ];

  // Use API percentage if available, otherwise calculate from steps
  const completionPercentage = profileCompletionPercentage > 0 
    ? profileCompletionPercentage 
    : (completionSteps.filter(s => s.completed).length / completionSteps.length) * 100;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[#0A1A2F] mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Tell customers about your services and experience
        </p>
      </div>

      {/* Profile Completion Progress */}
      <Card className="mb-6 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Profile Completion</h3>
            <span className="text-sm font-semibold text-blue-600">{completionPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {completionSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 text-sm">
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={step.completed ? "text-gray-900" : "text-gray-500"}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal and business details visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input 
                    id="businessName" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea 
                  id="bio"
                  rows={4}
                  placeholder="Describe your experience, qualifications, and what makes your service unique..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How customers and Fire Guide can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input 
                  id="phone" 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address *
                </Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input 
                  id="postcode" 
                  value={formData.postcode}
                  onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Services Offered */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-red-600" />
                Services Offered
              </CardTitle>
              <CardDescription>
                Select all services you can provide
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingServices ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading services...</p>
                </div>
              ) : servicesError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">{servicesError}</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No services available</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-start gap-3 p-4 border rounded-lg hover:border-red-200 hover:bg-red-50/50 transition-all">
                      <Checkbox 
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedServices([...selectedServices, service.id]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={`service-${service.id}`} className="font-medium text-gray-900 cursor-pointer block mb-1">
                          {service.service_name}
                        </label>
                        {service.description && (
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {service.type && (
                            <span className="px-2 py-1 bg-gray-100 rounded">{service.type}</span>
                          )}
                          {service.price && (
                            <span className="font-semibold text-red-600">£{service.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Area */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Service Area
              </CardTitle>
              <CardDescription>
                Define how far you're willing to travel for jobs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Service Radius</Label>
                  <span className="text-sm font-semibold text-red-600">
                    {formData.serviceRadius[0]} miles
                  </span>
                </div>
                <Slider 
                  value={formData.serviceRadius}
                  onValueChange={(value) => setFormData({...formData, serviceRadius: value})}
                  min={5}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5 miles</span>
                  <span>100 miles</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox 
                  id="emergencyCallout"
                  checked={formData.emergencyCallout}
                  onCheckedChange={(checked) => setFormData({...formData, emergencyCallout: checked as boolean})}
                />
                <div className="flex-1">
                  <label htmlFor="emergencyCallout" className="font-medium text-gray-900 cursor-pointer block mb-1">
                    Available for Emergency Callouts
                  </label>
                  <p className="text-sm text-gray-600">
                    Get priority bookings for urgent fire safety issues
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                Certifications & Qualifications
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-2">
                Upload your certificates. An admin will review and mark them as Verified, Pending, or Rejected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingCertifications ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Loading certifications...</p>
                </div>
              ) : certifications.length > 0 ? (
                certifications.map((cert) => (
                  <div 
                    key={cert.id} 
                    className={`p-4 border rounded-lg ${
                      cert.status === 'verified' ? 'bg-green-50 border-green-200' :
                      cert.status === 'pending' ? 'bg-amber-50 border-amber-200' :
                      'bg-red-50 border-red-200'
                    }`}
                  >
                    {/* Header with title and status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{cert.name}</h4>
                        
                        {/* Evidence Info Row */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Evidence: <span className="text-gray-700">{cert.evidence}</span> (1 file)
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 -mr-2"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="ml-3 flex-shrink-0">
                        {cert.status === 'verified' && (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {cert.status === 'pending' && (
                          <Badge className="bg-amber-500 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending verification
                          </Badge>
                        )}
                        {cert.status === 'rejected' && (
                          <Badge className="bg-red-600 text-white">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Additional info based on status */}
                    {cert.status === 'verified' && cert.updated_at && (
                      <p className="text-xs text-green-700">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        Verified on {formatDate(cert.updated_at)}
                      </p>
                    )}
                    {cert.status === 'pending' && (
                      <p className="text-xs text-amber-700">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Uploaded {formatDate(cert.created_at)} - Awaiting admin review
                      </p>
                    )}
                    {cert.status === 'rejected' && cert.updated_at && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded">
                        <p className="text-xs text-red-900 flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span><strong>Rejected on:</strong> {formatDate(cert.updated_at)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : hasAttemptedFetch ? (
                // Only show "no certifications" message if we've attempted to fetch (i.e., professional_id exists)
                <div className="text-center py-8">
                  <p className="text-gray-500">No certifications found. Upload one to get started!</p>
                </div>
              ) : (
                // If no professional_id exists, show blank UI (no certifications displayed)
                null
              )}

              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={handleOpenCertificationForm}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Certification
              </Button>

              {/* Inline Certification Form */}
              {showCertificationForm && (
                <Card className="mt-6 border-2 border-red-200 shadow-lg">
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle>Add New Certification</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCloseCertificationForm}
                        className="h-8 w-8 hover:bg-gray-100"
                        aria-label="Close form"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCertificationSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="certificate_name">Certificate Name *</Label>
                        <Input
                          id="certificate_name"
                          value={certificationFormData.certificate_name}
                          onChange={(e) => setCertificationFormData({ ...certificationFormData, certificate_name: e.target.value })}
                          placeholder="e.g., Fire Risk Assessment Level 4, NEBOSH Fire Safety"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cert_description">Description *</Label>
                        <Textarea
                          id="cert_description"
                          value={certificationFormData.description}
                          onChange={(e) => setCertificationFormData({ ...certificationFormData, description: e.target.value })}
                          placeholder="Enter a detailed description of the certification..."
                          className="min-h-[120px]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cert_evidence">Evidence (File Upload) *</Label>
                        <Input
                          ref={certificationFileInputRef}
                          id="cert_evidence"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                          onChange={handleCertificationFileChange}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          required={!certificationFormData.evidence}
                        />
                        {selectedCertificationFile && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{selectedCertificationFile.name}</p>
                              <p className="text-xs text-gray-500">{(selectedCertificationFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCertificationFile(null);
                                setCertificationFormData({ ...certificationFormData, evidence: "" });
                                if (certificationFileInputRef.current) {
                                  certificationFileInputRef.current.value = '';
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Accepted formats: PDF, JPG, PNG, GIF, DOC, DOCX (Max size: 10MB)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cert_status">Status *</Label>
                        <select
                          id="cert_status"
                          value={certificationFormData.status}
                          onChange={(e) => setCertificationFormData({ ...certificationFormData, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                   
                    </form>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column on desktop */}
        <div className="space-y-6">
          {/* Profile Preview */}
          <Card className="border-0 shadow-md sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Profile Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div 
                  className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleImageClick}
                >
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleImageClick}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : profileImageUrl ? (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{formData.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{formData.businessName}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.postcode}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold text-gray-900">{selectedServices.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Service Radius</span>
                  <span className="font-semibold text-gray-900">{formData.serviceRadius[0]} mi</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Certifications</span>
                  <span className="font-semibold text-gray-900">
                    {hasAttemptedFetch ? certifications.length : 0}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 mb-1">
                      Complete Your Profile
                    </p>
                    <p className="text-sm text-yellow-800">
                      Add a photo and more certifications to increase booking chances
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-0 shadow-md bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Profile Tips</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Complete profiles get 3x more bookings</li>
                    <li>• Add a professional photo</li>
                    <li>• List all your certifications</li>
                    <li>• Write a detailed bio</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button - Fixed at bottom on mobile, inline on desktop */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg mt-6 p-4 lg:static lg:border-0 lg:shadow-none lg:mt-6">
        <div className="flex flex-col md:flex-row gap-3 max-w-7xl mx-auto">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 h-12"
            onClick={handleSaveProfile}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile Changes
          </Button>
          <Button variant="outline" className="md:w-auto h-12">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}