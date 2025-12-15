import { useState } from "react";
import { Flame, ChevronRight, MapPin, Star, CheckCircle, Shield, Award, Briefcase, Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";

interface Professional {
  id: number;
  name: string;
  photo: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  price: number;
  distance: number;
  nextAvailable: string;
  qualifications: string[];
  responseTime: string;
}

interface ComparisonResultsProps {
  onViewProfile: (professional: Professional) => void;
  onBack: () => void;
}

export function ComparisonResults({ onViewProfile, onBack }: ComparisonResultsProps) {
  const [sortBy, setSortBy] = useState("recommended");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [filterDistance, setFilterDistance] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [availableToday, setAvailableToday] = useState(false);

  const professionals: Professional[] = [
    {
      id: 1,
      name: "Sarah Mitchell",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      verified: true,
      rating: 4.9,
      reviewCount: 127,
      price: 285,
      distance: 2.3,
      nextAvailable: "Tomorrow, 10:00 AM",
      qualifications: ["NEBOSH", "Fire Safety Level 4", "15+ Years"],
      responseTime: "Responds within 1 hour"
    },
    {
      id: 2,
      name: "James Patterson",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      verified: true,
      rating: 4.8,
      reviewCount: 94,
      price: 250,
      distance: 4.1,
      nextAvailable: "Today, 2:00 PM",
      qualifications: ["IOSH Certified", "Fire Safety Level 3", "10+ Years"],
      responseTime: "Responds within 2 hours"
    },
    {
      id: 3,
      name: "David Chen",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      verified: true,
      rating: 4.7,
      reviewCount: 156,
      price: 295,
      distance: 3.8,
      nextAvailable: "Wed, 9:00 AM",
      qualifications: ["NEBOSH", "IOSH", "Risk Assessment Expert"],
      responseTime: "Responds within 30 mins"
    },
    {
      id: 4,
      name: "Emma Thompson",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      verified: true,
      rating: 4.9,
      reviewCount: 203,
      price: 320,
      distance: 5.2,
      nextAvailable: "Tomorrow, 1:00 PM",
      qualifications: ["NEBOSH Diploma", "Fire Safety Level 4", "20+ Years"],
      responseTime: "Responds within 1 hour"
    },
    {
      id: 5,
      name: "Michael Brown",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      verified: false,
      rating: 4.6,
      reviewCount: 67,
      price: 225,
      distance: 6.7,
      nextAvailable: "Thu, 10:30 AM",
      qualifications: ["Fire Safety Level 3", "5+ Years"],
      responseTime: "Responds within 3 hours"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      verified: true,
      rating: 4.8,
      reviewCount: 89,
      price: 275,
      distance: 7.1,
      nextAvailable: "Tomorrow, 3:00 PM",
      qualifications: ["IOSH Certified", "Fire Safety Level 4", "12+ Years"],
      responseTime: "Responds within 2 hours"
    }
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

  // Filter professionals
  const filteredProfessionals = professionals.filter((professional) => {
    // Verified filter
    if (verifiedOnly && !professional.verified) return false;

    // Available today filter
    if (availableToday && !professional.nextAvailable.toLowerCase().includes("today")) return false;

    // Price filter
    if (filterPrice !== "all") {
      if (filterPrice === "0-250" && professional.price > 250) return false;
      if (filterPrice === "250-300" && (professional.price < 250 || professional.price > 300)) return false;
      if (filterPrice === "300+" && professional.price < 300) return false;
    }

    // Rating filter
    if (filterRating !== "all") {
      const minRating = parseFloat(filterRating);
      if (professional.rating < minRating) return false;
    }

    // Distance filter
    if (filterDistance !== "all") {
      const maxDistance = parseFloat(filterDistance);
      if (professional.distance > maxDistance) return false;
    }

    return true;
  });

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return a.distance - b.distance;
      case "recommended":
      default:
        // Recommended is a combination of rating, reviews, and distance
        const scoreA = (a.rating * 10) + (a.reviewCount / 10) - (a.distance * 2);
        const scoreB = (b.rating * 10) + (b.reviewCount / 10) - (b.distance * 2);
        return scoreB - scoreA;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0A1A2F] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Flame className="w-8 h-8 text-red-500" />
          <span className="text-xl">Fire Guide</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" className="hover:text-red-600 transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-red-600 transition-colors">Select Service</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Compare Professionals</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white py-6 px-6 border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[#0A1A2F] mb-2">Fire Risk Assessment Professionals</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>SW1A 1AA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Office Building, 26-50 people</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Needed by: Dec 15, 2025</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              Change Details
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                    <h3 className="text-[#0A1A2F]">Filters</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Sort by</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recommended">Recommended</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="distance">Nearest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Price Range</label>
                      <Select value={filterPrice} onValueChange={setFilterPrice}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-250">£0 - £250</SelectItem>
                          <SelectItem value="250-300">£250 - £300</SelectItem>
                          <SelectItem value="300+">£300+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Minimum Rating</label>
                      <Select value={filterRating} onValueChange={setFilterRating}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="4.7">4.7+ Stars</SelectItem>
                          <SelectItem value="4.9">4.9+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Distance Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Maximum Distance</label>
                      <Select value={filterDistance} onValueChange={setFilterDistance}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Distance</SelectItem>
                          <SelectItem value="5">Within 5 miles</SelectItem>
                          <SelectItem value="10">Within 10 miles</SelectItem>
                          <SelectItem value="15">Within 15 miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} />
                        <span>Verified only</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm mt-3">
                        <input type="checkbox" className="rounded" checked={availableToday} onChange={() => setAvailableToday(!availableToday)} />
                        <span>Available today</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{sortedProfessionals.length} professionals</span> found
                </p>
              </div>

              {sortedProfessionals.map((professional) => (
                <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={professional.photo}
                            alt={professional.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          {professional.verified && (
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-[#0A1A2F]">{professional.name}</h3>
                              {professional.verified && (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              {renderStars(professional.rating)}
                              <span className="text-sm">
                                <span className="font-semibold">{professional.rating}</span>
                                <span className="text-gray-500"> ({professional.reviewCount} reviews)</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{professional.responseTime}</p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">From</div>
                            <div className="text-3xl text-[#0A1A2F]">£{professional.price}</div>
                            <div className="text-sm text-gray-500">per assessment</div>
                          </div>
                        </div>

                        {/* Qualifications */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {professional.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Award className="w-3 h-3 mr-1" />
                              {qual}
                            </Badge>
                          ))}
                        </div>

                        {/* Bottom Info */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{professional.distance} miles away</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium text-green-600">{professional.nextAvailable}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => onViewProfile(professional)}>
                              View Profile
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 flex-1 md:flex-none" onClick={() => onViewProfile(professional)}>
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}