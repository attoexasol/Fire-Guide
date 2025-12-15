import { useState } from "react";
import { Flame, ChevronRight, Star, Award, Shield, Clock, MapPin, CheckCircle2, Phone, Mail, Calendar, ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface ProfessionalProfileProps {
  professional: any;
  onBook: () => void;
  onBack: () => void;
}

export function ProfessionalProfile({ professional, onBook, onBack }: ProfessionalProfileProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    certifications: [
      { name: "Fire Safety Diploma", year: "2020" },
      { name: "NEBOSH Certificate", year: "2019" },
      { name: "IOSH Managing Safely", year: "2018" }
    ],
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

  // Merge professional data with defaults
  const prof = {
    ...defaultData,
    ...professional,
    certifications: professional?.certifications || defaultData.certifications,
    insurance: {
      ...defaultData.insurance,
      ...(professional?.insurance || {})
    },
    experience: {
      ...defaultData.experience,
      ...(professional?.experience || {}),
      specializations: professional?.experience?.specializations || defaultData.experience.specializations
    }
  };

  // Mock data for demonstration
  const reviews = [
    {
      id: 1,
      author: "Sarah Thompson",
      date: "2 weeks ago",
      rating: 5,
      text: "Excellent service! Very thorough assessment and clear reporting. Highly recommended."
    },
    {
      id: 2,
      author: "Mark Johnson",
      date: "1 month ago",
      rating: 5,
      text: "Professional and knowledgeable. Made the whole process very easy."
    },
    {
      id: 3,
      author: "Emma Wilson",
      date: "2 months ago",
      rating: 4,
      text: "Great experience overall. Very detailed report and helpful recommendations."
    }
  ];

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
                  <div className="space-y-3">
                    {prof.certifications.map((qual, index) => (
                      <div key={index} className="flex items-start justify-between py-3 border-b last:border-0">
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
                    <div className="flex flex-wrap gap-2">
                      {prof.experience.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Reviews ({prof.reviewCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review) => (
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