import React, { useState, useEffect } from "react";
import { Flame, ChevronRight, Star, Award, Shield, Clock, MapPin, CheckCircle2, Phone, Mail, Calendar, ArrowLeft, Briefcase, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { fetchQualifications, QualificationCertificationResponse } from "../api/qualificationsService";
import { fetchInsuranceCoverages, InsuranceItem } from "../api/insuranceService";
import { fetchExperiences, ExperienceResponse } from "../api/experiencesService";
import { fetchReviews, ReviewResponse } from "../api/reviewsService";
import { toast } from "sonner";

interface ProfessionalProfileProps {
  professional: any;
  onBook: () => void;
  onBack: () => void;
}

export function ProfessionalProfile({ professional, onBook, onBack }: ProfessionalProfileProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [qualifications, setQualifications] = useState<QualificationCertificationResponse[]>([]);
  const [isLoadingQualifications, setIsLoadingQualifications] = useState(true);
  const [insuranceCoverage, setInsuranceCoverage] = useState<InsuranceItem[]>([]);
  const [isLoadingInsurance, setIsLoadingInsurance] = useState(true);
  const [experiences, setExperiences] = useState<ExperienceResponse[]>([]);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [persistedProfessional, setPersistedProfessional] = useState<any>(null);

  // Restore professional data from sessionStorage on mount if not provided in props
  useEffect(() => {
    if (!professional || !professional.name) {
      try {
        const stored = sessionStorage.getItem('fireguide_selected_professional');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setPersistedProfessional(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load professional from sessionStorage:', error);
      }
    }
  }, [professional]);

  // Fetch qualifications on component mount
  useEffect(() => {
    const loadQualifications = async () => {
      try {
        setIsLoadingQualifications(true);
        const data = await fetchQualifications();
        setQualifications(data);
      } catch (error: any) {
        console.error('Failed to load qualifications:', error);
        toast.error(error.message || 'Failed to load qualifications');
      } finally {
        setIsLoadingQualifications(false);
      }
    };

    loadQualifications();
  }, []);

  // Fetch insurance coverage on component mount
  useEffect(() => {
    const loadInsuranceCoverage = async () => {
      try {
        setIsLoadingInsurance(true);
        const data = await fetchInsuranceCoverages();
        setInsuranceCoverage(data);
      } catch (error: any) {
        console.error('Failed to load insurance coverage:', error);
        toast.error(error.message || 'Failed to load insurance coverage');
      } finally {
        setIsLoadingInsurance(false);
      }
    };

    loadInsuranceCoverage();
  }, []);

  // Fetch experiences on component mount
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setIsLoadingExperiences(true);
        const data = await fetchExperiences();
        setExperiences(data);
      } catch (error: any) {
        console.error('Failed to load experiences:', error);
        toast.error(error.message || 'Failed to load experiences');
      } finally {
        setIsLoadingExperiences(false);
      }
    };

    loadExperiences();
  }, []);

  // Fetch reviews on component mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const data = await fetchReviews();
        setReviews(data);
      } catch (error: any) {
        console.error('Failed to load reviews:', error);
        toast.error(error.message || 'Failed to load reviews');
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, []);

  // Provide default professional data with proper fallbacks
  const defaultData = {
    name: "John Smith",
    rating: 4.9,
    reviewCount: 127,
    responseTime: "Within 1 hour",
    location: "London, UK",
    distance: 5.2,
    verified: true,
    price: "£350",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    bio: "Experienced fire safety professional with over 15 years in the industry. Specializing in comprehensive fire risk assessments for commercial and residential properties. Committed to ensuring your property meets all fire safety regulations.",
    insurance: {
      publicLiability: "£5M",
      professionalIndemnity: "£2M",
      provider: "AXA Insurance",
      validUntil: "Dec 2025"
    },
    services: ["Fire Risk Assessment", "Fire Safety Training", "Fire Door Inspection"],
    experience: {
      yearsActive: 15,
      assessmentsCompleted: 500,
      specializations: ["Commercial Properties", "Residential Buildings", "Industrial Sites", "Educational Facilities"]
    }
  };

  // Map API qualifications to display format
  const mappedQualifications = qualifications.map((qual) => ({
    name: qual.title,
    year: qual.certification_date ? new Date(qual.certification_date).getFullYear().toString() : new Date(qual.created_at).getFullYear().toString(),
    id: qual.id,
    certificationDate: qual.certification_date
  }));

  // Map API insurance coverage to display format
  const getInsuranceData = () => {
    const publicLiability = insuranceCoverage.find(ins => ins.title === 'Public Liability');
    const professionalIndemnity = insuranceCoverage.find(ins => ins.title === 'Professional Indemnity');
    
    // Find the latest expire date for "Valid until"
    const allExpireDates = insuranceCoverage
      .map(ins => ins.expire_date)
      .filter(date => date)
      .sort()
      .reverse();
    const latestExpireDate = allExpireDates.length > 0 ? allExpireDates[0] : null;
    
    // Format expire date for display
    const formatExpireDate = (dateStr: string | null) => {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    };

    return {
      publicLiability: publicLiability ? `£${publicLiability.price}` : defaultData.insurance.publicLiability,
      professionalIndemnity: professionalIndemnity ? `£${professionalIndemnity.price}` : defaultData.insurance.professionalIndemnity,
      provider: defaultData.insurance.provider, // provider_id is null in API response
      validUntil: latestExpireDate ? formatExpireDate(latestExpireDate) : defaultData.insurance.validUntil
    };
  };

  // Get insurance data from API
  const insuranceData = getInsuranceData();

  // Map API experiences to display format
  const getExperienceData = () => {
    if (experiences.length === 0) {
      return defaultData.experience;
    }

    // Calculate years of experience from the earliest years_experience date
    const experienceDates = experiences
      .map(exp => exp.years_experience)
      .filter(date => date)
      .sort();
    
    const earliestDate = experienceDates.length > 0 ? new Date(experienceDates[0]) : null;
    let yearsActive = earliestDate 
      ? Math.max(1, Math.floor((new Date().getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 365)))
      : defaultData.experience.yearsActive;

    // Extract assessment count from assessment field
    // Handle formats like "500+ Assessments Completed" or "15+Years Experience"
    const extractAssessmentCount = (assessmentText: string): number => {
      // Check if it's an assessment count (contains "Assessment" or "Assessments")
      if (assessmentText.toLowerCase().includes('assessment')) {
        const match = assessmentText.match(/(\d+)\+/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return 0;
    };

    // Extract years from assessment field if it mentions years
    const extractYearsFromAssessment = (assessmentText: string): number | null => {
      // Check if it mentions years (e.g., "15+Years Experience")
      if (assessmentText.toLowerCase().includes('year')) {
        const match = assessmentText.match(/(\d+)\+?\s*year/i);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return null;
    };

    // Get the highest assessment count from all experiences
    const assessmentCounts = experiences
      .map(exp => extractAssessmentCount(exp.assessment))
      .filter(count => count > 0);
    const assessmentsCompleted = assessmentCounts.length > 0 
      ? Math.max(...assessmentCounts)
      : defaultData.experience.assessmentsCompleted;

    // Check if years are mentioned in assessment field and use the highest
    const yearsFromAssessment = experiences
      .map(exp => extractYearsFromAssessment(exp.assessment))
      .filter((years): years is number => years !== null);
    if (yearsFromAssessment.length > 0) {
      yearsActive = Math.max(yearsActive, Math.max(...yearsFromAssessment));
    }

    // Collect all unique specializations
    const specializationsSet = new Set<string>();
    experiences.forEach(exp => {
      if (exp.specialization?.title) {
        specializationsSet.add(exp.specialization.title);
      }
    });
    const specializations = specializationsSet.size > 0
      ? Array.from(specializationsSet)
      : defaultData.experience.specializations;

    return {
      yearsActive,
      assessmentsCompleted,
      specializations
    };
  };

  // Get experience data from API
  const experienceData = getExperienceData();

  // Resolve professional data: props > persisted state > sessionStorage > defaults
  const getResolvedProfessional = () => {
    // First, try props
    if (professional && professional.name) {
      return professional;
    }
    
    // Then, try persisted state (from useEffect)
    if (persistedProfessional && persistedProfessional.name) {
      return persistedProfessional;
    }
    
    // Then, try sessionStorage directly (fallback)
    try {
      const stored = sessionStorage.getItem('fireguide_selected_professional');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load professional from sessionStorage:', error);
    }
    
    // Fallback to defaults
    return null;
  };

  const resolvedProfessionalData = getResolvedProfessional();
  const professionalToUse = resolvedProfessionalData || professional || defaultData;

  // Merge professional data with defaults
  const prof = {
    ...defaultData,
    ...professionalToUse,
    // Only override defaults if we have actual professional data
    name: professionalToUse.name || defaultData.name,
    rating: professionalToUse.rating || defaultData.rating,
    reviewCount: professionalToUse.reviewCount || defaultData.reviewCount,
    responseTime: professionalToUse.responseTime || defaultData.responseTime,
    location: professionalToUse.location || defaultData.location,
    distance: professionalToUse.distance || defaultData.distance,
    verified: professionalToUse.verified !== undefined ? professionalToUse.verified : defaultData.verified,
    photo: professionalToUse.photo || defaultData.photo,
    bio: professionalToUse.bio || defaultData.bio,
    certifications: mappedQualifications.length > 0 ? mappedQualifications : (professionalToUse?.certifications || []),
    insurance: {
      publicLiability: insuranceData.publicLiability,
      professionalIndemnity: insuranceData.professionalIndemnity,
      provider: insuranceData.provider,
      validUntil: insuranceData.validUntil
    },
    experience: experienceData
  };

  // Map API reviews to display format
  const formatReviewDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const mappedReviews = reviews.map((review) => ({
    id: review.id,
    author: review.name,
    date: formatReviewDate(review.created_at),
    rating: parseFloat(review.rating) || 0,
    text: review.feedback
  }));

  // Calculate review count from API data
  const reviewCount = reviews.length > 0 ? reviews.length : prof.reviewCount;

  const pricing = [
    { service: "Small property (1-5 people)", price: "£250" },
    { service: "Medium property (6-25 people)", price: "£450" },
    { service: "Large property (26-100 people)", price: "£850" }
  ];

  const availableDates = [
    { date: "2025-11-21", slots: ["9:00 AM", "2:00 PM"] },
    { date: "2025-11-22", slots: ["10:00 AM", "3:00 PM"] },
    { date: "2025-11-25", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-[#0A1A2F] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Flame className="w-8 h-8 text-red-500" />
          <span className="text-xl">Fire Guide</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" className="hover:text-red-600 transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-red-600 transition-colors">Compare Professionals</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{prof.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative">
                      <img
                        src={prof.photo}
                        alt={prof.name}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      {prof.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h1 className="text-[#0A1A2F] mb-2">{prof.name}</h1>
                          {prof.verified && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-3">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified Professional
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {renderStars(prof.rating)}
                        <span className="text-sm">
                          <span className="font-semibold">{prof.rating}</span>
                          <span className="text-gray-500"> ({prof.reviewCount} reviews)</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{prof.location} • {prof.distance} miles</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-green-600">{prof.responseTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{prof.bio}</p>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Qualifications & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingQualifications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
                      <span className="text-gray-600">Loading qualifications...</span>
                    </div>
                  ) : prof.certifications.length > 0 ? (
                    <div className="space-y-3">
                      {prof.certifications.map((qual, index) => (
                        <div key={qual.id || index} className="flex items-start justify-between py-3 border-b last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{qual.name}</p>
                              <p className="text-sm text-gray-500">Certified {qual.year}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No qualifications available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Insurance Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingInsurance ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
                      <span className="text-gray-600">Loading insurance coverage...</span>
                    </div>
                  ) : insuranceCoverage.length > 0 ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Public Liability</p>
                          <p className="text-xl font-semibold text-gray-900">{prof.insurance.publicLiability}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Professional Indemnity</p>
                          <p className="text-xl font-semibold text-gray-900">{prof.insurance.professionalIndemnity}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Provider: {prof.insurance.provider}</span>
                        <span className="text-gray-600">Valid until: {prof.insurance.validUntil}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No insurance coverage available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingExperiences ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
                      <span className="text-gray-600">Loading experience data...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-3xl text-red-600 mb-1">{prof.experience.yearsActive}+</p>
                          <p className="text-sm text-gray-600">Years Experience</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-3xl text-red-600 mb-1">{prof.experience.assessmentsCompleted}+</p>
                          <p className="text-sm text-gray-600">Assessments Completed</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Specializations:</p>
                        {prof.experience.specializations.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {prof.experience.specializations.map((spec, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No specializations available</p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Reviews ({reviewCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingReviews ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
                      <span className="text-gray-600">Loading reviews...</span>
                    </div>
                  ) : mappedReviews.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {mappedReviews.map((review) => (
                          <div key={review.id} className="pb-4 border-b last:border-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{review.author}</p>
                                <p className="text-sm text-gray-500">{review.date}</p>
                              </div>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-700">{review.text}</p>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Reviews
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No reviews available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F]">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pricing.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="text-sm text-gray-700">{item.service}</span>
                          <span className="font-semibold text-gray-900">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Availability Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F]">Available Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {availableDates.map((dateInfo) => (
                        <div
                          key={dateInfo.date}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedDate === dateInfo.date
                              ? "border-red-600 bg-red-50"
                              : "border-gray-200 hover:border-red-300"
                          }`}
                          onClick={() => setSelectedDate(dateInfo.date)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              {formatDate(dateInfo.date)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {dateInfo.slots.length} slots
                            </Badge>
                          </div>
                          {selectedDate === dateInfo.date && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {dateInfo.slots.map((slot, index) => (
                                <button
                                  key={index}
                                  className="px-3 py-1 text-xs bg-white border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F]">Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Fire Risk Assessment</p>
              <p className="font-semibold text-gray-900">From £250</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 px-12 py-6 text-lg w-full md:w-auto" onClick={onBook}>
              Book & Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}